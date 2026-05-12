-- MENTORA SUPABASE SCHEMA

-- 1. Profiles Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak INTEGER DEFAULT 0,
  career_goal TEXT,
  skills TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Roadmap Steps Table
CREATE TABLE roadmap_steps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  skills TEXT[] DEFAULT '{}',
  status TEXT CHECK (status IN ('completed', 'current', 'locked')) DEFAULT 'locked',
  xp_reward INTEGER DEFAULT 500,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on roadmap_steps
ALTER TABLE roadmap_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own roadmap" ON roadmap_steps FOR ALL USING (auth.uid() = user_id);

-- 3. Daily Tasks Table
CREATE TABLE daily_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  xp_reward INTEGER DEFAULT 50,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on daily_tasks
ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own tasks" ON daily_tasks FOR ALL USING (auth.uid() = user_id);

-- 4. Chat Messages Table
CREATE TABLE chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT CHECK (role IN ('user', 'assistant')) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on chat_messages
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own chat history" ON chat_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add to their own chat history" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5. Resume Analysis Table
CREATE TABLE resume_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  report_json JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on resume_reports
ALTER TABLE resume_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own resume reports" ON resume_reports FOR SELECT USING (auth.uid() = user_id);

-- 6. Communication Practice Table
CREATE TABLE comms_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL,
  feedback TEXT,
  clarity INTEGER,
  pace INTEGER,
  vocabulary INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on comms_reports
ALTER TABLE comms_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own comms reports" ON comms_reports FOR SELECT USING (auth.uid() = user_id);

-- Function to handle profile updates
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();
