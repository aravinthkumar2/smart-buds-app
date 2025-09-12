import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Users, 
  BookOpen, 
  TrendingUp, 
  Award,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  Download,
  Plus
} from "lucide-react";

interface TeacherDashboardProps {
  onBack: () => void;
}

export const TeacherDashboard = ({ onBack }: TeacherDashboardProps) => {
  const [selectedClass, setSelectedClass] = useState("Class 5A");

  const students = [
    {
      id: 1,
      name: "Emma Johnson",
      avatar: "👧",
      progress: 85,
      difficulty: "Dyslexia",
      status: "active",
      lastActivity: "2 hours ago",
      completedModules: 12,
      totalModules: 15,
      weeklyGoal: 90
    },
    {
      id: 2,
      name: "Alex Chen",
      avatar: "👦",
      progress: 92,
      difficulty: "Dyscalculia",
      status: "active",
      lastActivity: "1 hour ago",
      completedModules: 14,
      totalModules: 15,
      weeklyGoal: 95
    },
    {
      id: 3,
      name: "Sofia Rodriguez",
      avatar: "👧",
      progress: 67,
      difficulty: "Dysgraphia",
      status: "needs-attention",
      lastActivity: "1 day ago",
      completedModules: 8,
      totalModules: 15,
      weeklyGoal: 80
    },
    {
      id: 4,
      name: "Marcus Williams",
      avatar: "👦",
      progress: 78,
      difficulty: "ADHD",
      status: "active",
      lastActivity: "30 min ago",
      completedModules: 10,
      totalModules: 15,
      weeklyGoal: 85
    }
  ];

  const classStats = {
    totalStudents: 24,
    activeToday: 18,
    avgProgress: 81,
    completionRate: 73
  };

  const recentActivities = [
    {
      student: "Emma Johnson",
      activity: "Completed Word Matching Game",
      score: 95,
      time: "2 hours ago",
      module: "Reading"
    },
    {
      student: "Alex Chen",
      activity: "Finished Math Puzzle Level 5",
      score: 88,
      time: "1 hour ago",
      module: "Math"
    },
    {
      student: "Sofia Rodriguez",
      activity: "Started Handwriting Practice",
      score: null,
      time: "1 day ago",
      module: "Writing"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="text-center">
          <h1 className="text-xl font-fredoka text-foreground">Teacher Dashboard</h1>
          <p className="text-sm text-muted-foreground">{selectedClass}</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-primary flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-foreground" />
              </div>
              <p className="text-2xl font-fredoka text-foreground">{classStats.totalStudents}</p>
              <p className="text-sm text-muted-foreground">Total Students</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-success flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success-foreground" />
              </div>
              <p className="text-2xl font-fredoka text-foreground">{classStats.activeToday}</p>
              <p className="text-sm text-muted-foreground">Active Today</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-accent flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-accent-foreground" />
              </div>
              <p className="text-2xl font-fredoka text-foreground">{classStats.avgProgress}%</p>
              <p className="text-sm text-muted-foreground">Avg Progress</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-warning flex items-center justify-center">
                <Award className="w-6 h-6 text-warning-foreground" />
              </div>
              <p className="text-2xl font-fredoka text-foreground">{classStats.completionRate}%</p>
              <p className="text-sm text-muted-foreground">Completion</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="students" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="activities">Recent Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="students" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-fredoka text-foreground">Student Progress</h2>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Student
              </Button>
            </div>
            
            <div className="grid gap-4">
              {students.map((student) => (
                <Card key={student.id} className="card-interactive">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{student.avatar}</div>
                        <div>
                          <h3 className="font-fredoka text-foreground">{student.name}</h3>
                          <div className="flex items-center gap-2 text-sm">
                            <Badge 
                              variant={student.status === 'active' ? 'secondary' : 'destructive'}
                              className="text-xs"
                            >
                              {student.difficulty}
                            </Badge>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-muted-foreground">{student.lastActivity}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Progress</p>
                        <p className="text-lg font-fredoka text-foreground">{student.progress}%</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Weekly Goal: {student.weeklyGoal}%</span>
                        <span className="text-foreground">{student.completedModules}/{student.totalModules} modules</span>
                      </div>
                      <Progress value={student.progress} className="h-2" />
                    </div>
                    
                    {student.status === 'needs-attention' && (
                      <div className="mt-3 p-2 bg-warning/10 border border-warning/20 rounded-lg flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-warning" />
                        <span className="text-sm text-warning-foreground">Needs attention - Low activity</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Class Performance Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-fredoka text-foreground mb-2">Module Completion Rates</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Reading</span>
                        <span className="text-sm font-medium">89%</span>
                      </div>
                      <Progress value={89} className="h-2" />
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Math</span>
                        <span className="text-sm font-medium">76%</span>
                      </div>
                      <Progress value={76} className="h-2" />
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Writing</span>
                        <span className="text-sm font-medium">68%</span>
                      </div>
                      <Progress value={68} className="h-2" />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-fredoka text-foreground mb-2">Learning Difficulties</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Dyslexia</span>
                        <Badge variant="secondary">8 students</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Dyscalculia</span>
                        <Badge variant="secondary">5 students</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Dysgraphia</span>
                        <Badge variant="secondary">6 students</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ADHD</span>
                        <Badge variant="secondary">5 students</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="activities" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Student Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium text-foreground">{activity.student}</p>
                        <p className="text-sm text-muted-foreground">{activity.activity}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{activity.module}</Badge>
                        {activity.score && (
                          <p className="text-sm text-muted-foreground mt-1">Score: {activity.score}%</p>
                        )}
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};