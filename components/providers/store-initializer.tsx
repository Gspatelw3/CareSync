"use client";

import { useEffect } from "react";

// Lazy-load store initialization to reduce initial memory footprint
export function StoreInitializer() {
  useEffect(() => {
    // Dynamically import store initialization to reduce initial bundle size
    import("@/lib/stores").then(({ initializeAllStores }) => {
      // Only initialize stores that are actually needed
      initializeAllStores();
    });
  }, []);

  return null;
}
