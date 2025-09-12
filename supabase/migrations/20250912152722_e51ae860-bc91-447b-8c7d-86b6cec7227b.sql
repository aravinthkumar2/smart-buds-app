-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'parent', 'teacher')),
  age INTEGER,
  grade_level TEXT,
  primary_language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create learning_disorders table
CREATE TABLE public.learning_disorders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  symptoms TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create assessments table
CREATE TABLE public.assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL CHECK (assessment_type IN ('reading', 'writing', 'math', 'speech')),
  content JSONB NOT NULL,
  responses JSONB NOT NULL,
  ai_analysis JSONB,
  confidence_scores JSONB,
  detected_disorders TEXT[],
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create learning_paths table
CREATE TABLE public.learning_paths (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  disorder_type TEXT NOT NULL,
  difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 10),
  activities JSONB NOT NULL,
  current_activity_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create progress_tracking table
CREATE TABLE public.progress_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  activity_id TEXT NOT NULL,
  score INTEGER CHECK (score BETWEEN 0 AND 100),
  time_spent INTEGER NOT NULL, -- in seconds
  completed BOOLEAN DEFAULT false,
  mistakes JSONB,
  improvements JSONB,
  session_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create achievements table
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL CHECK (achievement_type IN ('badge', 'streak', 'level_up', 'milestone')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  points_earned INTEGER DEFAULT 0,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student_analytics table
CREATE TABLE public.student_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_points INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  activities_completed INTEGER DEFAULT 0,
  time_spent_learning INTEGER DEFAULT 0, -- in minutes
  last_activity_date DATE,
  weekly_goals JSONB,
  monthly_progress JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_disorders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for assessments (students can only see their own)
CREATE POLICY "Students can view their own assessments" 
ON public.assessments FOR SELECT 
USING (
  auth.uid() IN (
    SELECT user_id FROM public.profiles WHERE id = student_id
  )
);

CREATE POLICY "Students can insert their own assessments" 
ON public.assessments FOR INSERT 
WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM public.profiles WHERE id = student_id
  )
);

-- RLS Policies for learning_paths
CREATE POLICY "Students can view their own learning paths" 
ON public.learning_paths FOR SELECT 
USING (
  auth.uid() IN (
    SELECT user_id FROM public.profiles WHERE id = student_id
  )
);

CREATE POLICY "Students can update their own learning paths" 
ON public.learning_paths FOR UPDATE 
USING (
  auth.uid() IN (
    SELECT user_id FROM public.profiles WHERE id = student_id
  )
);

-- RLS Policies for progress_tracking
CREATE POLICY "Students can view their own progress" 
ON public.progress_tracking FOR SELECT 
USING (
  auth.uid() IN (
    SELECT user_id FROM public.profiles WHERE id = student_id
  )
);

CREATE POLICY "Students can insert their own progress" 
ON public.progress_tracking FOR INSERT 
WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM public.profiles WHERE id = student_id
  )
);

-- RLS Policies for achievements
CREATE POLICY "Students can view their own achievements" 
ON public.achievements FOR SELECT 
USING (
  auth.uid() IN (
    SELECT user_id FROM public.profiles WHERE id = student_id
  )
);

CREATE POLICY "Students can insert their own achievements" 
ON public.achievements FOR INSERT 
WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM public.profiles WHERE id = student_id
  )
);

-- RLS Policies for student_analytics
CREATE POLICY "Students can view their own analytics" 
ON public.student_analytics FOR SELECT 
USING (
  auth.uid() IN (
    SELECT user_id FROM public.profiles WHERE id = student_id
  )
);

CREATE POLICY "Students can update their own analytics" 
ON public.student_analytics FOR UPDATE 
USING (
  auth.uid() IN (
    SELECT user_id FROM public.profiles WHERE id = student_id
  )
);

-- Learning disorders are public (everyone can read)
CREATE POLICY "Everyone can view learning disorders" 
ON public.learning_disorders FOR SELECT 
USING (true);

-- Insert initial learning disorders data
INSERT INTO public.learning_disorders (name, description, symptoms) VALUES 
('Dyslexia', 'A reading disorder characterized by difficulty with word recognition, spelling, and decoding abilities.', ARRAY['letter reversals', 'reading errors', 'spelling difficulties', 'slow reading speed', 'difficulty with phonics']),
('Dysgraphia', 'A learning disability that affects writing abilities, including handwriting, spelling, and organizing ideas.', ARRAY['poor handwriting', 'grammar issues', 'difficulty organizing thoughts', 'inconsistent spacing', 'trouble with written expression']),
('Dyscalculia', 'A learning disability in math that affects the ability to understand numbers and math concepts.', ARRAY['math concept confusion', 'difficulty with basic arithmetic', 'trouble with number patterns', 'poor number sense', 'difficulty with word problems']),
('ADHD', 'Attention deficit hyperactivity disorder affecting focus, attention, and impulse control in learning contexts.', ARRAY['difficulty focusing', 'impulsivity', 'hyperactivity', 'trouble following instructions', 'easily distracted']),
('Processing Speed Disorder', 'Difficulty processing information quickly and accurately, affecting academic performance.', ARRAY['slow task completion', 'difficulty with timed tests', 'trouble keeping up', 'needs extra time', 'mental fatigue']);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_learning_paths_updated_at
  BEFORE UPDATE ON public.learning_paths
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_analytics_updated_at
  BEFORE UPDATE ON public.student_analytics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, role, age, grade_level)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'New User'),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'student'),
    CAST(NEW.raw_user_meta_data ->> 'age' AS INTEGER),
    NEW.raw_user_meta_data ->> 'grade_level'
  );
  
  -- If it's a student, create initial analytics record
  IF COALESCE(NEW.raw_user_meta_data ->> 'role', 'student') = 'student' THEN
    INSERT INTO public.student_analytics (student_id)
    VALUES (
      (SELECT id FROM public.profiles WHERE user_id = NEW.id)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();