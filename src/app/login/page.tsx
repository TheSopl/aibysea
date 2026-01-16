'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Redirect to dashboard immediately
    router.push('/dashboard');
  };

  // Also allow clicking anywhere or pressing Enter
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        router.push('/dashboard');
      }
    };
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [router]);

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="flex-1 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-extrabold text-lg">AI</span>
              </div>
              <span className="text-2xl font-bold text-dark">AIBYSEA</span>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-dark mb-2">Welcome Back 👋</h1>
            <p className="text-text-secondary">Sign in to manage your AI agents and customer conversations.</p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Email</label>
              <input
                type="email"
                placeholder="Example@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Password</label>
              <input
                type="password"
                placeholder="At least 8 characters"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white font-bold py-3 rounded-xl hover:shadow-xl transition-all">
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Skip login for demo */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-primary font-semibold hover:underline"
            >
              Skip to Dashboard →
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f1419] items-center justify-center p-16 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-accent/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>

        {/* Content */}
        <div className="relative z-10 text-center">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-accent to-primary rounded-3xl flex items-center justify-center shadow-2xl mb-6">
              <span className="text-white font-extrabold text-4xl">AI</span>
            </div>
            <h2 className="text-4xl font-extrabold text-white mb-4">AI BY SEA</h2>
            <p className="text-lg text-white/80 max-w-md mx-auto">
              Your AI Agent Hosting Platform - Deploy, monitor, and manage intelligent AI agents across WhatsApp, Telegram, and more
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 mt-12 max-w-md mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-3xl font-extrabold text-white mb-1">12</p>
              <p className="text-sm text-white/70">Active AI Agents</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-3xl font-extrabold text-white mb-1">74%</p>
              <p className="text-sm text-white/70">AI Resolution Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
