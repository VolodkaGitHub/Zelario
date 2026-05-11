"use client";

/** Lightweight PersistGate fallback (avoids heavy framer-motion on every refresh). */
export function PersistLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
    </div>
  );
}
