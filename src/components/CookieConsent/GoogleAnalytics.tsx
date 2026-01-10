import { useEffect, useState, useCallback } from 'react';
import { useTrackingAllowed } from './TrackingGuard';

// Google Analytics Measurement ID
const GA_MEASUREMENT_ID = 'G-GZ5KPL362N';

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

/**
 * Delete all Google Analytics cookies
 */
const deleteGACookies = () => {
  const cookies = document.cookie.split(';');
  const domains = [window.location.hostname, '.' + window.location.hostname];
  
  cookies.forEach(cookie => {
    const name = cookie.split('=')[0].trim();
    // Match GA cookies: _ga, _ga_*, _gid, _gat, _gat_*
    if (name.startsWith('_ga') || name.startsWith('_gid') || name.startsWith('_gat')) {
      domains.forEach(domain => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      });
      console.log(`[Analytics] Deleted cookie: ${name}`);
    }
  });
};

/**
 * Remove GA script from DOM
 */
const removeGAScript = () => {
  const script = document.querySelector('script[src*="googletagmanager.com/gtag/js"]');
  if (script) {
    script.remove();
    console.log('[Analytics] Removed GA script from DOM');
  }
};

/**
 * Clear gtag globals to prevent any further tracking
 */
const clearGtagGlobals = () => {
  if (window.gtag) {
    // @ts-ignore - intentionally clearing
    window.gtag = undefined;
    window.dataLayer = [];
    console.log('[Analytics] Cleared gtag globals');
  }
};

/**
 * GoogleAnalytics Component
 * 
 * Loads and initializes Google Analytics only when analytics consent is given.
 * Properly cleans up when consent is revoked (GDPR compliant).
 */
const GoogleAnalytics: React.FC = () => {
  const isAnalyticsAllowed = useTrackingAllowed('analytics');

  useEffect(() => {
    // Handle consent WITHDRAWAL - clean up everything
    if (!isAnalyticsAllowed) {
      console.log('[Analytics] Consent not given or revoked, cleaning up...');
      deleteGACookies();
      removeGAScript();
      clearGtagGlobals();
      return;
    }

    // Validate measurement ID exists
    if (!GA_MEASUREMENT_ID) {
      console.error('[Analytics] Missing GA Measurement ID');
      return;
    }

    console.log('[Analytics] Initializing GA with ID:', GA_MEASUREMENT_ID.substring(0, 5) + '...');

    // Always set up dataLayer and gtag function first
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };

    const existingScript = document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`);
    
    if (existingScript) {
      // Script already loaded, just re-configure (handles consent granted after page load)
      console.log('[Analytics] Script exists, re-configuring...');
      window.gtag('js', new Date());
      window.gtag('config', GA_MEASUREMENT_ID, {
        anonymize_ip: true,
        cookie_flags: 'SameSite=None;Secure',
      });
      console.log('[Analytics] Google Analytics re-configured successfully');
      // Dispatch event to notify other components that GA is ready
      window.dispatchEvent(new Event('ga-ready'));
      return;
    }

    // Load Google Analytics script for the first time
    window.gtag('js', new Date());

    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    
    script.onload = () => {
      window.gtag('config', GA_MEASUREMENT_ID, {
        anonymize_ip: true,
        cookie_flags: 'SameSite=None;Secure',
      });
      console.log('[Analytics] Google Analytics initialized successfully');
      // Dispatch event to notify other components that GA is ready
      window.dispatchEvent(new Event('ga-ready'));
    };
    
    script.onerror = () => {
      console.error('[Analytics] Failed to load Google Analytics script');
    };
    
    document.head.appendChild(script);

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
 * Hook to track custom events with consent awareness
 */
export const useTrackEvent = () => {
  const isAnalyticsAllowed = useTrackingAllowed('analytics');
  const [isGAReady, setIsGAReady] = useState(!!window.gtag);

  useEffect(() => {
    const handleGAReady = () => {
      console.log('[Analytics] GA ready event received');
      setIsGAReady(true);
    };
    window.addEventListener('ga-ready', handleGAReady);
    
    // Check if already ready
    if (window.gtag) {
      setIsGAReady(true);
    }
    
    return () => window.removeEventListener('ga-ready', handleGAReady);
  }, []);

  const track = useCallback((eventName: string, eventParams?: Record<string, unknown>) => {
    if (isAnalyticsAllowed && isGAReady && window.gtag) {
      window.gtag('event', eventName, eventParams);
      console.log('[Analytics] Event tracked:', eventName, eventParams);
    } else {
      console.log('[Analytics] Event not tracked - consent:', isAnalyticsAllowed, 'ready:', isGAReady);
    }
  }, [isAnalyticsAllowed, isGAReady]);

  return track;
};

/**
 * Function to track custom events (standalone - use useTrackEvent hook when possible)
 */
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, unknown>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
    console.log('[Analytics] Event tracked (standalone):', eventName);
  } else {
    console.log('[Analytics] Event not tracked - gtag not ready:', eventName);
  }
};
