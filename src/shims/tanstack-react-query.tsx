"use client";

import type { ReactNode } from "react";

export class QueryClient {
  constructor(_opts?: unknown) {}
}

export function QueryClientProvider({
  children,
}: {
  children: ReactNode;
  client?: QueryClient;
}) {
  return <>{children}</>;
}
