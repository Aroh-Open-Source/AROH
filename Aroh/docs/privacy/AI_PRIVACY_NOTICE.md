# AROH Platform Artificial Intelligence Privacy Notice

> **Document ID:** `AROH-PRIVACY-AI-V1.0`
> **Version:** `1.0.0`
> **Effective Date:** `2026-09-11`
> **Last Updated:** `2026-09-11`
> **Status:** `ACTIVE_NOW`
> **Statutory Baseline:** Section 5 & 6, DPDP Act 2023
> **Legal Review Status:** `LEGAL_REVIEW_REQUIRED`

---

## 1. Scope & AI Architecture Overview

AROH incorporates provider-agnostic Artificial Intelligence orchestration capabilities through the `@aroh/asdk` AI provider framework (`packages/asdk/src/ai/provider.ts`) and the web-based AI Developer Portal (`apps/web/app/ai/page.tsx`).

This dedicated AI Privacy Notice provides transparent disclosures regarding how user prompts, context tokens, code snippets, and conversational histories are handled.

---

## 2. Itemized AI Data Flow Specification

| Parameter | Operational Reality in AROH Core |
|---|---|
| **Input Data** | User-authored natural language prompts, code snippets pasted for diagnosis, optional session temperature/model flags |
| **Output Data** | Streamed conversational completions, syntax explanations, architectural recommendations |
| **Persistence / Storage** | **Stateless execution.** Prompts and completions are held in server memory only for the duration of the HTTP streaming request |
| **Retention Period** | **0 days.** Memory is released immediately upon stream close; zero persistent prompt logging |
| **Active Default Provider** | `MockAIProvider` in repository/development environment (pure deterministic in-memory mock) |
| **Configurable Production Providers** | Commercial API endpoints of OpenAI, Anthropic, or Google Gemini (activated only via explicit environment variables) |
| **Model Training Prohibition** | AROH exclusively integrates with commercial API tiers that contractually guarantee **zero data retention for model training** |
| **Human Review** | Zero human review of prompts by AROH staff; prompts are processed autonomously |
| **Cross-Border Transmission** | When third-party LLM providers are enabled, prompt tokens are transmitted via TLS 1.3 to vendor data centers located in the United States or European Union |
| **Account Deletion Cascade** | Ephemeral architecture ensures no residual prompt history remains associated with user accounts |

---

## 3. Mandatory User Guidelines

1. **Do Not Submit Unnecessary Personal Data:** You should not paste personal identity numbers, financial records, health information, or confidential third-party credentials into AI prompts.
2. **Review Output for Accuracy:** AI outputs are generated probabilistically and must be independently verified by developers prior to use in mission-critical applications.
3. **No Unlawful Generation:** Using the AI tier to generate malicious software, exploit scripts, or unlawful defamatory content violates our [Acceptable Use Policy](../legal/ACCEPTABLE_USE_POLICY.md).
