# AROH Platform Account Deletion & Erasure Policy

> **Document ID:** `AROH-PRIVACY-DELETION-V1.0`
> **Version:** `1.0.0`
> **Effective Date:** `2026-09-11`
> **Last Updated:** `2026-09-11`
> **Status:** `ACTIVE_NOW`
> **Statutory Baseline:** Section 12, DPDP Act 2023
> **Legal Review Status:** `LEGAL_REVIEW_REQUIRED`

---

## 1. Right to Erasure & Account Termination

Under **Section 12 of the Digital Personal Data Protection Act, 2023**, you have the statutory right to request the complete erasure of your personal data and the termination of your account.

AROH provides a dedicated, accessible self-service deletion workflow accessible via the **[Data Principal Rights Center](/privacy/rights)** or via direct API at `/api/privacy/delete-account`.

---

## 2. Exhaustive Deletion Impact Matrix

Before confirming an account deletion request, Data Principals are presented with a detailed, plain-language disclosure of the cascading consequences across the ecosystem:

| Platform Component | Deletion Action | Technical & Legal Description |
|---|:---:|---|
| **Identity Credentials** | **PERMANENT PURGE** | Email address, password hash, UID, and verification flags are permanently erased from Firebase Authentication. Login is immediately blocked. |
| **Profile & Avatar** | **PERMANENT PURGE** | Display name, avatar URL, and user preferences are hard-deleted from Cloud Firestore `profiles/{userId}`. |
| **Active Sessions** | **IMMEDIATE INVALIDATION** | All active JWT/HMAC tokens are revoked across all browser tabs and client devices via cross-tab storage broadcast. |
| **Aros Token Wallet** | **DECOUPLING & ANONYMIZATION** | Remaining token balances are forfeited upon account closure. Historical transaction ledger rows are preserved strictly for total economic supply verification and statutory tax compliance, but the `userId` is irreversibly replaced with a one-way cryptographic hash. |
| **AI Inference Sessions** | **PERMANENT PURGE** | Ephemeral memory buffers are instantly cleared. Zero residual prompt or completion logs exist on AROH servers. |
| **Developer API Keys** | **PERMANENT REVOCATION** | Any active API keys or developer credentials associated with the account are permanently invalidated and deleted. |
| **Independent Products** | **DECOUPLING** | Because product spokes (*OmniStream*, *SpeDex*, etc.) are independent standalone applications, closing your AROH account severs single sign-on (SSO) bridging. Any data stored locally within standalone product clients remains governed by those individual products. |

---

## 3. Statutory Retention Exceptions

Pursuant to Section 8(7) of the DPDP Act and applicable commercial regulations, AROH does NOT retain personal data indefinitely. The only data items retained following account deletion are:
1. **Financial Transaction Records:** Preserved in an anonymized, unlinked state for 7 years to comply with statutory accounting and anti-money laundering regulations.
2. **Consent & Grievance Receipts:** Cryptographically hashed audit receipts retained for 3 years solely to defend against statutory compliance disputes before the Data Protection Board of India.

---

## 4. How to Execute Account Deletion

1. Log into your account and navigate to **[Data Rights Center: Account Deletion](/privacy/rights)**.
2. Review the itemized cascade checklist.
3. Re-enter your account credentials or confirm your email to authenticate the request.
4. Click **"Permanently Delete My AROH Account"**.
5. You will receive an automated confirmation receipt via email, and all active sessions will immediately terminate.
