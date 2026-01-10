import React, { useState, useEffect } from 'react';
import { Shield, BarChart3, Megaphone, Lock, Info, Cookie } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useCookieConsent } from '@/contexts/CookieConsentContext';

interface CookieCategory {
  id: 'essential' | 'analytics' | 'marketing';
  title: string;
  description: string;
  icon: React.ReactNode;
  disabled?: boolean;
  alwaysOn?: boolean;
}

const cookieCategories: CookieCategory[] = [
  {
    id: 'essential',
    title: 'Essential Cookies',
    description: 'These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you such as setting your privacy preferences, logging in or filling in forms.',
    icon: <Lock className="w-5 h-5 text-green-400" />,
    disabled: true,
    alwaysOn: true,
  },
  {
    id: 'analytics',
    title: 'Analytics Cookies',
    description: 'These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are the most and least popular and see how visitors move around the site.',
    icon: <BarChart3 className="w-5 h-5 text-blue-400" />,
  },
  {
    id: 'marketing',
    title: 'Marketing Cookies',
    description: 'These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites.',
    icon: <Megaphone className="w-5 h-5 text-yellow-400" />,
  },
];

const PreferencesModal: React.FC = () => {
  const {
    preferences,
    showPreferencesModal,
    closePreferencesModal,
    updatePreferences,
    acceptAll,
    rejectAll,
  } = useCookieConsent();

  const [localPrefs, setLocalPrefs] = useState(preferences);
  const [doNotSell, setDoNotSell] = useState(!preferences.marketing);

  // Sync local state when preferences change
  useEffect(() => {
    setLocalPrefs(preferences);
    setDoNotSell(!preferences.marketing);
  }, [preferences]);

  const handleToggle = (id: 'analytics' | 'marketing', checked: boolean) => {
    setLocalPrefs(prev => ({ ...prev, [id]: checked }));
    
    // Sync "Do Not Sell" with marketing toggle
    if (id === 'marketing') {
      setDoNotSell(!checked);
    }
  };

  const handleDoNotSellToggle = (checked: boolean) => {
    setDoNotSell(checked);
    // When "Do Not Sell" is ON, marketing must be OFF
    setLocalPrefs(prev => ({ ...prev, marketing: !checked }));
  };

  const handleSavePreferences = () => {
    updatePreferences({
      analytics: localPrefs.analytics,
      marketing: localPrefs.marketing,
    });
  };

  return (
    <Dialog open={showPreferencesModal} onOpenChange={(open) => !open && closePreferencesModal()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700 text-white rounded-xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Cookie className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-white">
                Cookie Preferences
              </DialogTitle>
              <DialogDescription className="text-slate-400 text-sm">
                Manage your cookie settings below
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Cookie Categories */}
          {cookieCategories.map((category) => (
            <div
              key={category.id}
              className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-1.5 bg-slate-700/50 rounded-lg shrink-0 mt-0.5">
                    {category.icon}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-white text-sm">
                        {category.title}
                      </h4>
                      {category.alwaysOn && (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                          Always Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={category.alwaysOn || localPrefs[category.id]}
                  onCheckedChange={(checked) => 
                    !category.disabled && handleToggle(category.id as 'analytics' | 'marketing', checked)
                  }
                  disabled={category.disabled}
                  className="shrink-0 data-[state=checked]:bg-blue-600"
                />
              </div>
            </div>
          ))}

          {/* CCPA "Do Not Sell" Section */}
          <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-1.5 bg-yellow-500/20 rounded-lg shrink-0 mt-0.5">
                  <Shield className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-white text-sm">
                      Do Not Sell My Personal Information
                    </h4>
                    <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
                      CCPA
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Under the California Consumer Privacy Act (CCPA), you have the right to opt-out of the sale of your personal information. 
                    Enabling this will disable marketing cookies and data sharing with third parties.
                  </p>
                </div>
              </div>
              <Switch
                checked={doNotSell}
                onCheckedChange={handleDoNotSellToggle}
                className="shrink-0 data-[state=checked]:bg-yellow-500"
              />
            </div>
          </div>

          {/* Info box */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-400">
              You can change your preferences at any time by clicking the cookie icon in the bottom-left corner. 
              Your preferences are stored locally and are not shared with anyone.
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 pt-4 border-t border-slate-700/50">
          <Button
            variant="outline"
            onClick={rejectAll}
            className="flex-1 h-10 rounded-lg border-slate-600 text-slate-200 hover:bg-slate-800 hover:text-white"
          >
            Reject All
          </Button>
          <Button
            variant="outline"
            onClick={handleSavePreferences}
            className="flex-1 h-10 rounded-lg border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
          >
            Save Preferences
          </Button>
          <Button
            onClick={acceptAll}
            className="flex-1 h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
          >
            Accept All
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PreferencesModal;
