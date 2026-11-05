"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("Service Worker registered with scope:", reg.scope);
        })
        .catch((err) => {
          console.warn("Service Worker registration failed:", err);
        });
    } else if ("serviceWorker" in navigator) {
      // In development, also register to allow offline testing
      navigator.serviceWorker
        .register("/sw.js")
        .catch(() => {});
    }
  }, []);

  return null;
}
