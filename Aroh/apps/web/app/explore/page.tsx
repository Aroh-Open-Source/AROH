"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  usePlatformStore,
  formatArosBalance,
  CANONICAL_PRODUCT_REGISTRY,
  ProductShowcase,
  getAllProducts,
  getProductCategories,
  resolveShowcaseHierarchy,
  type ProductShowcaseRole,
  type ShowcaseHierarchy
} from "@aroh/asdk";
import { Button } from "@aroh/ads";
import { motion, AnimatePresence } from "framer-motion";
import ArohLogo from "../components/aroh-logo";

// ─── Role config ────────────────────────────────────────────────────────────
const ROLE_CONFIG: Record<
  ProductShowcaseRole,
  { label: string; dotColor: string; pillBg: string; pillText: string; pillBorder: string }
> = {
  star: {
    label: "Current Flagship",
    dotColor: "bg-sky-500",
    pillBg: "bg-sky-50",
    pillText: "text-sky-700",
    pillBorder: "border-sky-200"
  },
  featured: {
    label: "Featured",
    dotColor: "bg-emerald-500",
    pillBg: "bg-emerald-50",
    pillText: "text-emerald-700",
    pillBorder: "border-emerald-200"
  },
  "future-launch": {
    label: "Future Launch",
    dotColor: "bg-amber-500",
    pillBg: "bg-amber-50",
    pillText: "text-amber-700",
    pillBorder: "border-amber-200"
  },
  standard: {
    label: "Live",
    dotColor: "bg-slate-400",
    pillBg: "bg-slate-100",
    pillText: "text-slate-600",
    pillBorder: "border-slate-200"
  },
  internal: {
    label: "Internal",
    dotColor: "bg-slate-300",
    pillBg: "bg-slate-100",
    pillText: "text-slate-500",
    pillBorder: "border-slate-200"
  }
};

function StatusPill({ role }: { role: ProductShowcaseRole }) {
  const cfg = ROLE_CONFIG[role];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${cfg.pillBg} ${cfg.pillText} ${cfg.pillBorder}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotColor} ${role === "star" || role === "featured" ? "animate-pulse" : ""}`} />
      {cfg.label.toUpperCase()}
    </span>
  );
}

// ─── Star Product Hero Card ──────────────────────────────────────────────────
function StarProductCard({
  product,
  hierarchy,
  onInspect
}: {
  product: ProductShowcase;
  hierarchy: ShowcaseHierarchy;
  onInspect: (p: ProductShowcase) => void;
}) {
  const actions = hierarchy.getActionCapabilities(product);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="relative overflow-hidden bg-slate-900 text-white rounded-3xl p-8 md:p-10 shadow-2xl shadow-slate-900/20 border border-slate-800"
    >
      {/* Ambient orb */}
      <div className="pointer-events-none absolute -top-16 -right-16 w-72 h-72 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 w-56 h-56 rounded-full bg-slate-700/30 blur-2xl" />

      <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-1 space-y-5">
          {/* Identity row */}
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill role="star" />
            <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase font-semibold text-slate-400 bg-slate-800 border border-slate-700">
              {product.category}
            </span>
            <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase font-semibold text-slate-400 bg-slate-800 border border-slate-700">
              {product.version}
            </span>
          </div>

          {/* Name & tagline */}
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {product.name}
            </h2>
            <p className="text-slate-400 text-sm mt-1.5 font-medium">{product.tagline}</p>
          </div>

          {/* Description */}
          <p className="text-slate-300 text-sm leading-relaxed max-w-prose">
            {product.shortDescription}
          </p>

          {/* Capability chips */}
          <div className="flex flex-wrap gap-2">
            {product.primaryCapabilities.map((cap, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg text-[10px] bg-white/5 border border-white/10 text-slate-300 font-mono"
              >
                {cap.title}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 pt-1">
            {actions.canLaunchLive && actions.primaryAction.href && (
              <a
                href={actions.primaryAction.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-sky-50 transition-colors shadow-lg shadow-white/10"
              >
                {actions.primaryAction.label}
              </a>
            )}
            <button
              type="button"
              onClick={() => onInspect(product)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 text-white font-semibold text-sm hover:bg-white/20 border border-white/10 transition-colors cursor-pointer"
            >
              Full Details →
            </button>
            {actions.secondaryAction?.href && (
              <a
                href={actions.secondaryAction.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-400 font-semibold text-xs hover:text-white border border-white/5 hover:border-white/20 transition-colors"
              >
                Source ↗
              </a>
            )}
          </div>
        </div>

        {/* Right: tech badge stack */}
        <div className="shrink-0 hidden md:flex flex-col gap-2 w-48">
          <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold mb-1">
            Technology
          </p>
          {product.technologySummary.split(",").slice(0, 5).map((t, i) => (
            <span
              key={i}
              className="px-2.5 py-1 rounded-md text-[10px] bg-slate-800 border border-slate-700 text-slate-300 font-mono text-center"
            >
              {t.trim()}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Featured Product Card ───────────────────────────────────────────────────
function FeaturedCard({
  product,
  role,
  hierarchy,
  delay,
  onInspect
}: {
  product: ProductShowcase;
  role: ProductShowcaseRole;
  hierarchy: ShowcaseHierarchy;
  delay: number;
  onInspect: (p: ProductShowcase) => void;
}) {
  const actions = hierarchy.getActionCapabilities(product);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -3 }}
      onClick={() => onInspect(product)}
      className="bg-white border border-black/5 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group shadow-sm"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start gap-2">
          <StatusPill role={role} />
          <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase font-semibold text-slate-500 bg-slate-100 border border-slate-200">
            {product.requiredTier.toUpperCase()}
          </span>
        </div>

        {/* Name */}
        <div>
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-700 transition-colors leading-tight flex items-center justify-between">
            {product.name}
            <span className="text-xs font-semibold text-sky-600 opacity-0 group-hover:opacity-100 transition-opacity">
              Details →
            </span>
          </h3>
          <p className="text-slate-400 text-[11px] font-medium mt-0.5">{product.tagline}</p>
        </div>

        <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">{product.shortDescription}</p>

        <div className="flex flex-wrap gap-1.5">
          {product.primaryCapabilities.slice(0, 3).map((cap, i) => (
            <span key={i} className="px-2 py-0.5 rounded-md text-[9px] bg-slate-50 border border-slate-200 text-slate-600 font-mono">
              {cap.title}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-black/5 pt-4 mt-5 flex justify-between items-center">
        <span className="text-slate-400 font-mono text-[10px]">{product.version}</span>
        {actions.canLaunchLive && actions.primaryAction.href ? (
          <a
            href={actions.primaryAction.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-[11px] hover:bg-sky-600 transition-colors shadow-sm"
          >
            Launch ↗
          </a>
        ) : (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onInspect(product); }}
            className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-bold text-[11px] hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Inspect →
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Future Launch Card ──────────────────────────────────────────────────────
function FutureLaunchCard({
  product,
  delay,
  onInspect
}: {
  product: ProductShowcase;
  delay: number;
  onInspect: (p: ProductShowcase) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -2 }}
      className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200/60 rounded-2xl p-6 flex flex-col justify-between shadow-sm group cursor-default"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute top-0 right-0 w-32 h-32 rounded-full bg-amber-300/10 blur-2xl" />

      <div className="relative z-10 space-y-4">
        <div className="flex justify-between items-start gap-2">
          <StatusPill role="future-launch" />
          <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase font-semibold text-amber-600 bg-amber-50 border border-amber-200">
            {product.requiredTier.toUpperCase()}
          </span>
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-800 leading-tight">{product.name}</h3>
          <p className="text-slate-500 text-[11px] font-medium mt-0.5">{product.tagline}</p>
        </div>

        <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">{product.shortDescription}</p>

        <div className="flex flex-wrap gap-1.5">
          {product.primaryCapabilities.slice(0, 3).map((cap, i) => (
            <span key={i} className="px-2 py-0.5 rounded-md text-[9px] bg-amber-50 border border-amber-200 text-amber-700 font-mono">
              {cap.title}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-amber-200/60 pt-4 mt-5 flex justify-between items-center">
        <span className="text-amber-600 font-mono text-[10px]">{product.version} · In Development</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onInspect(product)}
            className="px-3 py-1.5 rounded-lg bg-amber-100 text-amber-800 font-bold text-[11px] hover:bg-amber-200 border border-amber-200 transition-colors cursor-pointer"
          >
            Learn More →
          </button>
          {product.githubUrl && (
            <a
              href={product.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 rounded-lg bg-white border border-amber-200 text-amber-700 font-bold text-[11px] hover:bg-amber-50 transition-colors"
            >
              GitHub ↗
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Standard / Other Card ───────────────────────────────────────────────────
function StandardCard({
  product,
  hierarchy,
  delay,
  onInspect
}: {
  product: ProductShowcase;
  hierarchy: ShowcaseHierarchy;
  delay: number;
  onInspect: (p: ProductShowcase) => void;
}) {
  const actions = hierarchy.getActionCapabilities(product);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ y: -2 }}
      onClick={() => onInspect(product)}
      className="bg-white border border-black/5 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer group shadow-sm"
    >
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase font-semibold text-slate-500 bg-slate-100 border border-slate-200">
            {product.category}
          </span>
          <span className="text-slate-400 font-mono text-[10px]">{product.version}</span>
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800 group-hover:text-sky-700 transition-colors">{product.name}</h3>
          <p className="text-slate-500 text-[10px] mt-0.5">{product.tagline}</p>
        </div>
        <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2">{product.shortDescription}</p>
      </div>
      <div className="border-t border-black/5 pt-3 mt-4 flex justify-end">
        {actions.canLaunchLive && actions.primaryAction.href ? (
          <a
            href={actions.primaryAction.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="px-3 py-1 rounded-lg bg-slate-900 text-white font-bold text-[10px] hover:bg-sky-700 transition-colors"
          >
            Launch ↗
          </a>
        ) : (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onInspect(product); }}
            className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-[10px] hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Details →
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function ExplorePage() {
  const router = useRouter();
  const { user, wallet, isAuthenticated } = usePlatformStore();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");

  const isPrivilegedUser = user?.role === "admin" || user?.role === "operator";
  const allCategories = React.useMemo(() => getProductCategories(), []);

  // Resolve the canonical hierarchy — this is the single source of truth
  const hierarchy = React.useMemo(() => resolveShowcaseHierarchy(), []);

  // Filtered view for search/category — operates on hierarchy-ordered list
  const filteredProducts = React.useMemo(() => {
    return getAllProducts({
      includeInternal: isPrivilegedUser,
      category: selectedCategory === "All" ? undefined : selectedCategory,
      searchQuery: searchQuery.trim() || undefined
    }).filter((prod) => {
      if (selectedStatus === "all") return true;
      if (selectedStatus === "future-launch") return prod.status === "coming-soon";
      return prod.status === selectedStatus;
    });
  }, [isPrivilegedUser, selectedCategory, searchQuery, selectedStatus]);

  const isFiltering = Boolean(searchQuery || selectedCategory !== "All" || selectedStatus !== "all");

  const handleInspect = (prod: ProductShowcase) => {
    router.push(`/explore/${prod.productId}`);
  };

  // When not filtering, use the hierarchy-ordered groupings
  const { starProduct, featuredProducts, futureLaunchProducts, standardProducts } = hierarchy;

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-slate-900 py-10 px-4 sm:px-6 lg:px-12 bg-mesh-light">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* ── Navigation bar ── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-black/5 pb-6">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
            <ArohLogo size={36} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                  Ecosystem Explorer
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200">
                  VERIFIED REGISTRY
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-0.5">
                Canonical showcase of interconnected applications in the AROH ecosystem.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={() => router.push("/")}
              className="px-4 text-xs bg-white text-slate-800 border-black/10 hover:bg-slate-50 cursor-pointer"
            >
              Home
            </Button>
            {isAuthenticated && (
              <div className="bg-white border border-black/10 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold text-slate-800 shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {formatArosBalance(wallet?.balance, user?.role)}
              </div>
            )}
          </div>
        </div>

        {/* ── Filter Controls ── */}
        <div className="space-y-3">
          <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
            {/* Search */}
            <div className="flex-1 max-w-md relative">
              <label htmlFor="productSearch" className="sr-only">Search products</label>
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                id="productSearch"
                type="text"
                placeholder="Search by name, capability, or technology..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-white border border-black/10 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 transition-colors text-xs shadow-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                  aria-label="Clear search"
                >✕</button>
              )}
            </div>

            {/* Status segmented control */}
            <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-black/5 text-xs flex-shrink-0">
              {[
                { id: "all", label: "All" },
                { id: "online", label: "🟢 Live" },
                { id: "future-launch", label: "🟡 Future Launch" }
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStatus(s.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedStatus === s.id
                      ? "bg-white text-slate-900 shadow-sm font-bold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                    : "bg-white text-slate-600 border-black/5 hover:border-slate-300 hover:text-slate-900 shadow-sm"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── FILTERED VIEW (search/category/status active) ── */}
        <AnimatePresence mode="wait">
          {isFiltering ? (
            <motion.div key="filtered" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {filteredProducts.length === 0 ? (
                <div className="bg-white border border-black/5 rounded-2xl p-12 text-center space-y-3 shadow-sm">
                  <p className="text-slate-700 font-semibold text-sm">No ecosystem products match your criteria.</p>
                  <p className="text-slate-400 text-xs">Try resetting your search or selecting another category.</p>
                  <Button variant="secondary" onClick={() => { setSearchQuery(""); setSelectedCategory("All"); setSelectedStatus("all"); }} className="mt-2 text-xs">
                    Reset Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((prod, i) => {
                    const role = hierarchy.getRole(prod.productId);
                    if (role === "future-launch") {
                      return <FutureLaunchCard key={prod.productId} product={prod} delay={i * 0.05} onInspect={handleInspect} />;
                    }
                    if (role === "star") {
                      return <FeaturedCard key={prod.productId} product={prod} role="star" hierarchy={hierarchy} delay={i * 0.05} onInspect={handleInspect} />;
                    }
                    return <FeaturedCard key={prod.productId} product={prod} role={role} hierarchy={hierarchy} delay={i * 0.05} onInspect={handleInspect} />;
                  })}
                </div>
              )}
            </motion.div>
          ) : (
            /* ── HIERARCHICAL VIEW (default / no filter) ── */
            <motion.div key="hierarchical" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12">

              {/* ─ Star Product spotlight ─ */}
              <section aria-label="Flagship product">
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Current Flagship</h2>
                  <span className="flex-1 h-px bg-black/5" />
                </div>
                <StarProductCard product={starProduct} hierarchy={hierarchy} onInspect={handleInspect} />
              </section>

              {/* ─ Featured products ─ */}
              {featuredProducts.length > 0 && (
                <section aria-label="Featured products">
                  <div className="flex items-center gap-3 mb-5">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Featured Products</h2>
                    <span className="flex-1 h-px bg-black/5" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {featuredProducts.map((prod, i) => (
                      <FeaturedCard
                        key={prod.productId}
                        product={prod}
                        role="featured"
                        hierarchy={hierarchy}
                        delay={i * 0.08}
                        onInspect={handleInspect}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* ─ Future Launch ─ */}
              {futureLaunchProducts.length > 0 && (
                <section aria-label="Future launch products">
                  <div className="flex items-center gap-3 mb-5">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-amber-500">Coming Soon</h2>
                    <span className="flex-1 h-px bg-amber-200/60" />
                    <span className="text-[10px] text-amber-600 font-medium bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      In Development
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {futureLaunchProducts.map((prod, i) => (
                      <FutureLaunchCard
                        key={prod.productId}
                        product={prod}
                        delay={i * 0.08}
                        onInspect={handleInspect}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* ─ Standard ecosystem products ─ */}
              {standardProducts.filter((p) => !p.internalOnly).length > 0 && (
                <section aria-label="Ecosystem catalog">
                  <div className="flex items-center gap-3 mb-5">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Ecosystem Catalog</h2>
                    <span className="flex-1 h-px bg-black/5" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {standardProducts.filter((p) => !p.internalOnly).map((prod, i) => (
                      <StandardCard
                        key={prod.productId}
                        product={prod}
                        hierarchy={hierarchy}
                        delay={i * 0.06}
                        onInspect={handleInspect}
                      />
                    ))}
                  </div>
                </section>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
