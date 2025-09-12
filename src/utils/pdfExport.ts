import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface StudentProfile {
  full_name: string;
  age?: number;
  grade_level?: string;
  primary_language: string;
}

export interface AssessmentReport {
  student: StudentProfile;
  assessment_date: string;
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
}

export async function generateAssessmentPDF(
  report: AssessmentReport,
  language: string = 'en'
): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  // Helper function to add text with word wrapping
  const addText = (text: string, fontSize: number = 12, isBold: boolean = false, isTitle: boolean = false) => {
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
    
    if (isTitle) {
      const textWidth = pdf.getTextWidth(text);
      const xPosition = (pageWidth - textWidth) / 2;
      pdf.text(text, xPosition, yPosition);
    } else {
      const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin);
      pdf.text(lines, margin, yPosition);
      yPosition += lines.length * (fontSize * 0.352777778); // Convert pt to mm
    }
    yPosition += fontSize * 0.352777778 + 2; // Add line spacing
  };

  // Check if new page is needed
  const checkNewPage = (requiredSpace: number = 20) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
    }
  };

  // Header
  addText('LEARNING ASSESSMENT REPORT', 20, true, true);
  addText('Comprehensive Learning Disability Analysis', 14, false, true);
  yPosition += 10;

  // Student Information
  checkNewPage();
  addText('STUDENT INFORMATION', 16, true);
  addText(`Name: ${report.student.full_name}`);
  if (report.student.age) {
    addText(`Age: ${report.student.age} years`);
  }
  if (report.student.grade_level) {
    addText(`Grade Level: ${report.student.grade_level}`);
  }
  addText(`Primary Language: ${report.student.primary_language}`);
  addText(`Assessment Date: ${new Date(report.assessment_date).toLocaleDateString()}`);
  yPosition += 10;

  // Overall Performance Scores
  checkNewPage();
  addText('ASSESSMENT SCORES', 16, true);
  
  Object.entries(report.detailed_scores).forEach(([category, score]) => {
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
    const performance = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Improvement';
    addText(`${categoryName}: ${score}% (${performance})`);
  });
  yPosition += 10;

  // Detected Learning Challenges
  checkNewPage();
  if (report.detected_disorders.length > 0) {
    addText('DETECTED LEARNING CHALLENGES', 16, true);
    
    report.detected_disorders.forEach((disorder, index) => {
      checkNewPage(30);
      addText(`${index + 1}. ${disorder.name}`, 14, true);
      addText(`Confidence Level: ${disorder.confidence}%`);
      
      if (disorder.symptoms.length > 0) {
        addText('Observed Symptoms:', 12, true);
        disorder.symptoms.forEach(symptom => {
          addText(`• ${symptom}`, 11);
        });
      }
      
      if (disorder.recommendations.length > 0) {
        addText('Recommendations:', 12, true);
        disorder.recommendations.forEach(rec => {
          addText(`• ${rec}`, 11);
        });
      }
      yPosition += 5;
    });
  } else {
    addText('LEARNING CHALLENGES', 16, true);
    addText('🎉 No significant learning challenges detected.', 12, true);
    addText('Performance is within normal range across all assessment areas.');
  }
  yPosition += 10;

  // Strengths
  checkNewPage();
  if (report.overall_analysis.strengths.length > 0) {
    addText('IDENTIFIED STRENGTHS', 16, true);
    report.overall_analysis.strengths.forEach(strength => {
      addText(`✓ ${strength}`, 12);
    });
    yPosition += 10;
  }

  // Areas for Improvement
  checkNewPage();
  if (report.overall_analysis.areas_for_improvement.length > 0) {
    addText('AREAS FOR IMPROVEMENT', 16, true);
    report.overall_analysis.areas_for_improvement.forEach(area => {
      addText(`• ${area}`, 12);
    });
    yPosition += 10;
  }

  // Learning Style
  checkNewPage();
  addText('IDENTIFIED LEARNING STYLE', 16, true);
  addText(report.overall_analysis.learning_style, 14, true);
  yPosition += 10;

  // Recommended Interventions
  checkNewPage();
  addText('RECOMMENDED INTERVENTIONS', 16, true);
  report.overall_analysis.recommended_interventions.forEach((intervention, index) => {
    addText(`${index + 1}. ${intervention}`, 12);
  });
  yPosition += 10;

  // Footer information
  checkNewPage(40);
  addText('IMPORTANT NOTES', 14, true);
  addText('• This report is based on automated analysis and should be reviewed by qualified professionals.');
  addText('• Early intervention is key to helping children overcome learning challenges.');
  addText('• Regular progress monitoring and assessment updates are recommended.');
  addText('• Please consult with educational specialists for detailed intervention planning.');
  yPosition += 10;

  // Report generation info
  addText(`Report generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 10);
  addText('Generated by Learning Assessment Platform', 10);

  // Save the PDF
  const fileName = `${report.student.full_name.replace(/\s+/g, '_')}_Learning_Assessment_Report_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
}

export async function generateProgressPDF(
  student: StudentProfile,
  analytics: any,
  progress: any[],
  achievements: any[],
  language: string = 'en'
): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  let yPosition = 20;

  // Helper function to add text
  const addText = (text: string, fontSize: number = 12, isBold: boolean = false, isTitle: boolean = false) => {
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
    
    if (isTitle) {
      const textWidth = pdf.getTextWidth(text);
      const xPosition = (pageWidth - textWidth) / 2;
      pdf.text(text, xPosition, yPosition);
    } else {
      const lines = pdf.splitTextToSize(text, pageWidth - 40);
      pdf.text(lines, 20, yPosition);
      yPosition += lines.length * (fontSize * 0.352777778);
    }
    yPosition += fontSize * 0.352777778 + 2;
  };

  // Header
  addText('STUDENT PROGRESS REPORT', 20, true, true);
  yPosition += 10;

  // Student Info
  addText('STUDENT INFORMATION', 16, true);
  addText(`Name: ${student.full_name}`);
  if (student.age) addText(`Age: ${student.age} years`);
  if (student.grade_level) addText(`Grade Level: ${student.grade_level}`);
  yPosition += 10;

  // Analytics Summary
  addText('PROGRESS SUMMARY', 16, true);
  addText(`Current Level: ${analytics?.current_level || 1}`);
  addText(`Total Points Earned: ${analytics?.total_points || 0}`);
  addText(`Current Learning Streak: ${analytics?.current_streak || 0} days`);
  addText(`Longest Learning Streak: ${analytics?.longest_streak || 0} days`);
  addText(`Total Activities Completed: ${analytics?.activities_completed || 0}`);
  addText(`Total Learning Time: ${Math.floor((analytics?.time_spent_learning || 0) / 60)} hours`);
  yPosition += 10;

  // Recent Achievements
  if (achievements.length > 0) {
    addText('RECENT ACHIEVEMENTS', 16, true);
    achievements.slice(0, 10).forEach((achievement, index) => {
      addText(`${index + 1}. ${achievement.title} - ${achievement.description} (+${achievement.points_earned} points)`);
    });
    yPosition += 10;
  }

  // Activity Breakdown
  const activityStats = {
    reading: progress.filter(p => p.activity_type === 'reading').length,
    writing: progress.filter(p => p.activity_type === 'writing').length,
    math: progress.filter(p => p.activity_type === 'math').length,
    speech: progress.filter(p => p.activity_type === 'speech').length,
  };

  addText('ACTIVITY BREAKDOWN', 16, true);
  Object.entries(activityStats).forEach(([type, count]) => {
    const typeName = type.charAt(0).toUpperCase() + type.slice(1);
    addText(`${typeName} Activities: ${count} completed`);
  });

  // Footer
  yPosition += 20;
  addText(`Report generated on: ${new Date().toLocaleDateString()}`, 10);

  // Save
  const fileName = `${student.full_name.replace(/\s+/g, '_')}_Progress_Report_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
}

export async function captureElementAsPDF(
  elementId: string,
  filename: string
): Promise<void> {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    // Capture the element as canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Calculate dimensions to fit page
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const ratio = canvasWidth / canvasHeight;
    
    let width = pageWidth - 20; // 10mm margin on each side
    let height = width / ratio;
    
    // If height is too large, scale based on height
    if (height > pageHeight - 20) {
      height = pageHeight - 20;
      width = height * ratio;
    }
    
    const x = (pageWidth - width) / 2;
    const y = 10; // Top margin

    // Add image to PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', x, y, width, height);

    // Save PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}