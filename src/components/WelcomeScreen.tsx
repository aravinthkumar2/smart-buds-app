import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Baby, Users, GraduationCap } from "lucide-react";
import owlMascot from "@/assets/owl-mascot.jpg";

interface WelcomeScreenProps {
  onRoleSelect: (role: 'child' | 'parent' | 'teacher') => void;
}

export const WelcomeScreen = ({ onRoleSelect }: WelcomeScreenProps) => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const roles = [
    {
      id: 'child',
      title: 'I\'m a Kid!',
      description: 'Let\'s learn and have fun together!',
      icon: Baby,
      gradient: 'gradient-primary',
      bgColor: 'bg-primary/10',
    },
    {
      id: 'parent',
      title: 'I\'m a Parent',
      description: 'Track my child\'s learning progress',
      icon: Users,
      gradient: 'gradient-success',
      bgColor: 'bg-success/10',
    },
    {
      id: 'teacher',
      title: 'I\'m a Teacher',
      description: 'Manage students and classroom activities',
      icon: GraduationCap,
      gradient: 'gradient-magic',
      bgColor: 'bg-magic/10',
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <div className="mb-6 flex justify-center">
            <img 
              src={owlMascot} 
              alt="Wise owl mascot" 
              className="w-32 h-32 object-cover rounded-full shadow-glow float"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 font-fredoka">
            Welcome to 
            <span className="bg-gradient-to-r from-primary to-magic bg-clip-text text-transparent"> LearnBuddy</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 font-inter">
            Your AI-powered learning companion for every journey!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            
            return (
              <Card 
                key={role.id}
                className={`card-interactive cursor-pointer transition-all duration-300 ${
                  isSelected ? 'ring-2 ring-primary scale-105' : ''
                } ${role.bgColor} border-2 border-transparent hover:border-primary/20`}
                onClick={() => setSelectedRole(role.id)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${role.gradient} flex items-center justify-center shadow-soft`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground font-fredoka">
                    {role.title}
                  </h3>
                  <p className="text-muted-foreground font-inter">
                    {role.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {selectedRole && (
          <div className="text-center animate-in fade-in duration-500">
            <Button
              variant="kid"
              size="xl"
              onClick={() => onRoleSelect(selectedRole as 'child' | 'parent' | 'teacher')}
              className="wiggle"
            >
              Let's Start Learning! ✨
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};