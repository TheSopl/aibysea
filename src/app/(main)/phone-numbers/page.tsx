'use client';

import TopBar from '@/components/layout/TopBar';
import { useState } from 'react';
import {
  Plus,
  Pause,
  Play,
  Edit,
  Trash,
  Settings as SettingsIcon,
  DollarSign,
  Phone,
  TrendingUp
} from 'lucide-react';

// Mock data for phone numbers
const phoneNumbers = [
  {
    id: 1,
    number: '+1 (555) 0123',
    country: 'United States',
    flag: '🇺🇸',
    status: 'active' as const,
    assignedAgent: 'Sales Voice Agent',
    monthlyCost: 29.99,
    incomingCalls: 1247,
    conversions: 156
  },
  {
    id: 2,
    number: '+44 (20) 7946 0958',
    country: 'United Kingdom',
    flag: '🇬🇧',
    status: 'active' as const,
    assignedAgent: 'Support Voice Agent',
    monthlyCost: 34.99,
    incomingCalls: 856,
    conversions: 98
  },
  {
    id: 3,
    number: '+61 (2) 8099 5000',
    country: 'Australia',
    flag: '🇦🇺',
    status: 'paused' as const,
    assignedAgent: 'Sales Voice Agent',
    monthlyCost: 39.99,
    incomingCalls: 432,
    conversions: 52
  },
  {
    id: 4,
    number: '+33 (1) 5605 4500',
    country: 'France',
    flag: '🇫🇷',
    status: 'testing' as const,
    assignedAgent: 'Support Voice Agent',
    monthlyCost: 34.99,
    incomingCalls: 124,
    conversions: 8
  },
  {
    id: 5,
    number: '+81 (3) 1234 5678',
    country: 'Japan',
    flag: '🇯🇵',
    status: 'active' as const,
    assignedAgent: 'Sales Voice Agent',
    monthlyCost: 44.99,
    incomingCalls: 673,
    conversions: 89
  },
  {
    id: 6,
    number: '+1 (650) 2539 4000',
    country: 'United States',
    flag: '🇺🇸',
    status: 'active' as const,
    assignedAgent: 'Sales Voice Agent',
    monthlyCost: 29.99,
    incomingCalls: 945,
    conversions: 134
  },
];

export default function PhoneNumbersPage() {
  const [numbers, setNumbers] = useState(phoneNumbers);
  const [pausedNumbers, setPausedNumbers] = useState<number[]>([]);

  const activeCount = numbers.filter(n => n.status === 'active' && !pausedNumbers.includes(n.id)).length;
  const totalCost = numbers.reduce((sum, n) => sum + n.monthlyCost, 0);
  const pendingCount = numbers.filter(n => n.status === 'testing').length;
  const testCount = numbers.filter(n => n.status === 'testing').length;

  const togglePause = (id: number) => {
    setPausedNumbers(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const deleteNumber = (id: number) => {
    setNumbers(prev => prev.filter(n => n.id !== id));
  };

  const getStatusBadgeColor = (status: string, isPaused: boolean) => {
    if (isPaused) {
      return 'bg-gray-100 text-gray-700 border-gray-300';
    }
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'paused':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'testing':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusLabel = (status: string, isPaused: boolean) => {
    if (isPaused) return 'Paused';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <>
      <TopBar title="Phone Numbers" />

      <div className="p-4 sm:p-6 lg:p-8 bg-light-bg dark:bg-slate-900">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
          <div
            className="bg-gradient-to-br from-teal-400/10 to-cyan-400/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-teal-200/50 hover:shadow-xl transition-all duration-500 hover:scale-105"
            style={{
              animation: 'scaleIn 0.5s ease-out 0s both'
            }}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <Phone size={20} className="sm:w-6 sm:h-6 text-white" />
              </div>
              <TrendingUp size={16} className="sm:w-5 sm:h-5 text-teal-600" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-dark dark:text-white mb-0.5 sm:mb-1">{activeCount}</h3>
            <p className="text-xs sm:text-sm text-text-secondary font-bold">Active Numbers</p>
          </div>

          <div
            className="bg-gradient-to-br from-teal-400/10 to-cyan-400/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-teal-200/50 hover:shadow-xl transition-all duration-500 hover:scale-105"
            style={{
              animation: 'scaleIn 0.5s ease-out 0.1s both'
            }}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <DollarSign size={20} className="sm:w-6 sm:h-6 text-white" />
              </div>
              <TrendingUp size={16} className="sm:w-5 sm:h-5 text-teal-600" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-dark dark:text-white mb-0.5 sm:mb-1">${totalCost.toFixed(2)}</h3>
            <p className="text-xs sm:text-sm text-text-secondary font-bold">Monthly Cost</p>
          </div>

          <div
            className="bg-gradient-to-br from-teal-400/10 to-cyan-400/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-teal-200/50 hover:shadow-xl transition-all duration-500 hover:scale-105"
            style={{
              animation: 'scaleIn 0.5s ease-out 0.2s both'
            }}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <Phone size={20} className="sm:w-6 sm:h-6 text-white" />
              </div>
              <TrendingUp size={16} className="sm:w-5 sm:h-5 text-teal-600" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-dark dark:text-white mb-0.5 sm:mb-1">{pendingCount}</h3>
            <p className="text-xs sm:text-sm text-text-secondary font-bold">Pending</p>
          </div>

          <div
            className="bg-gradient-to-br from-teal-400/10 to-cyan-400/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-teal-200/50 hover:shadow-xl transition-all duration-500 hover:scale-105"
            style={{
              animation: 'scaleIn 0.5s ease-out 0.3s both'
            }}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <Phone size={20} className="sm:w-6 sm:h-6 text-white" />
              </div>
              <TrendingUp size={16} className="sm:w-5 sm:h-5 text-teal-600" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-dark dark:text-white mb-0.5 sm:mb-1">{testCount}</h3>
            <p className="text-xs sm:text-sm text-text-secondary font-bold">Test</p>
          </div>
        </div>

        {/* Header with Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-dark dark:text-white">Your Phone Numbers</h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">Manage and configure your phone number inventory</p>
          </div>
          <button className="px-4 py-2.5 min-h-[44px] bg-gradient-to-r from-teal-400 to-cyan-500 text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all duration-300 flex items-center gap-2 hover:-translate-y-0.5 w-full sm:w-auto justify-center">
            <Plus size={18} />
            <span className="sm:hidden">Add Number</span>
            <span className="hidden sm:inline">Add Phone Number</span>
          </button>
        </div>

        {/* Phone Numbers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {numbers.map((phone, index) => {
            const isPaused = pausedNumbers.includes(phone.id);
            const displayStatus = isPaused ? 'paused' : phone.status;

            return (
              <div
                key={phone.id}
                className={`bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border-2 hover:shadow-xl transition-all duration-300 border-transparent hover:border-teal-200 ${
                  isPaused ? 'opacity-75' : ''
                }`}
                style={{
                  animation: `fadeIn 0.5s ease-out ${0.4 + index * 0.1}s both`
                }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl sm:text-2xl">{phone.flag}</span>
                      <div className="min-w-0">
                        <h3 className="text-base sm:text-lg font-extrabold text-dark dark:text-white truncate">{phone.number}</h3>
                        <p className="text-xs sm:text-sm text-text-secondary dark:text-slate-300">{phone.country}</p>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-bold border flex-shrink-0 ${getStatusBadgeColor(
                      phone.status,
                      isPaused
                    )}`}
                  >
                    <div
                      className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                        displayStatus === 'active' && !isPaused
                          ? 'bg-green-600 animate-pulse'
                          : displayStatus === 'testing'
                            ? 'bg-amber-600 animate-pulse'
                            : 'bg-gray-400'
                      }`}
                    ></div>
                    {getStatusLabel(phone.status, isPaused)}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-200 dark:border-slate-700">
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-text-secondary dark:text-slate-300">Agent</span>
                    <span className="text-xs sm:text-sm font-semibold text-dark dark:text-white truncate ml-2">{phone.assignedAgent}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-text-secondary dark:text-slate-300">Monthly</span>
                    <span className="text-xs sm:text-sm font-semibold text-dark dark:text-white">${phone.monthlyCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-text-secondary dark:text-slate-300">Calls</span>
                    <span className="text-xs sm:text-sm font-semibold text-dark dark:text-white">{phone.incomingCalls.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-text-secondary dark:text-slate-300">Conversions</span>
                    <span className="text-xs sm:text-sm font-semibold text-teal-600">{phone.conversions}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1 sm:gap-2">
                  {displayStatus === 'active' && !isPaused ? (
                    <button
                      onClick={() => togglePause(phone.id)}
                      className="p-2.5 min-h-[44px] hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors group flex-1"
                      title="Pause"
                    >
                      <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-amber-600 group-hover:scale-105 transition-transform">
                        <Pause size={18} />
                        <span className="text-xs sm:text-sm font-bold">Pause</span>
                      </div>
                    </button>
                  ) : (
                    <button
                      onClick={() => togglePause(phone.id)}
                      className="p-2.5 min-h-[44px] hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors group flex-1"
                      title="Resume"
                    >
                      <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-green-600 group-hover:scale-105 transition-transform">
                        <Play size={18} />
                        <span className="text-xs sm:text-sm font-bold">Resume</span>
                      </div>
                    </button>
                  )}
                  <button className="p-2.5 min-h-[44px] min-w-[44px] hover:bg-light-bg dark:hover:bg-slate-700 rounded-lg transition-colors group flex items-center justify-center" title="Edit">
                    <Edit size={18} className="text-text-secondary group-hover:text-teal-600 group-hover:scale-110 transition-all" />
                  </button>
                  <button className="p-2.5 min-h-[44px] min-w-[44px] hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group flex items-center justify-center" title="Delete">
                    <Trash
                      size={18}
                      className="text-red group-hover:scale-110 transition-transform cursor-pointer"
                      onClick={() => deleteNumber(phone.id)}
                    />
                  </button>
                  <button className="p-2.5 min-h-[44px] min-w-[44px] hover:bg-light-bg dark:hover:bg-slate-700 rounded-lg transition-colors group flex items-center justify-center" title="Settings">
                    <SettingsIcon size={18} className="text-text-secondary group-hover:text-teal-600 group-hover:scale-110 transition-all" />
                  </button>
                </div>
              </div>
            );
          })}
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
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
