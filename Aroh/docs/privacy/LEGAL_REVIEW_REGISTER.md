# AROH Platform: Legal & Regulatory Review Register

> **Register ID:** `AROH-LEGAL-REVIEW-REGISTER-V1.0`
> **Effective Framework:** Digital Personal Data Protection Act, 2023 (DPDP Act) & DPDP Rules, 2025
> **Last Updated:** 2026-09-11
> **Overall Status:** `LEGAL_REVIEW_REQUIRED` (Technical implementation complete; formal legal sign-off pending)
> **Authoritative Baseline:** Gazette of India Notifications, MeitY Guidelines

---

## 1. Executive Summary & Purpose

This register enumerates every substantial legal, regulatory, and corporate determination requiring formal confirmation by qualified Indian legal counsel. AROH's privacy architecture has been built ahead of statutory enforcement deadlines to provide complete technical readiness under the **Digital Personal Data Protection Act, 2023** and **DPDP Rules, 2025**.

However, technical capability must not be conflated with statutory legal certification. The items documented below are explicitly designated as `LEGAL_REVIEW_REQUIRED` until corporate counsel reviews and signs off on the operating entities, contracts, and dispute models.

---

## 2. Master Legal Review Register Table

| Item ID | Topic | Current Operational Assumption | Required Legal Confirmation | Risk Level |
|---|---|---|---|:---:|
| **`LR-001`** | **Data Fiduciary Legal Identity** | Using placeholder `[AROH_LEGAL_ENTITY_NAME]`; platform operates as open-source initiative with pending legal incorporation. | Confirm formal corporate registration (CIN/LLPIN), registered office address, and authorized signatories for Section 5 notices. | **HIGH** |
| **`LR-002`** | **Grievance Redressal Officer** | Designated placeholder `[GRIEVANCE_OFFICER_NAME]` with contact `grievance@aroh.in`; resolution SLA set to 30 days (well inside 90-day statutory cap). | Formally appoint designated employee/counsel and verify operational email/postal channels pursuant to DPDP Rules 2025 Rule 14. | **HIGH** |
| **`LR-003`** | **Significant Data Fiduciary (SDF)** | Initial user volume does not trigger Section 10 thresholds; independent DPO and mandatory DPIAs treated as `FUTURE_READY`. | Confirm non-SDF status and establish metric monitoring triggers for potential future Central Government notifications. | **MEDIUM** |
| **`LR-004`** | **Child & Minor Privacy Model** | Platform restricted to adults (18+); minors prohibited without verifiable parental consent; zero behavioral tracking or targeting platform-wide. | Review acceptable parental assurance verification methods under final notified MeitY guidelines. | **HIGH** |
| **`LR-005`** | **Cross-Border Transfers** | Data processed via GCP (Firebase) and Vercel edge networks; permissible under Section 16 unless restricted by Central Government negative list. | Monitor Central Government gazette notifications for restricted country designations under Section 16(1). | **MEDIUM** |
| **`LR-006`** | **Aros Token Classification** | Tokens are closed-loop, non-transferable, non-cashable utility reward points for membership access; not digital assets or PPIs. | Confirm closed-loop exemption under RBI Prepaid Payment Instrument regulations and tax treatment under Income Tax Act. | **MEDIUM** |
| **`LR-007`** | **AI Inference Data Rights** | AI orchestration routes prompts only through commercial API tiers with zero-retention for training; local mock provider used by default. | Audit commercial enterprise terms of service with third-party LLM providers to verify contractual zero-training clauses. | **HIGH** |
| **`LR-008`** | **Terms & Limitation of Liability** | Standard SaaS liability cap (preceding 12 months fees paid or INR 1,000); explicit non-waiver of statutory DPDP rights. | Confirm enforceability of dispute resolution, arbitration, and liability caps under Indian Contract Act, 1872. | **MEDIUM** |

---

## 3. Current vs. Future Statutory Status Matrix

| Governance Dimension | DPDP Act 2023 Provision | DPDP Rules 2025 Status | AROH Technical Implementation | Operational Status |
|---|---|---|---|:---:|
| **Notice & Itemized Consent** | Section 5 & 6 | Rules 3 & 4 (Phased commencement) | Standalone plain-language notice, purpose-specific affirmative consent, pre-consent cookie blocking | `ACTIVE_NOW` |
| **Consent Withdrawal** | Section 6(4) | Rule 3 (As easy to withdraw as give) | One-click withdrawal in `/privacy/consent`, instant cookie/localStorage invalidation | `ACTIVE_NOW` |
| **Data Principal Rights** | Sections 11, 12 | Rules 11, 12, 13 (Phased 18 months) | Complete self-service portal at `/privacy/rights` (Access, Correction, Erasure, Nomination) | `ACTIVE_NOW` |
| **Grievance Redressal** | Section 13 | Rule 14 (Effective on publication) | Dedicated grievance route `/privacy/grievance`, ticketing schema, statutory 90-day tracking | `ACTIVE_NOW` |
| **Security Safeguards** | Section 8(5) | Rule 9 (Reasonable security safeguards) | TLS 1.3 in-transit, AES-256 at-rest, HMAC-SHA256 session integrity, role-based access control | `ACTIVE_NOW` |
| **Personal Data Breach Notice** | Section 8(6) | Rule 10 (Immediate Board & Principal notification) | Documented 9-stage incident response plan with Board notification workflows | `ACTIVE_NOW` |
| **Consent Manager Integration** | Section 6(7) | Rules 5–8 (Consent Manager registration framework) | Architecture prepared for API-based interoperability with registered Consent Managers | `FUTURE_READY` |
| **Verifiable Parental Consent** | Section 9 | Rule 10 (Parental age assurance guidelines) | 18+ default barrier; architecture ready for government-approved digital identity / DigiLocker integration | `FUTURE_READY` |
| **Significant Data Fiduciary DPO** | Section 10 | Rules 15, 16 (SDF obligations) | DPO escalation workflows designed; awaiting volume/statutory designation | `FUTURE_READY` |

---

## 4. Verification & Sign-Off Checklist for Counsel

- [ ] Verify registered entity name and replace `[AROH_LEGAL_ENTITY_NAME]` across legal suite.
- [ ] Confirm registered office postal address and official contact email.
- [ ] Officially designate statutory Grievance Redressal Officer and confirm escalation phone/email.
- [ ] Review Terms of Service arbitration clause (Seat of Arbitration: New Delhi / Bengaluru, India).
- [ ] Sign Data Processing Addenda (DPAs) with Google Cloud Platform and Vercel.
- [ ] Confirm classification of Aros utility points with corporate tax advisor.
