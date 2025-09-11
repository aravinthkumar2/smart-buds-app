import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  PenTool, 
  Calculator, 
  Music, 
  Star, 
  Trophy,
  Volume2,
  Globe
} from "lucide-react";
import learningIcons from "@/assets/learning-icons.jpg";

interface ChildDashboardProps {
  onModuleSelect: (module: string) => void;
}

export const ChildDashboard = ({ onModuleSelect }: ChildDashboardProps) => {
  const learningModules = [
    {
      id: 'reading',
      title: 'Reading Stories',
      description: 'Listen to fun stories and learn new words!',
      icon: BookOpen,
      progress: 65,
      color: 'bg-primary',
      bgGradient: 'gradient-primary',
      completedLessons: 13,
      totalLessons: 20,
    },
    {
      id: 'writing',
      title: 'Writing Practice',
      description: 'Practice writing letters and words!',
      icon: PenTool,
      progress: 40,
      color: 'bg-secondary',
      bgGradient: 'gradient-success',
      completedLessons: 8,
      totalLessons: 20,
    },
    {
      id: 'math',
      title: 'Math Puzzles',
      description: 'Solve fun number puzzles and games!',
      icon: Calculator,
      progress: 30,
      color: 'bg-magic',
      bgGradient: 'gradient-magic',
      completedLessons: 6,
      totalLessons: 20,
    },
    {
      id: 'music',
      title: 'Music & Sounds',
      description: 'Learn with songs and musical games!',
      icon: Music,
      progress: 80,
      color: 'bg-reward',
      bgGradient: 'gradient-success',
      completedLessons: 16,
      totalLessons: 20,
    },
  ];

  const achievements = [
    { title: 'Reading Star', icon: Star, color: 'text-yellow-500' },
    { title: 'Math Genius', icon: Calculator, color: 'text-purple-500' },
    { title: 'Writing Pro', icon: PenTool, color: 'text-green-500' },
  ];

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <img 
              src={learningIcons} 
              alt="Learning activities" 
              className="w-20 h-20 object-cover rounded-full shadow-soft bounce-gentle"
            />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-2 font-fredoka">
            Hi there, Superstar! 🌟
          </h1>
          <p className="text-lg text-muted-foreground font-inter">
            Ready to learn something amazing today?
          </p>
          
          {/* Language and Accessibility Controls */}
          <div className="flex justify-center gap-4 mt-4">
            <Button variant="outline" size="sm">
              <Globe className="w-4 h-4" />
              English
            </Button>
            <Button variant="outline" size="sm">
              <Volume2 className="w-4 h-4" />
              Read Aloud
            </Button>
          </div>
        </div>

        {/* Achievements Row */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-foreground font-fredoka flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Your Awesome Achievements!
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <Badge 
                  key={index} 
                  className="flex items-center gap-2 py-2 px-4 text-sm font-medium whitespace-nowrap pulse-soft"
                  variant="secondary"
                >
                  <Icon className={`w-4 h-4 ${achievement.color}`} />
                  {achievement.title}
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Learning Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {learningModules.map((module) => {
            const Icon = module.icon;
            
            return (
              <Card 
                key={module.id}
                className="card-interactive bg-card/80 backdrop-blur-sm border-2 border-transparent hover:border-primary/20"
                onClick={() => onModuleSelect(module.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-card ${module.bgGradient} flex items-center justify-center shadow-soft`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge className="bg-success text-success-foreground">
                      {module.completedLessons}/{module.totalLessons}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-fredoka text-foreground">
                    {module.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 font-inter">
                    {module.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="text-foreground font-medium">{module.progress}%</span>
                    </div>
                    <Progress value={module.progress} className="h-2" />
                  </div>
                  
                  <Button 
                    variant="kid" 
                    size="sm" 
                    className="w-full mt-4"
                  >
                    Continue Learning! 
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Daily Goal */}
        <div className="mt-8">
          <Card className="bg-gradient-to-r from-success/10 to-primary/10 border-success/20">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-2 text-foreground font-fredoka">
                Today's Goal 🎯
              </h3>
              <p className="text-muted-foreground mb-4 font-inter">
                Complete 2 more activities to earn your daily star!
              </p>
              <Progress value={60} className="max-w-xs mx-auto h-3" />
              <p className="text-sm text-muted-foreground mt-2">3 out of 5 activities completed</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};