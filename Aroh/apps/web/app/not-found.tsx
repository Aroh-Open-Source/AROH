import React from "react";
import Link from "next/link";
import ArohLogo from "./components/aroh-logo";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-md w-full p-8 rounded-2xl bg-white/80 border border-black/10 shadow-sm backdrop-blur-md space-y-6">
        <div className="flex justify-center">
          <ArohLogo size={56} />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            HTTP 404 • Page Not Found
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 pt-2">
            Lost in the Ecosystem
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            The page or resource you requested could not be located within the AROH platform directory.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            Return to Homepage
          </Link>
          <Link
            href="/explore"
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 border border-black/5 transition-colors"
          >
            Explore Products
          </Link>
        </div>

        <div className="border-t border-black/5 pt-4 text-xs text-slate-400">
          Looking for platform policies? View our{" "}
          <Link href="/privacy" className="text-slate-600 hover:underline">
            Privacy Notice
          </Link>{" "}
          or{" "}
          <Link href="/terms" className="text-slate-600 hover:underline">
            Terms
          </Link>
          .
        </div>
      </div>
    </div>
  );
}
