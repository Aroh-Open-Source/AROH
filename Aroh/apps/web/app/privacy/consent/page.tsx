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

export default function ConsentSettingsPage() {
  const [mounted, setMounted] = React.useState(false);
  const [consentRecord, setConsentRecord] = React.useState<{
    state: "unknown" | "accepted" | "rejected" | "partial" | "withdrawn";
    preferences: CategoryConsentPreferences;
    version: string;
    timestamp: string;
  } | null>(null);

  const [feedback, setFeedback] = React.useState<string | null>(null);

  const loadRecord = () => {
    if (typeof window !== "undefined") {
      const match = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${CONSENT_COOKIE_NAME}=`));

      const rawValue = match ? decodeURIComponent(match.split("=")[1]) : localStorage.getItem(CONSENT_COOKIE_NAME);
      const parsed = parseConsentCookie(rawValue ?? undefined);
      setConsentRecord(parsed);
    }
  };

  React.useEffect(() => {
    setMounted(true);
    loadRecord();
  }, []);

  const handleWithdrawAll = () => {
    const record: ConsentRecord = {
      consent_id: crypto.randomUUID ? crypto.randomUUID() : `urn:uuid:${Date.now()}`,
      data_principal_id: null,
      policy_version: "1.0.0",
      notice_version: "1.0.0",
      consent_state: "withdrawn",
      preferences: { essential: true, functional: false, analytics: false, marketing: false },
      timestamp: new Date().toISOString(),
      source: "account_settings",
      affirmative_action: "click_withdraw_all_consent",
      withdrawn_at: new Date().toISOString(),
      withdrawal_method: "one_click_portal_button"
    };

    const serialized = serializeConsentCookie(record);

    if (typeof window !== "undefined") {
      // Purge non-essential cookies
      document.cookie = `${CONSENT_COOKIE_NAME}=${encodeURIComponent(serialized)}; path=/; max-age=0; SameSite=Lax`;
      localStorage.setItem(CONSENT_COOKIE_NAME, serialized);

      // Purge functional session flags
      sessionStorage.removeItem("aroh_intro_played");

      window.dispatchEvent(new CustomEvent("aroh_consent_updated", { detail: record }));
    }

    loadRecord();
    setFeedback("All optional consent has been successfully withdrawn. Optional processing and non-essential cookies have been instantly ceased.");
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-slate-900 space-y-10">
      {/* Header */}
      <div className="space-y-4 border-b border-black/10 pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200">
            DPDP Act 2023 • Section 6(4)
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            One-Click Withdrawal Enabled
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Consent Management & Withdrawal Portal
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
          Under Section 6(4) of the DPDP Act, withdrawal of consent must be as easy to exercise as giving consent. You may inspect your recorded preferences or withdraw consent with a single click below.
        </p>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
          {feedback}
        </div>
      )}

      {/* Active Consent Status Card */}
      <div className="bg-white border border-black/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-black/5 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Your Active Consent State</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Governed by Policy Version: <strong className="font-mono text-slate-700">{mounted && consentRecord ? consentRecord.version : "1.0.0"}</strong>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">State:</span>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-slate-100 text-slate-900 border border-black/10">
              {mounted && consentRecord ? consentRecord.state : "unknown"}
            </span>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-black/10 bg-slate-50 space-y-1">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-900">Strictly Necessary (Essential)</span>
              <span className="text-emerald-700 font-mono">ACTIVE</span>
            </div>
            <p className="text-xs text-slate-500">Security, session integrity, and token authorization.</p>
          </div>

          <div className="p-4 rounded-xl border border-black/10 bg-white space-y-1">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-900">Functional & UI Flags</span>
              <span className={`font-mono ${mounted && consentRecord?.preferences.functional ? "text-emerald-700" : "text-slate-400"}`}>
                {mounted && consentRecord?.preferences.functional ? "CONSENTED" : "DISABLED"}
              </span>
            </div>
            <p className="text-xs text-slate-500">Customizes display and video intro playback preferences.</p>
          </div>

          <div className="p-4 rounded-xl border border-black/10 bg-white space-y-1">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-900">Analytics & Telemetry</span>
              <span className={`font-mono ${mounted && consentRecord?.preferences.analytics ? "text-emerald-700" : "text-slate-400"}`}>
                {mounted && consentRecord?.preferences.analytics ? "CONSENTED" : "DISABLED"}
              </span>
            </div>
            <p className="text-xs text-slate-500">Route latency counters and diagnostic reliability metrics.</p>
          </div>

          <div className="p-4 rounded-xl border border-black/10 bg-white space-y-1">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-900">Marketing & Referral Attribution</span>
              <span className={`font-mono ${mounted && consentRecord?.preferences.marketing ? "text-emerald-700" : "text-slate-400"}`}>
                {mounted && consentRecord?.preferences.marketing ? "CONSENTED" : "DISABLED"}
              </span>
            </div>
            <p className="text-xs text-slate-500">Product showcase partner referral tracking.</p>
          </div>
        </div>

        {/* Withdrawal Section */}
        <div className="pt-4 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            <p>Withdrawal immediately invalidates optional cookies and stops non-essential processing.</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href="/cookies#manage"
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-black/10 transition-colors text-center"
            >
              Adjust Categories
            </Link>
            <button
              type="button"
              onClick={handleWithdrawAll}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
            >
              Withdraw All Optional Consent
            </button>
          </div>
        </div>
      </div>

      {/* Consequences Disclosure */}
      <div className="p-6 rounded-2xl border border-black/10 bg-white space-y-3 text-xs leading-relaxed text-slate-600">
        <h3 className="font-bold text-sm text-slate-900">Material Consequences of Consent Withdrawal</h3>
        <p>
          Pursuant to Section 6(4) of the DPDP Act, withdrawing your consent does not affect the lawfulness of any data processing conducted prior to the withdrawal. You will continue to have full access to authenticated platform features (such as your Aros Wallet, CMS announcements, and account security). Only optional personalisations, telemetry, and showcase tracking are discontinued.
        </p>
        <p>
          If you wish to completely delete your account and all associated personal data, please visit our <Link href="/privacy/rights#erasure" className="text-sky-600 font-bold hover:underline">Account Erasure Portal</Link>.
        </p>
      </div>
    </div>
  );
}
