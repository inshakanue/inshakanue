import { useEffect, useState } from 'react';
import { monitorWebVitals, logPerformanceMetrics, PerformanceMetrics } from '@/utils/performanceMonitoring';

/**
 * Hook to monitor Core Web Vitals
 */
export const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});

  useEffect(() => {
    monitorWebVitals((newMetrics) => {
      setMetrics(newMetrics);
      logPerformanceMetrics(newMetrics);
    });
  }, []);

  return metrics;
};
