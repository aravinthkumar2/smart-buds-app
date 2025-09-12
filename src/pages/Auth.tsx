import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'student' | 'parent' | 'teacher'>('student');
  const [age, setAge] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkUser();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        toast({
          title: t('loginSuccess'),
          description: t('welcomeBack'),
        });
        navigate('/');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: fullName,
              role: role,
              age: age ? parseInt(age) : undefined,
              grade_level: gradeLevel,
            }
          }
        });

        if (error) throw error;
        toast({
          title: t('signupSuccess'),
          description: t('checkEmail'),
        });
      }
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {isLogin ? t('login') : t('signup')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t('fullName')}</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={!isLogin}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">{t('role')}</Label>
                  <Select value={role} onValueChange={(value: 'student' | 'parent' | 'teacher') => setRole(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">{t('student')}</SelectItem>
                      <SelectItem value="parent">{t('parent')}</SelectItem>
                      <SelectItem value="teacher">{t('teacher')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {role === 'student' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="age">{t('age')}</Label>
                      <Input
                        id="age"
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        min="3"
                        max="18"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gradeLevel">{t('gradeLevel')}</Label>
                      <Select value={gradeLevel} onValueChange={setGradeLevel}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pre-k">Pre-K</SelectItem>
                          <SelectItem value="k">Kindergarten</SelectItem>
                          <SelectItem value="1">Grade 1</SelectItem>
                          <SelectItem value="2">Grade 2</SelectItem>
                          <SelectItem value="3">Grade 3</SelectItem>
                          <SelectItem value="4">Grade 4</SelectItem>
                          <SelectItem value="5">Grade 5</SelectItem>
                          <SelectItem value="6">Grade 6</SelectItem>
                          <SelectItem value="7">Grade 7</SelectItem>
                          <SelectItem value="8">Grade 8</SelectItem>
                          <SelectItem value="9">Grade 9</SelectItem>
                          <SelectItem value="10">Grade 10</SelectItem>
                          <SelectItem value="11">Grade 11</SelectItem>
                          <SelectItem value="12">Grade 12</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t('loading') : isLogin ? t('login') : t('signup')}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline"
            >
              {isLogin ? t('needAccount') : t('haveAccount')}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}