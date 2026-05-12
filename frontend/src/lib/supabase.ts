import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables are missing! Check your .env.local file.');
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder');

// Types
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  xp: number;
  level: number;
  streak: number;
  career_goal: string;
  skills: string[];
  created_at: string;
  updated_at: string;
}

export interface DailyTask {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: 'learning' | 'practice' | 'networking' | 'project';
  xp_reward: number;
  completed: boolean;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface RoadmapStep {
  id: string;
  user_id: string;
  title: string;
  description: string;
  order_index: number;
  status: 'locked' | 'current' | 'completed';
  skills: string[];
  estimated_days: number;
}
