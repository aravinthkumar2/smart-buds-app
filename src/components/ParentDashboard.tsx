import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft,
  TrendingUp, 
  Clock, 
  Target, 
  Award,
  BookOpen,
  PenTool,
  Calculator,
  Music,
  Download,
  Bell,
  Settings,
  Calendar,
  BarChart3
} from "lucide-react";

interface ParentDashboardProps {
  onBack: () => void;
}

export const ParentDashboard = ({ onBack }: ParentDashboardProps) => {
  const childStats = {
    name: "Alex",
    totalActivities: 47,
    weeklyGoal: 10,
    currentStreak: 5,
    totalTime: "2h 30m",
    averageScore: 85,
  };

  const moduleProgress = [
    { name: "Reading", progress: 65, timeSpent: "45m", activities: 13, improvements: "+15%" },
    { name: "Writing", progress: 40, timeSpent: "30m", activities: 8, improvements: "+8%" },
    { name: "Math", progress: 30, timeSpent: "25m", activities: 6, improvements: "+12%" },
    { name: "Music", progress: 80, timeSpent: "40m", activities: 16, improvements: "+20%" },
  ];

  const weeklyActivity = [
    { day: "Mon", activities: 3, time: "25m" },
    { day: "Tue", activities: 2, time: "20m" },
    { day: "Wed", activities: 4, time: "35m" },
    { day: "Thu", activities: 3, time: "30m" },
    { day: "Fri", activities: 2, time: "15m" },
    { day: "Sat", activities: 1, time: "10m" },
    { day: "Sun", activities: 0, time: "0m" },
  ];

  const recentAchievements = [
    { title: "Reading Streak", description: "5 days in a row!", icon: BookOpen, color: "text-primary" },
    { title: "Math Master", description: "Completed 10 puzzles", icon: Calculator, color: "text-magic" },
    { title: "Writing Pro", description: "Perfect handwriting score", icon: PenTool, color: "text-success" },
  ];

  const aiInsights = [
    {
      title: "Reading Improvement",
      description: "Alex shows 15% improvement in reading comprehension this week. Focus on longer stories to maintain progress.",
      type: "positive"
    },
    {
      title: "Writing Practice Needed",
      description: "Consider more handwriting exercises. Alex tends to struggle with letter spacing.",
      type: "suggestion"
    },
    {
      title: "Math Confidence",
      description: "Excellent progress in number recognition! Ready for addition and subtraction challenges.",
      type: "positive"
    }
  ];

  return (
    <div className="min-h-screen p-4 md:p-6 bg-background font-inter">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {childStats.name}'s Learning Dashboard
              </h1>
              <p className="text-muted-foreground">Track progress and insights</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4" />
              Notifications
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
            <Button variant="default" size="sm">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-foreground">{childStats.totalActivities}</div>
              <p className="text-sm text-muted-foreground">Total Activities</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="w-6 h-6 mx-auto mb-2 text-success" />
              <div className="text-2xl font-bold text-foreground">{childStats.totalTime}</div>
              <p className="text-sm text-muted-foreground">This Week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Award className="w-6 h-6 mx-auto mb-2 text-magic" />
              <div className="text-2xl font-bold text-foreground">{childStats.currentStreak}</div>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-accent" />
              <div className="text-2xl font-bold text-foreground">{childStats.averageScore}%</div>
              <p className="text-sm text-muted-foreground">Avg Score</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Module Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Learning Module Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {moduleProgress.map((module, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{module.name}</span>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{module.activities} activities</span>
                          <span>{module.timeSpent}</span>
                          <Badge variant="secondary" className="text-success">
                            {module.improvements}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={module.progress} className="h-2" />
                      <div className="text-right text-sm text-muted-foreground">
                        {module.progress}% complete
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {recentAchievements.map((achievement, index) => {
                    const Icon = achievement.icon;
                    return (
                      <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <Icon className={`w-8 h-8 ${achievement.color}`} />
                        <div>
                          <h4 className="font-medium">{achievement.title}</h4>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            {/* Weekly Activity Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Weekly Activity Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {weeklyActivity.map((day, index) => (
                    <div key={index} className="text-center">
                      <div className="text-sm font-medium mb-2">{day.day}</div>
                      <div 
                        className="bg-primary/20 rounded-lg p-2 h-16 flex flex-col justify-end"
                        style={{ 
                          background: `linear-gradient(to top, hsl(var(--primary)) ${day.activities * 25}%, transparent ${day.activities * 25}%)` 
                        }}
                      >
                        <div className="text-xs font-medium">{day.activities}</div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{day.time}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            {/* AI Insights */}
            <div className="space-y-4">
              {aiInsights.map((insight, index) => (
                <Card key={index} className={`border-l-4 ${
                  insight.type === 'positive' ? 'border-l-success' : 'border-l-accent'
                }`}>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">{insight.title}</h4>
                    <p className="text-muted-foreground">{insight.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Download detailed reports about your child's learning progress and recommendations.
                </p>
                <div className="flex gap-4">
                  <Button variant="default">
                    <Download className="w-4 h-4 mr-2" />
                    Weekly Report (PDF)
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Progress Data (CSV)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};