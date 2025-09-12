import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Star, 
  Award, 
  Medal, 
  Crown, 
  Zap, 
  Heart, 
  Target,
  BookOpen,
  Gamepad2,
  Music,
  PenTool,
  Calculator
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Reward {
  id: string;
  type: 'badge' | 'achievement' | 'milestone';
  title: string;
  description: string;
  icon: React.ReactNode;
  earned: boolean;
  earnedDate?: Date;
  progress?: number;
  maxProgress?: number;
  category: 'reading' | 'games' | 'math' | 'writing' | 'music' | 'general';
}

interface RewardsSystemProps {
  userPoints: number;
  userLevel: number;
  completedActivities: string[];
  onRewardEarned?: (reward: Reward) => void;
}

export const RewardsSystem = ({ 
  userPoints = 0, 
  userLevel = 1, 
  completedActivities = [],
  onRewardEarned 
}: RewardsSystemProps) => {
  const { t } = useLanguage();
  const [rewards, setRewards] = useState<Reward[]>([
    {
      id: 'first-story',
      type: 'badge',
      title: 'Story Reader',
      description: 'Read your first story',
      icon: <BookOpen className="w-6 h-6" />,
      earned: false,
      category: 'reading'
    },
    {
      id: 'game-master',
      type: 'badge',
      title: 'Game Master',
      description: 'Complete 5 games',
      icon: <Gamepad2 className="w-6 h-6" />,
      earned: false,
      progress: 0,
      maxProgress: 5,
      category: 'games'
    },
    {
      id: 'math-genius',
      type: 'badge',
      title: 'Math Genius',
      description: 'Solve 10 math problems correctly',
      icon: <Calculator className="w-6 h-6" />,
      earned: false,
      progress: 0,
      maxProgress: 10,
      category: 'math'
    },
    {
      id: 'writing-star',
      type: 'badge',
      title: 'Writing Star',
      description: 'Complete 3 writing exercises',
      icon: <PenTool className="w-6 h-6" />,
      earned: false,
      progress: 0,
      maxProgress: 3,
      category: 'writing'
    },
    {
      id: 'music-lover',
      type: 'badge',
      title: 'Music Lover',
      description: 'Complete rhythm games',
      icon: <Music className="w-6 h-6" />,
      earned: false,
      category: 'music'
    },
    {
      id: 'daily-learner',
      type: 'achievement',
      title: 'Daily Learner',
      description: 'Learn for 7 days in a row',
      icon: <Zap className="w-6 h-6" />,
      earned: false,
      progress: 0,
      maxProgress: 7,
      category: 'general'
    },
    {
      id: 'point-collector',
      type: 'milestone',
      title: 'Point Collector',
      description: 'Earn 1000 points',
      icon: <Star className="w-6 h-6" />,
      earned: false,
      progress: userPoints,
      maxProgress: 1000,
      category: 'general'
    },
    {
      id: 'level-up-champion',
      type: 'milestone',
      title: 'Champion',
      description: 'Reach Level 5',
      icon: <Crown className="w-6 h-6" />,
      earned: false,
      progress: userLevel,
      maxProgress: 5,
      category: 'general'
    }
  ]);

  const [showEarnedReward, setShowEarnedReward] = useState<Reward | null>(null);

  // Check for newly earned rewards
  useEffect(() => {
    const updatedRewards = rewards.map(reward => {
      let newProgress = reward.progress || 0;
      let earned = reward.earned;

      // Update progress based on activity
      switch (reward.id) {
        case 'first-story':
          earned = completedActivities.some(activity => activity.includes('reading'));
          break;
        case 'game-master':
          newProgress = completedActivities.filter(activity => activity.includes('game')).length;
          earned = newProgress >= (reward.maxProgress || 5);
          break;
        case 'math-genius':
          newProgress = completedActivities.filter(activity => activity.includes('math')).length;
          earned = newProgress >= (reward.maxProgress || 10);
          break;
        case 'writing-star':
          newProgress = completedActivities.filter(activity => activity.includes('writing')).length;
          earned = newProgress >= (reward.maxProgress || 3);
          break;
        case 'music-lover':
          earned = completedActivities.some(activity => activity.includes('music'));
          break;
        case 'point-collector':
          newProgress = userPoints;
          earned = userPoints >= (reward.maxProgress || 1000);
          break;
        case 'level-up-champion':
          newProgress = userLevel;
          earned = userLevel >= (reward.maxProgress || 5);
          break;
      }

      // Check if reward was just earned
      if (!reward.earned && earned) {
        const earnedReward = { ...reward, earned, progress: newProgress, earnedDate: new Date() };
        setTimeout(() => {
          setShowEarnedReward(earnedReward);
          onRewardEarned?.(earnedReward);
        }, 500);
        return earnedReward;
      }

      return { ...reward, progress: newProgress, earned };
    });

    setRewards(updatedRewards);
  }, [completedActivities, userPoints, userLevel, onRewardEarned]);

  const getCategoryColor = (category: string) => {
    const colors = {
      reading: 'bg-blue-500',
      games: 'bg-green-500',
      math: 'bg-purple-500',
      writing: 'bg-orange-500',
      music: 'bg-pink-500',
      general: 'bg-yellow-500'
    };
    return colors[category] || colors.general;
  };

  const earnedRewards = rewards.filter(r => r.earned);
  const totalRewards = rewards.length;
  const completionPercentage = (earnedRewards.length / totalRewards) * 100;

  return (
    <div className="space-y-6">
      {/* Earned Reward Popup */}
      {showEarnedReward && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md text-center animate-scale-in">
            <CardContent className="p-8">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-fredoka text-foreground mb-2">
                {t('rewards.badge')}
              </h2>
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full ${getCategoryColor(showEarnedReward.category)} flex items-center justify-center text-white`}>
                {showEarnedReward.icon}
              </div>
              <h3 className="text-xl font-fredoka text-foreground mb-2">
                {showEarnedReward.title}
              </h3>
              <p className="text-muted-foreground mb-6">
                {showEarnedReward.description}
              </p>
              <Button 
                onClick={() => setShowEarnedReward(null)}
                variant="kid"
                size="lg"
              >
                Awesome! ✨
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Overview Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            {t('child.rewards')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-fredoka text-foreground">{earnedRewards.length}</div>
              <div className="text-sm text-muted-foreground">Badges Earned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-fredoka text-foreground">{userPoints}</div>
              <div className="text-sm text-muted-foreground">{t('rewards.points')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-fredoka text-foreground">{userLevel}</div>
              <div className="text-sm text-muted-foreground">{t('game.level')}</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round(completionPercentage)}%</span>
            </div>
            <Progress value={completionPercentage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Rewards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {rewards.map((reward) => (
          <Card 
            key={reward.id}
            className={`card-interactive ${
              reward.earned 
                ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' 
                : 'opacity-60'
            }`}
          >
            <CardContent className="p-4 text-center">
              <div className={`w-12 h-12 mx-auto mb-3 rounded-full ${
                reward.earned 
                  ? getCategoryColor(reward.category)
                  : 'bg-muted'
              } flex items-center justify-center text-white`}>
                {reward.icon}
              </div>
              
              <h3 className="font-fredoka text-sm text-foreground mb-1">
                {reward.title}
              </h3>
              
              <p className="text-xs text-muted-foreground mb-3">
                {reward.description}
              </p>
              
              {reward.maxProgress && (
                <div className="space-y-1">
                  <Progress 
                    value={Math.min(((reward.progress || 0) / reward.maxProgress) * 100, 100)} 
                    className="h-2"
                  />
                  <div className="text-xs text-muted-foreground">
                    {reward.progress || 0} / {reward.maxProgress}
                  </div>
                </div>
              )}
              
              {reward.earned && (
                <Badge variant="secondary" className="text-xs mt-2">
                  <Medal className="w-3 h-3 mr-1" />
                  Earned!
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};