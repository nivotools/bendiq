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
    // Don't load if consent not given
    if (!isAnalyticsAllowed) {
      console.log('[Analytics] Consent not given, skipping GA initialization');
      return;
    }

    // Validate measurement ID exists
    if (!GA_MEASUREMENT_ID) {
      console.error('[Analytics] Missing GA Measurement ID - check VITE_GA_MEASUREMENT_ID env variable');
      return;
    }

    // Check if already loaded
    if (window.gtag && document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`)) {
      console.log('[Analytics] GA already initialized');
      return;
    }

    console.log('[Analytics] Initializing GA with ID:', GA_MEASUREMENT_ID.substring(0, 5) + '...');

    // Initialize dataLayer first (this is safe to do before script loads)
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };
    window.gtag('js', new Date());

    // Load Google Analytics script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    
    // Wait for script to load before configuring
    script.onload = () => {
      window.gtag('config', GA_MEASUREMENT_ID, {
        anonymize_ip: true,
        cookie_flags: 'SameSite=None;Secure',
      });
      console.log('[Analytics] Google Analytics initialized successfully');
    };
    
    script.onerror = () => {
      console.error('[Analytics] Failed to load Google Analytics script');
    };
    
    document.head.appendChild(script);

    return () => {
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
