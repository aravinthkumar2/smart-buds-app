import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

interface SpeechAssessmentProps {
  onComplete: (data: any) => void;
}

export default function SpeechAssessment({ onComplete }: SpeechAssessmentProps) {
  const [currentTask, setCurrentTask] = useState(0);
  const [responses, setResponses] = useState<any[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string>('');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { t } = useLanguage();
  const { toast } = useToast();

  const speechTasks = [
    {
      type: 'word_repetition',
      instruction: 'Listen carefully and repeat these words clearly:',
      words: ['cat', 'butterfly', 'elephant', 'refrigerator', 'pronunciation', 'sophisticated']
    },
    {
      type: 'sentence_reading',
      instruction: 'Read these sentences aloud clearly:',
      sentences: [
        'The cat sat on the mat.',
        'She sells seashells by the seashore.',
        'Peter Piper picked a peck of pickled peppers.',
        'How much wood would a woodchuck chuck if a woodchuck could chuck wood?'
      ]
    },
    {
      type: 'story_telling',
      instruction: 'Look at the picture and tell a story about what you see:',
      prompt: 'Describe what is happening in this scene and create a short story (at least 5 sentences).'
    },
    {
      type: 'phoneme_production',
      instruction: 'Make these sounds clearly:',
      phonemes: [
        { sound: '/th/', example: 'Think' },
        { sound: '/r/', example: 'Red' },
        { sound: '/l/', example: 'Light' },
        { sound: '/s/', example: 'Snake' },
        { sound: '/ch/', example: 'Chair' },
        { sound: '/sh/', example: 'Ship' }
      ]
    }
  ];

  useEffect(() => {
    setStartTime(new Date());
  }, [currentTask]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        
        // Save recording data
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          handleTaskResponse(currentTask, {
            audioData: base64Audio,
            audioBlob: audioBlob
          });
        };
        reader.readAsDataURL(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        title: t('error'),
        description: t('microphoneError'),
        variant: 'destructive',
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playRecording = () => {
    if (audioURL) {
      const audio = new Audio(audioURL);
      audio.play();
    }
  };

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

  const handleNext = () => {
    if (currentTask < speechTasks.length - 1) {
      setCurrentTask(currentTask + 1);
      setAudioURL('');
    } else {
      // Complete assessment
      onComplete({
        content: speechTasks,
        responses: responses,
        totalTime: responses.reduce((acc, curr) => acc + curr.timeSpent, 0)
      });
    }
  };

  const renderCurrentTask = () => {
    const task = speechTasks[currentTask];

    if (task.type === 'word_repetition') {
      return (
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">{task.instruction}</h3>
            <div className="grid gap-4">
              {task.words.map((word, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded">
                  <span className="text-lg font-medium">{word}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const utterance = new SpeechSynthesisUtterance(word);
                      speechSynthesis.speak(utterance);
                    }}
                  >
                    {t('listen')}
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      );
    }

    if (task.type === 'sentence_reading') {
      return (
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">{task.instruction}</h3>
            <div className="space-y-4">
              {task.sentences.map((sentence, idx) => (
                <Card key={idx} className="p-4">
                  <p className="text-lg leading-relaxed">{sentence}</p>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      );
    }

    if (task.type === 'story_telling') {
      return (
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">{task.instruction}</h3>
            <div className="bg-gradient-to-br from-blue-100 to-green-100 p-8 rounded-lg mb-4">
              <div className="text-center">
                <div className="text-6xl mb-4">🏖️</div>
                <div className="text-4xl mb-2">🌅</div>
                <div className="flex justify-center space-x-4">
                  <span className="text-3xl">🏰</span>
                  <span className="text-3xl">🦀</span>
                  <span className="text-3xl">⛵</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600">{task.prompt}</p>
          </Card>
        </div>
      );
    }

    if (task.type === 'phoneme_production') {
      return (
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">{task.instruction}</h3>
            <div className="grid gap-4">
              {task.phonemes.map((phoneme, idx) => (
                <Card key={idx} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold mr-4">{phoneme.sound}</span>
                      <span className="text-lg">({t('asIn')} "{phoneme.example}")</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const utterance = new SpeechSynthesisUtterance(phoneme.example);
                        speechSynthesis.speak(utterance);
                      }}
                    >
                      {t('listen')}
                    </Button>
                  </div>
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
          {t('task')} {currentTask + 1} {t('of')} {speechTasks.length}
        </h3>
      </div>

      {renderCurrentTask()}

      {/* Recording Controls */}
      <Card className="p-4">
        <h4 className="font-semibold mb-4">{t('recordYourResponse')}</h4>
        <div className="flex items-center gap-4">
          {!isRecording ? (
            <Button onClick={startRecording} className="bg-red-500 hover:bg-red-600">
              🎤 {t('startRecording')}
            </Button>
          ) : (
            <Button onClick={stopRecording} variant="outline">
              ⏹️ {t('stopRecording')}
            </Button>
          )}
          
          {audioURL && (
            <Button onClick={playRecording} variant="outline">
              ▶️ {t('playback')}
            </Button>
          )}
        </div>

        {isRecording && (
          <div className="mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span>{t('recording')}</span>
            </div>
          </div>
        )}
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleNext}
          disabled={!responses[currentTask]}
        >
          {currentTask < speechTasks.length - 1 ? t('next') : t('finish')}
        </Button>
      </div>
    </div>
  );
}