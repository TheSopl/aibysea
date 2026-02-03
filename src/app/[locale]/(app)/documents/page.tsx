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
  Trash2
} from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/animations/variants';
import FadeIn from '@/components/ui/FadeIn';


const templates = [
  { id: 'invoice', name: 'Invoice', description: 'Extract invoice details' },
  { id: 'receipt', name: 'Receipt', description: 'Extract receipt information' },
  { id: 'contract', name: 'Contract', description: 'Extract contract terms' },
  { id: 'form', name: 'Form', description: 'Extract form fields' },
  { id: 'custom', name: 'Custom Template', description: 'Create custom extraction' }
];

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

const statistics = {
  totalProcessed: 847,
  avgProcessingTime: 3.2,
  successRate: 94,
  failedUploads: 5
};

export default function DocumentsPage() {
  usePageTitle('Documents');
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
    if (status === 'completed') return 'bg-green-500';
    if (status === 'failed') return 'bg-red-500';
    return 'bg-blue-500';
  };

  const getLeftBorderColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-l-green-500';
      case 'failed':
        return 'border-l-red-500';
      case 'processing':
        return 'border-l-blue-500';
      default:
        return 'border-l-gray-300';
    }
  };

  const processingDocs = uploads.filter(u => u.status === 'processing');
  const completedDocs = uploads.filter(u => u.status === 'completed').length;
  const failedDocs = uploads.filter(u => u.status === 'failed').length;

  return (
    <>
      <TopBar title="Upload & Process Documents" />

      <div className="p-4 sm:p-6 bg-gray-100 dark:bg-slate-900 max-w-[1600px] mx-auto">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <motion.div variants={staggerItem} className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-gray-200 dark:border-slate-700 shadow-sm transition-all duration-300">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                <Upload size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h3 className="text-xl font-extrabold text-dark dark:text-white mb-0.5"><AnimatedCounter value={statistics.totalProcessed} /></h3>
            <p className="text-sm text-text-secondary font-medium">Documents Processed</p>
          </motion.div>

          <motion.div variants={staggerItem} className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-gray-200 dark:border-slate-700 shadow-sm transition-all duration-300">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                <Clock size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h3 className="text-xl font-extrabold text-dark dark:text-white mb-0.5">
              {statistics.avgProcessingTime}m
            </h3>
            <p className="text-sm text-text-secondary font-medium">Avg Processing Time</p>
          </motion.div>

          <motion.div variants={staggerItem} className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-gray-200 dark:border-slate-700 shadow-sm transition-all duration-300">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h3 className="text-xl font-extrabold text-dark dark:text-white mb-0.5">
              <AnimatedCounter value={statistics.successRate} />%
            </h3>
            <p className="text-sm text-text-secondary font-medium">Success Rate</p>
          </motion.div>

          <motion.div variants={staggerItem} className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-gray-200 dark:border-slate-700 shadow-sm transition-all duration-300">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                <AlertCircle size={20} className="text-red-600 dark:text-red-400" />
              </div>
            </div>
            <h3 className="text-xl font-extrabold text-dark dark:text-white mb-0.5"><AnimatedCounter value={failedDocs} /></h3>
            <p className="text-sm text-text-secondary font-medium">Failed Uploads</p>
          </motion.div>
        </motion.div>

        <FadeIn delay={0.1}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div
            className={`lg:col-span-2 rounded-xl p-6 border border-dashed transition-all duration-200 ${
              dragActive
                ? 'border-primary-500 bg-primary-50/50 dark:bg-slate-700 shadow-sm'
                : 'border-primary-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-primary-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center py-6">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-slate-700 flex items-center justify-center mb-3">
                <Upload size={28} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-dark dark:text-white mb-1.5 text-center">
                Drag documents here or click to browse
              </h3>
              <p className="text-sm text-text-secondary mb-4 text-center">
                Supported formats: PDF, DOC, DOCX, JPG, PNG
              </p>
              <Button variant="primary" size="sm" icon={<Plus size={16} />}>
                Choose File
              </Button>
            </div>
          </div>

          <Card variant="default">
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
              Select Template
            </label>
            <div className="space-y-1.5">
              {templates.map(template => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`w-full text-start p-2.5 rounded-lg transition-all border ${
                    selectedTemplate.id === template.id
                      ? 'bg-gray-100 dark:bg-slate-700 border-gray-300 dark:border-slate-600 shadow-sm'
                      : 'bg-light-bg dark:bg-slate-700 border-transparent hover:border-gray-200 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileText
                      size={16}
                      className={selectedTemplate.id === template.id ? 'text-primary-500' : 'text-text-secondary'}
                    />
                    <div>
                      <h4 className="font-medium text-dark dark:text-white text-xs">{template.name}</h4>
                      <p className="text-xs text-text-secondary mt-0.5">{template.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>
        </FadeIn>
        {processingDocs.length > 0 && (
          <Card variant="default" className="mb-6">
            <h2 className="text-lg font-bold text-dark dark:text-white mb-3">Currently Processing</h2>
            <div className="space-y-2">
              {processingDocs.map((doc, index) => {
                const statusTexts = ['Analyzing...', 'Extracting...', 'Finalizing...'];
                const statusText = statusTexts[index % statusTexts.length];

                return (
                  <div
                    key={doc.id}
                    className="p-3 border border-gray-200 dark:border-slate-700 rounded-lg hover:shadow-sm transition-all bg-white dark:bg-slate-800"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 flex-1">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                          <FileText size={18} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-dark dark:text-white text-sm truncate">{doc.fileName}</h4>
                          <p className="text-xs text-text-secondary">{doc.template} • {doc.fileSize}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${getStatusColor(doc.status)}`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></div>
                        {statusText}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-text-secondary">Progress</span>
                          <span className="text-xs font-bold text-primary-600">{doc.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${doc.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        <Card variant="default">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-dark dark:text-white">Recent Uploads</h2>
              <p className="text-sm text-text-secondary mt-0.5">Manage and monitor your document uploads</p>
            </div>
          </div>

          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {uploads.map((upload, index) => (
              <motion.div
                key={upload.id}
                variants={staggerItem}
                className={`rounded-lg border border-l-4 p-3 transition-all duration-200 hover:shadow-sm bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 ${getLeftBorderColor(upload.status)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-gray-100 dark:bg-slate-700">
                      <FileText size={18} className={
                        upload.status === 'completed'
                          ? 'text-green-600 dark:text-green-400'
                          : upload.status === 'failed'
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-blue-600 dark:text-blue-400'
                      } />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-dark dark:text-white text-xs truncate">{upload.fileName}</h3>
                      <p className="text-xs text-text-secondary">{upload.uploadDate}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border whitespace-nowrap flex-shrink-0 ml-2 ${getStatusColor(upload.status)}`}>
                    {getStatusIcon(upload.status)}
                    {upload.status.charAt(0).toUpperCase() + upload.status.slice(1)}
                  </span>
                </div>

                <div className="space-y-1 mb-2 pb-2 border-b border-gray-100 dark:border-slate-700">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-text-secondary">Template</span>
                    <span className="text-xs font-medium text-dark dark:text-white">{upload.template}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-text-secondary">File Size</span>
                    <span className="text-xs font-medium text-dark dark:text-white">{upload.fileSize}</span>
                  </div>
                  {upload.status === 'completed' && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-text-secondary">Extracted Fields</span>
                      <span className="text-xs font-medium text-green-600">{upload.extractedFields}</span>
                    </div>
                  )}
                </div>

                {upload.status === 'processing' && (
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-text-secondary">Processing</span>
                      <span className="text-xs font-bold text-primary-600">{upload.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`${getProgressBarColor(upload.status)} h-1.5 rounded-full transition-all duration-500`}
                        style={{ width: `${upload.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" icon={<Eye size={14} />} className="flex-1 justify-center text-text-secondary">
                    <span className="text-xs font-medium">View</span>
                  </Button>
                  <Button variant="danger" size="sm" icon={<Trash2 size={14} />} onClick={() => deleteUpload(upload.id)} className="flex-1 justify-center bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20 text-red">
                    <span className="text-xs font-medium">Delete</span>
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Card>
      </div>
    </>
  );
}
