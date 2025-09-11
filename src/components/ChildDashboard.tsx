import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  BookOpen, 
  Gamepad2, 
  Star, 
  Trophy,
  Award,
  Target
} from "lucide-react";
import owlMascot from "@/assets/owl-mascot.jpg";

interface ChildDashboardProps {
  onModuleSelect: (module: string) => void;
}

export const ChildDashboard = ({ onModuleSelect }: ChildDashboardProps) => {
  const activityCards = [
    {
      id: 'video',
      title: 'Watch & Learn',
      description: 'Fun educational videos',
      icon: Play,
      bgGradient: 'gradient-primary',
      progress: 65,
    },
    {
      id: 'reading',
      title: 'Reading Quiz',
      description: 'Test your reading skills',
      icon: BookOpen,
      bgGradient: 'gradient-success',
      progress: 80,
    },
    {
      id: 'game',
      title: 'Learning Games',
      description: 'Play and learn together',
      icon: Gamepad2,
      bgGradient: 'gradient-magic',
      progress: 45,
    },
  ];

  const achievements = [
    { title: 'Reading Champion', icon: Star, count: 12 },
    { title: 'Quiz Master', icon: Trophy, count: 8 },
    { title: 'Game Winner', icon: Award, count: 15 },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Avatar & Greeting */}
      <div className="text-center pt-8 pb-6 px-4">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden shadow-soft bounce-gentle">
          <img 
            src={owlMascot} 
            alt="Learning buddy" 
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 font-fredoka">
          Hi there, Superstar! 🌟
        </h1>
        <p className="text-base text-muted-foreground font-inter">
          Ready to learn something amazing today?
        </p>
      </div>

      {/* Activity Cards */}
      <div className="flex-1 px-4 pb-4">
        <div className="space-y-4 max-w-md mx-auto">
          {activityCards.map((activity) => {
            const Icon = activity.icon;
            
            return (
              <Card 
                key={activity.id}
                className="card-interactive bg-card border-2 border-transparent hover:border-primary/20 min-h-[120px]"
                onClick={() => onModuleSelect(activity.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-card ${activity.bgGradient} flex items-center justify-center shadow-soft flex-shrink-0`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-fredoka text-foreground mb-1">
                        {activity.title}
                      </h3>
                      <p className="text-base text-muted-foreground font-inter mb-3">
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Progress value={activity.progress} className="flex-1 h-2" />
                        <span className="text-sm font-medium text-foreground">
                          {activity.progress}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Bottom Bar - Rewards & Progress */}
      <div className="bg-card border-t border-border px-4 py-4">
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-2 gap-4">
            {/* Rewards Section */}
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-accent-foreground" />
                </div>
              </div>
              <h4 className="text-lg font-fredoka text-foreground mb-1">Rewards</h4>
              <div className="flex justify-center gap-1">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <div key={index} className="flex items-center gap-1">
                      <Icon className="w-4 h-4 text-accent" />
                      <span className="text-sm font-medium text-foreground">{achievement.count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Progress Section */}
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
              <h4 className="text-lg font-fredoka text-foreground mb-1">Progress</h4>
              <div className="space-y-1">
                <Progress value={75} className="h-2" />
                <p className="text-sm text-muted-foreground">Daily Goal: 75%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};