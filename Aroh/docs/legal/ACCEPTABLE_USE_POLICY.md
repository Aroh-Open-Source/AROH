# AROH Platform Acceptable Use Policy (AUP)

> **Document ID:** `AROH-LEGAL-AUP-V1.0`
> **Version:** `1.0.0`
> **Effective Date:** `2026-09-11`
> **Last Updated:** `2026-09-11`
> **Status:** `ACTIVE_NOW`
> **Change Summary:** Initial release establishing developer and user security standards
> **Legal Review Status:** `LEGAL_REVIEW_REQUIRED`

---

## 1. Purpose & Scope

This Acceptable Use Policy ("AUP") defines the mandatory rules, security boundaries, and operational constraints governing all users, developers, and automated clients interacting with the AROH Open Source Platform (`apps/web`, `@aroh/asdk`, `@aroh/ads`, and associated API routes).

Failure to adhere to this policy may result in immediate suspension of account credentials, revocation of API tokens, rate limiting, and referral to law enforcement authorities where warranted.

---

## 2. Prohibited Infrastructure & Security Actions

You may NOT:
1. **Security Testing & Probing:** Perform unauthorized vulnerability scanning, penetration testing, fuzzing, or denial-of-service simulations against AROH production endpoints or Vercel edge infrastructure without express prior written consent from `security@aroh.in`.
2. **Reverse Engineering of Security Layers:** Attempt to decompile, bypass, or tamper with cryptographic signing routines, HMAC-SHA256 session tokens, or rate limit headers.
3. **Ledger Forgery:** Submit forged transaction amounts, balance overrides, or tampered payload timestamps to the Aros Wallet ledger routes.
4. **Credential Abuse:** Utilize credential stuffing, brute-forcing, dictionary attacks, or automated session harvesting against Firebase Auth endpoints.
5. **Session Hijacking:** Exploit or intercept cross-tab storage synchronization events (`aroh_logout_event`, `SessionSync`) to impersonate or elevate session privileges.

---

## 3. Acceptable Developer & API Interaction

1. **Rate Limit Compliance:** All client applications and developer scripts must respect tier-based rate limits (Basic: 60 rpm, Pro: 300 rpm, Enterprise: 1200 rpm). Deliberate distribution of requests across rotating proxy pools to evade limits is strictly prohibited.
2. **Secret Management:** Developers building on `@aroh/asdk` must maintain platform secrets (`FIREBASE_API_KEY`, API tokens, private keys) in environment variables or hardware key vaults. Hardcoding production secrets into public client-side repositories is prohibited.
3. **Fail-Closed Adapters:** Any custom spoke adapter integrated into the ecosystem must adhere to the fail-closed invariant established in `packages/asdk/src/adapters/contract.ts` and must never attempt direct mutations of `Products/`.

---

## 4. Artificial Intelligence & Content Standards

When utilizing the AROH AI Developer Portal (`/ai`):
1. **Unlawful Content:** You shall not generate, refine, or disseminate content that is obscene, defamatory, harassing, promotes violence, incites communal disharmony, or violates Indian laws (including the Information Technology Act, 2000 and Bharatiya Nyaya Sanhita, 2023).
2. **Malware Generation:** You shall not use AI capabilities to engineer exploit payloads, zero-day malware, phishing templates, or malicious automated scrapers.
3. **Third-Party Personal Data:** You shall not input sensitive personal data, health records, biometrics, or confidential credentials of third parties into conversational prompts.

---

## 5. Violations & Enforcement

AROH maintains automated telemetry and audit logging to detect policy violations. Upon detecting a breach of this AUP, we may:
- Issue a formal written warning and remediation request.
- Immediately revoke API keys and terminate authenticated sessions.
- Freeze associated Aros balances acquired through abusive methods.
- Report severe cyber-incidents to the Indian Computer Emergency Response Team (CERT-In) and law enforcement agencies.

---

## 6. Reporting Violations

If you identify a security vulnerability, abusive content, or a violation of this policy, please promptly report details to:
- **Security Incident Team:** `security@aroh.in`
- **Abuse Desk:** `abuse@aroh.in`
