"use client";

import { useMemo } from "react";
import { mockStore } from "@/mock/store";

type QueryRef = { _path?: string };

function refKey(ref: unknown): string {
  if (ref && typeof ref === "object") {
    const r = ref as QueryRef;
    if (r._path) return r._path;
  }
  return String(ref);
}

export function useQuery(ref: unknown, _args?: unknown) {
  const key = refKey(ref);
  return useMemo(() => {
    if (key.includes("getHiddenTokenIds")) {
      return mockStore.getHiddenTokenIds();
    }
    if (key.includes("getReports")) {
      return mockStore.getNftReports();
    }
    return undefined;
  }, [key]);
}

export function useMutation(ref: unknown) {
  const key = refKey(ref);
  return async (args: Record<string, unknown>) => {
    if (key.includes("setVisibility")) {
      mockStore.setTokenHidden(String(args.tokenId), Boolean(args.hidden));
      return;
    }
    if (key.includes("createReport")) {
      mockStore.addNftReport({
        tokenId: String(args.tokenId ?? ""),
        reason: String(args.reason ?? "other"),
        detailedReason: args.detailedReason as string | undefined,
        status: "pending",
        createdAt: Date.now(),
      });
    }
    if (key.includes("resolveReport")) {
      mockStore.resolveReport(String(args.id ?? ""));
    }
  };
}

export function ConvexProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export class ConvexReactClient {
  constructor(_url: string) {}
}
