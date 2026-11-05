"use client";

import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(typeof navigator !== "undefined" ? navigator.onLine : true);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div
      className="position-fixed bottom-0 start-0 m-3 px-3 py-2 bg-warning text-dark rounded-3 shadow d-flex align-items-center gap-2 small fw-semibold"
      style={{ zIndex: 1060 }}
    >
      <WifiOff size={16} />
      <span>Modo Offline</span>
    </div>
  );
}
