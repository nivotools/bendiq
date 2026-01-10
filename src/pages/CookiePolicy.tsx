import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Cookie, Lock, BarChart3, Megaphone, Settings, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCookieConsent } from '@/contexts/CookieConsentContext';

const CookiePolicy: React.FC = () => {
  const { openPreferencesModal } = useCookieConsent();

  const cookieTypes = [
    {
      id: 'essential',
      title: 'Essential Cookies',
      icon: <Lock className="w-6 h-6 text-green-400" />,
      description: 'These cookies are strictly necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.',
      examples: [
        'Session management cookies that keep you logged in',
        'Security cookies that protect against fraudulent activity',
        'User preference cookies (e.g., language selection)',
        'Load balancing cookies for optimal performance',
      ],
      retention: 'Session to 1 year',
      canDisable: false,
    },
    {
      id: 'functional',
      title: 'Functional Cookies',
      icon: <Settings className="w-6 h-6 text-purple-400" />,
      description: 'These cookies enable enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.',
      examples: [
        'Remembering your preferences and settings',
        'Personalizing content based on your usage',
        'Storing your cookie consent preferences',
        'Remembering form inputs for future visits',
      ],
      retention: '1 month to 1 year',
      canDisable: false,
      note: 'Currently grouped with Essential cookies',
    },
    {
      id: 'analytics',
      title: 'Analytics Cookies',
      icon: <BarChart3 className="w-6 h-6 text-blue-400" />,
      description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our site and services.',
      examples: [
        'Google Analytics tracking (page views, session duration)',
        'Aggregate user behavior patterns',
        'Feature usage statistics',
        'Performance monitoring data',
      ],
      retention: 'Up to 2 years',
      canDisable: true,
    },
    {
      id: 'marketing',
      title: 'Marketing Cookies',
      icon: <Megaphone className="w-6 h-6 text-yellow-400" />,
      description: 'These cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user.',
      examples: [
        'Advertising platform cookies',
        'Social media tracking pixels',
        'Retargeting and remarketing cookies',
        'Cross-site user identification',
      ],
      retention: 'Up to 2 years',
      canDisable: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to App</span>
          </Link>
          <Button
            onClick={openPreferencesModal}
            variant="outline"
            className="rounded-lg border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            <Cookie className="w-4 h-4 mr-2" />
            Manage Cookies
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-blue-500/20 rounded-xl mb-4">
            <Cookie className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            This policy explains how BendIQ uses cookies and similar technologies to recognize you when you visit our website.
          </p>
          <p className="text-slate-500 text-sm mt-2">
            Last updated: January 2025
          </p>
        </div>

        {/* What are cookies */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            What Are Cookies?
          </h2>
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
            <p className="text-slate-300 leading-relaxed mb-4">
              Cookies are small text files that are stored on your computer or mobile device when you visit a website. 
              They are widely used to make websites work more efficiently and to provide information to the website owners.
            </p>
            <p className="text-slate-300 leading-relaxed">
              We use cookies to enhance your browsing experience, analyze our traffic, and for security and personalization purposes. 
              Some cookies are essential for the website to function, while others are optional and require your consent.
            </p>
          </div>
        </section>

        {/* Cookie Types */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-6">Types of Cookies We Use</h2>
          <div className="space-y-6">
            {cookieTypes.map((cookie) => (
              <div
                key={cookie.id}
                className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-2 bg-slate-700/50 rounded-lg shrink-0">
                    {cookie.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-white">{cookie.title}</h3>
                      {cookie.canDisable ? (
                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                          Optional
                        </span>
                      ) : (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {cookie.description}
                    </p>
                    {cookie.note && (
                      <p className="text-slate-500 text-xs mt-2 italic">
                        Note: {cookie.note}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-700/50">
                  <div>
                    <h4 className="text-xs font-medium text-slate-400 uppercase mb-2">Examples</h4>
                    <ul className="space-y-1">
                      {cookie.examples.map((example, i) => (
                        <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                          <span className="text-slate-500 mt-1">•</span>
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-slate-400 uppercase mb-2">Retention Period</h4>
                    <p className="text-sm text-slate-300">{cookie.retention}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Your Rights */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Your Rights & Choices</h2>
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 space-y-4">
            <p className="text-slate-300 leading-relaxed">
              You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by:
            </p>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Using our cookie preferences panel (accessible via the cookie icon or banner)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Adjusting your browser settings to refuse cookies
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Using browser extensions that block tracking
              </li>
            </ul>
            <p className="text-slate-400 text-sm">
              Note: If you choose to reject cookies, you may still use our website, though some features may not function properly.
            </p>
          </div>
        </section>

        {/* CCPA Notice */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">California Privacy Rights (CCPA)</h2>
          <div className="bg-yellow-500/10 rounded-xl p-6 border border-yellow-500/30">
            <p className="text-slate-300 leading-relaxed mb-4">
              If you are a California resident, you have the right to opt-out of the "sale" of your personal information 
              under the California Consumer Privacy Act (CCPA). Our cookie preferences panel includes a "Do Not Sell My Personal Information" option.
            </p>
            <Button
              onClick={openPreferencesModal}
              variant="outline"
              className="rounded-lg border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
            >
              Exercise Your CCPA Rights
            </Button>
          </div>
        </section>

        {/* Contact */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
            <p className="text-slate-300 leading-relaxed mb-4">
              If you have any questions about our use of cookies, please contact us:
            </p>
            <ul className="space-y-2 text-slate-300">
              <li><strong>Email:</strong> nivotools@gmail.com</li>
              <li><strong>Phone:</strong> 015679758515</li>
            </ul>
          </div>
        </section>

        {/* Footer links */}
        <div className="flex flex-wrap gap-4 justify-center pt-8 border-t border-slate-800">
          <Link to="/privacy-policy" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
            Privacy Policy
          </Link>
          <span className="text-slate-600">|</span>
          <button
            onClick={openPreferencesModal}
            className="text-slate-400 hover:text-blue-400 transition-colors text-sm"
          >
            Manage Cookie Preferences
          </button>
        </div>
      </main>
    </div>
  );
};

export default CookiePolicy;
