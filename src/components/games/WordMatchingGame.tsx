import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, X, RotateCcw } from "lucide-react";

interface WordMatchingGameProps {
  onComplete: (score: number) => void;
  onExit: () => void;
}

export const WordMatchingGame = ({ onComplete, onExit }: WordMatchingGameProps) => {
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [matches, setMatches] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  const gameData = [
    { word: "Apple", image: "🍎", id: "apple" },
    { word: "Car", image: "🚗", id: "car" },
    { word: "House", image: "🏠", id: "house" },
    { word: "Cat", image: "🐱", id: "cat" },
    { word: "Tree", image: "🌳", id: "tree" },
    { word: "Sun", image: "☀️", id: "sun" }
  ];

  const [shuffledWords, setShuffledWords] = useState<typeof gameData>([]);
  const [shuffledImages, setShuffledImages] = useState<typeof gameData>([]);

  useEffect(() => {
    // Shuffle arrays
    const wordsShuffled = [...gameData].sort(() => Math.random() - 0.5);
    const imagesShuffled = [...gameData].sort(() => Math.random() - 0.5);
    setShuffledWords(wordsShuffled);
    setShuffledImages(imagesShuffled);
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
      onComplete(Math.round((score / gameData.length) * 100));
    }
  }, [timeLeft, gameOver, score, onComplete]);

  const handleWordClick = (wordId: string) => {
    if (matches.includes(wordId)) return;
    setSelectedWord(wordId);
    
    if (selectedImage === wordId) {
      // Match found!
      setMatches([...matches, wordId]);
      setScore(score + 1);
      setSelectedWord(null);
      setSelectedImage(null);
      
      if (matches.length + 1 === gameData.length) {
        setGameOver(true);
        onComplete(100);
      }
    } else if (selectedImage) {
      // Wrong match
      setTimeout(() => {
        setSelectedWord(null);
        setSelectedImage(null);
      }, 1000);
    }
  };

  const handleImageClick = (imageId: string) => {
    if (matches.includes(imageId)) return;
    setSelectedImage(imageId);
    
    if (selectedWord === imageId) {
      // Match found!
      setMatches([...matches, imageId]);
      setScore(score + 1);
      setSelectedWord(null);
      setSelectedImage(null);
      
      if (matches.length + 1 === gameData.length) {
        setGameOver(true);
        onComplete(100);
      }
    } else if (selectedWord) {
      // Wrong match
      setTimeout(() => {
        setSelectedWord(null);
        setSelectedImage(null);
      }, 1000);
    }
  };

  const resetGame = () => {
    setScore(0);
    setCurrentRound(0);
    setSelectedWord(null);
    setSelectedImage(null);
    setMatches([]);
    setGameOver(false);
    setTimeLeft(60);
    const wordsShuffled = [...gameData].sort(() => Math.random() - 0.5);
    const imagesShuffled = [...gameData].sort(() => Math.random() - 0.5);
    setShuffledWords(wordsShuffled);
    setShuffledImages(imagesShuffled);
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-fredoka text-foreground mb-4">Game Complete!</h2>
            <div className="space-y-2 mb-6">
              <p className="text-lg text-foreground">Score: {score}/{gameData.length}</p>
              <p className="text-sm text-muted-foreground">
                {score === gameData.length ? "Perfect! All matches correct!" : 
                 score >= gameData.length * 0.8 ? "Great job! Well done!" :
                 "Good try! Practice makes perfect!"}
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
          <h1 className="text-xl font-fredoka text-foreground">Word Matching</h1>
          <p className="text-sm text-muted-foreground">Match words with pictures</p>
        </div>
        <div className="text-right">
          <Badge variant="outline">{timeLeft}s</Badge>
          <p className="text-sm text-muted-foreground">Score: {score}/{gameData.length}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Words Column */}
          <div>
            <h3 className="text-lg font-fredoka text-foreground mb-4 text-center">Words</h3>
            <div className="space-y-3">
              {shuffledWords.map((item) => (
                <Card 
                  key={item.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    matches.includes(item.id) 
                      ? 'bg-success/20 border-success' 
                      : selectedWord === item.id 
                      ? 'bg-primary/20 border-primary' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => handleWordClick(item.id)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {matches.includes(item.id) && (
                        <CheckCircle className="w-5 h-5 text-success" />
                      )}
                      <span className="text-lg font-fredoka text-foreground">
                        {item.word}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Images Column */}
          <div>
            <h3 className="text-lg font-fredoka text-foreground mb-4 text-center">Pictures</h3>
            <div className="space-y-3">
              {shuffledImages.map((item) => (
                <Card 
                  key={item.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    matches.includes(item.id) 
                      ? 'bg-success/20 border-success' 
                      : selectedImage === item.id 
                      ? 'bg-primary/20 border-primary' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => handleImageClick(item.id)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {matches.includes(item.id) && (
                        <CheckCircle className="w-5 h-5 text-success" />
                      )}
                      <span className="text-4xl">
                        {item.image}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};