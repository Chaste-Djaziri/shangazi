"use client";

import { useEffect, ReactNode } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Always set light theme
    document.documentElement.setAttribute("data-theme", "light");
  }, []);

  return <>{children}</>;
}

