'use client';

import Script from 'next/script';
import { useEffect } from 'react';

// Tracking IDs from environment
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || '';
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// Analytics subdomains
const PLAUSIBLE_DOMAIN = 'applause.easytocookmeals.com';
const UMAMI_DOMAIN = 'umami.easytocookmeals.com';
const STAPE_DOMAIN = 'scripte.easytocookmeals.com'; // Server-side GTM
const UMAMI_WEBSITE_ID = ''; // Will be set after Umami setup

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

    // Initialize GTM
    if (GTM_ID) {
      gtag('js', new Date());
      window.dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js'
      });
    }
  }, []);

  return (
    <>
      {/* Google Tag Manager */}
      {GTM_ID && (
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`}
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
          >
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}
          </Script>
        </>
      )}

      {/* Plausible Analytics (GDPR-compliant, cookieless) */}
      <Script
        defer
        data-domain="easytocookmeals.com"
        src={`https://${PLAUSIBLE_DOMAIN}/js/script.file-downloads.hash.outbound-links.pageview-props.tagged-events.js`}
        strategy="afterInteractive"
      />
      <Script id="plausible-helper" strategy="afterInteractive">
        {`window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }`}
      </Script>

      {/* Umami Analytics (cookieless, privacy-focused) */}
      {UMAMI_WEBSITE_ID && (
        <Script
          defer
          src={`https://${UMAMI_DOMAIN}/script.js`}
          data-website-id={UMAMI_WEBSITE_ID}
          strategy="afterInteractive"
        />
      )}
    </>
  );
}

// Type declaration
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    plausible?: (...args: unknown[]) => void;
  }
}
