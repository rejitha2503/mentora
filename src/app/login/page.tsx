'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithEmail, loginAsDemo } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    await signInWithEmail(email, password);
    setIsLoading(false);
    
    // AuthContext will handle redirecting if successful via useEffect or you can push here
    // If the login was successful, the user state will change and the root layout might redirect
    // But let's explicitly push to dashboard for safety:
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0B0D17] text-white font-sans flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-2xl font-bold text-purple-400 mb-2">PathAI ✨</h1>
        <p className="text-gray-400 text-sm">Ungal account-ku login pannunga</p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-[400px] bg-[#151725] rounded-2xl p-8 border border-gray-800 shadow-2xl">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Welcome back! 👋
          </h2>
          <p className="text-sm text-gray-400 mt-1">Ungal journey continue pannalaam</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-400">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yourname@email.com"
              className="w-full bg-[#0B0D17] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-400">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#0B0D17] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-medium py-3.5 rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 mt-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? 'Logging in...' : 'Login →'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Account illaya? <span className="text-indigo-400 font-medium cursor-pointer hover:text-indigo-300">Sign Up Free</span>
          </p>
        </div>
      </div>

      {/* Guest login */}
      <button 
        onClick={() => {
          loginAsDemo();
          router.push('/dashboard');
        }}
        className="mt-8 text-xs text-gray-500 hover:text-gray-400 transition-colors"
      >
        Login illama paakanum → Continue as Guest
      </button>
    </div>
  );
}
