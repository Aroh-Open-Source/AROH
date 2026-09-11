# AROH Platform Privacy Notice

> **Document ID:** `AROH-PRIVACY-NOTICE-V1.0`
> **Version:** `1.0.0`
> **Effective Date:** `2026-09-11`
> **Last Updated:** `2026-09-11`
> **Status:** `ACTIVE_NOW`
> **Statutory Baseline:** Section 5, Digital Personal Data Protection Act, 2023 & Rule 3, DPDP Rules, 2025
> **Legal Review Status:** `LEGAL_REVIEW_REQUIRED` (Designed to support statutory compliance; subject to final counsel review)
> **Data Fiduciary Identity:** `[AROH_LEGAL_ENTITY_NAME]` (`privacy@aroh.in`)

---

## 1. Introduction & Plain-Language Summary

The **AROH Open Source Platform & Application Ecosystem** ("AROH", "we", "us", or "our") respects your fundamental right to privacy. This Privacy Notice is provided in clear, plain language pursuant to Section 5 of the **Digital Personal Data Protection Act, 2023** ("DPDP Act") and Rule 3 of the **Digital Personal Data Protection Rules, 2025**.

It explains:
- **WHO** collects and controls your personal data (the Data Fiduciary).
- **WHAT** specific categories of personal data we process.
- **WHY** each item of data is required (the specific purpose and lawful basis).
- **HOW** your data is processed, stored, and protected.
- **WITH WHOM** your data is shared (processors and infrastructure partners).
- **WHAT RIGHTS** you possess as a Data Principal under Indian law and how you can exercise or withdraw them at any time.

---

## 2. Who is the Data Fiduciary?

Under the DPDP Act, the **Data Fiduciary** determining the purpose and means of processing your personal data on this platform is:

- **Entity Name:** `[AROH_LEGAL_ENTITY_NAME]` (Corporate Entity in formation / Open Source Steering Group)
- **Official Privacy Email:** `privacy@aroh.in`
- **Grievance Officer:** `grievance@aroh.in`
- **Physical Address:** `[REGISTERED_OFFICE_ADDRESS_PENDING_CONFIRMATION]`

*Note: In accordance with our governance standards, we do not invent corporate registration numbers or officer names; all placeholders remain marked for formal corporate confirmation.*

---

## 3. Itemized Personal Data We Collect & Why (Purpose Specification)

Pursuant to Section 5(1) of the DPDP Act, we only collect personal data that is strictly necessary for specified, lawful purposes:

### 3.1 Authentication & Account Identity Data
- **Data Items:** Email address, password hash (one-way cryptographic hash), unique user identifier (`uid`), account role (`user`, `operator`, `admin`), email verification status, account creation timestamp.
- **Source:** Directly provided by you during registration or login (`/login`).
- **Purpose:** To create and maintain your account, authenticate your identity, issue cryptographic session tokens, and secure your account against unauthorized access.
- **Lawful Basis:** Free and affirmative consent (DPDP Act Sec 6) and contractual necessity.
- **Mandatory or Optional:** **Mandatory** for authenticated services (such as Aros Wallet and CMS). Unauthenticated browsing of `/`, `/explore`, and documentation does not require account creation.

### 3.2 User Profile & Entitlements
- **Data Items:** Display name, avatar URL (optional), membership tier level (`basic`, `pro`, `enterprise`), last updated timestamp.
- **Source:** Directly updated by you via `/dashboard`.
- **Purpose:** To display your identity across platform headers, personalise interface settings, and gate tier-based ecosystem features.
- **Lawful Basis:** Consent (Sec 6).
- **Mandatory or Optional:** **Optional** (defaults to empty/generic profile if omitted).

### 3.3 Aros Wallet & Economic Transaction Ledger
- **Data Items:** User ID, current token balance, transaction identifiers, transaction amounts (credits/debits), transaction type, description, and timestamp.
- **Source:** Generated automatically by platform transaction routes (`/api/user/upgrade`, `/api/admin/reward`).
- **Purpose:** To maintain an immutable, auditable token ledger for platform utility usage, prevent double-spending, and verify membership entitlements.
- **Lawful Basis:** Contractual fulfillment and legitimate security/accounting uses (Sec 7).
- **Mandatory or Optional:** **Mandatory** for accessing token-gated platform upgrades.

### 3.4 Artificial Intelligence Prompts & Developer Inferences
- **Data Items:** Prompt text submitted to the AI portal (`/ai`), session context tokens, model configuration preferences, model response text.
- **Source:** Interactive user input in the AI Developer Portal.
- **Purpose:** To generate automated code diagnostics, architectural reasoning, and developer answers.
- **Lawful Basis:** Explicit user consent per inference session.
- **Retention Note:** AROH implements **stateless inference**; prompt text is not persistently retained on AROH servers following completion of the HTTP streaming response and is never used to train machine learning models.

### 3.5 Technical, Network & Telemetry Data
- **Data Items:** Internet Protocol (IP) address, browser user-agent header, HTTP request path, response status, and diagnostic error traces.
- **Source:** Automatically collected by edge server infrastructure (Vercel Edge / Next.js) upon network connection.
- **Purpose:** To deliver web pages, protect against distributed denial-of-service (DDoS) attacks, detect malicious probing, and maintain system availability.
- **Lawful Basis:** Certain Legitimate Uses (DPDP Act Sec 7) and network security integrity.
- **Mandatory or Optional:** **Mandatory** for technical delivery over the internet; rolling log retention of 30 days.

---

## 4. How We Process & Store Your Data

1. **Storage Systems:** Your data is stored in secure cloud datastores managed by Google Cloud Platform (Cloud Firestore and Firebase Authentication). Local development builds utilize isolated in-memory or localStorage mocking.
2. **Encryption:** All personal data is encrypted in-transit using **TLS 1.3** and at-rest using **AES-256**.
3. **Access Controls:** We enforce strict role-based access control (RBAC). Platform operators and support personnel cannot view raw passwords, API private keys, or unredacted user sessions.
4. **No Sale of Personal Data:** AROH has never sold, rented, leased, or monetized personal data of any user and will never do so.

---

## 5. Third-Party Data Processors & Infrastructure Partners

To operate the Platform, we engage reputable infrastructure providers who act as **Data Processors** bound by contractual Data Processing Addenda (DPAs):

| Processor | Service Provided | Data Handled | Location |
|---|---|---|---|
| **Google LLC (Firebase & GCP)** | Authentication, database persistence, and cloud storage | Email, hashed credentials, profile, wallet balance, transaction ledger | Global / Multi-region |
| **Vercel Inc.** | Serverless edge hosting, asset CDN, and ingress routing | IP address, user-agent, route request logs | Global Edge PoPs |
| **Third-Party AI Providers** *(when configured)* | Stateless LLM inference execution | Ephemeral prompt text & response tokens | US / EU Data Centers |

For exhaustive processor information, refer to our [Third-Party Processors Disclosure](THIRD_PARTY_PROCESSORS_DISCLOSURE.md).

---

## 6. Cross-Border & International Transfers

Your personal data may be processed on secure servers located outside of India (such as Google Cloud and Vercel infrastructure in the United States or Asia-Pacific regions).

Under **Section 16 of the DPDP Act**, cross-border transfers are permitted unless restricted by Central Government notifications. All international transfers executed by AROH are subject to robust contractual protections ensuring security safeguards equivalent to those mandated by Indian law.

---

## 7. Your Statutory Rights as a Data Principal

Under Chapter III of the DPDP Act and the DPDP Rules, 2025, you possess enforceable statutory rights:

1. **Right to Access Information (Sec 11):** You have the right to obtain a summary of your personal data processed by AROH, the identities of all processors with whom it has been shared, and related processing details.
2. **Right to Correction & Completion (Sec 12):** You have the right to correct inaccurate data, complete incomplete records, or update out-of-date personal data.
3. **Right to Erasure (Sec 12):** You have the right to request the permanent deletion of your personal data when the specified purpose is no longer served or upon withdrawing consent.
4. **Right to Withdraw Consent (Sec 6(4)):** You may withdraw your consent at any time. Withdrawal is engineered to be as simple as giving consent via our [Consent Settings](/privacy/consent).
5. **Right of Grievance Redressal (Sec 13):** You have the right to have your grievances resolved within the statutory period (max 90 days) by our designated Grievance Officer.
6. **Right to Nominate (Sec 14):** You have the right to nominate an individual who will exercise your privacy rights in the event of death or incapacity.

To exercise any statutory right, visit the **[Data Principal Rights Center](/privacy/rights)** or email `privacy@aroh.in`.

---

## 8. Grievance Redressal Mechanism

If you have any questions, concerns, or complaints regarding our handling of your personal data, you may lodge a formal grievance with our designated Grievance Redressal Officer:

- **Designated Grievance Officer:** `[GRIEVANCE_OFFICER_NAME_PENDING_CONFIRMATION]`
- **Grievance Desk Email:** `grievance@aroh.in`
- **Statutory Resolution Period:** Within 30 days of ticket receipt (statutory maximum under DPDP Rules: 90 days).
- **Direct Portal:** **[/privacy/grievance](/privacy/grievance)**

If your grievance is not resolved within the prescribed timeline, or if you are dissatisfied with the resolution, you have the statutory right to escalate your complaint to the **Data Protection Board of India**.

---

## 9. Updates to this Notice

We review and update this Privacy Notice periodically. When we make material changes to data categories, processing purposes, or processors, we will notify you via our on-site announcements banner (`/cms`), update the version number, and request renewed affirmative consent where legally required.
