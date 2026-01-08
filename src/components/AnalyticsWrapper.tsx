import React, { useEffect } from 'react';
import { useCookieConsent } from '@/hooks/useCookieConsent';

interface AnalyticsWrapperProps {
  children: React.ReactNode;
  googleAnalyticsId?: string;
  metaPixelId?: string;
}

export default function AnalyticsWrapper({ 
  children, 
  googleAnalyticsId,
  metaPixelId 
}: AnalyticsWrapperProps) {
  const consent = useCookieConsent();

  // Google Analytics
  useEffect(() => {
    if (!consent.analytics || !googleAnalyticsId) return;

    // Check if script already exists
    if (document.getElementById('ga-script')) return;

    // Load Google Analytics
    const script = document.createElement('script');
    script.id = 'ga-script';
    script.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize gtag
    const initScript = document.createElement('script');
    initScript.id = 'ga-init';
    initScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${googleAnalyticsId}', {
        'anonymize_ip': true
      });
    `;
    document.head.appendChild(initScript);

    return () => {
      // Cleanup if consent is revoked
      const gaScript = document.getElementById('ga-script');
      const gaInit = document.getElementById('ga-init');
      if (gaScript) gaScript.remove();
      if (gaInit) gaInit.remove();
    };
  }, [consent.analytics, googleAnalyticsId]);

  // Meta Pixel
  useEffect(() => {
    if (!consent.marketing || !metaPixelId) return;

    // Check if script already exists
    if (document.getElementById('meta-pixel')) return;

    // Load Meta Pixel
    const script = document.createElement('script');
    script.id = 'meta-pixel';
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${metaPixelId}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);

    // Add noscript fallback
    const noscript = document.createElement('noscript');
    noscript.id = 'meta-pixel-noscript';
    noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1"/>`;
    document.body.appendChild(noscript);

    return () => {
      const metaScript = document.getElementById('meta-pixel');
      const metaNoscript = document.getElementById('meta-pixel-noscript');
      if (metaScript) metaScript.remove();
      if (metaNoscript) metaNoscript.remove();
    };
  }, [consent.marketing, metaPixelId]);

  return <>{children}</>;
}
