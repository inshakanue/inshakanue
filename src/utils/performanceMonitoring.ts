// Performance monitoring utilities for Core Web Vitals

export interface PerformanceMetrics {
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  FCP?: number; // First Contentful Paint
  TTFB?: number; // Time to First Byte
}

/**
 * Monitor Core Web Vitals
 */
export const monitorWebVitals = (callback: (metrics: PerformanceMetrics) => void) => {
  const metrics: PerformanceMetrics = {};

  // Observe LCP
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        metrics.LCP = lastEntry.renderTime || lastEntry.loadTime;
        callback(metrics);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Observe FID
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          metrics.FID = entry.processingStart - entry.startTime;
          callback(metrics);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Observe CLS
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            metrics.CLS = clsValue;
            callback(metrics);
          }
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('Performance Observer not fully supported:', e);
    }
  }

  // Get FCP and TTFB from Navigation Timing
  if ('performance' in window && 'getEntriesByType' in performance) {
    const navEntry = performance.getEntriesByType('navigation')[0] as any;
    if (navEntry) {
      metrics.TTFB = navEntry.responseStart - navEntry.requestStart;
    }

    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    if (fcpEntry) {
      metrics.FCP = fcpEntry.startTime;
    }
  }

  return metrics;
};

/**
 * Calculate performance score (0-100)
 */
export const calculatePerformanceScore = (metrics: PerformanceMetrics): number => {
  let score = 100;

  // LCP scoring (< 2.5s is good)
  if (metrics.LCP) {
    if (metrics.LCP > 4000) score -= 30;
    else if (metrics.LCP > 2500) score -= 15;
  }

  // FID scoring (< 100ms is good)
  if (metrics.FID) {
    if (metrics.FID > 300) score -= 25;
    else if (metrics.FID > 100) score -= 10;
  }

  // CLS scoring (< 0.1 is good)
  if (metrics.CLS) {
    if (metrics.CLS > 0.25) score -= 25;
    else if (metrics.CLS > 0.1) score -= 10;
  }

  // FCP scoring (< 1.8s is good)
  if (metrics.FCP) {
    if (metrics.FCP > 3000) score -= 15;
    else if (metrics.FCP > 1800) score -= 7;
  }

  return Math.max(0, score);
};

/**
 * Log performance metrics to console in development
 */
export const logPerformanceMetrics = (metrics: PerformanceMetrics) => {
  if (import.meta.env.DEV) {
    console.group('🚀 Performance Metrics');
    console.log('LCP (Largest Contentful Paint):', metrics.LCP ? `${metrics.LCP.toFixed(2)}ms` : 'N/A');
    console.log('FID (First Input Delay):', metrics.FID ? `${metrics.FID.toFixed(2)}ms` : 'N/A');
    console.log('CLS (Cumulative Layout Shift):', metrics.CLS ? metrics.CLS.toFixed(3) : 'N/A');
    console.log('FCP (First Contentful Paint):', metrics.FCP ? `${metrics.FCP.toFixed(2)}ms` : 'N/A');
    console.log('TTFB (Time to First Byte):', metrics.TTFB ? `${metrics.TTFB.toFixed(2)}ms` : 'N/A');
    console.log('Performance Score:', calculatePerformanceScore(metrics));
    console.groupEnd();
  }
};
