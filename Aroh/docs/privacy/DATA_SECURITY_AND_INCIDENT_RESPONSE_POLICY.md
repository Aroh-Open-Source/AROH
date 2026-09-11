# AROH Platform Data Security & Breach Incident Response Policy

> **Document ID:** `AROH-PRIVACY-SECURITY-V1.0`
> **Version:** `1.0.0`
> **Effective Date:** `2026-09-11`
> **Last Updated:** `2026-09-11`
> **Status:** `ACTIVE_NOW`
> **Statutory Baseline:** Section 8(5) & 8(6), DPDP Act 2023 & Rule 9 & 10, DPDP Rules 2025
> **Legal Review Status:** `LEGAL_REVIEW_REQUIRED`

---

## 1. Technical Security Architecture

Pursuant to **Section 8(5) of the DPDP Act**, AROH implements reasonable security safeguards to prevent personal data breach:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. CRYPTOGRAPHIC SAFEGUARDS                                 │
│    • In-transit encryption: Mandatory TLS 1.3               │
│    • At-rest encryption: AES-256 (Google Cloud Firestore)   │
│    • Passwords: Salted bcrypt/scrypt hashes via Firebase    │
│    • Session integrity: HMAC-SHA256 token verification      │
├─────────────────────────────────────────────────────────────┤
│ 2. ACCESS CONTROL & LEAST PRIVILEGE                         │
│    • Role-Based Access Control (RBAC): user/operator/admin  │
│    • Developers cannot query production user tables directly│
│    • Administrative routes protected by server-side checks  │
├─────────────────────────────────────────────────────────────┤
│ 3. PERIMETER & WORKSPACE ISOLATION                          │
│    • Products/ directory is strictly read-only              │
│    • Fail-closed deterministic exit codes (0–7) in CLI      │
│    • Rate limiting at edge (Next.js / Vercel middleware)   │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Personal Data Breach Response Protocol (9-Stage Workflow)

Under **Section 8(6) of the DPDP Act** and **Rule 10 of the DPDP Rules, 2025**, any personal data breach triggering risk to Data Principals requires prompt mitigation, Board notification, and notification to affected individuals.

AROH operationalizes a mandatory 9-stage incident lifecycle:

```
[1. DETECTED] ──► [2. TRIAGED] ──► [3. CONFIRMED] ──► [4. CONTAINED] ──► [5. ASSESSED]
        ▲                                                                        │
        │                                                                        ▼
   [9. CLOSED] ◄── [8. REMEDIATED] ◄── [7. NOTIFIED] ◄── [6. NOTIF_REQUIRED] ◄──┘
```

### Stage 1: DETECTED
- Incident detected via automated log alerts, integrity monitoring, or external vulnerability disclosure to `security@aroh.in`.
- Incident Ticket initialized with `incident_id`, detection timestamp, and affected system.

### Stage 2: TRIAGED
- Security Incident Response Team (SIRT) evaluates within **one (1) hour** whether personal data stores are impacted.

### Stage 3: CONFIRMED
- Evidence verification confirms whether unauthorized access, alteration, disclosure, or destruction of personal data occurred.

### Stage 4: CONTAINED
- Immediate containment measures executed: revoking compromised API keys, isolating compromised network pods, rotating secrets, and terminating affected sessions.

### Stage 5: ASSESSED
- Impact assessment evaluates volume of records, categories of data, sensitivity, and potential harm to Data Principals.

### Stage 6: NOTIFICATION_REQUIRED
- Evaluation of statutory notification thresholds under DPDP Rules 2025 Rule 10 and CERT-In directions (6-hour cybersecurity incident reporting where applicable).

### Stage 7: NOTIFIED
- **To the Data Protection Board of India:** Comprehensive breach report submitted within prescribed regulatory timelines detailing nature of breach, affected systems, categories of data, and mitigation actions taken.
- **To Affected Data Principals:** Direct notification sent via email in clear, plain language detailing:
  1. Description of the personal data breach.
  2. Categories of personal data involved.
  3. Potential consequences and risks.
  4. Immediate measures taken by AROH to contain and mitigate harm.
  5. Recommended safety actions for the Data Principal (e.g. password resets).
  6. Contact details of the designated Grievance Officer.

### Stage 8: REMEDIATED
- Long-term root-cause engineering fixes deployed, regression tests executed, and code validated.

### Stage 9: CLOSED
- Post-incident postmortem compiled, documentation updated, and incident ticket formally archived with legal sign-off.

---

## 3. Vulnerability Disclosure & Reporting

Security researchers and developers are encouraged to report potential vulnerabilities responsibly:
- **Direct Submission:** `security@aroh.in`
- **PGP Key:** Available upon request
- **Safe Harbor:** AROH commits not to pursue legal action against security researchers who conduct testing within the bounds of our [Acceptable Use Policy](../legal/ACCEPTABLE_USE_POLICY.md) and report findings in good faith without exfiltrating personal data.
