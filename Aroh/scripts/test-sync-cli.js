const { spawnSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const { SemanticReconciler } = require("../packages/asdk");

console.log("=================================================");
console.log(" AROH Synchronization CLI & Contract Test Suite  ");
console.log("=================================================");

const tsxCli = path.join(__dirname, "..", "node_modules", "tsx", "dist", "cli.mjs");
const syncScript = path.join(__dirname, "aroh-sync.js");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    failed++;
  }
}

function runCli(args) {
  const res = spawnSync(process.execPath, [tsxCli, syncScript, ...args], {
    encoding: "utf-8",
    cwd: path.join(__dirname, "..")
  });
  let json = null;
  try {
    json = JSON.parse(res.stdout);
  } catch {
    // not json or mixed
  }
  return {
    status: res.status,
    stdout: res.stdout,
    stderr: res.stderr,
    json
  };
}

// 1. Status command test
console.log("\n--- Test 1: Status Command & Read-Only Invariant ---");
const statusRes = runCli(["status", "--json"]);
assert(statusRes.status === 0, "status --json returns exit code 0");
assert(statusRes.json && statusRes.json.command === "status", "JSON output has command='status'");
assert(Array.isArray(statusRes.json.baseline), "JSON output includes baseline array");

// 2. Product-specific inspect test
console.log("\n--- Test 2: Inspect Command ---");
const inspectRes = runCli(["inspect", "--product", "spedex", "--json"]);
assert(inspectRes.status === 0, "inspect --product spedex returns exit code 0");
assert(inspectRes.json.product === "spedex-core", "Resolves 'spedex' alias to 'spedex-core'");
assert(inspectRes.json.protectedPaths.includes("config/aroh-bridge.properties"), "Reports protected paths");

// 3. Unknown product fails closed (Exit code 6)
console.log("\n--- Test 3: Unknown Product Fail-Closed (Exit Code 6) ---");
const unknownRes = runCli(["inspect", "--product", "nonexistent-app", "--json"]);
assert(unknownRes.status === 6, "Unknown product returns exit code 6 (INVALID_PRODUCT)");
assert(unknownRes.json && unknownRes.json.errors.length > 0, "Provides actionable error for unknown product");

// 4. Validate command test
console.log("\n--- Test 4: Manifest Validation ---");
const valRes = runCli(["validate", "--json"]);
assert(valRes.status === 0, "validate returns exit code 0 for valid manifests");
assert(valRes.json.validation.allValid === true, "All registered manifests pass validation");

// 5. Detect command test
console.log("\n--- Test 5: Detect Command ---");
const detectRes = runCli(["detect", "--product", "spedex", "--json"]);
assert(detectRes.status === 0, "detect --product spedex returns exit code 0");
assert(detectRes.json.changes !== undefined, "Categorized changes are returned");

// 6. Diff command test
console.log("\n--- Test 6: Diff Command ---");
const diffRes = runCli(["diff", "--product", "spedex", "--json"]);
assert(diffRes.status === 0, "diff --product spedex returns exit code 0");
assert(Array.isArray(diffRes.json.changes), "Diff returns structured changes list");

// 7. Plan command test
console.log("\n--- Test 7: Plan Command & File Output ---");
const planRes = runCli(["plan", "--product", "spedex", "--json"]);
assert(planRes.status === 0, "plan --product spedex returns exit code 0");
assert(planRes.json.plan && planRes.json.plan.planId.startsWith("plan_spedex-core"), "Generates deterministic plan ID");
assert(planRes.json.plan.protectedBoundaryEnforced === true, "Enforces protected boundary");

// 8. Dry-run guarantee test
console.log("\n--- Test 8: Dry-Run Zero Mutation Guarantee ---");
const dryRes = runCli(["dry-run", "--product", "spedex", "--json"]);
assert(dryRes.status === 0, "dry-run returns exit code 0");
assert(dryRes.json.result.dryRun === true, "Dry-run flag confirmed true in execution result");
assert(dryRes.json.result.appliedActionsCount === 0, "Zero mutations executed during dry-run");

// 9. Conflicts command test
console.log("\n--- Test 9: Conflicts Inspection ---");
const conflictRes = runCli(["conflicts", "--product", "spedex", "--json"]);
assert(conflictRes.status === 0, "Zero conflicts returns exit code 0");
assert(conflictRes.json.status === "no_conflicts", "Reports clean no_conflicts status");

// 10. Non-interactive apply without --confirm fails closed (Exit code 1)
console.log("\n--- Test 10: Non-Interactive Unconfirmed Apply Fails (Exit Code 1) ---");
const unconfRes = runCli(["apply", "--product", "spedex", "--non-interactive", "--json"]);
assert(unconfRes.status === 1, "Unconfirmed non-interactive apply returns exit code 1");
assert(unconfRes.json.status === "aborted", "Status is aborted");

// 11. Stale plan detection (Exit code 4)
console.log("\n--- Test 11: Stale Plan Rejection (Exit Code 4) ---");
const tempPlanPath = path.join(__dirname, "temp_stale_plan.json");
const stalePlan = {
  planId: "stale-plan-1",
  sourceCommit: "outdated-hash-0000000000",
  hasConflicts: false,
  items: [],
  summary: { actionsPlanned: 0, protectedPreserved: 0, conflicts: 0 }
};
fs.writeFileSync(tempPlanPath, JSON.stringify(stalePlan), "utf-8");

const staleRes = runCli(["apply", "--product", "spedex", "--plan", tempPlanPath, "--confirm", "--json"]);
assert(staleRes.status === 4, "Stale plan returns exit code 4 (STALE_BASELINE)");
try { fs.unlinkSync(tempPlanPath); } catch {}

// 12. Direct SemanticReconciler Unit Invariants: Products/ write blocked
console.log("\n--- Test 12: Invariant Protection against Direct Products/ Writes ---");
const mockManifest = {
  $schemaVersion: "v1.0.0",
  identity: {
    id: "test-product",
    name: "Test Product",
    description: "test",
    upstreamUrl: "https://github.com/test/test",
    repositoryType: "git",
    targetPath: "Products/TestProduct",
    branch: "main",
    upstreamVersion: "v1.0.0",
    commitHash: "abc",
    ownership: "team-test"
  },
  governance: {
    syncPolicy: "continuous_governed",
    mergeStrategy: "downstream_wins",
    autoSyncEnabled: false,
    excludedPaths: [],
    generatedPaths: [],
    protectedPaths: []
  },
  compatibility: {
    ecosystemVersion: "v2.0.0",
    minimumAsdkVersion: "v2.0.0",
    dependencies: {},
    requiredPlatformServices: []
  },
  metadata: {
    lastSyncedAt: "",
    modifiedFiles: [],
    generatedFiles: [],
    migrationHistory: [],
    architecturalNotes: [],
    aiAnnotations: {},
    auditTrail: []
  }
};

const planWithProductsWrite = SemanticReconciler.planReconciliation(mockManifest, {
  productFiles: { "Products/TestProduct/evil.ts": "alert('exploit');" }
});
assert(planWithProductsWrite.hasConflicts === true, "Plan detects attempt to target Products/ as a conflict");
assert(planWithProductsWrite.items.some(i => i.conflict && i.conflict.category === "protected_violation"), "Classifies attempt as protected_violation");

const execBlocked = SemanticReconciler.executeReconciliation(mockManifest, planWithProductsWrite, { dryRun: false });
assert(execBlocked.success === false, "Execution fails closed when Products/ boundary is targeted");

// 13. Three-way Conflict Detection Invariant
console.log("\n--- Test 13: Three-Way Concurrent Divergence Conflict Detection ---");
const conflictPlan = SemanticReconciler.planReconciliation(mockManifest, {
  baselineHashes: { "src/config.ts": "hash_base" },
  productFiles: { "src/config.ts": "version_product_divergent" },
  arohFiles: { "src/config.ts": "version_aroh_divergent" }
});
assert(conflictPlan.hasConflicts === true, "Divergent three-way change flagged as conflict");
assert(conflictPlan.items.some(i => i.conflict && i.conflict.category === "concurrent_modification"), "Classifies conflict as concurrent_modification");

// 14. Idempotency Test (Hermetic Isolation)
console.log("\n--- Test 14: Synchronization Idempotency ---");
const spedexManifestPath = path.join(__dirname, "..", "manifests", "spedex-core.manifest.json");
const originalSpedexManifest = fs.readFileSync(spedexManifestPath, "utf-8");

try {
  const applyRes1 = runCli(["apply", "--product", "spedex", "--confirm", "--json"]);
  assert(applyRes1.status === 0, "First apply succeeds");

  const statusAfter = runCli(["status", "--product", "spedex", "--json"]);
  assert(statusAfter.json.baseline[0].isClean === true, "Status reports clean and synchronized after apply");

  const planAfter = runCli(["plan", "--product", "spedex", "--json"]);
  assert(planAfter.json.plan.summary.actionsPlanned === 0, "Subsequent plan produces 0 planned actions (Idempotent)");
} finally {
  fs.writeFileSync(spedexManifestPath, originalSpedexManifest, "utf-8");
}

console.log("\n=================================================");
console.log(` Summary: ${passed} Passed / ${failed} Failed`);
console.log("=================================================");

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
