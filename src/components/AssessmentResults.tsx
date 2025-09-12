import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { generateAssessmentPDF, captureElementAsPDF, type AssessmentReport } from '@/utils/pdfExport';
import { Download, FileText, Printer } from 'lucide-react';

interface AssessmentResultsProps {
  results: {
    detected_disorders: Array<{
      name: string;
      confidence: number;
      symptoms: string[];
      recommendations: string[];
    }>;
    overall_analysis: {
      strengths: string[];
      areas_for_improvement: string[];
      learning_style: string;
      recommended_interventions: string[];
    };
    detailed_scores: {
      reading: number;
      writing: number;
      math: number;
      speech: number;
    };
  };
  studentInfo?: {
    full_name: string;
    age?: number;
    grade_level?: string;
    primary_language: string;
  };
}

export default function AssessmentResults({ results, studentInfo }: AssessmentResultsProps) {
  const { t, language } = useLanguage();
  const { toast } = useToast();

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-red-500';
    if (confidence >= 60) return 'bg-orange-500';
    if (confidence >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleExportPDF = async () => {
    try {
      if (!studentInfo) {
        toast({
          title: t('error'),
          description: 'Student information is required for PDF export',
          variant: 'destructive',
        });
        return;
      }

      const reportData: AssessmentReport = {
        student: studentInfo,
        assessment_date: new Date().toISOString(),
        detected_disorders: results.detected_disorders,
        overall_analysis: results.overall_analysis,
        detailed_scores: results.detailed_scores
      };

      await generateAssessmentPDF(reportData, language);

      toast({
        title: t('success'),
        description: t('reportExportedSuccessfully'),
      });
    } catch (error) {
      console.error('PDF Export Error:', error);
      toast({
        title: t('error'),
        description: t('failedToExportReport'),
        variant: 'destructive',
      });
    }
  };

  const handleCaptureAsPDF = async () => {
    try {
      const filename = `${studentInfo?.full_name?.replace(/\s+/g, '_') || 'Student'}_Assessment_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      await captureElementAsPDF('assessment-report-content', filename);

      toast({
        title: t('success'),
        description: t('reportExportedSuccessfully'),
      });
    } catch (error) {
      console.error('PDF Capture Error:', error);
      toast({
        title: t('error'),
        description: t('failedToExportReport'),
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center flex items-center justify-between">
            <span>{t('assessmentResults')}</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportPDF}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                {t('exportDetailedPDF')}
              </Button>
              <Button
                variant="outline" 
                size="sm"
                onClick={handleCaptureAsPDF}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {t('exportVisualPDF')}
              </Button>
              <Button
                variant="outline"
                size="sm" 
                onClick={() => window.print()}
                className="flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                {t('print')}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      <div id="assessment-report-content">{/* Wrap content for PDF capture */}

      {/* Overall Scores */}
      <Card>
        <CardHeader>
          <CardTitle>{t('overallPerformance')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(results.detailed_scores).map(([category, score]) => (
              <div key={category} className="text-center">
                <h4 className="font-semibold mb-2">{t(category)}</h4>
                <div className="relative w-20 h-20 mx-auto mb-2">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="30"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="transparent"
                      className="text-gray-200"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="30"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray={`${score * 1.88} 188`}
                      className={getScoreColor(score)}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-lg font-bold ${getScoreColor(score)}`}>
                      {score}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detected Learning Challenges */}
      <Card>
        <CardHeader>
          <CardTitle>{t('detectedLearningChallenges')}</CardTitle>
        </CardHeader>
        <CardContent>
          {results.detected_disorders.length > 0 ? (
            <div className="space-y-4">
              {results.detected_disorders.map((disorder, idx) => (
                <Card key={idx} className="border-l-4 border-l-orange-500">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-lg">{disorder.name}</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{t('confidence')}:</span>
                        <Badge className={`${getConfidenceColor(disorder.confidence)} text-white`}>
                          {disorder.confidence}%
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <Progress value={disorder.confidence} className="w-full" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium mb-2">{t('observedSymptoms')}:</h5>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {disorder.symptoms.map((symptom, symIdx) => (
                            <li key={symIdx}>{symptom}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">{t('recommendations')}:</h5>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {disorder.recommendations.map((rec, recIdx) => (
                            <li key={recIdx}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-xl font-semibold text-green-600 mb-2">
                {t('noLearningChallengesDetected')}
              </h3>
              <p className="text-gray-600">
                {t('performanceWithinNormalRange')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Strengths and Areas for Improvement */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">{t('strengths')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {results.overall_analysis.strengths.map((strength, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-orange-600">{t('areasForImprovement')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {results.overall_analysis.areas_for_improvement.map((area, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Learning Style and Interventions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('personalizedRecommendations')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h4 className="font-semibold mb-2">{t('identifiedLearningStyle')}:</h4>
            <Badge variant="outline" className="text-lg py-2 px-4">
              {results.overall_analysis.learning_style}
            </Badge>
          </div>

          <div>
            <h4 className="font-semibold mb-3">{t('recommendedInterventions')}:</h4>
            <div className="grid gap-3">
              {results.overall_analysis.recommended_interventions.map((intervention, idx) => (
                <Card key={idx} className="p-4 bg-blue-50">
                  <p>{intervention}</p>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button>
          {t('startLearningPath')}
        </Button>
      </div>
      </div>{/* End of PDF capture content */}
    </div>
  );
}