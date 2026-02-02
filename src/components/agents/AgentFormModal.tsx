'use client';

import { useState, useEffect } from 'react';
import { X, Bot, Loader2 } from 'lucide-react';
import { AIAgent, NewAIAgent } from '@/types/database';

interface AgentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (agent: AIAgent) => void;
  agent?: AIAgent | null; // null for create, AIAgent for edit
}

const MODEL_OPTIONS = [
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
  { value: 'gpt-4', label: 'GPT-4' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
  { value: 'claude-3-opus', label: 'Claude 3 Opus' },
  { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet' },
];

export default function AgentFormModal({ isOpen, onClose, onSave, agent }: AgentFormModalProps) {
  const [name, setName] = useState('');
  const [model, setModel] = useState('gpt-4-turbo');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [greetingMessage, setGreetingMessage] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ name?: string }>({});

  const isEditing = !!agent;

  // Reset form when modal opens/closes or agent changes
  useEffect(() => {
    if (isOpen) {
      if (agent) {
        setName(agent.name);
        setModel(agent.model);
        setSystemPrompt(agent.system_prompt || '');
        setGreetingMessage(agent.greeting_message || '');
        setStatus(agent.status as 'active' | 'inactive');
      } else {
        setName('');
        setModel('gpt-4-turbo');
        setSystemPrompt('');
        setGreetingMessage('');
        setStatus('active');
      }
      setError(null);
      setValidationErrors({});
    }
  }, [isOpen, agent]);

  const validate = (): boolean => {
    const errors: { name?: string } = {};
    if (!name.trim()) {
      errors.name = 'Name is required';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError(null);

    try {
      const agentData: NewAIAgent = {
        name: name.trim(),
        model,
        system_prompt: systemPrompt.trim() || null,
        greeting_message: greetingMessage.trim() || null,
        status,
      };

      const url = isEditing ? `/api/ai-agents/${agent!.id}` : '/api/ai-agents';
      const method = isEditing ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agentData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save agent');
      }

      const savedAgent = await response.json();
      onSave(savedAgent);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save agent');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
              <Bot size={20} className="text-primary" />
            </div>
            <h2 className="text-heading-3 font-extrabold text-dark dark:text-white">
              {isEditing ? 'Edit Agent' : 'Create Agent'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={20} className="text-text-secondary" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red/10 border border-red/20 rounded-xl p-4 text-sm text-red">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-dark dark:text-white mb-2">
              Name <span className="text-red">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter agent name"
              className={`w-full px-4 py-3 bg-light-bg dark:bg-slate-700 border-2 ${
                validationErrors.name
                  ? 'border-red/50 focus:border-red'
                  : 'border-transparent focus:border-primary'
              } rounded-xl text-dark dark:text-white placeholder-text-secondary focus:outline-none transition-colors`}
            />
            {validationErrors.name && (
              <p className="mt-1 text-sm text-red">{validationErrors.name}</p>
            )}
          </div>

          {/* Model */}
          <div>
            <label className="block text-sm font-bold text-dark dark:text-white mb-2">
              Model
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-4 py-3 bg-light-bg dark:bg-slate-700 border-2 border-transparent focus:border-primary rounded-xl text-dark dark:text-white focus:outline-none transition-colors appearance-none cursor-pointer"
            >
              {MODEL_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* System Prompt */}
          <div>
            <label className="block text-sm font-bold text-dark dark:text-white mb-2">
              System Prompt
            </label>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Enter the system prompt that defines the agent's behavior..."
              rows={4}
              className="w-full px-4 py-3 bg-light-bg dark:bg-slate-700 border-2 border-transparent focus:border-primary rounded-xl text-dark dark:text-white placeholder-text-secondary focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Greeting Message */}
          <div>
            <label className="block text-sm font-bold text-dark dark:text-white mb-2">
              Greeting Message
            </label>
            <textarea
              value={greetingMessage}
              onChange={(e) => setGreetingMessage(e.target.value)}
              placeholder="Enter the first message the agent sends..."
              rows={2}
              className="w-full px-4 py-3 bg-light-bg dark:bg-slate-700 border-2 border-transparent focus:border-primary rounded-xl text-dark dark:text-white placeholder-text-secondary focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Status Toggle */}
          <div>
            <label className="block text-sm font-bold text-dark dark:text-white mb-2">
              Status
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setStatus('active')}
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                  status === 'active'
                    ? 'bg-green/20 text-green border-2 border-green/30'
                    : 'bg-light-bg dark:bg-slate-700 text-text-secondary border-2 border-transparent hover:border-gray-200 dark:hover:border-slate-600'
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setStatus('inactive')}
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                  status === 'inactive'
                    ? 'bg-gray-200 dark:bg-slate-600 text-dark dark:text-white border-2 border-gray-300 dark:border-slate-500'
                    : 'bg-light-bg dark:bg-slate-700 text-text-secondary border-2 border-transparent hover:border-gray-200 dark:hover:border-slate-600'
                }`}
              >
                Inactive
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-light-bg dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-dark dark:text-white rounded-xl font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                isEditing ? 'Save Changes' : 'Create Agent'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
