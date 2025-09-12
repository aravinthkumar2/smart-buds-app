import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, Printer } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { generateProgressPDF, captureElementAsPDF } from '@/utils/pdfExport';

interface ProgressReportExportProps {
  studentInfo: {
    full_name: string;
    age?: number;
    grade_level?: string;
    primary_language: string;
  };
  analytics: any;
  progress: any[];
  achievements: any[];
  reportElementId?: string;
}

export default function ProgressReportExport({ 
  studentInfo, 
  analytics, 
  progress, 
  achievements,
  reportElementId = 'progress-report-content'
}: ProgressReportExportProps) {
  const { t, language } = useLanguage();
  const { toast } = useToast();

  const handleExportDetailedPDF = async () => {
    try {
      await generateProgressPDF(studentInfo, analytics, progress, achievements, language);
      
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
      const filename = `${studentInfo.full_name.replace(/\s+/g, '_')}_Progress_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      await captureElementAsPDF(reportElementId, filename);

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{t('exportReport')}</span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportDetailedPDF}
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
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>{t('detailedPDFDesc')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>{t('visualPDFDesc')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            <span>{t('printDesc')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}