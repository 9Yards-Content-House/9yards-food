import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { globalMetadata } from '@/data/seo';
import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals';

// Report Web Vitals to console in development, or to analytics in production
const reportWebVitals = (metric: { name: string; value: number; id: string; rating: string }) => {
  // Log to console in development
  if (import.meta.env.DEV) {
    console.log(`[Web Vitals] ${metric.name}: ${metric.value.toFixed(2)} (${metric.rating})`);
  }
  
  // Send to Google Analytics if available
  if (typeof window !== 'undefined' && 'gtag' in window) {
    const gtag = (window as any).gtag;
    gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }
};

export const Analytics = () => {
  const gaId = globalMetadata.marketing.googleAnalyticsId;

  // Initialize Web Vitals monitoring
  useEffect(() => {
    // Core Web Vitals
    onCLS(reportWebVitals);   // Cumulative Layout Shift
    onINP(reportWebVitals);   // Interaction to Next Paint (replaces FID)
    onLCP(reportWebVitals);   // Largest Contentful Paint
    
    // Additional performance metrics
    onFCP(reportWebVitals);   // First Contentful Paint
    onTTFB(reportWebVitals);  // Time to First Byte
  }, []);

  // Don't render GA scripts if ID is placeholder or missing
  if (!gaId || gaId === "G-MEASUREMENT_ID") {
    return null;
  }

  return (
    <Helmet>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}></script>
      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${gaId}');
        `}
      </script>
    </Helmet>
  );
};
