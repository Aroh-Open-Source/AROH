# AROH Platform Architecture: Spoke Adapter Interface Contract Specification

> **Specification Identifier**: `AROH-SPEC-ADAPTER-V1.0`
> **Target Module**: `@aroh/asdk/adapters`
> **Governance Authority**: `D1_EXPERIENCE_AND_BEHAVIOR.md`, `D2_EXECUTION_AND_DATA_SYSTEM.md`, `D3_GOVERNANCE_AND_EVOLUTION.md`
> **Status**: `APPROVED_CANONICAL_SPECIFICATION`
> **Timestamp**: `2026-09-10T11:30:00+05:30`
> **Monorepo Directory**: `Aroh/packages/asdk/src/adapters/`

---

## 1. Executive Summary & Design Rationale

The **AROH Spoke Adapter Interface Contract** establishes the mathematical, architectural, and security boundary for integrating autonomous, independently-owned applications ("spokes") with the central AROH Platform Hub without copying, restructuring, mutating, or absorbing their internal implementation.

In traditional monorepos, external products become entangled with parent framework code, destroying standalone portability. In naive multi-repo systems, products drift, contracts diverge, and client security is compromised.

The AROH Adapter architecture resolves this by enforcing a **zero-coupling, decoupled boundary**:
1. **Decoupled Hub-and-Spoke**: Spokes maintain their own independent git trees, tech stacks (Spring Boot, Expo, React, Next.js), and distribution models.
2. **Absolute `Products/` Inviolability**: The `Products/` directory is an inviolable inspection barrier. Platform tooling can never mutate files inside `Products/`.
3. **Zero Fabrication**: Every capability, URL, status, and health metric is tracked under a strict 7-level provenance taxonomy.
4. **Deterministic Failure & Graceful Degradation**: If a spoke is unreachable, the platform degrades gracefully to showcase-only mode with zero runtime crashes or financial vulnerabilities.

---

## 2. The 7-Level Provenance & Verification Taxonomy

To eliminate hallucinated features, dead URLs, or unverified claims, every fact ingested or exposed by an adapter is assigned an explicit provenance state:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   SEVEN-LEVEL PROVENANCE & VERIFICATION TAXONOMY             │
├──────────────────────┬──────────────────────────────────────────────────────┤
│ State                │ Engineering Definition                               │
├──────────────────────┼──────────────────────────────────────────────────────┤
│ VERIFIED             │ Confirmed via automated probe, git commit, or build. │
│ IMPLEMENTED-REPORTED │ Reported in code/PR but awaiting live verification.  │
│ DOCUMENTED           │ Described in authoritative upstream README or docs.  │
│ INFERRED             │ Derived logically from configuration or dependency.  │
│ PROPOSED             │ Planned or proposed in an approved roadmap/RFC.      │
│ UNKNOWN              │ Field state cannot be established; fail-closed.     │
│ SUPERSEDED           │ Deprecated or replaced by a subsequent version.      │
└──────────────────────┴──────────────────────────────────────────────────────┘
```

---

## 3. Boundary Definitions

### 3.1 Ownership Boundary (`OwnershipBoundarySchema`)
- **`external_spoke`**: Independently hosted, external product (e.g., Nebula, Music Mirror). Communicates exclusively via public HTTPS / webhooks.
- **`submodule_spoke`**: Independent Git repository checked out as a read-only Git submodule under `Products/` (e.g., OmniStream, SpeDex).
- **`platform_internal`**: Core services owned directly by the AROH platform hub (e.g., Aros Wallet Ledger, CMS Alerts).

### 3.2 Inspection Boundary (`InspectionBoundarySchema`)
- **`inviolable_boundary`**: Hard barrier preventing mutation by any platform tooling, build script, or synchronization CLI.
- **`read_only_tree`**: Local filesystem inspection permitted strictly for static analysis and metadata discovery; file writes are forbidden.
- **`subproject_gitlink`**: Parent repository tracks only the 160000 commit gitlink; submodule HEAD is self-governed.
- **`external_remote`**: Inspected strictly via remote HTTP/Git APIs with zero local filesystem footprint.

---

## 4. Contract Specification Structure

The canonical TypeScript and Zod schema is exported from `@aroh/asdk`:

```typescript
export interface SpokeAdapterContract {
  spokeId: string;
  displayName: string;
  ownershipBoundary: "external_spoke" | "submodule_spoke" | "platform_internal";
  inspectionBoundary: "read_only_tree" | "subproject_gitlink" | "external_remote" | "inviolable_boundary";
  sourceProvenance: {
    repositoryUrl: string;
    branch: string;
    commitRef?: string;
    verificationState: ProvenanceVerificationState;
  };
  launchUrl: {
    url: string;
    kind: "external_web" | "internal_route" | "deep_link" | "sandbox";
    verificationState: ProvenanceVerificationState;
    isAlive?: boolean;
  };
  docsUrl?: string;
  apiEndpoint?: string;
  healthCheck: {
    status: "healthy" | "degraded" | "unreachable" | "offline" | "maintenance" | "unknown";
    lastCheckedAt: string;
    latencyMs?: number;
    endpoint?: string;
    message?: string;
  };
  capabilities: Array<{
    id: string;
    title: string;
    description: string;
    status: "available" | "preview" | "deprecated" | "unavailable";
    requiredTier: "basic" | "pro" | "enterprise";
    verificationState: ProvenanceVerificationState;
  }>;
  permissions: {
    allowedArosOperations: Array<"read_balance" | "request_debit" | "request_credit" | "webhook_subscribe">;
    requiresUserConsent: boolean;
    rateLimitRpm: number;
    roleRequirement: "user" | "operator" | "admin";
  };
  syncBinding: {
    manifestPath: string;
    mergeStrategy: "deterministic_overwrite" | "downstream_wins" | "upstream_wins" | "ast_merge" | "manual_review";
    protectedPaths: string[];
    targetConsumerPath: string; // Must NEVER resolve inside Products/
  };
  compatibility: {
    contractVersion: string;
    minimumAsdkVersion: string;
    compatibleEcosystemVersions: string[];
  };
  lastVerifiedAt: string;
  metadataProvenance: ProvenanceVerificationState;
}
```

---

## 5. Security & Authorization Boundary

1. **Least Privilege**: Spokes cannot directly mutate wallet balances or execute arbitrary database writes. All balance updates require signed platform API requests through the Aros Ledger.
2. **Explicit User Consent**: Any operation with `requiresUserConsent: true` prompts the user before authorizing spoke communication.
3. **Rate Limiting**: Enforces tier-gated request thresholds (`rateLimitRpm`) preventing denial-of-service or uncontrolled ledger querying.
4. **Inviolable Target Path**: `SpokeSyncBindingSchema` strictly enforces that `targetConsumerPath` cannot resolve to `Products/`. Any attempt to configure `Products/` as a consumer destination immediately throws a validation error.

---

## 6. Health Probe & Safe Degradation Model

When an external spoke suffers an outage or network timeout:
- `isSpokeOperational(health)` returns `false`.
- The platform transitions the spoke UI into **Degraded Showcase Mode**:
  - The public explore card displays a "Service Unavailable / Degraded" status banner.
  - Interactive communication buttons fail closed with actionable user alerts instead of unhandled exceptions.
  - Financial debit operations are blocked immediately.
