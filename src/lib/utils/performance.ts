type MetricName = 
  | 'FCP'  // First Contentful Paint
  | 'LCP'  // Largest Contentful Paint
  | 'FID'  // First Input Delay
  | 'CLS'  // Cumulative Layout Shift
  | 'TTFB' // Time to First Byte
  | 'INP'  // Interaction to Next Paint

interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

class PerformanceMonitor {
  private metrics: Map<MetricName, number[]> = new Map();
  private readonly maxSamples = 100;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initWebVitals();
    }
  }

  private initWebVitals() {
    this.initializeObservers();
  }

  private initializeObservers() {
    // First Contentful Paint
    const paintObserver = new PerformanceObserver((entries) => {
      entries.getEntries().forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          this.recordMetric('FCP', entry.startTime);
        }
      });
    });
    paintObserver.observe({ entryTypes: ['paint'] });

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((entries) => {
      entries.getEntries().forEach((entry) => {
        this.recordMetric('LCP', entry.startTime);
      });
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    const fidObserver = new PerformanceObserver((entries) => {
      entries.getEntries().forEach((entry) => {
        const eventTiming = entry as PerformanceEventTiming;
        if (eventTiming.processingStart) {
          this.recordMetric('FID', eventTiming.processingStart - entry.startTime);
        }
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    const clsObserver = new PerformanceObserver((entries) => {
      entries.getEntries().forEach((entry) => {
        const layoutShift = entry as LayoutShift;
        if (typeof layoutShift.value === 'number') {
          this.recordMetric('CLS', layoutShift.value);
        }
      });
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });

    // Navigation Timing
    const navigationObserver = new PerformanceObserver((entries) => {
      entries.getEntries().forEach((entry) => {
        const navTiming = entry as PerformanceNavigationTiming;
        this.recordMetric('TTFB', navTiming.responseStart - navTiming.requestStart);
        this.recordMetric('FCP', navTiming.domContentLoadedEventEnd - navTiming.fetchStart);
      });
    });
    navigationObserver.observe({ entryTypes: ['navigation'] });

    // Interaction to Next Paint
    const inpObserver = new PerformanceObserver((entries) => {
      entries.getEntries().forEach((entry: PerformanceEntry) => {
        if (typeof entry.duration === 'number') {
          this.recordMetric('INP', entry.duration);
        }
      });
    });
    inpObserver.observe({ entryTypes: ['event'] });
  }

  private recordMetric(name: MetricName, value: number) {
    const metrics = this.metrics.get(name) || [];
    metrics.push(value);
    
    // Keep only the last maxSamples samples
    if (metrics.length > this.maxSamples) {
      metrics.shift();
    }
    
    this.metrics.set(name, metrics);
    this.reportMetrics(name, value);
  }

  private reportMetrics(name: MetricName, value: number) {
    // Send metrics to analytics service
    if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
      fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metric: name,
          value,
          timestamp: Date.now()
        })
      }).catch(console.error);
    }
  }

  public getMetrics(): Record<MetricName, { avg: number; p95: number }> {
    const result = {} as Record<MetricName, { avg: number; p95: number }>;
    
    this.metrics.forEach((values, name) => {
      if (values.length === 0) return;
      
      const sorted = [...values].sort((a, b) => a - b);
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const p95Index = Math.floor(values.length * 0.95);
      const p95 = sorted[p95Index];
      
      result[name] = { avg, p95 };
    });
    
    return result;
  }
}

export const performanceMonitor = new PerformanceMonitor();
