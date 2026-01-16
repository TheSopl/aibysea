'use client';

import TopBar from '@/components/layout/TopBar';
import { useState } from 'react';
import {
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Trash2,
  Copy,
  Edit,
  Eye,
  Download,
  Share2,
  Move,
  MoreVertical,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  FileText
} from 'lucide-react';

// Mock template data
const mockTemplates = [
  {
    id: 'invoice',
    name: 'Invoice',
    type: 'Invoice',
    description: 'Extract invoice line items and totals',
    status: 'built-in',
    fields: 5,
    usageCount: 1247,
    successRate: 96,
    lastModified: '2024-01-10',
    icon: '📄'
  },
  {
    id: 'receipt',
    name: 'Receipt',
    type: 'Receipt',
    description: 'Extract receipt details and amount',
    status: 'built-in',
    fields: 4,
    usageCount: 892,
    successRate: 94,
    lastModified: '2024-01-09',
    icon: '🧾'
  },
  {
    id: 'contract',
    name: 'Contract',
    type: 'Contract',
    description: 'Extract contract terms and parties',
    status: 'built-in',
    fields: 7,
    usageCount: 456,
    successRate: 91,
    lastModified: '2024-01-08',
    icon: '📜'
  },
  {
    id: 'form',
    name: 'Application Form',
    type: 'Form',
    description: 'Extract form fields and responses',
    status: 'built-in',
    fields: 10,
    usageCount: 623,
    successRate: 93,
    lastModified: '2024-01-07',
    icon: '📋'
  },
  {
    id: 'paystub',
    name: 'Pay Stub',
    type: 'PayStub',
    description: 'Extract salary and deduction details',
    status: 'built-in',
    fields: 8,
    usageCount: 315,
    successRate: 97,
    lastModified: '2024-01-06',
    icon: '💰'
  },
  {
    id: 'custom-form',
    name: 'HR Application Form',
    type: 'Custom',
    description: 'Custom form for HR applications',
    status: 'custom',
    fields: 8,
    usageCount: 342,
    successRate: 88,
    lastModified: '2024-01-14',
    icon: '👥'
  },
  {
    id: 'custom-survey',
    name: 'Customer Survey',
    type: 'Custom',
    description: 'Extract survey responses',
    status: 'custom',
    fields: 6,
    usageCount: 156,
    successRate: 85,
    lastModified: '2024-01-13',
    icon: '📊'
  },
  {
    id: 'custom-cert',
    name: 'Certificate Template',
    type: 'Custom',
    description: 'Extract certificate details',
    status: 'custom',
    fields: 5,
    usageCount: 78,
    successRate: 90,
    lastModified: '2024-01-12',
    icon: '🎓'
  }
];

// Types
type TemplateField = {
  id: number;
  name: string;
  type: 'text' | 'number' | 'date' | 'currency' | 'boolean' | 'select';
  required: boolean;
  helpText: string;
  validation?: string;
  minLength?: number;
  maxLength?: number;
  format?: string;
  currency?: string;
  options?: string[];
};

// Mock field data
const mockTemplateFields: TemplateField[] = [
  {
    id: 1,
    name: 'Invoice Number',
    type: 'text',
    required: true,
    helpText: 'Extract invoice reference number',
    validation: 'alphanumeric',
    minLength: 1,
    maxLength: 50
  },
  {
    id: 2,
    name: 'Invoice Date',
    type: 'date',
    required: true,
    helpText: 'Extract invoice date',
    format: 'MM/DD/YYYY'
  },
  {
    id: 3,
    name: 'Total Amount',
    type: 'currency',
    required: true,
    helpText: 'Extract total amount',
    currency: 'USD'
  },
  {
    id: 4,
    name: 'Vendor Name',
    type: 'text',
    required: true,
    helpText: 'Extract vendor/supplier name'
  },
  {
    id: 5,
    name: 'Payment Terms',
    type: 'select',
    required: false,
    helpText: 'Extract payment terms',
    options: ['Net 30', 'Net 60', 'Net 90', 'Immediate']
  }
];

type NewTemplate = {
  name: string;
  type: string;
  description: string;
  category?: string;
  tags: string[];
};

type FormState = {
  basicInfo: {
    name: string;
    type: string;
    description: string;
    category: string;
  };
  fields: TemplateField[];
  validation: {
    requireFields: boolean;
    trimWhitespace: boolean;
    autoCapitalize: boolean;
    regexPattern: string;
  };
  preview: {
    layout: 'single' | 'multi';
  };
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState(mockTemplates);
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    basicInfo: true,
    fields: true,
    validation: false,
    preview: false
  });
  const [formData, setFormData] = useState<FormState>({
    basicInfo: {
      name: '',
      type: 'Custom',
      description: '',
      category: ''
    },
    fields: [],
    validation: {
      requireFields: false,
      trimWhitespace: true,
      autoCapitalize: true,
      regexPattern: ''
    },
    preview: {
      layout: 'single'
    }
  });

  const [editingFieldId, setEditingFieldId] = useState<number | null>(null);

  // Statistics
  const stats = {
    total: templates.length,
    active: templates.filter(t => t.status !== 'archived').length,
    successRate: Math.round(templates.reduce((sum, t) => sum + t.successRate, 0) / templates.length),
    processed: templates.reduce((sum, t) => sum + t.usageCount, 0)
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleAddField = () => {
    const newField: TemplateField = {
      id: Date.now(),
      name: '',
      type: 'text',
      required: false,
      helpText: '',
      validation: ''
    };
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const handleRemoveField = (fieldId: number) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter(f => f.id !== fieldId)
    }));
  };

  const handleFieldChange = (fieldId: number, key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(f =>
        f.id === fieldId ? { ...f, [key]: value } : f
      )
    }));
  };

  const handleCreateTemplate = () => {
    if (!formData.basicInfo.name.trim()) {
      alert('Please enter a template name');
      return;
    }

    const newTemplate = {
      id: Date.now().toString(),
      name: formData.basicInfo.name,
      type: formData.basicInfo.type,
      description: formData.basicInfo.description,
      status: 'custom' as const,
      fields: formData.fields.length,
      usageCount: 0,
      successRate: 0,
      lastModified: new Date().toISOString().split('T')[0],
      icon: '✨'
    };

    setTemplates(prev => [newTemplate, ...prev]);
    setShowCreateForm(false);
    setFormData({
      basicInfo: {
        name: '',
        type: 'Custom',
        description: '',
        category: ''
      },
      fields: [],
      validation: {
        requireFields: false,
        trimWhitespace: true,
        autoCapitalize: true,
        regexPattern: ''
      },
      preview: {
        layout: 'single'
      }
    });
  };

  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case 'built-in':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'custom':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'archived':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'built-in':
        return 'Built-in';
      case 'custom':
        return 'Custom';
      case 'archived':
        return 'Archived';
      default:
        return status;
    }
  };

  const duplicateTemplate = (template: typeof mockTemplates[0]) => {
    const duplicated = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      status: 'custom' as const,
      usageCount: 0,
      successRate: 0,
      lastModified: new Date().toISOString().split('T')[0]
    };
    setTemplates(prev => [duplicated, ...prev]);
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  const handleExportJSON = () => {
    const data = {
      name: formData.basicInfo.name,
      type: formData.basicInfo.type,
      description: formData.basicInfo.description,
      fields: formData.fields,
      validation: formData.basicInfo.category
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.basicInfo.name || 'template'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <TopBar title="Document Templates" />

      <div className="p-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div
            className="bg-gradient-to-br from-orange-400/10 to-orange-600/10 rounded-2xl p-6 border-2 border-orange-400/20 hover:shadow-xl transition-all duration-500 hover:scale-105"
            style={{ animation: 'scaleIn 0.5s ease-out 0s both' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText size={24} className="text-white" />
              </div>
              <TrendingUp size={20} className="text-orange-500" />
            </div>
            <h3 className="text-3xl font-extrabold text-dark mb-1">{stats.total}</h3>
            <p className="text-sm text-text-secondary font-bold">Total Templates</p>
          </div>

          <div
            className="bg-gradient-to-br from-orange-400/10 to-orange-600/10 rounded-2xl p-6 border-2 border-orange-400/20 hover:shadow-xl transition-all duration-500 hover:scale-105"
            style={{ animation: 'scaleIn 0.5s ease-out 0.1s both' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle size={24} className="text-white" />
              </div>
              <TrendingUp size={20} className="text-orange-500" />
            </div>
            <h3 className="text-3xl font-extrabold text-dark mb-1">{stats.active}</h3>
            <p className="text-sm text-text-secondary font-bold">Active in Use</p>
          </div>

          <div
            className="bg-gradient-to-br from-orange-400/10 to-orange-600/10 rounded-2xl p-6 border-2 border-orange-400/20 hover:shadow-xl transition-all duration-500 hover:scale-105"
            style={{ animation: 'scaleIn 0.5s ease-out 0.2s both' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp size={24} className="text-white" />
              </div>
              <TrendingUp size={20} className="text-orange-500" />
            </div>
            <h3 className="text-3xl font-extrabold text-dark mb-1">{stats.successRate}%</h3>
            <p className="text-sm text-text-secondary font-bold">Success Rate</p>
          </div>

          <div
            className="bg-gradient-to-br from-orange-400/10 to-orange-600/10 rounded-2xl p-6 border-2 border-orange-400/20 hover:shadow-xl transition-all duration-500 hover:scale-105"
            style={{ animation: 'scaleIn 0.5s ease-out 0.3s both' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText size={24} className="text-white" />
              </div>
              <TrendingUp size={20} className="text-orange-500" />
            </div>
            <h3 className="text-3xl font-extrabold text-dark mb-1">{stats.processed}</h3>
            <p className="text-sm text-text-secondary font-bold">Documents Processed</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Template List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-extrabold text-dark">Templates</h2>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <Plus size={20} />
                Create New Template
              </button>
            </div>

            {/* Template Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map(template => (
                <div
                  key={template.id}
                  className="bg-white rounded-2xl shadow-lg p-6 border-2 border-transparent hover:border-orange-200/50 transition-all duration-300 cursor-pointer"
                  onClick={() => setExpandedTemplate(expandedTemplate === template.id ? null : template.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-3xl">{template.icon}</span>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-dark mb-1">{template.name}</h3>
                        <p className="text-xs text-text-secondary mb-3">{template.description}</p>
                        <div className="flex flex-wrap gap-2">
                          <span className={`px-2 py-1 text-xs font-bold rounded-lg border ${getStatusBadgeStyles(template.status)}`}>
                            {getStatusLabel(template.status)}
                          </span>
                          {template.usageCount > 500 && (
                            <span className="px-2 py-1 text-xs font-bold rounded-lg bg-orange-100 text-orange-700 border border-orange-300">
                              Active
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <MoreVertical size={20} />
                    </button>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b border-gray-200">
                    <div>
                      <p className="text-xs text-text-secondary font-semibold">Fields</p>
                      <p className="text-lg font-bold text-dark">{template.fields}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary font-semibold">Usage</p>
                      <p className="text-lg font-bold text-dark">{template.usageCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary font-semibold">Success</p>
                      <p className="text-lg font-bold text-orange-600">{template.successRate}%</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <button className="flex-1 px-3 py-2 text-xs font-bold text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors flex items-center justify-center gap-1">
                      <Eye size={16} /> Use
                    </button>
                    <button className="flex-1 px-3 py-2 text-xs font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1">
                      <Edit size={16} /> Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateTemplate(template);
                      }}
                      className="flex-1 px-3 py-2 text-xs font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                    >
                      <Copy size={16} /> Duplicate
                    </button>
                    {template.status !== 'built-in' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTemplate(template.id);
                        }}
                        className="flex-1 px-3 py-2 text-xs font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    )}
                  </div>

                  {/* Expanded Details */}
                  {expandedTemplate === template.id && (
                    <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                      <div>
                        <p className="text-xs font-bold text-text-secondary mb-2">LAST MODIFIED</p>
                        <p className="text-sm text-dark">{template.lastModified}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-text-secondary mb-2">DOCUMENT TYPE</p>
                        <p className="text-sm text-dark">{template.type}</p>
                      </div>
                      {template.fields > 0 && (
                        <div>
                          <p className="text-xs font-bold text-text-secondary mb-2">FIELDS</p>
                          <div className="flex flex-wrap gap-1">
                            {Array.from({ length: Math.min(5, template.fields) }).map((_, i) => (
                              <span key={i} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                                Field {i + 1}
                              </span>
                            ))}
                            {template.fields > 5 && (
                              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                                +{template.fields - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Template Builder Form */}
          {showCreateForm && (
            <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-orange-200 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-dark">Create New Template</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Basic Info Section */}
              <div className="mb-6 border rounded-xl overflow-hidden bg-gray-50/50">
                <button
                  onClick={() => toggleSection('basicInfo')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded flex items-center justify-center text-white text-xs font-bold">
                      1
                    </div>
                    <span className="font-bold text-dark">Basic Information</span>
                  </div>
                  {expandedSections.basicInfo ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {expandedSections.basicInfo && (
                  <div className="p-4 space-y-4 border-t border-gray-200">
                    {/* Template Name */}
                    <div>
                      <label className="text-sm font-bold text-dark block mb-2">
                        Template Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.basicInfo.name}
                        onChange={(e) =>
                          setFormData(prev => ({
                            ...prev,
                            basicInfo: { ...prev.basicInfo, name: e.target.value }
                          }))
                        }
                        placeholder="e.g., Invoice Template"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 text-sm"
                      />
                    </div>

                    {/* Document Type */}
                    <div>
                      <label className="text-sm font-bold text-dark block mb-2">Document Type</label>
                      <div className="relative">
                        <select
                          value={formData.basicInfo.type}
                          onChange={(e) =>
                            setFormData(prev => ({
                              ...prev,
                              basicInfo: { ...prev.basicInfo, type: e.target.value }
                            }))
                          }
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 text-sm appearance-none cursor-pointer"
                        >
                          <option value="Custom">Custom</option>
                          <option value="Invoice">Invoice</option>
                          <option value="Receipt">Receipt</option>
                          <option value="Contract">Contract</option>
                          <option value="Form">Form</option>
                        </select>
                        <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="text-sm font-bold text-dark block mb-2">Description</label>
                      <textarea
                        value={formData.basicInfo.description}
                        onChange={(e) =>
                          setFormData(prev => ({
                            ...prev,
                            basicInfo: { ...prev.basicInfo, description: e.target.value }
                          }))
                        }
                        placeholder="Describe what this template extracts..."
                        rows={3}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 text-sm resize-none"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="text-sm font-bold text-dark block mb-2">Category (Optional)</label>
                      <input
                        type="text"
                        value={formData.basicInfo.category}
                        onChange={(e) =>
                          setFormData(prev => ({
                            ...prev,
                            basicInfo: { ...prev.basicInfo, category: e.target.value }
                          }))
                        }
                        placeholder="e.g., Finance, HR, Legal"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Fields Definition Section */}
              <div className="mb-6 border rounded-xl overflow-hidden bg-gray-50/50">
                <button
                  onClick={() => toggleSection('fields')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded flex items-center justify-center text-white text-xs font-bold">
                      2
                    </div>
                    <span className="font-bold text-dark">Field Definitions</span>
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                      {formData.fields.length} fields
                    </span>
                  </div>
                  {expandedSections.fields ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {expandedSections.fields && (
                  <div className="p-4 space-y-4 border-t border-gray-200">
                    {/* Fields List */}
                    {formData.fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="p-4 bg-white rounded-lg border border-gray-200 hover:border-orange-300 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Move size={16} className="text-gray-400" />
                            <span className="text-xs font-bold text-gray-500">FIELD {index + 1}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveField(field.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        {/* Field Name and Type Row */}
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div>
                            <label className="text-xs font-bold text-gray-600 block mb-1">Field Name</label>
                            <input
                              type="text"
                              value={field.name}
                              onChange={(e) => handleFieldChange(field.id, 'name', e.target.value)}
                              placeholder="e.g., Invoice Number"
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-600 block mb-1">Type</label>
                            <div className="relative">
                              <select
                                value={field.type}
                                onChange={(e) => handleFieldChange(field.id, 'type', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 appearance-none cursor-pointer"
                              >
                                <option value="text">Text</option>
                                <option value="number">Number</option>
                                <option value="date">Date</option>
                                <option value="currency">Currency</option>
                                <option value="boolean">Boolean</option>
                                <option value="select">Select</option>
                              </select>
                              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                          </div>
                        </div>

                        {/* Help Text */}
                        <div className="mb-3">
                          <label className="text-xs font-bold text-gray-600 block mb-1">Help Text for Extraction</label>
                          <input
                            type="text"
                            value={field.helpText}
                            onChange={(e) => handleFieldChange(field.id, 'helpText', e.target.value)}
                            placeholder="Describe what to extract..."
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
                          />
                        </div>

                        {/* Required Checkbox */}
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) => handleFieldChange(field.id, 'required', e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                          />
                          <label className="text-xs font-bold text-gray-600 cursor-pointer">
                            Required Field <span className="text-red-500">*</span>
                          </label>
                        </div>

                        {/* Type-Specific Options */}
                        {field.type === 'date' && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <label className="text-xs font-bold text-gray-600 block mb-1">Date Format</label>
                            <div className="relative">
                              <select
                                value={field.format || 'MM/DD/YYYY'}
                                onChange={(e) => handleFieldChange(field.id, 'format', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 appearance-none cursor-pointer"
                              >
                                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                              </select>
                              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                          </div>
                        )}

                        {field.type === 'currency' && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <label className="text-xs font-bold text-gray-600 block mb-1">Currency</label>
                            <div className="relative">
                              <select
                                value={field.currency || 'USD'}
                                onChange={(e) => handleFieldChange(field.id, 'currency', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 appearance-none cursor-pointer"
                              >
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                                <option value="AED">AED</option>
                              </select>
                              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Add Field Button */}
                    <button
                      onClick={handleAddField}
                      className="w-full py-3 border-2 border-dashed border-orange-300 rounded-lg text-orange-600 font-bold hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus size={20} />
                      Add Field
                    </button>
                  </div>
                )}
              </div>

              {/* Validation Section */}
              <div className="mb-6 border rounded-xl overflow-hidden bg-gray-50/50">
                <button
                  onClick={() => toggleSection('validation')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded flex items-center justify-center text-white text-xs font-bold">
                      3
                    </div>
                    <span className="font-bold text-dark">Validation Rules</span>
                  </div>
                  {expandedSections.validation ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {expandedSections.validation && (
                  <div className="p-4 space-y-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200">
                      <input
                        type="checkbox"
                        checked={formData.validation.requireFields}
                        onChange={(e) =>
                          setFormData(prev => ({
                            ...prev,
                            validation: { ...prev.validation, requireFields: e.target.checked }
                          }))
                        }
                        className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                      />
                      <div>
                        <label className="text-sm font-bold text-dark cursor-pointer">Require All Fields</label>
                        <p className="text-xs text-text-secondary">Mark missing fields as errors</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200">
                      <input
                        type="checkbox"
                        checked={formData.validation.trimWhitespace}
                        onChange={(e) =>
                          setFormData(prev => ({
                            ...prev,
                            validation: { ...prev.validation, trimWhitespace: e.target.checked }
                          }))
                        }
                        className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                      />
                      <div>
                        <label className="text-sm font-bold text-dark cursor-pointer">Trim Whitespace</label>
                        <p className="text-xs text-text-secondary">Remove leading/trailing spaces</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200">
                      <input
                        type="checkbox"
                        checked={formData.validation.autoCapitalize}
                        onChange={(e) =>
                          setFormData(prev => ({
                            ...prev,
                            validation: { ...prev.validation, autoCapitalize: e.target.checked }
                          }))
                        }
                        className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                      />
                      <div>
                        <label className="text-sm font-bold text-dark cursor-pointer">Auto-capitalize</label>
                        <p className="text-xs text-text-secondary">Capitalize first letter of text fields</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Preview Section */}
              <div className="mb-6 border rounded-xl overflow-hidden bg-gray-50/50">
                <button
                  onClick={() => toggleSection('preview')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded flex items-center justify-center text-white text-xs font-bold">
                      4
                    </div>
                    <span className="font-bold text-dark">Template Preview</span>
                  </div>
                  {expandedSections.preview ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {expandedSections.preview && (
                  <div className="p-4 space-y-4 border-t border-gray-200">
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                      <p className="text-xs font-bold text-gray-600 mb-3">PREVIEW LAYOUT</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setFormData(prev => ({
                              ...prev,
                              preview: { layout: 'single' }
                            }))
                          }
                          className={`flex-1 py-2 rounded text-xs font-bold transition-colors ${
                            formData.preview.layout === 'single'
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Single Column
                        </button>
                        <button
                          onClick={() =>
                            setFormData(prev => ({
                              ...prev,
                              preview: { layout: 'multi' }
                            }))
                          }
                          className={`flex-1 py-2 rounded text-xs font-bold transition-colors ${
                            formData.preview.layout === 'multi'
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Multi Column
                        </button>
                      </div>

                      {/* Sample Preview */}
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs font-bold text-gray-600 mb-3">SAMPLE EXTRACTION</p>
                        <div className={formData.preview.layout === 'multi' ? 'grid grid-cols-2 gap-3' : 'space-y-3'}>
                          {formData.fields.slice(0, 3).map(field => (
                            <div key={field.id} className="p-2 bg-white rounded border border-gray-200">
                              <p className="text-xs font-bold text-gray-600">{field.name || 'Field'}</p>
                              <p className="text-sm text-gray-500 mt-1">
                                {field.type === 'currency' && '$' || field.type === 'number' && '#' || field.type === 'date' && '📅'}
                                {field.type === 'select' && '▼'}
                                {field.type === 'boolean' && '☑'}
                                {field.type === 'text' && 'Text...'}
                              </p>
                            </div>
                          ))}
                        </div>
                        {formData.fields.length === 0 && (
                          <p className="text-xs text-gray-500 italic">Add fields to see preview</p>
                        )}
                      </div>
                    </div>

                    {/* Export/Share */}
                    <div className="flex gap-2">
                      <button
                        onClick={handleExportJSON}
                        disabled={!formData.basicInfo.name}
                        className="flex-1 py-2 px-3 bg-blue-500 text-white rounded-lg text-xs font-bold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <Download size={16} />
                        Export JSON
                      </button>
                      <button className="flex-1 py-2 px-3 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                        <Share2 size={16} />
                        Share
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 py-3 px-4 border-2 border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTemplate}
                  disabled={!formData.basicInfo.name}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Template
                </button>
              </div>
            </div>
          )}
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
      `}</style>
    </>
  );
}
