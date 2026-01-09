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
  }, [saveConsent]);

  const updatePreferences = useCallback((prefs: Partial<Omit<CookiePreferences, 'essential'>>) => {
    setPreferences(prev => {
      const newPrefs: CookiePreferences = {
        ...prev,
        ...prefs,
        essential: true, // Always enforce essential
      };
      saveConsent(newPrefs);
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
