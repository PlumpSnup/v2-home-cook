"use client";

import { useEffect } from "react";

/** Jumps to the top of the page when it mounts, e.g. after finishing a long form. */
export function ScrollToTop() {
  useEffect(() => window.scrollTo({ top: 0 }), []);
  return null;
}
