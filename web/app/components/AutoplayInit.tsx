"use client";

import { useEffect } from "react";
import { attemptAutoplay } from "../lib/audio";

// Tries to autoplay music on mount. If the browser blocks it (most do),
// falls back to starting on the first user gesture.
export function AutoplayInit() {
  useEffect(() => {
    attemptAutoplay();
  }, []);
  return null;
}
