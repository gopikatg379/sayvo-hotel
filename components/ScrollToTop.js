"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    // Let section links reach their anchor instead of resetting those to the top.
    if (window.location.hash) return;

    const resetScroll = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    resetScroll();
    // Run after the router's own scroll handling as well.
    const frame = window.requestAnimationFrame(resetScroll);
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
