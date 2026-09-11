# AROH Platform Data Principal Rights Policy

> **Document ID:** `AROH-PRIVACY-RIGHTS-V1.0`
> **Version:** `1.0.0`
> **Effective Date:** `2026-09-11`
> **Last Updated:** `2026-09-11`
> **Status:** `ACTIVE_NOW`
> **Statutory Baseline:** Chapter III (Sections 11–14), DPDP Act 2023 & Rules 11–13, DPDP Rules 2025
> **Legal Review Status:** `LEGAL_REVIEW_REQUIRED`

---

## 1. Statutory Rights Overview

The Digital Personal Data Protection Act, 2023 vests every natural person ("Data Principal") with fundamental, enforceable statutory rights regarding their personal data. AROH has built automated self-service and administrative workflows to honor these rights:

```
                  DATA PRINCIPAL RIGHTS ARCHITECTURE
                                   │
       ┌───────────────────────────┼───────────────────────────┐
       ▼                           ▼                           ▼
[RIGHT TO ACCESS]          [RIGHT TO CORRECTION]       [RIGHT TO ERASURE]
 (Section 11)                 (Section 12)                (Section 12)
 • Personal data summary    • Correct inaccuracies      • Permanent purge
 • Processors list          • Complete incomplete info  • Anonymize records
 • Specific processing      • Update out-of-date data   • Statutory exceptions
       │                           │                           │
       └───────────────────────────┼───────────────────────────┘
                                   │
       ┌───────────────────────────┴───────────────────────────┐
       ▼                                                       ▼
[RIGHT TO NOMINATION]                                   [RIGHT TO WITHDRAW]
 (Section 14)                                            (Section 6(4))
 • Nominate successor upon                              • Immediate cessation
   death or incapacity                                  • Zero penalty
```

---

## 2. Right to Access Information (Section 11)

You have the right to request:
1. A summary of all personal data concerning you currently processed by AROH.
2. The processing activities undertaken with that personal data.
3. The identities of all other Data Fiduciaries and Data Processors with whom your personal data has been shared by AROH, together with a description of the data shared.
4. Any other information prescribed by the DPDP Rules, 2025.

**Self-Service Route:** Authenticated users can instantly download their complete data package via the **[Data Export Tool](/privacy/rights)**.

---

## 3. Right to Correction, Completion & Updating (Section 12)

If any personal data we hold about you is inaccurate, misleading, or incomplete:
- You may update your profile directly in **[/dashboard](/dashboard)**.
- For core credential updates or email changes, submit a formal correction request via **[/privacy/rights](/privacy/rights)**.
- We will update the personal data across all active stores and notify all third-party processors who received the data within statutory deadlines.

---

## 4. Right to Erasure (Section 12)

You may request the deletion of your personal data when:
- The specified purpose for which it was collected is no longer being served.
- You have withdrawn your consent for processing.
- The retention period specified in our [Retention Policy](DATA_RETENTION_AND_DELETION_POLICY.md) has elapsed.

**Cascade Workflow:** Initiating an erasure request triggers our [Account Deletion Cascade](ACCOUNT_DELETION_POLICY.md), purging credentials, profile attributes, and AI session traces, while pseudonymizing historical Aros ledger entries required for statutory tax and financial compliance.

---

## 5. Right of Nomination (Section 14)

Under Section 14 of the DPDP Act:
- You have the right to nominate any individual who shall, in the event of your death or incapacity, exercise your Data Principal rights on your behalf.
- To register a nominee, navigate to **[Data Rights Portal: Nominee Settings](/privacy/rights)** and provide the nominee's full legal name, relationship, and contact email.
- The nominee's credentials are securely encrypted and only activated upon verifiable proof of death or medical incapacity.

---

## 6. How Requests Are Processed & Timelines

1. **Submission Channels:**
   - Online Portal: **[/privacy/rights](/privacy/rights)**
   - Email: `privacy@aroh.in`
2. **Identity Verification:** To prevent unauthorized disclosures, we require email verification or session re-authentication. We never demand disproportionate identity documents (such as government IDs) unless strictly necessary to prevent fraud.
3. **Timeline:** We fulfill rights requests without undue delay and at the latest within **thirty (30) days** of receipt (statutory maximum under DPDP Rules: 90 days).
