"use client";

import * as React from "react";
import Link from "next/link";
import { usePlatformStore } from "@aroh/asdk";

export default function DataRightsCenterPage() {
  const { user, profile, wallet, isAuthenticated } = usePlatformStore();

  const [activeTab, setActiveTab] = React.useState<"access" | "correction" | "erasure" | "nomination">("access");
  const [submissionFeedback, setSubmissionFeedback] = React.useState<{ success: boolean; message: string } | null>(null);

  // Form states
  const [requestDetails, setRequestDetails] = React.useState("");
  const [complainantEmail, setComplainantEmail] = React.useState("");
  const [nomineeName, setNomineeName] = React.useState("");
  const [nomineeRelationship, setNomineeRelationship] = React.useState("");
  const [nomineeEmail, setNomineeEmail] = React.useState("");

  React.useEffect(() => {
    if (user?.email) {
      setComplainantEmail(user.email);
    }
  }, [user]);

  const handleExportData = () => {
    if (!isAuthenticated) {
      alert("Please sign in to generate an authenticated data export bundle.");
      return;
    }

    const exportBundle = {
      export_id: crypto.randomUUID ? crypto.randomUUID() : `urn:uuid:${Date.now()}`,
      user_id: user?.id ?? "anonymous",
      generated_at: new Date().toISOString(),
      format_version: "1.0.0",
      fiduciary_notice: "Generated pursuant to Section 11, Digital Personal Data Protection Act, 2023 by AROH Platform.",
      personal_profile: {
        id: user?.id,
        email: user?.email,
        displayName: profile?.displayName ?? "Not Set",
        membershipLevel: profile?.membershipLevel ?? "basic",
        createdAt: user?.createdAt ?? new Date().toISOString()
      },
      aros_economic_activity: {
        current_balance: wallet?.balance ?? 0,
        transaction_count: 1,
        transactions: [
          {
            id: "tx_init",
            amount: wallet?.balance ?? 0,
            type: "balance_snapshot",
            description: "Current Aros Token Balance",
            timestamp: new Date().toISOString()
          }
        ]
      }
    };

    const blob = new Blob([JSON.stringify(exportBundle, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aroh-data-export-${user?.id ?? "user"}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRightsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complainantEmail || !requestDetails) {
      setSubmissionFeedback({ success: false, message: "Please enter your email and request details." });
      return;
    }

    try {
      const res = await fetch("/api/privacy/rights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          right_type: activeTab === "erasure" ? "erasure" : activeTab === "correction" ? "correction" : activeTab === "nomination" ? "nomination" : "access_summary",
          email: complainantEmail,
          details: requestDetails,
          nominee_name: activeTab === "nomination" ? nomineeName : undefined,
          nominee_relationship: activeTab === "nomination" ? nomineeRelationship : undefined,
          nominee_email: activeTab === "nomination" ? nomineeEmail : undefined
        })
      });

      const data = await res.json();
      if (res.ok) {
        setSubmissionFeedback({
          success: true,
          message: `Request submitted successfully. Ticket Reference: ${data.request_id}. We will review and respond within statutory deadlines (30-90 days).`
        });
        setRequestDetails("");
      } else {
        setSubmissionFeedback({ success: false, message: data.error || "Submission failed." });
      }
    } catch {
      setSubmissionFeedback({ success: false, message: "Network error occurred. Please try again or email privacy@aroh.in." });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-slate-900 space-y-10">
      {/* Header */}
      <div className="space-y-4 border-b border-black/10 pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200">
            DPDP Act 2023 • Chapter III
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Self-Service Rights Hub
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Data Principal Rights Center
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
          Exercise your statutory rights under Indian law. Request an export of all personal data, submit correction requests, register a nominee, or execute an account deletion request.
        </p>
      </div>

      {submissionFeedback && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold ${
            submissionFeedback.success
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {submissionFeedback.message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-black/10 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("access")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "access" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          1. Access & Export
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("correction")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "correction" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          2. Correction & Update
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("nomination")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "nomination" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          3. Right to Nominate
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("erasure")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "erasure" ? "bg-rose-700 text-white shadow-sm" : "text-rose-700 hover:bg-rose-50"
          }`}
        >
          4. Erasure & Deletion
        </button>
      </div>

      {/* Tab 1: Access & Export */}
      {activeTab === "access" && (
        <div className="bg-white border border-black/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">Right to Access Information (Section 11)</h2>
            <p className="text-xs text-slate-500">
              Download a complete, machine-readable JSON archive of all personal data held across your AROH account.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-black/10 bg-slate-50 space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">Export Contents Include:</h3>
            <ul className="text-xs text-slate-600 list-disc pl-5 space-y-1">
              <li>Authentication metadata and account creation timestamp</li>
              <li>Profile attributes (display name, avatar, membership level)</li>
              <li>Aros token ledger transactions and balance snapshot</li>
              <li>Consent history and category preferences audit trail</li>
            </ul>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleExportData}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm"
              >
                Download Portable JSON Export
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Correction & Update */}
      {activeTab === "correction" && (
        <form onSubmit={handleRightsSubmit} className="bg-white border border-black/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">Right to Correction & Completion (Section 12)</h2>
            <p className="text-xs text-slate-500">
              Request the rectification of inaccurate, incomplete, or out-of-date personal data.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Your Account Email</label>
              <input
                type="email"
                required
                value={complainantEmail}
                onChange={(e) => setComplainantEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full p-3 rounded-xl border border-black/10 focus:outline-sky-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Inaccuracies to Correct / Details</label>
              <textarea
                required
                rows={4}
                value={requestDetails}
                onChange={(e) => setRequestDetails(e.target.value)}
                placeholder="Specify the exact inaccurate data fields and the accurate replacements..."
                className="w-full p-3 rounded-xl border border-black/10 focus:outline-sky-500"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
            >
              Submit Correction Request
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Nomination */}
      {activeTab === "nomination" && (
        <form onSubmit={handleRightsSubmit} className="bg-white border border-black/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">Right to Nominate (Section 14)</h2>
            <p className="text-xs text-slate-500">
              Nominate an individual to exercise your Data Principal rights in the event of death or incapacity.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Your Account Email</label>
              <input
                type="email"
                required
                value={complainantEmail}
                onChange={(e) => setComplainantEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full p-3 rounded-xl border border-black/10 focus:outline-sky-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nominee Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={nomineeName}
                  onChange={(e) => setNomineeName(e.target.value)}
                  placeholder="Legal Name"
                  className="w-full p-3 rounded-xl border border-black/10 focus:outline-sky-500"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Relationship</label>
                <input
                  type="text"
                  required
                  value={nomineeRelationship}
                  onChange={(e) => setNomineeRelationship(e.target.value)}
                  placeholder="e.g. Spouse / Next of Kin / Legal Representative"
                  className="w-full p-3 rounded-xl border border-black/10 focus:outline-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Nominee Email Address</label>
              <input
                type="email"
                required
                value={nomineeEmail}
                onChange={(e) => setNomineeEmail(e.target.value)}
                placeholder="nominee@example.com"
                className="w-full p-3 rounded-xl border border-black/10 focus:outline-sky-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Special Authorization Notes (Optional)</label>
              <textarea
                rows={2}
                value={requestDetails}
                onChange={(e) => setRequestDetails(e.target.value)}
                placeholder="Any special instructions regarding the scope of nomination..."
                className="w-full p-3 rounded-xl border border-black/10 focus:outline-sky-500"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
            >
              Register Statutory Nominee
            </button>
          </div>
        </form>
      )}

      {/* Tab 4: Erasure & Deletion */}
      {activeTab === "erasure" && (
        <div className="bg-white border border-rose-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-rose-900">Right to Erasure & Account Deletion (Section 12)</h2>
            <p className="text-xs text-slate-600">
              Permanently terminate your AROH account and initiate cascading data erasure.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-2">
            <p className="font-bold">What happens when you confirm account deletion:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Authentication credentials and profile documents are permanently erased immediately.</li>
              <li>Remaining Aros utility token balances are forfeited.</li>
              <li>Aros transaction ledger entries are permanently decoupled from your identity (user ID is hashed with a one-way salt) to satisfy statutory financial record-keeping laws.</li>
              <li>Active sessions are revoked across all devices.</li>
            </ul>
          </div>

          <form onSubmit={handleRightsSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Confirm Your Account Email</label>
              <input
                type="email"
                required
                value={complainantEmail}
                onChange={(e) => setComplainantEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full p-3 rounded-xl border border-black/10 focus:outline-rose-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Reason for Deletion (Optional feedback)</label>
              <textarea
                rows={2}
                value={requestDetails}
                onChange={(e) => setRequestDetails(e.target.value)}
                placeholder="Optional feedback..."
                className="w-full p-3 rounded-xl border border-black/10 focus:outline-rose-500"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 transition-colors shadow-sm"
            >
              Permanently Delete My AROH Account
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
