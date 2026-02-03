import { useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useMetricsStore } from '@/features/dashboard/store/metricsStore';
import type { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Hook to subscribe to Supabase Broadcast "metrics" channel and update store.
 *
 * Handles:
 * - Subscription to real-time metrics updates
 * - Connection state tracking (connected/connecting/disconnected)
 * - Automatic cleanup on unmount
 * - Error handling with fallback to offline mode
 *
 * Connection states flow to UI via store:
 * - connected → green badge
 * - connecting → yellow badge
 * - disconnected → red badge
 */
export function useMetricsSubscription() {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const updateMetrics = useMetricsStore((state) => state.updateMetrics);
  const setConnectionStatus = useMetricsStore((state) => state.setConnectionStatus);
  const setAIState = useMetricsStore((state) => state.setAIState);
  const addMetricPoint = useMetricsStore((state) => state.addMetricPoint);

  useEffect(() => {
    const supabase = createClient();

    // Set initial status
    setConnectionStatus('connecting');

    // Create Broadcast channel (not Postgres Changes - scales better for high-frequency updates)
    const channel = supabase
      .channel('metrics', {
        config: {
          broadcast: { self: false }, // Don't receive our own broadcasts
        },
      })
      .on('broadcast', { event: 'metrics_update' }, (payload) => {
        try {
          // Update metrics via batching middleware
          const data = payload.payload;

          if (data) {
            // Update current metrics (batched automatically)
            if (data.latency !== undefined ||
                data.confidence !== undefined ||
                data.quality !== undefined ||
                data.sentiment !== undefined ||
                data.riskScore !== undefined ||
                data.healthScore !== undefined ||
                data.activeConversations !== undefined) {
              updateMetrics(data);
            }

            // Update AI state if provided
            if (data.aiState) {
              setAIState(data.aiState);
            }

            // Add to historical metrics if full point provided
            if (data.timestamp && data.latency !== undefined) {
              addMetricPoint({
                timestamp: data.timestamp,
                latency: data.latency,
                confidence: data.confidence ?? 0.5,
                quality: data.quality ?? 0,
                sentiment: data.sentiment ?? 0,
              });
            }
          }
        } catch (error) {
          console.error('Error processing metrics update:', error);
          // Continue processing - don't crash on bad data
        }
      })
      .subscribe((status) => {
        // Update connection status based on subscription state
        if (status === 'SUBSCRIBED') {
          setConnectionStatus('connected');
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
          setConnectionStatus('disconnected');
          console.error('Metrics subscription error:', status);
        }
      });

    channelRef.current = channel;

    // Cleanup on unmount
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      setConnectionStatus('disconnected');
    };
  }, [updateMetrics, setConnectionStatus, setAIState, addMetricPoint]);
}
