"use client";

import * as React from "react";
import Link from "next/link";
import {
  parseConsentCookie,
  serializeConsentCookie,
  CONSENT_COOKIE_NAME,
  ConsentRecord,
  CategoryConsentPreferences
} from "@aroh/asdk";

export default function CookiesPage() {
  const [mounted, setMounted] = React.useState(false);
  const [state, setState] = React.useState<"unknown" | "accepted" | "rejected" | "partial" | "withdrawn">("unknown");
  const [functional, setFunctional] = React.useState(false);
  const [analytics, setAnalytics] = React.useState(false);
  const [marketing, setMarketing] = React.useState(false);
  const [savedFeedback, setSavedFeedback] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const match = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${CONSENT_COOKIE_NAME}=`));

      const rawValue = match ? decodeURIComponent(match.split("=")[1]) : localStorage.getItem(CONSENT_COOKIE_NAME);
      const parsed = parseConsentCookie(rawValue ?? undefined);

      if (parsed) {
        setState(parsed.state);
        setFunctional(parsed.preferences.functional);
        setAnalytics(parsed.preferences.analytics);
        setMarketing(parsed.preferences.marketing);
      }
    }
  }, []);

  const saveSettings = (
    newState: "accepted" | "rejected" | "partial" | "withdrawn",
    prefs: CategoryConsentPreferences,
    action: string
  ) => {
    const record: ConsentRecord = {
      consent_id: crypto.randomUUID ? crypto.randomUUID() : `urn:uuid:${Date.now()}`,
      data_principal_id: null,
      policy_version: "1.0.0",
      notice_version: "1.0.0",
      consent_state: newState,
      preferences: prefs,
      timestamp: new Date().toISOString(),
      source: "preference_center",
      affirmative_action: action,
      withdrawn_at: newState === "withdrawn" ? new Date().toISOString() : null
    };

    const serialized = serializeConsentCookie(record);

    if (typeof window !== "undefined") {
      const maxAge = newState === "withdrawn" || newState === "rejected" ? 0 : 180 * 24 * 60 * 60;
      document.cookie = `${CONSENT_COOKIE_NAME}=${encodeURIComponent(serialized)}; path=/; max-age=${maxAge}; SameSite=Lax`;
      localStorage.setItem(CONSENT_COOKIE_NAME, serialized);
      window.dispatchEvent(new CustomEvent("aroh_consent_updated", { detail: record }));
    }

    setState(newState);
    setFunctional(prefs.functional);
    setAnalytics(prefs.analytics);
    setMarketing(prefs.marketing);

    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 4000);
  };

  const handleAcceptAll = () => {
    saveSettings("accepted", { essential: true, functional: true, analytics: true, marketing: true }, "click_accept_all_cookies_page");
  };

  const handleRejectOptional = () => {
    saveSettings("rejected", { essential: true, functional: false, analytics: false, marketing: false }, "click_reject_optional_cookies_page");
  };

  const handleSaveCustom = () => {
    const anyOptional = functional || analytics || marketing;
    const allOptional = functional && analytics && marketing;
    const s = allOptional ? "accepted" : anyOptional ? "partial" : "rejected";
    saveSettings(s, { essential: true, functional, analytics, marketing }, "click_save_custom_cookies_page");
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-slate-900 space-y-10">
      {/* Header */}
      <div className="space-y-4 border-b border-black/10 pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200">
            DPDP Act 2023 • Cookie Inventory
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Pre-Consent Enforcement Active
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Cookie Policy & Preference Center
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
          We believe in honest, transparent cookie practices. We never classify analytics or marketing trackers as "essential". All optional cookies remain blocked until you give affirmative consent.
        </p>
      </div>

      {/* Interactive Preference Center */}
      <div id="manage" className="bg-white border border-black/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-black/5 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Interactive Privacy Preferences</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Current state: <strong className="uppercase font-mono text-sky-700">{mounted ? state : "loading..."}</strong>
            </p>
          </div>
          {savedFeedback && (
            <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold animate-pulse">
              ✓ Preferences updated and saved
            </div>
          )}
        </div>

        <div className="space-y-4">
          {/* Essential */}
          <div className="p-4 rounded-xl border border-black/10 bg-slate-50 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">Strictly Necessary (Essential)</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                  Always Active
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Authentication tokens, CSRF protection, and consent state. Strictly required to deliver core functionality.
              </p>
            </div>
            <input type="checkbox" checked={true} disabled={true} className="mt-1 h-4 w-4 rounded accent-slate-900 cursor-not-allowed opacity-60" />
          </div>

          {/* Functional */}
          <div className="p-4 rounded-xl border border-black/10 bg-white flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">Functional & UI Preferences</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
                  Optional
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Stores your theme and UI flags (e.g. avoiding repeated video intro playback).
              </p>
            </div>
            <input
              type="checkbox"
              checked={functional}
              onChange={(e) => setFunctional(e.target.checked)}
              className="mt-1 h-4 w-4 rounded accent-slate-900 cursor-pointer"
            />
          </div>

          {/* Analytics */}
          <div className="p-4 rounded-xl border border-black/10 bg-white flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">Analytics & Performance</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
                  Optional
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Measures route response latency and error rates. Zero third-party behavioral profiling.
              </p>
            </div>
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
              className="mt-1 h-4 w-4 rounded accent-slate-900 cursor-pointer"
            />
          </div>

          {/* Marketing */}
          <div className="p-4 rounded-xl border border-black/10 bg-white flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">Marketing & Showcase Attribution</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
                  Optional
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Referral attribution when navigating between AROH and registered ecosystem product showcases.
              </p>
            </div>
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
              className="mt-1 h-4 w-4 rounded accent-slate-900 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-black/5">
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
      </div>

      {/* Comprehensive Cookie Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Active Cookie & Storage Inventory</h2>
        <div className="overflow-x-auto border border-black/10 rounded-2xl bg-white">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-black/10 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Name</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Duration</th>
                <th className="p-3.5">Pre-Consent?</th>
                <th className="p-3.5">Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 text-slate-600">
              <tr>
                <td className="p-3.5 font-mono font-semibold text-slate-900">aroh_consent_preferences_v1</td>
                <td className="p-3.5"><span className="px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-700">Essential</span></td>
                <td className="p-3.5">180 days</td>
                <td className="p-3.5 text-emerald-600 font-bold">Yes (Strictly Necessary)</td>
                <td className="p-3.5">Stores user privacy preferences and category consent states.</td>
              </tr>
              <tr>
                <td className="p-3.5 font-mono font-semibold text-slate-900">aroh_token</td>
                <td className="p-3.5"><span className="px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-700">Essential</span></td>
                <td className="p-3.5">Session / 24h</td>
                <td className="p-3.5 text-slate-500">Post-Login Only</td>
                <td className="p-3.5">Cryptographic session token identifying authenticated user session.</td>
              </tr>
              <tr>
                <td className="p-3.5 font-mono font-semibold text-slate-900">aroh_intro_played</td>
                <td className="p-3.5"><span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">Functional</span></td>
                <td className="p-3.5">Session</td>
                <td className="p-3.5 text-rose-600 font-bold">Blocked</td>
                <td className="p-3.5">Prevents repeating video intro on subsequent page visits.</td>
              </tr>
              <tr>
                <td className="p-3.5 font-mono font-semibold text-slate-900">aroh_telemetry_client_id</td>
                <td className="p-3.5"><span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">Analytics</span></td>
                <td className="p-3.5">90 days</td>
                <td className="p-3.5 text-rose-600 font-bold">Blocked</td>
                <td className="p-3.5">Pseudonymized identifier for aggregated route error and latency diagnostics.</td>
              </tr>
              <tr>
                <td className="p-3.5 font-mono font-semibold text-slate-900">aroh_marketing_campaign_ref</td>
                <td className="p-3.5"><span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">Marketing</span></td>
                <td className="p-3.5">30 days</td>
                <td className="p-3.5 text-rose-600 font-bold">Blocked</td>
                <td className="p-3.5">Referral token attribution for partner product showcase navigation.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
