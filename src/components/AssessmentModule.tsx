import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ReadingAssessment from './assessments/ReadingAssessment';
import WritingAssessment from './assessments/WritingAssessment';
import MathAssessment from './assessments/MathAssessment';
import SpeechAssessment from './assessments/SpeechAssessment';
import AssessmentResults from './AssessmentResults';

interface AssessmentModuleProps {
  studentId: string;
  onComplete?: (results: any) => void;
}

export type AssessmentType = 'reading' | 'writing' | 'math' | 'speech';

export default function AssessmentModule({ studentId, onComplete }: AssessmentModuleProps) {
  const [currentAssessment, setCurrentAssessment] = useState<AssessmentType>('reading');
  const [assessmentData, setAssessmentData] = useState<any>({});
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();

  const assessmentTypes: AssessmentType[] = ['reading', 'writing', 'math', 'speech'];
  const currentIndex = assessmentTypes.indexOf(currentAssessment);

  useEffect(() => {
    setProgress(((currentIndex + 1) / assessmentTypes.length) * 100);
  }, [currentAssessment, currentIndex]);

  const handleAssessmentComplete = (type: AssessmentType, data: any) => {
    setAssessmentData(prev => ({
      ...prev,
      [type]: data
    }));

    // Move to next assessment or complete
    const nextIndex = currentIndex + 1;
    if (nextIndex < assessmentTypes.length) {
      setCurrentAssessment(assessmentTypes[nextIndex]);
    } else {
      completeAssessment();
    }
  };

  const completeAssessment = async () => {
    setLoading(true);
    try {
      // Save all assessments to database
      const assessmentPromises = Object.entries(assessmentData).map(([type, data]) =>
        supabase.from('assessments').insert({
          student_id: studentId,
          assessment_type: type,
          content: (data as any).content || {},
          responses: (data as any).responses || {},
          ai_analysis: null, // Will be filled by AI analysis
          confidence_scores: null,
          detected_disorders: []
        })
      );

      await Promise.all(assessmentPromises);

      // Call AI analysis
      const analysisResponse = await supabase.functions.invoke('analyze-assessment', {
        body: {
          studentId,
          assessmentData
        }
      });

      if (analysisResponse.error) throw analysisResponse.error;

      setResults(analysisResponse.data);
      setIsCompleted(true);
      onComplete?.(analysisResponse.data);

      toast({
        title: t('assessmentComplete'),
        description: t('analysisReady'),
      });
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (isCompleted && results) {
    return <AssessmentResults results={results} />;
  }

  const renderCurrentAssessment = () => {
    switch (currentAssessment) {
      case 'reading':
        return (
          <ReadingAssessment
            onComplete={(data) => handleAssessmentComplete('reading', data)}
          />
        );
      case 'writing':
        return (
          <WritingAssessment
            onComplete={(data) => handleAssessmentComplete('writing', data)}
          />
        );
      case 'math':
        return (
          <MathAssessment
            onComplete={(data) => handleAssessmentComplete('math', data)}
          />
        );
      case 'speech':
        return (
          <SpeechAssessment
            onComplete={(data) => handleAssessmentComplete('speech', data)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{t('learningAssessment')}</span>
            <span className="text-sm font-normal">
              {currentIndex + 1} / {assessmentTypes.length}
            </span>
          </CardTitle>
          <Progress value={progress} className="w-full" />
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">
              {t(`${currentAssessment}Assessment`)}
            </h3>
            <p className="text-muted-foreground">
              {t(`${currentAssessment}AssessmentDesc`)}
            </p>
          </div>

          {renderCurrentAssessment()}
        </CardContent>
      </Card>

      {loading && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>{t('analyzingResults')}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}