'use client';

import TopBar from '@/components/layout/TopBar';
import React, { useState } from 'react';
import {
  Clock,
  FileText,
  CheckCircle,
  AlertCircle,
  Filter,
  ArrowUpRight,
  Download,
  Play,
  X,
  MoreVertical,
  Activity,
  TrendingUp,
  BarChart3,
  Zap
} from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useTranslations } from 'next-intl';

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
        return 'bg-gradient-to-r from-green-400 to-green-600';
      case 'failed':
        return 'bg-gradient-to-r from-red-400 to-red-600';
      default:
        return 'bg-gradient-to-r from-blue-400 to-blue-600';
    }
  };

  return (
    <>
      <TopBar title={t('title')} />

      <div className="p-8 bg-white dark:bg-slate-900">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-400/10 to-blue-600/10 dark:from-blue-500/20 dark:to-blue-700/20 rounded-2xl p-card-md border-2 border-blue-400/20 dark:border-blue-500/40 hover:shadow-xl transition-all duration-500 hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Activity size={24} className="text-white" />
              </div>
              <Zap size={20} className="text-blue-500 dark:text-blue-400" />
            </div>
            <h3 className="text-3xl font-extrabold text-dark dark:text-white mb-1">{stats.processing}</h3>
            <p className="text-sm text-text-secondary dark:text-slate-300 font-bold">Currently Processing</p>
          </div>

          <div className="bg-gradient-to-br from-green-400/10 to-green-600/10 dark:from-green-500/20 dark:to-green-700/20 rounded-2xl p-card-md border-2 border-green-400/20 dark:border-green-500/40 hover:shadow-xl transition-all duration-500 hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle size={24} className="text-white" />
              </div>
              <TrendingUp size={20} className="text-green-500 dark:text-green-400" />
            </div>
            <h3 className="text-3xl font-extrabold text-dark dark:text-white mb-1">{stats.completed}</h3>
            <p className="text-sm text-text-secondary dark:text-slate-300 font-bold">Completed Today</p>
          </div>

          <div className="bg-gradient-to-br from-red-400/10 to-red-600/10 dark:from-red-500/20 dark:to-red-700/20 rounded-2xl p-card-md border-2 border-red-400/20 dark:border-red-500/40 hover:shadow-xl transition-all duration-500 hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <AlertCircle size={24} className="text-white" />
              </div>
              <ArrowUpRight size={20} className="text-red-500 dark:text-red-400" />
            </div>
            <h3 className="text-3xl font-extrabold text-dark dark:text-white mb-1">{stats.failed}</h3>
            <p className="text-sm text-text-secondary dark:text-slate-300 font-bold">Failed</p>
          </div>

          <div className="bg-gradient-to-br from-blue-400/10 to-blue-600/10 dark:from-blue-500/20 dark:to-blue-700/20 rounded-2xl p-card-md border-2 border-blue-400/20 dark:border-blue-500/40 hover:shadow-xl transition-all duration-500 hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Clock size={24} className="text-white" />
              </div>
              <BarChart3 size={20} className="text-blue-500 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-extrabold text-dark dark:text-white mb-1">{stats.avgTime}</h3>
            <p className="text-sm text-text-secondary dark:text-slate-300 font-bold">Avg Processing</p>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-card-md mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-bold text-dark dark:text-white">Filter Jobs</h3>
            </div>
            <div className="flex gap-3">
              {(['all', 'processing', 'completed', 'failed'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 text-sm ${
                    selectedStatus === status
                      ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-lg'
                      : 'bg-light-bg dark:bg-slate-700 text-text-secondary dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-6">
          {filteredJobs.map((job, index) => (
            <div
              key={job.id}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-card-lg hover:shadow-2xl transition-all duration-300"
              style={{
                animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center shadow-lg ${
                    job.status === 'completed'
                      ? 'bg-gradient-to-br from-green-400 to-green-600'
                      : job.status === 'failed'
                        ? 'bg-gradient-to-br from-red-400 to-red-600'
                        : 'bg-gradient-to-br from-blue-400 to-blue-600'
                  }`}>
                    <FileText size={28} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-extrabold text-dark dark:text-white">{job.documentName}</h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusBadge(job.status)}`}>
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
                    <Download size={20} className="text-text-secondary dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400" />
                  </button>
                  <button className="p-3 hover:bg-light-bg dark:bg-slate-700 rounded-lg transition-all duration-300">
                    <MoreVertical size={20} className="text-text-secondary dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400" />
                  </button>
                </div>
              </div>

              {/* Progress and Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Left Column - Progress */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-bold text-text-secondary dark:text-slate-300">Overall Progress</label>
                    <span className="text-lg font-extrabold text-dark dark:text-white">{job.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inset mb-4">
                    <div
                      className={`${getProgressColor(job.status)} h-4 rounded-full transition-all duration-500 shadow-lg`}
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
                            ? 'bg-green-100 text-green-700 border-green-300'
                            : idx === job.currentStage
                              ? 'bg-blue-100 text-blue-700 border-blue-300 scale-110'
                              : 'bg-gray-100 text-gray-500 border-gray-300'
                        } border-2`}
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
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                        <p className="text-xs text-text-secondary mb-1">Time Elapsed</p>
                        <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">{job.timeElapsed}</p>
                      </div>
                      <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4">
                        <p className="text-xs text-text-secondary mb-1">Est. Time Remaining</p>
                        <p className="text-2xl font-extrabold text-amber-600">{job.timeRemaining}</p>
                      </div>
                    </>
                  )}
                  {job.status === 'completed' && (
                    <>
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                        <p className="text-xs text-text-secondary mb-1">Total Processing Time</p>
                        <p className="text-2xl font-extrabold text-green-600">{job.timeElapsed}</p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                        <p className="text-xs text-text-secondary mb-1">Confidence Score</p>
                        <p className="text-2xl font-extrabold text-purple-600">{job.confidence}%</p>
                      </div>
                    </>
                  )}
                  {job.status === 'failed' && (
                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 col-span-1 lg:col-span-2">
                      <p className="text-xs text-red-600 font-bold mb-1">Error Message</p>
                      <p className="text-sm text-red-700">{job.errorMessage}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {job.status === 'processing' && (
                <div className="flex gap-3">
                  <button className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                    <Zap size={18} />
                    Pause Processing
                  </button>
                  <button className="px-6 py-3 bg-light-bg dark:bg-slate-700 text-dark dark:text-white rounded-xl font-bold hover:bg-gray-200 transition-all duration-300">
                    Cancel
                  </button>
                </div>
              )}
              {job.status === 'failed' && (
                <div className="flex gap-3">
                  <button className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                    <Play size={18} />
                    Retry Processing
                  </button>
                  <button className="px-6 py-3 bg-light-bg dark:bg-slate-700 text-dark dark:text-white rounded-xl font-bold hover:bg-gray-200 transition-all duration-300">
                    Delete
                  </button>
                </div>
              )}
              {job.status === 'completed' && (
                <div className="flex gap-3">
                  <button className="flex-1 py-3 px-6 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                    <Download size={18} />
                    View Results
                  </button>
                  <button className="px-6 py-3 bg-light-bg dark:bg-slate-700 text-dark dark:text-white rounded-xl font-bold hover:bg-gray-200 transition-all duration-300">
                    Export
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
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
