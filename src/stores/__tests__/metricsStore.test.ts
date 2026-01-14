import { renderHook, act, waitFor } from '@testing-library/react';
import { useMetricsStore } from '../metricsStore';

describe('metricsStore', () => {
  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => useMetricsStore());
    act(() => {
      result.current.updateMetrics({
        latency: 0,
        confidence: 0.5,
        quality: 0,
        sentiment: 0,
        riskScore: 0,
        healthScore: 0,
        activeConversations: 0,
      });
    });
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useMetricsStore());

    expect(result.current.latency).toBe(0);
    expect(result.current.confidence).toBe(0.5);
    expect(result.current.quality).toBe(0);
    expect(result.current.connectionStatus).toBe('disconnected');
    expect(result.current.aiState).toBe('idle');
    expect(result.current.metrics).toEqual([]);
    expect(result.current.shouldAnimate).toBe(false);
  });

  it('should batch multiple rapid updates into one state change', async () => {
    const { result } = renderHook(() => useMetricsStore());
    const initialRenderCount = result.current.latency;

    // Call updateMetrics 5 times rapidly
    act(() => {
      result.current.updateMetrics({ latency: 100 });
      result.current.updateMetrics({ latency: 150 });
      result.current.updateMetrics({ latency: 200 });
      result.current.updateMetrics({ latency: 250 });
      result.current.updateMetrics({ latency: 300 });
    });

    // Wait for batch timeout (100ms)
    await waitFor(
      () => {
        expect(result.current.latency).toBe(300);
      },
      { timeout: 200 }
    );

    // Only the final value should be applied
    expect(result.current.latency).toBe(300);
  });

  it('should trigger and reset animation flag', async () => {
    const { result } = renderHook(() => useMetricsStore());

    // Initially no animation
    expect(result.current.shouldAnimate).toBe(false);

    // Update metrics
    act(() => {
      result.current.updateMetrics({ latency: 200 });
    });

    // Wait for batch to flush
    await waitFor(
      () => {
        expect(result.current.shouldAnimate).toBe(true);
      },
      { timeout: 200 }
    );

    // Wait for animation to reset (300ms)
    await waitFor(
      () => {
        expect(result.current.shouldAnimate).toBe(false);
      },
      { timeout: 500 }
    );
  });

  it('should window metrics to last 1000 points', () => {
    const { result } = renderHook(() => useMetricsStore());

    // Add 1050 metric points
    act(() => {
      for (let i = 0; i < 1050; i++) {
        result.current.addMetricPoint({
          timestamp: Date.now() + i,
          latency: 100 + i,
          confidence: 0.9,
          quality: 95,
          sentiment: 0.8,
        });
      }
    });

    // Should only keep last 1000
    expect(result.current.metrics.length).toBe(1000);

    // First metric should be from index 50 (windowed from 1050)
    expect(result.current.metrics[0].latency).toBe(150);
  });

  it('should update connection status', () => {
    const { result } = renderHook(() => useMetricsStore());

    act(() => {
      result.current.setConnectionStatus('connecting');
    });

    expect(result.current.connectionStatus).toBe('connecting');

    act(() => {
      result.current.setConnectionStatus('connected');
    });

    expect(result.current.connectionStatus).toBe('connected');
  });

  it('should update AI state', () => {
    const { result } = renderHook(() => useMetricsStore());

    act(() => {
      result.current.setAIState('thinking');
    });

    expect(result.current.aiState).toBe('thinking');

    act(() => {
      result.current.setAIState('responding');
    });

    expect(result.current.aiState).toBe('responding');
  });

  it('should handle concurrent batched updates correctly', async () => {
    const { result } = renderHook(() => useMetricsStore());

    // Update different metrics concurrently
    act(() => {
      result.current.updateMetrics({ latency: 200 });
      result.current.updateMetrics({ confidence: 0.95 });
      result.current.updateMetrics({ quality: 98 });
    });

    // Wait for batch
    await waitFor(
      () => {
        expect(result.current.latency).toBe(200);
      },
      { timeout: 200 }
    );

    // All updates should be applied
    expect(result.current.latency).toBe(200);
    expect(result.current.confidence).toBe(0.95);
    expect(result.current.quality).toBe(98);
  });
});
