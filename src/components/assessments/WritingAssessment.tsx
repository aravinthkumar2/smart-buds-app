import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';

interface WritingAssessmentProps {
  onComplete: (data: any) => void;
}

export default function WritingAssessment({ onComplete }: WritingAssessmentProps) {
  const [currentTask, setCurrentTask] = useState(0);
  const [responses, setResponses] = useState<any[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const { t } = useLanguage();

  const writingTasks = [
    {
      type: 'handwriting',
      instruction: 'Copy the following sentence in your best handwriting:',
      sentence: 'The quick brown fox jumps over the lazy dog.'
    },
    {
      type: 'story_writing',
      instruction: 'Write a short story about your favorite animal (at least 3 sentences):',
      prompt: 'My favorite animal is...'
    },
    {
      type: 'letter_formation',
      instruction: 'Write the following letters in both uppercase and lowercase:',
      letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
    },
    {
      type: 'spelling',
      instruction: 'Listen to the words and write them down:',
      words: ['cat', 'house', 'happy', 'running', 'beautiful', 'important', 'necessary', 'definitely']
    }
  ];

  useEffect(() => {
    setStartTime(new Date());
  }, [currentTask]);

  const handleTaskResponse = (taskIndex: number, response: any) => {
    const newResponses = [...responses];
    newResponses[taskIndex] = {
      taskIndex,
      response,
      timeSpent: startTime ? (new Date().getTime() - startTime.getTime()) / 1000 : 0,
      timestamp: new Date().toISOString()
    };
    setResponses(newResponses);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const saveCanvasData = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    return canvas.toDataURL();
  };

  const handleNext = () => {
    if (currentTask < writingTasks.length - 1) {
      setCurrentTask(currentTask + 1);
    } else {
      // Complete assessment
      onComplete({
        content: writingTasks,
        responses: responses,
        totalTime: responses.reduce((acc, curr) => acc + curr.timeSpent, 0)
      });
    }
  };

  const renderCurrentTask = () => {
    const task = writingTasks[currentTask];

    if (task.type === 'handwriting' || task.type === 'letter_formation') {
      return (
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">{task.instruction}</h3>
            {task.sentence && (
              <p className="text-lg mb-4 p-4 bg-gray-100 rounded">
                {task.sentence}
              </p>
            )}
            {task.letters && (
              <div className="grid grid-cols-5 gap-2 mb-4">
                {task.letters.map((letter, idx) => (
                  <div key={idx} className="text-center p-2 bg-gray-100 rounded">
                    <span className="text-2xl font-bold">{letter}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-4">
            <Label className="text-sm font-medium mb-2 block">
              {t('writeHere')}:
            </Label>
            <canvas
              ref={canvasRef}
              width={600}
              height={300}
              className="border border-gray-300 rounded w-full cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearCanvas}
              >
                {t('clear')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const canvasData = saveCanvasData();
                  handleTaskResponse(currentTask, { handwriting: canvasData });
                }}
              >
                {t('save')}
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    if (task.type === 'story_writing') {
      return (
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">{task.instruction}</h3>
            {task.prompt && (
              <p className="text-sm text-gray-600 mb-4">{task.prompt}</p>
            )}
            
            <Textarea
              placeholder={t('startWriting')}
              rows={8}
              value={responses[currentTask]?.response?.story || ''}
              onChange={(e) => {
                handleTaskResponse(currentTask, { story: e.target.value });
              }}
              className="w-full"
            />
          </Card>
        </div>
      );
    }

    if (task.type === 'spelling') {
      return (
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">{task.instruction}</h3>
            <p className="text-sm text-gray-600 mb-4">
              {t('spellingInstructions')}
            </p>
            
            <div className="grid gap-4">
              {task.words.map((word, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Play word audio
                      const utterance = new SpeechSynthesisUtterance(word);
                      speechSynthesis.speak(utterance);
                    }}
                  >
                    {t('playWord')} {idx + 1}
                  </Button>
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    placeholder={t('writeWord')}
                    value={responses[currentTask]?.response?.spellings?.[idx] || ''}
                    onChange={(e) => {
                      const newSpellings = { ...responses[currentTask]?.response?.spellings };
                      newSpellings[idx] = e.target.value;
                      handleTaskResponse(currentTask, { spellings: newSpellings });
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
          {t('task')} {currentTask + 1} {t('of')} {writingTasks.length}
        </h3>
      </div>

      {renderCurrentTask()}

      <div className="flex justify-end">
        <Button
          onClick={handleNext}
          disabled={!responses[currentTask]}
        >
          {currentTask < writingTasks.length - 1 ? t('next') : t('finish')}
        </Button>
      </div>
    </div>
  );
}