import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface CookiePreferences {
  essential: boolean; // Always true, cannot be disabled
  analytics: boolean;
  marketing: boolean;
}

interface CookieConsentContextType {
  preferences: CookiePreferences;
  hasConsented: boolean; // True if user has made any choice
  showBanner: boolean;
  showPreferencesModal: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  updatePreferences: (prefs: Partial<Omit<CookiePreferences, 'essential'>>) => void;
  openPreferencesModal: () => void;
  closePreferencesModal: () => void;
  closeBanner: () => void;
}

const STORAGE_KEY = 'bendiq_cookie_consent';

// Default state: ZERO tracking until explicit consent (GDPR compliant)
const defaultPreferences: CookiePreferences = {
  essential: true,
  analytics: false,
  marketing: false,
};

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
};

interface StoredConsent {
  preferences: CookiePreferences;
  timestamp: number;
  version: string;
}

// Consent analytics storage key
const CONSENT_ANALYTICS_KEY = 'bendiq_consent_analytics';

interface ConsentEvent {
  type: 'accept_all' | 'reject_all' | 'custom';
  preferences: CookiePreferences;
  timestamp: number;
  userAgent: string;
}

// Helper to log consent events for compliance reporting
const logConsentEvent = (type: ConsentEvent['type'], prefs: CookiePreferences) => {
  try {
    const events: ConsentEvent[] = JSON.parse(localStorage.getItem(CONSENT_ANALYTICS_KEY) || '[]');
    const newEvent: ConsentEvent = {
      type,
      preferences: prefs,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
    };
    // Keep last 100 events for compliance
    const updatedEvents = [...events.slice(-99), newEvent];
    localStorage.setItem(CONSENT_ANALYTICS_KEY, JSON.stringify(updatedEvents));
    console.log(`[Consent] Logged ${type} event for compliance reporting`);
  } catch (error) {
    console.error('[Consent] Failed to log consent event:', error);
  }
};

// Export function to get consent analytics for reporting
export const getConsentAnalytics = () => {
  try {
    const events: ConsentEvent[] = JSON.parse(localStorage.getItem(CONSENT_ANALYTICS_KEY) || '[]');
    const total = events.length;
    const acceptAll = events.filter(e => e.type === 'accept_all').length;
    const rejectAll = events.filter(e => e.type === 'reject_all').length;
    const custom = events.filter(e => e.type === 'custom').length;
    
    return {
      total,
      acceptAll,
      rejectAll,
      custom,
      acceptRate: total > 0 ? ((acceptAll / total) * 100).toFixed(1) : '0',
      rejectRate: total > 0 ? ((rejectAll / total) * 100).toFixed(1) : '0',
      customRate: total > 0 ? ((custom / total) * 100).toFixed(1) : '0',
      events,
    };
  } catch {
    return { total: 0, acceptAll: 0, rejectAll: 0, custom: 0, acceptRate: '0', rejectRate: '0', customRate: '0', events: [] };
  }
};

export const CookieConsentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);
  const [hasConsented, setHasConsented] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);

  // Load stored consent on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: StoredConsent = JSON.parse(stored);
        setPreferences({
          ...parsed.preferences,
          essential: true, // Always enforce essential
        });
        setHasConsented(true);
        setShowBanner(false);
      } else {
        // No consent stored - show banner, keep tracking disabled
        setShowBanner(true);
        setHasConsented(false);
      }
    } catch {
      // If parsing fails, reset to defaults and show banner
      setShowBanner(true);
      setHasConsented(false);
    }
  }, []);

  const saveConsent = useCallback((prefs: CookiePreferences) => {
    const data: StoredConsent = {
      preferences: prefs,
      timestamp: Date.now(),
      version: '1.0',
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, []);

  const acceptAll = useCallback(() => {
    const newPrefs: CookiePreferences = {
      essential: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(newPrefs);
    setHasConsented(true);
    setShowBanner(false);
    setShowPreferencesModal(false);
    saveConsent(newPrefs);
    logConsentEvent('accept_all', newPrefs);
  }, [saveConsent]);

  const rejectAll = useCallback(() => {
    const newPrefs: CookiePreferences = {
      essential: true,
      analytics: false,
      marketing: false,
    };
    setPreferences(newPrefs);
    setHasConsented(true);
    setShowBanner(false);
    setShowPreferencesModal(false);
    saveConsent(newPrefs);
    logConsentEvent('reject_all', newPrefs);
  }, [saveConsent]);

  const updatePreferences = useCallback((prefs: Partial<Omit<CookiePreferences, 'essential'>>) => {
    setPreferences(prev => {
      const newPrefs: CookiePreferences = {
        ...prev,
        ...prefs,
        essential: true, // Always enforce essential
      };
      saveConsent(newPrefs);
      logConsentEvent('custom', newPrefs);
      return newPrefs;
    });
    setHasConsented(true);
    setShowBanner(false);
    setShowPreferencesModal(false);
  }, [saveConsent]);

  const openPreferencesModal = useCallback(() => {
    setShowPreferencesModal(true);
  }, []);

  const closePreferencesModal = useCallback(() => {
    setShowPreferencesModal(false);
  }, []);

  const closeBanner = useCallback(() => {
    setShowBanner(false);
  }, []);

  return (
    <CookieConsentContext.Provider
      value={{
        preferences,
        hasConsented,
        showBanner,
        showPreferencesModal,
        acceptAll,
        rejectAll,
        updatePreferences,
        openPreferencesModal,
        closePreferencesModal,
        closeBanner,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
};
