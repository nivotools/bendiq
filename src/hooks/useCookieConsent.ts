import { useState, useEffect, useCallback } from 'react';

interface CookieConsent {
  consentGiven: boolean;
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CONSENT_KEY = 'cookie-consent';
const CONSENT_EVENT = 'cookie-consent-update';

const defaultConsent: CookieConsent = {
  consentGiven: false,
  necessary: true,
  analytics: false,
  marketing: false,
};

export function useCookieConsent(): CookieConsent {
  const [consent, setConsent] = useState<CookieConsent>(defaultConsent);

  const readConsent = useCallback(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setConsent({
          consentGiven: true,
          necessary: parsed.necessary ?? true,
          analytics: parsed.analytics ?? false,
          marketing: parsed.marketing ?? false,
        });
      } else {
        setConsent(defaultConsent);
      }
    } catch {
      setConsent(defaultConsent);
    }
  }, []);

  useEffect(() => {
    // Initial read
    readConsent();

    // Listen for consent updates
    const handleConsentUpdate = () => {
      readConsent();
    };

    window.addEventListener(CONSENT_EVENT, handleConsentUpdate);
    window.addEventListener('storage', handleConsentUpdate);

    return () => {
      window.removeEventListener(CONSENT_EVENT, handleConsentUpdate);
      window.removeEventListener('storage', handleConsentUpdate);
    };
  }, [readConsent]);

  return consent;
}
