import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw,
  CheckCircle,
  Music,
  BookOpen,
  Video,
  Heart,
  Star,
  Repeat
} from "lucide-react";
import { useState } from "react";

interface VideoModuleProps {
  onBack: () => void;
}

export const VideoModule = ({ onBack }: VideoModuleProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentContent, setCurrentContent] = useState({ type: 'video', index: 0 });
  const [watchProgress, setWatchProgress] = useState(45);
  const [activeTab, setActiveTab] = useState('videos');

  const videos = [
    {
      id: 1,
      title: "Animal Friends Safari",
      description: "Join us on an exciting safari to meet amazing animals and learn their sounds",
      duration: "4:30",
      thumbnail: "🦁",
      completed: true,
      category: "Animals",
    },
    {
      id: 2,
      title: "Counting Adventure",
      description: "Count from 1 to 20 with fun animations and colorful objects",
      duration: "3:45",
      thumbnail: "🔢",
      completed: true,
      category: "Math",
    },
    {
      id: 3,
      title: "Colors & Shapes World",
      description: "Explore the magical world of colors and geometric shapes",
      duration: "5:12",
      thumbnail: "🎨",
      completed: false,
      category: "Art",
    },
    {
      id: 4,
      title: "Alphabet Adventure",
      description: "Journey through letters A-Z with fun characters and stories",
      duration: "6:30",
      thumbnail: "📝",
      completed: false,
      category: "Reading",
    },
    {
      id: 5,
      title: "Community Helpers",
      description: "Meet the heroes in our community and learn about their jobs",
      duration: "4:15",
      thumbnail: "👨‍🚒",
      completed: false,
      category: "Social",
    },
    {
      id: 6,
      title: "Weather Wonders",
      description: "Discover different types of weather and seasons",
      duration: "3:20",
      thumbnail: "☀️",
      completed: false,
      category: "Science",
    },
  ];

  const rhymes = [
    {
      id: 1,
      title: "Twinkle Twinkle Little Star",
      description: "Classic nursery rhyme about stars and wonder",
      duration: "2:30",
      thumbnail: "⭐",
      lyrics: [
        "Twinkle, twinkle, little star",
        "How I wonder what you are",
        "Up above the world so high",
        "Like a diamond in the sky",
        "Twinkle, twinkle, little star",
        "How I wonder what you are"
      ],
      completed: true,
    },
    {
      id: 2,
      title: "Old MacDonald Had a Farm",
      description: "Learn about farm animals and their sounds",
      duration: "3:15",
      thumbnail: "🚜",
      lyrics: [
        "Old MacDonald had a farm, E-I-E-I-O",
        "And on his farm he had a cow, E-I-E-I-O",
        "With a moo-moo here and a moo-moo there",
        "Here a moo, there a moo, everywhere a moo-moo",
        "Old MacDonald had a farm, E-I-E-I-O"
      ],
      completed: true,
    },
    {
      id: 3,
      title: "The Wheels on the Bus",
      description: "Interactive rhyme about transportation",
      duration: "2:45",
      thumbnail: "🚌",
      lyrics: [
        "The wheels on the bus go round and round",
        "Round and round, round and round",
        "The wheels on the bus go round and round",
        "All through the town"
      ],
      completed: false,
    },
    {
      id: 4,
      title: "If You're Happy and You Know It",
      description: "Fun action rhyme for movement and joy",
      duration: "2:20",
      thumbnail: "😊",
      lyrics: [
        "If you're happy and you know it, clap your hands",
        "If you're happy and you know it, clap your hands",
        "If you're happy and you know it",
        "Then your face will surely show it",
        "If you're happy and you know it, clap your hands"
      ],
      completed: false,
    },
  ];

  const musicTracks = [
    {
      id: 1,
      title: "ABC Song Dance",
      description: "Learn the alphabet with catchy music and dance moves",
      duration: "3:30",
      thumbnail: "🎵",
      genre: "Educational",
      completed: true,
    },
    {
      id: 2,
      title: "Number Rock",
      description: "Rock out while learning numbers 1-10",
      duration: "2:50",
      thumbnail: "🎸",
      genre: "Rock",
      completed: true,
    },
    {
      id: 3,
      title: "Color Symphony",
      description: "Beautiful classical music to learn colors",
      duration: "4:20",
      thumbnail: "🎼",
      genre: "Classical",
      completed: false,
    },
    {
      id: 4,
      title: "Shape Jazz",
      description: "Smooth jazz rhythms to explore geometric shapes",
      duration: "3:45",
      thumbnail: "🎺",
      genre: "Jazz",
      completed: false,
    },
    {
      id: 5,
      title: "Animal Sounds Orchestra",
      description: "Orchestra of animal sounds and instruments",
      duration: "5:10",
      thumbnail: "🎻",
      genre: "Orchestra",
      completed: false,
    },
  ];

  const getCurrentContent = () => {
    if (activeTab === 'videos') return videos[currentContent.index];
    if (activeTab === 'rhymes') return rhymes[currentContent.index];
    if (activeTab === 'music') return musicTracks[currentContent.index];
    return videos[0];
  };

  const getCurrentList = () => {
    if (activeTab === 'videos') return videos;
    if (activeTab === 'rhymes') return rhymes;
    if (activeTab === 'music') return musicTracks;
    return videos;
  };

  const currentData = getCurrentContent();
  const currentList = getCurrentList();

  const handleContentSelect = (index: number) => {
    setCurrentContent({ type: activeTab, index });
    setWatchProgress(0);
  };

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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="rhymes" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Rhymes
            </TabsTrigger>
            <TabsTrigger value="music" className="flex items-center gap-2">
              <Music className="w-4 h-4" />
              Music
            </TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="space-y-6">
            {/* Video Player */}
            <Card className="overflow-hidden">
              <div className="relative bg-gradient-to-br from-primary/20 to-accent/20 aspect-video flex items-center justify-center">
                <div className="text-6xl mb-4">{currentData.thumbnail}</div>
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
              
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-fredoka text-foreground">
                        {currentData.title}
                      </h3>
                      {'category' in currentData && (
                        <Badge variant="secondary">{currentData.category}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {currentData.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsMuted(!isMuted)}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
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
              <h2 className="text-xl font-fredoka text-foreground">Educational Videos</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {videos.map((video, index) => (
                  <Card 
                    key={video.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      index === currentContent.index && activeTab === 'videos' ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleContentSelect(index)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-2xl">
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
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">{video.category}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {video.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rhymes" className="space-y-6">
            {/* Rhyme Player */}
            <Card className="overflow-hidden">
              <div className="relative bg-gradient-to-br from-accent/20 to-primary/20 aspect-video flex items-center justify-center">
                <div className="text-6xl mb-4">{currentData.thumbnail}</div>
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
              
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-fredoka text-foreground mb-2">
                      {currentData.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {currentData.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Repeat className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Lyrics Display */}
                {'lyrics' in currentData && (
                  <div className="bg-muted/50 rounded-lg p-4 mb-4">
                    <h4 className="text-sm font-medium text-foreground mb-2">Lyrics:</h4>
                    <div className="space-y-1">
                      {currentData.lyrics.map((line: string, index: number) => (
                        <p key={index} className="text-sm text-muted-foreground">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
                
                <Progress value={watchProgress} className="h-2" />
              </CardContent>
            </Card>

            {/* Rhymes List */}
            <div className="grid gap-4">
              <h2 className="text-xl font-fredoka text-foreground">Nursery Rhymes</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {rhymes.map((rhyme, index) => (
                  <Card 
                    key={rhyme.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      index === currentContent.index && activeTab === 'rhymes' ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleContentSelect(index)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center text-2xl">
                          {rhyme.thumbnail}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-base font-fredoka text-foreground">
                              {rhyme.title}
                            </h4>
                            {rhyme.completed && (
                              <CheckCircle className="w-4 h-4 text-success" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {rhyme.description}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {rhyme.duration}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="music" className="space-y-6">
            {/* Music Player */}
            <Card className="overflow-hidden">
              <div className="relative bg-gradient-to-br from-purple-500/20 to-pink-500/20 aspect-video flex items-center justify-center">
                <div className="text-6xl mb-4">{currentData.thumbnail}</div>
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
              
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-fredoka text-foreground">
                        {currentData.title}
                      </h3>
                      {'genre' in currentData && (
                        <Badge variant="secondary">{currentData.genre}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {currentData.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Star className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <Progress value={watchProgress} className="h-2" />
              </CardContent>
            </Card>

            {/* Music List */}
            <div className="grid gap-4">
              <h2 className="text-xl font-fredoka text-foreground">Educational Music</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {musicTracks.map((track, index) => (
                  <Card 
                    key={track.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      index === currentContent.index && activeTab === 'music' ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleContentSelect(index)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-2xl">
                          {track.thumbnail}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-base font-fredoka text-foreground">
                              {track.title}
                            </h4>
                            {track.completed && (
                              <CheckCircle className="w-4 h-4 text-success" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {track.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">{track.genre}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {track.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};