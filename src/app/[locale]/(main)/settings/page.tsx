'use client';

import TopBar from '@/components/layout/TopBar';
import { useState } from 'react';
import {
  User,
  Users,
  Radio,
  Activity,
  Plus,
  Mail,
  Trash,
  Edit,
  Save,
  X,
  Check,
  AlertCircle
} from 'lucide-react';

type SettingsTab = 'users' | 'team' | 'channels' | 'lifecycle';

// Mock data
const mockUsers = [
  { id: 1, name: 'Rashed Al-Mansoori', email: 'rashed@aibysea.com', role: 'Admin', status: 'active' },
  { id: 2, name: 'Ahmed Ibrahim', email: 'ahmed@aibysea.com', role: 'Member', status: 'active' },
  { id: 3, name: 'Sarah Martinez', email: 'sarah@aibysea.com', role: 'Member', status: 'active' },
  { id: 4, name: 'Elena Volkov', email: 'elena@aibysea.com', role: 'Member', status: 'pending' },
];

const mockChannels = [
  { id: 1, name: 'WhatsApp Business', type: 'WhatsApp', status: 'connected', conversations: 234 },
  { id: 2, name: 'Telegram Bot', type: 'Telegram', status: 'connected', conversations: 145 },
  { id: 3, name: 'Facebook Page', type: 'Facebook', status: 'connected', conversations: 89 },
  { id: 4, name: 'Instagram Business', type: 'Instagram', status: 'disconnected', conversations: 0 },
];

const defaultLifecycles = [
  { id: 1, name: 'Prospect', color: 'amber', description: 'Initial contact or inquiry' },
  { id: 2, name: 'Lead', color: 'blue', description: 'Qualified potential customer' },
  { id: 3, name: 'Qualified Lead', color: 'primary', description: 'Highly interested prospect' },
  { id: 4, name: 'Customer', color: 'green', description: 'Active paying customer' },
  { id: 5, name: 'Churned', color: 'red', description: 'Former customer' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('users');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Admin' | 'Member'>('Member');
  const [lifecycles, setLifecycles] = useState(defaultLifecycles);
  const [editingLifecycle, setEditingLifecycle] = useState<number | null>(null);
  const [showInviteSuccess, setShowInviteSuccess] = useState(false);

  const handleInviteUser = () => {
    if (!inviteEmail.trim()) return;

    // TODO: Send invite via API
    console.log('Inviting user:', inviteEmail, 'as', inviteRole);

    // Show success message
    setShowInviteSuccess(true);
    setTimeout(() => setShowInviteSuccess(false), 3000);

    // Clear form
    setInviteEmail('');
    setInviteRole('Member');
  };

  const getLifecycleColor = (color: string) => {
    const colors: Record<string, string> = {
      amber: 'bg-amber/20 text-amber border-amber/30',
      blue: 'bg-blue/20 text-blue border-blue/30',
      primary: 'bg-primary/20 text-primary border-primary/30',
      green: 'bg-green/20 text-green border-green/30',
      red: 'bg-red/20 text-red border-red/30',
      purple: 'bg-purple/20 text-purple border-purple/30',
    };
    return colors[color] || 'bg-gray-200 text-gray-700 border-gray-300';
  };

  const settingsNav = [
    { id: 'users' as SettingsTab, label: 'User Settings', icon: User },
    { id: 'team' as SettingsTab, label: 'Team Settings', icon: Users },
    { id: 'channels' as SettingsTab, label: 'Channels', icon: Radio },
    { id: 'lifecycle' as SettingsTab, label: 'Lifecycle', icon: Activity },
  ];

  return (
    <>
      <TopBar title="Settings" />

      <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
        {/* Mobile Tabs - Horizontal scrollable */}
        <div className="lg:hidden bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 overflow-x-auto">
          <div className="flex p-2 gap-2 min-w-max">
            {settingsNav.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg'
                      : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon size={16} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                  <span className="font-semibold text-xs">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Desktop Secondary Sidebar */}
        <div className="hidden lg:flex w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-extrabold text-dark dark:text-white">Settings</h2>
            <p className="text-xs text-text-secondary dark:text-slate-400 mt-1">Manage your workspace</p>
          </div>

          <nav className="flex-1 p-3 space-y-1">
            {settingsNav.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={activeTab === item.id ? {
                    background: 'linear-gradient(to right, #003EF3, #4EB6C9)',
                    color: '#FFFFFF',
                    borderColor: '#003EF3'
                  } : {}}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 shadow-xl scale-105 border-2 ${
                    activeTab === item.id
                      ? ''
                      : 'text-gray-800 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-dark dark:hover:text-white border-transparent scale-100 shadow-none'
                  }`}
                >
                  <Icon size={20} strokeWidth={activeTab === item.id ? 3 : 2.5} style={activeTab === item.id ? { color: '#FFFFFF' } : {}} />
                  <span className="font-bold text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-light-bg scroll-smooth">
          <div className="p-4 sm:p-6 lg:p-8 bg-light-bg dark:bg-slate-900">
            {/* User Settings */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div
                  className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-500"
                  style={{
                    animation: 'scaleIn 0.5s ease-out both'
                  }}
                >
                  <h3 className="text-lg sm:text-xl font-extrabold text-dark dark:text-white mb-1 sm:mb-2">Invite User</h3>
                  <p className="text-xs sm:text-sm text-text-secondary mb-4 sm:mb-6">Send an invitation to join your workspace</p>

                  {showInviteSuccess && (
                    <div className="mb-4 p-3 sm:p-4 bg-green/10 border border-green/30 rounded-lg sm:rounded-xl flex items-center gap-2 sm:gap-3">
                      <Check size={18} className="text-green flex-shrink-0" />
                      <p className="text-xs sm:text-sm font-bold text-green">Invitation sent successfully!</p>
                    </div>
                  )}

                  <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5 sm:mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="colleague@company.com"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-light-bg dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5 sm:mb-2">
                        Role
                      </label>
                      <select
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value as 'Admin' | 'Member')}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-light-bg dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      >
                        <option value="Member">Member</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleInviteUser}
                    className="mt-4 w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg sm:rounded-xl font-bold text-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <Mail size={16} className="sm:w-[18px] sm:h-[18px]" />
                    Send Invitation
                  </button>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-extrabold text-dark dark:text-white mb-1 sm:mb-2">Team Members</h3>
                  <p className="text-xs sm:text-sm text-text-secondary mb-4 sm:mb-6">Manage your workspace members</p>

                  <div className="space-y-2 sm:space-y-3">
                    {mockUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-light-bg dark:bg-slate-700 rounded-lg sm:rounded-xl hover:shadow-md transition-all gap-3"
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-bold shadow-lg text-sm sm:text-base flex-shrink-0">
                            {user.name[0]}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-dark dark:text-white text-sm sm:text-base truncate">{user.name}</p>
                            <p className="text-xs sm:text-sm text-text-secondary dark:text-slate-300 truncate">{user.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 ms-[52px] sm:ms-0">
                          <span className={`px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-bold rounded-lg ${
                            user.role === 'Admin'
                              ? 'bg-primary/20 text-primary border border-primary/30'
                              : 'bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-slate-300 border border-gray-300 dark:border-slate-500'
                          }`}>
                            {user.role}
                          </span>
                          <span className={`px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-bold rounded-lg ${
                            user.status === 'active'
                              ? 'bg-green/20 text-green border border-green/30'
                              : 'bg-amber/20 text-amber border border-amber/30'
                          }`}>
                            {user.status}
                          </span>
                          <button className="p-1.5 sm:p-2 hover:bg-red/10 rounded-lg transition-colors ms-auto sm:ms-0">
                            <Trash size={14} className="sm:w-4 sm:h-4 text-red" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Team Settings */}
            {activeTab === 'team' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-extrabold text-dark dark:text-white mb-1 sm:mb-2">Team Information</h3>
                  <p className="text-xs sm:text-sm text-text-secondary mb-4 sm:mb-6">Configure your team details</p>

                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-[10px] sm:text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider mb-1.5 sm:mb-2">
                        Team Name
                      </label>
                      <input
                        type="text"
                        defaultValue="AI BY SEA"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-light-bg dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-dark dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] sm:text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider mb-1.5 sm:mb-2">
                        Company Website
                      </label>
                      <input
                        type="url"
                        defaultValue="https://aibysea.com"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-light-bg dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-dark dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-[10px] sm:text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider mb-1.5 sm:mb-2">
                          Default Language
                        </label>
                        <select className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-light-bg dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-dark dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                          <option>English</option>
                          <option>Arabic</option>
                          <option>Spanish</option>
                          <option>French</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] sm:text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider mb-1.5 sm:mb-2">
                          Timezone
                        </label>
                        <select className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-light-bg dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-dark dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                          <option>UTC+3 (Dubai)</option>
                          <option>UTC+0 (GMT)</option>
                          <option>UTC-5 (EST)</option>
                          <option>UTC-8 (PST)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <button className="mt-4 sm:mt-6 w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg sm:rounded-xl font-bold text-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2">
                    <Save size={16} className="sm:w-[18px] sm:h-[18px]" />
                    Save Changes
                  </button>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border-2 border-red/20">
                  <h3 className="text-lg sm:text-xl font-extrabold text-dark dark:text-white mb-1 sm:mb-2 flex items-center gap-2">
                    <AlertCircle className="text-red w-5 h-5 sm:w-6 sm:h-6" />
                    Danger Zone
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary mb-4 sm:mb-6">Irreversible and destructive actions</p>

                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-red/5 rounded-lg sm:rounded-xl border border-red/20 gap-3">
                      <div>
                        <p className="font-bold text-dark dark:text-white text-sm sm:text-base">Delete Team</p>
                        <p className="text-xs sm:text-sm text-text-secondary dark:text-slate-300">Permanently delete this team and all data</p>
                      </div>
                      <button className="w-full sm:w-auto px-4 py-2 bg-red text-white rounded-lg font-bold text-sm hover:bg-red/90 transition-colors">
                        Delete Team
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Channels */}
            {activeTab === 'channels' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
                    <div>
                      <h3 className="text-lg sm:text-xl font-extrabold text-dark dark:text-white">Connected Channels</h3>
                      <p className="text-xs sm:text-sm text-text-secondary dark:text-slate-400 mt-1">Manage your communication channels</p>
                    </div>
                    <button className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg sm:rounded-xl font-bold text-sm hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                      <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
                      Add Channel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {mockChannels.map((channel) => (
                      <div
                        key={channel.id}
                        className={`p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 transition-all hover:shadow-lg ${
                          channel.status === 'connected'
                            ? 'bg-gradient-to-br from-green/5 to-primary/5 border-green/20 dark:from-green/10 dark:to-primary/10'
                            : 'bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-3 sm:mb-4">
                          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 ${
                              channel.status === 'connected'
                                ? 'bg-gradient-to-br from-accent to-primary'
                                : 'bg-gray-400 dark:bg-slate-600'
                            }`}>
                              <Radio className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0 overflow-hidden">
                              <h4 className="font-bold text-dark dark:text-white text-sm sm:text-base truncate">{channel.name}</h4>
                              <p className="text-[10px] sm:text-xs text-text-secondary dark:text-slate-300">{channel.type}</p>
                            </div>
                          </div>

                          <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0 mt-1 ${
                            channel.status === 'connected' ? 'bg-green animate-pulse' : 'bg-gray-400'
                          }`}></div>
                        </div>

                        <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="text-text-secondary dark:text-slate-300">Status</span>
                            <span className={`font-bold ${
                              channel.status === 'connected' ? 'text-green' : 'text-gray-600 dark:text-slate-400'
                            }`}>
                              {channel.status === 'connected' ? 'Connected' : 'Disconnected'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="text-text-secondary dark:text-slate-300">Conversations</span>
                            <span className="font-bold text-dark dark:text-white">{channel.conversations}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {channel.status === 'connected' ? (
                            <>
                              <button className="flex-1 px-2 sm:px-3 py-2 bg-light-bg dark:bg-slate-600 hover:bg-gray-200 dark:hover:bg-slate-500 text-dark dark:text-white rounded-lg font-bold text-xs sm:text-sm transition-colors">
                                Configure
                              </button>
                              <button className="flex-1 px-2 sm:px-3 py-2 bg-red/10 dark:bg-red/20 hover:bg-red/20 dark:hover:bg-red/30 text-red rounded-lg font-bold text-xs sm:text-sm transition-colors">
                                Disconnect
                              </button>
                            </>
                          ) : (
                            <button className="w-full px-3 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-bold text-xs sm:text-sm hover:shadow-lg transition-all">
                              Connect
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Lifecycle Management */}
            {activeTab === 'lifecycle' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
                    <div>
                      <h3 className="text-lg sm:text-xl font-extrabold text-dark dark:text-white">Lifecycle Stages</h3>
                      <p className="text-xs sm:text-sm text-text-secondary dark:text-slate-400 mt-1">Define and manage customer lifecycle stages</p>
                    </div>
                    <button className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg sm:rounded-xl font-bold text-sm hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                      <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
                      Add Stage
                    </button>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    {lifecycles.map((lifecycle, index) => (
                      <div
                        key={lifecycle.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-5 bg-light-bg dark:bg-slate-700 rounded-lg sm:rounded-xl hover:shadow-md transition-all border-2 border-transparent hover:border-primary/20 gap-3"
                      >
                        <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1">
                          <div className="text-lg sm:text-2xl font-extrabold text-text-secondary dark:text-slate-400 w-6 sm:w-8 flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                              <h4 className="font-extrabold text-dark dark:text-white text-sm sm:text-lg">{lifecycle.name}</h4>
                              <span className={`px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold rounded-lg border-2 ${getLifecycleColor(lifecycle.color)}`}>
                                {lifecycle.color}
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm text-text-secondary dark:text-slate-300">{lifecycle.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ms-9 sm:ms-0">
                          <button className="p-1.5 sm:p-2 hover:bg-white dark:hover:bg-slate-600 rounded-lg transition-colors">
                            <Edit size={16} className="sm:w-[18px] sm:h-[18px] text-text-secondary dark:text-slate-400 hover:text-primary" />
                          </button>
                          <button className="p-1.5 sm:p-2 hover:bg-red/10 rounded-lg transition-colors">
                            <Trash size={16} className="sm:w-[18px] sm:h-[18px] text-red" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-primary/20">
                  <h4 className="font-extrabold text-dark dark:text-white mb-1 sm:mb-2 flex items-center gap-2 text-sm sm:text-base">
                    <Activity size={18} className="sm:w-5 sm:h-5 text-primary" />
                    Lifecycle Automation
                  </h4>
                  <p className="text-xs sm:text-sm text-text-secondary mb-3 sm:mb-4">
                    Automatically move contacts between lifecycle stages based on their behavior and interactions
                  </p>
                  <button className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg sm:rounded-xl font-bold text-sm hover:shadow-xl transition-all duration-300 hover:scale-105 shadow-lg">
                    Configure Automation
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
