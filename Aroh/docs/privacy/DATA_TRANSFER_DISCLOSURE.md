# AROH Platform Cross-Border Data Transfer Disclosure

> **Document ID:** `AROH-PRIVACY-TRANSFER-V1.0`
> **Version:** `1.0.0`
> **Effective Date:** `2026-09-11`
> **Last Updated:** `2026-09-11`
> **Status:** `ACTIVE_NOW`
> **Statutory Baseline:** Section 16, Digital Personal Data Protection Act, 2023
> **Legal Review Status:** `LEGAL_REVIEW_REQUIRED`

---

## 1. Statutory Framework for Cross-Border Transfers

Under **Section 16 of the Digital Personal Data Protection Act, 2023**, the Central Government of India adopts a "negative list" (blacklisting) approach to cross-border data flows:
1. Personal data may be transferred outside the territory of India for processing, **except** to such countries or territories as may be specifically restricted or notified by the Central Government.
2. The transfer is subject to any higher degree of protection or restriction provided under any other law in force in India.

---

## 2. AROH Data Storage Locations & International Processing

AROH utilizes modern cloud infrastructure to deliver low-latency web applications globally:

```
[DATA PRINCIPAL (INDIA)]
          │
          ▼ (TLS 1.3 Ingress)
[VERCEL EDGE NETWORK (INDIA / GLOBAL POPS)]
          │
          ▼ (Secure Backend Routing)
[GOOGLE CLOUD PLATFORM / FIREBASE (US / MULTI-REGION)]
```

- **Authentication & Database Records:** Stored in Google Cloud Platform data centers. Depending on project tier, data may reside in Google Cloud multi-region centers (including the United States, Europe, and Asia-South1 Mumbai).
- **Edge Delivery Logs:** Processed across Vercel's distributed worldwide edge points of presence (PoPs).
- **AI Inference Requests:** When optional third-party commercial LLM providers are enabled, prompt tokens are securely routed to provider API clusters in the United States or European Union.

---

## 3. Transfer Safeguards & Contractual Assurances

To safeguard personal data transferred across borders:
1. All transfers are protected by **TLS 1.3 encryption in-transit** and **AES-256 encryption at-rest**.
2. We enforce comprehensive Data Processing Addenda (DPAs) incorporating standard contractual clauses.
3. We continuously monitor Central Government gazette notifications under Section 16(1) to ensure no data is transferred to any restricted foreign jurisdiction.
