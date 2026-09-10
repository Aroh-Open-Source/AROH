#!/usr/bin/env node

/**
 * AROH Synchronization Command Interface (CLI)
 * 
 * Stable CLI/API contract for safe product-to-monorepo reconciliation.
 * Read-only by default. Strict Products/ boundary protection.
 */

const fs = require("fs");
const path = require("path");
const {
  validateProjectManifest,
  SemanticReconciler,
  computeSha256,
  isProductsBoundary
} = require("../packages/asdk");

const EXIT_CODES = {
  SUCCESS: 0,
  SYNC_FAILED: 1,
  VALIDATION_ERROR: 2,
  UNRESOLVED_CONFLICT: 3,
  STALE_BASELINE: 4,
  PROTECTED_BOUNDARY_VIOLATION: 5,
  INVALID_PRODUCT: 6,
  PLAN_UNAVAILABLE: 7
};

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0] || "status";

function parseFlag(flag) {
  const idx = args.indexOf(flag);
  if (idx !== -1 && args[idx + 1] && !args[idx + 1].startsWith("--")) {
    return args[idx + 1];
  }
  return null;
}

const hasFlag = (flag) => args.includes(flag);

const isJson = hasFlag("--json");
const isConfirm = hasFlag("--confirm");
const isNonInteractive = hasFlag("--non-interactive");
const productFilter = parseFlag("--product");
const outputFile = parseFlag("--output");
const planFile = parseFlag("--plan");
const scopeArg = parseFlag("--scope");

const manifestsDir = path.join(__dirname, "..", "manifests");
const arohRootDir = path.join(__dirname, "..");
const repoRootDir = path.join(arohRootDir, "..");

function outputResult(data, humanPrinter, exitCode = EXIT_CODES.SUCCESS) {
  if (isJson) {
    console.log(JSON.stringify(data, null, 2));
  } else {
    humanPrinter(data);
  }
  process.exit(exitCode);
}

function loadAllManifests() {
  if (!fs.existsSync(manifestsDir)) {
    outputResult(
      { command, status: "error", errors: ["Manifests directory not found"] },
      () => console.error("❌ Manifests directory not found."),
      EXIT_CODES.VALIDATION_ERROR
    );
  }

  const files = fs.readdirSync(manifestsDir).filter((f) => f.endsWith(".manifest.json"));
  const manifests = [];

  for (const f of files) {
    const filePath = path.join(manifestsDir, f);
    try {
      const raw = fs.readFileSync(filePath, "utf-8").replace(/^\uFEFF/, "");
      const parsed = JSON.parse(raw);
      const manifest = validateProjectManifest(parsed);
      manifests.push({ manifest, filePath });
    } catch (err) {
      outputResult(
        {
          command,
          status: "error",
          errors: [`Malformed manifest '${f}': ${err.message}`]
        },
        () => console.error(`❌ Malformed manifest '${f}': ${err.message}`),
        EXIT_CODES.VALIDATION_ERROR
      );
    }
  }

  return manifests;
}

function resolveProduct(manifestEntries, productName) {
  if (!productName) return null;
  const lower = productName.toLowerCase().trim();

  for (const entry of manifestEntries) {
    const id = entry.manifest.identity.id.toLowerCase();
    const name = entry.manifest.identity.name.toLowerCase();

    if (id === lower || id === `${lower}-core` || name === lower || name.startsWith(lower)) {
      return entry;
    }
  }

  return null;
}

function scanProductFilesSafely(targetPath) {
  // Always read-only inspection. Never mutate anything.
  const resolved = path.isAbsolute(targetPath) ? targetPath : path.join(repoRootDir, targetPath);
  const files = {};

  if (!fs.existsSync(resolved)) {
    return files;
  }

  function walk(currentDir, relativePrefix) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const ent of entries) {
      if (
        ent.name === "node_modules" ||
        ent.name === ".git" ||
        ent.name === ".next" ||
        ent.name === "dist" ||
        ent.name === "build" ||
        ent.name === "target"
      ) {
        continue;
      }

      const fullPath = path.join(currentDir, ent.name);
      const relPath = relativePrefix ? `${relativePrefix}/${ent.name}` : ent.name;

      if (ent.isDirectory()) {
        walk(fullPath, relPath);
      } else if (ent.isFile()) {
        try {
          const content = fs.readFileSync(fullPath, "utf-8");
          files[relPath] = content;
        } catch {
          // Ignore unreadable or binary files in safe scan
        }
      }
    }
  }

  try {
    walk(resolved, "");
  } catch {
    // Fail-safe graceful fallback
  }

  return files;
}

// ============================================================================
// COMMAND ROUTING
// ============================================================================

const allEntries = loadAllManifests();

if (productFilter) {
  const resolved = resolveProduct(allEntries, productFilter);
  if (!resolved) {
    outputResult(
      {
        command,
        product: productFilter,
        status: "error",
        errors: [`Unknown or unregistered product: '${productFilter}'`]
      },
      () => console.error(`❌ Unknown or unregistered product: '${productFilter}'`),
      EXIT_CODES.INVALID_PRODUCT
    );
  }
}

// 1. AROH SYNC STATUS
if (command === "status") {
  const entriesToReport = productFilter
    ? [resolveProduct(allEntries, productFilter)]
    : allEntries;

  const statusList = entriesToReport.map(({ manifest }) => {
    const productFiles = scanProductFilesSafely(manifest.identity.targetPath);
    const plan = SemanticReconciler.planReconciliation(manifest, { productFiles });

    return {
      id: manifest.identity.id,
      name: manifest.identity.name,
      targetPath: manifest.identity.targetPath,
      upstreamVersion: manifest.identity.upstreamVersion,
      syncPolicy: manifest.governance.syncPolicy,
      lastSyncedAt: manifest.metadata.lastSyncedAt,
      isClean: plan.isClean,
      hasConflicts: plan.hasConflicts,
      pendingActions: plan.summary.actionsPlanned,
      conflictsCount: plan.summary.conflicts,
      protectedPreserved: plan.summary.protectedPreserved
    };
  });

  const allClean = statusList.every((s) => s.isClean);
  const anyConflicts = statusList.some((s) => s.hasConflicts);

  outputResult(
    {
      command: "status",
      product: productFilter || "all",
      status: anyConflicts ? "conflicts" : allClean ? "synchronized" : "pending_sync",
      baseline: statusList,
      conflicts: statusList.filter((s) => s.hasConflicts),
      result: { count: statusList.length, allClean, anyConflicts },
      errors: [],
      warnings: []
    },
    (res) => {
      console.log("=================================================");
      console.log(" AROH Ecosystem Synchronization Status          ");
      console.log("=================================================");
      for (const item of res.baseline) {
        const icon = item.hasConflicts ? "⚠️ " : item.isClean ? "✓ " : "⏳ ";
        console.log(`\n${icon}Product: ${item.name} (${item.id})`);
        console.log(`   Target Path:      ${item.targetPath}`);
        console.log(`   Upstream Version: ${item.upstreamVersion}`);
        console.log(`   Policy:           ${item.syncPolicy}`);
        console.log(`   Last Synced At:   ${item.lastSyncedAt || "Never"}`);
        console.log(`   Status:           ${item.hasConflicts ? "CONFLICTS DETECTED" : item.isClean ? "SYNCHRONIZED (Clean)" : "PENDING ACTIONS"}`);
        console.log(`   Planned Actions:  ${item.pendingActions} | Protected Preserved: ${item.protectedPreserved}`);
      }
      console.log("\n=================================================");
    },
    anyConflicts ? EXIT_CODES.UNRESOLVED_CONFLICT : EXIT_CODES.SUCCESS
  );
}

// 2. AROH SYNC INSPECT
else if (command === "inspect") {
  if (!productFilter) {
    outputResult(
      { command, status: "error", errors: ["The inspect command requires --product <product>"] },
      () => console.error("❌ The inspect command requires --product <product>."),
      EXIT_CODES.VALIDATION_ERROR
    );
  }

  const { manifest } = resolveProduct(allEntries, productFilter);

  outputResult(
    {
      command: "inspect",
      product: manifest.identity.id,
      status: "inspected",
      baseline: {
        identity: manifest.identity,
        governance: manifest.governance,
        compatibility: manifest.compatibility,
        metadata: {
          lastSyncedAt: manifest.metadata.lastSyncedAt,
          modifiedFilesCount: manifest.metadata.modifiedFiles.length,
          migrationHistoryCount: manifest.metadata.migrationHistory.length,
          auditTrailCount: manifest.metadata.auditTrail.length
        }
      },
      protectedPaths: manifest.governance.protectedPaths,
      validation: { isValid: true },
      result: { manifest },
      errors: [],
      warnings: []
    },
    (res) => {
      const m = res.result.manifest;
      console.log("=================================================");
      console.log(` AROH Product Inspection: ${m.identity.name}`);
      console.log("=================================================");
      console.log(` ID:               ${m.identity.id}`);
      console.log(` Upstream URL:     ${m.identity.upstreamUrl}`);
      console.log(` Target Path:      ${m.identity.targetPath}`);
      console.log(` Ownership:        ${m.identity.ownership}`);
      console.log(` Upstream Version: ${m.identity.upstreamVersion} (commit: ${m.identity.commitHash})`);
      console.log(` Sync Policy:      ${m.governance.syncPolicy}`);
      console.log(` Merge Strategy:   ${m.governance.mergeStrategy}`);
      console.log(` Protected Paths:  ${m.governance.protectedPaths.join(", ") || "none"}`);
      console.log(` Excluded Paths:   ${m.governance.excludedPaths.join(", ") || "none"}`);
      console.log(` Dependencies:     ${JSON.stringify(m.compatibility.dependencies)}`);
      console.log(` Last Synced:      ${m.metadata.lastSyncedAt}`);
      console.log("=================================================");
    }
  );
}

// 3. AROH SYNC DETECT
else if (command === "detect") {
  if (!productFilter) {
    outputResult(
      { command, status: "error", errors: ["The detect command requires --product <product>"] },
      () => console.error("❌ The detect command requires --product <product>."),
      EXIT_CODES.VALIDATION_ERROR
    );
  }

  const { manifest } = resolveProduct(allEntries, productFilter);
  const productFiles = scanProductFilesSafely(manifest.identity.targetPath);
  const plan = SemanticReconciler.planReconciliation(manifest, { productFiles });

  const classified = {
    modifications: plan.items.filter((i) => i.diffCategory === "product_only_change"),
    additions: plan.items.filter((i) => i.diffCategory === "addition_requiring_mapping"),
    deletions: plan.items.filter((i) => i.diffCategory === "deletion_requiring_review"),
    divergences: plan.items.filter((i) => i.diffCategory === "compatible_divergent"),
    conflicts: plan.items.filter((i) => i.diffCategory === "conflicting_change"),
    protected: plan.items.filter((i) => i.action === "preserve_protected"),
    generated: plan.items.filter((i) => i.action === "skip_excluded")
  };

  outputResult(
    {
      command: "detect",
      product: manifest.identity.id,
      status: plan.hasConflicts ? "conflicts_detected" : "detected",
      changes: classified,
      conflicts: classified.conflicts,
      protectedPaths: manifest.governance.protectedPaths,
      result: plan.summary,
      errors: [],
      warnings: []
    },
    (res) => {
      console.log("=================================================");
      console.log(` Change Detection: ${manifest.identity.name}`);
      console.log("=================================================");
      console.log(` Total Artifacts Inspected: ${res.result.totalDetected}`);
      console.log(` Additions:                 ${res.changes.additions.length}`);
      console.log(` Modifications:             ${res.changes.modifications.length}`);
      console.log(` Protected Preserved:       ${res.changes.protected.length}`);
      console.log(` Excluded / Generated:      ${res.changes.generated.length}`);
      console.log(` Conflicts:                 ${res.changes.conflicts.length}`);
      console.log("=================================================");
    },
    plan.hasConflicts ? EXIT_CODES.UNRESOLVED_CONFLICT : EXIT_CODES.SUCCESS
  );
}

// 4. AROH SYNC DIFF
else if (command === "diff") {
  if (!productFilter) {
    outputResult(
      { command, status: "error", errors: ["The diff command requires --product <product>"] },
      () => console.error("❌ The diff command requires --product <product>."),
      EXIT_CODES.VALIDATION_ERROR
    );
  }

  const { manifest } = resolveProduct(allEntries, productFilter);
  const productFiles = scanProductFilesSafely(manifest.identity.targetPath);
  const plan = SemanticReconciler.planReconciliation(manifest, { productFiles });

  outputResult(
    {
      command: "diff",
      product: manifest.identity.id,
      status: "diff_computed",
      baseline: { commit: manifest.identity.commitHash, version: manifest.identity.upstreamVersion },
      changes: plan.items.filter((i) => i.diffCategory !== "unchanged"),
      conflicts: plan.items.filter((i) => i.conflict),
      result: { totalDiffItems: plan.items.filter((i) => i.diffCategory !== "unchanged").length },
      errors: [],
      warnings: []
    },
    (res) => {
      console.log("=================================================");
      console.log(` Three-Way Logical Diff: ${manifest.identity.name}`);
      console.log("=================================================");
      for (const item of res.changes) {
        console.log(` • [${item.diffCategory}] ${item.artifactPath}`);
        console.log(`   Ownership: ${item.ownership} | Action: ${item.action}`);
        console.log(`   Reason:    ${item.reason}`);
        if (item.conflict) {
          console.log(`   ⚠️ Conflict: ${item.conflict.description}`);
        }
      }
      console.log("=================================================");
    },
    plan.hasConflicts ? EXIT_CODES.UNRESOLVED_CONFLICT : EXIT_CODES.SUCCESS
  );
}

// 5. AROH SYNC PLAN
else if (command === "plan") {
  if (!productFilter) {
    outputResult(
      { command, status: "error", errors: ["The plan command requires --product <product>"] },
      () => console.error("❌ The plan command requires --product <product>."),
      EXIT_CODES.VALIDATION_ERROR
    );
  }

  const { manifest } = resolveProduct(allEntries, productFilter);
  const productFiles = scanProductFilesSafely(manifest.identity.targetPath);
  const plan = SemanticReconciler.planReconciliation(manifest, { productFiles, dryRun: true });

  if (outputFile) {
    fs.writeFileSync(path.resolve(outputFile), JSON.stringify(plan, null, 2), "utf-8");
  }

  outputResult(
    {
      command: "plan",
      product: manifest.identity.id,
      status: plan.hasConflicts ? "plan_has_conflicts" : "plan_ready",
      plan,
      conflicts: plan.items.filter((i) => i.conflict),
      protectedPaths: manifest.governance.protectedPaths,
      validation: { requirements: plan.validationRequirements },
      result: { planId: plan.planId, actionsPlanned: plan.summary.actionsPlanned },
      errors: [],
      warnings: []
    },
    (res) => {
      console.log("=================================================");
      console.log(` Synchronization Plan: ${manifest.identity.name}`);
      console.log("=================================================");
      console.log(` Plan ID:              ${res.plan.planId}`);
      console.log(` Status:               ${res.status}`);
      console.log(` Planned Actions:      ${res.plan.summary.actionsPlanned}`);
      console.log(` Protected Preserved:  ${res.plan.summary.protectedPreserved}`);
      console.log(` Conflicts Blocked:    ${res.plan.summary.conflicts}`);
      console.log(` Products/ Protected:  ENFORCED (Read-only)`);
      if (outputFile) {
        console.log(` Plan saved to:        ${outputFile}`);
      }
      console.log("=================================================");
    },
    plan.hasConflicts ? EXIT_CODES.UNRESOLVED_CONFLICT : EXIT_CODES.SUCCESS
  );
}

// 6. AROH SYNC DRY-RUN
else if (command === "dry-run") {
  if (!productFilter) {
    outputResult(
      { command, status: "error", errors: ["The dry-run command requires --product <product>"] },
      () => console.error("❌ The dry-run command requires --product <product>."),
      EXIT_CODES.VALIDATION_ERROR
    );
  }

  const { manifest } = resolveProduct(allEntries, productFilter);
  const productFiles = scanProductFilesSafely(manifest.identity.targetPath);
  const plan = SemanticReconciler.planReconciliation(manifest, { productFiles, dryRun: true });
  const execResult = SemanticReconciler.executeReconciliation(manifest, plan, { dryRun: true });

  outputResult(
    {
      command: "dry-run",
      product: manifest.identity.id,
      status: execResult.success ? "dry_run_success" : "dry_run_failed",
      plan,
      result: execResult,
      conflicts: plan.items.filter((i) => i.conflict),
      protectedPaths: manifest.governance.protectedPaths,
      errors: execResult.errors,
      warnings: []
    },
    (res) => {
      console.log("=================================================");
      console.log(` Dry-Run Reconciliation: ${manifest.identity.name}`);
      console.log("=================================================");
      console.log(` Plan ID:          ${res.plan.planId}`);
      console.log(` Success:          ${res.result.success}`);
      console.log(` Disk Mutations:   0 (Guaranteed dry-run)`);
      console.log(` Actions Planned:  ${res.plan.summary.actionsPlanned}`);
      console.log(` Protected Saved:  ${res.plan.summary.protectedPreserved}`);
      console.log(` Conflicts:        ${res.plan.summary.conflicts}`);
      console.log("=================================================");
    },
    execResult.success ? EXIT_CODES.SUCCESS : EXIT_CODES.UNRESOLVED_CONFLICT
  );
}

// 7. AROH SYNC VALIDATE
else if (command === "validate") {
  const entriesToValidate = productFilter
    ? [resolveProduct(allEntries, productFilter)]
    : allEntries;

  let allValid = true;
  const validationResults = [];

  for (const { manifest, filePath } of entriesToValidate) {
    let isValid = true;
    const errors = [];

    // 1. Target path check: must not attempt direct monorepo overwrite of Products
    if (isProductsBoundary(manifest.identity.targetPath)) {
      // It points to an independent product directory, which is expected for managed products
      // but verify governance rules
      if (!manifest.governance.protectedPaths || manifest.governance.protectedPaths.length === 0) {
        errors.push("Managed product inside Products/ must declare at least one protected path.");
        isValid = false;
      }
    }

    // 2. Compatibility check
    if (!manifest.compatibility.ecosystemVersion) {
      errors.push("Missing required compatibility.ecosystemVersion.");
      isValid = false;
    }

    validationResults.push({
      id: manifest.identity.id,
      name: manifest.identity.name,
      file: path.basename(filePath),
      isValid,
      errors
    });

    if (!isValid) allValid = false;
  }

  outputResult(
    {
      command: "validate",
      product: productFilter || "all",
      status: allValid ? "validated" : "validation_failed",
      validation: { allValid, results: validationResults },
      result: { count: validationResults.length },
      errors: validationResults.flatMap((r) => r.errors),
      warnings: []
    },
    (res) => {
      console.log("=================================================");
      console.log(" AROH Synchronization Manifest Validation       ");
      console.log("=================================================");
      for (const item of res.validation.results) {
        const icon = item.isValid ? "✓ " : "❌ ";
        console.log(` ${icon}${item.name} (${item.id}) - ${item.isValid ? "PASS" : "FAIL"}`);
        for (const err of item.errors) {
          console.log(`    ! ${err}`);
        }
      }
      console.log("=================================================");
    },
    allValid ? EXIT_CODES.SUCCESS : EXIT_CODES.VALIDATION_ERROR
  );
}

// 8. AROH SYNC CONFLICTS
else if (command === "conflicts") {
  if (!productFilter) {
    outputResult(
      { command, status: "error", errors: ["The conflicts command requires --product <product>"] },
      () => console.error("❌ The conflicts command requires --product <product>."),
      EXIT_CODES.VALIDATION_ERROR
    );
  }

  const { manifest } = resolveProduct(allEntries, productFilter);
  const productFiles = scanProductFilesSafely(manifest.identity.targetPath);
  const plan = SemanticReconciler.planReconciliation(manifest, { productFiles });
  const conflicts = plan.items.filter((i) => i.conflict);

  outputResult(
    {
      command: "conflicts",
      product: manifest.identity.id,
      status: conflicts.length > 0 ? "conflicts_found" : "no_conflicts",
      conflicts,
      result: { count: conflicts.length },
      errors: [],
      warnings: []
    },
    (res) => {
      console.log("=================================================");
      console.log(` Unresolved Conflicts: ${manifest.identity.name}`);
      console.log("=================================================");
      if (res.conflicts.length === 0) {
        console.log(" ✓ Zero synchronization conflicts detected.");
      } else {
        for (const c of res.conflicts) {
          console.log(` ⚠️ [${c.conflict?.category}] ${c.artifactPath}`);
          console.log(`    Impact:     ${c.conflict?.impact}`);
          console.log(`    Detail:     ${c.conflict?.description}`);
          console.log(`    Resolution: ${c.conflict?.requiredResolution}`);
        }
      }
      console.log("=================================================");
    },
    conflicts.length > 0 ? EXIT_CODES.UNRESOLVED_CONFLICT : EXIT_CODES.SUCCESS
  );
}

// 9. AROH SYNC APPLY
else if (command === "apply") {
  if (!productFilter) {
    outputResult(
      { command, status: "error", errors: ["The apply command requires --product <product>"] },
      () => console.error("❌ The apply command requires --product <product>."),
      EXIT_CODES.VALIDATION_ERROR
    );
  }

  if (!isConfirm && isNonInteractive) {
    outputResult(
      {
        command: "apply",
        product: productFilter,
        status: "aborted",
        errors: ["Mutation aborted: Confirmation required in non-interactive mode. Pass --confirm to authorize."]
      },
      () => console.error("❌ Mutation aborted: Non-interactive mutation requires --confirm."),
      EXIT_CODES.SYNC_FAILED
    );
  }

  const { manifest, filePath } = resolveProduct(allEntries, productFilter);
  const productFiles = scanProductFilesSafely(manifest.identity.targetPath);

  let plan;
  if (planFile) {
    if (!fs.existsSync(planFile)) {
      outputResult(
        { command, product: manifest.identity.id, status: "error", errors: [`Specified plan file '${planFile}' not found.`] },
        () => console.error(`❌ Specified plan file '${planFile}' not found.`),
        EXIT_CODES.PLAN_UNAVAILABLE
      );
    }
    try {
      plan = JSON.parse(fs.readFileSync(planFile, "utf-8"));
    } catch {
      outputResult(
        { command, product: manifest.identity.id, status: "error", errors: ["Malformed plan file."] },
        () => console.error("❌ Malformed plan file."),
        EXIT_CODES.PLAN_UNAVAILABLE
      );
    }

    // Verify plan is not stale
    if (plan.sourceCommit !== manifest.identity.commitHash) {
      outputResult(
        {
          command: "apply",
          product: manifest.identity.id,
          status: "stale_plan",
          errors: ["Plan is stale: Manifest commit hash has changed since plan generation."]
        },
        () => console.error("❌ Stale plan: State changed since plan generation. Please re-run 'aroh sync plan'."),
        EXIT_CODES.STALE_BASELINE
      );
    }
  } else {
    plan = SemanticReconciler.planReconciliation(manifest, { productFiles, dryRun: false });
  }

  if (plan.hasConflicts) {
    outputResult(
      {
        command: "apply",
        product: manifest.identity.id,
        status: "blocked_by_conflicts",
        conflicts: plan.items.filter((i) => i.conflict),
        errors: ["Cannot apply synchronization plan with unresolved conflicts. Aborting."]
      },
      () => console.error("❌ Cannot apply synchronization plan with unresolved conflicts. Aborting."),
      EXIT_CODES.UNRESOLVED_CONFLICT
    );
  }

  // Execute reconciliation (mutates ONLY canonical Aroh manifest metadata; NEVER Products/)
  const execResult = SemanticReconciler.executeReconciliation(manifest, plan, { dryRun: false });

  if (!execResult.success) {
    outputResult(
      {
        command: "apply",
        product: manifest.identity.id,
        status: "failed",
        errors: execResult.errors
      },
      () => console.error(`❌ Reconciliation failed: ${execResult.errors.join(", ")}`),
      EXIT_CODES.SYNC_FAILED
    );
  }

  // Save updated manifest
  fs.writeFileSync(filePath, JSON.stringify(manifest, null, 2) + "\n", "utf-8");

  outputResult(
    {
      command: "apply",
      product: manifest.identity.id,
      status: "applied",
      result: execResult,
      provenance: execResult.auditEntry,
      errors: [],
      warnings: []
    },
    (res) => {
      console.log("=================================================");
      console.log(` Synchronization Applied: ${manifest.identity.name}`);
      console.log("=================================================");
      console.log(` Plan ID:          ${res.result.planId}`);
      console.log(` Actions Applied:  ${res.result.appliedActionsCount}`);
      console.log(` Protected Saved:  ${res.result.skippedProtectedCount}`);
      console.log(` Products/ Bound:  PRESERVED INTACT (Zero modifications)`);
      console.log(` Audit Record:     ${res.provenance.action} at ${res.provenance.timestamp}`);
      console.log("=================================================");
    },
    EXIT_CODES.SUCCESS
  );
}

// UNKNOWN COMMAND
else {
  outputResult(
    { command, status: "error", errors: [`Unknown command: '${command}'`] },
    () => console.error(`❌ Unknown command: '${command}'. Supported commands: status, inspect, detect, diff, plan, dry-run, validate, conflicts, apply`),
    EXIT_CODES.VALIDATION_ERROR
  );
}
