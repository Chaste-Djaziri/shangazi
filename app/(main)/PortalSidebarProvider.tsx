// app/(main)/PortalSidebarProvider.tsx
"use client";

import type { ReactNode, CSSProperties } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function PortalSidebarProvider({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider
      className="sec-portal bg-white"
      open={false}
      onOpenChange={() => {}}
      style={{ "--sidebar-width-icon": "5.25rem" } as CSSProperties}
    >
      {children}
    </SidebarProvider>
  );
}
