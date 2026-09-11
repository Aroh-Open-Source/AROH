import * as React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Security & Breach Protocol | AROH Platform",
  description: "Technical safeguards and 9-stage data breach incident response protocol under DPDP Act 2023 & DPDP Rules 2025.",
};

export default function PrivacySecurityPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-slate-900 space-y-10">
      <div className="space-y-4 border-b border-black/10 pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200">
            DPDP Act 2023 • Section 8(5) & 8(6)
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Rule 10 Breach Ready
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Data Security & Incident Response
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
          Technical safeguards, cryptographic controls, and the operational 9-stage incident response workflow protecting personal data across the AROH ecosystem.
        </p>
      </div>

      <div className="space-y-8 text-sm leading-relaxed text-slate-700">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">1. Reasonable Security Safeguards (Section 8(5))</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-black/10 bg-white space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">Cryptographic Defense</h3>
              <p className="text-slate-600">
                All communications over public networks are encrypted with <strong>TLS 1.3</strong>. Databases in Cloud Firestore are encrypted at-rest with <strong>AES-256</strong>. Password hashes utilize salted one-way key derivation via Firebase Auth.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-black/10 bg-white space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">Access Control & RBAC</h3>
              <p className="text-slate-600">
                Strict least-privilege role separation (user, operator, admin). Server routes enforce cryptographic token validation. Support personnel cannot inspect raw credentials.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">2. Personal Data Breach Lifecycle (9 Stages)</h2>
          <p className="text-xs text-slate-600">
            Under Section 8(6) of the DPDP Act and Rule 10 of the DPDP Rules, 2025, AROH operationalizes an automated 9-stage incident response plan:
          </p>

          <div className="p-5 rounded-2xl border border-black/10 bg-white space-y-3 text-xs font-mono">
            <div className="flex flex-wrap items-center gap-2 text-slate-800">
              <span className="px-2.5 py-1 rounded bg-slate-100 font-bold">1. DETECTED</span> →
              <span className="px-2.5 py-1 rounded bg-slate-100 font-bold">2. TRIAGED</span> →
              <span className="px-2.5 py-1 rounded bg-slate-100 font-bold">3. CONFIRMED</span> →
              <span className="px-2.5 py-1 rounded bg-rose-50 text-rose-700 border border-rose-200 font-bold">4. CONTAINED</span> →
              <span className="px-2.5 py-1 rounded bg-slate-100 font-bold">5. ASSESSED</span> →
              <span className="px-2.5 py-1 rounded bg-amber-50 text-amber-700 border border-amber-200 font-bold">6. NOTIF_REQ</span> →
              <span className="px-2.5 py-1 rounded bg-sky-50 text-sky-700 border border-sky-200 font-bold">7. NOTIFIED</span> →
              <span className="px-2.5 py-1 rounded bg-slate-100 font-bold">8. REMEDIATED</span> →
              <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">9. CLOSED</span>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <p><strong>Notification to Board:</strong> Comprehensive statutory report transmitted to the Data Protection Board of India detailing the nature of the breach, affected systems, and mitigation steps taken.</p>
            <p><strong>Notification to Affected Data Principals:</strong> Individual notifications transmitted in clear, plain language detailing the breach, potential risks, remedial actions taken, and advice on protective measures.</p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">3. Responsible Vulnerability Disclosure</h2>
          <p className="text-xs text-slate-600">
            If you identify a potential security issue or vulnerability, please email our Security Incident Response Team immediately at <a href="mailto:security@aroh.in" className="text-sky-600 underline">security@aroh.in</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
