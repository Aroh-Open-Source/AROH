# AROH Platform: Version History & Living Architecture Control System

> **Source of Truth**: This document represents the authoritative, permanent version timeline, Git recovery index, and living architectural memory of the **AROH Open Source Platform**. It is modeled after the OmniStream architecture intelligence standard and continuously synchronized with codebase verification.

---

## 1. Quick Navigation Index

| Version | Date | Type | Quick Summary | Git Tag | Commit |
|---|---|:---:|---|:---:|:---:|
| **v2.0.2** | 2026-09-10 | `PATCH` | **Canonical Product Showcase & Zero-Fabrication Registry**: Implemented `CANONICAL_PRODUCT_REGISTRY` in ASDK, strict Zod schema validation, authoritative URL & capability verification across all 8 products, responsive Explore and Product Detail workspaces, and expanded automated verification to 227 passing assertions across 8 test suites. | `v2.0.2` | `Working Tree (Pending Commit)` |
| **v2.0.1** | 2026-09-10 | `MINOR` | **Safe Product-Change Synchronization CLI & Master Governance**: Implemented three-way semantic reconciliation engine ($B \oplus P \oplus A$), deterministic CLI exit codes (0–7), dry-run zero-mutation guarantees, absolute `Products/` boundary isolation, in-memory Firebase Auth fallback, and codified `D1`, `D2`, `D3` machine-operating specifications. | `v2.0.1` | [`5a8d7ee`](file:///d:/PROJECT/AROH%20Open%20Source) |
| **v2.0.0** | 2026-08-31 | `MAJOR` | **Master Monorepo Restructuring & Ecosystem Realignment**: Decoupled monolithic codebase into `Aroh/` (central platform hub) and `Products/` (independent product codebases). Integrated OmniStream (v1.8.5) and SpeDex (v2.1.0). Introduced semantic project manifests (`manifests/*.manifest.json`, v1.0.0 schema) and comprehensive QA test runners. | `v2.0.0` | [`0d64b13`](file:///d:/PROJECT/AROH%20Open%20Source) |
| **v1.5.0** | 2026-07-20 | `MINOR` | **Phase 1 MVP Platform Hub & Aros Economy**: Launched Next.js 16 web portal, Aros Wallet ledger math, CMS Announcement alerts CRUD, developer AI portal with prompt templates, and cross-tab SSO session synchronization. | `v1.5.0` | [`bf9cee8^`](file:///d:/PROJECT/AROH%20Open%20Source) |
| **v1.0.0** | 2026-07-01 | `MAJOR` | **Phase 0 Foundation Workspace**: Initial monorepo configuration with npm workspaces, `@aroh/ads` design token foundations, `@aroh/asdk` core schemas, and Firestore security rules. | `v1.0.0` | [`66e3867^`](file:///d:/PROJECT/AROH%20Open%20Source) |

---

## 2. Version Entries

### v2.0.2
- **Date**: 2026-09-10
- **Type**: `PATCH` (Canonical Product Showcase & Zero-Fabrication Registry)
- **Previous Version**: `v2.0.1`

#### Quick Summary
Comprehensive resolution of product metadata drift, elimination of hallucinated URLs, and implementation of an authoritative, validated showcase registry in the platform SDK.
- **Canonical Product Showcase Registry (`Aroh/packages/asdk/src/registry/products.ts`)**:
  - Registered authoritative metadata for 8 products: OmniStream, Nebula, Music Mirror, SpeDex, JavaPath Pro, Aros Core Wallet, Aroh CMS Alerts, and Aros Metrics Engine.
  - Sourced descriptions, tech stacks, and capabilities directly from verified repositories and live deployments without fabrication.
  - Implemented client-side search, category filtering, and status filtering (`online`, `development`, `internal`).
- **Product Detail & Interactive Workspace (`Aroh/apps/web/app/explore/[productId]/`)**:
  - Modernized dynamic product detail pages featuring authoritative capability bento grids, verified external launch buttons, and live source-of-truth provenance cards.
  - Added interactive simulation workspaces for testing ecosystem communication hooks.
- **Expanded Automated QA Harness (`Aroh/scripts/test-product-registry.js`)**:
  - Implemented 115-assertion registry test verifying schema adherence, descriptive lengths, non-empty capabilities, authoritative URL formats, and metadata timestamps.
  - Full ecosystem test pass now stands at **227 passing assertions across 8 test suites**.

#### Module Version Hierarchy
- **AROH Core Platform (`AROH-CORE`)**: `v2.0.2`
- **AROH Platform SDK (`ASDK`)**: `v2.0.2`
  - *Canonical Product Registry (`ASDK-REGISTRY`)*: `v1.0.0`
  - *Three-Way Semantic Reconciler (`ASDK-SYNC`)*: `v1.0.0`
  - *Provider-Agnostic AI Orchestrator (`ASDK-AI`)*: `v1.1.0`
  - *Aros Immutable Ledger Service (`ASDK-LEDGER`)*: `v1.0.1`
- **AROH Design System (`ADS`)**: `v1.0.0`
- **External Spoke Ecosystem**:
  - *OmniStream (`OS`)*: `v1.8.5` (Independent Git submodule)
  - *SpeDex (`SPE`)*: `v2.1.0` (Independent Git submodule)
  - *Nebula (`NEB`)*: `v1.4.2` (Managed manifest)
  - *Music Mirror (`MUS`)*: `v1.2.0` (Managed manifest)
  - *JavaPath Pro (`JPP`)*: `v1.1.0` (Managed manifest)

---

### v2.0.1
- **Date**: 2026-09-10
- **Type**: `MINOR` (Safe Product-Change Synchronization CLI & Master Governance Specs)
- **Previous Version**: `v2.0.0`

#### Quick Summary
Implementation of the enterprise-grade three-way semantic reconciliation engine, deterministic CLI toolchain, in-memory auth fallback, and formalization of machine-operating governance contracts.
- **Safe Synchronization Engine (`Aroh/packages/asdk/src/sync/reconciler.ts`)**:
  - Implemented three-way diffing ($B \oplus P \oplus A$) comparing Baseline Hash, Product Current Hash, and Canonical Aroh Hash.
  - Strict classification into `shared_contract`, `product_owned`, `aroh_owned`, `protected_downstream`, `generated_derivative`, and `ambiguous`.
  - Built-in fail-closed protection against direct mutations inside `Products/`.
- **Synchronization CLI Tool (`Aroh/scripts/aroh-sync.js`)**:
  - Implemented `status`, `inspect`, `detect`, `diff`, `plan`, `dry-run`, `validate`, `conflicts`, and `apply` commands.
  - Deterministic exit codes: `0` (Success/Clean), `1` (Failed), `2` (Invalid Config), `3` (Conflict), `4` (Stale Baseline), `5` (Boundary Violation), `6` (Unknown Product), `7` (Invalid Plan).
  - Dry-run mode guarantees zero repository disk mutations.
- **In-Memory Firebase Fallback (`Aroh/packages/asdk/src/services/firebase.ts`)**:
  - Integrated zero-configuration mock authentication and storage fallback enabling offline development and hermetic CI testing.
- **Codified Master Governance (`Aroh/docs/governance/`)**:
  - Authored `D1_EXPERIENCE_AND_BEHAVIOR.md` (226 lines): 24-state interaction model, perceived performance, motion laws, and WCAG 2.2 accessibility.
  - Authored `D2_EXECUTION_AND_DATA_SYSTEM.md` (246 lines): Domain ownership, idempotency, event contracts, retry limits, and sync lifecycle.
  - Authored `D3_GOVERNANCE_AND_EVOLUTION.md` (209 lines): 5-state system tracking (Intended vs Documented vs Implemented vs Deployed vs Observed), phase gates, and blast radius control.

---

### v2.0.0
- **Date**: 2026-08-31
- **Type**: `MAJOR` (Master Monorepo Restructuring & Ecosystem Realignment)
- **Previous Version**: `v1.5.0`

#### Quick Summary
Architectural partition of the repository into a decoupled platform hub (`Aroh/`) and standalone product repositories (`Products/`), governed by machine-readable project manifests.
- **Repository Restructuring**:
  - Root `package.json` configured with npm workspaces.
  - Central platform moved to `Aroh/` containing `apps/web`, `packages/ads`, and `packages/asdk`.
  - External applications placed in `Products/OmniStream` and `Products/Spedex` with strict read-only boundary enforcement.
- **Semantic Project Manifests (`Aroh/manifests/`)**:
  - Standardized on `v1.0.0` manifest schema tracking upstream git hashes, branches, governance merge policies (`downstream_wins` / `deterministic_overwrite`), excluded paths, and protected paths.
- **Automated Verification Harness**:
  - Created initial test runners: `verify-sync-manifests.js`, `test-ai-abstraction.js`, `test-sdk.js`, `test-session-sync.js`, and `e2e-audit.js`.

---

## 3. Architectural Decision Records (ADRs)

### ADR-001: Platform-First Decoupled Hub-and-Spoke Architecture
- **Status**: `ACCEPTED`
- **Context**: Monolithic coupling between apps and platform prevented open-source releases; polyrepo copying resulted in severe code drift.
- **Decision**: Decouple the repository into an administrative Hub (`Aroh/`) and independent Spokes (`Products/`). Products never import platform code. Platform interacts with products only via declarations in `manifests/` and reconcilers.
- **Invariants**: `Products/` is an absolute protected boundary (read-only for all automated platform tools).

### ADR-002: Three-Way Semantic Reconciliation ($B \oplus P \oplus A$)
- **Status**: `ACCEPTED`
- **Context**: File-copying scripts silently overwrote downstream platform customizations whenever upstream products released updates.
- **Decision**: Implement three-way state reconciliation comparing Baseline ($B$), Upstream Product ($P$), and Downstream Canonical Aroh ($A$). Classify artifacts into explicit ownership classes (`protected_downstream`, `shared_contract`, `generated_derivative`).
- **Invariants**: Any concurrent modification ($P \neq B \land A \neq B \land P \neq A$) fails closed with Exit Code 3 (`UNRESOLVED_CONFLICT`).

### ADR-003: Provider-Agnostic AI Tier with Zod Contracts
- **Status**: `ACCEPTED`
- **Context**: Hardcoded OpenAI SDK calls broke when keys expired and prevented local model or alternative provider execution.
- **Decision**: Create `AIOrchestrator` in `@aroh/asdk` with abstract `AIProvider` interface, failover priority list, and Zod payload schema validation. Provide deterministic `MockAIProvider` for test suites.
- **Invariants**: Zero raw external API calls from frontend components.

### ADR-004: Server-Side Financial Authority for Aros Token Ledger
- **Status**: `ACCEPTED`
- **Context**: Client-side wallet balance updates are vulnerable to tampering and client replay attacks.
- **Decision**: Define wallet balance strictly as $\sum \text{LedgerTransactions}$. Direct balance overwrites are prohibited by Firestore security rules and backend API routes.
- **Invariants**: Balances are calculated dynamically from immutable transaction records.

### ADR-005: Zero-Fabrication Showcase Registry
- **Status**: `ACCEPTED`
- **Context**: Hardcoded product cards contained unverified claims, broken links, and hallucinated features.
- **Decision**: Implement `CANONICAL_PRODUCT_REGISTRY` in `@aroh/asdk` with runtime Zod parsing and an automated 115-assertion test suite verifying every URL, description, and capability against authoritative sources.
- **Invariants**: Products without verified public deployments must be designated as `development` status with no fake live URLs.

---

## 4. Capability & Fallback Matrix

| Subsystem | Primary Capability | Degradation Tier 1 (Fallback) | Degradation Tier 2 (Offline) | Failure Mode Classification |
|---|---|---|---|---|
| **Identity & Auth** | Firebase Auth Cloud | LocalStorage cached user | In-memory mock admin | `AUTH_UNAVAILABLE` |
| **Aros Wallet** | Server-side Ledger Math | LocalStorage transaction sync | Read-only balance view | `LEDGER_UNAVAILABLE` |
| **AI Portal** | Gemini / OpenAI API | Anthropic Fallback | Mock Provider echo | `PROVIDER_EXHAUSTED` |
| **Showcase Registry** | Canonical SDK Registry | In-memory fallback objects | Static error card | `REGISTRY_CORRUPTED` |
| **Product Sync CLI** | 3-Way Reconciler | Dry-run plan inspection | Fail closed (Exit 1-7) | `CONFLICT_DETECTED` |

---

## 5. Developer Onboarding Checklist (12-Point Gate)

1. **Clone & Submodules**: Ensure `git submodule update --init --recursive` is executed.
2. **Node Version**: Verify Node.js $\ge$ 18.18.0 (Node 20+ LTS recommended).
3. **Hermetic Test Check**: Run `npm test` in `Aroh/` — expect **227 passing assertions** across 8 test suites.
4. **Production Build Check**: Run `npm run build` in `Aroh/` — expect 14 routes to compile cleanly with Turbopack.
5. **Boundary Inviolability**: Never modify files inside `Products/` during AROH platform tasks.
6. **No Client Balance Overwrite**: Never write directly to `wallet.balance`; use `creditWallet()` or `upgradeMembership()`.
7. **Hydration Protection**: Always guard browser-only APIs (`window`, `localStorage`) behind `isMounted` or `useEffect`.
8. **Zod Validation**: Always parse external or untrusted inputs with Zod schemas.
9. **Showcase Invariant**: Never invent URLs or product features; verify against authoritative sources.
10. **Sync Protocol**: Always run `npm run sync:detect` and `npm run sync:plan` before attempting any reconciliation.
11. **Exit Code Compliance**: Ensure automation scripts handle deterministic exit codes 0 through 7.
12. **Living Architecture**: Update this document and living ADRs upon making any architectural modifications.

---

## 6. The 17-Step Living Architecture Control Loop

Future human engineers and autonomous AI agents must execute development according to this continuous 17-step control loop:

1. **Load Living Architecture Intelligence** (`AROH_LIVING_ARCHITECTURE_INTELLIGENCE.md`)
2. **Load Version History & ADRs** (`VERSION_HISTORY.md`, ADR-001 through ADR-005)
3. **Inspect Actual Repository State** (`git status`, working tree clean, submodules)
4. **Compare Documented vs Implemented State**
5. **Detect Architecture/Code/Documentation Drift**
6. **Verify Protected Boundaries & Ownership** (`Products/` read-only)
7. **Verify Product Registry against Authoritative Sources** (Zero fabrication)
8. **Research Unresolved Architectural Questions** (Primary sources)
9. **Compare Alternatives / Experiment Where Necessary** (Non-destructive prototypes)
10. **Produce Change Architecture + Dependency Graph**
11. **Implement Smallest Correct Change**
12. **Run Hermetic Tests + Regression Suite** (227 passing assertions)
13. **Run Production Build** (Next.js 16 Turbopack, 14 routes)
14. **Browser/Integration Verification** (User journeys, visual parity)
15. **Update Living Architecture + Version History + ADRs**
16. **Re-Run Cognition / Drift Check**
17. **Declare Completion: Parity Reached Across All 5 States**

### The State Parity Law
> **No meaningful difference between what AROH intends, what AROH documents, what AROH implements, what AROH tests, and what AROH actually deploys—unless the difference is explicitly recorded as known state.**

