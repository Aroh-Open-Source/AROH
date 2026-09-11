import * as React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acceptable Use Policy | AROH Platform",
  description: "Rules, security constraints, and developer standards for the AROH Platform.",
};

export default function AcceptableUsePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-slate-900 space-y-10">
      <div className="space-y-4 border-b border-black/10 pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-800 border border-black/10">
            Security & Operational Standards
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Status: LEGAL_REVIEW_REQUIRED
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Acceptable Use Policy
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
          Defines mandatory rules, security boundaries, and developer constraints governing all users, SDK consumers, and automated clients interacting with the AROH ecosystem.
        </p>
      </div>

      <div className="space-y-8 text-sm leading-relaxed text-slate-700">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">1. Infrastructure & Security Protections</h2>
          <p>
            Users and developers are strictly prohibited from attempting to compromise platform security, probe unauthenticated endpoints, bypass HMAC signature verifications, or forge transactions in the Aros Token Ledger.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
            <li>No automated penetration testing without prior authorization from `security@aroh.in`.</li>
            <li>No credential stuffing, session hijacking, or cross-tab storage tampering.</li>
            <li>No distributed denial-of-service (DDoS) simulations or brute-forcing.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">2. Spoke Adapter Invariants</h2>
          <p>
            Developers building bespoke integrations via `@aroh/asdk` must respect the absolute read-only boundary of the <code>Products/</code> directory. Custom adapters must fail-closed and adhere to the deterministic exit codes (0–7) codified in AROH governance specifications.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">3. Artificial Intelligence Standards</h2>
          <p>
            When utilizing the AI Developer Portal, you shall not submit third-party confidential credentials, personal data without consent, exploit payloads, or content violating the Information Technology Act, 2000.
          </p>
        </section>

        <div className="pt-4 border-t border-black/5 flex items-center justify-between text-xs text-slate-500">
          <span>Related governance documents:</span>
          <div className="flex items-center gap-3">
            <Link href="/terms" className="text-sky-600 hover:underline">Terms of Service</Link>
            <span>•</span>
            <Link href="/privacy" className="text-sky-600 hover:underline">Privacy Notice</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
