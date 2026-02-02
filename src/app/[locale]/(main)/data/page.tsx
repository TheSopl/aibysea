'use client';

import TopBar from '@/components/layout/TopBar';
import React, { useState } from 'react';
import {
  Search,
  Download,
  Eye,
  Edit2,
  Trash2,
  Filter,
  FileText,
  CheckCircle,
  Copy,
  ExternalLink,
  TrendingUp,
  BarChart3,
  Activity,
  AlertCircle,
  X
} from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useTranslations } from 'next-intl';

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
    if (confidence >= 85) return 'text-blue-600';
    if (confidence >= 75) return 'text-amber-600';
    return 'text-red-600';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'pending_review':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
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
                <FileText size={24} className="text-white" />
              </div>
              <TrendingUp size={20} className="text-blue-500 dark:text-blue-400" />
            </div>
            <h3 className="text-heading-1 font-extrabold text-dark dark:text-white mb-1">{stats.totalExtracted}</h3>
            <p className="text-sm text-text-secondary dark:text-slate-300 font-bold">Total Extracted</p>
          </div>

          <div className="bg-gradient-to-br from-green-400/10 to-green-600/10 dark:from-green-500/20 dark:to-green-700/20 rounded-2xl p-card-md border-2 border-green-400/20 dark:border-green-500/40 hover:shadow-xl transition-all duration-500 hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle size={24} className="text-white" />
              </div>
              <Activity size={20} className="text-green-500 dark:text-green-400" />
            </div>
            <h3 className="text-heading-1 font-extrabold text-dark dark:text-white mb-1">{stats.verified}</h3>
            <p className="text-sm text-text-secondary dark:text-slate-300 font-bold">Verified</p>
          </div>

          <div className="bg-gradient-to-br from-amber-400/10 to-amber-600/10 dark:from-amber-500/20 dark:to-amber-700/20 rounded-2xl p-card-md border-2 border-amber-400/20 dark:border-amber-500/40 hover:shadow-xl transition-all duration-500 hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                <AlertCircle size={24} className="text-white" />
              </div>
              <BarChart3 size={20} className="text-amber-500 dark:text-amber-400" />
            </div>
            <h3 className="text-heading-1 font-extrabold text-dark dark:text-white mb-1">{stats.pendingReview}</h3>
            <p className="text-sm text-text-secondary dark:text-slate-300 font-bold">Pending Review</p>
          </div>

          <div className="bg-gradient-to-br from-purple-400/10 to-purple-600/10 dark:from-purple-500/20 dark:to-purple-700/20 rounded-2xl p-card-md border-2 border-purple-400/20 dark:border-purple-500/40 hover:shadow-xl transition-all duration-500 hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 size={24} className="text-white" />
              </div>
              <TrendingUp size={20} className="text-purple-500 dark:text-purple-400" />
            </div>
            <h3 className="text-heading-1 font-extrabold text-dark dark:text-white mb-1">{stats.avgConfidence}%</h3>
            <p className="text-sm text-text-secondary dark:text-slate-300 font-bold">Avg Confidence</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-card-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute start-4 top-3.5 text-text-secondary dark:text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search by document name or job ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full ps-12 pe-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-text-secondary dark:text-slate-400" />
              <select
                value={filterTemplate}
                onChange={(e) => setFilterTemplate(e.target.value)}
                className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 text-dark dark:text-white font-semibold"
              >
                <option value="all">All Templates</option>
                {templates.map(template => (
                  <option key={template} value={template}>{template}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Data List */}
        <div className="space-y-4">
          {filteredData.map((data, index) => (
            <div
              key={data.id}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-card-md hover:shadow-2xl transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedData(data)}
              style={{
                animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`
              }}
            >
              <div className="flex items-start justify-between">
                {/* Left Section */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <FileText size={24} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-lg font-extrabold text-dark dark:text-white truncate">{data.documentName}</h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusBadge(data.status)} whitespace-nowrap`}>
                        {data.status === 'verified' ? 'Verified' : 'Pending Review'}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary dark:text-slate-300">
                      Template: <span className="font-semibold">{data.template}</span> • Job ID: <span className="font-semibold text-blue-600 dark:text-blue-400">{data.jobId}</span> • Extracted: <span className="font-semibold">{data.extractedAt}</span>
                    </p>
                  </div>
                </div>

                {/* Right Section - Confidence and Actions */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-end">
                    <p className="text-xs text-text-secondary mb-1">Overall Confidence</p>
                    <p className={`text-2xl font-extrabold ${getConfidenceColor(data.confidence)}`}>
                      {data.confidence}%
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedData(data);
                      }}
                      className="p-3 hover:bg-light-bg dark:bg-slate-700 rounded-lg transition-all duration-300"
                    >
                      <Eye size={20} className="text-blue-600 dark:text-blue-400" />
                    </button>
                    <button className="p-3 hover:bg-light-bg dark:bg-slate-700 rounded-lg transition-all duration-300">
                      <Download size={20} className="text-text-secondary hover:text-blue-600 dark:text-blue-400" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Fields Preview */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(data.fields).slice(0, 3).map(([key, field]) => (
                    <div key={key} className="bg-light-bg dark:bg-slate-700 rounded-lg p-3">
                      <p className="text-xs text-text-secondary mb-1 font-semibold">{key.replace(/_/g, ' ').toUpperCase()}</p>
                      <p className="text-sm font-semibold text-dark dark:text-white truncate">{field.value}</p>
                      <p className={`text-xs mt-1 ${getConfidenceColor(field.confidence)}`}>Confidence: {field.confidence}%</p>
                    </div>
                  ))}
                  {Object.entries(data.fields).length > 3 && (
                    <div className="bg-light-bg dark:bg-slate-700 rounded-lg p-3 flex items-center justify-center">
                      <p className="text-sm font-semibold text-text-secondary dark:text-slate-300">+{Object.entries(data.fields).length - 3} more</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail Modal / Sidebar */}
        {selectedData && (
          <div className="fixed end-0 top-0 h-full w-full max-w-2xl bg-white dark:bg-slate-800 shadow-2xl z-50 overflow-y-auto rounded-s-3xl">
            <div className="p-8 bg-white dark:bg-slate-900">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-heading-2 font-extrabold text-dark mb-2">{selectedData.documentName}</h2>
                  <p className="text-sm text-text-secondary dark:text-slate-300">
                    {selectedData.template} Template • Job ID: {selectedData.jobId}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedData(null)}
                  className="p-2 hover:bg-light-bg dark:bg-slate-700 rounded-lg transition-all duration-300"
                >
                  <X size={24} className="text-dark" />
                </button>
              </div>

              {/* Status Bar */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 mb-6 border-s-4 border-blue-500">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-text-secondary mb-1">Status</p>
                    <p className="font-bold text-dark dark:text-white">{selectedData.status === 'verified' ? '✓ Verified' : 'Pending Review'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary mb-1">Confidence</p>
                    <p className={`font-bold text-lg ${getConfidenceColor(selectedData.confidence)}`}>{selectedData.confidence}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary mb-1">Extracted</p>
                    <p className="font-bold text-dark dark:text-white">{selectedData.extractedAt}</p>
                  </div>
                </div>
              </div>

              {/* Fields */}
              <h3 className="text-lg font-extrabold text-dark mb-4">Extracted Fields</h3>
              <div className="space-y-4 mb-8">
                {Object.entries(selectedData.fields).map(([key, field]) => (
                  <div key={key} className="bg-light-bg dark:bg-slate-700 rounded-xl p-4 hover:shadow-md transition-all duration-300">
                    <div className="flex items-start justify-between mb-2">
                      <label className="text-sm font-bold text-dark uppercase tracking-wide">{key.replace(/_/g, ' ')}</label>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${getConfidenceColor(field.confidence)} bg-white border`}>
                        {field.confidence}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={field.value}
                        readOnly
                        className="flex-1 px-3 py-2 border-2 border-gray-200 dark:border-slate-700 rounded-lg bg-white text-dark dark:text-white font-semibold focus:border-blue-500 focus:outline-none"
                      />
                      <button className="p-2 hover:bg-blue-100 rounded-lg transition-all duration-300 text-blue-600 dark:text-blue-400">
                        <Copy size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                  <Download size={18} />
                  Download as CSV
                </button>
                {selectedData.status === 'pending_review' && (
                  <button className="flex-1 py-3 px-6 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                    <CheckCircle size={18} />
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
