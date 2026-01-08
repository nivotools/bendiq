import React, { useState, useEffect } from 'react';
import { X, Cookie, Shield, BarChart3, Target } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CONSENT_KEY = 'cookie-consent';
const CONSENT_EVENT = 'cookie-consent-update';

export const dispatchConsentUpdate = () => {
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT));
};

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      // Delay showing for smoother page load
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(prefs));
    setIsVisible(false);
    dispatchConsentUpdate();
  };

  const handleAcceptAll = () => {
    saveConsent({ necessary: true, analytics: true, marketing: true });
  };

  const handleRejectAll = () => {
    saveConsent({ necessary: true, analytics: false, marketing: false });
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
    setShowCustomize(false);
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-x-0 bottom-0 z-[9999] p-4 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`}>
      <div className="max-w-2xl mx-auto bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
        {/* Main Banner */}
        {!showCustomize ? (
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <Cookie className="text-blue-500" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-2">We value your privacy</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.{' '}
                  <a 
                    href="/privacy-policy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 underline hover:text-blue-300 transition-colors"
                  >
                    Read our Privacy Policy
                  </a>
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={handleRejectAll}
                    variant="outline"
                    className="flex-1 min-w-[120px] h-12 rounded-xl border-slate-600 text-white hover:bg-slate-800 font-bold"
                  >
                    Reject All
                  </Button>
                  <Button
                    onClick={() => setShowCustomize(true)}
                    variant="outline"
                    className="flex-1 min-w-[120px] h-12 rounded-xl border-slate-600 text-white hover:bg-slate-800 font-bold"
                  >
                    Customize
                  </Button>
                  <Button
                    onClick={handleAcceptAll}
                    className="flex-1 min-w-[120px] h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                  >
                    Accept All
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Customize Panel */
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Cookie Preferences</h3>
              <button
                onClick={() => setShowCustomize(false)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {/* Necessary Cookies */}
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Shield className="text-green-500" size={20} />
                  <div>
                    <p className="font-semibold text-white">Necessary</p>
                    <p className="text-xs text-slate-400">Required for the website to function properly</p>
                  </div>
                </div>
                <Switch checked disabled className="opacity-50 cursor-not-allowed" />
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <BarChart3 className="text-blue-500" size={20} />
                  <div>
                    <p className="font-semibold text-white">Analytics</p>
                    <p className="text-xs text-slate-400">Help us understand how visitors use our site</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.analytics}
                  onCheckedChange={(checked) => setPreferences(p => ({ ...p, analytics: checked }))}
                />
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Target className="text-orange-500" size={20} />
                  <div>
                    <p className="font-semibold text-white">Marketing</p>
                    <p className="text-xs text-slate-400">Used to deliver personalized advertisements</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.marketing}
                  onCheckedChange={(checked) => setPreferences(p => ({ ...p, marketing: checked }))}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowCustomize(false)}
                variant="outline"
                className="flex-1 h-12 rounded-xl border-slate-600 text-white hover:bg-slate-800 font-bold"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSavePreferences}
                className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
              >
                Save Preferences
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
