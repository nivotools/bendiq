import { useEffect } from 'react';
import { useTrackingAllowed } from './TrackingGuard';

// Google Analytics Measurement ID from environment variable
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || '';

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

/**
 * GoogleAnalytics Component
 * 
 * Loads and initializes Google Analytics only when analytics consent is given.
 * This component should be wrapped in a TrackingGuard or used with useTrackingAllowed.
 */
const GoogleAnalytics: React.FC = () => {
  const isAnalyticsAllowed = useTrackingAllowed('analytics');

  useEffect(() => {
    if (!isAnalyticsAllowed) {
      return;
    }

    // Check if already loaded
    if (window.gtag) {
      return;
    }

    // Load Google Analytics script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      anonymize_ip: true, // GDPR compliance
      cookie_flags: 'SameSite=None;Secure',
    });

    console.log('[Analytics] Google Analytics initialized with consent');

    return () => {
      // Cleanup is not strictly necessary as GA is typically loaded once
      // but we log for debugging purposes
      console.log('[Analytics] Analytics component unmounted');
    };
  }, [isAnalyticsAllowed]);

  return null;
};

export default GoogleAnalytics;

/**
 * Hook to track page views manually
 */
export const usePageView = (path: string, title?: string) => {
  const isAnalyticsAllowed = useTrackingAllowed('analytics');

  useEffect(() => {
    if (isAnalyticsAllowed && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: path,
        page_title: title,
      });
    }
  }, [isAnalyticsAllowed, path, title]);
};

/**
 * Function to track custom events
 */
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, unknown>
) => {
  if (window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};
