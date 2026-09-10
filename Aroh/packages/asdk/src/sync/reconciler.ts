import * as crypto from "crypto";
import {
  ManagedProjectManifest,
  SyncPlan,
  SyncExecutionResult,
  ArtifactReconciliationItem,
  AuditEntry
} from "./schema";

export function computeSha256(content: string): string {
  try {
    return crypto.createHash("sha256").update(content).digest("hex");
  } catch {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      hash = (hash << 5) - hash + content.charCodeAt(i);
      hash |= 0;
    }
    return `f_${Math.abs(hash).toString(16)}`;
  }
}

export function matchesGlobPattern(filePath: string, pattern: string): boolean {
  const normalizedPath = filePath.replace(/\\/g, "/");
  const normalizedPattern = pattern.replace(/\\/g, "/");

  if (normalizedPattern === normalizedPath || normalizedPath.startsWith(normalizedPattern)) {
    return true;
  }

  const escaped = normalizedPattern
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*\*\//g, "(?:.*/)?")
    .replace(/\*\*/g, ".*")
    .replace(/\*/g, "[^/]*");

  const regex = new RegExp(`^${escaped}$`, "i");
  return regex.test(normalizedPath);
}

export function isContractFile(filePath: string): boolean {
  const lower = filePath.toLowerCase();
  return (
    lower.endsWith(".d.ts") ||
    lower.includes("/schemas/") ||
    lower.includes("/contracts/") ||
    lower.includes("/types/") ||
    lower.includes("/interfaces/") ||
    lower.endsWith(".manifest.json")
  );
}

export function isDesignTokenFile(filePath: string): boolean {
  const lower = filePath.toLowerCase();
  return (
    lower.includes("/tokens/") ||
    lower.includes("/theme/") ||
    lower.includes("tailwind.config") ||
    lower.includes("colors.") ||
    lower.includes("typography.")
  );
}

export function isProductsBoundary(targetPath: string): boolean {
  const normalized = targetPath.replace(/\\/g, "/").replace(/^\/+/, "");
  return normalized.startsWith("Products/") || normalized === "Products";
}

export interface ReconcileOptions {
  productFiles: Record<string, string>; // path -> content
  arohFiles?: Record<string, string>; // path -> content (optional)
  baselineHashes?: Record<string, string>; // path -> hash (optional)
  dryRun?: boolean;
  actor?: string;
  allowConflictOverride?: boolean;
}

export class SemanticReconciler {
  /**
   * Generates a deterministic three-way synchronization plan without modifying files.
   */
  public static planReconciliation(
    manifest: ManagedProjectManifest,
    options: ReconcileOptions
  ): SyncPlan {
    const timestamp = new Date().toISOString();
    const planId = `plan_${manifest.identity.id}_${Date.now()}`;
    const actor = options.actor || "system:sync-reconciler";
    const dryRun = options.dryRun !== false; // default to true (dry-run safe)

    const items: ArtifactReconciliationItem[] = [];
    const productFiles = options.productFiles || {};
    const arohFiles = options.arohFiles || {};
    const baselineHashes = options.baselineHashes || {};

    // Gather all distinct normalized relative paths
    const allPaths = new Set<string>([
      ...Object.keys(productFiles),
      ...Object.keys(arohFiles),
      ...Object.keys(baselineHashes)
    ]);

    const productFileHashes = new Map<string, string>();
    for (const [p, content] of Object.entries(productFiles)) {
      productFileHashes.set(p, computeSha256(content));
    }

    const arohFileHashes = new Map<string, string>();
    for (const [p, content] of Object.entries(arohFiles)) {
      arohFileHashes.set(p, computeSha256(content));
    }

    let unchangedCount = 0;
    let productOnlyCount = 0;
    let arohOnlyCount = 0;
    let conflictsCount = 0;
    let protectedCount = 0;
    let excludedCount = 0;
    let actionsPlannedCount = 0;

    for (const rawPath of allPaths) {
      const relPath = rawPath.replace(/\\/g, "/");

      // 1. Check excluded paths
      const isExcluded = manifest.governance.excludedPaths.some((pattern) =>
        matchesGlobPattern(relPath, pattern)
      );
      if (isExcluded) {
        items.push({
          artifactPath: relPath,
          relativeSourcePath: relPath,
          ownership: "generated_derivative",
          diffCategory: "generated_artifact",
          action: "skip_excluded",
          reason: "File matches manifest excludedPaths pattern (build artifact / transient)."
        });
        excludedCount++;
        continue;
      }

      // 2. Check protected paths
      const isProtected = manifest.governance.protectedPaths.some((pattern) =>
        matchesGlobPattern(relPath, pattern)
      );

      const pContent = productFiles[rawPath];
      const aContent = arohFiles[rawPath];
      const pHash = pContent !== undefined ? productFileHashes.get(rawPath) : undefined;
      const aHash = aContent !== undefined ? arohFileHashes.get(rawPath) : undefined;
      const bHash = baselineHashes[rawPath];

      // If marked protected in manifest: ALWAYS preserve downstream customization
      if (isProtected) {
        items.push({
          artifactPath: relPath,
          relativeSourcePath: relPath,
          canonicalArohPath: relPath,
          ownership: "protected_downstream",
          diffCategory: pHash !== aHash ? "compatible_divergent" : "unchanged",
          baselineHash: bHash,
          productHash: pHash,
          arohHash: aHash,
          action: "preserve_protected",
          reason: "Preserving intentional downstream adaptation (protected in project manifest)."
        });
        protectedCount++;
        continue;
      }

      // 3. Absolute Products/ Protection check:
      // If canonical path targets inside Products/, writing to it as an Aroh operation is strictly blocked
      if (isProductsBoundary(relPath)) {
        items.push({
          artifactPath: relPath,
          relativeSourcePath: relPath,
          ownership: "product_owned",
          diffCategory: "unknown",
          action: "preserve_protected",
          reason: "Strict Products/ boundary: independent product folders are protected and read-only.",
          conflict: {
            category: "protected_violation",
            description: "Attempted synchronization into Products/ directory",
            impact: "critical",
            requiredResolution: "Products/ directory must remain untouched."
          }
        });
        conflictsCount++;
        continue;
      }

      // 4. Three-Way Content Evaluation
      const existsInProduct = pHash !== undefined;
      const existsInAroh = aHash !== undefined;
      const existsInBase = bHash !== undefined;

      // Case A: Unchanged across all available states
      if (existsInProduct && existsInAroh && pHash === aHash) {
        items.push({
          artifactPath: relPath,
          relativeSourcePath: relPath,
          canonicalArohPath: relPath,
          ownership: isContractFile(relPath) ? "shared_contract" : "product_owned",
          diffCategory: "unchanged",
          baselineHash: bHash,
          productHash: pHash,
          arohHash: aHash,
          action: "noop_unchanged",
          reason: "Artifact content is identical between Product and Aroh."
        });
        unchangedCount++;
        continue;
      }

      // Case B: Product-only modification (Baseline exists and matches Aroh, but Product changed)
      if (existsInProduct && existsInAroh && existsInBase && bHash === aHash && pHash !== bHash) {
        const isContract = isContractFile(relPath);
        items.push({
          artifactPath: relPath,
          relativeSourcePath: relPath,
          canonicalArohPath: relPath,
          ownership: isContract ? "shared_contract" : "product_owned",
          diffCategory: "product_only_change",
          baselineHash: bHash,
          productHash: pHash,
          arohHash: aHash,
          action: isContract ? "reconcile_contract" : "accept_product_change",
          reason: isContract
            ? "Product modified shared contract; reconcile into canonical Aroh representation."
            : "Product internal modification; track update in manifest metadata."
        });
        productOnlyCount++;
        actionsPlannedCount++;
        continue;
      }

      // Case C: Aroh-only modification (Baseline exists and matches Product, but Aroh changed)
      if (existsInProduct && existsInAroh && existsInBase && bHash === pHash && aHash !== bHash) {
        items.push({
          artifactPath: relPath,
          relativeSourcePath: relPath,
          canonicalArohPath: relPath,
          ownership: "aroh_owned",
          diffCategory: "aroh_only_change",
          baselineHash: bHash,
          productHash: pHash,
          arohHash: aHash,
          action: "preserve_aroh_change",
          reason: "Preserving Aroh platform adaptations (Aroh-owned modification)."
        });
        arohOnlyCount++;
        continue;
      }

      // Case D: Both modified, but arrived at identical content (Synchronized equivalent)
      if (existsInProduct && existsInAroh && existsInBase && pHash === aHash && pHash !== bHash) {
        items.push({
          artifactPath: relPath,
          relativeSourcePath: relPath,
          canonicalArohPath: relPath,
          ownership: isContractFile(relPath) ? "shared_contract" : "product_owned",
          diffCategory: "synchronized_equivalent",
          baselineHash: bHash,
          productHash: pHash,
          arohHash: aHash,
          action: "noop_unchanged",
          reason: "Both sides converged on equivalent content independently."
        });
        unchangedCount++;
        continue;
      }

      // Case E: True Conflict: Both sides modified with divergent hashes
      if (existsInProduct && existsInAroh && pHash !== aHash) {
        items.push({
          artifactPath: relPath,
          relativeSourcePath: relPath,
          canonicalArohPath: relPath,
          ownership: isContractFile(relPath) ? "shared_contract" : "ambiguous",
          diffCategory: "conflicting_change",
          baselineHash: bHash,
          productHash: pHash,
          arohHash: aHash,
          action: "block_conflict",
          reason: "Concurrent divergent changes detected between Product and Aroh.",
          conflict: {
            category: "concurrent_modification",
            description: `Divergent modification: Product hash (${pHash?.slice(0, 8)}) != Aroh hash (${aHash?.slice(0, 8)})`,
            impact: "high",
            requiredResolution: "Manual architectural reconciliation required; cannot silently overwrite."
          }
        });
        conflictsCount++;
        continue;
      }

      // Case F: Deletion requiring review (Exists in Base & Aroh, but missing in Product)
      if (!existsInProduct && existsInAroh) {
        items.push({
          artifactPath: relPath,
          relativeSourcePath: relPath,
          canonicalArohPath: relPath,
          ownership: "aroh_owned",
          diffCategory: "deletion_requiring_review",
          baselineHash: bHash,
          arohHash: aHash,
          action: "flag_for_review",
          reason: "Artifact was removed upstream but exists in Aroh; manual confirmation required."
        });
        actionsPlannedCount++;
        continue;
      }

      // Case G: Addition requiring mapping (New in Product, not in Aroh)
      if (existsInProduct && !existsInAroh) {
        const isContract = isContractFile(relPath);
        items.push({
          artifactPath: relPath,
          relativeSourcePath: relPath,
          canonicalArohPath: relPath,
          ownership: isContract ? "shared_contract" : "product_owned",
          diffCategory: "addition_requiring_mapping",
          productHash: pHash,
          action: isContract ? "reconcile_contract" : "accept_product_change",
          reason: isContract
            ? "New public contract introduced; map to Aroh ecosystem SDK."
            : "New product-local feature; track in manifest modifiedFiles."
        });
        productOnlyCount++;
        actionsPlannedCount++;
        continue;
      }

      // Fallback
      items.push({
        artifactPath: relPath,
        relativeSourcePath: relPath,
        ownership: "ambiguous",
        diffCategory: "unknown",
        action: "flag_for_review",
        reason: "Undetermined artifact boundary."
      });
    }

    // Check package.json dependency drift
    if (productFiles["package.json"]) {
      try {
        const pkg = JSON.parse(productFiles["package.json"]);
        const productDeps = { ...pkg.dependencies, ...pkg.devDependencies };
        const requiredDeps = manifest.compatibility.dependencies || {};

        for (const [dep, reqVersion] of Object.entries(requiredDeps)) {
          if (productDeps[dep] && productDeps[dep] !== reqVersion) {
            items.push({
              artifactPath: "package.json",
              relativeSourcePath: "package.json",
              canonicalArohPath: "package.json",
              ownership: "shared_contract",
              diffCategory: "compatible_divergent",
              action: "flag_for_review",
              reason: `Dependency divergence detected for '${dep}': Product uses '${productDeps[dep]}', Aroh manifest specifies '${reqVersion}'.`,
              conflict: {
                category: "dependency_incompatibility",
                description: `Version discrepancy on ecosystem dependency '${dep}'`,
                impact: "medium",
                requiredResolution: "Reconcile dependency versions across workspace or update manifest compatibility."
              }
            });
            conflictsCount++;
          }
        }
      } catch {
        // Ignore JSON parse errors in mock/test payloads
      }
    }

    const hasConflicts = conflictsCount > 0;
    const isClean = !hasConflicts && actionsPlannedCount === 0;

    return {
      planId,
      projectId: manifest.identity.id,
      timestamp,
      dryRun,
      isClean,
      hasConflicts,
      sourceCommit: manifest.identity.commitHash,
      targetPath: manifest.identity.targetPath,
      items,
      summary: {
        totalDetected: items.length,
        unchanged: unchangedCount,
        productOnly: productOnlyCount,
        arohOnly: arohOnlyCount,
        conflicts: conflictsCount,
        protectedPreserved: protectedCount,
        excludedIgnored: excludedCount,
        actionsPlanned: actionsPlannedCount
      },
      protectedBoundaryEnforced: true,
      validationRequirements: [
        "npm run test:aroh",
        "npm run build:aroh",
        "verify-sync-manifests"
      ],
      auditMetadata: {
        actor,
        generatedAt: timestamp,
        manifestVersion: manifest.identity.upstreamVersion
      }
    };
  }

  /**
   * Safely executes a reconciliation plan.
   * If dryRun is true, NO disk mutation occurs.
   * If conflicts exist and allowConflictOverride is not set, fails closed.
   */
  public static executeReconciliation(
    manifest: ManagedProjectManifest,
    plan: SyncPlan,
    options: { dryRun?: boolean; actor?: string; allowConflictOverride?: boolean } = {}
  ): SyncExecutionResult {
    const isDryRun = options.dryRun !== undefined ? options.dryRun : plan.dryRun;
    const actor = options.actor || plan.auditMetadata.actor || "system:sync-engine";
    const timestamp = new Date().toISOString();

    // 1. Fail closed on unresolved conflicts
    if (plan.hasConflicts && !options.allowConflictOverride) {
      const conflictDescriptions = plan.items
        .filter((i) => i.conflict)
        .map((i) => `${i.artifactPath}: ${i.conflict?.description}`);

      return {
        planId: plan.planId,
        projectId: manifest.identity.id,
        timestamp,
        dryRun: isDryRun,
        success: false,
        appliedActionsCount: 0,
        skippedProtectedCount: plan.summary.protectedPreserved,
        conflictsBlockedCount: plan.summary.conflicts,
        manifestUpdated: false,
        auditEntry: {
          timestamp,
          action: "RECONCILIATION_ABORTED_CONFLICTS",
          actor,
          details: `Reconciliation halted due to ${plan.summary.conflicts} unresolved conflict(s). Fail-safe triggered.`
        },
        errors: conflictDescriptions
      };
    }

    // 2. Fail closed on attempt to write directly into Products/
    const illegalProductsWrite = plan.items.some(
      (i) =>
        i.action !== "preserve_protected" &&
        i.action !== "skip_excluded" &&
        i.action !== "noop_unchanged" &&
        isProductsBoundary(i.artifactPath)
    );

    if (illegalProductsWrite) {
      return {
        planId: plan.planId,
        projectId: manifest.identity.id,
        timestamp,
        dryRun: isDryRun,
        success: false,
        appliedActionsCount: 0,
        skippedProtectedCount: plan.summary.protectedPreserved,
        conflictsBlockedCount: plan.summary.conflicts,
        manifestUpdated: false,
        auditEntry: {
          timestamp,
          action: "RECONCILIATION_BLOCKED_PROTECTION",
          actor,
          details: "Operation attempted to write directly to protected Products/ directory."
        },
        errors: ["Security invariant violation: Direct modification of Products/ is forbidden."]
      };
    }

    // 3. Dry-run mode: return calculated statistics without mutating manifest or disk
    if (isDryRun) {
      return {
        planId: plan.planId,
        projectId: manifest.identity.id,
        timestamp,
        dryRun: true,
        success: true,
        appliedActionsCount: 0,
        skippedProtectedCount: plan.summary.protectedPreserved,
        conflictsBlockedCount: plan.summary.conflicts,
        manifestUpdated: false,
        auditEntry: {
          timestamp,
          action: "RECONCILIATION_DRY_RUN",
          actor,
          details: `Dry-run completed successfully. Planned actions: ${plan.summary.actionsPlanned}, Protected preserved: ${plan.summary.protectedPreserved}. Zero mutations executed.`
        },
        errors: []
      };
    }

    // 4. Safe application: Update manifest metadata, provenance, and audit trail
    let appliedCount = 0;
    const modifiedSet = new Set(manifest.metadata.modifiedFiles);

    for (const item of plan.items) {
      if (item.action === "accept_product_change" || item.action === "reconcile_contract") {
        modifiedSet.add(item.artifactPath);
        appliedCount++;
      }
    }

    manifest.metadata.modifiedFiles = Array.from(modifiedSet);
    manifest.metadata.lastSyncedAt = timestamp;

    const auditEntry: AuditEntry = {
      timestamp,
      action: "RECONCILIATION_APPLIED",
      actor,
      details: `Reconciliation executed: ${appliedCount} actions applied, ${plan.summary.protectedPreserved} protected preserved, Products/ boundary intact.`
    };

    manifest.metadata.auditTrail.push(auditEntry);

    return {
      planId: plan.planId,
      projectId: manifest.identity.id,
      timestamp,
      dryRun: false,
      success: true,
      appliedActionsCount: appliedCount,
      skippedProtectedCount: plan.summary.protectedPreserved,
      conflictsBlockedCount: plan.summary.conflicts,
      manifestUpdated: true,
      auditEntry,
      errors: []
    };
  }
}
