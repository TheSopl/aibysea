'use client';

import TopBar from '@/components/layout/TopBar';
import { useState } from 'react';
import { Save, ChevronDown } from 'lucide-react';

// Mock voice agents for dropdown
const voiceAgents = ['Sales Voice Agent', 'Support Voice Agent', 'Enterprise Voice Agent'];
const languages = ['English', 'Spanish', 'French', 'Arabic', 'German', 'Mandarin'];
const queueBehaviors = ['Round-robin', 'Random', 'Skill-based', 'Load-balanced'];

type VoiceSettings = {
  greetingMessage: string;
  greetingEnabled: boolean;
  language: string;
  voicemailEnabled: boolean;
  voicemailGreeting: string;
  maxVoicemailDuration: number;
  saveTranscription: boolean;
  defaultAgent: string;
  queueBehavior: string;
  maxConcurrentCalls: number;
  callTimeout: number;
  recordingEnabled: boolean;
  dtmfEnabled: boolean;
  callTransferRules: string;
  webhookUrl: string;
};

export default function VoiceSettingsPage() {
  const [settings, setSettings] = useState<VoiceSettings>({
    greetingMessage: 'Thank you for calling AI BY SEA. How can we assist you today?',
    greetingEnabled: true,
    language: 'English',
    voicemailEnabled: true,
    voicemailGreeting: 'Thank you for calling. Please leave a message after the beep.',
    maxVoicemailDuration: 120,
    saveTranscription: true,
    defaultAgent: 'Sales Voice Agent',
    queueBehavior: 'Round-robin',
    maxConcurrentCalls: 50,
    callTimeout: 45,
    recordingEnabled: true,
    dtmfEnabled: true,
    callTransferRules: 'Department routing enabled',
    webhookUrl: 'https://api.example.com/call-events'
  });

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleToggle = (field: keyof VoiceSettings) => {
    setSettings(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleInputChange = (field: keyof VoiceSettings, value: string | number) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  return (
    <>
      <TopBar title="Voice Settings" />

      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Greeting Settings */}
        <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 border-2 border-transparent hover:border-teal-200/50 transition-all duration-300">
          <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-200 dark:border-slate-700">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-white font-bold text-base sm:text-lg">1</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-dark dark:text-white">Greeting Settings</h3>
          </div>

          <div className="space-y-6">
            {/* Enable/Disable Toggle */}
            <div className="flex items-start justify-between">
              <div>
                <label className="text-sm font-bold text-dark block mb-1">Enable Greeting</label>
                <p className="text-xs text-text-secondary dark:text-slate-300">Play greeting message when call is answered</p>
              </div>
              <button
                onClick={() => handleToggle('greetingEnabled')}
                className={`relative inline-flex h-8 w-14 rounded-full transition-colors ${
                  settings.greetingEnabled
                    ? 'bg-gradient-to-r from-teal-400 to-cyan-500'
                    : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-7 w-7 transform rounded-full bg-white shadow-lg transition-transform ${
                    settings.greetingEnabled ? 'translate-x-6.5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Greeting Message */}
            <div>
              <label className="text-sm font-bold text-dark block mb-2">Default Greeting Message</label>
              <textarea
                value={settings.greetingMessage}
                onChange={(e) => handleInputChange('greetingMessage', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 resize-none text-sm"
                placeholder="Enter greeting message..."
              />
              <p className="text-xs text-text-secondary mt-2">Max 500 characters</p>
            </div>

            {/* Language Selector */}
            <div>
              <label className="text-sm font-bold text-dark block mb-2">Language</label>
              <div className="relative">
                <select
                  value={settings.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 text-sm appearance-none cursor-pointer"
                >
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
                <ChevronDown size={18} className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              <p className="text-xs text-text-secondary mt-2">Select greeting language for text-to-speech</p>
            </div>
          </div>
        </div>

        {/* Voicemail Settings */}
        <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 border-2 border-transparent hover:border-teal-200/50 transition-all duration-300">
          <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-200 dark:border-slate-700">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-white font-bold text-base sm:text-lg">2</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-dark dark:text-white">Voicemail Settings</h3>
          </div>

          <div className="space-y-6">
            {/* Enable Voicemail Toggle */}
            <div className="flex items-start justify-between">
              <div>
                <label className="text-sm font-bold text-dark block mb-1">Enable Voicemail</label>
                <p className="text-xs text-text-secondary dark:text-slate-300">Allow callers to leave voicemail messages</p>
              </div>
              <button
                onClick={() => handleToggle('voicemailEnabled')}
                className={`relative inline-flex h-8 w-14 rounded-full transition-colors ${
                  settings.voicemailEnabled
                    ? 'bg-gradient-to-r from-teal-400 to-cyan-500'
                    : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-7 w-7 transform rounded-full bg-white shadow-lg transition-transform ${
                    settings.voicemailEnabled ? 'translate-x-6.5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Voicemail Greeting */}
            <div>
              <label className="text-sm font-bold text-dark block mb-2">Voicemail Greeting</label>
              <textarea
                value={settings.voicemailGreeting}
                onChange={(e) => handleInputChange('voicemailGreeting', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 resize-none text-sm"
                placeholder="Enter voicemail greeting..."
              />
              <p className="text-xs text-text-secondary mt-2">Max 500 characters</p>
            </div>

            {/* Max Duration */}
            <div>
              <label className="text-sm font-bold text-dark block mb-2">Max Voicemail Duration</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={settings.maxVoicemailDuration}
                  onChange={(e) => handleInputChange('maxVoicemailDuration', parseInt(e.target.value))}
                  min="30"
                  max="600"
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 text-sm"
                />
                <span className="text-sm text-text-secondary font-semibold">seconds</span>
              </div>
              <p className="text-xs text-text-secondary mt-2">Limit recording time (30-600 seconds)</p>
            </div>

            {/* Save Transcription Toggle */}
            <div className="flex items-start justify-between">
              <div>
                <label className="text-sm font-bold text-dark block mb-1">Save Transcription</label>
                <p className="text-xs text-text-secondary dark:text-slate-300">Automatically transcribe voicemail messages</p>
              </div>
              <button
                onClick={() => handleToggle('saveTranscription')}
                className={`relative inline-flex h-8 w-14 rounded-full transition-colors ${
                  settings.saveTranscription
                    ? 'bg-gradient-to-r from-teal-400 to-cyan-500'
                    : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-7 w-7 transform rounded-full bg-white shadow-lg transition-transform ${
                    settings.saveTranscription ? 'translate-x-6.5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Call Routing Settings */}
        <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 border-2 border-transparent hover:border-teal-200/50 transition-all duration-300">
          <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-200 dark:border-slate-700">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-white font-bold text-base sm:text-lg">3</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-dark dark:text-white">Call Routing Settings</h3>
          </div>

          <div className="space-y-6">
            {/* Default Agent */}
            <div>
              <label className="text-sm font-bold text-dark block mb-2">Default Agent Assignment</label>
              <div className="relative">
                <select
                  value={settings.defaultAgent}
                  onChange={(e) => handleInputChange('defaultAgent', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 text-sm appearance-none cursor-pointer"
                >
                  {voiceAgents.map(agent => (
                    <option key={agent} value={agent}>{agent}</option>
                  ))}
                </select>
                <ChevronDown size={18} className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              <p className="text-xs text-text-secondary mt-2">Agent to receive calls when others are unavailable</p>
            </div>

            {/* Queue Behavior */}
            <div>
              <label className="text-sm font-bold text-dark block mb-2">Call Queue Behavior</label>
              <div className="relative">
                <select
                  value={settings.queueBehavior}
                  onChange={(e) => handleInputChange('queueBehavior', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 text-sm appearance-none cursor-pointer"
                >
                  {queueBehaviors.map(behavior => (
                    <option key={behavior} value={behavior}>{behavior}</option>
                  ))}
                </select>
                <ChevronDown size={18} className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              <p className="text-xs text-text-secondary mt-2">How calls are distributed to available agents</p>
            </div>

            {/* Max Concurrent Calls */}
            <div>
              <label className="text-sm font-bold text-dark block mb-2">Max Concurrent Calls</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={settings.maxConcurrentCalls}
                  onChange={(e) => handleInputChange('maxConcurrentCalls', parseInt(e.target.value))}
                  min="1"
                  max="1000"
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 text-sm"
                />
                <span className="text-sm text-text-secondary font-semibold">calls</span>
              </div>
              <p className="text-xs text-text-secondary mt-2">Maximum number of simultaneous calls (1-1000)</p>
            </div>

            {/* Call Timeout */}
            <div>
              <label className="text-sm font-bold text-dark block mb-2">Call Timeout</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={settings.callTimeout}
                  onChange={(e) => handleInputChange('callTimeout', parseInt(e.target.value))}
                  min="10"
                  max="600"
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 text-sm"
                />
                <span className="text-sm text-text-secondary font-semibold">seconds</span>
              </div>
              <p className="text-xs text-text-secondary mt-2">Time to wait before routing to voicemail (10-600)</p>
            </div>
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 border-2 border-transparent hover:border-teal-200/50 transition-all duration-300">
          <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-200 dark:border-slate-700">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-white font-bold text-base sm:text-lg">4</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-dark dark:text-white">Advanced Settings</h3>
          </div>

          <div className="space-y-6">
            {/* Recording Toggle */}
            <div className="flex items-start justify-between">
              <div>
                <label className="text-sm font-bold text-dark block mb-1">Enable Recording</label>
                <p className="text-xs text-text-secondary dark:text-slate-300">Record all incoming and outgoing calls</p>
              </div>
              <button
                onClick={() => handleToggle('recordingEnabled')}
                className={`relative inline-flex h-8 w-14 rounded-full transition-colors ${
                  settings.recordingEnabled
                    ? 'bg-gradient-to-r from-teal-400 to-cyan-500'
                    : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-7 w-7 transform rounded-full bg-white shadow-lg transition-transform ${
                    settings.recordingEnabled ? 'translate-x-6.5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* DTMF Toggle */}
            <div className="flex items-start justify-between">
              <div>
                <label className="text-sm font-bold text-dark block mb-1">Enable DTMF Tones</label>
                <p className="text-xs text-text-secondary dark:text-slate-300">Allow touch-tone input during calls</p>
              </div>
              <button
                onClick={() => handleToggle('dtmfEnabled')}
                className={`relative inline-flex h-8 w-14 rounded-full transition-colors ${
                  settings.dtmfEnabled
                    ? 'bg-gradient-to-r from-teal-400 to-cyan-500'
                    : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-7 w-7 transform rounded-full bg-white shadow-lg transition-transform ${
                    settings.dtmfEnabled ? 'translate-x-6.5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Call Transfer Rules */}
            <div>
              <label className="text-sm font-bold text-dark block mb-2">Call Transfer Rules</label>
              <input
                type="text"
                value={settings.callTransferRules}
                onChange={(e) => handleInputChange('callTransferRules', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 text-sm"
                placeholder="Enter transfer rules..."
              />
              <p className="text-xs text-text-secondary mt-2">Define rules for call transfers between departments</p>
            </div>

            {/* Webhook URL */}
            <div>
              <label className="text-sm font-bold text-dark block mb-2">Webhook URL for Call Events</label>
              <input
                type="text"
                value={settings.webhookUrl}
                onChange={(e) => handleInputChange('webhookUrl', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 text-sm"
                placeholder="https://api.example.com/call-events"
              />
              <p className="text-xs text-text-secondary mt-2">Receive real-time call event notifications</p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className={`px-6 py-3 min-h-[44px] rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto ${
              saveStatus === 'saved'
                ? 'bg-green-500 text-white'
                : 'bg-gradient-to-r from-teal-400 to-cyan-500 text-white hover:shadow-lg hover:-translate-y-0.5'
            } disabled:opacity-50`}
          >
            <Save size={20} />
            {saveStatus === 'idle' && 'Save Changes'}
            {saveStatus === 'saving' && 'Saving...'}
            {saveStatus === 'saved' && 'Saved!'}
          </button>
          <p className="text-sm text-text-secondary dark:text-slate-300 text-center sm:text-start">
            {saveStatus === 'saved' && 'Settings saved successfully'}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}
