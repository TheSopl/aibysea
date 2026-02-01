'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  Save,
  Play,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Zap,
  BookOpen,
  Settings,
  Bot,
  Send,
  X,
  FileText,
  Link,
  Type,
  User,
  RefreshCw,
  Workflow,
  MessageCircle,
  Phone,
  Tags
} from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useTranslations } from 'next-intl';

// Types for the enhanced form
interface Instruction {
  id: string;
  text: string;
  order: number;
}

interface ActionConfig {
  closeConversations: boolean;
  assignToAgent: boolean;
  updateLifecycle: boolean;
  triggerWorkflows: boolean;
  addComments: boolean;
  handleCalls: boolean;
}

interface KnowledgeSource {
  id: string;
  name: string;
  type: 'file' | 'url' | 'text';
  content?: string;
  url?: string;
  fileSize?: number;
  addedAt: string;
}

interface AgentFormData {
  name: string;
  status: 'active' | 'inactive';
  model: string;
  system_prompt: string;
  greeting_message: string;
  instructions: Instruction[];
  actions: ActionConfig;
  knowledgeSources: KnowledgeSource[];
}

interface TestMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const defaultActions: ActionConfig = {
  closeConversations: false,
  assignToAgent: false,
  updateLifecycle: false,
  triggerWorkflows: false,
  addComments: false,
  handleCalls: false,
};

const defaultFormData: AgentFormData = {
  name: '',
  status: 'active',
  model: 'gpt-4',
  system_prompt: '',
  greeting_message: '',
  instructions: [],
  actions: defaultActions,
  knowledgeSources: [],
};

// Collapsible section component
function CollapsibleSection({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
  badge,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: string | number;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon size={18} className="text-primary" />
          <span className="font-bold text-dark dark:text-white">{title}</span>
          {badge !== undefined && (
            <span className="px-2 py-0.5 text-xs font-bold bg-primary/10 text-primary rounded-full">
              {badge}
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp size={18} className="text-text-secondary" />
        ) : (
          <ChevronDown size={18} className="text-text-secondary" />
        )}
      </button>
      {isOpen && <div className="px-4 pb-4 border-t border-gray-100 dark:border-slate-700">{children}</div>}
    </div>
  );
}

// Action toggle card component
function ActionCard({
  title,
  description,
  icon: Icon,
  enabled,
  onChange,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}) {
  return (
    <div
      onClick={() => onChange(!enabled)}
      className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
        enabled
          ? 'bg-primary/5 border-primary/30 dark:bg-primary/10'
          : 'bg-gray-50 dark:bg-slate-700/50 border-transparent hover:border-gray-200 dark:hover:border-slate-600'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            enabled ? 'bg-primary/20' : 'bg-gray-200 dark:bg-slate-600'
          }`}>
            <Icon size={20} className={enabled ? 'text-primary' : 'text-gray-500 dark:text-slate-400'} />
          </div>
          <div>
            <h4 className="font-bold text-dark dark:text-white">{title}</h4>
            <p className="text-xs text-text-secondary dark:text-slate-400 mt-0.5">{description}</p>
          </div>
        </div>
        <div className={`w-11 h-6 rounded-full flex items-center px-1 transition-colors ${
          enabled ? 'bg-primary' : 'bg-gray-300 dark:bg-slate-600'
        }`}>
          <div className={`w-4 h-4 rounded-full transition-all duration-200 ${
            enabled ? 'translate-x-5 bg-white' : 'translate-x-0 bg-white'
          }`} />
        </div>
      </div>
    </div>
  );
}

export default function AgentEditPage() {
  const t = useTranslations('AgentEdit');
  usePageTitle(t('title'));
  const params = useParams();
  const router = useRouter();
  const agentId = params.id as string;
  const isNewAgent = agentId === 'new';

  const [formData, setFormData] = useState<AgentFormData>(defaultFormData);
  const [loading, setLoading] = useState(!isNewAgent);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Test chat state
  const [testMessages, setTestMessages] = useState<TestMessage[]>([]);
  const [testInput, setTestInput] = useState('');
  const [testLoading, setTestLoading] = useState(false);

  // Fetch agent data if editing
  useEffect(() => {
    if (isNewAgent) return;

    const fetchAgent = async () => {
      try {
        const response = await fetch(`/api/ai-agents/${agentId}`);
        if (!response.ok) throw new Error('Failed to fetch agent');
        const agent = await response.json();

        // Transform DB format to form format
        setFormData({
          name: agent.name || '',
          status: agent.status || 'active',
          model: agent.model || 'gpt-4',
          system_prompt: agent.system_prompt || '',
          greeting_message: agent.greeting_message || '',
          instructions: (agent.triggers || []).map((t: string, i: number) => ({
            id: crypto.randomUUID(),
            text: t,
            order: i,
          })),
          actions: agent.behaviors?.actions || defaultActions,
          knowledgeSources: agent.behaviors?.knowledgeSources || [],
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load agent');
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
  }, [agentId, isNewAgent]);

  // Handle save
  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError('Agent name is required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = {
        name: formData.name,
        status: formData.status,
        model: formData.model,
        system_prompt: formData.system_prompt,
        greeting_message: formData.greeting_message,
        triggers: formData.instructions.map((i) => i.text),
        behaviors: {
          actions: formData.actions,
          knowledgeSources: formData.knowledgeSources,
        },
      };

      const url = isNewAgent ? '/api/ai-agents' : `/api/ai-agents/${agentId}`;
      const method = isNewAgent ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save agent');
      }

      router.push('/agents');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save agent');
    } finally {
      setSaving(false);
    }
  };

  // Handle instruction add
  const addInstruction = () => {
    setFormData((prev) => ({
      ...prev,
      instructions: [
        ...prev.instructions,
        { id: crypto.randomUUID(), text: '', order: prev.instructions.length },
      ],
    }));
  };

  // Handle instruction update
  const updateInstruction = (id: string, text: string) => {
    setFormData((prev) => ({
      ...prev,
      instructions: prev.instructions.map((i) => (i.id === id ? { ...i, text } : i)),
    }));
  };

  // Handle instruction delete
  const deleteInstruction = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      instructions: prev.instructions.filter((i) => i.id !== id),
    }));
  };

  // Handle instruction reorder
  const moveInstruction = (id: string, direction: 'up' | 'down') => {
    setFormData((prev) => {
      const index = prev.instructions.findIndex((i) => i.id === id);
      if (index === -1) return prev;
      if (direction === 'up' && index === 0) return prev;
      if (direction === 'down' && index === prev.instructions.length - 1) return prev;

      const newInstructions = [...prev.instructions];
      const swapIndex = direction === 'up' ? index - 1 : index + 1;
      [newInstructions[index], newInstructions[swapIndex]] = [newInstructions[swapIndex], newInstructions[index]];
      return { ...prev, instructions: newInstructions };
    });
  };

  // Handle action toggle
  const toggleAction = (key: keyof ActionConfig) => {
    setFormData((prev) => ({
      ...prev,
      actions: { ...prev.actions, [key]: !prev.actions[key] },
    }));
  };

  // Handle knowledge source add
  const addKnowledgeSource = (type: 'file' | 'url' | 'text') => {
    const newSource: KnowledgeSource = {
      id: crypto.randomUUID(),
      name: type === 'file' ? 'New File' : type === 'url' ? 'New URL' : 'New Text',
      type,
      addedAt: new Date().toISOString(),
    };
    setFormData((prev) => ({
      ...prev,
      knowledgeSources: [...prev.knowledgeSources, newSource],
    }));
  };

  // Handle knowledge source delete
  const deleteKnowledgeSource = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      knowledgeSources: prev.knowledgeSources.filter((k) => k.id !== id),
    }));
  };

  // Handle test chat
  const handleTestChat = async () => {
    if (!testInput.trim()) return;

    const userMessage: TestMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: testInput,
    };

    setTestMessages((prev) => [...prev, userMessage]);
    setTestInput('');
    setTestLoading(true);

    // Simulate AI response (in production, this would call your AI endpoint)
    setTimeout(() => {
      const aiResponse: TestMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: formData.greeting_message || `This is a test response from ${formData.name || 'your agent'}. In production, this would be generated by the AI model (${formData.model}).`,
      };
      setTestMessages((prev) => [...prev, aiResponse]);
      setTestLoading(false);
    }, 1000);
  };

  // Start test chat
  const startTestChat = () => {
    setTestMessages([]);
    if (formData.greeting_message) {
      setTestMessages([
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: formData.greeting_message,
        },
      ]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-light-bg dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-light-bg dark:bg-slate-900">
      {/* Header */}
      <div className="flex-shrink-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/agents')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-text-secondary" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                <Bot size={22} className="text-primary" />
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Agent Name"
                className="text-xl font-bold bg-transparent border-none outline-none text-dark dark:text-white placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Status Toggle */}
            <button
              onClick={() => setFormData((prev) => ({ ...prev, status: prev.status === 'active' ? 'inactive' : 'active' }))}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                formData.status === 'active'
                  ? 'bg-green/20 text-green border-2 border-green/30'
                  : 'bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-slate-400 border-2 border-transparent'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${formData.status === 'active' ? 'bg-green animate-pulse' : 'bg-gray-400'}`} />
              {formData.status === 'active' ? 'Active' : 'Inactive'}
            </button>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {saving ? 'Saving...' : 'Save Agent'}
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Error Banner */}
        {error && (
          <div className="max-w-7xl mx-auto px-6 mt-4">
            <div className="bg-red/10 border border-red/20 rounded-xl p-4 flex items-center justify-between">
              <span className="text-red font-medium">{error}</span>
              <button onClick={() => setError(null)} className="text-red hover:text-red/80">
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Configuration */}
          <div className="lg:col-span-2 space-y-4">
            {/* Instructions Section */}
            <CollapsibleSection
              title="Instructions"
              icon={MessageSquare}
              badge={formData.instructions.length}
            >
              <div className="pt-4 space-y-3">
                <p className="text-sm text-text-secondary dark:text-slate-400 mb-4">
                  Define step-by-step instructions for your AI agent to follow during conversations.
                </p>
                {formData.instructions.map((instruction, index) => (
                  <div
                    key={instruction.id}
                    className="flex items-start gap-3 bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg group"
                  >
                    <div className="flex items-center gap-2 pt-2">
                      <GripVertical size={16} className="text-gray-400 cursor-grab" />
                      <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                    </div>
                    <textarea
                      value={instruction.text}
                      onChange={(e) => updateInstruction(instruction.id, e.target.value)}
                      placeholder="Enter instruction..."
                      rows={2}
                      className="flex-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => moveInstruction(instruction.id, 'up')}
                        disabled={index === 0}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-slate-600 rounded disabled:opacity-30"
                      >
                        <ChevronUp size={14} />
                      </button>
                      <button
                        onClick={() => moveInstruction(instruction.id, 'down')}
                        disabled={index === formData.instructions.length - 1}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-slate-600 rounded disabled:opacity-30"
                      >
                        <ChevronDown size={14} />
                      </button>
                      <button
                        onClick={() => deleteInstruction(instruction.id)}
                        className="p-1 hover:bg-red/10 text-red rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addInstruction}
                  className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg text-text-secondary hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Add Instruction
                </button>
              </div>
            </CollapsibleSection>

            {/* Actions Section */}
            <CollapsibleSection title="Actions" icon={Zap}>
              <div className="pt-4 space-y-3">
                <p className="text-sm text-text-secondary dark:text-slate-400 mb-4">
                  Enable capabilities that your AI agent can perform during conversations.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <ActionCard
                    title="Close Conversations"
                    description="Automatically close resolved conversations"
                    icon={X}
                    enabled={formData.actions.closeConversations}
                    onChange={() => toggleAction('closeConversations')}
                  />
                  <ActionCard
                    title="Assign to Agent"
                    description="Transfer to human agent when needed"
                    icon={User}
                    enabled={formData.actions.assignToAgent}
                    onChange={() => toggleAction('assignToAgent')}
                  />
                  <ActionCard
                    title="Update Lifecycle"
                    description="Change customer lifecycle stages"
                    icon={Tags}
                    enabled={formData.actions.updateLifecycle}
                    onChange={() => toggleAction('updateLifecycle')}
                  />
                  <ActionCard
                    title="Trigger Workflows"
                    description="Start automated workflow sequences"
                    icon={Workflow}
                    enabled={formData.actions.triggerWorkflows}
                    onChange={() => toggleAction('triggerWorkflows')}
                  />
                  <ActionCard
                    title="Add Comments"
                    description="Leave internal notes on conversations"
                    icon={MessageCircle}
                    enabled={formData.actions.addComments}
                    onChange={() => toggleAction('addComments')}
                  />
                  <ActionCard
                    title="Handle Calls"
                    description="Manage voice call interactions"
                    icon={Phone}
                    enabled={formData.actions.handleCalls}
                    onChange={() => toggleAction('handleCalls')}
                  />
                </div>
              </div>
            </CollapsibleSection>

            {/* Knowledge Sources Section */}
            <CollapsibleSection
              title="Knowledge Sources"
              icon={BookOpen}
              badge={formData.knowledgeSources.length}
            >
              <div className="pt-4 space-y-3">
                <p className="text-sm text-text-secondary dark:text-slate-400 mb-4">
                  Add documents, URLs, or text that your agent can reference during conversations.
                </p>
                {formData.knowledgeSources.map((source) => (
                  <div
                    key={source.id}
                    className="flex items-center gap-3 bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg group"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      source.type === 'file' ? 'bg-blue/20' : source.type === 'url' ? 'bg-green/20' : 'bg-purple/20'
                    }`}>
                      {source.type === 'file' ? (
                        <FileText size={20} className="text-blue" />
                      ) : source.type === 'url' ? (
                        <Link size={20} className="text-green" />
                      ) : (
                        <Type size={20} className="text-purple" />
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={source.name}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            knowledgeSources: prev.knowledgeSources.map((k) =>
                              k.id === source.id ? { ...k, name: e.target.value } : k
                            ),
                          }));
                        }}
                        className="font-medium bg-transparent border-none outline-none text-dark dark:text-white"
                      />
                      <p className="text-xs text-text-secondary dark:text-slate-400">
                        {source.type.charAt(0).toUpperCase() + source.type.slice(1)} • Added {new Date(source.addedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteKnowledgeSource(source.id)}
                      className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red/10 text-red rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <button
                    onClick={() => addKnowledgeSource('file')}
                    className="flex-1 py-3 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg text-text-secondary hover:border-blue hover:text-blue transition-colors flex items-center justify-center gap-2"
                  >
                    <FileText size={16} />
                    Add File
                  </button>
                  <button
                    onClick={() => addKnowledgeSource('url')}
                    className="flex-1 py-3 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg text-text-secondary hover:border-green hover:text-green transition-colors flex items-center justify-center gap-2"
                  >
                    <Link size={16} />
                    Add URL
                  </button>
                  <button
                    onClick={() => addKnowledgeSource('text')}
                    className="flex-1 py-3 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg text-text-secondary hover:border-purple hover:text-purple transition-colors flex items-center justify-center gap-2"
                  >
                    <Type size={16} />
                    Add Text
                  </button>
                </div>
              </div>
            </CollapsibleSection>

            {/* Model Settings Section */}
            <CollapsibleSection title="Model Settings" icon={Settings} defaultOpen={false}>
              <div className="pt-4 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-dark dark:text-white mb-2">AI Model</label>
                  <select
                    value={formData.model}
                    onChange={(e) => setFormData((prev) => ({ ...prev, model: e.target.value }))}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  >
                    <option value="gpt-4">GPT-4 (Most capable)</option>
                    <option value="gpt-4-turbo">GPT-4 Turbo (Faster)</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Cost-effective)</option>
                    <option value="claude-3-opus">Claude 3 Opus</option>
                    <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-dark dark:text-white mb-2">System Prompt</label>
                  <textarea
                    value={formData.system_prompt}
                    onChange={(e) => setFormData((prev) => ({ ...prev, system_prompt: e.target.value }))}
                    placeholder="Define your agent's personality, role, and behavioral guidelines..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-dark dark:text-white mb-2">Greeting Message</label>
                  <textarea
                    value={formData.greeting_message}
                    onChange={(e) => setFormData((prev) => ({ ...prev, greeting_message: e.target.value }))}
                    placeholder="The first message your agent sends to start a conversation..."
                    rows={2}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
              </div>
            </CollapsibleSection>
          </div>

          {/* Right Column - Test Chat */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare size={18} className="text-primary" />
                  <span className="font-bold text-dark dark:text-white">Test Chat</span>
                </div>
                <button
                  onClick={startTestChat}
                  className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-bold hover:bg-primary/20 transition-colors flex items-center gap-1"
                >
                  <Play size={14} />
                  Start
                </button>
              </div>

              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-slate-900/50">
                {testMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <Bot size={48} className="text-gray-300 dark:text-slate-600 mb-3" />
                    <p className="text-sm text-text-secondary dark:text-slate-400">
                      Click &quot;Start&quot; to test your agent
                    </p>
                  </div>
                ) : (
                  testMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                          msg.role === 'user'
                            ? 'bg-primary text-white rounded-br-md'
                            : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    </div>
                  ))
                )}
                {testLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-4 py-2 rounded-2xl rounded-bl-md">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-gray-200 dark:border-slate-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleTestChat()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-slate-700 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                  <button
                    onClick={handleTestChat}
                    disabled={!testInput.trim() || testLoading}
                    className="p-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
