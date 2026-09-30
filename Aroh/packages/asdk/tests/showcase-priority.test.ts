import { describe, it, expect } from "vitest";
import {
  resolveShowcaseHierarchy,
  isSpedexReleased,
  getShowcaseOrderedProducts,
  type ShowcaseHierarchy
} from "../src/registry/showcase-priority";
import {
  CANONICAL_PRODUCT_REGISTRY,
  ProductShowcase
} from "../src/index";

// ---------------------------------------------------------------------------
// Canonical registry helpers
// ---------------------------------------------------------------------------
const spedexEntry = CANONICAL_PRODUCT_REGISTRY.find((p) => p.productId === "spedex")!;
const omniEntry   = CANONICAL_PRODUCT_REGISTRY.find((p) => p.productId === "omnistream")!;
const javaEntry   = CANONICAL_PRODUCT_REGISTRY.find((p) => p.productId === "javapath-pro")!;
const musicEntry  = CANONICAL_PRODUCT_REGISTRY.find((p) => p.productId === "music-mirror")!;

// ---------------------------------------------------------------------------
// CURRENT STATE assertions
// ---------------------------------------------------------------------------
describe("Canonical Product Showcase Hierarchy (Current Platform State)", () => {
  const hierarchy = resolveShowcaseHierarchy();

  it("OmniStream is the STAR / primary product in the current registry", () => {
    expect(hierarchy.starProduct.productId).toBe("omnistream");
    expect(hierarchy.getRole("omnistream")).toBe("star");
  });

  it("JavaPath Pro immediately follows OmniStream as a FEATURED product", () => {
    const featured = hierarchy.featuredProducts;
    expect(featured[0]?.productId).toBe("javapath-pro");
    expect(hierarchy.getRole("javapath-pro")).toBe("featured");
  });

  it("Music Mirror is the third FEATURED product after JavaPath Pro", () => {
    const featured = hierarchy.featuredProducts;
    expect(featured[1]?.productId).toBe("music-mirror");
    expect(hierarchy.getRole("music-mirror")).toBe("featured");
  });

  it("SpeDex is classified as FUTURE LAUNCH — not available/featured/star", () => {
    expect(hierarchy.getRole("spedex")).toBe("future-launch");
    expect(hierarchy.futureLaunchProducts.some((p) => p.productId === "spedex")).toBe(true);
  });

  it("allOrdered places OmniStream first, then featured, then future-launch", () => {
    const ordered = hierarchy.allOrdered;
    const omniIdx   = ordered.findIndex((p) => p.productId === "omnistream");
    const javaIdx   = ordered.findIndex((p) => p.productId === "javapath-pro");
    const musicIdx  = ordered.findIndex((p) => p.productId === "music-mirror");
    const spedexIdx = ordered.findIndex((p) => p.productId === "spedex");

    expect(omniIdx).toBeGreaterThanOrEqual(0);
    expect(javaIdx).toBeGreaterThan(omniIdx);
    expect(musicIdx).toBeGreaterThan(javaIdx);
    expect(spedexIdx).toBeGreaterThan(musicIdx);
  });
});

// ---------------------------------------------------------------------------
// SPEDEX FUTURE-LAUNCH action capability assertions
// ---------------------------------------------------------------------------
describe("SpeDex action capabilities while Future Launch", () => {
  const hierarchy = resolveShowcaseHierarchy();
  const actions = hierarchy.getActionCapabilities(spedexEntry);

  it("SpeDex canLaunchLive is false while coming-soon", () => {
    expect(actions.canLaunchLive).toBe(false);
  });

  it("SpeDex canPurchase is false while coming-soon", () => {
    expect(actions.canPurchase).toBe(false);
  });

  it("SpeDex canInstall is false while coming-soon", () => {
    expect(actions.canInstall).toBe(false);
  });

  it("SpeDex isFutureLaunch flag is true", () => {
    expect(actions.isFutureLaunch).toBe(true);
  });

  it("SpeDex primaryAction type is roadmap — not launch, purchase, or install", () => {
    expect(actions.primaryAction.type).toBe("roadmap");
    expect(actions.primaryAction.type).not.toBe("launch");
  });

  it("SpeDex cannot become star product from current registry state", () => {
    expect(hierarchy.starProduct.productId).not.toBe("spedex");
  });
});

// ---------------------------------------------------------------------------
// isSpedexReleased guard
// ---------------------------------------------------------------------------
describe("isSpedexReleased canonical promotion guard", () => {
  it("returns false for current registry (spedex is coming-soon)", () => {
    expect(isSpedexReleased()).toBe(false);
  });

  it("returns false if status is coming-soon even with a live URL", () => {
    const fakeRegistry: ProductShowcase[] = [
      { ...spedexEntry, status: "coming-soon", liveUrl: "https://spedex.vercel.app/" }
    ];
    expect(isSpedexReleased(fakeRegistry)).toBe(false);
  });

  it("returns false if status is online but liveUrl is missing", () => {
    const fakeRegistry: ProductShowcase[] = [
      { ...spedexEntry, status: "online", liveUrl: undefined }
    ];
    expect(isSpedexReleased(fakeRegistry)).toBe(false);
  });

  it("returns false if status is development regardless of liveUrl", () => {
    const fakeRegistry: ProductShowcase[] = [
      { ...spedexEntry, status: "development", liveUrl: "https://spedex.vercel.app/" }
    ];
    expect(isSpedexReleased(fakeRegistry)).toBe(false);
  });

  it("returns true ONLY when status is 'online' AND liveUrl is an HTTPS URL", () => {
    const releasedRegistry: ProductShowcase[] = [
      ...CANONICAL_PRODUCT_REGISTRY.filter((p) => p.productId !== "spedex"),
      { ...spedexEntry, status: "online", liveUrl: "https://spedex.vercel.app/" }
    ];
    expect(isSpedexReleased(releasedRegistry)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// POST-RELEASE PROMOTION hierarchy assertions
// ---------------------------------------------------------------------------
describe("Post-Release Hierarchy — Spedex promoted to STAR", () => {
  const releasedSpedex: ProductShowcase = {
    ...spedexEntry,
    status: "online",
    liveUrl: "https://spedex.vercel.app/"
  };
  const releasedRegistry: ProductShowcase[] = [
    ...CANONICAL_PRODUCT_REGISTRY.filter((p) => p.productId !== "spedex"),
    releasedSpedex
  ];

  const h = resolveShowcaseHierarchy(releasedRegistry);

  it("Spedex becomes the STAR product after verified release", () => {
    expect(h.starProduct.productId).toBe("spedex");
    expect(h.getRole("spedex")).toBe("star");
  });

  it("OmniStream becomes FEATURED after Spedex release", () => {
    expect(h.getRole("omnistream")).toBe("featured");
    expect(h.featuredProducts[0]?.productId).toBe("omnistream");
  });

  it("JavaPath Pro remains FEATURED after Spedex release", () => {
    expect(h.getRole("javapath-pro")).toBe("featured");
  });

  it("Music Mirror remains FEATURED after Spedex release", () => {
    expect(h.getRole("music-mirror")).toBe("featured");
  });

  it("allOrdered post-release: Spedex → OmniStream → JavaPath Pro → Music Mirror", () => {
    const ordered = h.allOrdered;
    const spedexIdx = ordered.findIndex((p) => p.productId === "spedex");
    const omniIdx   = ordered.findIndex((p) => p.productId === "omnistream");
    const javaIdx   = ordered.findIndex((p) => p.productId === "javapath-pro");
    const musicIdx  = ordered.findIndex((p) => p.productId === "music-mirror");

    expect(spedexIdx).toBe(0);
    expect(omniIdx).toBeGreaterThan(spedexIdx);
    expect(javaIdx).toBeGreaterThan(omniIdx);
    expect(musicIdx).toBeGreaterThan(javaIdx);
  });

  it("Spedex post-release canLaunchLive is true", () => {
    const actions = h.getActionCapabilities(releasedSpedex);
    expect(actions.canLaunchLive).toBe(true);
    expect(actions.isFutureLaunch).toBe(false);
    expect(actions.primaryAction.type).toBe("launch");
  });

  it("Spedex does NOT remain future-launch after verified release", () => {
    expect(h.futureLaunchProducts.some((p) => p.productId === "spedex")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Action capabilities for currently-available products
// ---------------------------------------------------------------------------
describe("Action capabilities for online products", () => {
  const hierarchy = resolveShowcaseHierarchy();

  it("OmniStream canLaunchLive is true and primaryAction is launch", () => {
    const actions = hierarchy.getActionCapabilities(omniEntry);
    expect(actions.canLaunchLive).toBe(true);
    expect(actions.isFutureLaunch).toBe(false);
    expect(actions.primaryAction.type).toBe("launch");
    expect(actions.primaryAction.href).toBe("https://0mnistream.vercel.app/");
  });

  it("JavaPath Pro canLaunchLive is true", () => {
    const actions = hierarchy.getActionCapabilities(javaEntry);
    expect(actions.canLaunchLive).toBe(true);
    expect(actions.primaryAction.type).toBe("launch");
  });

  it("Music Mirror canLaunchLive is true", () => {
    const actions = hierarchy.getActionCapabilities(musicEntry);
    expect(actions.canLaunchLive).toBe(true);
    expect(actions.primaryAction.type).toBe("launch");
  });
});

// ---------------------------------------------------------------------------
// getShowcaseOrderedProducts helper
// ---------------------------------------------------------------------------
describe("getShowcaseOrderedProducts helper", () => {
  it("returns array starting with OmniStream in current state", () => {
    const ordered = getShowcaseOrderedProducts();
    expect(ordered[0]?.productId).toBe("omnistream");
  });

  it("does not include conflicting hard-coded ordering — roles drive order", () => {
    const ordered = getShowcaseOrderedProducts();
    // star comes before featured before future-launch
    const starIdx = ordered.findIndex((p) => p.productId === "omnistream");
    const futureIdx = ordered.findIndex((p) => p.productId === "spedex");
    expect(starIdx).toBeLessThan(futureIdx);
  });
});
