import React from 'react';
import { useCookieConsent } from '@/contexts/CookieConsentContext';

interface TrackingGuardProps {
  type: 'analytics' | 'marketing';
  children: React.ReactNode;
  /**
   * Optional fallback to render when consent is not given.
   * If not provided, nothing will be rendered.
   */
  fallback?: React.ReactNode;
}

/**
 * TrackingGuard Component
 * 
 * A wrapper component that only renders its children when the user has given
 * consent for the specified tracking type.
 * 
 * Usage:
 * ```tsx
 * <TrackingGuard type="analytics">
 *   <GoogleAnalytics />
 * </TrackingGuard>
 * 
 * <TrackingGuard type="marketing">
 *   <FacebookPixel />
 * </TrackingGuard>
 * ```
 * 
 * This ensures GDPR compliance by preventing any tracking code from executing
 * until explicit consent is given.
 */
const TrackingGuard: React.FC<TrackingGuardProps> = ({ type, children, fallback = null }) => {
  const { preferences, hasConsented } = useCookieConsent();

  // Only render if:
  // 1. User has made a consent choice
  // 2. The specific tracking type is enabled
  if (!hasConsented || !preferences[type]) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

/**
 * Hook to check if a specific tracking type is allowed.
 * Useful for conditionally executing tracking code.
 * 
 * Usage:
 * ```tsx
 * const isAnalyticsAllowed = useTrackingAllowed('analytics');
 * 
 * useEffect(() => {
 *   if (isAnalyticsAllowed) {
 *     // Initialize analytics
 *     gtag('config', 'GA_MEASUREMENT_ID');
 *   }
 * }, [isAnalyticsAllowed]);
 * ```
 */
export const useTrackingAllowed = (type: 'analytics' | 'marketing'): boolean => {
  const { preferences, hasConsented } = useCookieConsent();
  return hasConsented && preferences[type];
};

export default TrackingGuard;
