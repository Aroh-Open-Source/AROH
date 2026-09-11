import * as React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | AROH Platform",
  description: "Terms and conditions governing use of the AROH Platform, independent product spokes, and Aros economy.",
};

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-slate-900 space-y-10">
      <div className="space-y-4 border-b border-black/10 pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-800 border border-black/10">
            Platform Governance Contract
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Status: LEGAL_REVIEW_REQUIRED
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Terms of Service
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
          These Terms govern access to and usage of the AROH Open Source Platform, developer APIs, shared design tokens, and the Aros in-platform economy.
        </p>
        <div className="flex flex-wrap gap-4 text-xs text-slate-500 font-mono pt-2">
          <span>Version: 1.0.0</span>
          <span>•</span>
          <span>Effective: 2026-09-11</span>
          <span>•</span>
          <span>Governing Law: Republic of India</span>
        </div>
      </div>

      <div className="space-y-8 text-sm leading-relaxed text-slate-700">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">1. Acceptance & Age Assurance</h2>
          <p>
            By accessing or creating an account on the Platform, you represent and warrant that you are at least <strong>18 years of age</strong> and have the full legal capacity to enter into a binding agreement under the Indian Contract Act, 1872. Minors under 18 may only use public educational demos under direct parental supervision. Autonomous registration by minors is strictly prohibited.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">2. Ecosystem Architecture & Independent Spokes</h2>
          <p>
            AROH operates as a decoupled platform hub. Flagship products featured in the AROH Showcase (such as <em>OmniStream</em>, <em>SpeDex</em>, <em>Nebula</em>, <em>Music Mirror</em>, and <em>JavaPath Pro</em>) are autonomous products with their own standalone repositories, build pipelines, and distinct license terms. Visiting external product links directs you to independent applications governed by their specific terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">3. Aros Utility Tokens</h2>
          <p>
            "Aros" tokens are closed-loop, non-monetary in-platform utility reward points used exclusively for membership tier unlocks, simulation, and platform feature access. Aros tokens possess <strong>zero cash value</strong>, cannot be redeemed for fiat currency, cannot be transferred peer-to-peer, and do not constitute stored value or prepaid instruments under Reserve Bank of India regulations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">4. Artificial Intelligence Outputs</h2>
          <p>
            AI completions provided in the developer portal are generated probabilistically for developer productivity. AROH makes no warranty regarding the accuracy, completeness, or safety of generated code snippets. You are solely responsible for compiling, testing, and verifying all AI outputs prior to deployment.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">5. Limitation of Liability & Statutory Privacy Rights</h2>
          <p>
            Nothing in these Terms shall limit or exclude any statutory rights that cannot be disclaimed under applicable law, including non-excludable Data Principal rights and remedies under the Digital Personal Data Protection Act, 2023. In all other cases, AROH's aggregate liability shall not exceed the fees paid by you in the preceding 12 months or INR 1,000.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">6. Dispute Resolution & Jurisdiction</h2>
          <p>
            These Terms shall be governed by the laws of the Republic of India. Unresolved disputes shall be referred to arbitration in <strong>New Delhi, India</strong> under the Indian Arbitration and Conciliation Act, 1996, with court proceedings subject to the exclusive jurisdiction of courts in New Delhi.
          </p>
        </section>

        <div className="pt-4 border-t border-black/5 flex items-center justify-between text-xs text-slate-500">
          <span>Read our full legal suite:</span>
          <div className="flex items-center gap-3">
            <Link href="/privacy" className="text-sky-600 hover:underline">Privacy Notice</Link>
            <span>•</span>
            <Link href="/acceptable-use" className="text-sky-600 hover:underline">Acceptable Use</Link>
            <span>•</span>
            <Link href="/cookies" className="text-sky-600 hover:underline">Cookies</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
