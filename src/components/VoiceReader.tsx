import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  VolumeX,
  SkipBack,
  SkipForward,
  Settings
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface VoiceReaderProps {
  text: string;
  onWordHighlight?: (wordIndex: number) => void;
  onComplete?: () => void;
  autoPlay?: boolean;
  showControls?: boolean;
}

export const VoiceReader = ({ 
  text, 
  onWordHighlight, 
  onComplete, 
  autoPlay = false,
  showControls = true 
}: VoiceReaderProps) => {
  const { language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [speed, setSpeed] = useState(1.0);
  const [showSettings, setShowSettings] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  
  const words = text.split(' ');

  // Generate speech and get word timings
  const generateSpeech = async (textToSpeak: string, playImmediately = false) => {
    try {
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: textToSpeak,
          language: language,
          speed: speed,
          voice_id: getVoiceIdForLanguage(language)
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }
      
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const newAudio = new Audio(audioUrl);
      
      newAudio.volume = volume;
      
      newAudio.onended = () => {
        setIsPlaying(false);
        setCurrentWordIndex(0);
        onComplete?.();
      };
      
      // Simulate word timing based on speech rate
      newAudio.ontimeupdate = () => {
        if (newAudio.duration) {
          const progress = newAudio.currentTime / newAudio.duration;
          const wordIndex = Math.floor(progress * words.length);
          if (wordIndex !== currentWordIndex && wordIndex < words.length) {
            setCurrentWordIndex(wordIndex);
            onWordHighlight?.(wordIndex);
          }
        }
      };
      
      setAudio(newAudio);
      
      if (playImmediately) {
        newAudio.play();
        setIsPlaying(true);
      }
      
      return newAudio;
    } catch (error) {
      console.error('Error generating speech:', error);
      return null;
    }
  };

  const getVoiceIdForLanguage = (lang: string) => {
    const voiceMap = {
      en: 'EXAVITQu4vr4xnSDxMaL', // Sarah
      hi: '9BWtsMINqrJLrRacOk9x', // Aria (multilingual)
      ta: '9BWtsMINqrJLrRacOk9x', // Aria (multilingual)  
      te: '9BWtsMINqrJLrRacOk9x', // Aria (multilingual)
      kn: '9BWtsMINqrJLrRacOk9x', // Aria (multilingual)
    };
    return voiceMap[lang] || voiceMap.en;
  };

  useEffect(() => {
    if (autoPlay && text) {
      handlePlay();
    }
  }, [autoPlay, text]);

  useEffect(() => {
    if (audio) {
      audio.volume = volume;
    }
  }, [volume, audio]);

  const handlePlay = async () => {
    if (!audio) {
      await generateSpeech(text, true);
    } else if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      setCurrentWordIndex(0);
    }
  };

  const handleSkipForward = () => {
    if (audio && audio.duration) {
      audio.currentTime = Math.min(audio.currentTime + 5, audio.duration);
    }
  };

  const handleSkipBackward = () => {
    if (audio) {
      audio.currentTime = Math.max(audio.currentTime - 5, 0);
    }
  };

  const renderHighlightedText = () => {
    return words.map((word, index) => (
      <span
        key={index}
        className={`${
          index === currentWordIndex 
            ? 'bg-primary text-primary-foreground px-1 rounded' 
            : index < currentWordIndex 
            ? 'text-muted-foreground' 
            : 'text-foreground'
        } transition-colors duration-200`}
      >
        {word}{' '}
      </span>
    ));
  };

  if (!showControls) {
    return (
      <div className="space-y-4">
        <div className="text-lg leading-relaxed font-inter">
          {renderHighlightedText()}
        </div>
        <div className="flex justify-center">
          <Button
            onClick={isPlaying ? handlePause : handlePlay}
            variant="kid"
            size="lg"
            className="rounded-full"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Text Display with Highlighting */}
      <Card>
        <CardContent className="p-6">
          <div className="text-lg leading-relaxed font-inter">
            {renderHighlightedText()}
          </div>
        </CardContent>
      </Card>

      {/* Audio Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSkipBackward}
              disabled={!audio}
            >
              <SkipBack className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={isPlaying ? handlePause : handlePlay}
              variant="kid"
              size="lg"
              className="rounded-full"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleStop}
              disabled={!audio}
            >
              <Square className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleSkipForward}
              disabled={!audio}
            >
              <SkipForward className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    {volume > 0 ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    Volume
                  </span>
                  <Badge variant="outline">{Math.round(volume * 100)}%</Badge>
                </div>
                <Slider
                  value={[volume]}
                  onValueChange={(value) => setVolume(value[0])}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Speed</span>
                  <Badge variant="outline">{speed}x</Badge>
                </div>
                <Slider
                  value={[speed]}
                  onValueChange={(value) => setSpeed(value[0])}
                  min={0.5}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {audio && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Word {currentWordIndex + 1} of {words.length}</span>
                <span>{Math.round((currentWordIndex / words.length) * 100)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary rounded-full h-2 transition-all duration-200"
                  style={{ width: `${(currentWordIndex / words.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};