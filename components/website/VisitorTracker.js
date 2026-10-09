"use client";

import { useEffect } from "react";

export default function VisitorTracker() {
  useEffect(() => {
    const trackVisit = () => {
      let visitorId;
      try {
        visitorId = localStorage.getItem("stayvo_visitor_id");
        if (!visitorId) {
          visitorId = crypto.randomUUID();
          localStorage.setItem("stayvo_visitor_id", visitorId);
        }
      } catch { return; }
      fetch("/api/visitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId }),
        keepalive: true,
        priority: "low",
      }).catch(() => {});
    };

    // Give rendering and navigation priority; cleanup also avoids duplicate dev visits.
    if ("requestIdleCallback" in window) {
      const idle = window.requestIdleCallback(trackVisit, { timeout: 1500 });
      return () => window.cancelIdleCallback(idle);
    }
    const timer = window.setTimeout(trackVisit, 800);
    return () => window.clearTimeout(timer);
  }, []);

  return null;
}
