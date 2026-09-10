# AROH Platform: Canonical Wave 1 Task Manifest

> **Manifest Version**: `1.0.0`
> **Wave Identifier**: `WAVE_01`
> **Governance Authority**: `AROH_LIVING_ARCHITECTURE_INTELLIGENCE.md`, `STATE_RECONCILIATION_REPORT.md`, `STAGE_20_HANDOFF.md`
> **Timestamp**: `2026-09-10T11:35:00+05:30`
> **Starting Commit**: `2f43b6251536ae66f0060d634b54377ac8385ca3`
> **Canonical Remote**: `https://github.com/Aroh-Open-Source/AROH` (`origin/main`)

---

## 1. Executive Summary & Manifest Purpose

This manifest represents the authoritative, machine-verifiable task registry for **AROH Wave 1: Working Tree Harmonization & Manifest Alignment**. Every task is strictly sequenced, bounded, and audited. Progression to subsequent tasks requires passing all validation gates and verifying canonical remote parity.

---

## 2. Authoritative Task Sequence Table

| # | Task ID | Title | Status | Completion SHA | Validation | Products/ | Remote Parity |
|---|---|---|:---:|:---:|:---:|:---:|:---:|
| 1 | `WAVE-01-TASK-01` | Working Tree Harmonization & Submodule Pointer Alignment | `COMPLETED` | `8ce4df0` | `PASS` (227/227) | `VERIFIED` | `VERIFIED` |
| 2 | `WAVE-01-TASK-02` | Spoke Adapter Interface Contract Specification in `@aroh/asdk` | `COMPLETED` | `2f740f7` | `PASS` (239/239) | `VERIFIED` | `VERIFIED` |
| 3 | `WAVE-01-TASK-03` | Manifest Governance Alignment & Decoupled Target Path Policy Audit | `COMPLETED` | `bc8b82b` | `PASS` (239/239) | `VERIFIED` | `VERIFIED` |
| 4 | `WAVE-01-TASK-04` | Monorepo Submodule Alignment & Working Tree Baseline Finalization | `COMPLETED` | `PENDING_COMMIT` | `PASS` (239/239) | `VERIFIED` | `PENDING_PUSH` |

---

## 3. Detailed Task Definitions

### WAVE-01-TASK-01: Working Tree Harmonization & Submodule Pointer Alignment
- **Sequence**: 1
- **Objective**: Align parent git index pointer for `Products/OmniStream` to verified HEAD commit `8eb4ef0`, achieving 100% clean baseline without mutating any files inside `Products/`.
- **Authoritative Source**: `STATE_RECONCILIATION_REPORT.md` Section 4.3 & `LIVING_ARCHITECTURE` Section 10 Item 4.
- **Allowed Scope**: Root git index entry for `Products/OmniStream`, governance version records.
- **Prohibited Scope**: Any modification of files inside `Products/`.
- **Validation**: 227/227 passing test assertions, clean Turbopack build.
- **Handoff**: [WAVE_01_TASK_01_HANDOFF.md](./WAVE_01_TASK_01_HANDOFF.md)
- **Status**: `COMPLETED` (Commit `8ce4df0`).

---

### WAVE-01-TASK-02: Spoke Adapter Interface Contract Specification in `@aroh/asdk`
- **Sequence**: 2
- **Objective**: Define canonical adapter contract required for safely integrating independently-owned products/spokes with AROH without copying, restructuring, mutating, or absorbing their internal implementation.
- **Authoritative Source**: `STATE_RECONCILIATION_REPORT.md` Section 4.2 & `D1`/`D2`/`D3` specifications.
- **Allowed Scope**: `packages/asdk/src/adapters/`, `packages/asdk/tests/adapter-contract.test.ts`, architecture specifications.
- **Prohibited Scope**: Modifying `Products/`, creating speculative adapters for individual products.
- **Validation**: 36/36 ASDK tests passing, 239/239 monorepo tests passing, clean Turbopack build.
- **Handoff**: [WAVE_01_TASK_02_HANDOFF.md](./WAVE_01_TASK_02_HANDOFF.md)
- **Status**: `COMPLETED` (Commit `2f740f7`).

---

### WAVE-01-TASK-03: Manifest Governance Alignment & Decoupled Target Path Policy Audit
- **Sequence**: 3
- **Objective**: Audit all 5 managed manifests against the newly established Spoke Adapter Interface Contract, formally codifying the decoupled targetPath policy (preserving existing paths without modifying product internals) and validating manifest schemas and sync preview behavior.
- **Authoritative Source**: `STATE_RECONCILIATION_REPORT.md` Section 4.2 & `manifests/*.manifest.json`.
- **Allowed Scope**: `manifests/*.manifest.json`, `scripts/verify-sync-manifests.js`, audit handoffs.
- **Prohibited Scope**: Modifying `Products/` files, repointing target paths to non-existent directories.
- **Validation**: `verify-sync-manifests.js` (16 assertions), full `npm test` (239 assertions), Next.js build.
- **Handoff**: [WAVE_01_TASK_03_HANDOFF.md](./WAVE_01_TASK_03_HANDOFF.md)
- **Status**: `COMPLETED` (Commit `bc8b82b`).

---

### WAVE-01-TASK-04: Monorepo Submodule Alignment & Working Tree Baseline Finalization
- **Sequence**: 4
- **Objective**: Align the parent monorepo git index reference for `Products/OmniStream` to its latest upstream-pushed commit `e3e7643`, ensuring 100% clean working tree and full baseline stabilization across the monorepo.
- **Authoritative Source**: `AROH_LIVING_ARCHITECTURE_INTELLIGENCE.md` Section 10 & `STAGE_20_HANDOFF.md`.
- **Allowed Scope**: Root git index entry for `Products/OmniStream`, audit handoffs.
- **Prohibited Scope**: Modifying `Products/` files.
- **Validation**: `git status --short` clean, `npm test` (239 assertions), Next.js build.
- **Handoff**: [WAVE_01_TASK_04_HANDOFF.md](./WAVE_01_TASK_04_HANDOFF.md)
- **Status**: `COMPLETED`.

---

## 4. Completion Summary

- **Total Approved Tasks**: 4
- **Completed**: 4
- **Blocked**: 0
- **Requires Review**: 0
- **Not Started**: 0
