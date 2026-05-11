"use client";

import type { ReactNode } from "react";

export function GoogleOAuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function GoogleLogin() {
  return null;
}

export type CredentialResponse = { credential?: string };
