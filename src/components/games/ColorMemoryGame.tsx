import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, RotateCcw, Play } from "lucide-react";

interface ColorMemoryGameProps {
  onComplete: (score: number) => void;
  onExit: () => void;
}

export const ColorMemoryGame = ({ onComplete, onExit }: ColorMemoryGameProps) => {
  const [gameState, setGameState] = useState<'ready' | 'showing' | 'guessing' | 'feedback' | 'complete'>('ready');
  const [sequence, setSequence] = useState<string[]>([]);
  const [playerSequence, setPlayerSequence] = useState<string[]>([]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [showingIndex, setShowingIndex] = useState(0);

  const colors = [
    { id: 'red', color: 'bg-red-400', name: 'Red' },
    { id: 'blue', color: 'bg-blue-400', name: 'Blue' },
    { id: 'green', color: 'bg-green-400', name: 'Green' },
    { id: 'yellow', color: 'bg-yellow-400', name: 'Yellow' },
    { id: 'purple', color: 'bg-purple-400', name: 'Purple' },
    { id: 'pink', color: 'bg-pink-400', name: 'Pink' }
  ];

  const generateSequence = (length: number) => {
    const newSequence = [];
    for (let i = 0; i < length; i++) {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      newSequence.push(randomColor.id);
    }
    return newSequence;
  };

  const startLevel = () => {
    const newSequence = generateSequence(currentLevel + 2);
    setSequence(newSequence);
    setPlayerSequence([]);
    setShowingIndex(0);
    setGameState('showing');
  };

  useEffect(() => {
    if (gameState === 'showing' && showingIndex < sequence.length) {
      const timer = setTimeout(() => {
        setShowingIndex(showingIndex + 1);
      }, 800);
      return () => clearTimeout(timer);
    } else if (gameState === 'showing' && showingIndex >= sequence.length) {
      setTimeout(() => {
        setGameState('guessing');
      }, 500);
    }
  }, [gameState, showingIndex, sequence.length]);

  const handleColorClick = (colorId: string) => {
    if (gameState !== 'guessing') return;

    const newPlayerSequence = [...playerSequence, colorId];
    setPlayerSequence(newPlayerSequence);

    // Check if current guess is correct
    if (colorId !== sequence[playerSequence.length]) {
      // Wrong color
      setGameState('feedback');
      setTimeout(() => {
        onComplete(score);
      }, 2000);
      return;
    }

    // Check if sequence is complete
    if (newPlayerSequence.length === sequence.length) {
      // Level complete!
      setScore(score + currentLevel * 10);
      setGameState('feedback');
      
      setTimeout(() => {
        if (currentLevel >= 5) {
          // Game complete
          setGameState('complete');
        } else {
          // Next level
          setCurrentLevel(currentLevel + 1);
          setGameState('ready');
        }
      }, 1500);
    }
  };

  const resetGame = () => {
    setGameState('ready');
    setSequence([]);
    setPlayerSequence([]);
    setCurrentLevel(1);
    setScore(0);
    setShowingIndex(0);
  };

  if (gameState === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="text-6xl mb-4">🌈</div>
            <h2 className="text-2xl font-fredoka text-foreground mb-4">Amazing Memory!</h2>
            <div className="space-y-2 mb-6">
              <p className="text-lg text-foreground">Final Score: {score}</p>
              <p className="text-sm text-muted-foreground">
                You completed all 5 levels! Your memory is fantastic!
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={resetGame} variant="outline" className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" />
                Play Again
              </Button>
              <Button onClick={onExit} variant="kid" className="flex-1">
                Finish
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 to-accent/20 p-4">
      {/* Game Header */}
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={onExit}>
          <X className="w-4 h-4 mr-2" />
          Exit
        </Button>
        <div className="text-center">
          <h1 className="text-xl font-fredoka text-foreground">Color Memory</h1>
          <p className="text-sm text-muted-foreground">Level {currentLevel} of 5</p>
        </div>
        <div className="text-right">
          <Badge variant="outline">Score: {score}</Badge>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Instructions */}
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-fredoka text-foreground mb-2">
              {gameState === 'ready' && "Get ready to memorize the sequence!"}
              {gameState === 'showing' && "Watch carefully..."}
              {gameState === 'guessing' && "Now repeat the sequence!"}
              {gameState === 'feedback' && (
                playerSequence.length === sequence.length 
                  ? "🎉 Perfect! Next level!" 
                  : "❌ Oops! Game over!"
              )}
            </h3>
            {gameState === 'ready' && (
              <Button onClick={startLevel} variant="kid" size="lg">
                <Play className="w-5 h-5 mr-2" />
                Start Level {currentLevel}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Color Grid */}
        <div className="grid grid-cols-3 gap-4">
          {colors.map((color, index) => (
            <Card
              key={color.id}
              className={`aspect-square cursor-pointer transition-all duration-300 ${
                gameState === 'showing' && showingIndex > sequence.indexOf(color.id) && sequence[showingIndex - 1] === color.id
                  ? 'ring-4 ring-white scale-110 shadow-lg'
                  : gameState === 'guessing'
                  ? 'hover:scale-105 hover:shadow-lg'
                  : ''
              }`}
              onClick={() => handleColorClick(color.id)}
            >
              <CardContent className={`p-4 h-full ${color.color} rounded-lg flex items-center justify-center`}>
                <span className="text-white font-fredoka text-lg drop-shadow-lg">
                  {color.name}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Progress Indicators */}
        {gameState === 'guessing' && (
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-center space-x-2">
                {sequence.map((colorId, index) => (
                  <div
                    key={index}
                    className={`w-6 h-6 rounded-full border-2 ${
                      index < playerSequence.length
                        ? playerSequence[index] === colorId
                          ? 'bg-success border-success'
                          : 'bg-destructive border-destructive'
                        : 'bg-muted border-muted-foreground'
                    }`}
                  />
                ))}
              </div>
              <p className="text-center text-sm text-muted-foreground mt-2">
                {playerSequence.length} of {sequence.length} colors
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};