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
    // PDF Export translations
    exportReport: 'Export Report',
    exportDetailedPDF: 'Detailed PDF',
    exportVisualPDF: 'Visual PDF', 
    print: 'Print',
    success: 'Success',
    reportExportedSuccessfully: 'Report exported successfully!',
    failedToExportReport: 'Failed to export report. Please try again.',
    detailedPDFDesc: 'Comprehensive text-based report',
    visualPDFDesc: 'Visual snapshot of current view',
    printDesc: 'Print current page',
    needAccount: 'Need an account? Sign up',
    haveAccount: 'Have an account? Login',
    signupSuccess: 'Account created successfully',
    loginSuccess: 'Logged in successfully',
    checkEmail: 'Please check your email to verify your account',
    welcomeBack: 'Welcome back!',
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
    // PDF Export translations
    exportReport: 'रिपोर्ट निर्यात करें',
    exportDetailedPDF: 'विस्तृत PDF',
    exportVisualPDF: 'दृश्य PDF',
    print: 'प्रिंट करें',
    success: 'सफलता',
    reportExportedSuccessfully: 'रिपोर्ट सफलतापूर्वक निर्यात की गई!',
    failedToExportReport: 'रिपोर्ट निर्यात करने में असफल। कृपया पुनः प्रयास करें।',
    detailedPDFDesc: 'व्यापक पाठ-आधारित रिपोर्ट',
    visualPDFDesc: 'वर्तमान दृश्य का दृश्य स्नैपशॉट',
    printDesc: 'वर्तमान पृष्ठ प्रिंट करें',
    needAccount: 'खाता चाहिए? साइन अप करें',
    haveAccount: 'खाता है? लॉगिन करें',
    signupSuccess: 'खाता सफलतापूर्वक बनाया गया',
    loginSuccess: 'सफलतापूर्वक लॉग इन हो गए',
    checkEmail: 'कृपया अपना खाता सत्यापित करने के लिए अपना ईमेल जांचें',
    welcomeBack: 'वापसी पर स्वागत है!',
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
    // PDF Export translations
    exportReport: 'அறிக்கையை ஏற்றுமதி செய்யவும்',
    exportDetailedPDF: 'விரிவான PDF',
    exportVisualPDF: 'காட்சி PDF',
    print: 'அச்சிடவும்',
    success: 'வெற்றி',
    reportExportedSuccessfully: 'அறிக்கை வெற்றிகரமாக ஏற்றுமதி செய்யப்பட்டது!',
    failedToExportReport: 'அறிக்கையை ஏற்றுமதி செய்வதில் தோல்வி। மீண்டும் முயற்சிக்கவும்.',
    detailedPDFDesc: 'விரிவான உரை அடிப்படையிலான அறிக்கை',
    visualPDFDesc: 'தற்போதைய காட்சியின் காட்சி படம்',
    printDesc: 'தற்போதைய பக்கத்தை அச்சிடவும்',
    needAccount: 'கணக்கு தேவையா? பதிவு செய்யவும்',
    haveAccount: 'கணக்கு உள்ளதா? உள்நுழையவும்',
    signupSuccess: 'கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது',
    loginSuccess: 'வெற்றிகரமாக உள்நுழைந்துள்ளீர்கள்',
    checkEmail: 'உங்கள் கணக்கை சரிபார்க்க உங்கள் மின்னஞ்சலை சரிபார்க்கவும்',
    welcomeBack: 'மீண்டும் வரவேற்கிறோம்!',
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
    // PDF Export translations
    exportReport: 'నివేదికను ఎగుమతి చేయండి',
    exportDetailedPDF: 'వివరణాత్మక PDF',
    exportVisualPDF: 'దృశ్య PDF',
    print: 'ముద్రించు',
    success: 'విజయం',
    reportExportedSuccessfully: 'నివేదిక విజయవంతంగా ఎగుమతి చేయబడింది!',
    failedToExportReport: 'నివేదికను ఎగుమతి చేయడంలో విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి.',
    detailedPDFDesc: 'సమగ్ర వచన ఆధారిత నివేదిక',
    visualPDFDesc: 'ప్రస్తుత వీక్షణ యొక్క దృశ్య చిత్రం',
    printDesc: 'ప్రస్తుత పేజీని ముద్రించండి',
    needAccount: 'ఖాతా అవసరమా? సైన్ అప్ చేయండి',
    haveAccount: 'ఖాతా ఉందా? లాగిన్ చేయండి',
    signupSuccess: 'ఖాతా విజయవంతంగా సృష్టించబడింది',
    loginSuccess: 'విజయవంతంగా లాగిన్ అయ్యారు',
    checkEmail: 'మీ ఖాతాను ధృవీకరించడానికి మీ ఇమెయిల్‌ను తనిఖీ చేయండి',
    welcomeBack: 'తిరిగి స్వాగతం!',
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
    // PDF Export translations
    exportReport: 'ವರದಿಯನ್ನು ರಫ್ತು ಮಾಡಿ',
    exportDetailedPDF: 'ವಿವರವಾದ PDF',
    exportVisualPDF: 'ದೃಶ್ಯ PDF',
    print: 'ಮುದ್ರಿಸಿ',
    success: 'ಯಶಸ್ಸು',
    reportExportedSuccessfully: 'ವರದಿಯು ಯಶಸ್ವಿಯಾಗಿ ರಫ್ತಾಗಿದೆ!',
    failedToExportReport: 'ವರದಿಯನ್ನು ರಫ್ತು ಮಾಡುವಲ್ಲಿ ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    detailedPDFDesc: 'ಸಮಗ್ರ ಪಠ್ಯ ಆಧಾರಿತ ವರದಿ',
    visualPDFDesc: 'ಪ್ರಸ್ತುತ ವೀಕ್ಷಣೆಯ ದೃಶ್ಯ ಚಿತ್ರ',
    printDesc: 'ಪ್ರಸ್ತುತ ಪುಟವನ್ನು ಮುದ್ರಿಸಿ',
    needAccount: 'ಖಾತೆ ಬೇಕೇ? ಸೈನ್ ಅಪ್ ಮಾಡಿ',
    haveAccount: 'ಖಾತೆ ಇದೆಯೇ? ಲಾಗಿನ್ ಮಾಡಿ',
    signupSuccess: 'ಖಾತೆಯು ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲ್ಪಟ್ಟಿದೆ',
    loginSuccess: 'ಯಶಸ್ವಿಯಾಗಿ ಲಾಗಿನ್ ಆಗಿದ್ದೀರಿ',
    checkEmail: 'ನಿಮ್ಮ ಖಾತೆಯನ್ನು ಪರಿಶೀಲಿಸಲು ನಿಮ್ಮ ಇಮೇಲ್ ಅನ್ನು ಪರಿಶೀಲಿಸಿ',
    welcomeBack: 'ಮತ್ತೆ ಸ್ವಾಗತ!',
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