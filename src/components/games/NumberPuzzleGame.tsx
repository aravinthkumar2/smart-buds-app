import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, X, RotateCcw, Plus, Minus, Equal } from "lucide-react";

interface NumberPuzzleGameProps {
  onComplete: (score: number) => void;
  onExit: () => void;
}

export const NumberPuzzleGame = ({ onComplete, onExit }: NumberPuzzleGameProps) => {
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [gameOver, setGameOver] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const questions = [
    { num1: 5, num2: 3, operator: '+', answer: 8, options: [6, 7, 8, 9] },
    { num1: 10, num2: 4, operator: '-', answer: 6, options: [4, 5, 6, 7] },
    { num1: 7, num2: 2, operator: '+', answer: 9, options: [8, 9, 10, 11] },
    { num1: 15, num2: 8, operator: '-', answer: 7, options: [6, 7, 8, 9] },
    { num1: 6, num2: 4, operator: '+', answer: 10, options: [9, 10, 11, 12] },
    { num1: 12, num2: 5, operator: '-', answer: 7, options: [6, 7, 8, 9] },
  ];

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
      onComplete(Math.round((score / questions.length) * 100));
    }
  }, [timeLeft, gameOver, score, onComplete, questions.length]);

  const handleAnswerSelect = (answer: number) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);
    
    if (answer === questions[currentQuestion].answer) {
      setScore(score + 1);
    }
    
    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        setGameOver(true);
        onComplete(Math.round((score + (answer === questions[currentQuestion].answer ? 1 : 0)) / questions.length * 100));
      }
    }, 1500);
  };

  const resetGame = () => {
    setScore(0);
    setCurrentQuestion(0);
    setTimeLeft(120);
    setGameOver(false);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  const renderOperator = (operator: string) => {
    switch (operator) {
      case '+':
        return <Plus className="w-8 h-8 text-success" />;
      case '-':
        return <Minus className="w-8 h-8 text-warning" />;
      default:
        return <Equal className="w-8 h-8 text-primary" />;
    }
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="text-6xl mb-4">🧮</div>
            <h2 className="text-2xl font-fredoka text-foreground mb-4">Math Complete!</h2>
            <div className="space-y-2 mb-6">
              <p className="text-lg text-foreground">Score: {score}/{questions.length}</p>
              <p className="text-sm text-muted-foreground">
                {score === questions.length ? "Perfect math wizard!" : 
                 score >= questions.length * 0.8 ? "Great calculating!" :
                 "Keep practicing those math skills!"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={resetGame} variant="outline" className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
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

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 to-accent/20 p-4">
      {/* Game Header */}
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={onExit}>
          <X className="w-4 h-4 mr-2" />
          Exit
        </Button>
        <div className="text-center">
          <h1 className="text-xl font-fredoka text-foreground">Number Puzzles</h1>
          <p className="text-sm text-muted-foreground">Question {currentQuestion + 1} of {questions.length}</p>
        </div>
        <div className="text-right">
          <Badge variant="outline">{timeLeft}s</Badge>
          <p className="text-sm text-muted-foreground">Score: {score}/{questions.length}</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-8">
        {/* Question Display */}
        <Card className="bg-card">
          <CardContent className="p-8">
            <div className="flex items-center justify-center gap-6 text-4xl font-fredoka">
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                {question.num1}
              </div>
              {renderOperator(question.operator)}
              <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center text-accent-foreground">
                {question.num2}
              </div>
              <Equal className="w-8 h-8 text-muted-foreground" />
              <div className="w-20 h-20 rounded-full bg-muted border-2 border-dashed border-muted-foreground flex items-center justify-center text-muted-foreground">
                ?
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Answer Options */}
        <div className="grid grid-cols-2 gap-4">
          {question.options.map((option, index) => (
            <Card 
              key={index}
              className={`cursor-pointer transition-all duration-200 ${
                showFeedback
                  ? option === question.answer
                    ? 'bg-success/20 border-success'
                    : selectedAnswer === option
                    ? 'bg-destructive/20 border-destructive'
                    : ''
                  : selectedAnswer === option
                  ? 'bg-primary/20 border-primary'
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => !showFeedback && handleAnswerSelect(option)}
            >
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center gap-2">
                  {showFeedback && option === question.answer && (
                    <CheckCircle className="w-6 h-6 text-success" />
                  )}
                  {showFeedback && selectedAnswer === option && option !== question.answer && (
                    <X className="w-6 h-6 text-destructive" />
                  )}
                  <span className="text-2xl font-fredoka text-foreground">
                    {option}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <Card className={`text-center ${
            selectedAnswer === question.answer 
              ? 'bg-success/20 border-success' 
              : 'bg-destructive/20 border-destructive'
          }`}>
            <CardContent className="p-4">
              <p className="text-lg font-fredoka">
                {selectedAnswer === question.answer 
                  ? "🎉 Correct! Well done!" 
                  : `❌ The answer is ${question.answer}. Keep trying!`}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};