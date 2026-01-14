import { create } from 'zustand';

// Metrics data point structure
export interface MetricsPoint {
  timestamp: number;
  latency: number;
  confidence: number;
  quality: number;
  sentiment: number;
}

// AI state enum
export type AIState = 'idle' | 'thinking' | 'responding' | 'waiting';

// Connection status
export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected';

// Store state interface
interface MetricsState {
  // Current metrics
  latency: number;
  confidence: number;
  quality: number;
  sentiment: number;
  riskScore: number;
  healthScore: number;
  activeConversations: number;
  aiState: AIState;
  connectionStatus: ConnectionStatus;

  // Historical metrics (windowed to last 1000 points)
  metrics: MetricsPoint[];

  // Animation trigger flag (pulses for 300ms when metrics change)
  shouldAnimate: boolean;

  // Actions
  updateMetrics: (data: Partial<Omit<MetricsState, 'metrics' | 'updateMetrics' | 'addMetricPoint' | 'setConnectionStatus' | 'setAIState' | 'shouldAnimate'>>) => void;
  addMetricPoint: (point: MetricsPoint) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  setAIState: (state: AIState) => void;
}

// Batching middleware to prevent re-render storms
let batchTimeout: NodeJS.Timeout | null = null;
let pendingUpdates: Partial<MetricsState> = {};
let animationTimeout: NodeJS.Timeout | null = null;

// Helper to trigger animation flag
const triggerAnimation = (set: (partial: Partial<MetricsState>) => void) => {
  // Clear existing animation timeout
  if (animationTimeout) {
    clearTimeout(animationTimeout);
  }

  // Set animation flag
  set({ shouldAnimate: true });

  // Reset after 300ms
  animationTimeout = setTimeout(() => {
    set({ shouldAnimate: false });
  }, 300);
};

export const useMetricsStore = create<MetricsState>((set) => {
  // Batched update function
  const flushBatch = () => {
    if (Object.keys(pendingUpdates).length > 0) {
      set(pendingUpdates);
      triggerAnimation(set);
      pendingUpdates = {};
    }
  };

  return {
    // Initial state
    latency: 0,
    confidence: 0.5,
    quality: 0,
    sentiment: 0,
    riskScore: 0,
    healthScore: 0,
    activeConversations: 0,
    aiState: 'idle',
    connectionStatus: 'disconnected',
    metrics: [],
    shouldAnimate: false,

    // Batched metrics update (100ms windows)
    updateMetrics: (data) => {
      pendingUpdates = { ...pendingUpdates, ...data };

      if (batchTimeout) {
        clearTimeout(batchTimeout);
      }

      batchTimeout = setTimeout(flushBatch, 100); // Batch every 100ms
    },

    // Add metric point with windowing (keep only last 1000 points)
    addMetricPoint: (point) =>
      set((state) => {
        const updated = [...state.metrics, point];
        // Window: keep only last 1000 points (~100 seconds at 10Hz)
        const windowed = updated.length > 1000 ? updated.slice(-1000) : updated;

        return { metrics: windowed };
      }),

    // Set connection status
    setConnectionStatus: (status) => set({ connectionStatus: status }),

    // Set AI state
    setAIState: (state) => set({ aiState: state }),
  };
});
