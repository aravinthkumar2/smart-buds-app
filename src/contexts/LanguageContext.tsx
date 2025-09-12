import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi' | 'ta' | 'te' | 'kn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.back': 'Back',
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    
    // Welcome Screen
    'welcome.title': 'AI Learning Companion',
    'welcome.subtitle': 'Helping children with learning difficulties',
    'welcome.child': 'I am a Child',
    'welcome.parent': 'I am a Parent',
    'welcome.teacher': 'I am a Teacher',
    
    // Child Dashboard
    'child.welcome': 'Welcome back',
    'child.learning': 'Keep Learning!',
    'child.reading': 'Reading Stories',
    'child.video': 'Learning Videos',
    'child.games': 'Fun Games',
    'child.writing': 'Writing Practice',
    'child.math': 'Math Fun',
    'child.music': 'Music Time',
    'child.rewards': 'My Rewards',
    'child.progress': 'Progress',
    
    // Games
    'game.wordMatch': 'Word Matching',
    'game.numberPuzzle': 'Number Puzzles',
    'game.colorMemory': 'Color Memory',
    'game.score': 'Score',
    'game.level': 'Level',
    'game.playAgain': 'Play Again',
    'game.finish': 'Finish',
    
    // Reading
    'reading.title': 'Reading Stories',
    'reading.listen': 'Listen to Story',
    'reading.read': 'Read Along',
    'reading.quiz': 'Take Quiz',
    
    // Voice Commands
    'voice.listening': 'Listening...',
    'voice.speak': 'Speak Now',
    'voice.commands': 'Voice Commands',
    
    // Rewards
    'rewards.badge': 'Badge Earned!',
    'rewards.points': 'Points',
    'rewards.level': 'Level Up!',
  },
  hi: {
    // Navigation (Hindi - Devanagari)
    'nav.back': 'वापस',
    'nav.home': 'घर',
    'nav.dashboard': 'डैशबोर्ड',
    
    // Welcome Screen
    'welcome.title': 'AI शिक्षा साथी',
    'welcome.subtitle': 'सीखने की कठिनाइयों वाले बच्चों की मदद करना',
    'welcome.child': 'मैं एक बच्चा हूँ',
    'welcome.parent': 'मैं एक माता-पिता हूँ',
    'welcome.teacher': 'मैं एक शिक्षक हूँ',
    
    // Child Dashboard
    'child.welcome': 'वापसी पर स्वागत',
    'child.learning': 'सीखते रहें!',
    'child.reading': 'कहानियाँ पढ़ना',
    'child.video': 'शिक्षा वीडियो',
    'child.games': 'मजेदार खेल',
    'child.writing': 'लेखन अभ्यास',
    'child.math': 'गणित मजा',
    'child.music': 'संगीत समय',
    'child.rewards': 'मेरे पुरस्कार',
    'child.progress': 'प्रगति',
    
    // Games
    'game.wordMatch': 'शब्द मिलान',
    'game.numberPuzzle': 'संख्या पहेलियाँ',
    'game.colorMemory': 'रंग स्मृति',
    'game.score': 'अंक',
    'game.level': 'स्तर',
    'game.playAgain': 'फिर से खेलें',
    'game.finish': 'समाप्त',
    
    // Reading
    'reading.title': 'कहानियाँ पढ़ना',
    'reading.listen': 'कहानी सुनें',
    'reading.read': 'साथ पढ़ें',
    'reading.quiz': 'प्रश्नोत्तरी लें',
    
    // Voice Commands
    'voice.listening': 'सुन रहा है...',
    'voice.speak': 'अब बोलें',
    'voice.commands': 'आवाज़ कमांड',
    
    // Rewards
    'rewards.badge': 'बैज मिला!',
    'rewards.points': 'अंक',
    'rewards.level': 'स्तर बढ़ा!',
  },
  ta: {
    // Navigation (Tamil)
    'nav.back': 'திரும்பு',
    'nav.home': 'வீடு',
    'nav.dashboard': 'டாஷ்போர்டு',
    
    // Welcome Screen
    'welcome.title': 'AI கற்றல் துணை',
    'welcome.subtitle': 'கற்றல் சிரமங்களுடன் இருக்கும் குழந்தைகளுக்கு உதவுதல்',
    'welcome.child': 'நான் ஒரு குழந்தை',
    'welcome.parent': 'நான் ஒரு பெற்றோர்',
    'welcome.teacher': 'நான் ஒரு ஆசிரியர்',
    
    // Child Dashboard
    'child.welcome': 'மீண்டும் வரவேற்கிறோம்',
    'child.learning': 'கற்றுக்கொண்டே இருங்கள்!',
    'child.reading': 'கதைகள் படித்தல்',
    'child.video': 'கற்றல் வீடியோக்கள்',
    'child.games': 'வேடிக்கையான விளையாட்டுகள்',
    'child.writing': 'எழுதும் பயிற்சி',
    'child.math': 'கணித வேடிக்கை',
    'child.music': 'இசை நேரம்',
    'child.rewards': 'என் பரிசுகள்',
    'child.progress': 'முன்னேற்றம்',
    
    // Games
    'game.wordMatch': 'சொல் பொருத்தம்',
    'game.numberPuzzle': 'எண் புதிர்கள்',
    'game.colorMemory': 'நிற நினைவு',
    'game.score': 'மதிப்பெண்',
    'game.level': 'நிலை',
    'game.playAgain': 'மீண்டும் விளையாடு',
    'game.finish': 'முடிக்க',
    
    // Reading
    'reading.title': 'கதைகள் படித்தல்',
    'reading.listen': 'கதை கேளுங்கள்',
    'reading.read': 'சேர்ந்து படிக்கவும்',
    'reading.quiz': 'வினாடி வினா எடுக்கவும்',
    
    // Voice Commands
    'voice.listening': 'கேட்டுக்கொண்டிருக்கிறது...',
    'voice.speak': 'இப்போது பேசுங்கள்',
    'voice.commands': 'குரல் கட்டளைகள்',
    
    // Rewards
    'rewards.badge': 'பேட்ஜ் பெற்றீர்கள்!',
    'rewards.points': 'புள்ளிகள்',
    'rewards.level': 'நிலை உயர்வு!',
  },
  te: {
    // Navigation (Telugu)
    'nav.back': 'వెనుకకు',
    'nav.home': 'ఇల్లు',
    'nav.dashboard': 'డాష్‌బోర్డ్',
    
    // Welcome Screen
    'welcome.title': 'AI అభ్యాస సహాయకుడు',
    'welcome.subtitle': 'అభ్యాస కష్టాలతో ఉన్న పిల్లలకు సహాయం',
    'welcome.child': 'నేను ఒక పిల్లవాడిని',
    'welcome.parent': 'నేను తల్లిదండ్రులను',
    'welcome.teacher': 'నేను ఒక ఉపాధ్యాయుడను',
    
    // Child Dashboard
    'child.welcome': 'తిరిగి స్వాగతం',
    'child.learning': 'నేర్చుకోవడం కొనసాగించండి!',
    'child.reading': 'కథలు చదవడం',
    'child.video': 'అభ్యాస వీడియోలు',
    'child.games': 'సరదా ఆటలు',
    'child.writing': 'వ్రాత అభ్యాసం',
    'child.math': 'గణిత సరదా',
    'child.music': 'సంగీత సమయం',
    'child.rewards': 'నా బహుమతులు',
    'child.progress': 'పురోగతి',
    
    // Games
    'game.wordMatch': 'పద మ్యాచింగ్',
    'game.numberPuzzle': 'సంఖ్య పజిల్స్',
    'game.colorMemory': 'రంగు జ్ఞాపకం',
    'game.score': 'స్కోర్',
    'game.level': 'స్థాయి',
    'game.playAgain': 'మళ్లీ ఆడండి',
    'game.finish': 'ముగించు',
    
    // Reading
    'reading.title': 'కథలు చదవడం',
    'reading.listen': 'కథ వినండి',
    'reading.read': 'కలిసి చదవండి',
    'reading.quiz': 'క్విజ్ తీసుకోండి',
    
    // Voice Commands
    'voice.listening': 'వింటోంది...',
    'voice.speak': 'ఇప్పుడు మాట్లాడండి',
    'voice.commands': 'వాయిస్ కమాండ్లు',
    
    // Rewards
    'rewards.badge': 'బ్యాడ్జ్ పొందారు!',
    'rewards.points': 'పాయింట్లు',
    'rewards.level': 'స్థాయి పెరుగుదల!',
  },
  kn: {
    // Navigation (Kannada)
    'nav.back': 'ಹಿಂತಿರುಗು',
    'nav.home': 'ಮನೆ',
    'nav.dashboard': 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    
    // Welcome Screen
    'welcome.title': 'AI ಕಲಿಕೆಯ ಸಹಾಯಕ',
    'welcome.subtitle': 'ಕಲಿಕೆಯ ಕಷ್ಟಗಳಿರುವ ಮಕ್ಕಳಿಗೆ ಸಹಾಯ',
    'welcome.child': 'ನಾನು ಮಗು',
    'welcome.parent': 'ನಾನು ಪೋಷಕ',
    'welcome.teacher': 'ನಾನು ಶಿಕ್ಷಕ',
    
    // Child Dashboard
    'child.welcome': 'ಮತ್ತೆ ಸ್ವಾಗತ',
    'child.learning': 'ಕಲಿಯುತ್ತಲೇ ಇರಿ!',
    'child.reading': 'ಕಥೆಗಳನ್ನು ಓದುವುದು',
    'child.video': 'ಕಲಿಕೆಯ ವೀಡಿಯೊಗಳು',
    'child.games': 'ಮೋಜಿನ ಆಟಗಳು',
    'child.writing': 'ಬರಹದ ಅಭ್ಯಾಸ',
    'child.math': 'ಗಣಿತದ ಮೋಜು',
    'child.music': 'ಸಂಗೀತದ ಸಮಯ',
    'child.rewards': 'ನನ್ನ ಬಹುಮಾನಗಳು',
    'child.progress': 'ಪ್ರಗತಿ',
    
    // Games
    'game.wordMatch': 'ಪದ ಹೊಂದಾಣಿಕೆ',
    'game.numberPuzzle': 'ಸಂಖ್ಯೆಯ ಒಗಟುಗಳು',
    'game.colorMemory': 'ಬಣ್ಣದ ನೆನಪು',
    'game.score': 'ಅಂಕ',
    'game.level': 'ಹಂತ',
    'game.playAgain': 'ಮತ್ತೆ ಆಡಿ',
    'game.finish': 'ಮುಗಿಸು',
    
    // Reading
    'reading.title': 'ಕಥೆಗಳನ್ನು ಓದುವುದು',
    'reading.listen': 'ಕಥೆ ಕೇಳಿ',
    'reading.read': 'ಜೊತೆಗೆ ಓದಿ',
    'reading.quiz': 'ಪ್ರಶ್ನೋತ್ತರ ತೆಗೆದುಕೊಳ್ಳಿ',
    
    // Voice Commands
    'voice.listening': 'ಕೇಳುತ್ತಿದೆ...',
    'voice.speak': 'ಈಗ ಮಾತನಾಡಿ',
    'voice.commands': 'ಧ್ವನಿ ಆಜ್ಞೆಗಳು',
    
    // Rewards
    'rewards.badge': 'ಬ್ಯಾಡ್ಜ್ ಗಳಿಸಿದ್ದೀರಿ!',
    'rewards.points': 'ಅಂಕಗಳು',
    'rewards.level': 'ಹಂತ ವೃದ್ಧಿ!',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};