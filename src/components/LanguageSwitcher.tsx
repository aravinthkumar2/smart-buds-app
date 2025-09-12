import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Languages, Volume2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

export const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
  ];

  const currentLang = languages.find(lang => lang.code === language);

  const speakLanguage = async (langCode: string, text: string) => {
    try {
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          language: langCode
        }),
      });
      
      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      }
    } catch (error) {
      console.error('Error playing language sample:', error);
    }
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <Languages className="w-4 h-4" />
        <span className="text-lg">{currentLang?.flag}</span>
        <span className="hidden sm:inline">{currentLang?.name}</span>
      </Button>
    );
  }

  return (
    <Card className="fixed top-4 right-4 z-50 w-80">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-fredoka text-foreground">Choose Language</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </Button>
        </div>
        
        <div className="space-y-2">
          {languages.map((lang) => (
            <div
              key={lang.code}
              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                language === lang.code 
                  ? 'bg-primary/10 border-primary' 
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => {
                setLanguage(lang.code as any);
                setIsOpen(false);
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{lang.flag}</span>
                <span className="font-fredoka text-foreground">{lang.name}</span>
              </div>
              
              <div className="flex items-center gap-2">
                {language === lang.code && (
                  <Badge variant="secondary" className="text-xs">Active</Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    speakLanguage(lang.code, lang.name);
                  }}
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};