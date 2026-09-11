"use client";

import * as React from "react";
import Link from "next/link";

export default function GrievanceRedressalPage() {
  const [email, setEmail] = React.useState("");
  const [category, setCategory] = React.useState("consent_violation");
  const [subject, setSubject] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [ticketResult, setTicketResult] = React.useState<{ ticket_id: string; statutory_deadline: string } | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/privacy/grievance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          complainant_identifier: email,
          category,
          subject,
          description
        })
      });

      const data = await res.json();
      if (res.ok) {
        setTicketResult({
          ticket_id: data.ticket_id,
          statutory_deadline: data.statutory_deadline_date || "Within 30-90 days"
        });
        setSubject("");
        setDescription("");
      } else {
        setError(data.error || "Failed to submit grievance. Please try again.");
      }
    } catch {
      setError("Network error. Please try again or email grievance@aroh.in directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-slate-900 space-y-10">
      {/* Header */}
      <div className="space-y-4 border-b border-black/10 pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
            DPDP Act 2023 • Section 13
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-slate-100 text-slate-800 border border-black/10">
            Statutory Resolution Mechanism
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Grievance Redressal Portal
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
          Pursuant to Section 13 of the Digital Personal Data Protection Act, 2023 and Rule 14 of the DPDP Rules, 2025, Data Principals may lodge formal complaints regarding personal data processing.
        </p>
      </div>

      {/* Statutory Officer Details */}
      <div className="bg-white border border-black/10 rounded-2xl p-6 space-y-3 shadow-sm text-xs">
        <h2 className="text-sm font-bold text-slate-900">Designated Grievance Redressal Officer</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-600">
          <div>
            <p><strong>Officer Name:</strong> [GRIEVANCE_OFFICER_NAME_PENDING_CONFIRMATION]</p>
            <p><strong>Designation:</strong> Statutory Grievance Redressal Officer</p>
            <p><strong>Official Email:</strong> <a href="mailto:grievance@aroh.in" className="text-sky-600 hover:underline">grievance@aroh.in</a></p>
          </div>
          <div>
            <p><strong>Statutory SLA:</strong> Acknowledged within 24 hours; resolved within 30 days</p>
            <p><strong>Maximum Rule Timeline:</strong> 90 days statutory cap</p>
            <p><strong>Appellate Body:</strong> Data Protection Board of India</p>
          </div>
        </div>
      </div>

      {ticketResult ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[10px] font-bold">✓</span>
            <h2 className="text-base font-bold text-emerald-900">Grievance Ticket Formally Recorded</h2>
          </div>
          <p className="text-xs text-emerald-800 leading-relaxed">
            Your grievance has been logged in the tamper-evident audit ledger. Our Grievance Officer will examine the logs and issue a formal written finding.
          </p>
          <div className="p-4 rounded-xl bg-white border border-emerald-200 font-mono text-xs space-y-1 text-slate-800">
            <p><strong>Ticket Reference ID:</strong> {ticketResult.ticket_id}</p>
            <p><strong>Statutory Resolution Deadline:</strong> {ticketResult.statutory_deadline}</p>
          </div>
          <button
            type="button"
            onClick={() => setTicketResult(null)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 transition-colors"
          >
            Submit Another Inquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-black/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Lodge a Formal Grievance</h2>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              {error}
            </div>
          )}

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Your Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full p-3 rounded-xl border border-black/10 focus:outline-sky-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Grievance Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 rounded-xl border border-black/10 focus:outline-sky-500 bg-white"
              >
                <option value="consent_violation">Consent Violation / Withdrawal Non-Compliance</option>
                <option value="unauthorized_processing">Unauthorized or Excess Data Processing</option>
                <option value="rights_denial">Improper Denial or Delay in Exercising Data Rights</option>
                <option value="data_breach_concern">Potential Security Incident or Personal Data Breach</option>
                <option value="inaccurate_data">Failure to Rectify Inaccurate Personal Data</option>
                <option value="other_statutory_grievance">Other Statutory DPDP Violation</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Subject / Summary</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of the issue..."
                className="w-full p-3 rounded-xl border border-black/10 focus:outline-sky-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Comprehensive Description of Grievance</label>
              <textarea
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the sequence of events, affected data, timestamps, and requested redressal..."
                className="w-full p-3 rounded-xl border border-black/10 focus:outline-sky-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50"
            >
              {submitting ? "Transmitting Ticket..." : "Submit Grievance to Officer"}
            </button>
          </div>
        </form>
      )}

      {/* Escalation Disclosure */}
      <div className="p-6 rounded-2xl border border-black/10 bg-slate-50 space-y-2 text-xs text-slate-600 leading-relaxed">
        <h3 className="font-bold text-slate-900">Right of Escalation to the Data Protection Board of India</h3>
        <p>
          If AROH fails to resolve your grievance within the statutory timeline (not exceeding 90 days), or if you find the resolution unsatisfactory, you have the statutory right under Section 13(3) of the DPDP Act to file a complaint before the Data Protection Board of India.
        </p>
      </div>
    </div>
  );
}
