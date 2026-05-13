'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, UserProfile } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password?: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateXP: (amount: number) => void;
  loginAsDemo: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => {},
  signOut: async () => {},
  updateXP: () => {},
  loginAsDemo: () => {},
});

// Demo user for development
const DEMO_USER: UserProfile = {
  id: 'demo-user-001',
  email: 'alex@mentora.dev',
  full_name: 'Alex Johnson',
  avatar_url: '',
  xp: 2450,
  level: 7,
  streak: 12,
  career_goal: 'Full-Stack Developer',
  skills: ['JavaScript', 'React', 'Python', 'Node.js', 'SQL'],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Fetch user profile from Supabase
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setUser(profile);
        } else {
          // Create new profile
          const newProfile: UserProfile = {
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || '',
            avatar_url: session.user.user_metadata?.avatar_url || '',
            xp: 0,
            level: 1,
            streak: 0,
            career_goal: '',
            skills: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          await supabase.from('profiles').insert(newProfile);
          setUser(newProfile);
        }
      }
    } catch {
      console.log('No active session');
    } finally {
      setLoading(false);
    }
  }

  async function signInWithGoogle() {
    // If Supabase is not configured, use demo mode
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
      loginAsDemo();
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    if (error) {
      console.error('Auth error:', error);
      toast.error(`Login Failed: ${error.message}`);
      // Fallback to demo mode on error to let user see the app
      // loginAsDemo();
    }
  }

  async function signInWithEmail(email: string, password?: string) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
      loginAsDemo();
      return;
    }

    try {
      // Basic login (you could expand this for actual signup/login split if needed)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: password || 'defaultpassword123',
      });
      
      if (error) {
        toast.error(`Login Failed: ${error.message}`);
        // If they don't exist, we could auto-signup, but for safety let's just log
      }
    } catch (e: any) {
      toast.error(e.message || 'Failed to login with email');
    }
  }

  function loginAsDemo() {
    setUser(DEMO_USER);
    localStorage.setItem('mentora-demo-user', 'true');
  }

  async function signOut() {
    if (localStorage.getItem('mentora-demo-user')) {
      localStorage.removeItem('mentora-demo-user');
      setUser(null);
      return;
    }
    await supabase.auth.signOut();
    setUser(null);
  }

  function updateXP(amount: number) {
    if (!user) return;
    const newXP = user.xp + amount;
    const newLevel = Math.floor(newXP / 500) + 1;
    setUser({ ...user, xp: newXP, level: newLevel });
  }

  // Check for demo mode on mount
  useEffect(() => {
    if (localStorage.getItem('mentora-demo-user')) {
      setUser(DEMO_USER);
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithEmail, signOut, updateXP, loginAsDemo }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
