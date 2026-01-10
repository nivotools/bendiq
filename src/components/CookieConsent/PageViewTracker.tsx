import { useEffect } from 'react';
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

  useEffect(() => {
    if (isAnalyticsAllowed && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
        page_title: document.title,
      });
      console.log('[Analytics] Page view tracked:', location.pathname);
    }
  }, [location.pathname, location.search, isAnalyticsAllowed]);

  return null;
};

export default PageViewTracker;
