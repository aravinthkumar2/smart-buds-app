import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import ProgressReportExport from './ProgressReportExport';

interface ProgressDashboardProps {
  studentId: string;
  userRole: 'student' | 'parent' | 'teacher';
  studentInfo?: {
    full_name: string;
    age?: number;
    grade_level?: string;
    primary_language: string;
  };
}

export default function ProgressDashboard({ studentId, userRole, studentInfo }: ProgressDashboardProps) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [progress, setProgress] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [learningPaths, setLearningPaths] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    loadDashboardData();
  }, [studentId]);

  const loadDashboardData = async () => {
    try {
      // Load student analytics
      const { data: analyticsData } = await supabase
        .from('student_analytics')
        .select('*')
        .eq('student_id', studentId)
        .single();

      // Load recent progress
      const { data: progressData } = await supabase
        .from('progress_tracking')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })
        .limit(30);

      // Load achievements
      const { data: achievementsData } = await supabase
        .from('achievements')
        .select('*')
        .eq('student_id', studentId)
        .order('unlocked_at', { ascending: false });

      // Load active learning paths
      const { data: learningPathsData } = await supabase
        .from('learning_paths')
        .select('*')
        .eq('student_id', studentId)
        .eq('is_active', true);

      setAnalytics(analyticsData);
      setProgress(progressData || []);
      setAchievements(achievementsData || []);
      setLearningPaths(learningPathsData || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const weeklyData = progress.slice(0, 7).reverse().map((item, index) => ({
    day: `Day ${index + 1}`,
    score: item.score,
    timeSpent: Math.floor(item.time_spent / 60), // Convert to minutes
  }));

  const activityData = [
    { name: t('reading'), completed: progress.filter(p => p.activity_type === 'reading').length },
    { name: t('writing'), completed: progress.filter(p => p.activity_type === 'writing').length },
    { name: t('math'), completed: progress.filter(p => p.activity_type === 'math').length },
    { name: t('speech'), completed: progress.filter(p => p.activity_type === 'speech').length },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Export Options - Only for parents and teachers */}
      {(userRole === 'parent' || userRole === 'teacher') && studentInfo && (
        <ProgressReportExport
          studentInfo={studentInfo}
          analytics={analytics}
          progress={progress}
          achievements={achievements}
          reportElementId="progress-dashboard-content"
        />
      )}

      <div id="progress-dashboard-content">{/* Wrap content for PDF export */}
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div>
                <p className="text-2xl font-bold">{analytics?.current_level || 1}</p>
                <p className="text-sm text-muted-foreground">{t('currentLevel')}</p>
              </div>
              <div className="ml-auto text-3xl">🎯</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div>
                <p className="text-2xl font-bold">{analytics?.total_points || 0}</p>
                <p className="text-sm text-muted-foreground">{t('totalPoints')}</p>
              </div>
              <div className="ml-auto text-3xl">⭐</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div>
                <p className="text-2xl font-bold">{analytics?.current_streak || 0}</p>
                <p className="text-sm text-muted-foreground">{t('currentStreak')}</p>
              </div>
              <div className="ml-auto text-3xl">🔥</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div>
                <p className="text-2xl font-bold">{analytics?.activities_completed || 0}</p>
                <p className="text-sm text-muted-foreground">{t('activitiesCompleted')}</p>
              </div>
              <div className="ml-auto text-3xl">✅</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('weeklyProgress')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('activityBreakdown')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Active Learning Paths */}
      <Card>
        <CardHeader>
          <CardTitle>{t('activeLearningPaths')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {learningPaths.length > 0 ? (
              learningPaths.map((path, idx) => (
                <Card key={idx} className="border-l-4 border-l-primary">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{path.disorder_type} {t('learningPath')}</h4>
                      <Badge variant="outline">
                        {t('level')} {path.difficulty_level}
                      </Badge>
                    </div>
                    <Progress 
                      value={(path.current_activity_index / (path.activities?.length || 1)) * 100} 
                      className="mb-2" 
                    />
                    <p className="text-sm text-muted-foreground">
                      {path.current_activity_index + 1} {t('of')} {path.activities?.length || 0} {t('activitiesCompleted')}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">{t('noActiveLearningPaths')}</p>
                <Button className="mt-4">
                  {t('startLearningPath')}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>{t('recentAchievements')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.slice(0, 6).map((achievement, idx) => (
              <Card key={idx} className="text-center p-4">
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <h4 className="font-semibold mb-1">{achievement.title}</h4>
                <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                <Badge variant="secondary">+{achievement.points_earned} {t('points')}</Badge>
              </Card>
            ))}
            {achievements.length === 0 && (
              <div className="col-span-full text-center py-8">
                <div className="text-6xl mb-4">🏆</div>
                <p className="text-muted-foreground">{t('keepLearningToEarnAchievements')}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Learning Tips for Parents/Teachers */}
      {(userRole === 'parent' || userRole === 'teacher') && (
        <Card>
          <CardHeader>
            <CardTitle>{t('learningTips')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-2">{t('encourageRegularPractice')}</h4>
                <p className="text-sm">{t('encourageRegularPracticeDesc')}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold mb-2">{t('celebrateSmallWins')}</h4>
                <p className="text-sm">{t('celebrateSmallWinsDesc')}</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold mb-2">{t('createLearningEnvironment')}</h4>
                <p className="text-sm">{t('createLearningEnvironmentDesc')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      </div>{/* End of PDF content */}
    </div>
  );
}