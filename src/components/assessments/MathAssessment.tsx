import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useLanguage } from '@/contexts/LanguageContext';

interface MathAssessmentProps {
  onComplete: (data: any) => void;
}

export default function MathAssessment({ onComplete }: MathAssessmentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<any[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const { t } = useLanguage();

  const mathQuestions = [
    {
      type: 'number_recognition',
      instruction: 'Identify the following numbers:',
      numbers: [5, 12, 37, 84, 156, 293],
      question: 'What number is this?'
    },
    {
      type: 'basic_arithmetic',
      instruction: 'Solve these math problems:',
      problems: [
        { question: '3 + 5 = ?', answer: 8 },
        { question: '9 - 4 = ?', answer: 5 },
        { question: '6 × 2 = ?', answer: 12 },
        { question: '15 ÷ 3 = ?', answer: 5 },
        { question: '25 + 17 = ?', answer: 42 },
        { question: '50 - 23 = ?', answer: 27 }
      ]
    },
    {
      type: 'word_problems',
      instruction: 'Read and solve these word problems:',
      problems: [
        {
          question: 'Sarah has 8 apples. She gives 3 to her friend. How many apples does she have left?',
          answer: 5,
          options: [3, 5, 8, 11]
        },
        {
          question: 'There are 4 boxes with 6 toys in each box. How many toys are there in total?',
          answer: 24,
          options: [10, 18, 24, 30]
        },
        {
          question: 'A pizza is cut into 8 pieces. If Tom eats 3 pieces, what fraction of the pizza is left?',
          answer: '5/8',
          options: ['3/8', '5/8', '2/8', '6/8']
        }
      ]
    },
    {
      type: 'pattern_recognition',
      instruction: 'Complete these number patterns:',
      patterns: [
        { sequence: [2, 4, 6, 8, '?'], answer: 10 },
        { sequence: [1, 3, 5, 7, '?'], answer: 9 },
        { sequence: [10, 8, 6, 4, '?'], answer: 2 },
        { sequence: [1, 4, 7, 10, '?'], answer: 13 },
        { sequence: [2, 4, 8, 16, '?'], answer: 32 }
      ]
    },
    {
      type: 'geometry',
      instruction: 'Answer these shape and geometry questions:',
      questions: [
        {
          question: 'How many sides does a triangle have?',
          options: [2, 3, 4, 5],
          answer: 3
        },
        {
          question: 'What is the name of a shape with 4 equal sides?',
          options: ['Rectangle', 'Triangle', 'Square', 'Circle'],
          answer: 'Square'
        },
        {
          question: 'If a rectangle has a length of 6 and width of 4, what is its area?',
          options: [10, 20, 24, 30],
          answer: 24
        }
      ]
    }
  ];

  useEffect(() => {
    setStartTime(new Date());
  }, [currentQuestion]);

  const handleQuestionResponse = (questionIndex: number, answer: any) => {
    const newResponses = [...responses];
    newResponses[questionIndex] = {
      questionIndex,
      answer,
      timeSpent: startTime ? (new Date().getTime() - startTime.getTime()) / 1000 : 0,
      timestamp: new Date().toISOString()
    };
    setResponses(newResponses);
  };

  const handleNext = () => {
    if (currentQuestion < mathQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Complete assessment
      onComplete({
        content: mathQuestions,
        responses: responses,
        totalTime: responses.reduce((acc, curr) => acc + curr.timeSpent, 0)
      });
    }
  };

  const renderCurrentQuestion = () => {
    const question = mathQuestions[currentQuestion];

    if (question.type === 'number_recognition') {
      return (
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">{question.instruction}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {question.numbers.map((number, idx) => (
                <Card key={idx} className="p-6 text-center">
                  <div className="text-4xl font-bold mb-4">{number}</div>
                  <Input
                    placeholder={t('writeNumber')}
                    value={responses[currentQuestion]?.answer?.[idx] || ''}
                    onChange={(e) => {
                      const newAnswer = { ...responses[currentQuestion]?.answer };
                      newAnswer[idx] = e.target.value;
                      handleQuestionResponse(currentQuestion, newAnswer);
                    }}
                  />
                </Card>
              ))}
            </div>
          </Card>
        </div>
      );
    }

    if (question.type === 'basic_arithmetic') {
      return (
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">{question.instruction}</h3>
            <div className="grid gap-4">
              {question.problems.map((problem, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <Label className="text-lg font-medium w-32">
                    {problem.question}
                  </Label>
                  <Input
                    type="number"
                    className="w-20"
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

    if (question.type === 'word_problems') {
      return (
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">{question.instruction}</h3>
            <div className="space-y-6">
              {question.problems.map((problem, idx) => (
                <Card key={idx} className="p-4">
                  <p className="text-lg mb-4">{problem.question}</p>
                  <RadioGroup
                    value={responses[currentQuestion]?.answer?.[idx]?.toString()}
                    onValueChange={(value) => {
                      const newAnswer = { ...responses[currentQuestion]?.answer };
                      newAnswer[idx] = value;
                      handleQuestionResponse(currentQuestion, newAnswer);
                    }}
                  >
                    {problem.options.map((option, optionIdx) => (
                      <div key={optionIdx} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.toString()} id={`q${idx}_${optionIdx}`} />
                        <Label htmlFor={`q${idx}_${optionIdx}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      );
    }

    if (question.type === 'pattern_recognition') {
      return (
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">{question.instruction}</h3>
            <div className="space-y-4">
              {question.patterns.map((pattern, idx) => (
                <Card key={idx} className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    {pattern.sequence.map((item, seqIdx) => (
                      <div key={seqIdx} className="flex items-center">
                        <div className="w-12 h-12 border-2 border-gray-300 rounded flex items-center justify-center text-lg font-semibold">
                          {item === '?' ? (
                            <Input
                              type="number"
                              className="w-10 h-8 text-center p-1"
                              value={responses[currentQuestion]?.answer?.[idx] || ''}
                              onChange={(e) => {
                                const newAnswer = { ...responses[currentQuestion]?.answer };
                                newAnswer[idx] = e.target.value;
                                handleQuestionResponse(currentQuestion, newAnswer);
                              }}
                            />
                          ) : (
                            item
                          )}
                        </div>
                        {seqIdx < pattern.sequence.length - 1 && (
                          <span className="mx-2 text-gray-400">→</span>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      );
    }

    if (question.type === 'geometry') {
      return (
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">{question.instruction}</h3>
            <div className="space-y-6">
              {question.questions.map((q, idx) => (
                <Card key={idx} className="p-4">
                  <p className="text-lg mb-4">{q.question}</p>
                  <RadioGroup
                    value={responses[currentQuestion]?.answer?.[idx]?.toString()}
                    onValueChange={(value) => {
                      const newAnswer = { ...responses[currentQuestion]?.answer };
                      newAnswer[idx] = value;
                      handleQuestionResponse(currentQuestion, newAnswer);
                    }}
                  >
                    {q.options.map((option, optionIdx) => (
                      <div key={optionIdx} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.toString()} id={`geo${idx}_${optionIdx}`} />
                        <Label htmlFor={`geo${idx}_${optionIdx}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </Card>
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
          {t('section')} {currentQuestion + 1} {t('of')} {mathQuestions.length}
        </h3>
      </div>

      {renderCurrentQuestion()}

      <div className="flex justify-end">
        <Button
          onClick={handleNext}
          disabled={!responses[currentQuestion]}
        >
          {currentQuestion < mathQuestions.length - 1 ? t('next') : t('finish')}
        </Button>
      </div>
    </div>
  );
}