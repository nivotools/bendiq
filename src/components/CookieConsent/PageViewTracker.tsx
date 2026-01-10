import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTrackingAllowed } from './TrackingGuard';

/**
 * PageViewTracker Component
 * 
 * Automatically tracks page views on route changes when analytics consent is given.
 * Must be placed inside BrowserRouter to access location context.
 */
const PageViewTracker: React.FC = () => {
  const location = useLocation();
  const isAnalyticsAllowed = useTrackingAllowed('analytics');
  const [isGAReady, setIsGAReady] = useState(!!window.gtag);

  // Listen for GA ready event
  useEffect(() => {
    const handleGAReady = () => {
      console.log('[PageViewTracker] GA ready event received');
      setIsGAReady(true);
    };
    window.addEventListener('ga-ready', handleGAReady);
    
    // Check if already ready
    if (window.gtag) {
      setIsGAReady(true);
    }
    
    return () => window.removeEventListener('ga-ready', handleGAReady);
  }, []);

  // Track page views when both consent and GA are ready
  useEffect(() => {
    if (isAnalyticsAllowed && isGAReady && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
        page_title: document.title,
      });
      console.log('[Analytics] Page view tracked:', location.pathname);
    } else {
      console.log('[PageViewTracker] Not tracking - consent:', isAnalyticsAllowed, 'ready:', isGAReady);
    }
  }, [location.pathname, location.search, isAnalyticsAllowed, isGAReady]);

  return null;
};

export default PageViewTracker;
