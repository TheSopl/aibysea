'use client';

import TopBar from '@/components/layout/TopBar';
import React, { useState } from 'react';
import {
  Clock,
  FileText,
  CheckCircle,
  AlertCircle,
  Filter,
  Download,
  Play,
  X,
  MoreVertical,
  Activity,
  Pause
} from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useTranslations } from 'next-intl';
import Card from '@/components/ui/Card';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/animations/variants';

// Mock processing jobs data
const processingJobs = [
  {
    id: 1,
    documentName: 'Invoice_Jan_2024.pdf',
    uploadTime: '5 minutes ago',
    status: 'processing' as const,
    progress: 75,
    template: 'Invoice',
    timeElapsed: '3 min 45 sec',
    timeRemaining: '1 min 15 sec',
    fileSize: '2.4 MB',
    stages: ['upload', 'validation', 'extraction', 'review', 'complete'],
    currentStage: 2,
    confidence: 92
  },
  {
    id: 2,
    documentName: 'Receipt_Store_ABC.pdf',
    uploadTime: '45 minutes ago',
    status: 'completed' as const,
    progress: 100,
    template: 'Receipt',
    timeElapsed: '4 min 30 sec',
    timeRemaining: '0 sec',
    fileSize: '1.2 MB',
    stages: ['upload', 'validation', 'extraction', 'review', 'complete'],
    currentStage: 4,
    confidence: 96
  },
  {
    id: 3,
    documentName: 'Contract_Partnership_2024.docx',
    uploadTime: '2 hours ago',
    status: 'processing' as const,
    progress: 45,
    template: 'Contract',
    timeElapsed: '8 min 20 sec',
    timeRemaining: '10 min 40 sec',
    fileSize: '3.8 MB',
    stages: ['upload', 'validation', 'extraction', 'review', 'complete'],
    currentStage: 1,
    confidence: 88
  },
  {
    id: 4,
    documentName: 'Invoice_Feb_2024.pdf',
    uploadTime: '3 hours ago',
    status: 'failed' as const,
    progress: 30,
    template: 'Invoice',
    timeElapsed: '2 min 15 sec',
    timeRemaining: '0 sec',
    fileSize: '2.1 MB',
    stages: ['upload', 'validation', 'extraction', 'review', 'complete'],
    currentStage: 1,
    confidence: 45,
    errorMessage: 'Document quality too low. Please upload a clearer image.'
  },
  {
    id: 5,
    documentName: 'Form_Application.pdf',
    uploadTime: '4 hours ago',
    status: 'completed' as const,
    progress: 100,
    template: 'Form',
    timeElapsed: '3 min 5 sec',
    timeRemaining: '0 sec',
    fileSize: '0.8 MB',
    stages: ['upload', 'validation', 'extraction', 'review', 'complete'],
    currentStage: 4,
    confidence: 94
  },
  {
    id: 6,
    documentName: 'Receipt_Restaurant_XYZ.jpg',
    uploadTime: '1 day ago',
    status: 'completed' as const,
    progress: 100,
    template: 'Receipt',
    timeElapsed: '2 min 50 sec',
    timeRemaining: '0 sec',
    fileSize: '0.5 MB',
    stages: ['upload', 'validation', 'extraction', 'review', 'complete'],
    currentStage: 4,
    confidence: 91
  }
];

const stats = {
  processing: processingJobs.filter(j => j.status === 'processing').length,
  completed: processingJobs.filter(j => j.status === 'completed').length,
  failed: processingJobs.filter(j => j.status === 'failed').length,
  avgTime: '4m 32s'
};

export default function ProcessingPage() {
  const t = useTranslations('Processing');
  usePageTitle(t('title'));
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'processing' | 'completed' | 'failed'>('all');
  const [jobs, setJobs] = useState(processingJobs);

  const filteredJobs = selectedStatus === 'all'
    ? jobs
    : jobs.filter(j => j.status === selectedStatus);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'failed':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <>
      <TopBar title={t('title')} />

      <div className="p-4 sm:p-6 bg-gray-100 dark:bg-slate-900 max-w-[1600px] mx-auto">
        {/* Stats Overview */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <motion.div variants={staggerItem} className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-gray-200 dark:border-slate-700 shadow-sm transition-all duration-300">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                <Activity size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h3 className="text-xl font-extrabold text-dark dark:text-white mb-0.5"><AnimatedCounter value={stats.processing} /></h3>
            <p className="text-sm text-text-secondary dark:text-slate-300 font-medium">Currently Processing</p>
          </motion.div>

          <motion.div variants={staggerItem} className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-gray-200 dark:border-slate-700 shadow-sm transition-all duration-300">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h3 className="text-xl font-extrabold text-dark dark:text-white mb-0.5"><AnimatedCounter value={stats.completed} /></h3>
            <p className="text-sm text-text-secondary dark:text-slate-300 font-medium">Completed Today</p>
          </motion.div>

          <motion.div variants={staggerItem} className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-gray-200 dark:border-slate-700 shadow-sm transition-all duration-300">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                <AlertCircle size={20} className="text-red-600 dark:text-red-400" />
              </div>
            </div>
            <h3 className="text-xl font-extrabold text-dark dark:text-white mb-0.5"><AnimatedCounter value={stats.failed} /></h3>
            <p className="text-sm text-text-secondary dark:text-slate-300 font-medium">Failed</p>
          </motion.div>

          <motion.div variants={staggerItem} className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-gray-200 dark:border-slate-700 shadow-sm transition-all duration-300">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                <Clock size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h3 className="text-xl font-extrabold text-dark dark:text-white mb-0.5">{stats.avgTime}</h3>
            <p className="text-sm text-text-secondary dark:text-slate-300 font-medium">Avg Processing</p>
          </motion.div>
        </motion.div>

        {/* Filter Section */}
        <Card variant="default" className="rounded-xl mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-primary-600 dark:text-primary-400" />
              <h3 className="text-lg font-bold text-dark dark:text-white">Filter Jobs</h3>
            </div>
            <div className="flex gap-3">
              {(['all', 'processing', 'completed', 'failed'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 text-sm ${
                    selectedStatus === status
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                      : 'bg-light-bg dark:bg-slate-700 text-text-secondary dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Jobs List */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-3">
          {filteredJobs.map((job, index) => (
            <motion.div key={job.id} variants={staggerItem}>
            <Card
              variant="default"
              className="rounded-xl p-3 hover:shadow-sm transition-all duration-200"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-slate-700`}>
                    <FileText size={18} className={
                      job.status === 'completed'
                        ? 'text-green-600 dark:text-green-400'
                        : job.status === 'failed'
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-blue-600 dark:text-blue-400'
                    } />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-dark dark:text-white">{job.documentName}</h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${getStatusBadge(job.status)}`}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary dark:text-slate-300">
                      Template: <span className="font-semibold">{job.template}</span> • Size: <span className="font-semibold">{job.fileSize}</span> • Uploaded: <span className="font-semibold">{job.uploadTime}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-3 hover:bg-light-bg dark:bg-slate-700 rounded-lg transition-all duration-300">
                    <Download size={20} className="text-text-secondary dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400" />
                  </button>
                  <button className="p-3 hover:bg-light-bg dark:bg-slate-700 rounded-lg transition-all duration-300">
                    <MoreVertical size={20} className="text-text-secondary dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400" />
                  </button>
                </div>
              </div>

              {/* Progress and Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
                {/* Left Column - Progress */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-bold text-text-secondary dark:text-slate-300">Overall Progress</label>
                    <span className="text-lg font-extrabold text-dark dark:text-white"><AnimatedCounter value={job.progress} />%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden mb-3">
                    <div
                      className={`${getProgressColor(job.status)} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${job.progress}%` }}
                    ></div>
                  </div>

                  {/* Stages */}
                  <div className="flex gap-2 justify-between">
                    {job.stages.map((stage, idx) => (
                      <div
                        key={stage}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold text-center transition-all duration-300 ${
                          idx < job.currentStage
                            ? 'bg-gray-100 dark:bg-slate-700 text-green-600 dark:text-green-400'
                            : idx === job.currentStage
                              ? 'bg-gray-100 dark:bg-slate-700 text-blue-600 dark:text-blue-400'
                              : 'bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-slate-500'
                        }`}
                      >
                        {stage.charAt(0).toUpperCase() + stage.slice(1)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column - Timing and Confidence */}
                <div className="space-y-4">
                  {job.status === 'processing' && (
                    <>
                      <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
                        <p className="text-xs text-text-secondary mb-1">Time Elapsed</p>
                        <p className="text-heading-2 font-extrabold text-primary-600 dark:text-primary-400">{job.timeElapsed}</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
                        <p className="text-xs text-text-secondary mb-1">Est. Time Remaining</p>
                        <p className="text-heading-2 font-extrabold text-amber-600">{job.timeRemaining}</p>
                      </div>
                    </>
                  )}
                  {job.status === 'completed' && (
                    <>
                      <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
                        <p className="text-xs text-text-secondary mb-1">Total Processing Time</p>
                        <p className="text-heading-2 font-extrabold text-green-600">{job.timeElapsed}</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
                        <p className="text-xs text-text-secondary mb-1">Confidence Score</p>
                        <p className="text-heading-2 font-extrabold text-accent-600"><AnimatedCounter value={job.confidence} />%</p>
                      </div>
                    </>
                  )}
                  {job.status === 'failed' && (
                    <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4 col-span-1 lg:col-span-2">
                      <p className="text-xs text-red-600 font-bold mb-1">Error Message</p>
                      <p className="text-sm text-red-700">{job.errorMessage}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {job.status === 'processing' && (
                <div className="flex gap-3">
                  <button className="flex-1 py-3 px-6 bg-[#003EF3] text-white rounded-xl font-bold hover:bg-[#0035D0] transition-all duration-300 flex items-center justify-center gap-2">
                    <Pause size={18} />
                    Pause Processing
                  </button>
                  <button className="px-6 py-3 bg-gray-100 dark:bg-slate-700 text-dark dark:text-white rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-300">
                    Cancel
                  </button>
                </div>
              )}
              {job.status === 'failed' && (
                <div className="flex gap-3">
                  <button className="flex-1 py-3 px-6 bg-[#003EF3] text-white rounded-xl font-bold hover:bg-[#0035D0] transition-all duration-300 flex items-center justify-center gap-2">
                    <Play size={18} />
                    Retry Processing
                  </button>
                  <button className="px-6 py-3 bg-gray-100 dark:bg-slate-700 text-dark dark:text-white rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-300">
                    Delete
                  </button>
                </div>
              )}
              {job.status === 'completed' && (
                <div className="flex gap-3">
                  <button className="flex-1 py-3 px-6 bg-[#003EF3] text-white rounded-xl font-bold hover:bg-[#0035D0] transition-all duration-300 flex items-center justify-center gap-2">
                    <Download size={18} />
                    View Results
                  </button>
                  <button className="px-6 py-3 bg-gray-100 dark:bg-slate-700 text-dark dark:text-white rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-300">
                    Export
                  </button>
                </div>
              )}
            </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </>
  );
}
