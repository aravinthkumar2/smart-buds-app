import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Gamepad2, 
  Star, 
  Trophy,
  Zap,
  Target,
  Play
} from "lucide-react";
import { useState } from "react";
import { WordMatchingGame } from "./games/WordMatchingGame";
import { NumberPuzzleGame } from "./games/NumberPuzzleGame";
import { ColorMemoryGame } from "./games/ColorMemoryGame";
import { ShapeBuilderGame } from "./games/ShapeBuilderGame";
import { StoryQuestGame } from "./games/StoryQuestGame";
import { MusicRhythmGame } from "./games/MusicRhythmGame";

interface GameModuleProps {
  onBack: () => void;
}

export const GameModule = ({ onBack }: GameModuleProps) => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [score, setScore] = useState(150);
  const [streak, setStreak] = useState(5);
  const [gameScores, setGameScores] = useState<Record<string, number>>({
    'word-match': 95,
    'number-puzzle': 87,
    'music-rhythm': 92
  });

  const games = [
    {
      id: 'word-match',
      title: 'Word Matching',
      description: 'Match words with pictures',
      emoji: '📝',
      difficulty: 'Easy',
      points: 50,
      completed: true,
      bestScore: 95,
    },
    {
      id: 'number-puzzle',
      title: 'Number Puzzles',
      description: 'Solve fun math puzzles',
      emoji: '🔢',
      difficulty: 'Medium',
      points: 75,
      completed: true,
      bestScore: 87,
    },
    {
      id: 'color-game',
      title: 'Color Memory',
      description: 'Remember the color patterns',
      emoji: '🎨',
      difficulty: 'Easy',
      points: 40,
      completed: false,
      bestScore: 0,
    },
    {
      id: 'shape-builder',
      title: 'Shape Builder',
      description: 'Build objects with shapes',
      emoji: '🔵',
      difficulty: 'Hard',
      points: 100,
      completed: false,
      bestScore: 0,
    },
    {
      id: 'story-quest',
      title: 'Story Quest',
      description: 'Interactive story adventure',
      emoji: '📚',
      difficulty: 'Medium',
      points: 80,
      completed: false,
      bestScore: 0,
    },
    {
      id: 'music-rhythm',
      title: 'Music Rhythm',
      description: 'Tap to the beat of music',
      emoji: '🎵',
      difficulty: 'Easy',
      points: 60,
      completed: true,
      bestScore: 92,
    },
  ];

  const startGame = (gameId: string) => {
    setSelectedGame(gameId);
  };

  const handleGameComplete = (gameScore: number) => {
    setGameScores(prev => ({ ...prev, [selectedGame!]: gameScore }));
    setScore(score + Math.floor(gameScore / 4));
    setStreak(gameScore >= 80 ? streak + 1 : 1);
    
    // Update game completion status
    const gameIndex = games.findIndex(g => g.id === selectedGame);
    if (gameIndex !== -1) {
      games[gameIndex].completed = true;
      games[gameIndex].bestScore = Math.max(games[gameIndex].bestScore, gameScore);
    }
    
    setSelectedGame(null);
  };

  const handleGameExit = () => {
    setSelectedGame(null);
  };

  if (selectedGame) {
    switch (selectedGame) {
      case 'word-match':
        return <WordMatchingGame onComplete={handleGameComplete} onExit={handleGameExit} />;
      case 'number-puzzle':
        return <NumberPuzzleGame onComplete={handleGameComplete} onExit={handleGameExit} />;
      case 'color-game':
        return <ColorMemoryGame onComplete={handleGameComplete} onExit={handleGameExit} />;
      case 'shape-builder':
        return <ShapeBuilderGame onComplete={handleGameComplete} onExit={handleGameExit} />;
      case 'story-quest':
        return <StoryQuestGame onComplete={handleGameComplete} onExit={handleGameExit} />;
      case 'music-rhythm':
        return <MusicRhythmGame onComplete={handleGameComplete} onExit={handleGameExit} />;
      default:
        // Fallback for other games
        const game = games.find(g => g.id === selectedGame);
        return (
          <div className="min-h-screen bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center p-4">
            <Card className="w-full max-w-md text-center">
              <CardContent className="p-8">
                <div className="text-6xl mb-4">{game?.emoji}</div>
                <h2 className="text-2xl font-fredoka text-foreground mb-4">
                  {game?.title}
                </h2>
                <p className="text-muted-foreground mb-6">Coming soon! This game is being developed.</p>
                <Button onClick={handleGameExit} variant="kid">
                  Back to Games
                </Button>
              </CardContent>
            </Card>
          </div>
        );
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <h1 className="text-xl font-fredoka text-foreground">Learning Games</h1>
        <div className="w-16" />
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-accent flex items-center justify-center">
                <Star className="w-6 h-6 text-accent-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Total Score</p>
              <p className="text-xl font-fredoka text-foreground">{score}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-primary flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Streak</p>
              <p className="text-xl font-fredoka text-foreground">{streak}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-success flex items-center justify-center">
                <Trophy className="w-6 h-6 text-success-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Level</p>
              <p className="text-xl font-fredoka text-foreground">3</p>
            </CardContent>
          </Card>
        </div>

        {/* Games Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-fredoka text-foreground">Choose Your Game</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {games.map((game) => (
              <Card 
                key={game.id}
                className="card-interactive cursor-pointer hover:shadow-lg"
                onClick={() => startGame(game.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="text-3xl">{game.emoji}</div>
                    <div className="flex gap-2">
                      <Badge 
                        variant={game.difficulty === 'Easy' ? 'secondary' : 
                               game.difficulty === 'Medium' ? 'default' : 'destructive'}
                      >
                        {game.difficulty}
                      </Badge>
                      {game.completed && (
                        <Badge variant="outline" className="bg-success text-success-foreground">
                          ✓ Done
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-lg font-fredoka text-foreground">
                    {game.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {game.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">
                        +{game.points} points
                      </span>
                    </div>
                    {game.bestScore > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-accent" />
                        <span className="text-foreground font-medium">
                          Best: {game.bestScore}%
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    variant="kid" 
                    size="sm" 
                    className="w-full mt-4"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {game.completed ? 'Play Again' : 'Start Game'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Daily Challenge */}
        <Card className="bg-gradient-to-r from-magic/20 to-reward/20 border-magic/20">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-fredoka text-foreground mb-2">
              🎯 Daily Challenge
            </h3>
            <p className="text-muted-foreground mb-4">
              Complete 3 games to unlock a special reward!
            </p>
            <Progress value={67} className="max-w-xs mx-auto h-3 mb-2" />
            <p className="text-sm text-muted-foreground">2 out of 3 games completed</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};