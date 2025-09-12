import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';

interface ReadingAssessmentProps {
  onComplete: (data: any) => void;
}

export default function ReadingAssessment({ onComplete }: ReadingAssessmentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<any[]>([]);
  const [readingSpeed, setReadingSpeed] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const { t } = useLanguage();

  const readingQuestions = [
    {
      type: 'passage',
      passage: `The little fox ran through the forest. It was looking for food. The fox saw a rabbit and tried to catch it. But the rabbit was too fast and ran away. The fox felt sad and hungry.`,
      questions: [
        {
          text: 'What animal was the fox looking for?',
          options: ['Bird', 'Rabbit', 'Deer', 'Mouse'],
          correct: 1
        },
        {
          text: 'How did the fox feel at the end?',
          options: ['Happy', 'Angry', 'Sad', 'Excited'],
          correct: 2
        }
      ]
    },
    {
      type: 'word_recognition',
      words: ['cat', 'dog', 'house', 'tree', 'book', 'water', 'happy', 'jump'],
      instructions: 'Read each word aloud and select if you can read it easily.'
    },
    {
      type: 'phonics',
      sounds: ['ch', 'sh', 'th', 'ph', 'wh'],
      instructions: 'Listen to each sound and write words that start with this sound.'
    }
  ];

  const handleStartReading = () => {
    setStartTime(new Date());
  };

  const handleQuestionResponse = (questionIndex: number, answer: any) => {
    const newResponses = [...responses];
    newResponses[currentQuestion] = {
      questionIndex,
      answer,
      timeSpent: startTime ? (new Date().getTime() - startTime.getTime()) / 1000 : 0
    };
    setResponses(newResponses);
  };

  const handleNext = () => {
    if (currentQuestion < readingQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setStartTime(new Date());
    } else {
      // Complete assessment
      onComplete({
        content: readingQuestions,
        responses: responses,
        readingSpeed,
        totalTime: responses.reduce((acc, curr) => acc + curr.timeSpent, 0)
      });
    }
  };

  const renderCurrentQuestion = () => {
    const question = readingQuestions[currentQuestion];

    if (question.type === 'passage') {
      return (
        <div className="space-y-6">
          {!startTime && (
            <Card className="p-4 bg-blue-50">
              <p className="text-sm text-blue-700 mb-4">
                {t('readingInstructions')}
              </p>
              <Button onClick={handleStartReading}>
                {t('startReading')}
              </Button>
            </Card>
          )}

          {startTime && (
            <>
              <Card className="p-4">
                <h3 className="font-semibold mb-4">{t('readPassage')}</h3>
                <p className="text-lg leading-relaxed">{question.passage}</p>
              </Card>

              <div className="space-y-4">
                {question.questions.map((q, idx) => (
                  <Card key={idx} className="p-4">
                    <h4 className="font-medium mb-3">{q.text}</h4>
                    <RadioGroup
                      value={responses[currentQuestion]?.answer?.[idx]?.toString()}
                      onValueChange={(value) => {
                        const newAnswer = { ...responses[currentQuestion]?.answer };
                        newAnswer[idx] = parseInt(value);
                        handleQuestionResponse(currentQuestion, newAnswer);
                      }}
                    >
                      {q.options.map((option, optionIdx) => (
                        <div key={optionIdx} className="flex items-center space-x-2">
                          <RadioGroupItem value={optionIdx.toString()} id={`q${idx}_${optionIdx}`} />
                          <Label htmlFor={`q${idx}_${optionIdx}`}>{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      );
    }

    if (question.type === 'word_recognition') {
      return (
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">{t('wordRecognition')}</h3>
            <p className="mb-4">{question.instructions}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {question.words.map((word, idx) => (
                <Card key={idx} className="p-4 text-center">
                  <p className="text-xl font-semibold mb-2">{word}</p>
                  <RadioGroup
                    value={responses[currentQuestion]?.answer?.[idx]?.toString()}
                    onValueChange={(value) => {
                      const newAnswer = { ...responses[currentQuestion]?.answer };
                      newAnswer[idx] = value === 'true';
                      handleQuestionResponse(currentQuestion, newAnswer);
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id={`word${idx}_yes`} />
                      <Label htmlFor={`word${idx}_yes`}>{t('canRead')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id={`word${idx}_no`} />
                      <Label htmlFor={`word${idx}_no`}>{t('needHelp')}</Label>
                    </div>
                  </RadioGroup>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      );
    }

    if (question.type === 'phonics') {
      return (
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">{t('phonicsTest')}</h3>
            <p className="mb-4">{question.instructions}</p>
            
            <div className="space-y-4">
              {question.sounds.map((sound, idx) => (
                <div key={idx} className="space-y-2">
                  <Label htmlFor={`sound${idx}`}>
                    {t('wordsStartingWith')} "{sound}":
                  </Label>
                  <Textarea
                    id={`sound${idx}`}
                    placeholder={t('typeWords')}
                    value={responses[currentQuestion]?.answer?.[idx] || ''}
                    onChange={(e) => {
                      const newAnswer = { ...responses[currentQuestion]?.answer };
                      newAnswer[idx] = e.target.value;
                      handleQuestionResponse(currentQuestion, newAnswer);
                    }}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {t('question')} {currentQuestion + 1} {t('of')} {readingQuestions.length}
        </h3>
      </div>

      {renderCurrentQuestion()}

      <div className="flex justify-end">
        <Button
          onClick={handleNext}
          disabled={!responses[currentQuestion] || !startTime}
        >
          {currentQuestion < readingQuestions.length - 1 ? t('next') : t('finish')}
        </Button>
      </div>
    </div>
  );
}