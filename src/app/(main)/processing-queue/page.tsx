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
    confidence: 98
  },
  {
    id: 7,
    documentName: 'Invoice_Mar_2024.pdf',
    uploadTime: '10 minutes ago',
    status: 'processing' as const,
    progress: 60,
    template: 'Invoice',
    timeElapsed: '2 min 30 sec',
    timeRemaining: '1 min 40 sec',
    fileSize: '2.6 MB',
    stages: ['upload', 'validation', 'extraction', 'review', 'complete'],
    currentStage: 2,
    confidence: 85
  },
  {
    id: 8,
    documentName: 'Contract_Renewal.docx',
    uploadTime: '15 minutes ago',
    status: 'queued' as const,
    progress: 0,
    template: 'Contract',
    timeElapsed: '0 sec',
    timeRemaining: '5 min',
    fileSize: '4.2 MB',
    stages: ['upload', 'validation', 'extraction', 'review', 'complete'],
    currentStage: 0,
    confidence: 0
  },
  {
    id: 9,
    documentName: 'Receipt_Retail_123.jpg',
    uploadTime: '2 hours ago',
    status: 'completed' as const,
    progress: 100,
    template: 'Receipt',
    timeElapsed: '3 min 15 sec',
    timeRemaining: '0 sec',
    fileSize: '0.6 MB',
    stages: ['upload', 'validation', 'extraction', 'review', 'complete'],
    currentStage: 4,
    confidence: 91
  },
  {
    id: 10,
    documentName: 'Form_Tax_Return.pdf',
    uploadTime: '6 hours ago',
    status: 'completed' as const,
    progress: 100,
    template: 'Form',
    timeElapsed: '4 min 45 sec',
    timeRemaining: '0 sec',
    fileSize: '3.2 MB',
    stages: ['upload', 'validation', 'extraction', 'review', 'complete'],
    currentStage: 4,
    confidence: 97
  }
];

const stageName = {
  upload: 'Upload',
  validation: 'Validation',
  extraction: 'Extraction',
  review: 'Review',
  complete: 'Complete'
};

export default function ProcessingQueuePage() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedJob, setSelectedJob] = useState<typeof processingJobs[0] | null>(null);
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter logic
  const filteredJobs = processingJobs.filter(job => {
    const tabMatch =
      selectedTab === 'all' ||
      selectedTab === job.status;

    const searchMatch =
      searchQuery === '' ||
      job.documentName.toLowerCase().includes(searchQuery.toLowerCase());

    return tabMatch && searchMatch;
  });

  // Sort logic
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === 'newest') return b.id - a.id;
    if (sortBy === 'oldest') return a.id - b.id;
    return b.progress - a.progress;
  });

  // Statistics
  const activeJobs = processingJobs.filter(j => j.status === 'processing' || j.status === 'queued').length;
  const completedToday = processingJobs.filter(j => j.status === 'completed').length;
  const failedJobs = processingJobs.filter(j => j.status === 'failed').length;
  const avgProcessingTime = '3.5 min';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'failed':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'queued':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusIconBg = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-gradient-to-br from-amber-400 to-amber-600';
      case 'completed':
        return 'bg-gradient-to-br from-green-400 to-green-600';
      case 'failed':
        return 'bg-gradient-to-br from-red-400 to-red-600';
      case 'queued':
        return 'bg-gradient-to-br from-gray-400 to-gray-600';
      default:
        return 'bg-gradient-to-br from-gray-400 to-gray-600';
    }
  };

  const getProgressBarColor = (status: string) => {
    if (status === 'completed') return 'bg-gradient-to-r from-green-400 to-green-600';
    if (status === 'failed') return 'bg-gradient-to-r from-red-400 to-red-600';
    if (status === 'queued') return 'bg-gradient-to-r from-gray-400 to-gray-600';
    return 'bg-gradient-to-r from-orange-400 to-red-500';
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const tabs = [
    { id: 'all', label: 'All Jobs', count: processingJobs.length },
    { id: 'processing', label: 'Active', count: processingJobs.filter(j => j.status === 'processing' || j.status === 'queued').length },
    { id: 'completed', label: 'Completed', count: processingJobs.filter(j => j.status === 'completed').length },
    { id: 'failed', label: 'Failed', count: processingJobs.filter(j => j.status === 'failed').length }
  ];

  return (
    <>
      <TopBar title="Processing Queue" />

      <div className="p-8 bg-light-bg dark:bg-slate-900">
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div
            className="bg-gradient-to-br from-blue-400/10 to-blue-600/10 rounded-2xl p-6 border-2 border-blue-400/20 hover:shadow-xl transition-all duration-500 hover:scale-105"
            style={{ animation: 'scaleIn 0.5s ease-out 0s both' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Activity size={24} className="text-white" />
              </div>
              <TrendingUp size={20} className="text-blue-500 dark:text-blue-400" />
            </div>
            <h3 className="text-3xl font-extrabold text-dark dark:text-white mb-1">{activeJobs}</h3>
            <p className="text-sm text-text-secondary font-bold">Active Jobs</p>
          </div>

          <div
            className="bg-gradient-to-br from-blue-400/10 to-blue-600/10 rounded-2xl p-6 border-2 border-blue-400/20 hover:shadow-xl transition-all duration-500 hover:scale-105"
            style={{ animation: 'scaleIn 0.5s ease-out 0.1s both' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle size={24} className="text-white" />
              </div>
              <BarChart3 size={20} className="text-blue-500 dark:text-blue-400" />
            </div>
            <h3 className="text-3xl font-extrabold text-dark dark:text-white mb-1">{completedToday}</h3>
            <p className="text-sm text-text-secondary font-bold">Completed Today</p>
          </div>

          <div
            className="bg-gradient-to-br from-blue-400/10 to-blue-600/10 rounded-2xl p-6 border-2 border-blue-400/20 hover:shadow-xl transition-all duration-500 hover:scale-105"
            style={{ animation: 'scaleIn 0.5s ease-out 0.2s both' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <AlertCircle size={24} className="text-white" />
              </div>
              <TrendingUp size={20} className="text-blue-500 dark:text-blue-400" />
            </div>
            <h3 className="text-3xl font-extrabold text-dark dark:text-white mb-1">{failedJobs}</h3>
            <p className="text-sm text-text-secondary font-bold">Failed Jobs</p>
          </div>

          <div
            className="bg-gradient-to-br from-blue-400/10 to-blue-600/10 rounded-2xl p-6 border-2 border-blue-400/20 hover:shadow-xl transition-all duration-500 hover:scale-105"
            style={{ animation: 'scaleIn 0.5s ease-out 0.3s both' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Clock size={24} className="text-white" />
              </div>
              <Zap size={20} className="text-blue-500 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-extrabold text-dark dark:text-white mb-1">{avgProcessingTime}</h3>
            <p className="text-sm text-text-secondary font-bold">Avg Processing Time</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Search by document name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 bg-light-bg border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              />
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 bg-light-bg border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="progress">Progress</option>
            </select>

            {/* Filter Icon */}
            <button className="p-2.5 hover:bg-light-bg rounded-lg transition-colors">
              <Filter size={20} className="text-text-secondary dark:text-slate-300" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 flex items-center gap-2 border-b border-gray-200 bg-white dark:bg-slate-800 rounded-t-2xl px-6 pt-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`pb-4 px-4 font-bold text-sm relative transition-all ${
                selectedTab === tab.id
                  ? 'text-blue-500'
                  : 'text-text-secondary hover:text-dark'
              }`}
            >
              {tab.label} ({tab.count})
              {selectedTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
              )}
            </button>
          ))}
        </div>

        {/* Job Cards */}
        <div className="bg-white dark:bg-slate-800 rounded-b-2xl shadow-lg overflow-hidden">
          <div className="divide-y divide-gray-100">
            {sortedJobs.length > 0 ? (
              sortedJobs.map((job, index) => (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`p-6 cursor-pointer transition-all duration-300 hover:bg-blue-50/30 border-l-4 ${
                    job.status === 'processing'
                      ? 'border-l-orange-400 hover:shadow-md'
                      : job.status === 'completed'
                      ? 'border-l-green-400'
                      : job.status === 'failed'
                      ? 'border-l-red-400'
                      : 'border-l-gray-300'
                  } ${selectedJob?.id === job.id ? 'bg-orange-50 shadow-md' : ''}`}
                  style={{ animation: `slideInFromLeft 0.3s ease-out ${index * 0.05}s both` }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 ${getStatusIconBg(job.status)} ${
                      job.status === 'processing' ? 'animate-pulse' : ''
                    }`}>
                      <FileText size={24} className="text-white" />
                    </div>

                    {/* Main Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-dark dark:text-white text-lg">{job.documentName}</h3>
                          <div className="flex items-center gap-3 text-xs text-text-secondary mt-1">
                            <span>{job.uploadTime}</span>
                            <span>•</span>
                            <span className="font-semibold">{job.template}</span>
                            <span>•</span>
                            <span>{job.fileSize}</span>
                          </div>
                        </div>
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border-2 whitespace-nowrap ${getStatusColor(job.status)} ${
                          job.status === 'processing' ? 'animate-pulse' : ''
                        }`}>
                          {job.status === 'processing' && (
                            <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
                          )}
                          {getStatusLabel(job.status)}
                        </span>
                      </div>

                      {/* Timeline */}
                      {job.status !== 'queued' && (
                        <div className="flex items-center gap-2 mb-4 mt-3">
                          {job.stages.map((stage, idx) => (
                            <div key={idx} className="flex items-center gap-1">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                idx < job.currentStage
                                  ? 'bg-green-500 text-white'
                                  : idx === job.currentStage
                                  ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white animate-pulse'
                                  : 'bg-gray-200 text-gray-600'
                              }`}>
                                {idx < job.currentStage ? (
                                  <CheckCircle size={16} />
                                ) : (
                                  idx + 1
                                )}
                              </div>
                              {idx < job.stages.length - 1 && (
                                <div className={`w-8 h-0.5 ${
                                  idx < job.currentStage
                                    ? 'bg-green-500'
                                    : 'bg-gray-200'
                                }`}></div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Progress and Time */}
                      <div className="grid grid-cols-3 gap-4">
                        {job.status !== 'queued' && (
                          <div className="col-span-full">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold text-text-secondary dark:text-slate-300">Progress</span>
                              <span className="text-xs font-bold text-blue-600">{job.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                              <div
                                className={`${getProgressBarColor(job.status)} h-2.5 rounded-full transition-all duration-500 shadow-lg`}
                                style={{ width: `${job.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        <div>
                          <label className="text-xs font-bold text-text-secondary uppercase block mb-1">Time Elapsed</label>
                          <p className="text-sm font-bold text-dark">{job.timeElapsed}</p>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-text-secondary uppercase block mb-1">Time Remaining</label>
                          <p className="text-sm font-bold text-dark">{job.timeRemaining}</p>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-text-secondary uppercase block mb-1">Confidence</label>
                          <p className="text-sm font-bold text-dark">{job.confidence}%</p>
                        </div>
                      </div>

                      {/* Error Message */}
                      {job.errorMessage && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-xs font-bold text-red-700">{job.errorMessage}</p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {job.status === 'processing' && (
                        <button className="p-2 hover:bg-light-bg rounded-lg transition-colors" title="Cancel">
                          <X size={18} className="text-red" />
                        </button>
                      )}
                      {job.status === 'failed' && (
                        <button className="p-2 hover:bg-light-bg rounded-lg transition-colors" title="Retry">
                          <Play size={18} className="text-blue-500 dark:text-blue-400" />
                        </button>
                      )}
                      {job.status === 'completed' && (
                        <button className="p-2 hover:bg-light-bg rounded-lg transition-colors" title="Export">
                          <Download size={18} className="text-text-secondary dark:text-slate-300" />
                        </button>
                      )}
                      <button className="p-2 hover:bg-light-bg rounded-lg transition-colors">
                        <MoreVertical size={18} className="text-text-secondary dark:text-slate-300" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <Activity size={48} className="mx-auto text-text-secondary mb-4 opacity-30" />
                <h3 className="text-lg font-bold text-dark dark:text-white mb-2">No jobs found</h3>
                <p className="text-sm text-text-secondary dark:text-slate-300">Try adjusting your filters or search query</p>
              </div>
            )}
          </div>
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
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
