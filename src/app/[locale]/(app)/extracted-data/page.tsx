'use client';

import TopBar from '@/components/layout/TopBar';
import React, { useState } from 'react';
import {
  ChevronDown,
  FileText,
  CheckCircle,
  AlertCircle,
  Edit2,
  Save,
  X,
  Download,
  Eye,
  MoreVertical,
  TrendingUp,
  BarChart3,
  Activity,
  Zap
} from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';
import Card from '@/components/ui/Card';

// Mock extracted data
const extractedData = [
  {
    id: 1,
    documentName: 'Invoice_2024_001.pdf',
    template: 'Invoice',
    extractionDate: '1 hour ago',
    confidence: 94,
    status: 'approved' as const,
    fields: [
      { name: 'Invoice Number', value: 'INV-2024-001', confidence: 98, original: 'INV-2024-001' },
      { name: 'Date', value: '2024-01-15', confidence: 96, original: '2024-01-15' },
      { name: 'Amount', value: '$2,500.00', confidence: 92, original: '$2,500.00' },
      { name: 'Vendor', value: 'Acme Corp', confidence: 85, original: 'Acme Corporation' },
      { name: 'Purchase Order', value: 'PO-12345', confidence: 88, original: 'PO-12345' },
      { name: 'Payment Terms', value: 'Net 30', confidence: 80, original: 'Net 30 Days' }
    ]
  },
  {
    id: 2,
    documentName: 'Receipt_Store_ABC.pdf',
    template: 'Receipt',
    extractionDate: '2 hours ago',
    confidence: 91,
    status: 'approved' as const,
    fields: [
      { name: 'Merchant', value: 'Store ABC', confidence: 95, original: 'Store ABC' },
      { name: 'Date', value: '2024-01-16', confidence: 98, original: '2024-01-16' },
      { name: 'Total', value: '$156.89', confidence: 96, original: '$156.89' },
      { name: 'Item Count', value: '5', confidence: 92, original: '5 items' },
      { name: 'Tax', value: '$12.50', confidence: 88, original: '$12.50' }
    ]
  },
  {
    id: 3,
    documentName: 'Contract_Partnership_2024.docx',
    template: 'Contract',
    extractionDate: '3 hours ago',
    confidence: 78,
    status: 'pending_review' as const,
    fields: [
      { name: 'Party A', value: 'Tech Solutions Inc', confidence: 92, original: 'Tech Solutions Inc' },
      { name: 'Party B', value: 'Global Ventures LLC', confidence: 88, original: 'Global Ventures LLC' },
      { name: 'Start Date', value: '2024-02-01', confidence: 85, original: '2024-02-01' },
      { name: 'End Date', value: '2025-02-01', confidence: 82, original: '2025-02-01' },
      { name: 'Payment Amount', value: '$50,000', confidence: 60, original: 'Fifty thousand dollars' },
      { name: 'Termination Clause', value: 'Either party may terminate with 30 days notice', confidence: 65, original: 'Termination with 30 days' }
    ]
  },
  {
    id: 4,
    documentName: 'Form_Application.pdf',
    template: 'Form',
    extractionDate: '5 hours ago',
    confidence: 96,
    status: 'approved' as const,
    fields: [
      { name: 'Full Name', value: 'John Smith', confidence: 98, original: 'John Smith' },
      { name: 'Email', value: 'john@example.com', confidence: 97, original: 'john@example.com' },
      { name: 'Phone', value: '+1-555-0123', confidence: 95, original: '+1-555-0123' },
      { name: 'Date of Birth', value: '1990-05-15', confidence: 94, original: '1990-05-15' },
      { name: 'Employment Status', value: 'Full-time', confidence: 96, original: 'Full-time' }
    ]
  },
  {
    id: 5,
    documentName: 'Invoice_2024_002.pdf',
    template: 'Invoice',
    extractionDate: '1 day ago',
    confidence: 85,
    status: 'rejected' as const,
    fields: [
      { name: 'Invoice Number', value: 'INV-2024-002', confidence: 92, original: 'INV-2024-002' },
      { name: 'Date', value: '2024-01-14', confidence: 95, original: '2024-01-14' },
      { name: 'Amount', value: '$1,800.00', confidence: 88, original: '$1,800.00' },
      { name: 'Vendor', value: 'Unknown', confidence: 42, original: '[unclear]' },
      { name: 'Purchase Order', value: 'N/A', confidence: 35, original: '[not found]' }
    ]
  },
  {
    id: 6,
    documentName: 'Receipt_Restaurant_XYZ.jpg',
    template: 'Receipt',
    extractionDate: '2 days ago',
    confidence: 92,
    status: 'approved' as const,
    fields: [
      { name: 'Merchant', value: 'Restaurant XYZ', confidence: 96, original: 'Restaurant XYZ' },
      { name: 'Date', value: '2024-01-10', confidence: 98, original: '2024-01-10' },
      { name: 'Total', value: '$87.50', confidence: 94, original: '$87.50' },
      { name: 'Tip', value: '$10.00', confidence: 89, original: '$10.00' },
      { name: 'Tax', value: '$6.50', confidence: 91, original: '$6.50' }
    ]
  },
  {
    id: 7,
    documentName: 'Invoice_2024_003.pdf',
    template: 'Invoice',
    extractionDate: '3 hours ago',
    confidence: 89,
    status: 'pending_review' as const,
    fields: [
      { name: 'Invoice Number', value: 'INV-2024-003', confidence: 96, original: 'INV-2024-003' },
      { name: 'Date', value: '2024-01-15', confidence: 97, original: '2024-01-15' },
      { name: 'Amount', value: '$3,200.00', confidence: 91, original: '$3,200.00' },
      { name: 'Vendor', value: 'Tech Solutions', confidence: 87, original: 'Tech Solutions' },
      { name: 'Purchase Order', value: 'PO-54321', confidence: 85, original: 'PO-54321' }
    ]
  },
  {
    id: 8,
    documentName: 'Form_Tax_Return.pdf',
    template: 'Form',
    extractionDate: '4 days ago',
    confidence: 94,
    status: 'approved' as const,
    fields: [
      { name: 'Tax Year', value: '2023', confidence: 99, original: '2023' },
      { name: 'Gross Income', value: '$95,000', confidence: 96, original: '$95,000' },
      { name: 'Total Deductions', value: '$12,500', confidence: 93, original: '$12,500' },
      { name: 'Taxable Income', value: '$82,500', confidence: 91, original: '$82,500' },
      { name: 'Total Tax', value: '$14,200', confidence: 94, original: '$14,200' }
    ]
  }
];

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 90) return 'bg-green-100 text-green-700 border-green-300';
  if (confidence >= 70) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
  return 'bg-red-100 text-red-700 border-red-300';
};

const getConfidenceBgColor = (confidence: number) => {
  if (confidence >= 90) return 'bg-green-100';
  if (confidence >= 70) return 'bg-yellow-100';
  return 'bg-red-100';
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-700 border-green-300';
    case 'pending_review':
      return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    case 'rejected':
      return 'bg-red-100 text-red-700 border-red-300';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'approved':
      return 'Approved';
    case 'pending_review':
      return 'Pending Review';
    case 'rejected':
      return 'Rejected';
    default:
      return status;
  }
};

export default function ExtractedDataPage() {
  usePageTitle('Extracted Data');
  const [expandedId, setExpandedId] = useState<number | null>(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<{ [key: string]: string }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Filter logic
  const filteredData = extractedData.filter(item => {
    const searchMatch =
      searchQuery === '' ||
      item.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.template.toLowerCase().includes(searchQuery.toLowerCase());

    const statusMatch =
      filterStatus === 'all' ||
      filterStatus === item.status;

    return searchMatch && statusMatch;
  });

  const startEditing = (id: number, fields: typeof extractedData[0]['fields']) => {
    setEditingId(id);
    const values: { [key: string]: string } = {};
    fields.forEach(field => {
      values[`${id}-${field.name}`] = field.value;
    });
    setEditValues(values);
  };

  const saveEdits = (id: number) => {
    setEditingId(null);
    setEditValues({});
  };

  const cancelEdits = () => {
    setEditingId(null);
    setEditValues({});
  };

  // Statistics
  const totalExtractions = extractedData.length;
  const avgConfidence = Math.round(
    extractedData.reduce((sum, item) => sum + item.confidence, 0) / extractedData.length
  );
  const highQuality = extractedData.filter(item => item.confidence >= 90).length;
  const pendingReview = extractedData.filter(item => item.status === 'pending_review').length;

  return (
    <>
      <TopBar title="Extracted Data" />

      <div className="p-8 bg-light-bg dark:bg-slate-900">
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div
            className="bg-gradient-to-br from-blue-400/10 to-blue-600/10 rounded-2xl p-card-md border-2 border-primary-400/20 hover:shadow-xl transition-all duration-500 hover:scale-105"
            style={{ animation: 'scaleIn 0.5s ease-out 0s both' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText size={24} className="text-white" />
              </div>
              <TrendingUp size={20} className="text-primary-500 dark:text-primary-400" />
            </div>
            <h3 className="text-heading-1 font-extrabold text-dark dark:text-white mb-1">{totalExtractions}</h3>
            <p className="text-sm text-text-secondary font-bold">Total Extractions</p>
          </div>

          <div
            className="bg-gradient-to-br from-blue-400/10 to-blue-600/10 rounded-2xl p-card-md border-2 border-primary-400/20 hover:shadow-xl transition-all duration-500 hover:scale-105"
            style={{ animation: 'scaleIn 0.5s ease-out 0.1s both' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 size={24} className="text-white" />
              </div>
              <Zap size={20} className="text-primary-500 dark:text-primary-400" />
            </div>
            <h3 className="text-heading-1 font-extrabold text-dark dark:text-white mb-1">{avgConfidence}%</h3>
            <p className="text-sm text-text-secondary font-bold">Accuracy Score</p>
          </div>

          <div
            className="bg-gradient-to-br from-blue-400/10 to-blue-600/10 rounded-2xl p-card-md border-2 border-primary-400/20 hover:shadow-xl transition-all duration-500 hover:scale-105"
            style={{ animation: 'scaleIn 0.5s ease-out 0.2s both' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle size={24} className="text-white" />
              </div>
              <Activity size={20} className="text-primary-500 dark:text-primary-400" />
            </div>
            <h3 className="text-heading-1 font-extrabold text-dark dark:text-white mb-1">{highQuality}</h3>
            <p className="text-sm text-text-secondary font-bold">High Quality ({Math.round((highQuality / totalExtractions) * 100)}%)</p>
          </div>

          <div
            className="bg-gradient-to-br from-blue-400/10 to-blue-600/10 rounded-2xl p-card-md border-2 border-primary-400/20 hover:shadow-xl transition-all duration-500 hover:scale-105"
            style={{ animation: 'scaleIn 0.5s ease-out 0.3s both' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <AlertCircle size={24} className="text-white" />
              </div>
              <TrendingUp size={20} className="text-primary-500 dark:text-primary-400" />
            </div>
            <h3 className="text-heading-1 font-extrabold text-dark dark:text-white mb-1">{pendingReview}</h3>
            <p className="text-sm text-text-secondary font-bold">Pending Review</p>
          </div>
        </div>

        {/* Search and Filter */}
        <Card variant="default" className="rounded-2xl mb-8">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Search by document name or template..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 bg-light-bg border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 bg-light-bg border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending_review">Pending Review</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </Card>

        {/* Data Table */}
        <Card variant="default" className="rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-start text-xs font-bold text-text-secondary uppercase tracking-wider">Document</th>
                  <th className="px-6 py-4 text-start text-xs font-bold text-text-secondary uppercase tracking-wider">Template</th>
                  <th className="px-6 py-4 text-start text-xs font-bold text-text-secondary uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-start text-xs font-bold text-text-secondary uppercase tracking-wider">Confidence</th>
                  <th className="px-6 py-4 text-start text-xs font-bold text-text-secondary uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-start text-xs font-bold text-text-secondary uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <React.Fragment key={item.id}>
                      {/* Main Row */}
                      <tr
                        onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                        className="hover:bg-primary-50/30 cursor-pointer transition-all duration-300 border-s-4 border-s-transparent hover:border-s-orange-400"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                              <FileText size={18} className="text-white" />
                            </div>
                            <div>
                              <p className="font-bold text-dark dark:text-white text-sm">{item.documentName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-dark">{item.template}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-text-secondary dark:text-slate-300">{item.extractionDate}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border-2 ${getConfidenceColor(item.confidence)}`}>
                              {item.confidence}%
                            </span>
                            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-300 ${
                                  item.confidence >= 90
                                    ? 'bg-green-500'
                                    : item.confidence >= 70
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                                }`}
                                style={{ width: `${item.confidence}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border-2 ${getStatusColor(item.status)}`}>
                            {getStatusLabel(item.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-1.5 hover:bg-light-bg rounded-lg transition-colors" title="View Details">
                              <Eye size={16} className="text-text-secondary dark:text-slate-300" />
                            </button>
                            <button className="p-1.5 hover:bg-light-bg rounded-lg transition-colors" title="Download">
                              <Download size={16} className="text-text-secondary dark:text-slate-300" />
                            </button>
                            <button className="p-1.5 hover:bg-light-bg rounded-lg transition-colors">
                              <ChevronDown
                                size={16}
                                className="text-text-secondary transition-transform"
                                style={{
                                  transform: expandedId === item.id ? 'rotate(180deg)' : 'rotate(0deg)'
                                }}
                              />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Detail Row */}
                      {expandedId === item.id && (
                        <tr className="bg-primary-50/30 border-s-4 border-s-orange-400">
                          <td colSpan={6} className="px-6 py-6">
                            <div className="space-y-4">
                              {/* Edit Mode Toggle */}
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="font-bold text-dark dark:text-white text-sm uppercase tracking-wider">Extracted Fields</h4>
                                {editingId === item.id ? (
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => saveEdits(item.id)}
                                      className="px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg font-bold text-xs hover:shadow-lg transition-all flex items-center gap-2"
                                    >
                                      <Save size={14} />
                                      Save Changes
                                    </button>
                                    <button
                                      onClick={cancelEdits}
                                      className="px-4 py-2 bg-gray-100 text-dark rounded-lg font-bold text-xs hover:bg-gray-200 transition-all flex items-center gap-2"
                                    >
                                      <X size={14} />
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => startEditing(item.id, item.fields)}
                                    className="px-4 py-2 bg-light-bg text-dark rounded-lg font-bold text-xs hover:bg-service-documents-50 transition-all flex items-center gap-2 border border-gray-200 dark:border-slate-700"
                                  >
                                    <Edit2 size={14} />
                                    Edit Fields
                                  </button>
                                )}
                              </div>

                              {/* Fields Grid */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {item.fields.map((field, idx) => (
                                  <div key={idx} className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 hover:shadow-md transition-all">
                                    <div className="flex items-start justify-between mb-2">
                                      <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block">{field.name}</label>
                                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border-2 ${getConfidenceColor(field.confidence)}`}>
                                        {field.confidence}%
                                      </span>
                                    </div>

                                    {editingId === item.id ? (
                                      <input
                                        type="text"
                                        value={editValues[`${item.id}-${field.name}`] || ''}
                                        onChange={(e) =>
                                          setEditValues({
                                            ...editValues,
                                            [`${item.id}-${field.name}`]: e.target.value
                                          })
                                        }
                                        className="w-full px-3 py-2 bg-service-documents-50 border-2 border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-semibold text-dark"
                                      />
                                    ) : (
                                      <p className="text-sm font-semibold text-dark dark:text-white mb-2">{field.value}</p>
                                    )}

                                    {/* Confidence Bar */}
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                                      <div
                                        className={`h-full transition-all duration-300 ${
                                          field.confidence >= 90
                                            ? 'bg-green-500'
                                            : field.confidence >= 70
                                            ? 'bg-yellow-500'
                                            : 'bg-red-500'
                                        }`}
                                        style={{ width: `${field.confidence}%` }}
                                      ></div>
                                    </div>

                                    {/* Original Value */}
                                    {!editingId && field.original !== field.value && (
                                      <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-text-secondary font-bold mb-1">Original:</p>
                                        <p className="text-xs text-gray-600 line-through">{field.original}</p>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>

                              {/* Action Buttons */}
                              {editingId !== item.id && (
                                <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-slate-700">
                                  <button className="px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg font-bold text-xs hover:shadow-lg transition-all flex items-center gap-2">
                                    <CheckCircle size={14} />
                                    Approve
                                  </button>
                                  <button className="px-4 py-2 bg-light-bg text-dark rounded-lg font-bold text-xs hover:bg-gray-100 transition-all flex items-center gap-2 border border-gray-200 dark:border-slate-700">
                                    <AlertCircle size={14} />
                                    Reject & Reprocess
                                  </button>
                                  <button className="px-4 py-2 bg-light-bg text-dark rounded-lg font-bold text-xs hover:bg-gray-100 transition-all flex items-center gap-2 border border-gray-200 dark:border-slate-700">
                                    <Download size={14} />
                                    Export as CSV
                                  </button>
                                  <button className="px-4 py-2 bg-light-bg text-dark rounded-lg font-bold text-xs hover:bg-gray-100 transition-all flex items-center gap-2 border border-gray-200 dark:border-slate-700">
                                    <Eye size={14} />
                                    View Original
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <FileText size={48} className="mx-auto text-text-secondary mb-4 opacity-30" />
                      <h3 className="text-lg font-bold text-dark dark:text-white mb-2">No extracted data found</h3>
                      <p className="text-sm text-text-secondary dark:text-slate-300">Try adjusting your search or filters</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
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
