import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw,
  CheckCircle
} from "lucide-react";
import { useState } from "react";

interface VideoModuleProps {
  onBack: () => void;
}

export const VideoModule = ({ onBack }: VideoModuleProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [watchProgress, setWatchProgress] = useState(45);

  const videos = [
    {
      id: 1,
      title: "Animal Friends",
      description: "Learn about different animals and their sounds",
      duration: "3:24",
      thumbnail: "🦁",
      completed: true,
    },
    {
      id: 2,
      title: "Counting Fun",
      description: "Count from 1 to 10 with colorful objects",
      duration: "2:45",
      thumbnail: "🔢",
      completed: true,
    },
    {
      id: 3,
      title: "Colors & Shapes",
      description: "Discover beautiful colors and basic shapes",
      duration: "4:12",
      thumbnail: "🎨",
      completed: false,
    },
    {
      id: 4,
      title: "Letter Adventure",
      description: "Journey through the alphabet with fun characters",
      duration: "5:30",
      thumbnail: "📝",
      completed: false,
    },
  ];

  const currentVideoData = videos[currentVideo];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <h1 className="text-xl font-fredoka text-foreground">Watch & Learn</h1>
        <div className="w-16" />
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Video Player */}
        <Card className="overflow-hidden">
          <div className="relative bg-gradient-to-br from-primary/20 to-accent/20 aspect-video flex items-center justify-center">
            <div className="text-6xl mb-4">{currentVideoData.thumbnail}</div>
            <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
              <Button
                variant="default"
                size="xl"
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-20 h-20 rounded-full"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8" />
                )}
              </Button>
            </div>
          </div>
          
          {/* Video Controls */}
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-fredoka text-foreground">
                  {currentVideoData.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {currentVideoData.description}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setWatchProgress(0)}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-foreground font-medium">{watchProgress}%</span>
              </div>
              <Progress value={watchProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Video List */}
        <div className="grid gap-4">
          <h2 className="text-xl font-fredoka text-foreground">More Videos</h2>
          {videos.map((video, index) => (
            <Card 
              key={video.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                index === currentVideo ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setCurrentVideo(index)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-card bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-2xl">
                    {video.thumbnail}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-base font-fredoka text-foreground">
                        {video.title}
                      </h4>
                      {video.completed && (
                        <CheckCircle className="w-4 h-4 text-success" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {video.description}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      Duration: {video.duration}
                    </span>
                  </div>
                  <Button
                    variant={index === currentVideo ? "default" : "outline"}
                    size="sm"
                  >
                    {index === currentVideo ? "Playing" : "Watch"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};