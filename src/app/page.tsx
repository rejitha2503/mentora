'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './landing.module.css';

export default function LandingPage() {
  const { user, signInWithGoogle, loginAsDemo } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
    setMounted(true);
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#0B0D17] text-white font-sans selection:bg-purple-500/30">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-purple-400">PathAI ✨</span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => router.push('/dashboard')} className="text-sm text-gray-400 hover:text-white transition-colors">
            Dashboard
          </button>
          <button className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700 hover:bg-gray-700 transition-colors">
            🌞
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center px-4 pt-20 pb-32 max-w-4xl mx-auto text-center">
        
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-950/40 border border-indigo-900/50 text-sm text-indigo-300 backdrop-blur-sm">
          <span>🚀</span> AI-Powered Career Companion for Students
        </div>

        <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
          From <span className="text-indigo-400">confused</span> student<br />
          to job-ready with <span className="text-pink-400">AI</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          Your personal AI mentor for career growth, communication skills, 
          resume building, and daily learning — all in one place.
        </p>

        {/* Action Form */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-2xl mx-auto mb-6">
          <div className="relative flex-1 w-full">
            <input 
              type="text" 
              placeholder="Enter your dream role: Data Analyst" 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
          <button 
            onClick={signInWithGoogle}
            className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-medium px-8 py-4 rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 whitespace-nowrap"
          >
            Generate My AI Roadmap →
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-20">
          Try: "Data Analyst" • "Frontend Developer" • "UX/UI Designer" • "AI Engineer"
        </p>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 border-t border-gray-800/50 w-full max-w-3xl">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-indigo-400 mb-1">2,400+</span>
            <span className="text-sm text-gray-500">Students Learning</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-indigo-400 mb-1">94%</span>
            <span className="text-sm text-gray-500">Report More Confidence</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-indigo-400 mb-1">3.2x</span>
            <span className="text-sm text-gray-500">Faster Job Ready</span>
          </div>
        </div>

      </main>
    </div>
  );
}
