"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@aroh/ads";
import {
  usePlatformStore,
  Organization,
  OrganizationMember,
  TeamWallet,
  TeamWalletTransaction,
  TeamWalletService,
  EnterpriseDirectoryService
} from "@aroh/asdk";

export default function OrganizationDashboardPage() {
  const { user } = usePlatformStore();
  const [org, setOrg] = React.useState<Organization | null>(null);
  const [wallet, setWallet] = React.useState<TeamWallet | null>(null);
  const [members, setMembers] = React.useState<OrganizationMember[]>([]);
  const [transactions, setTransactions] = React.useState<TeamWalletTransaction[]>([]);

  // Add member modal state
  const [showAddMember, setShowAddMember] = React.useState(false);
  const [newEmail, setNewEmail] = React.useState("");
  const [newRole, setNewRole] = React.useState<"member" | "admin" | "billing_manager">("member");
  const [newLimit, setNewLimit] = React.useState(2500);
  const [actionMessage, setActionMessage] = React.useState<string | null>(null);

  // Initialize or load demo organization
  React.useEffect(() => {
    const defaultUser = user || {
      id: "usr_lead_enterprise",
      email: "director@aroh.io",
      role: "admin" as const,
      createdAt: new Date().toISOString()
    };

    let existingOrg = TeamWalletService.getOrganization("org_enterprise_primary");
    if (!existingOrg) {
      const created = TeamWalletService.createOrganization(
        "Aroh Ecosystem Enterprise",
        defaultUser,
        "enterprise"
      );
      existingOrg = created.organization;
      // Pre-seed an engineer member
      TeamWalletService.addMember(existingOrg.id, "lead-engineer@aroh.io", "admin", 15000);
      TeamWalletService.addMember(existingOrg.id, "ai-analyst@aroh.io", "member", 5000);
    }

    setOrg(existingOrg);
    setWallet(TeamWalletService.getTeamWallet(existingOrg.id));
    setMembers(TeamWalletService.getMembers(existingOrg.id));
    setTransactions(TeamWalletService.getTransactions(existingOrg.id));
  }, [user]);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!org || !newEmail.trim()) return;

    try {
      const added = TeamWalletService.addMember(org.id, newEmail.trim(), newRole, newLimit);
      setMembers(TeamWalletService.getMembers(org.id));
      setNewEmail("");
      setShowAddMember(false);
      setActionMessage(`Member ${added.email} successfully added with ${newLimit} Aros limit.`);
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err: any) {
      alert(err.message || "Failed to add member");
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 16px", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Breadcrumb / Back Link */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link
          href="/dashboard"
          style={{ fontSize: "13px", color: "#9ca3af", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}
        >
          ← Back to User Dashboard
        </Link>
        <span
          style={{
            fontSize: "11px",
            padding: "3px 10px",
            borderRadius: "999px",
            backgroundColor: "rgba(16, 185, 129, 0.15)",
            color: "#34d399",
            fontWeight: "600",
            border: "1px solid rgba(16, 185, 129, 0.3)"
          }}
        >
          PHASE 5 MULTI-TENANT ENTERPRISE
        </span>
      </div>

      {/* Header Banner */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#ffffff", margin: 0, letterSpacing: "-0.02em" }}>
            {org ? org.name : "Enterprise Organization"}
          </h1>
          <p style={{ fontSize: "14px", color: "#a1a1aa", margin: "6px 0 0 0" }}>
            Shared organization wallets, per-member spending limits, and directory federation
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Button variant="secondary" onClick={() => setShowAddMember(true)}>
            + Add Team Member
          </Button>
        </div>
      </header>

      {actionMessage && (
        <div style={{ padding: "12px 16px", borderRadius: "8px", backgroundColor: "rgba(16, 185, 129, 0.15)", border: "1px solid #059669", color: "#34d399", fontSize: "13px" }}>
          {actionMessage}
        </div>
      )}

      {/* Overview Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
        {/* Team Wallet Balance Card */}
        <div
          style={{
            background: "linear-gradient(135deg, #18181b 0%, #27272a 100%)",
            border: "1px solid #3f3f46",
            borderRadius: "16px",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}
        >
          <span style={{ fontSize: "12px", color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "600" }}>
            Organization Team Wallet
          </span>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
            <span style={{ fontSize: "36px", fontWeight: "800", color: "#ffffff" }}>
              {wallet ? wallet.balance.toLocaleString() : "0"}
            </span>
            <span style={{ fontSize: "18px", fontWeight: "600", color: "#60a5fa" }}>
              Aros
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#71717a", marginTop: "8px", borderTop: "1px solid #3f3f46", paddingTop: "12px" }}>
            <span>Daily Cap: {wallet ? wallet.dailyCapAros.toLocaleString() : "0"} Aros</span>
            <span>Monthly Cap: {wallet ? wallet.monthlyCapAros.toLocaleString() : "0"} Aros</span>
          </div>
        </div>

        {/* Directory Federation (SAML / SCIM) */}
        <div
          style={{
            backgroundColor: "#18181b",
            border: "1px solid #27272a",
            borderRadius: "16px",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "600" }}>
              Directory Federation
            </span>
            <span style={{ fontSize: "11px", color: "#34d399", backgroundColor: "rgba(16, 185, 129, 0.15)", padding: "2px 8px", borderRadius: "6px" }}>
              SAML 2.0 / SCIM READY
            </span>
          </div>
          <div style={{ fontSize: "13px", color: "#e4e4e7", lineHeight: "1.5" }}>
            Automate user provisioning and SSO authentication from Okta, Microsoft Entra ID (Azure AD), or Google Workspace.
          </div>
          <div style={{ fontSize: "11px", color: "#71717a", marginTop: "auto" }}>
            SCIM 2.0 Base URL: <code>https://aroh-os.vercel.app/api/enterprise/scim/v2</code>
          </div>
        </div>
      </div>

      {/* Team Member Roster */}
      <section style={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#ffffff", margin: 0 }}>
            Team Members ({members.length})
          </h2>
          <span style={{ fontSize: "12px", color: "#71717a" }}>
            Spending quotas automatically enforce fail-closed limits
          </span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #27272a", color: "#71717a" }}>
                <th style={{ padding: "10px" }}>Email</th>
                <th style={{ padding: "10px" }}>Role</th>
                <th style={{ padding: "10px" }}>Monthly Quota</th>
                <th style={{ padding: "10px" }}>Spent This Month</th>
                <th style={{ padding: "10px" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} style={{ borderBottom: "1px solid #1f1f23", color: "#f4f4f5" }}>
                  <td style={{ padding: "12px 10px", fontWeight: "500" }}>{m.email}</td>
                  <td style={{ padding: "12px 10px" }}>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        textTransform: "uppercase",
                        fontWeight: "600",
                        backgroundColor: m.role === "owner" ? "#4338ca" : m.role === "admin" ? "#2563eb" : "#27272a",
                        color: "#fff"
                      }}
                    >
                      {m.role}
                    </span>
                  </td>
                  <td style={{ padding: "12px 10px" }}>{m.spendingLimitAros.toLocaleString()} Aros</td>
                  <td style={{ padding: "12px 10px" }}>{m.spentThisMonthAros.toLocaleString()} Aros</td>
                  <td style={{ padding: "12px 10px" }}>
                    <span style={{ color: "#34d399", fontSize: "12px" }}>● {m.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Team Transaction Audit Log */}
      <section style={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#ffffff", margin: 0 }}>
          Team Ledger Audit Log
        </h2>

        {transactions.length === 0 ? (
          <div style={{ color: "#71717a", fontSize: "13px" }}>No transactions recorded for this team wallet yet.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {transactions.slice(0, 10).map((tx) => (
              <div
                key={tx.id}
                style={{
                  backgroundColor: "#09090b",
                  border: "1px solid #27272a",
                  borderRadius: "10px",
                  padding: "14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "500", color: "#f4f4f5" }}>
                    {tx.description}
                  </div>
                  <div style={{ fontSize: "11px", color: "#71717a", marginTop: "4px" }}>
                    Member: {tx.memberEmail} • Hash: <code>{tx.receiptHash}</code> • {new Date(tx.timestamp).toLocaleString()}
                  </div>
                </div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: tx.amount > 0 ? "#34d399" : "#f87171" }}>
                  {tx.amount > 0 ? `+${tx.amount.toLocaleString()}` : tx.amount.toLocaleString()} Aros
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Add Member Dialog */}
      {showAddMember && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100
          }}
        >
          <div
            style={{
              backgroundColor: "#18181b",
              border: "1px solid #3f3f46",
              borderRadius: "16px",
              padding: "24px",
              width: "100%",
              maxWidth: "460px",
              display: "flex",
              flexDirection: "column",
              gap: "16px"
            }}
          >
            <h3 style={{ margin: 0, fontSize: "18px", color: "#fff" }}>Add Organization Member</h3>
            <form onSubmit={handleAddMember} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "12px", color: "#a1a1aa", display: "block", marginBottom: "4px" }}>
                  Member Email
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="colleague@aroh.io"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    backgroundColor: "#09090b",
                    border: "1px solid #27272a",
                    borderRadius: "8px",
                    padding: "10px",
                    color: "#fff",
                    fontSize: "13px"
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", color: "#a1a1aa", display: "block", marginBottom: "4px" }}>
                  Role
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    backgroundColor: "#09090b",
                    border: "1px solid #27272a",
                    borderRadius: "8px",
                    padding: "10px",
                    color: "#fff",
                    fontSize: "13px"
                  }}
                >
                  <option value="member">Member</option>
                  <option value="billing_manager">Billing Manager</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "12px", color: "#a1a1aa", display: "block", marginBottom: "4px" }}>
                  Monthly Aros Spending Limit
                </label>
                <input
                  type="number"
                  min="0"
                  max="100000"
                  value={newLimit}
                  onChange={(e) => setNewLimit(Number(e.target.value))}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    backgroundColor: "#09090b",
                    border: "1px solid #27272a",
                    borderRadius: "8px",
                    padding: "10px",
                    color: "#fff",
                    fontSize: "13px"
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                <Button type="button" variant="glass" onClick={() => setShowAddMember(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Confirm & Add
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
