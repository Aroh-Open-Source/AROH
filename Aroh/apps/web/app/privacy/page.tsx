import * as React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Notice | AROH Platform",
  description: "Comprehensive itemized privacy notice under Section 5 of the Digital Personal Data Protection Act, 2023.",
};

export default function PrivacyNoticePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-slate-900 space-y-10">
      {/* Header */}
      <div className="space-y-4 border-b border-black/10 pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200">
            DPDP Act 2023 • Section 5 Notice
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Status: LEGAL_REVIEW_REQUIRED
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          AROH Privacy Notice
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
          This Notice provides transparent, plain-language disclosures regarding the personal data we process, our purposes, retention schedules, and how you can exercise your statutory rights as a Data Principal.
        </p>
        <div className="flex flex-wrap gap-4 text-xs text-slate-500 font-mono pt-2">
          <span>Version: 1.0.0</span>
          <span>•</span>
          <span>Effective: 2026-09-11</span>
          <span>•</span>
          <span>Data Fiduciary: [AROH_LEGAL_ENTITY_NAME]</span>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
        <Link
          href="/privacy/consent"
          className="p-4 rounded-xl border border-black/10 bg-white hover:border-sky-300 hover:shadow-sm transition-all block space-y-1.5"
        >
          <div className="font-bold text-slate-900 flex items-center justify-between">
            <span>Consent & Withdrawal</span>
            <span className="text-sky-600">→</span>
          </div>
          <p className="text-slate-500">Manage or withdraw your optional consent preferences at any time.</p>
        </Link>

        <Link
          href="/privacy/rights"
          className="p-4 rounded-xl border border-black/10 bg-white hover:border-sky-300 hover:shadow-sm transition-all block space-y-1.5"
        >
          <div className="font-bold text-slate-900 flex items-center justify-between">
            <span>Data Rights Center</span>
            <span className="text-sky-600">→</span>
          </div>
          <p className="text-slate-500">Exercise statutory rights: access summary, correction, erasure, and nomination.</p>
        </Link>

        <Link
          href="/privacy/grievance"
          className="p-4 rounded-xl border border-black/10 bg-white hover:border-sky-300 hover:shadow-sm transition-all block space-y-1.5"
        >
          <div className="font-bold text-slate-900 flex items-center justify-between">
            <span>Grievance Redressal</span>
            <span className="text-rose-600">→</span>
          </div>
          <p className="text-slate-500">Submit a formal complaint to our statutory Grievance Officer.</p>
        </Link>
      </div>

      {/* Main Notice Body */}
      <div className="space-y-8 text-sm leading-relaxed text-slate-700">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">1. Data Fiduciary Identity</h2>
          <p>
            Under the Digital Personal Data Protection Act, 2023, the <strong>Data Fiduciary</strong> determining the purpose and means of personal data processing on the AROH platform is:
          </p>
          <div className="bg-white p-5 rounded-2xl border border-black/10 space-y-2 text-xs">
            <p><strong>Fiduciary Name:</strong> [AROH_LEGAL_ENTITY_NAME] (Corporate entity pending confirmation)</p>
            <p><strong>Official Contact Email:</strong> <a href="mailto:privacy@aroh.in" className="text-sky-600 hover:underline">privacy@aroh.in</a></p>
            <p><strong>Grievance Desk:</strong> <a href="mailto:grievance@aroh.in" className="text-sky-600 hover:underline">grievance@aroh.in</a></p>
            <p><strong>Registered Address:</strong> [REGISTERED_OFFICE_ADDRESS_PENDING_CONFIRMATION]</p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">2. Itemized Personal Data We Collect & Specific Purposes</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-black/10 bg-white space-y-2">
              <h3 className="font-bold text-slate-900 text-base">A. Authentication & Account Credentials</h3>
              <p className="text-xs text-slate-600">
                <strong>Data Collected:</strong> Email address, cryptographically hashed passwords, account UID, assigned role (user/admin), creation timestamp.
              </p>
              <p className="text-xs text-slate-600">
                <strong>Purpose:</strong> Authenticating user identity, granting secure access, issuing HMAC session tokens, and preventing account takeover.
              </p>
              <p className="text-xs text-slate-600">
                <strong>Lawful Basis:</strong> Free, specific, and affirmative consent (DPDP Act Sec 6) and contractual necessity.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-black/10 bg-white space-y-2">
              <h3 className="font-bold text-slate-900 text-base">B. Profile Information & Membership Tier</h3>
              <p className="text-xs text-slate-600">
                <strong>Data Collected:</strong> Display name, optional avatar URL, membership level (basic/pro/enterprise).
              </p>
              <p className="text-xs text-slate-600">
                <strong>Purpose:</strong> Personalising platform display and granting tier-specific feature entitlements.
              </p>
              <p className="text-xs text-slate-600">
                <strong>Lawful Basis:</strong> Consent (Sec 6). Optional; default placeholders applied if omitted.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-black/10 bg-white space-y-2">
              <h3 className="font-bold text-slate-900 text-base">C. Aros Wallet & Economic Transaction Ledger</h3>
              <p className="text-xs text-slate-600">
                <strong>Data Collected:</strong> User ID, token balance, transaction amounts, reward categories, and event timestamps.
              </p>
              <p className="text-xs text-slate-600">
                <strong>Purpose:</strong> Maintaining an immutable financial ledger, preventing token forgery, and verifying reward legitimacy.
              </p>
              <p className="text-xs text-slate-600">
                <strong>Lawful Basis:</strong> Contractual fulfillment and legitimate security/accounting uses (Sec 7).
              </p>
            </div>

            <div className="p-4 rounded-xl border border-black/10 bg-white space-y-2">
              <h3 className="font-bold text-slate-900 text-base">D. Artificial Intelligence Prompts</h3>
              <p className="text-xs text-slate-600">
                <strong>Data Collected:</strong> Prompt queries, diagnostic code snippets, and conversational session tokens.
              </p>
              <p className="text-xs text-slate-600">
                <strong>Purpose:</strong> Generating developer code explanations and architectural diagnostics in the AI portal.
              </p>
              <p className="text-xs text-slate-600">
                <strong>Retention Standard:</strong> <strong>Stateless.</strong> Prompts are held in server memory only during the active HTTP streaming session and are never retained or used to train models. See our <Link href="/privacy/ai" className="text-sky-600 hover:underline">AI Privacy Notice</Link>.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-black/10 bg-white space-y-2">
              <h3 className="font-bold text-slate-900 text-base">E. Technical Diagnostic & Telemetry Logs</h3>
              <p className="text-xs text-slate-600">
                <strong>Data Collected:</strong> IP address, user-agent, route latency, and edge network error codes.
              </p>
              <p className="text-xs text-slate-600">
                <strong>Purpose:</strong> Ensuring system availability, mitigating DDoS attacks, and edge routing.
              </p>
              <p className="text-xs text-slate-600">
                <strong>Retention:</strong> Rolling 30-day window on edge CDN servers.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">3. Third-Party Data Processors</h2>
          <p>
            We engage verified infrastructure partners bound by strict Data Processing Addenda (DPAs):
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
            <li><strong>Google LLC (Firebase & GCP):</strong> Authentication, database persistence, and cloud storage.</li>
            <li><strong>Vercel Inc.:</strong> Next.js edge routing, serverless execution, and global CDN asset delivery.</li>
            <li><strong>Commercial AI Providers (when enabled):</strong> Stateless LLM inference execution with contractual zero-training guarantees.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">4. Cross-Border Transfers</h2>
          <p>
            Personal data may be processed on secure cloud servers located outside of India (such as Google Cloud Platform and Vercel infrastructure in the United States or Asia-Pacific regions). Such transfers comply with Section 16 of the DPDP Act and are protected by TLS 1.3 in-transit and AES-256 encryption at-rest.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">5. Exercise Your Statutory Rights</h2>
          <p>
            Under Chapter III of the DPDP Act, you have the right to request access, correction, completion, updating, erasure, and nomination. You can also withdraw consent at any time without adverse consequences.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/privacy/rights"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
            >
              Open Data Rights Portal
            </Link>
            <Link
              href="/privacy/consent"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-black/10 transition-colors"
            >
              Consent & Cookie Settings
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
