import { useState } from "react";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { ChildDashboard } from "@/components/ChildDashboard";
import { ReadingModule } from "@/components/ReadingModule";
import { VideoModule } from "@/components/VideoModule";
import { GameModule } from "@/components/GameModule";
import { ParentDashboard } from "@/components/ParentDashboard";

type UserRole = 'child' | 'parent' | 'teacher' | null;
type CurrentView = 'welcome' | 'child-dashboard' | 'parent-dashboard' | 'teacher-dashboard' | 'reading' | 'video' | 'game' | 'writing' | 'math' | 'music';

const Index = () => {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [currentView, setCurrentView] = useState<CurrentView>('welcome');

  const handleRoleSelect = (role: UserRole) => {
    setUserRole(role);
    if (role === 'child') {
      setCurrentView('child-dashboard');
    } else if (role === 'parent') {
      setCurrentView('parent-dashboard');
    } else if (role === 'teacher') {
      setCurrentView('teacher-dashboard');
    }
  };

  const handleModuleSelect = (module: string) => {
    setCurrentView(module as CurrentView);
  };

  const handleBackToDashboard = () => {
    if (userRole === 'child') {
      setCurrentView('child-dashboard');
    } else if (userRole === 'parent') {
      setCurrentView('parent-dashboard');
    } else if (userRole === 'teacher') {
      setCurrentView('teacher-dashboard');
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'welcome':
        return <WelcomeScreen onRoleSelect={handleRoleSelect} />;
      
      case 'child-dashboard':
        return <ChildDashboard onModuleSelect={handleModuleSelect} />;
      
      case 'parent-dashboard':
        return <ParentDashboard onBack={() => setCurrentView('welcome')} />;
      
      case 'reading':
        return <ReadingModule onBack={handleBackToDashboard} />;
      
      case 'video':
        return <VideoModule onBack={handleBackToDashboard} />;
      
      case 'game':
        return <GameModule onBack={handleBackToDashboard} />;
      
      case 'writing':
      case 'math':
      case 'music':
        return (
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground mb-4 font-fredoka">
                {currentView.charAt(0).toUpperCase() + currentView.slice(1)} Module
              </h1>
              <p className="text-lg text-muted-foreground mb-6 font-inter">
                Coming soon! This module is being developed to help children with {currentView} skills.
              </p>
              <button 
                onClick={handleBackToDashboard}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-button hover:bg-primary/90 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        );
      
      default:
        return <WelcomeScreen onRoleSelect={handleRoleSelect} />;
    }
  };

  return renderCurrentView();
};

export default Index;
