# AROH Platform Third-Party Processors & Subprocessors Disclosure

> **Document ID:** `AROH-PRIVACY-PROCESSORS-V1.0`
> **Version:** `1.0.0`
> **Effective Date:** `2026-09-11`
> **Last Updated:** `2026-09-11`
> **Status:** `ACTIVE_NOW`
> **Statutory Baseline:** Section 8(1) & 8(2), DPDP Act 2023
> **Legal Review Status:** `LEGAL_REVIEW_REQUIRED`

---

## 1. Statutory Role of Data Processors

Under **Section 8(1) and 8(2) of the Digital Personal Data Protection Act, 2023**, a Data Fiduciary may engage, appoint, or involve a Data Processor to process personal data on its behalf for any activity relating to the offering of goods or services to Data Principals, provided that such processing is conducted only under a valid contract.

AROH remains fully responsible to Data Principals for all processing carried out by its authorized Data Processors.

---

## 2. Exhaustive Processors Registry

| Processor Name | Legal Entity & DPA Status | Service Function | Personal Data Processed | Server Location | Data Security Standard |
|---|---|---|---|---|---|
| **Google LLC (Firebase / Google Cloud Platform)** | Executed under Google Cloud Master Services Agreement & DPA | User authentication, identity verification, persistence of profile and Aros wallet documents | Email, password hash, user ID, display name, avatar URL, wallet balance, transaction ledger | Global / Multi-region infrastructure (US / Asia-South1 Mumbai) | SOC 1/2/3, ISO 27001, ISO 27017, ISO 27018, TLS 1.3, AES-256 |
| **Vercel Inc.** | Executed under Vercel Master Services Agreement & DPA | Edge network CDN, serverless Next.js route hosting, static asset delivery | IP addresses, request path, HTTP headers, edge routing logs | Global Edge Network (Edge PoPs in India, US, EU) | SOC 2 Type II, ISO 27001, automated DDoS mitigation |
| **Commercial AI Providers (OpenAI / Anthropic / Google)** *(When configured)* | Commercial API terms with zero data retention for model training | Natural language code assistance and technical explanations | Ephemeral prompt text, context tokens, model completions | United States & European Union Data Centers | SOC 2 Type II, TLS 1.3 encryption, ephemeral session handling |

---

## 3. Subprocessor Governance & Notification

1. **Contractual Mandate:** Every engaged Data Processor is contractually bound to impose equivalent data protection and confidentiality obligations upon any subprocessors they utilize.
2. **Changes to Processors:** In the event that AROH engages a new category of Data Processor or replaces an existing processor with substantive impact on personal data handling, we will update this disclosure and provide notice via our on-site announcements banner (`/cms`).
