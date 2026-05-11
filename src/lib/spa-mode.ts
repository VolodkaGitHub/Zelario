/**
 * SPA mode: all auth, API, and wallet state live in the browser.
 * No server cookies, middleware, or RSC data fetching in the app shell.
 */
export const isSpaMode = (): boolean =>
  process.env.NEXT_PUBLIC_SPA_MODE !== "false";
