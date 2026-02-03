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
import { usePageTitle } from '@/hooks/usePageTitle';
import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/animations/variants';

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
  const t = useTranslations('PhoneNumbers');
  usePageTitle(t('title'));
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
      <TopBar title={t('title')} />

      <div className="p-4 sm:p-6 bg-gray-100 dark:bg-slate-900 max-w-[1600px] mx-auto">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <motion.div variants={staggerItem} className="bg-gradient-to-br from-teal-400/10 to-cyan-400/10 rounded-xl p-3 border border-white/10 shadow-sm transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center">
                <Phone size={20} className="text-white" />
              </div>
              <TrendingUp size={16} className="text-service-voice-600" />
            </div>
            <h3 className="text-xl font-extrabold text-dark dark:text-white mb-0.5"><AnimatedCounter value={activeCount} /></h3>
            <p className="text-sm text-text-secondary font-medium">{t('activeNumbers')}</p>
          </motion.div>

          <motion.div variants={staggerItem} className="bg-gradient-to-br from-teal-400/10 to-cyan-400/10 rounded-xl p-3 border border-white/10 shadow-sm transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center">
                <DollarSign size={20} className="text-white" />
              </div>
              <TrendingUp size={16} className="text-service-voice-600" />
            </div>
            <h3 className="text-xl font-extrabold text-dark dark:text-white mb-0.5">${totalCost.toFixed(2)}</h3>
            <p className="text-sm text-text-secondary font-medium">{t('monthlyCost')}</p>
          </motion.div>

          <motion.div variants={staggerItem} className="bg-gradient-to-br from-teal-400/10 to-cyan-400/10 rounded-xl p-3 border border-white/10 shadow-sm transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center">
                <Phone size={20} className="text-white" />
              </div>
              <TrendingUp size={16} className="text-service-voice-600" />
            </div>
            <h3 className="text-xl font-extrabold text-dark dark:text-white mb-0.5"><AnimatedCounter value={pendingCount} /></h3>
            <p className="text-sm text-text-secondary font-medium">{t('pending')}</p>
          </motion.div>

          <motion.div variants={staggerItem} className="bg-gradient-to-br from-teal-400/10 to-cyan-400/10 rounded-xl p-3 border border-white/10 shadow-sm transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center">
                <Phone size={20} className="text-white" />
              </div>
              <TrendingUp size={16} className="text-service-voice-600" />
            </div>
            <h3 className="text-xl font-extrabold text-dark dark:text-white mb-0.5"><AnimatedCounter value={testCount} /></h3>
            <p className="text-sm text-text-secondary font-medium">{t('test')}</p>
          </motion.div>
        </motion.div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4">
          <div>
            <h2 className="text-xl font-bold text-dark dark:text-white">{t('yourPhoneNumbers')}</h2>
            <p className="text-sm text-text-secondary mt-0.5">{t('manageNumbers')}</p>
          </div>
          <Button variant="primary" size="sm" icon={<Plus size={16} />} className="w-full sm:w-auto justify-center">
            {t('addNumber')}
          </Button>
        </div>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {numbers.map((phone, index) => {
            const isPaused = pausedNumbers.includes(phone.id);
            const displayStatus = isPaused ? 'paused' : phone.status;

            return (
              <motion.div key={phone.id} variants={staggerItem}>
              <Card
                variant="default"
                className={`p-3 hover:shadow-md transition-all duration-200 hover:border-service-voice-200/50 border border-white/10 ${
                  isPaused ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{phone.flag}</span>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-dark dark:text-white truncate">{phone.number}</h3>
                        <p className="text-xs text-text-secondary dark:text-slate-300">{phone.country}</p>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border flex-shrink-0 ${getStatusBadgeColor(
                      phone.status,
                      isPaused
                    )}`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
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

                <div className="space-y-1 mb-2 pb-2 border-b border-gray-100 dark:border-slate-700">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-text-secondary dark:text-slate-300">Agent</span>
                    <span className="text-xs font-medium text-dark dark:text-white truncate ms-2">{phone.assignedAgent}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-text-secondary dark:text-slate-300">Monthly</span>
                    <span className="text-xs font-medium text-dark dark:text-white">${phone.monthlyCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-text-secondary dark:text-slate-300">Calls</span>
                    <span className="text-xs font-medium text-dark dark:text-white"><AnimatedCounter value={phone.incomingCalls} /></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-text-secondary dark:text-slate-300">Conversions</span>
                    <span className="text-xs font-medium text-service-voice-600"><AnimatedCounter value={phone.conversions} /></span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {displayStatus === 'active' && !isPaused ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Pause size={14} />}
                      onClick={() => togglePause(phone.id)}
                      className="flex-1 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                      title="Pause"
                    >
                      <span className="text-xs font-medium">Pause</span>
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Play size={14} />}
                      onClick={() => togglePause(phone.id)}
                      className="flex-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                      title="Resume"
                    >
                      <span className="text-xs font-medium">Resume</span>
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" iconOnly icon={<Edit size={14} className="text-text-secondary" />} title="Edit" />
                  <Button variant="ghost" size="sm" iconOnly icon={<Trash size={14} className="text-red" />} onClick={() => deleteNumber(phone.id)} className="hover:bg-red-50 dark:hover:bg-red-900/20" title="Delete" />
                  <Button variant="ghost" size="sm" iconOnly icon={<SettingsIcon size={14} className="text-text-secondary" />} title="Settings" />
                </div>
              </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </>
  );
}
