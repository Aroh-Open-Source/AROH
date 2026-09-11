import * as React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Privacy Notice | AROH Platform",
  description: "Disclosures regarding artificial intelligence processing, zero prompt training, and data flows.",
};

export default function AIPrivacyNoticePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-slate-900 space-y-10">
      <div className="space-y-4 border-b border-black/10 pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200">
            DPDP Act 2023 • AI Governance
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Zero Model Training Guarantee
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Artificial Intelligence Privacy Notice
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
          AROH incorporates developer-focused AI orchestration. This notice outlines how your code queries, prompts, and completions are processed with zero persistent training retention.
        </p>
      </div>

      <div className="space-y-8 text-sm leading-relaxed text-slate-700">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">1. Stateless Execution Architecture</h2>
          <p>
            When you interact with the AI Developer Portal (<code>/ai</code>), your prompt text and diagnostic context are transmitted to the server purely to generate the immediate HTTP completion stream.
          </p>
          <div className="bg-white p-5 rounded-2xl border border-black/10 space-y-2 text-xs">
            <p><strong>Zero Model Training:</strong> Your prompts and code snippets are <strong>never used to train, retrain, or improve</strong> machine learning models.</p>
            <p><strong>Zero Persistent Storage:</strong> AROH does not retain prompt logs in production databases. Ephemeral memory buffers are garbage-collected upon stream termination.</p>
            <p><strong>Default Provider:</strong> Development environments default to a local deterministic mock orchestrator (<code>MockAIProvider</code>) that never leaves your machine.</p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">2. Third-Party Commercial Model Providers</h2>
          <p className="text-xs text-slate-600">
            When third-party providers (OpenAI, Anthropic, or Google Gemini) are explicitly configured in production:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
            <li>AROH only connects to commercial enterprise API endpoints governed by strict zero-data-retention agreements.</li>
            <li>Prompts are transmitted securely over TLS 1.3 to US or EU cloud data clusters for inference only.</li>
            <li>No human review of prompt content is conducted by AROH personnel.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">3. User Responsibilities</h2>
          <p className="text-xs text-slate-600">
            Do not input third-party sensitive personal data (e.g. passwords, national identifiers, health records) into AI conversational inputs. For additional details, please review our <Link href="/acceptable-use" className="text-sky-600 underline">Acceptable Use Policy</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
