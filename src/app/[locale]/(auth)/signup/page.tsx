'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import Link from 'next/link';
import { usePageTitle } from '@/hooks/usePageTitle';
import Button from '@/components/ui/Button';

const ALLOWED_EMAILS = [
  'tech@aibysea.com',
  'osama@seatourism.sa',
  'nouraldeen@seatourism.sa',
  'mariam@seatourism.sa',
  'ahmet.ata@seatourism.sa',
  'mahmoud@seatourism.sa',
];

export default function SignupPage() {
  usePageTitle('Sign Up');
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const isEmailAllowed = (email: string) => {
    return ALLOWED_EMAILS.includes(email.toLowerCase().trim());
  };

  const passwordChecks = {
    length: password.length >= 8,
    match: password === confirmPassword && confirmPassword.length > 0,
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const trimmedEmail = email.toLowerCase().trim();

    if (!isEmailAllowed(trimmedEmail)) {
      setError('This email is not authorized to create an account. Contact your administrator.');
      setIsLoading(false);
      return;
    }

    if (!passwordChecks.length) {
      setError('Password must be at least 8 characters.');
      setIsLoading(false);
      return;
    }

    if (!passwordChecks.match) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmedEmail,
          password,
          fullName: fullName.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create account.');
        setIsLoading(false);
        return;
      }

      // Auto sign-in after successful signup
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (signInError) {
        // Account created but auto-login failed - redirect to login
        setSuccess(true);
        setTimeout(() => router.push('/login'), 2000);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('An unexpected error occurred.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Signup Form */}
      <div className="flex-1 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md animate-[fadeSlideUp_0.5s_ease-out_both]">
          {/* Welcome Text */}
          <div className="mb-6">
            <h1 className="text-heading-1 font-extrabold text-slate-900 mb-2 animate-[fadeSlideUp_0.5s_ease-out_0.1s_both]">Create Account</h1>
            <p className="text-slate-600 animate-[fadeSlideUp_0.5s_ease-out_0.2s_both]">Set up your account to start managing AI agents.</p>
          </div>

          {success ? (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-6 rounded-xl text-center">
              <CheckCircle className="w-10 h-10 mx-auto mb-3 text-green-500" />
              <p className="font-bold text-lg mb-1">Account Created!</p>
              <p className="text-sm text-green-600">Redirecting you to login...</p>
            </div>
          ) : (
            <form className="space-y-4 animate-[fadeSlideUp_0.5s_ease-out_0.3s_both]" onSubmit={handleSignup}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
                  <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-primary-500 text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="your@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-primary-500 text-slate-900 placeholder:text-slate-400"
                />
                {email.length > 0 && (
                  <div className={`flex items-center gap-1.5 mt-1.5 text-xs ${isEmailAllowed(email) ? 'text-green-600' : 'text-amber-600'}`}>
                    {isEmailAllowed(email) ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Email is authorized</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        <span>This email is not on the authorized list</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-primary-500 text-slate-900 placeholder:text-slate-400"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    iconOnly
                    icon={showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  />
                </div>
                {password.length > 0 && (
                  <div className={`flex items-center gap-1.5 mt-1.5 text-xs ${passwordChecks.length ? 'text-green-600' : 'text-amber-600'}`}>
                    {passwordChecks.length ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    <span>At least 8 characters</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-primary-500 text-slate-900 placeholder:text-slate-400"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    iconOnly
                    icon={showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  />
                </div>
                {confirmPassword.length > 0 && (
                  <div className={`flex items-center gap-1.5 mt-1.5 text-xs ${passwordChecks.match ? 'text-green-600' : 'text-red-600'}`}>
                    {passwordChecks.match ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    <span>{passwordChecks.match ? 'Passwords match' : 'Passwords do not match'}</span>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={isLoading || !isEmailAllowed(email) || !passwordChecks.length || !passwordChecks.match}
                loading={isLoading}
                className="w-full rounded-xl"
              >
                Create Account
              </Button>

              <p className="text-center text-sm text-slate-500 mt-4">
                Already have an account?{' '}
                <Link href="/login" className="text-[#4052a8] font-semibold hover:underline">
                  Sign in here
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>

      {/* Right Panel - Branding */}
      <div className="hidden lg:flex flex-1 bg-[#4052a8] items-start justify-center pt-16 px-8 pb-16 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

        {/* Content */}
        <div className="relative z-10 text-center">
          <div>
            {/* Logo */}
            <Image
              src="/aibysea-logo-full.png"
              alt="AI bysea"
              width={1200}
              height={800}
              className="mx-auto mt-4 mb-1 w-full brightness-0 invert"
              priority
            />
            <p className="text-lg text-white/80 max-w-md mx-auto -mt-48">
              Your AI Agent Hosting Platform - Deploy, monitor, and manage intelligent AI agents across WhatsApp, Telegram, and more
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 mt-6 max-w-md mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-heading-1 font-extrabold text-white mb-1">35</p>
              <p className="text-sm text-white/70">Active AI Agents</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-heading-1 font-extrabold text-white mb-1">97%</p>
              <p className="text-sm text-white/70">AI Resolution Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
