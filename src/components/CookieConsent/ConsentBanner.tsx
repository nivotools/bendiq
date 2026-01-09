import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Settings, Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCookieConsent } from '@/contexts/CookieConsentContext';

const ConsentBanner: React.FC = () => {
  const { showBanner, acceptAll, rejectAll, openPreferencesModal } = useCookieConsent();

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-slate-900 border-t border-slate-700 shadow-2xl animate-in slide-in-from-bottom duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          {/* Icon and Text */}
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 bg-blue-500/20 rounded-lg shrink-0">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-white text-sm sm:text-base">
                We value your privacy
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                You can choose which cookies you allow. Essential cookies are always active as they are necessary for the website to function.
              </p>
            </div>
          </div>

          {/* Buttons - Equal prominence for Reject/Accept (EU/German law compliant) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto shrink-0">
            <Button
              variant="outline"
              onClick={rejectAll}
              className="h-10 px-5 text-sm font-medium border-slate-500 text-slate-200 hover:bg-slate-800 hover:text-white min-w-[120px]"
            >
              Reject All
            </Button>
            <Button
              variant="ghost"
              onClick={openPreferencesModal}
              className="h-10 px-5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <Settings className="w-4 h-4 mr-2" />
              Customize
            </Button>
            <Button
              onClick={acceptAll}
              className="h-10 px-5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
            >
              Accept All
            </Button>
          </div>
        </div>

        {/* Legal links */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-700/50">
          <button 
            onClick={openPreferencesModal}
            className="text-xs text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-1"
          >
            <Cookie className="w-3 h-3" />
            Cookie Policy
          </button>
          <span className="text-slate-600">|</span>
          <Link 
            to="/privacy-policy" 
            className="text-xs text-slate-400 hover:text-blue-400 transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ConsentBanner;
