"use client";

import { useEffect } from "react";
import { initializeAllStores } from "@/lib/stores";

export function StoreInitializer() {
  useEffect(() => {
    // Initialize all stores with mock data on app load
    initializeAllStores();
  }, []);

  return null;
}