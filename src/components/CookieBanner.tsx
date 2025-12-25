'use client';

import { useState, useEffect } from 'react';

type ConsentState = {
  analytics: boolean;
  marketing: boolean;
};

type ConsentStatus = 'pending' | 'accepted' | 'rejected' | 'custom';

const STORAGE_KEY = 'etcm_consent';

// European timezones for geo-detection
const EU_TIMEZONES = [
  'Europe/', 'Atlantic/Azores', 'Atlantic/Canary', 'Atlantic/Faroe',
  'Atlantic/Madeira', 'Atlantic/Reykjavik', 'Asia/Nicosia', // Cyprus
];

function isEuropeanTimezone(): boolean {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return EU_TIMEZONES.some(prefix => tz.startsWith(prefix));
  } catch {
    return true; // Default to showing banner if detection fails
  }
}

function getStoredConsent(): { status: ConsentStatus; consent: ConsentState } | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return null;
}

function storeConsent(status: ConsentStatus, consent: ConsentState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ status, consent }));
  } catch {}
}

function updateGtagConsent(consent: ConsentState): void {
  if (typeof window === 'undefined') return;

  // Update Google Consent Mode v2
  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      analytics_storage: consent.analytics ? 'granted' : 'denied',
      ad_storage: consent.marketing ? 'granted' : 'denied',
      ad_user_data: consent.marketing ? 'granted' : 'denied',
      ad_personalization: consent.marketing ? 'granted' : 'denied',
    });
  }

  // Also push to dataLayer for GTM
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(['event', 'consent_update', {
    consent_analytics: consent.analytics ? 'granted' : 'denied',
    consent_marketing: consent.marketing ? 'granted' : 'denied',
  }]);
}

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [consent, setConsent] = useState<ConsentState>({
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if already consented
    const stored = getStoredConsent();
    if (stored) {
      updateGtagConsent(stored.consent);
      return;
    }

    // Only show banner in EU
    if (isEuropeanTimezone()) {
      setShowBanner(true);
    } else {
      // Non-EU: Grant all by default
      const fullConsent = { analytics: true, marketing: true };
      storeConsent('accepted', fullConsent);
      updateGtagConsent(fullConsent);
    }
  }, []);

  const handleAcceptAll = () => {
    const fullConsent = { analytics: true, marketing: true };
    storeConsent('accepted', fullConsent);
    updateGtagConsent(fullConsent);
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const noConsent = { analytics: false, marketing: false };
    storeConsent('rejected', noConsent);
    updateGtagConsent(noConsent);
    setShowBanner(false);
  };

  const handleSaveSettings = () => {
    storeConsent('custom', consent);
    updateGtagConsent(consent);
    setShowBanner(false);
    setShowSettings(false);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[9998]"
        onClick={() => {}} // Prevent closing on backdrop click
      />

      {/* Banner Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
        <div
          className="bg-parchment rounded-organic shadow-warm-xl max-w-lg w-full overflow-hidden animate-fade-in-up"
          role="dialog"
          aria-labelledby="cookie-title"
          aria-describedby="cookie-description"
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-4">
            <h2
              id="cookie-title"
              className="font-display text-2xl text-ink mb-2"
            >
              We Value Your Privacy
            </h2>
            <p
              id="cookie-description"
              className="font-body text-ink-light text-sm leading-relaxed"
            >
              We use cookies to enhance your browsing experience and analyze our traffic.
              Choose your preferences below.
            </p>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="px-6 pb-4 space-y-4 border-t border-sand-200 pt-4">
              {/* Essential - Always On */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body font-medium text-ink text-sm">Essential</p>
                  <p className="font-body text-ink-muted text-xs">Required for the website to function</p>
                </div>
                <div className="relative">
                  <div className="w-12 h-6 bg-sage-400 rounded-full cursor-not-allowed">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
              </div>

              {/* Analytics */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body font-medium text-ink text-sm">Analytics</p>
                  <p className="font-body text-ink-muted text-xs">Help us understand how visitors use our site</p>
                </div>
                <button
                  onClick={() => setConsent(c => ({ ...c, analytics: !c.analytics }))}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                    consent.analytics ? 'bg-terracotta-500' : 'bg-sand-300'
                  }`}
                  role="switch"
                  aria-checked={consent.analytics}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                      consent.analytics ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Marketing */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body font-medium text-ink text-sm">Marketing</p>
                  <p className="font-body text-ink-muted text-xs">Personalized ads and content</p>
                </div>
                <button
                  onClick={() => setConsent(c => ({ ...c, marketing: !c.marketing }))}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                    consent.marketing ? 'bg-terracotta-500' : 'bg-sand-300'
                  }`}
                  role="switch"
                  aria-checked={consent.marketing}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                      consent.marketing ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="px-6 pb-6 pt-2">
            {showSettings ? (
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 px-4 py-3 font-body text-sm font-medium text-ink-muted border border-sand-300 rounded-soft hover:bg-sand-100 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSaveSettings}
                  className="flex-1 px-4 py-3 font-body text-sm font-medium text-white bg-terracotta-500 rounded-soft hover:bg-terracotta-600 transition-colors"
                >
                  Save Preferences
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 px-4 py-3 font-body text-sm font-medium text-white bg-terracotta-500 rounded-soft hover:bg-terracotta-600 transition-colors shadow-warm-sm"
                >
                  Accept All
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="flex-1 px-4 py-3 font-body text-sm font-medium text-ink border border-sand-300 rounded-soft hover:bg-sand-100 transition-colors"
                >
                  Manage Settings
                </button>
                <button
                  onClick={handleRejectAll}
                  className="flex-1 px-4 py-3 font-body text-sm font-medium text-ink-muted hover:text-ink transition-colors"
                >
                  Reject All
                </button>
              </div>
            )}
          </div>

          {/* Privacy Link */}
          <div className="px-6 pb-4 text-center">
            <a
              href="/privacy"
              className="font-body text-xs text-ink-muted hover:text-terracotta-500 underline transition-colors"
            >
              Read our Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

// Type declaration for window - must match Analytics.tsx
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}
