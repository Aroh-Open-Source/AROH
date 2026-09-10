import { CANONICAL_PRODUCT_REGISTRY, ProductShowcaseSchema } from "../packages/asdk/src/index.js";

console.log("=================================================");
console.log(" AROH Canonical Product Showcase Registry Audit  ");
console.log("=================================================\n");

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

try {
  console.log(`Auditing ${CANONICAL_PRODUCT_REGISTRY.length} registered products...\n`);

  CANONICAL_PRODUCT_REGISTRY.forEach((product) => {
    console.log(`--- Product: ${product.name} (${product.productId}) ---`);

    // 1. Zod Schema Validation
    const parseResult = ProductShowcaseSchema.safeParse(product);
    assert(parseResult.success, `Schema validation for ${product.name}`);
    if (!parseResult.success) {
      console.error("  Errors:", parseResult.error.issues);
    }

    // 2. Identity & Value Proposition
    assert(product.name.trim().length > 0, `Non-empty product name`);
    assert(product.tagline.trim().length > 10, `Descriptive tagline`);
    assert(product.shortDescription.trim().length > 20, `Substantive short description`);
    assert(product.longDescription.trim().length > 50, `Comprehensive long description`);

    // 3. Capabilities Audit
    assert(product.primaryCapabilities.length >= 1, `Has at least 1 verified capability`);
    product.primaryCapabilities.forEach((cap, idx) => {
      assert(cap.title.trim().length > 0 && cap.description.trim().length > 0, `Capability [${idx + 1}] '${cap.title}' is documented`);
    });

    // 4. URL Validation & Strict Non-Fabrication
    if (product.githubUrl) {
      assert(
        product.githubUrl.startsWith("https://github.com/UdayPatnala/"),
        `GitHub URL '${product.githubUrl}' points to authoritative repository`
      );
    }

    if (product.liveUrl) {
      const isHttp = product.liveUrl.startsWith("http://") || product.liveUrl.startsWith("https://");
      const isRelative = product.liveUrl.startsWith("/");
      assert(isHttp || isRelative, `Live URL '${product.liveUrl}' has valid protocol or relative route`);
      
      if (product.status === "online") {
        assert(isHttp, `Online product '${product.name}' has external live URL`);
      }
    } else {
      assert(
        product.status === "development" || product.status === "offline",
        `Product without liveUrl is accurately designated as '${product.status}' (no fabricated URLs)`
      );
    }

    // 5. Provenance & Audit Integrity
    assert(product.sourceOfTruth.trim().length > 0, `Provenance source declared: ${product.sourceOfTruth}`);
    assert(!isNaN(Date.parse(product.lastVerified)), `Valid lastVerified ISO timestamp (${product.lastVerified})`);
    assert(product.metadataVersion.trim().length > 0, `Metadata version tracked: ${product.metadataVersion}`);

    console.log("");
  });

} catch (err) {
  console.error("Unexpected error during registry audit:", err);
  failed++;
}

console.log("=================================================");
console.log(` Summary: ${passed} Passed / ${failed} Failed`);
console.log("=================================================");

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
