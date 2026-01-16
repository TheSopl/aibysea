'use client';

import TopBar from '@/components/layout/TopBar';
import { useState } from 'react';
import {
  Upload,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  Plus,
  Eye,
  Trash2,
  TrendingUp,
  BarChart3,
  Activity
} from 'lucide-react';

// Mock templates
const templates = [
  { id: 'invoice', name: 'Invoice', description: 'Extract invoice details' },
  { id: 'receipt', name: 'Receipt', description: 'Extract receipt information' },
  { id: 'contract', name: 'Contract', description: 'Extract contract terms' },
  { id: 'form', name: 'Form', description: 'Extract form fields' },
  { id: 'custom', name: 'Custom Template', description: 'Create custom extraction' }
];

// Mock recent uploads
const recentUploads = [
  {
    id: 1,
    fileName: 'Invoice_2024_001.pdf',
    uploadDate: '2 hours ago',
    template: 'Invoice',
    fileSize: '2.4 MB',
    status: 'processing', // or 'completed', 'failed'
    progress: 65,
    extractedFields: 0
  },
  {
    id: 2,
    fileName: 'Receipt_Store_ABC.pdf',
    uploadDate: '5 hours ago',
    template: 'Receipt',
    fileSize: '1.2 MB',
    status: 'completed',
    progress: 100,
    extractedFields: 12
  },
  {
    id: 3,
    fileName: 'Contract_2024_Partnership.docx',
    uploadDate: '1 day ago',
    template: 'Contract',
    fileSize: '3.8 MB',
    status: 'processing',
    progress: 45,
    extractedFields: 0
  },
  {
    id: 4,
    fileName: 'Form_Application.pdf',
    uploadDate: '2 days ago',
    template: 'Form',
    fileSize: '0.8 MB',
    status: 'completed',
    progress: 100,
    extractedFields: 8
  },
  {
    id: 5,
    fileName: 'Invoice_2024_002.pdf',
    uploadDate: '3 days ago',
    template: 'Invoice',
    fileSize: '2.1 MB',
    status: 'failed',
    progress: 0,
    extractedFields: 0
  },
  {
    id: 6,
    fileName: 'Receipt_Restaurant_XYZ.jpg',
    uploadDate: '4 days ago',
    template: 'Receipt',
    fileSize: '0.5 MB',
    status: 'completed',
    progress: 100,
    extractedFields: 10
  }
];

// Mock statistics
const statistics = {
  totalProcessed: 847,
  avgProcessingTime: 3.2,
  successRate: 94,
  failedUploads: 5
};

export default function DocumentsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [uploads, setUploads] = useState(recentUploads);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // Handle file upload here
  };

  const deleteUpload = (id: number) => {
    setUploads(prev => prev.filter(u => u.id !== id));
  };

  const getStatusColor = (status: string) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Clock size={16} />;
      case 'completed':
        return <CheckCircle size={16} />;
      case 'failed':
        return <AlertCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const getProgressBarColor = (status: string) => {
    if (status === 'completed') return 'bg-gradient-to-r from-green-400 to-green-600';
    if (status === 'failed') return 'bg-gradient-to-r from-red-400 to-red-600';
    return 'bg-gradient-to-r from-blue-400 to-blue-600';
  };

  const processingDocs = uploads.filter(u => u.status === 'processing');
  const completedDocs = uploads.filter(u => u.status === 'completed').length;
  const failedDocs = uploads.filter(u => u.status === 'failed').length;

  return (
    <>
      <TopBar title="Upload & Process Documents" />

      <div className="p-8">
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div
            className="bg-gradient-to-br from-blue-400/10 to-blue-600/10 dark:from-blue-500/20 dark:to-blue-700/20 rounded-2xl p-6 border-2 border-blue-400 dark:border-blue-500/20 dark:border-blue-500/40 hover:shadow-xl transition-all duration-500 hover:scale-105"
            style={{
              animation: 'scaleIn 0.5s ease-out 0s both'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Upload size={24} className="text-white" />
              </div>
              <TrendingUp size={20} className="text-blue-500 dark:text-blue-400" />
            </div>
            <h3 className="text-3xl font-extrabold text-dark dark:text-white mb-1">{statistics.totalProcessed}</h3>
            <p className="text-sm text-text-secondary dark:text-slate-300 font-bold">Documents Processed</p>
          </div>

          <div
            className="bg-gradient-to-br from-blue-400/10 to-blue-600/10 rounded-2xl p-6 border-2 border-blue-400 dark:border-blue-500/20 hover:shadow-xl transition-all duration-500 hover:scale-105"
            style={{
              animation: 'scaleIn 0.5s ease-out 0.1s both'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Clock size={24} className="text-white" />
              </div>
              <Activity size={20} className="text-blue-500 dark:text-blue-400" />
            </div>
            <h3 className="text-3xl font-extrabold text-dark dark:text-white mb-1">
              {statistics.avgProcessingTime}m
            </h3>
            <p className="text-sm text-text-secondary dark:text-slate-300 font-bold">Avg Processing Time</p>
          </div>

          <div
            className="bg-gradient-to-br from-blue-400/10 to-blue-600/10 rounded-2xl p-6 border-2 border-blue-400 dark:border-blue-500/20 hover:shadow-xl transition-all duration-500 hover:scale-105"
            style={{
              animation: 'scaleIn 0.5s ease-out 0.2s both'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle size={24} className="text-white" />
              </div>
              <BarChart3 size={20} className="text-blue-500 dark:text-blue-400" />
            </div>
            <h3 className="text-3xl font-extrabold text-dark dark:text-white mb-1">
              {statistics.successRate}%
            </h3>
            <p className="text-sm text-text-secondary dark:text-slate-300 font-bold">Success Rate</p>
          </div>

          <div
            className="bg-gradient-to-br from-blue-400/10 to-blue-600/10 rounded-2xl p-6 border-2 border-blue-400 dark:border-blue-500/20 hover:shadow-xl transition-all duration-500 hover:scale-105"
            style={{
              animation: 'scaleIn 0.5s ease-out 0.3s both'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <AlertCircle size={24} className="text-white" />
              </div>
              <TrendingUp size={20} className="text-blue-500 dark:text-blue-400" />
            </div>
            <h3 className="text-3xl font-extrabold text-dark dark:text-white mb-1">{failedDocs}</h3>
            <p className="text-sm text-text-secondary dark:text-slate-300 font-bold">Failed Uploads</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Upload Zone */}
          <div
            className={`lg:col-span-2 rounded-2xl p-8 border-2 border-dashed transition-all duration-300 ${
              dragActive
                ? 'border-blue-500 bg-blue-50/50 dark:bg-slate-700 shadow-lg'
                : 'border-blue-300 dark:border-slate-600 bg-blue-50/30 dark:bg-slate-700/50 hover:border-blue-400 dark:border-blue-500 hover:bg-blue-50/50 dark:bg-slate-700'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-4 shadow-lg">
                <Upload size={40} className="text-white" />
              </div>
              <h3 className="text-xl font-extrabold text-dark mb-2 text-center">
                Drag documents here or click to browse
              </h3>
              <p className="text-sm text-text-secondary mb-6 text-center">
                Supported formats: PDF, DOC, DOCX, JPG, PNG
              </p>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 flex items-center gap-2 hover:-translate-y-0.5">
                <Plus size={18} />
                Choose File
              </button>
            </div>
          </div>

          {/* Template Selector */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
            <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider mb-3">
              Select Extraction Template
            </label>
            <div className="space-y-2">
              {templates.map(template => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-300 border-2 ${
                    selectedTemplate.id === template.id
                      ? 'bg-gradient-to-r from-blue-400/10 to-blue-600/10 border-blue-400 dark:border-blue-500 shadow-lg'
                      : 'bg-light-bg border-transparent hover:border-blue-300 dark:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileText
                      size={18}
                      className={selectedTemplate.id === template.id ? 'text-blue-500' : 'text-text-secondary'}
                    />
                    <div>
                      <h4 className="font-bold text-dark dark:text-white text-sm">{template.name}</h4>
                      <p className="text-xs text-text-secondary mt-0.5">{template.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Processing Documents Section */}
        {processingDocs.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-extrabold text-dark mb-6">Currently Processing</h2>
            <div className="space-y-4">
              {processingDocs.map((doc, index) => {
                const statusTexts = ['Analyzing...', 'Extracting...', 'Finalizing...'];
                const statusText = statusTexts[index % statusTexts.length];

                return (
                  <div
                    key={doc.id}
                    className="p-5 border-2 border-blue-200 rounded-xl hover:shadow-lg transition-all bg-gradient-to-r from-blue-50 to-transparent"
                    style={{
                      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                          <FileText size={20} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-dark">{doc.fileName}</h4>
                          <p className="text-xs text-text-secondary mt-0.5">{doc.template} • {doc.fileSize}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border-2 ${getStatusColor(doc.status)} animate-pulse`}>
                        <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
                        {statusText}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-text-secondary">Progress</span>
                          <span className="text-xs font-bold text-blue-600">{doc.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inset">
                          <div
                            className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-500 shadow-lg shadow-blue-500/50"
                            style={{ width: `${doc.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent Uploads */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-extrabold text-dark">Recent Uploads</h2>
              <p className="text-sm text-text-secondary mt-1">Manage and monitor your document uploads</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {uploads.map((upload, index) => (
              <div
                key={upload.id}
                className={`rounded-xl border-2 p-5 transition-all duration-300 hover:shadow-lg ${
                  upload.status === 'completed'
                    ? 'bg-green-50/30 border-green-200'
                    : upload.status === 'failed'
                      ? 'bg-red-50/30 border-red-200'
                      : 'bg-blue-50/30 dark:bg-slate-700/50 border-blue-200'
                }`}
                style={{
                  animation: `fadeIn 0.5s ease-out ${0.6 + index * 0.1}s both`
                }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      upload.status === 'completed'
                        ? 'bg-gradient-to-br from-green-400 to-green-600'
                        : upload.status === 'failed'
                          ? 'bg-gradient-to-br from-red-400 to-red-600'
                          : 'bg-gradient-to-br from-blue-400 to-blue-600'
                    }`}>
                      <FileText size={20} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-dark dark:text-white text-sm truncate">{upload.fileName}</h3>
                      <p className="text-xs text-text-secondary mt-0.5">{upload.uploadDate}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border-2 whitespace-nowrap ${getStatusColor(upload.status)}`}>
                    {getStatusIcon(upload.status)}
                    {upload.status.charAt(0).toUpperCase() + upload.status.slice(1)}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4 pb-4 border-b border-gray-200 dark:border-slate-700">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-text-secondary">Template</span>
                    <span className="text-xs font-semibold text-dark">{upload.template}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-text-secondary">File Size</span>
                    <span className="text-xs font-semibold text-dark">{upload.fileSize}</span>
                  </div>
                  {upload.status === 'completed' && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-text-secondary">Extracted Fields</span>
                      <span className="text-xs font-semibold text-green-600">{upload.extractedFields}</span>
                    </div>
                  )}
                </div>

                {/* Progress Bar and Status */}
                {upload.status === 'processing' && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-text-secondary">Processing Status</span>
                      <span className="text-xs font-bold text-blue-600">{upload.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden shadow-inset">
                      <div
                        className={`${getProgressBarColor(upload.status)} h-2.5 rounded-full transition-all duration-500 shadow-md shadow-blue-500/30`}
                        style={{ width: `${upload.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-text-secondary mt-2 text-center">{['Analyzing', 'Extracting', 'Finalizing'][Math.floor(Math.random() * 3)]}...</p>
                  </div>
                )}
                {upload.status === 'completed' && (
                  <div className="mb-4 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-green-700">Extraction Complete</span>
                      <span className="text-xs font-bold text-green-600">{upload.extractedFields} fields extracted</span>
                    </div>
                  </div>
                )}
                {upload.status === 'failed' && (
                  <div className="mb-4 p-3 bg-red-50 rounded-lg">
                    <span className="text-xs font-bold text-red-700">Extraction Failed - Retry or contact support</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button className="flex-1 p-2 hover:bg-white/50 rounded-lg transition-colors group flex items-center justify-center gap-2">
                    <Eye size={16} className="text-text-secondary group-hover:text-blue-500 dark:text-blue-400" />
                    <span className="text-xs font-bold text-text-secondary group-hover:text-blue-500 dark:text-blue-400">View</span>
                  </button>
                  <button
                    onClick={() => deleteUpload(upload.id)}
                    className="flex-1 p-2 hover:bg-red-50 rounded-lg transition-colors group flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} className="text-red group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-red">Delete</span>
                  </button>
                </div>
              </div>
            ))}
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
