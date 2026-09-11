import * as React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Retention Schedule | AROH Platform",
  description: "Purpose-based data retention periods and statutory deletion cascade under DPDP Act 2023 Section 8(7).",
};

export default function RetentionSchedulePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-slate-900 space-y-10">
      <div className="space-y-4 border-b border-black/10 pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200">
            DPDP Act 2023 • Section 8(7)
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-slate-100 text-slate-800 border border-black/10">
            Purpose-Based Deletion
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Data Retention & Deletion Schedule
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
          AROH rejects indefinite retention of personal data. Data is retained only as long as necessary to fulfill the specified purpose, after which it is permanently purged or cryptographically anonymized.
        </p>
      </div>

      <div className="space-y-8 text-sm leading-relaxed text-slate-700">
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Master Retention Matrix</h2>
          <div className="overflow-x-auto border border-black/10 rounded-2xl bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-black/10 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Retention Trigger</th>
                  <th className="p-3.5">Standard Duration</th>
                  <th className="p-3.5">Action on Expiry</th>
                  <th className="p-3.5">Justification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-slate-600">
                <tr>
                  <td className="p-3.5 font-bold text-slate-900">Account Credentials</td>
                  <td className="p-3.5">Account deletion</td>
                  <td className="p-3.5">Immediate (0 days)</td>
                  <td className="p-3.5 text-rose-600 font-bold">Hard Purge</td>
                  <td className="p-3.5">Right to erasure under DPDP Act Sec 12</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-900">Profile Attributes</td>
                  <td className="p-3.5">Account deletion</td>
                  <td className="p-3.5">Immediate (0 days)</td>
                  <td className="p-3.5 text-rose-600 font-bold">Hard Purge</td>
                  <td className="p-3.5">Purpose fulfilled upon account closure</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-900">Aros Ledger Records</td>
                  <td className="p-3.5">Transaction date</td>
                  <td className="p-3.5">7 years</td>
                  <td className="p-3.5 text-amber-700 font-bold">Pseudonymization</td>
                  <td className="p-3.5">Statutory accounting & tax compliance in India</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-900">AI Inference Prompts</td>
                  <td className="p-3.5">HTTP stream end</td>
                  <td className="p-3.5">0 days (ephemeral)</td>
                  <td className="p-3.5 text-emerald-600 font-bold">Memory Release</td>
                  <td className="p-3.5">Stateless architecture; zero persistence</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-900">Consent Audit Logs</td>
                  <td className="p-3.5">Consent recorded</td>
                  <td className="p-3.5">3 years post-closure</td>
                  <td className="p-3.5 text-amber-700 font-bold">Anonymization</td>
                  <td className="p-3.5">Accountability defense before DPB</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-900">Edge Web Logs</td>
                  <td className="p-3.5">Request timestamp</td>
                  <td className="p-3.5">30 days rolling</td>
                  <td className="p-3.5 text-slate-500 font-bold">Automated TTL</td>
                  <td className="p-3.5">System security & DDoS defense</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div className="pt-4 border-t border-black/5 flex items-center justify-between text-xs text-slate-500">
          <span>Need to exercise your erasure rights?</span>
          <Link href="/privacy/rights#erasure" className="text-sky-600 font-bold hover:underline">
            Go to Account Deletion Portal →
          </Link>
        </div>
      </div>
    </div>
  );
}
