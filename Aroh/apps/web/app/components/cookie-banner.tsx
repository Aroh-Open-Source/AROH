"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  parseConsentCookie,
  serializeConsentCookie,
  CONSENT_COOKIE_NAME,
  ConsentRecord,
  CategoryConsentPreferences
} from "@aroh/asdk";

export default function CookieBanner() {
  const [mounted, setMounted] = React.useState(false);
  const [showBanner, setShowBanner] = React.useState(false);
  const [showPreferences, setShowPreferences] = React.useState(false);

  const [functional, setFunctional] = React.useState(false);
  const [analytics, setAnalytics] = React.useState(false);
  const [marketing, setMarketing] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const match = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${CONSENT_COOKIE_NAME}=`));

      const rawValue = match ? decodeURIComponent(match.split("=")[1]) : localStorage.getItem(CONSENT_COOKIE_NAME);
      const parsed = parseConsentCookie(rawValue ?? undefined);

      if (!parsed || parsed.state === "unknown") {
        setShowBanner(true);
      } else {
        setFunctional(parsed.preferences.functional);
        setAnalytics(parsed.preferences.analytics);
        setMarketing(parsed.preferences.marketing);
      }
    }
  }, []);

  const savePreferences = (
    state: "accepted" | "rejected" | "partial",
    prefs: CategoryConsentPreferences,
    action: string
  ) => {
    const record: ConsentRecord = {
      consent_id: crypto.randomUUID ? crypto.randomUUID() : `urn:uuid:${Date.now()}`,
      data_principal_id: null,
      policy_version: "1.0.0",
      notice_version: "1.0.0",
      consent_state: state,
      preferences: prefs,
      timestamp: new Date().toISOString(),
      source: "web_banner",
      affirmative_action: action
    };

    const serialized = serializeConsentCookie(record);

    if (typeof window !== "undefined") {
      // Set secure cookie valid for 180 days (6 months)
      const maxAge = 180 * 24 * 60 * 60;
      document.cookie = `${CONSENT_COOKIE_NAME}=${encodeURIComponent(serialized)}; path=/; max-age=${maxAge}; SameSite=Lax`;
      localStorage.setItem(CONSENT_COOKIE_NAME, serialized);

      // Dispatch custom event so listeners across the application update dynamically
      window.dispatchEvent(new CustomEvent("aroh_consent_updated", { detail: record }));
    }

    setShowBanner(false);
    setShowPreferences(false);
  };

  const handleAcceptAll = () => {
    savePreferences(
      "accepted",
      { essential: true, functional: true, analytics: true, marketing: true },
      "click_accept_all"
    );
  };

  const handleRejectOptional = () => {
    savePreferences(
      "rejected",
      { essential: true, functional: false, analytics: false, marketing: false },
      "click_reject_optional"
    );
  };

  const handleSaveCustom = () => {
    const anyOptional = functional || analytics || marketing;
    const allOptional = functional && analytics && marketing;
    const state = allOptional ? "accepted" : anyOptional ? "partial" : "rejected";

    savePreferences(
      state,
      { essential: true, functional, analytics, marketing },
      "click_save_custom_preferences"
    );
  };

  if (!mounted || !showBanner) {
    return null;
  }

  return (
    <>
      {/* Primary Accessible Cookie & Privacy Banner */}
      <AnimatePresence>
        {!showPreferences && (
          <motion.aside
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
            role="region"
            aria-label="Privacy and Cookie Preferences"
            className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-xl z-[9999] bg-white/95 backdrop-blur-xl border border-black/10 rounded-2xl p-6 shadow-2xl text-slate-900"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
                    Privacy & Cookie Choices
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Under the Digital Personal Data Protection Act, 2023, we require your affirmative consent for optional processing. We use essential storage for authentication and security. Non-essential cookies and analytics remain strictly blocked until you consent.
                  </p>
                </div>
              </div>

              {/* Action Buttons: Equal visual prominence, no deceptive dark patterns */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-2 border-t border-black/5">
                <button
                  type="button"
                  onClick={() => setShowPreferences(true)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-black/10 focus-visible:outline-2 focus-visible:outline-sky-500"
                >
                  Manage Preferences
                </button>
                <button
                  type="button"
                  onClick={handleRejectOptional}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-black/10 transition-colors focus-visible:outline-2 focus-visible:outline-sky-500"
                >
                  Reject Optional
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm focus-visible:outline-2 focus-visible:outline-sky-500"
                >
                  Accept All
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <div className="flex items-center gap-3">
                  <a href="/privacy" className="hover:underline text-slate-600">Privacy Notice</a>
                  <span>•</span>
                  <a href="/cookies" className="hover:underline text-slate-600">Cookie Inventory</a>
                  <span>•</span>
                  <a href="/privacy/rights" className="hover:underline text-slate-600">Your Rights</a>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">DPDP Ready</span>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Granular Preference Drawer / Modal */}
      <AnimatePresence>
        {showPreferences && (
          <div className="fixed inset-0 z-[10000] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="cookie-modal-title"
              className="w-full max-w-xl bg-white border border-black/10 rounded-2xl shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto text-slate-900"
            >
              <div className="flex justify-between items-start border-b border-black/5 pb-4">
                <div>
                  <h2 id="cookie-modal-title" className="text-lg font-bold text-slate-900">
                    Cookie & Data Processing Preferences
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Configure purpose-specific consent categories pursuant to Section 6 of the DPDP Act.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPreferences(false)}
                  className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg text-lg leading-none"
                  aria-label="Close preferences"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {/* 1. Essential Category (Always Enabled) */}
                <div className="p-4 rounded-xl border border-black/10 bg-slate-50 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900">Strictly Necessary (Essential)</span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                        Always Active
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Required for identity authentication, session integrity, cryptographic security, and token verification. Cannot be disabled.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={true}
                    disabled={true}
                    aria-label="Essential cookies cannot be disabled"
                    className="mt-1 h-4 w-4 rounded accent-slate-900 cursor-not-allowed opacity-60"
                  />
                </div>

                {/* 2. Functional Category */}
                <div className="p-4 rounded-xl border border-black/10 bg-white flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900">Functional & Preferences</span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
                        Optional
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Preserves user preferences such as video playback states and display customizations across sessions.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={functional}
                    onChange={(e) => setFunctional(e.target.checked)}
                    id="consent-functional"
                    className="mt-1 h-4 w-4 rounded accent-slate-900 cursor-pointer"
                  />
                </div>

                {/* 3. Analytics Category */}
                <div className="p-4 rounded-xl border border-black/10 bg-white flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900">Analytics & Performance</span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
                        Optional
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Measures aggregated route latency, page load metrics, and diagnostic error spikes to maintain platform stability.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    id="consent-analytics"
                    className="mt-1 h-4 w-4 rounded accent-slate-900 cursor-pointer"
                  />
                </div>

                {/* 4. Marketing Category */}
                <div className="p-4 rounded-xl border border-black/10 bg-white flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900">Marketing & Partner Referrals</span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
                        Optional
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Tracks referral attribution when navigating between AROH and registered ecosystem product showcases.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    id="consent-marketing"
                    className="mt-1 h-4 w-4 rounded accent-slate-900 cursor-pointer"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-black/5">
                <button
                  type="button"
                  onClick={handleRejectOptional}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-black/10 transition-colors"
                >
                  Reject All Optional
                </button>
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleAcceptAll}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-black/10 transition-colors"
                  >
                    Accept All
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveCustom}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
