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
  ProductDetails,
  registeredProducts,
  launchProductWebpage
} from "@aroh/asdk";
import { Button } from "@aroh/ads";
import { motion } from "framer-motion";
import ArohLogo from "../components/aroh-logo";

// Re-export for any external consumers
export { type ProductDetails, registeredProducts, launchProductWebpage };

export default function ExplorePage() {
  const router = useRouter();
  const { user, wallet, isAuthenticated } = usePlatformStore();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");

  const isPrivilegedUser = user?.role === "admin" || user?.role === "operator";

  const allCategories = React.useMemo(() => getProductCategories(), []);

  const visibleProducts = React.useMemo(() => {
    return getAllProducts({
      includeInternal: isPrivilegedUser,
      category: selectedCategory === "All" ? undefined : selectedCategory,
      searchQuery: searchQuery.trim() || undefined
    }).filter((prod) => {
      if (selectedStatus === "all") return true;
      return prod.status === selectedStatus;
    });
  }, [isPrivilegedUser, selectedCategory, searchQuery, selectedStatus]);

  const handleLaunchProduct = (prod: ProductShowcase) => {
    launchProductWebpage(prod, router);
  };

  const handleInspectProduct = (prod: ProductShowcase) => {
    router.push(`/explore/${prod.productId}`);
  };

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-slate-900 py-12 px-6 lg:px-12 bg-mesh-light">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Navigation bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-black/5 pb-6">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => router.push("/")}>
            <ArohLogo size={40} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                  Ecosystem Explorer
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200">
                  VERIFIED REGISTRY
                </span>
              </div>
              <p className="text-slate-500 text-xs mt-1">
                Data-driven showcase of interconnected applications and services in the AROH Ecosystem.
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

        {/* Filter Controls */}
        <div className="space-y-4">
          {/* Search bar & Status filter */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            <div className="flex-1 max-w-md relative">
              <label htmlFor="productSearch" className="sr-only">Search products</label>
              <input
                id="productSearch"
                type="text"
                placeholder="Search by name, capability, or technology..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-black/10 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-colors text-xs shadow-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Status Segmented Control */}
            <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-black/5 text-xs">
              {[
                { id: "all", label: "All Statuses" },
                { id: "online", label: "🟢 Live / Online" },
                { id: "development", label: "🟡 Source Verified" }
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

          {/* Category Chips */}
          <div className="flex flex-wrap gap-2 pt-1">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-slate-900 text-white border-slate-900 font-bold shadow-sm"
                    : "bg-white text-slate-600 border-black/5 hover:border-slate-300 hover:text-slate-900 shadow-sm"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {visibleProducts.length === 0 ? (
          <div className="bg-white border border-black/5 rounded-2xl p-12 text-center space-y-3 shadow-sm">
            <p className="text-slate-700 font-semibold text-sm">No ecosystem products match your criteria.</p>
            <p className="text-slate-400 text-xs">Try resetting your search query or selecting another category.</p>
            <Button
              variant="secondary"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSelectedStatus("all");
              }}
              className="mt-2 text-xs"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleProducts.map((prod) => {
              const isOnline = prod.status === "online";
              const isDev = prod.status === "development";

              return (
                <motion.div
                  key={prod.productId}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => handleInspectProduct(prod)}
                  className="bg-white border border-black/5 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group shadow-sm"
                >
                  <div className="space-y-4">
                    {/* Status & Tier Header */}
                    <div className="flex justify-between items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        {isOnline && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            LIVE
                          </span>
                        )}
                        {isDev && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            DEV / REPO
                          </span>
                        )}
                        {prod.status === "internal" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            INTERNAL
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase font-semibold text-slate-500 bg-slate-100">
                          {prod.category}
                        </span>
                      </div>

                      <span className="px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider bg-slate-50 text-slate-600 border border-slate-200 font-mono">
                        {prod.requiredTier.toUpperCase()}
                      </span>
                    </div>

                    {/* Product Title & Tagline */}
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors leading-tight flex items-center justify-between">
                        {prod.name}
                        <span className="text-xs font-semibold text-sky-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          Details →
                        </span>
                      </h3>
                      <p className="text-slate-500 text-[11px] font-medium mt-1 leading-snug">
                        {prod.tagline}
                      </p>
                    </div>

                    {/* Short Description */}
                    <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 font-normal">
                      {prod.shortDescription}
                    </p>

                    {/* Primary Capabilities Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {prod.primaryCapabilities.slice(0, 3).map((cap, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md text-[9px] bg-slate-50 border border-slate-200/80 text-slate-600 font-mono font-medium"
                        >
                          {cap.title}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="border-t border-black/5 pt-4 mt-6 flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-mono text-[10px]">{prod.version}</span>
                    <div className="flex items-center gap-2">
                      {prod.liveUrl ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLaunchProduct(prod);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-[11px] hover:bg-sky-600 transition-colors shadow-sm cursor-pointer"
                        >
                          Launch Live ↗
                        </button>
                      ) : prod.githubUrl ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (prod.githubUrl) window.open(prod.githubUrl, "_blank", "noopener,noreferrer");
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 border border-black/10 font-bold text-[11px] transition-colors shadow-sm cursor-pointer"
                        >
                          GitHub Repo ↗
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInspectProduct(prod);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          Explore →
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
