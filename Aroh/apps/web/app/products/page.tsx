"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  usePlatformStore,
  MembershipLevel,
  formatArosBalance,
  registeredProducts,
  ProductDetails,
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
  const [selectedProduct, setSelectedProduct] = React.useState<ProductDetails>(registeredProducts[0]);

  React.useEffect(() => {
    if (isRehydrated && !isAuthenticated) {
      router.push("/");
    }
  }, [isRehydrated, isAuthenticated, router]);

  const categories = React.useMemo(() => {
    const set = new Set<string>();
    set.add("All");
    registeredProducts.forEach((p) => {
      set.add(p.category);
    });
    return Array.from(set);
  }, []);

  const isPrivilegedUser = user?.role === "admin" || user?.role === "operator";

  const visibleProducts = registeredProducts.filter((prod) => {
    if (prod.internalOnly && !isPrivilegedUser) return false;
    return true;
  });

  const filteredProducts = visibleProducts.filter((prod) => {
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.technologySummary?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || prod.category === selectedCategory || prod.badge === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTierImportance = (tier: MembershipLevel): number => {
    if (tier === "enterprise") return 2;
    if (tier === "pro") return 1;
    return 0;
  };

  const userTierImportance = profile ? getTierImportance(profile.membershipLevel) : 0;
  const productTierImportance = getTierImportance(selectedProduct.requiredTier);
  const hasTierAccess = userTierImportance >= productTierImportance || user?.role === "admin";

  const handleLaunchProductWebpage = (product: ProductDetails) => {
    launchProductWebpage(product, router);
  };

  const handleBuyUpgrade = async () => {
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

  if (!isRehydrated || !isAuthenticated || !profile || !wallet) {
    return (
      <div className="min-h-screen bg-[#fbfbfa] flex justify-center items-center text-slate-900">
        <span className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isOnline = selectedProduct.status === "online";
  const isDev = selectedProduct.status === "development";

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-slate-900 py-10 px-6 lg:px-12 bg-mesh-light">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation / Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-black/5 pb-6">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => router.push("/")}>
            <ArohLogo size={38} />
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                AROH Products Console
              </h1>
              <p className="text-slate-500 text-xs mt-0.5 font-sans">
                Ecosystem Product Directory & Standalone Launch Console
              </p>
            </div>
          </div>
          
          <div className="flex gap-3 items-center">
            <NotificationCenter />
            <div
              onClick={() => router.push("/dashboard")}
              className="bg-white border border-black/10 px-3.5 py-1.5 rounded-xl flex items-center gap-2 cursor-pointer hover:border-slate-300 transition-colors shadow-sm"
            >
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-slate-800 font-mono">
                {formatArosBalance(wallet.balance, user?.role)}
              </span>
            </div>
            <Button variant="secondary" onClick={() => router.push("/")} className="px-4 text-xs bg-white text-slate-800 border-black/10 hover:bg-slate-50 cursor-pointer">
              Home
            </Button>
            <Button variant="glass" onClick={() => router.push("/dashboard")} className="px-4 text-xs bg-slate-100 text-slate-800 border-slate-200 cursor-pointer">
              Dashboard
            </Button>
          </div>
        </div>

        {/* Console Hub Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Product Selector Navigator */}
          <div className="lg:col-span-1 space-y-6 flex flex-col h-[70vh]">
            <div className="space-y-4">
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
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-600 border-black/5 hover:text-slate-900 hover:border-slate-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400 font-mono">No products found.</div>
              ) : (
                filteredProducts.map((prod) => {
                  const isActive = (selectedProduct.productId || selectedProduct.id) === (prod.productId || prod.id);
                  return (
                    <div
                      key={prod.productId || prod.id}
                      onClick={() => setSelectedProduct(prod)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between hover:border-slate-400 bg-white shadow-sm group ${
                        isActive ? "border-slate-900 ring-2 ring-slate-900/10 shadow-md" : "border-black/5"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-slate-900 text-sm leading-tight group-hover:text-sky-600 transition-colors">
                          {prod.name}
                        </h3>
                        <div className="flex items-center gap-1">
                          {prod.status === "online" && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="Live" />
                          )}
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            {prod.badge}
                          </span>
                        </div>
                      </div>
                      <p className="text-slate-600 text-xs line-clamp-2 mt-2 leading-relaxed font-normal">{prod.description}</p>
                      
                      <div className="mt-3 pt-2 border-t border-black/5 flex justify-between items-center">
                        <span className="text-[9px] font-mono text-slate-400">{prod.version}</span>
                        <span className="text-[10px] text-sky-600 font-bold group-hover:underline">Select →</span>
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
              key={selectedProduct.productId || selectedProduct.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-black/5 rounded-3xl p-8 space-y-6 shadow-sm"
            >
              <div className="flex justify-between items-start flex-wrap gap-4 border-b border-black/5 pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[9px] uppercase font-mono font-extrabold tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                      {selectedProduct.badge}
                    </span>
                    {isOnline && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        LIVE
                      </span>
                    )}
                    {isDev && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        IN DEV
                      </span>
                    )}
                  </div>
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-slate-500 text-xs mt-1">
                    Developed by <strong className="text-slate-900">{selectedProduct.author}</strong> • Version <strong className="text-sky-600 font-mono">{selectedProduct.version}</strong>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => router.push(`/explore/${selectedProduct.productId || selectedProduct.id}`)}
                    className="px-4 py-2.5 font-bold text-xs bg-white text-slate-800 border-black/10 hover:bg-slate-50 cursor-pointer shadow-sm"
                  >
                    Deep Dive →
                  </Button>
                  {selectedProduct.liveUrl && (
                    <Button
                      variant="primary"
                      onClick={() => handleLaunchProductWebpage(selectedProduct)}
                      className="px-6 py-2.5 font-bold text-xs bg-slate-900 text-white hover:bg-slate-800 shadow-sm cursor-pointer"
                    >
                      Launch Webpage ↗
                    </Button>
                  )}
                  {!selectedProduct.liveUrl && selectedProduct.githubUrl && (
                    <Button
                      variant="secondary"
                      onClick={() => window.open(selectedProduct.githubUrl, "_blank", "noopener,noreferrer")}
                      className="px-5 py-2.5 font-bold text-xs bg-slate-100 text-slate-800 hover:bg-slate-200 border border-black/10 cursor-pointer shadow-sm"
                    >
                      GitHub Repo ↗
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-500">Overview</h3>
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap bg-slate-50 border border-slate-200/80 p-5 rounded-2xl font-normal">
                  {selectedProduct.longDescription}
                </p>
              </div>

              {selectedProduct.primaryCapabilities && selectedProduct.primaryCapabilities.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-500">Verified Capabilities</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedProduct.primaryCapabilities.map((cap, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-black/5">
                        <div className="font-bold text-xs text-slate-900">{cap.title}</div>
                        <div className="text-[11px] text-slate-500 mt-1 leading-snug">{cap.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!hasTierAccess && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-6 space-y-3">
                  <h4 className="font-bold text-sm">Access Restricted</h4>
                  <p className="text-xs text-slate-600">
                    This service requires <strong>Platform {selectedProduct.requiredTier.toUpperCase()}</strong> access level.
                    Your current membership is <strong>{profile.membershipLevel.toUpperCase()}</strong>.
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
