import { ProductShowcase } from "../schemas/product";
import { CANONICAL_PRODUCT_REGISTRY } from "./products";

export type ProductShowcaseRole =
  | "star"
  | "featured"
  | "future-launch"
  | "standard"
  | "internal";

export interface ProductActionCapabilities {
  canLaunchLive: boolean;
  canPurchase: boolean;
  canInstall: boolean;
  isFutureLaunch: boolean;
  primaryAction: {
    type: "launch" | "roadmap" | "internal" | "inspect";
    label: string;
    href?: string;
  };
  secondaryAction?: {
    type: "github" | "docs" | "notify";
    label: string;
    href?: string;
  };
}

export interface ShowcaseHierarchy {
  starProduct: ProductShowcase;
  featuredProducts: ProductShowcase[];
  futureLaunchProducts: ProductShowcase[];
  standardProducts: ProductShowcase[];
  internalProducts: ProductShowcase[];
  allOrdered: ProductShowcase[];
  getRole: (productId: string) => ProductShowcaseRole;
  getActionCapabilities: (product: ProductShowcase) => ProductActionCapabilities;
}

/**
 * Validates whether Spedex has met all canonical conditions for official release.
 * Release requires:
 * 1. Explicit canonical status === "online" (not coming-soon or development)
 * 2. Verified liveUrl pointing to a legitimate HTTP/HTTPS endpoint.
 */
export function isSpedexReleased(registry: ProductShowcase[] = CANONICAL_PRODUCT_REGISTRY): boolean {
  const spedex = registry.find((p) => p.productId === "spedex");
  if (!spedex) return false;
  return (
    spedex.status === "online" &&
    typeof spedex.liveUrl === "string" &&
    spedex.liveUrl.startsWith("http")
  );
}

/**
 * Resolves the canonical product showcase hierarchy.
 *
 * CURRENT SHOWCASE PRIORITY:
 * 1. OmniStream — STAR / PRIMARY (leading available product)
 * 2. JavaPath Pro — SECONDARY FEATURED
 * 3. Music Mirror — TERTIARY FEATURED
 * 4. SpeDex — FUTURE LAUNCH (in active development)
 * Followed by standard catalog products (Nebula, etc.) and internal services.
 *
 * POST-RELEASE PROMOTION PRIORITY (when Spedex is verified released):
 * 1. SpeDex — STAR / PRIMARY
 * 2. OmniStream — FEATURED
 * 3. JavaPath Pro — FEATURED
 * 4. Music Mirror — FEATURED
 */
export function resolveShowcaseHierarchy(
  registry: ProductShowcase[] = CANONICAL_PRODUCT_REGISTRY
): ShowcaseHierarchy {
  const spedexReleased = isSpedexReleased(registry);

  const omnistream = registry.find((p) => p.productId === "omnistream");
  const javapath = registry.find((p) => p.productId === "javapath-pro");
  const musicMirror = registry.find((p) => p.productId === "music-mirror");
  const spedex = registry.find((p) => p.productId === "spedex");

  let starProduct: ProductShowcase;
  let featuredProducts: ProductShowcase[] = [];
  let futureLaunchProducts: ProductShowcase[] = [];

  if (spedexReleased && spedex) {
    // Post-Release Promotion Transition
    starProduct = spedex;
    if (omnistream) featuredProducts.push(omnistream);
    if (javapath) featuredProducts.push(javapath);
    if (musicMirror) featuredProducts.push(musicMirror);
  } else {
    // Current Platform Reality
    starProduct = omnistream || registry[0];
    if (javapath) featuredProducts.push(javapath);
    if (musicMirror) featuredProducts.push(musicMirror);
    if (spedex) futureLaunchProducts.push(spedex);
  }

  // Other public standard products (e.g. Nebula)
  const flagshipIds = new Set(["omnistream", "javapath-pro", "music-mirror", "spedex"]);
  const standardProducts = registry.filter(
    (p) => !p.internalOnly && !flagshipIds.has(p.productId)
  );

  // Platform internal infrastructure services
  const internalProducts = registry.filter((p) => p.internalOnly);

  const allOrdered = [
    starProduct,
    ...featuredProducts,
    ...futureLaunchProducts,
    ...standardProducts,
    ...internalProducts
  ].filter(Boolean);

  const roleMap = new Map<string, ProductShowcaseRole>();
  if (starProduct) roleMap.set(starProduct.productId, "star");
  featuredProducts.forEach((p) => roleMap.set(p.productId, "featured"));
  futureLaunchProducts.forEach((p) => roleMap.set(p.productId, "future-launch"));
  standardProducts.forEach((p) => roleMap.set(p.productId, "standard"));
  internalProducts.forEach((p) => roleMap.set(p.productId, "internal"));

  const getRole = (productId: string): ProductShowcaseRole => {
    return roleMap.get(productId) || "standard";
  };

  const getActionCapabilities = (product: ProductShowcase): ProductActionCapabilities => {
    const isFuture = product.status === "coming-soon" || product.status === "development";
    if (isFuture) {
      return {
        canLaunchLive: false,
        canPurchase: false,
        canInstall: false,
        isFutureLaunch: true,
        primaryAction: {
          type: "roadmap",
          label: "View Roadmap",
          href: `/explore/${product.productId}#roadmap`
        },
        secondaryAction: product.githubUrl
          ? {
              type: "github",
              label: "Source Repository",
              href: product.githubUrl
            }
          : undefined
      };
    }

    if (product.internalOnly) {
      return {
        canLaunchLive: false,
        canPurchase: false,
        canInstall: false,
        isFutureLaunch: false,
        primaryAction: {
          type: "internal",
          label: "Open Console",
          href: product.liveUrl || "/dashboard"
        }
      };
    }

    const hasLiveUrl = Boolean(
      product.liveUrl &&
        (product.liveUrl.startsWith("http://") || product.liveUrl.startsWith("https://"))
    );

    return {
      canLaunchLive: hasLiveUrl,
      canPurchase: true,
      canInstall: false,
      isFutureLaunch: false,
      primaryAction: hasLiveUrl
        ? {
            type: "launch",
            label: "Launch App ↗",
            href: product.liveUrl
          }
        : {
            type: "inspect",
            label: "Inspect Details",
            href: `/explore/${product.productId}`
          },
      secondaryAction: product.githubUrl
        ? {
            type: "github",
            label: "Source Code",
            href: product.githubUrl
          }
        : undefined
    };
  };

  return {
    starProduct,
    featuredProducts,
    futureLaunchProducts,
    standardProducts,
    internalProducts,
    allOrdered,
    getRole,
    getActionCapabilities
  };
}

/**
 * Returns products sorted according to canonical showcase hierarchy.
 */
export function getShowcaseOrderedProducts(
  registry: ProductShowcase[] = CANONICAL_PRODUCT_REGISTRY
): ProductShowcase[] {
  return resolveShowcaseHierarchy(registry).allOrdered;
}
