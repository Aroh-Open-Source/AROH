const fs = require("fs");
const path = require("path");
const { validateProjectManifest, SemanticSyncEngine } = require("../packages/asdk");

console.log("=================================================");
console.log(" AROH Managed Project Manifests Verification     ");
console.log("=================================================");

const manifestsDir = path.join(__dirname, "..", "manifests");
const manifestFiles = fs.readdirSync(manifestsDir).filter(f => f.endsWith(".manifest.json"));

if (manifestFiles.length === 0) {
  console.error("❌ Error: No manifest files found in manifests/ directory.");
  process.exit(1);
}

let passedCount = 0;

for (const file of manifestFiles) {
  const filePath = path.join(manifestsDir, file);
  console.log(`\n🔍 Verifying: ${file}...`);

  try {
    const rawData = fs.readFileSync(filePath, "utf-8").replace(/^\uFEFF/, "");
    const manifest = validateProjectManifest(JSON.parse(rawData));


    console.log(`   ✓ ID: ${manifest.identity.id}`);
    console.log(`   ✓ Name: ${manifest.identity.name}`);
    console.log(`   ✓ Target Path: ${manifest.identity.targetPath} (Decoupled Policy)`);
    console.log(`   ✓ Sync Policy: ${manifest.governance.syncPolicy}`);
    console.log(`   ✓ Merge Strategy: ${manifest.governance.mergeStrategy}`);
    console.log(`   ✓ Version: ${manifest.identity.upstreamVersion}`);

    // Verify targetPath is non-empty
    if (!manifest.identity.targetPath || manifest.identity.targetPath.trim() === "") {
      throw new Error(`Invalid targetPath in ${file}: must be non-empty string`);
    }

    // Test SemanticSyncEngine Preview
    const preview = SemanticSyncEngine.previewSync(manifest, {
      modified: manifest.governance.protectedPaths.slice(),
      added: ["src/new-feature.ts"],
      deleted: []
    });

    console.log(`   ✓ Sync Preview Generated (${preview.plannedActions.length} actions planned)`);
    passedCount++;
  } catch (err) {
    console.error(`   ❌ Failed validation for ${file}:`, err.message);
    process.exit(1);
  }
}

console.log("\n=================================================");
console.log(` Summary: ${passedCount}/${manifestFiles.length} Manifests Passed Schema Validation`);
console.log(" Status: VERIFIED CLEAN (Zero Warnings)");
console.log("=================================================");
