'use client';

import TopBar from '@/components/layout/TopBar';
import React, { useState } from 'react';
import {
  Search,
  Download,
  Eye,
  Filter,
  FileText,
  CheckCircle,
  Copy,
  AlertCircle,
  X
} from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useTranslations } from 'next-intl';
import Card from '@/components/ui/Card';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/animations/variants';

// Mock extracted data
const extractedDataList = [
  {
    id: 1,
    jobId: 'job-001',
    documentName: 'Invoice_Jan_2024.pdf',
    template: 'Invoice',
    extractedAt: '2 hours ago',
    confidence: 96,
    status: 'verified',
    fields: {
      invoice_number: { value: 'INV-2024-001', confidence: 98 },
      invoice_date: { value: '2024-01-15', confidence: 96 },
      total_amount: { value: '$2,450.00', confidence: 94 },
      vendor_name: { value: 'Acme Corporation', confidence: 92 },
      due_date: { value: '2024-02-15', confidence: 95 }
    }
  },
  {
    id: 2,
    jobId: 'job-002',
    documentName: 'Receipt_Store_ABC.pdf',
    template: 'Receipt',
    extractedAt: '45 minutes ago',
    confidence: 92,
    status: 'verified',
    fields: {
      receipt_number: { value: 'RCP-ABC-12345', confidence: 99 },
      transaction_date: { value: '2024-01-16', confidence: 97 },
      total_paid: { value: '$87.50', confidence: 93 },
      merchant_name: { value: 'Store ABC', confidence: 91 },
      payment_method: { value: 'Credit Card', confidence: 88 }
    }
  },
  {
    id: 3,
    jobId: 'job-003',
    documentName: 'Form_Application.pdf',
    template: 'Form',
    extractedAt: '4 hours ago',
    confidence: 88,
    status: 'pending_review',
    fields: {
      full_name: { value: 'John Doe', confidence: 95 },
      date_of_birth: { value: '1990-05-15', confidence: 92 },
      email: { value: 'john.doe@example.com', confidence: 99 },
      phone: { value: '555-0123', confidence: 91 },
      address: { value: '123 Main St, City, State 12345', confidence: 85 }
    }
  },
  {
    id: 4,
    jobId: 'job-004',
    documentName: 'Contract_Partnership.docx',
    template: 'Contract',
    extractedAt: '1 day ago',
    confidence: 94,
    status: 'verified',
    fields: {
      party_a: { value: 'ABC Corporation', confidence: 96 },
      party_b: { value: 'XYZ Company', confidence: 95 },
      effective_date: { value: '2024-01-01', confidence: 98 },
      term_years: { value: '3', confidence: 94 },
      renewal_clause: { value: 'Auto-renewal with 30-day notice', confidence: 87 }
    }
  },
  {
    id: 5,
    jobId: 'job-005',
    documentName: 'Receipt_Restaurant_XYZ.jpg',
    template: 'Receipt',
    extractedAt: '1 day ago',
    confidence: 91,
    status: 'verified',
    fields: {
      receipt_number: { value: 'RCP-XYZ-98765', confidence: 98 },
      transaction_date: { value: '2024-01-14', confidence: 96 },
      total_paid: { value: '$156.75', confidence: 94 },
      merchant_name: { value: 'Restaurant XYZ', confidence: 93 },
      tax_amount: { value: '$12.54', confidence: 89 }
    }
  }
];

const stats = {
  totalExtracted: extractedDataList.length,
  verified: extractedDataList.filter(d => d.status === 'verified').length,
  pendingReview: extractedDataList.filter(d => d.status === 'pending_review').length,
  avgConfidence: Math.round(extractedDataList.reduce((sum, d) => sum + d.confidence, 0) / extractedDataList.length)
};

export default function ExtractedDataPage() {
  const t = useTranslations('Data');
  usePageTitle(t('title'));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedData, setSelectedData] = useState<typeof extractedDataList[0] | null>(null);
  const [filterTemplate, setFilterTemplate] = useState('all');

  const filteredData = extractedDataList.filter(data => {
    const matchesSearch = data.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          data.jobId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTemplate = filterTemplate === 'all' || data.template === filterTemplate;
    return matchesSearch && matchesTemplate;
  });

  const templates = Array.from(new Set(extractedDataList.map(d => d.template)));

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return 'text-green-600';
    if (confidence >= 85) return 'text-primary-600';
    if (confidence >= 75) return 'text-amber-600';
    return 'text-red-600';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'pending_review':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <>
      <TopBar title={t('title')} />

      <div className="p-4 sm:p-6 bg-gray-100 dark:bg-slate-900 max-w-[1600px] mx-auto">
        {/* Stats Overview */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <motion.div variants={staggerItem} className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-gray-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h3 className="text-xl font-extrabold text-dark dark:text-white mb-0.5"><AnimatedCounter value={stats.totalExtracted} /></h3>
            <p className="text-sm text-text-secondary font-medium">Total Extracted</p>
          </motion.div>

          <motion.div variants={staggerItem} className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-gray-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <h3 className="text-xl font-extrabold text-dark dark:text-white mb-0.5"><AnimatedCounter value={stats.verified} /></h3>
            <p className="text-sm text-text-secondary font-medium">Verified</p>
          </motion.div>

          <motion.div variants={staggerItem} className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-gray-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <h3 className="text-xl font-extrabold text-dark dark:text-white mb-0.5"><AnimatedCounter value={stats.pendingReview} /></h3>
            <p className="text-sm text-text-secondary font-medium">Pending Review</p>
          </motion.div>

          <motion.div variants={staggerItem} className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-gray-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <h3 className="text-xl font-extrabold text-dark dark:text-white mb-0.5"><AnimatedCounter value={stats.avgConfidence} />%</h3>
            <p className="text-sm text-text-secondary font-medium">Avg Confidence</p>
          </motion.div>
        </motion.div>

        {/* Search and Filter */}
        <Card variant="default" className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2 relative">
              <Search className="absolute start-3 top-3 text-text-secondary dark:text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search by document name or job ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full ps-10 pe-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-lg focus:border-primary-500 focus:outline-none transition-colors bg-white dark:bg-slate-800 text-dark dark:text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-text-secondary dark:text-slate-400 flex-shrink-0" />
              <select
                value={filterTemplate}
                onChange={(e) => setFilterTemplate(e.target.value)}
                className="flex-1 px-3 py-2.5 border border-gray-200 dark:border-slate-700 rounded-lg focus:border-primary-500 focus:outline-none transition-colors text-dark dark:text-white bg-white dark:bg-slate-800 font-medium"
              >
                <option value="all">All Templates</option>
                {templates.map(template => (
                  <option key={template} value={template}>{template}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Data List */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-2">
          {filteredData.map((data) => (
            <motion.div key={data.id} variants={staggerItem}>
              <Card
                variant="interactive"
                className="cursor-pointer"
                onClick={() => setSelectedData(data)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText size={20} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-base font-bold text-dark dark:text-white truncate">{data.documentName}</h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${getStatusBadge(data.status)}`}>
                          {data.status === 'verified' ? 'Verified' : 'Pending Review'}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary dark:text-slate-400">
                        {data.template} &middot; {data.jobId} &middot; {data.extractedAt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0 ms-3">
                    <div className="text-end">
                      <p className="text-xs text-text-secondary mb-0.5">Confidence</p>
                      <p className={`text-lg font-bold ${getConfidenceColor(data.confidence)}`}>
                        {data.confidence}%
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedData(data);
                        }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <Eye size={18} className="text-text-secondary hover:text-primary-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <Download size={18} className="text-text-secondary hover:text-primary-600" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Fields Preview */}
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {Object.entries(data.fields).slice(0, 3).map(([key, field]) => (
                      <div key={key} className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-2.5">
                        <p className="text-xs text-text-secondary mb-0.5 font-medium uppercase">{key.replace(/_/g, ' ')}</p>
                        <p className="text-sm font-medium text-dark dark:text-white truncate">{field.value}</p>
                        <p className={`text-xs mt-0.5 ${getConfidenceColor(field.confidence)}`}>{field.confidence}%</p>
                      </div>
                    ))}
                    {Object.entries(data.fields).length > 3 && (
                      <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-2.5 flex items-center justify-center">
                        <p className="text-sm text-text-secondary">+{Object.entries(data.fields).length - 3} more</p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Detail Sidebar */}
        {selectedData && (
          <div className="fixed end-0 top-0 h-full w-full max-w-xl bg-white dark:bg-slate-800 shadow-2xl z-50 overflow-y-auto">
            <div className="p-4 sm:p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-bold text-dark dark:text-white mb-1 truncate">{selectedData.documentName}</h2>
                  <p className="text-sm text-text-secondary dark:text-slate-400">
                    {selectedData.template} &middot; {selectedData.jobId}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedData(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0"
                >
                  <X size={20} className="text-text-secondary" />
                </button>
              </div>

              {/* Status Bar */}
              <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3 mb-4 border-s-4 border-primary-500">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs text-text-secondary mb-0.5">Status</p>
                    <p className="font-medium text-sm text-dark dark:text-white">{selectedData.status === 'verified' ? 'Verified' : 'Pending Review'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary mb-0.5">Confidence</p>
                    <p className={`font-bold text-base ${getConfidenceColor(selectedData.confidence)}`}>{selectedData.confidence}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary mb-0.5">Extracted</p>
                    <p className="font-medium text-sm text-dark dark:text-white">{selectedData.extractedAt}</p>
                  </div>
                </div>
              </div>

              {/* Fields */}
              <h3 className="text-sm font-bold text-dark dark:text-white mb-3 uppercase tracking-wider">Extracted Fields</h3>
              <div className="space-y-2 mb-4">
                {Object.entries(selectedData.fields).map(([key, field]) => (
                  <div key={key} className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-text-secondary uppercase tracking-wide">{key.replace(/_/g, ' ')}</label>
                      <span className={`text-xs font-bold ${getConfidenceColor(field.confidence)}`}>
                        {field.confidence}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={field.value}
                        readOnly
                        className="flex-1 px-3 py-1.5 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-dark dark:text-white text-sm font-medium focus:border-primary-500 focus:outline-none"
                      />
                      <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-lg transition-colors text-text-secondary hover:text-primary-600">
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button className="flex-1 py-2.5 px-4 bg-[#003EF3] text-white rounded-lg font-medium hover:bg-[#0035D0] transition-colors flex items-center justify-center gap-2 text-sm">
                  <Download size={16} />
                  Download CSV
                </button>
                {selectedData.status === 'pending_review' && (
                  <button className="flex-1 py-2.5 px-4 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 text-sm">
                    <CheckCircle size={16} />
                    Mark Verified
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Overlay */}
        {selectedData && (
          <div
            className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
            onClick={() => setSelectedData(null)}
          ></div>
        )}
      </div>
    </>
  );
}
