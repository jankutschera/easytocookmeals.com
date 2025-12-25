'use client';

import Script from 'next/script';
import { useEffect } from 'react';

// GTM Container ID - will be set up later
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || '';
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';

export default function Analytics() {
  useEffect(() => {
    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];

    // Define gtag function
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    }
    window.gtag = gtag;

    // Set consent defaults BEFORE loading any tracking scripts
    // Default: denied for all (GDPR-safe)
    gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      wait_for_update: 500,
    });

    // Set region-specific defaults (Non-EU = granted)
    gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      region: ['US', 'CA', 'AU', 'NZ', 'JP', 'KR', 'SG', 'HK', 'TW'],
    });
  }, []);

  // Don't render scripts if no tracking IDs configured
  if (!GTM_ID && !GA_ID) {
    return null;
  }

  return (
    <>
      {/* Google Tag Manager - using external script approach */}
      {GTM_ID && (
        <Script
          id="gtm-init"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`}
          onLoad={() => {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
              'gtm.start': new Date().getTime(),
              event: 'gtm.js'
            });
          }}
        />
      )}

      {/* Fallback: Direct GA4 if no GTM */}
      {!GTM_ID && GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script
            id="ga4-config"
            strategy="afterInteractive"
            onLoad={() => {
              window.dataLayer = window.dataLayer || [];
              function gtag(...args: unknown[]) {
                window.dataLayer?.push(args);
              }
              gtag('js', new Date());
              gtag('config', GA_ID);
            }}
          />
        </>
      )}
    </>
  );
}

// Type declaration
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}
