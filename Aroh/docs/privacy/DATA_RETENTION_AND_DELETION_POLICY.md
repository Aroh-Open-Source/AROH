# AROH Platform Data Retention & Deletion Policy

> **Document ID:** `AROH-PRIVACY-RETENTION-V1.0`
> **Version:** `1.0.0`
> **Effective Date:** `2026-09-11`
> **Last Updated:** `2026-09-11`
> **Status:** `ACTIVE_NOW`
> **Statutory Baseline:** Section 8(7), DPDP Act 2023 & DPDP Rules 2025
> **Legal Review Status:** `LEGAL_REVIEW_REQUIRED`

---

## 1. Statutory Retention Principle

Pursuant to **Section 8(7) of the Digital Personal Data Protection Act, 2023**, a Data Fiduciary must cease to retain personal data, or anonymize it, as soon as it is reasonable to assume that:
1. The purpose for which such personal data was collected is no longer being served; and
2. Retention is no longer necessary for legal or business compliance purposes.

AROH rejects the practice of retaining personal data indefinitely. All processing categories are governed by concrete, purpose-based retention schedules.

---

## 2. Master Data Retention Schedule Matrix

| Data Category | Purpose of Processing | Retention Trigger | Standard Retention Period | Deletion / Disposal Method | Statutory Justification / Exception |
|---|---|---|:---:|---|---|
| **Account Credentials** | Identity authentication | Account closure / deletion request | 0 days (immediate) + 30 days backup purge | Cryptographic purge from Firebase Auth | DPDP Act Sec 12; right to erasure |
| **User Profile Data** | Personalisation & membership | Account deletion | Immediate | Document delete via Firestore SDK | Purpose expired upon account closure |
| **Aros Token Ledger** | Audit trail & fraud prevention | Transaction timestamp | 7 years from transaction date | Pseudonymized; user ID unlinked, transaction amount retained | Statutory financial record-keeping under Indian commercial & tax laws |
| **AI Inference Prompts** | Developer assistance | HTTP stream completion | 0 days (ephemeral in-memory only) | Automated garbage collection upon response termination | Privacy-by-design; zero persistent storage |
| **Consent Logs** | Proving lawful consent | Date consent recorded | 3 years post-account closure | Cryptographic anonymization | DPDP Act compliance defense before Data Protection Board |
| **Grievance Records** | Redressal documentation | Ticket resolution date | 3 years from resolution | Hard programmatic purge | Regulatory compliance record under DPDP Rules 2025 Rule 14 |
| **Edge Access Logs** | DDoS defense & security | Request timestamp | 30 days rolling window | Automated TTL log rotation on Vercel Edge | System integrity & CERT-In cyber-incident baseline |

---

## 3. Deletion Cascade Execution Protocol

When a Data Principal initiates an account deletion:
1. **Phase 1 (Ingress Termination):** The user's active session token is immediately invalidated, and login credentials in Firebase Auth are deleted.
2. **Phase 2 (Profile Purge):** The `profiles/{userId}` document in Cloud Firestore is hard-deleted.
3. **Phase 3 (Financial Ledger Pseudonymization):** All associated records in `wallets/{userId}` and `transactions/{userId}` are decoupled: the `userId` foreign key is hashed with an irreversible salt, preserving the integrity of total token supply math without retaining personal identifiers.
4. **Phase 4 (Processor Cascade):** Downstream deletion notifications are dispatched to all integrated processors.
5. **Phase 5 (Audit Confirmation):** A deletion receipt is issued to the Data Principal confirming successful cascade execution.
