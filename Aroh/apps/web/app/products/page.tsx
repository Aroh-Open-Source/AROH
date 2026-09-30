"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  usePlatformStore,
  MembershipLevel,
  formatArosBalance,
  resolveShowcaseHierarchy,
  getProductCategories,
  ProductShowcase,
  launchProductWebpage
} from "@aroh/asdk";
import { Button } from "@aroh/ads";
import { motion } from "framer-motion";
import NotificationCenter from "../components/notification-center";
import ArohLogo from "../components/aroh-logo";

export default function ProductsPage() {
  const router = useRouter();
  const {
    user,
    profile,
    wallet,
    isAuthenticated,
    isRehydrated,
    upgradeMembership
  } = usePlatformStore();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("All");

  // Single canonical source of truth for hierarchy and ordering
  const hierarchy = React.useMemo(() => resolveShowcaseHierarchy(), []);
  const orderedProducts = hierarchy.allOrdered;

  const [selectedProduct, setSelectedProduct] = React.useState<ProductShowcase>(
    orderedProducts[0] || hierarchy.starProduct
  );

  const categories = React.useMemo(() => getProductCategories(), []);

  const isPrivilegedUser = user?.role === "admin" || user?.role === "operator";

  const visibleProducts = orderedProducts.filter((prod) => {
    if (prod.internalOnly && !isPrivilegedUser) return false;
    return true;
  });

  const filteredProducts = visibleProducts.filter((prod) => {
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.technologySummary?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" ||
      prod.category === selectedCategory ||
      prod.badge === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTierImportance = (tier: MembershipLevel): number => {
    if (tier === "enterprise") return 2;
    if (tier === "pro") return 1;
    return 0;
  };

  const userTierImportance = profile ? getTierImportance(profile.membershipLevel) : 0;
  const productTierImportance = getTierImportance(selectedProduct.requiredTier);
  const hasTierAccess =
    isAuthenticated &&
    (userTierImportance >= productTierImportance || user?.role === "admin");

  const selectedRole = hierarchy.getRole(selectedProduct.productId);
  const selectedActions = hierarchy.getActionCapabilities(selectedProduct);

  const handleLaunchProductWebpage = (product: ProductShowcase) => {
    launchProductWebpage(product, router);
  };

  const handleBuyUpgrade = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!wallet || (wallet.balance < selectedProduct.price && user?.role !== "admin")) {
      alert("Insufficient Aros tokens to execute upgrade.");
      return;
    }
    try {
      await upgradeMembership(selectedProduct.requiredTier, selectedProduct.price);
      alert(`Success! Upgraded membership level to ${selectedProduct.requiredTier.toUpperCase()}.`);
    } catch (err: any) {
      alert(err.message || "Failed to buy upgrade");
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-slate-900 py-10 px-4 sm:px-6 lg:px-12 bg-mesh-light">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation / Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-black/5 pb-6">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => router.push("/")}>
            <ArohLogo size={38} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                  AROH Products Console
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200">
                  CANONICAL HIERARCHY
                </span>
              </div>
              <p className="text-slate-500 text-xs mt-0.5 font-sans">
                Ecosystem Product Directory & Interactive Console
              </p>
            </div>
          </div>
          
          <div className="flex gap-3 items-center">
            {isAuthenticated ? (
              <>
                <NotificationCenter />
                <div
                  onClick={() => router.push("/dashboard")}
                  className="bg-white border border-black/10 px-3.5 py-1.5 rounded-xl flex items-center gap-2 cursor-pointer hover:border-slate-300 transition-colors shadow-sm"
                >
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-slate-800 font-mono">
                    {formatArosBalance(wallet?.balance, user?.role)}
                  </span>
                </div>
                <Button variant="glass" onClick={() => router.push("/dashboard")} className="px-4 text-xs bg-slate-100 text-slate-800 border-slate-200 cursor-pointer">
                  Dashboard
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                onClick={() => router.push("/login")}
                className="px-4 py-2 text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-sm cursor-pointer"
              >
                Sign In
              </Button>
            )}
            <Button variant="secondary" onClick={() => router.push("/")} className="px-4 text-xs bg-white text-slate-800 border-black/10 hover:bg-slate-50 cursor-pointer">
              Home
            </Button>
            <Button variant="secondary" onClick={() => router.push("/explore")} className="px-4 text-xs bg-white text-slate-800 border-black/10 hover:bg-slate-50 cursor-pointer">
              Explorer
            </Button>
          </div>
        </div>

        {/* Console Hub Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Product Selector Navigator */}
          <div className="lg:col-span-1 space-y-5 flex flex-col h-[75vh]">
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900">Ecosystem Directory</h2>
              <label htmlFor="prodConsoleFilter" className="sr-only">Filter console products</label>
              <input
                id="prodConsoleFilter"
                type="text"
                placeholder="Search products by name or tech..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-black/10 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 text-xs shadow-sm"
              />
            </div>

            {/* Category selection */}
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider transition-all border cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                      : "bg-white text-slate-600 border-black/5 hover:text-slate-900 hover:border-slate-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400 font-mono">No products found.</div>
              ) : (
                filteredProducts.map((prod) => {
                  const isActive = selectedProduct.productId === prod.productId;
                  const role = hierarchy.getRole(prod.productId);
                  const isFuture = role === "future-launch";

                  return (
                    <div
                      key={prod.productId}
                      onClick={() => setSelectedProduct(prod)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group shadow-sm ${
                        isActive
                          ? "border-slate-900 ring-2 ring-slate-900/10 shadow-md bg-white"
                          : isFuture
                          ? "bg-amber-50/40 border-amber-200/60 hover:border-amber-300"
                          : "bg-white border-black/5 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="space-y-0.5">
                          <h3 className={`font-bold text-sm leading-tight transition-colors ${
                            isActive ? "text-slate-900" : isFuture ? "text-slate-800" : "text-slate-900 group-hover:text-sky-600"
                          }`}>
                            {prod.name}
                          </h3>
                          <span className="text-[10px] text-slate-400 block line-clamp-1">{prod.tagline}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {role === "star" && (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-mono">
                              STAR
                            </span>
                          )}
                          {role === "featured" && (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                              LIVE
                            </span>
                          )}
                          {role === "future-launch" && (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-mono">
                              SOON
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-2 border-t border-black/5 flex justify-between items-center text-[10px]">
                        <span className="font-mono text-slate-400">{prod.version}</span>
                        <span className={`font-bold ${isActive ? "text-slate-900" : isFuture ? "text-amber-600" : "text-sky-600"}`}>
                          {isActive ? "Selected" : "Select →"}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Selected Product Display */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              key={selectedProduct.productId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`rounded-3xl p-8 space-y-6 shadow-sm border ${
                selectedRole === "star"
                  ? "bg-slate-900 text-white border-slate-800"
                  : selectedRole === "future-launch"
                  ? "bg-gradient-to-br from-white to-amber-50/30 border-amber-200/80"
                  : "bg-white border-black/5"
              }`}
            >
              <div className={`flex justify-between items-start flex-wrap gap-4 border-b pb-6 ${
                selectedRole === "star" ? "border-white/10" : "border-black/5"
              }`}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] uppercase font-mono font-extrabold tracking-wider border ${
                      selectedRole === "star"
                        ? "bg-sky-500/20 text-sky-300 border-sky-500/30"
                        : selectedRole === "future-launch"
                        ? "bg-amber-100 text-amber-800 border-amber-200"
                        : "bg-slate-100 text-slate-700 border-slate-200"
                    }`}>
                      {selectedRole === "star" ? "CURRENT FLAGSHIP" : selectedRole === "future-launch" ? "FUTURE LAUNCH" : selectedProduct.badge}
                    </span>
                    {selectedProduct.status === "online" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        LIVE
                      </span>
                    )}
                  </div>
                  <h2 className={`text-3xl font-extrabold tracking-tight mt-3 ${
                    selectedRole === "star" ? "text-white" : "text-slate-900"
                  }`}>
                    {selectedProduct.name}
                  </h2>
                  <p className={`text-xs mt-1 ${selectedRole === "star" ? "text-slate-400" : "text-slate-500"}`}>
                    Developed by <strong className={selectedRole === "star" ? "text-white" : "text-slate-900"}>{selectedProduct.author}</strong> • Version <strong className="font-mono text-sky-500">{selectedProduct.version}</strong>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => router.push(`/explore/${selectedProduct.productId}`)}
                    className="px-4 py-2.5 font-bold text-xs bg-white text-slate-800 border-black/10 hover:bg-slate-50 cursor-pointer shadow-sm"
                  >
                    Deep Dive →
                  </Button>
                  {selectedActions.canLaunchLive && selectedProduct.liveUrl && (
                    <Button
                      variant="primary"
                      onClick={() => handleLaunchProductWebpage(selectedProduct)}
                      className="px-6 py-2.5 font-bold text-xs bg-slate-900 text-white hover:bg-slate-800 shadow-sm cursor-pointer"
                    >
                      Launch Webpage ↗
                    </Button>
                  )}
                  {selectedActions.isFutureLaunch && selectedProduct.githubUrl && (
                    <Button
                      variant="secondary"
                      onClick={() => window.open(selectedProduct.githubUrl, "_blank", "noopener,noreferrer")}
                      className="px-5 py-2.5 font-bold text-xs bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-200 cursor-pointer shadow-sm"
                    >
                      Source Repo ↗
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className={`text-xs uppercase font-mono font-bold tracking-wider ${
                  selectedRole === "star" ? "text-slate-400" : "text-slate-500"
                }`}>Overview</h3>
                <p className={`text-sm leading-relaxed p-5 rounded-2xl font-normal ${
                  selectedRole === "star"
                    ? "bg-slate-800/80 border border-slate-700 text-slate-300"
                    : "bg-slate-50 border border-slate-200/80 text-slate-700"
                }`}>
                  {selectedProduct.longDescription}
                </p>
              </div>

              {selectedProduct.primaryCapabilities && selectedProduct.primaryCapabilities.length > 0 && (
                <div className="space-y-3">
                  <h3 className={`text-xs uppercase font-mono font-bold tracking-wider ${
                    selectedRole === "star" ? "text-slate-400" : "text-slate-500"
                  }`}>Verified Capabilities</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedProduct.primaryCapabilities.map((cap, i) => (
                      <div key={i} className={`p-3.5 rounded-xl border ${
                        selectedRole === "star"
                          ? "bg-slate-800/60 border-slate-700"
                          : "bg-slate-50 border-black/5"
                      }`}>
                        <div className={`font-bold text-xs ${selectedRole === "star" ? "text-white" : "text-slate-900"}`}>{cap.title}</div>
                        <div className={`text-[11px] mt-1 leading-snug ${selectedRole === "star" ? "text-slate-400" : "text-slate-500"}`}>{cap.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Notice for Future Launch */}
              {selectedActions.isFutureLaunch ? (
                <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-5 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <h4 className="font-bold text-sm">Future Launch — In Active Development</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    This product is actively being engineered and is not yet available for purchase, installation, or live deployment.
                    Review the roadmap or inspect source specifications via the deep dive portal.
                  </p>
                </div>
              ) : isAuthenticated && !hasTierAccess && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-6 space-y-3">
                  <h4 className="font-bold text-sm">Access Restricted</h4>
                  <p className="text-xs text-slate-600">
                    This service requires <strong>Platform {selectedProduct.requiredTier.toUpperCase()}</strong> access level.
                    Your current membership is <strong>{profile?.membershipLevel?.toUpperCase() || "BASIC"}</strong>.
                  </p>
                  <Button variant="primary" onClick={handleBuyUpgrade} className="px-5 py-2 text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 cursor-pointer">
                    Upgrade Access ({selectedProduct.price} Aros)
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
