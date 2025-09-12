import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, CommandIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface VoiceNavigationProps {
  onVoiceCommand: (command: string) => void;
  isListening?: boolean;
}

export const VoiceNavigation = ({ onVoiceCommand }: VoiceNavigationProps) => {
  const { t, language } = useLanguage();
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [showCommands, setShowCommands] = useState(false);

  const voiceCommands = {
    en: { 'reading': 'reading', 'games': 'games', 'home': 'home' },
    hi: { 'पढ़ना': 'reading', 'खेल': 'games', 'घर': 'home' },
    ta: { 'படித்தல்': 'reading', 'விளையாட்டு': 'games', 'வீடு': 'home' },
    te: { 'చదవడం': 'reading', 'ఆటలు': 'games', 'ఇల్లు': 'home' },
    kn: { 'ಓದುವುದು': 'reading', 'ಆಟಗಳು': 'games', 'ಮನೆ': 'home' }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'en' ? 'en-US' : `${language}-IN`;
      
      recognition.onstart = () => setIsVoiceActive(true);
      recognition.onend = () => setIsVoiceActive(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        const commands = voiceCommands[language] || voiceCommands.en;
        
        for (const [phrase, action] of Object.entries(commands)) {
          if (transcript.includes(phrase.toLowerCase())) {
            onVoiceCommand(action);
            break;
          }
        }
      };
      
      recognition.start();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex flex-col items-end gap-2">
        {showCommands && (
          <Card className="w-64">
            <CardContent className="p-4">
              <h4 className="font-fredoka text-foreground mb-2">Voice Commands</h4>
              <div className="space-y-1 text-sm">
                {Object.keys(voiceCommands[language] || voiceCommands.en).map((command) => (
                  <Badge key={command} variant="outline" className="text-xs mr-1">{command}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowCommands(!showCommands)}>
            <CommandIcon className="w-4 h-4" />
          </Button>
          
          <Button
            variant={isVoiceActive ? "destructive" : "default"}
            size="lg"
            className="w-14 h-14 rounded-full shadow-lg"
            onClick={startListening}
          >
            {isVoiceActive ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </Button>
        </div>
        
        {isVoiceActive && (
          <Badge variant="secondary" className="animate-pulse">Listening...</Badge>
        )}
      </div>
    </div>
  );
};