"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { usePlatformStore, getProductById, ProductShowcase } from "@aroh/asdk";
import { Button } from "@aroh/ads";
import ArohLogo from "../../components/aroh-logo";

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, profile, wallet, upgradeMembership, isAuthenticated, isLoading } = usePlatformStore();

  const productId = params?.productId as string;
  const product: ProductShowcase | undefined = getProductById(productId);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#fbfbfa] text-slate-900 flex flex-col justify-center items-center gap-4 px-6">
        <ArohLogo size={48} />
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Product Not Found</h1>
        <p className="text-slate-500 text-sm text-center max-w-md">
          The requested product ID <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">{productId}</code> is not registered in the canonical AROH showcase registry.
        </p>
        <Button variant="secondary" onClick={() => router.push("/explore")} className="mt-2 text-xs">
          Return to Explorer
        </Button>
      </div>
    );
  }

  // Tier access check
  const hasTierAccess =
    isAuthenticated &&
    profile &&
    (product.requiredTier === "basic" ||
      (product.requiredTier === "pro" && (profile.membershipLevel === "pro" || profile.membershipLevel === "enterprise")) ||
      (product.requiredTier === "enterprise" && profile.membershipLevel === "enterprise") ||
      user?.role === "admin");

  const handleLaunchLive = () => {
    if (!product.liveUrl) return;
    if (product.liveUrl.startsWith("http://") || product.liveUrl.startsWith("https://")) {
      window.open(product.liveUrl, "_blank", "noopener,noreferrer");
    } else {
      router.push(product.liveUrl);
    }
  };

  const handleOpenGithub = () => {
    if (product.githubUrl) {
      window.open(product.githubUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleOpenDocs = () => {
    if (product.docsUrl) {
      window.open(product.docsUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleBuyUpgrade = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    try {
      await upgradeMembership(product.requiredTier, product.price);
      alert(`Successfully upgraded to Platform ${product.requiredTier.toUpperCase()} tier.`);
    } catch (err: any) {
      alert(err.message || "Failed to upgrade membership");
    }
  };

  const isOnline = product.status === "online";
  const isDev = product.status === "development";

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-slate-900 py-12 px-6 lg:px-12 bg-mesh-light">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Navigation & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-black/5 pb-6">
          <div className="flex items-center gap-3">
            <div className="cursor-pointer" onClick={() => router.push("/")} title="AROH Home">
              <ArohLogo size={32} />
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <span className="hover:text-slate-800 cursor-pointer" onClick={() => router.push("/explore")}>
                Explorer
              </span>
              <span>/</span>
              <span className="text-slate-800 font-semibold">{product.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={() => router.push("/explore")}
              className="px-4 text-xs bg-white text-slate-800 border-black/10 hover:bg-slate-50 cursor-pointer shadow-sm"
            >
              ← Back to Explore
            </Button>
            {isAuthenticated && (
              <Button
                variant="glass"
                onClick={() => router.push("/dashboard")}
                className="px-4 text-xs bg-slate-100 text-slate-800 border-slate-200 cursor-pointer"
              >
                Dashboard
              </Button>
            )}
          </div>
        </div>

        {/* Product Details Hero Card */}
        <div className="bg-white border border-black/5 rounded-3xl p-8 space-y-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-mono font-bold bg-slate-100 border border-slate-200 text-slate-700">
                  {product.badge}
                </span>
                {isOnline && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    LIVE DEPLOYMENT
                  </span>
                )}
                {isDev && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    SOURCE VERIFIED / IN DEV
                  </span>
                )}
                {product.status === "internal" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    INTERNAL SERVICE
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
                {product.name}
              </h1>
              <p className="text-slate-500 text-sm font-medium">
                {product.tagline}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-slate-400 block font-sans">Required Membership</span>
              <span className="text-sm font-extrabold uppercase text-sky-600 block tracking-wider mt-0.5 font-mono">
                {product.requiredTier}
              </span>
            </div>
          </div>

          <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap pt-4 border-t border-black/5 font-normal">
            {product.longDescription}
          </p>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-black/5 pt-6 text-xs text-slate-500">
            <div>
              <span className="text-slate-400 block">Verified Version</span>
              <strong className="text-slate-900 block mt-1 font-mono">{product.version}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Maintainer / Author</span>
              <strong className="text-slate-900 block mt-1">{product.author}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Category</span>
              <strong className="text-slate-900 block mt-1">{product.category}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Tier Access Cost</span>
              <strong className="text-sky-600 block mt-1 font-mono">
                {product.price > 0 ? `${product.price} Aros` : "Included (Free)"}
              </strong>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-black/5">
            {product.liveUrl && (
              <Button
                variant="primary"
                onClick={handleLaunchLive}
                className="px-6 py-2.5 text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-sm cursor-pointer"
              >
                Launch Live App ↗
              </Button>
            )}
            {product.githubUrl && (
              <Button
                variant="secondary"
                onClick={handleOpenGithub}
                className="px-5 py-2.5 text-xs font-semibold bg-white text-slate-800 border-black/10 hover:bg-slate-50 shadow-sm cursor-pointer"
              >
                View on GitHub ↗
              </Button>
            )}
            {product.docsUrl && (
              <Button
                variant="secondary"
                onClick={handleOpenDocs}
                className="px-5 py-2.5 text-xs font-semibold bg-white text-slate-800 border-black/10 hover:bg-slate-50 shadow-sm cursor-pointer"
              >
                Documentation ↗
              </Button>
            )}
          </div>

          {/* Notice when live deployment is offline */}
          {!product.liveUrl && product.githubUrl && (
            <div className="bg-slate-50 border border-black/5 rounded-xl p-4 text-xs text-slate-600 flex items-start gap-3">
              <span className="text-base">ℹ️</span>
              <p>
                <strong>Deployment Staging:</strong> The production deployment for {product.name} is currently maintained in private development staging. You can inspect the authoritative source code, architecture specifications, and test suites via the GitHub link above.
              </p>
            </div>
          )}
        </div>

        {/* Key Capabilities Showcase */}
        <div className="bg-white border border-black/5 rounded-3xl p-8 space-y-6 shadow-sm">
          <div className="border-b border-black/5 pb-4">
            <h2 className="text-lg font-bold tracking-tight text-slate-900">Key Capabilities & Features</h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Verified functional capabilities extracted from authoritative source documentation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.primaryCapabilities.map((cap, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-slate-50/60 border border-black/5 space-y-2 hover:border-slate-300 transition-colors"
              >
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                  {cap.title}
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed font-normal">
                  {cap.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Technology & Architecture */}
        <div className="bg-white border border-black/5 rounded-3xl p-8 space-y-4 shadow-sm">
          <div className="border-b border-black/5 pb-4">
            <h2 className="text-lg font-bold tracking-tight text-slate-900">Technology & Architecture</h2>
            <p className="text-slate-500 text-xs mt-0.5">Verified engineering stack components.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-black/5">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-1">Stack Components</span>
            <code className="text-xs text-slate-800 font-mono leading-relaxed block">
              {product.technologySummary}
            </code>
          </div>
        </div>

        {/* Tier Access Execution Gateway */}
        <div className="bg-white border border-black/5 rounded-3xl p-8 space-y-6 shadow-sm">
          <h2 className="text-lg font-bold tracking-tight text-slate-900">Access Management & Membership</h2>

          {!hasTierAccess ? (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-sm">Tier Access Upgrade Required</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                This service requires <strong>Platform {product.requiredTier.toUpperCase()}</strong> access.
                Upgrade immediately for <strong>{product.price} Aros</strong> tokens from your wallet.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  variant="primary"
                  onClick={handleBuyUpgrade}
                  disabled={isLoading || !!(wallet && wallet.balance < product.price && user?.role !== "admin")}
                  className="px-6 py-2 text-xs bg-amber-600 text-white hover:bg-amber-700 cursor-pointer"
                >
                  Purchase Upgrade ({product.price} Aros)
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-bold text-sm text-emerald-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Access Authorized
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Your current membership tier ({profile?.membershipLevel.toUpperCase() || "ADMIN"}) fulfills the requirements for this product.
                </p>
              </div>
              {product.liveUrl && (
                <Button
                  variant="primary"
                  onClick={handleLaunchLive}
                  className="px-6 py-2.5 font-bold text-xs bg-slate-900 text-white hover:bg-slate-800 shadow-sm cursor-pointer whitespace-nowrap"
                >
                  Launch Webpage ↗
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Verification Provenance & Protection Invariant */}
        <div className="bg-slate-50 border border-black/5 rounded-2xl p-6 space-y-2 text-xs text-slate-500">
          <div className="flex flex-wrap justify-between items-center gap-2 font-mono text-[10px]">
            <span>Provenance Source: <strong className="text-slate-700">{product.sourceOfTruth}</strong></span>
            <span>Last Verified: <strong className="text-slate-700">{new Date(product.lastVerified).toLocaleDateString()}</strong></span>
          </div>
          <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
            <strong>Independent Product Invariant:</strong> Products in the AROH ecosystem are independently owned and versioned. The AROH showcase layer presents verified presentation metadata and non-destructive contracts without mutating product source trees.
          </p>
        </div>
      </div>
    </div>
  );
}
