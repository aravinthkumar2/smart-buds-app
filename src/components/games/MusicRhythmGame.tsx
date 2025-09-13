import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Music, Play, Pause, RotateCw, Star, Trophy } from "lucide-react";

interface MusicRhythmGameProps {
  onComplete: (score: number) => void;
  onExit: () => void;
}

interface Note {
  id: string;
  lane: number;
  timing: number;
  hit: boolean;
  missed: boolean;
}

interface Song {
  name: string;
  bpm: number;
  pattern: number[][];
  emoji: string;
}

export const MusicRhythmGame = ({ onComplete, onExit }: MusicRhythmGameProps) => {
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentSong, setCurrentSong] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [accuracy, setAccuracy] = useState(100);
  const [hitNotes, setHitNotes] = useState(0);
  const [totalNotes, setTotalNotes] = useState(0);

  const gameRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  const songs: Song[] = [
    {
      name: "Happy Melody",
      bpm: 120,
      emoji: "😊",
      pattern: [
        [1, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 1, 0],
        [0, 1, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 1]
      ]
    },
    {
      name: "Bouncy Beat",
      bpm: 140,
      emoji: "🎵",
      pattern: [
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 1, 0, 0, 1, 1, 0, 0],
        [0, 0, 1, 1, 0, 0, 1, 1]
      ]
    },
    {
      name: "Peaceful Song",
      bpm: 90,
      emoji: "🎼",
      pattern: [
        [1, 0, 0, 1, 0, 0, 1, 0],
        [0, 1, 0, 0, 1, 0, 0, 1],
        [0, 0, 1, 0, 0, 1, 0, 0],
        [1, 0, 0, 0, 1, 0, 0, 0]
      ]
    }
  ];

  const currentSongData = songs[currentSong];
  const beatInterval = 60000 / currentSongData.bpm; // milliseconds per beat

  useEffect(() => {
    if (isPlaying) {
      const startTime = Date.now() - gameTime;
      
      const gameLoop = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        setGameTime(elapsed);
        
        // Spawn notes based on pattern
        const currentBeat = Math.floor(elapsed / beatInterval);
        const patternIndex = currentBeat % currentSongData.pattern[0].length;
        
        // Check if we need to spawn notes for this beat
        currentSongData.pattern.forEach((lane, laneIndex) => {
          if (lane[patternIndex] === 1) {
            const noteId = `${currentBeat}-${laneIndex}`;
            setNotes(prev => {
              // Only add if note doesn't already exist
              if (!prev.find(n => n.id === noteId)) {
                return [...prev, {
                  id: noteId,
                  lane: laneIndex,
                  timing: elapsed + 2000, // 2 seconds to reach hit zone
                  hit: false,
                  missed: false
                }];
              }
              return prev;
            });
          }
        });

        // Update note positions and check for misses
        setNotes(prev => prev.map(note => {
          if (!note.hit && !note.missed && elapsed > note.timing + 200) {
            setCombo(0);
            return { ...note, missed: true };
          }
          return note;
        }));

        // Remove old notes
        setNotes(prev => prev.filter(note => 
          elapsed < note.timing + 1000
        ));

        // End game after song completes
        if (elapsed > currentSongData.pattern[0].length * beatInterval + 2000) {
          setIsPlaying(false);
          setGameOver(true);
        } else {
          animationRef.current = requestAnimationFrame(gameLoop);
        }
      };
      
      animationRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, beatInterval, currentSongData.pattern]);

  const startGame = () => {
    setGameTime(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setNotes([]);
    setHitNotes(0);
    setTotalNotes(currentSongData.pattern.flat().filter(note => note === 1).length);
    setIsPlaying(true);
    setGameOver(false);
  };

  const pauseGame = () => {
    setIsPlaying(!isPlaying);
  };

  const hitNote = (laneIndex: number) => {
    const hitZoneStart = gameTime;
    const hitZoneEnd = gameTime + 100;
    
    const noteToHit = notes.find(note => 
      note.lane === laneIndex && 
      !note.hit && 
      !note.missed &&
      Math.abs(gameTime - note.timing) < 200
    );

    if (noteToHit) {
      const timingDiff = Math.abs(gameTime - noteToHit.timing);
      let points = 0;
      
      if (timingDiff < 50) {
        points = 100; // Perfect
      } else if (timingDiff < 100) {
        points = 75; // Great
      } else if (timingDiff < 150) {
        points = 50; // Good
      } else {
        points = 25; // OK
      }

      setScore(prev => prev + points * (1 + combo * 0.1));
      setCombo(prev => {
        const newCombo = prev + 1;
        setMaxCombo(current => Math.max(current, newCombo));
        return newCombo;
      });
      setHitNotes(prev => prev + 1);

      setNotes(prev => prev.map(note => 
        note.id === noteToHit.id ? { ...note, hit: true } : note
      ));
    } else {
      setCombo(0);
    }
  };

  const resetGame = () => {
    setGameOver(false);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setGameTime(0);
    setNotes([]);
    setIsPlaying(false);
    setHitNotes(0);
    setTotalNotes(0);
    setAccuracy(100);
  };

  const nextSong = () => {
    setCurrentSong((prev) => (prev + 1) % songs.length);
    resetGame();
  };

  useEffect(() => {
    if (totalNotes > 0) {
      setAccuracy(Math.round((hitNotes / totalNotes) * 100));
    }
  }, [hitNotes, totalNotes]);

  if (gameOver) {
    const finalScore = Math.min(100, score / 10);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="text-6xl mb-4">🎵</div>
            <CardTitle className="text-2xl font-fredoka text-foreground">
              Great Performance!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Star className="w-5 h-5 text-accent" />
                <span className="text-lg font-fredoka">Score: {Math.round(finalScore)}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                <span className="text-lg font-fredoka">Max Combo: {maxCombo}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Accuracy: {accuracy}% ({hitNotes}/{totalNotes})
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={nextSong} variant="kid" className="flex-1">
                Next Song
              </Button>
              <Button onClick={() => onComplete(finalScore)} variant="outline" className="flex-1">
                Continue
              </Button>
            </div>
            
            <Button onClick={onExit} variant="ghost" className="w-full">
              Back to Games
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const notePosition = (note: Note) => {
    const progress = (gameTime - (note.timing - 2000)) / 2000;
    return Math.max(0, Math.min(100, progress * 100));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={onExit}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="text-center">
          <h1 className="text-xl font-fredoka text-foreground">Music Rhythm</h1>
          <p className="text-sm text-muted-foreground">
            {currentSongData.emoji} {currentSongData.name}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Score: {Math.round(score)}</p>
          <p className="text-sm text-muted-foreground">Combo: {combo}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Game Controls */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-4">
              {!isPlaying && !gameOver && (
                <Button onClick={startGame} variant="kid">
                  <Play className="w-4 h-4 mr-2" />
                  Start
                </Button>
              )}
              {isPlaying && (
                <Button onClick={pauseGame} variant="outline">
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
              )}
              <Button onClick={resetGame} variant="outline">
                <RotateCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Game Area */}
        <Card className="relative">
          <CardContent className="p-0">
            <div 
              ref={gameRef}
              className="relative h-96 bg-gradient-to-b from-background to-secondary/20 overflow-hidden"
            >
              {/* Hit Zone */}
              <div className="absolute bottom-16 left-0 right-0 h-12 bg-primary/20 border-y-2 border-primary" />
              
              {/* Lanes */}
              <div className="absolute inset-0 grid grid-cols-4 gap-1 p-2">
                {[0, 1, 2, 3].map((laneIndex) => (
                  <div
                    key={laneIndex}
                    className="relative border-l border-r border-border bg-background/30"
                  >
                    {/* Notes in this lane */}
                    {notes
                      .filter(note => note.lane === laneIndex)
                      .map(note => (
                        <div
                          key={note.id}
                          className={`absolute w-full h-8 rounded transition-all ${
                            note.hit 
                              ? 'bg-green-500 opacity-50' 
                              : note.missed 
                              ? 'bg-red-500 opacity-50'
                              : 'bg-primary shadow-lg'
                          }`}
                          style={{
                            top: `${100 - notePosition(note)}%`,
                            transform: 'translateY(-50%)'
                          }}
                        />
                      ))}
                    
                    {/* Hit Button */}
                    <Button
                      className="absolute bottom-2 left-1 right-1 h-12"
                      variant="outline"
                      onClick={() => hitNote(laneIndex)}
                      disabled={!isPlaying}
                    >
                      <Music className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-sm text-muted-foreground mb-1">Accuracy</div>
              <div className="text-xl font-fredoka text-foreground">{accuracy}%</div>
              <Progress value={accuracy} className="mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-sm text-muted-foreground mb-1">Progress</div>
              <div className="text-xl font-fredoka text-foreground">
                {Math.round((gameTime / (currentSongData.pattern[0].length * beatInterval)) * 100)}%
              </div>
              <Progress 
                value={(gameTime / (currentSongData.pattern[0].length * beatInterval + 2000)) * 100} 
                className="mt-2" 
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};