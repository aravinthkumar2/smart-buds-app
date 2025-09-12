import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { VoiceReader } from "@/components/VoiceReader";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  ArrowLeft, 
  Volume2, 
  Play, 
  Pause, 
  RotateCcw, 
  Settings,
  Star,
  CheckCircle
} from "lucide-react";

interface ReadingModuleProps {
  onBack: () => void;
}

export const ReadingModule = ({ onBack }: ReadingModuleProps) => {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [readingSpeed, setReadingSpeed] = useState('normal');
  const [fontSize, setFontSize] = useState('large');

  const story = {
    title: "The Friendly Dragon",
    content: [
      "Once", "upon", "a", "time,", "there", "lived", "a", "friendly", "dragon", 
      "named", "Spark.", "Spark", "loved", "to", "help", "children", "learn", 
      "new", "words", "and", "read", "exciting", "stories."
    ],
    totalWords: 23,
  };

  const questions = [
    {
      question: "What was the dragon's name?",
      options: ["Flame", "Spark", "Fire", "Blaze"],
      correct: 1,
    },
    {
      question: "What did the dragon love to do?",
      options: ["Sleep", "Fly", "Help children learn", "Eat"],
      correct: 2,
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying && currentWordIndex < story.content.length - 1) {
      // Simulate word highlighting
      const interval = setInterval(() => {
        setCurrentWordIndex((prev) => {
          if (prev >= story.content.length - 1) {
            setIsPlaying(false);
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 500);
    }
  };

  const handleReset = () => {
    setCurrentWordIndex(0);
    setIsPlaying(false);
  };

  const handleFinishReading = () => {
    setShowQuiz(true);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    if (answerIndex === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        // Quiz completed
        setTimeout(() => {
          alert(`Great job! You scored ${score + (answerIndex === questions[currentQuestion].correct ? 1 : 0)} out of ${questions.length}!`);
        }, 1000);
      }
    }, 1500);
  };

  if (showQuiz) {
    return (
      <div className="min-h-screen p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button variant="outline" onClick={onBack} className="mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </div>

          <Card className="bg-gradient-to-br from-magic/10 to-primary/10">
            <CardHeader>
              <CardTitle className="text-2xl font-fredoka text-center">
                Story Quiz Time! 🧠
              </CardTitle>
              <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-3" />
            </CardHeader>
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold mb-6 text-foreground font-fredoka">
                  {questions[currentQuestion].question}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {questions[currentQuestion].options.map((option, index) => (
                    <Button
                      key={index}
                      variant={selectedAnswer === index ? 
                        (index === questions[currentQuestion].correct ? "success" : "destructive") : 
                        "outline"
                      }
                      size="lg"
                      onClick={() => handleAnswerSelect(index)}
                      disabled={selectedAnswer !== null}
                      className="p-4 h-auto text-left justify-start"
                    >
                      {selectedAnswer === index && index === questions[currentQuestion].correct && (
                        <CheckCircle className="w-5 h-5 mr-2" />
                      )}
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>

        {/* Story Header */}
        <Card className="mb-6 bg-gradient-to-r from-primary/10 to-accent/10">
          <CardHeader>
            <CardTitle className="text-2xl font-fredoka text-center flex items-center justify-center gap-2">
              <Star className="w-6 h-6 text-yellow-500" />
              {story.title}
              <Star className="w-6 h-6 text-yellow-500" />
            </CardTitle>
            <Progress value={(currentWordIndex / story.totalWords) * 100} className="h-3" />
            <p className="text-center text-sm text-muted-foreground">
              Word {currentWordIndex + 1} of {story.totalWords}
            </p>
          </CardHeader>
        </Card>

        {/* Reading Area */}
        <Card className="mb-6">
          <CardContent className="p-8">
            <div 
              className={`text-center leading-relaxed ${
                fontSize === 'large' ? 'text-2xl' : fontSize === 'xl' ? 'text-3xl' : 'text-xl'
              } font-inter`}
            >
              {story.content.map((word, index) => (
                <span
                  key={index}
                  className={`mr-2 py-1 px-1 rounded transition-all duration-300 ${
                    index === currentWordIndex 
                      ? 'bg-primary text-primary-foreground font-semibold scale-110' 
                      : index < currentWordIndex 
                      ? 'text-muted-foreground' 
                      : 'text-foreground'
                  }`}
                >
                  {word}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
          <Button variant="kid" size="lg" onClick={handlePlayPause}>
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          
          <Button variant="outline" size="lg" onClick={handleReset}>
            <RotateCcw className="w-5 h-5" />
            Start Over
          </Button>
          
          <Button variant="outline" size="lg">
            <Volume2 className="w-5 h-5" />
            Read to Me
          </Button>

          {currentWordIndex >= story.content.length - 1 && (
            <Button variant="magic" size="lg" onClick={handleFinishReading}>
              <CheckCircle className="w-5 h-5" />
              Take Quiz!
            </Button>
          )}
        </div>

        {/* Reading Settings */}
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 justify-center items-center text-sm">
              <div className="flex items-center gap-2">
                <span>Speed:</span>
                <select 
                  value={readingSpeed} 
                  onChange={(e) => setReadingSpeed(e.target.value)}
                  className="rounded px-2 py-1 bg-background border"
                >
                  <option value="slow">Slow</option>
                  <option value="normal">Normal</option>
                  <option value="fast">Fast</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <span>Text Size:</span>
                <select 
                  value={fontSize} 
                  onChange={(e) => setFontSize(e.target.value)}
                  className="rounded px-2 py-1 bg-background border"
                >
                  <option value="normal">Normal</option>
                  <option value="large">Large</option>
                  <option value="xl">Extra Large</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};