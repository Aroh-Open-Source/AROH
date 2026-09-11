"use client";

import React from "react";
import Link from "next/link";
import ArohLogo from "./components/aroh-logo";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log non-sensitive error telemetry locally
    console.error("AROH App Boundary Caught Error:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-md w-full p-8 rounded-2xl bg-white/80 border border-black/10 shadow-sm backdrop-blur-md space-y-6">
        <div className="flex justify-center">
          <ArohLogo size={56} />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            System Error • Execution Interrupted
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 pt-2">
            Something went wrong
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            An unexpected error occurred while rendering this view. Your session and account state remain secure.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 border border-black/5 transition-colors"
          >
            Return to Homepage
          </Link>
        </div>

        {error?.digest && (
          <div className="border-t border-black/5 pt-3 text-[11px] font-mono text-slate-400">
            Error digest: {error.digest}
          </div>
        )}
      </div>
    </div>
  );
}
