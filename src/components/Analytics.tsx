'use client';

import Script from 'next/script';
import { useEffect } from 'react';

// GTM Config (server-side proxy via Stape)
const GTM_CONTAINER_ID = 'GTM-ND35KXQL';
const GTM_STAPE_DOMAIN = 'load.scripte.easytocookmeals.com';
const GTM_STAPE_ENCODED = 'bbeb=ChdWMiA8VDQnQF4%2BLCA1XBVOWVtFVx0UXhYKBg0FFhkMHAAYERAVCU0QBBg%3D';

// GA4 Config
const GA4_MEASUREMENT_ID = 'G-1LLQMZ531Z';

// Plausible Config (first-party subdomain)
const PLAUSIBLE_DOMAIN = 'applause.easytocookmeals.com';
const PLAUSIBLE_SITE = 'easytocookmeals.com';

// Umami Config (first-party subdomain)
const UMAMI_DOMAIN = 'umami.easytocookmeals.com';
const UMAMI_WEBSITE_ID = '4bd7a9c3-7c5d-4793-9403-ee9f23dce4a0';

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

  return (
    <>
      {/* Google Tag Manager (Server-Side via Stape) */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
      >
        {`
          (function(w,d,s,l,i){
            w[l]=w[l]||[];
            w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s);
            j.async=true;
            j.src="https://${GTM_STAPE_DOMAIN}/4bz9szyqtuksc.js?"+i;
            f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_STAPE_ENCODED}');
        `}
      </Script>

      {/* Plausible Analytics (GDPR-compliant, cookieless) */}
      <Script
        defer
        data-domain={PLAUSIBLE_SITE}
        src={`https://${PLAUSIBLE_DOMAIN}/js/script.file-downloads.hash.outbound-links.pageview-props.revenue.tagged-events.js`}
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

// GTM Container ID export for noscript iframe
export const GTM_NOSCRIPT_URL = `https://${GTM_STAPE_DOMAIN}/ns.html?id=${GTM_CONTAINER_ID}`;

// Type declaration
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    plausible?: (...args: unknown[]) => void;
  }
}
