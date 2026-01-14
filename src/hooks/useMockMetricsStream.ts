import { useEffect } from 'react';
import { useMetricsStore } from '@/stores/metricsStore';

/**
 * Mock metrics stream for local testing (NEXT_PUBLIC_MOCK_METRICS=true)
 *
 * Generates realistic metrics updates every 2-3 seconds to simulate n8n webhooks.
 * Useful for testing dashboard behavior without needing full n8n setup.
 */
export function useMockMetricsStream() {
  const updateMetrics = useMetricsStore((state) => state.updateMetrics);
  const addMetricPoint = useMetricsStore((state) => state.addMetricPoint);
  const setConnectionStatus = useMetricsStore((state) => state.setConnectionStatus);
  const setAIState = useMetricsStore((state) => state.setAIState);

  useEffect(() => {
    // Only run in mock mode
    if (process.env.NEXT_PUBLIC_MOCK_METRICS !== 'true') {
      return;
    }

    // Set connection as "connected" for mock mode
    setConnectionStatus('connected');

    // Mock AI states cycle
    const aiStates: Array<'idle' | 'thinking' | 'responding' | 'waiting'> = [
      'idle',
      'thinking',
      'responding',
      'idle',
      'waiting',
    ];
    let aiStateIndex = 0;

    // Generate mock metrics every 2-3 seconds
    const interval = setInterval(() => {
      // Randomize values to simulate real metrics
      const latency = Math.round(150 + Math.random() * 200); // 150-350ms
      const confidence = 0.7 + Math.random() * 0.25; // 70-95%
      const quality = 85 + Math.random() * 13; // 85-98%
      const sentiment = Math.random() * 2 - 1; // -1 to 1 (negative to positive)
      const riskScore = Math.random() < 0.8 ? Math.random() * 30 : Math.random() * 100; // Mostly low risk
      const healthScore = 85 + Math.random() * 13; // 85-98
      const activeConversations = Math.floor(3 + Math.random() * 7); // 3-10 conversations

      // Update current metrics (batched)
      updateMetrics({
        latency,
        confidence,
        quality,
        sentiment,
        riskScore,
        healthScore,
        activeConversations,
      });

      // Add to historical metrics
      addMetricPoint({
        timestamp: Date.now(),
        latency,
        confidence,
        quality,
        sentiment,
      });

      // Cycle AI state
      setAIState(aiStates[aiStateIndex]);
      aiStateIndex = (aiStateIndex + 1) % aiStates.length;
    }, 2000 + Math.random() * 1000); // 2-3 seconds

    // Cleanup on unmount
    return () => {
      clearInterval(interval);
      setConnectionStatus('disconnected');
    };
  }, [updateMetrics, addMetricPoint, setConnectionStatus, setAIState]);
}
