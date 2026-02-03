'use client';

import TopBar from '@/components/layout/TopBar';
import { useState, useEffect, useRef } from 'react';
import {
  Camera,
  Save,
  Mail,
  Phone,
  User,
  FileText,
  Shield,
  LogOut,
  Check,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { usePageTitle } from '@/hooks/usePageTitle';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface ProfileData {
  full_name: string;
  phone: string;
  bio: string;
  job_title: string;
  avatar_url: string;
}

export default function ProfilePage() {
  usePageTitle('Profile');
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [profile, setProfile] = useState<ProfileData>({
    full_name: '',
    phone: '',
    bio: '',
    job_title: '',
    avatar_url: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    setUserId(user.id);
    setUserEmail(user.email || '');

    const meta = user.user_metadata || {};
    setProfile({
      full_name: meta.full_name || '',
      phone: meta.phone || '',
      bio: meta.bio || '',
      job_title: meta.job_title || '',
      avatar_url: meta.avatar_url || '',
    });

    if (meta.avatar_url) {
      setAvatarPreview(meta.avatar_url);
    }

    setIsLoading(false);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limit file size to 2MB
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Image must be under 2MB.');
      return;
    }

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);

    setIsUploading(true);
    setUploadError('');

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `avatars/${userId}.${fileExt}`;

      // Upload to Supabase Storage only - NEVER store base64 in user metadata
      // Storing base64 in metadata inflates the JWT cookie and causes HTTP 431 errors
      const { error: storageError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (storageError) {
        setUploadError('Avatar upload failed. The storage bucket may not be set up yet.');
        setAvatarPreview(profile.avatar_url || null);
      } else {
        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
        const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;
        setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
        setAvatarPreview(publicUrl);
      }
    } catch {
      setUploadError('Avatar upload failed. Please try again.');
      setAvatarPreview(profile.avatar_url || null);
    }

    setIsUploading(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    // Safety check: never save a data: URL into metadata
    const safeAvatarUrl = profile.avatar_url.startsWith('data:') ? '' : profile.avatar_url;

    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: profile.full_name,
        phone: profile.phone,
        bio: profile.bio,
        job_title: profile.job_title,
        avatar_url: safeAvatarUrl,
      },
    });

    if (!error) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }

    setIsSaving(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const getInitials = () => {
    if (profile.full_name) {
      return profile.full_name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return userEmail?.[0]?.toUpperCase() || 'U';
  };

  if (isLoading) {
    return (
      <>
        <TopBar title="Profile" />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar title="Profile" />

      <div className="p-4 sm:p-6 lg:p-8 bg-light-bg dark:bg-slate-900 min-h-[calc(100vh-4rem)]">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Profile Header Card */}
          <Card variant="default" className="rounded-2xl overflow-hidden">
            {/* Banner */}
            <div className="h-32 sm:h-40 relative" style={{ background: 'linear-gradient(135deg, #4052a8 0%, #4EB6C9 100%)' }}>
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-4 right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/5 rounded-full blur-3xl"></div>
              </div>
            </div>

            {/* Avatar + Name */}
            <div className="px-6 sm:px-8 pb-6 -mt-16 relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                {/* Avatar */}
                <div className="relative group">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl sm:text-4xl font-extrabold text-white">
                        {getInitials()}
                      </span>
                    )}
                  </div>

                  {/* Camera overlay */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                  >
                    {isUploading ? (
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    ) : (
                      <Camera className="w-6 h-6 text-white" />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>

                {/* Name & Email */}
                <div className="flex-1 pt-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-dark dark:text-white">
                    {profile.full_name || 'Your Name'}
                  </h2>
                  <p className="text-sm text-text-secondary dark:text-slate-400 flex items-center gap-1.5 mt-1">
                    <Mail className="w-3.5 h-3.5" />
                    {userEmail}
                  </p>
                  {profile.job_title && (
                    <p className="text-sm text-text-secondary dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <Shield className="w-3.5 h-3.5" />
                      {profile.job_title}
                    </p>
                  )}
                </div>
              </div>

              {uploadError && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red/10 border border-red-200 dark:border-red/30 rounded-xl flex items-center gap-2 text-sm text-red-600 dark:text-red">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {uploadError}
                </div>
              )}
            </div>
          </Card>

          {/* Edit Profile Card */}
          <Card variant="default" className="rounded-2xl sm:p-8">
            <h3 className="text-lg font-extrabold text-dark dark:text-white mb-1">Edit Profile</h3>
            <p className="text-xs sm:text-sm text-text-secondary dark:text-slate-400 mb-6">Update your personal information</p>

            {saveSuccess && (
              <div className="mb-6 p-3 bg-green/10 border border-green/30 rounded-xl flex items-center gap-3">
                <Check size={18} className="text-green flex-shrink-0" />
                <p className="text-sm font-bold text-green">Profile updated successfully!</p>
              </div>
            )}

            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider mb-2">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3 h-3" />
                      Full Name
                    </span>
                  </label>
                  <input
                    type="text"
                    value={profile.full_name}
                    onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 bg-light-bg dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-dark dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-text-secondary"
                  />
                </div>

                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider mb-2">
                    <span className="flex items-center gap-1.5">
                      <Shield className="w-3 h-3" />
                      Job Title
                    </span>
                  </label>
                  <input
                    type="text"
                    value={profile.job_title}
                    onChange={(e) => setProfile(prev => ({ ...prev, job_title: e.target.value }))}
                    placeholder="e.g. Product Manager"
                    className="w-full px-4 py-3 bg-light-bg dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-dark dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-text-secondary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider mb-2">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3" />
                      Phone Number
                    </span>
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+966 5XX XXX XXXX"
                    className="w-full px-4 py-3 bg-light-bg dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-dark dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-text-secondary"
                  />
                </div>

                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider mb-2">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3 h-3" />
                      Email
                    </span>
                  </label>
                  <input
                    type="email"
                    value={userEmail}
                    disabled
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-600 border border-gray-200 dark:border-slate-500 rounded-xl text-text-secondary dark:text-slate-400 text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider mb-2">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3 h-3" />
                    Bio
                  </span>
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  className="w-full px-4 py-3 bg-light-bg dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-dark dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none placeholder:text-text-secondary"
                />
                <p className="text-xs text-text-secondary dark:text-slate-500 mt-1">
                  {profile.bio.length}/280 characters
                </p>
              </div>

              <Button
                variant="primary"
                onClick={handleSave}
                disabled={isSaving}
                loading={isSaving}
                icon={!isSaving ? <Save size={16} /> : undefined}
                className="w-full sm:w-auto rounded-xl"
              >
                Save Changes
              </Button>
            </div>
          </Card>

          {/* Sign Out Card */}
          <Card variant="default" className="rounded-2xl sm:p-8 border-2 border-red/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-extrabold text-dark dark:text-white mb-1 flex items-center gap-2">
                  <LogOut className="w-5 h-5 text-red" />
                  Sign Out
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary dark:text-slate-400">
                  Sign out of your account on this device
                </p>
              </div>
              <Button
                variant="danger"
                onClick={handleSignOut}
                icon={<LogOut size={16} />}
                className="w-full sm:w-auto rounded-xl"
              >
                Sign Out
              </Button>
            </div>
          </Card>

        </div>
      </div>
    </>
  );
}
