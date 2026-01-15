'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
            <p className="text-text-secondary">Sign in to start managing your conversations.</p>
          </div>

          <form className="space-y-5">
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

            <button className="w-full bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white font-bold py-3 rounded-xl hover:shadow-xl transition-all">
              Sign in
            </button>
          </form>
        </div>
      </div>

      {/* Right Panel */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] items-center justify-center p-16">
        <div className="text-center text-white">
          <h2 className="text-4xl font-extrabold mb-4">AI BY SEA Inbox</h2>
          <p className="text-lg text-white/80">Manage conversations with AI automation</p>
        </div>
      </div>
    </div>
  );
}
