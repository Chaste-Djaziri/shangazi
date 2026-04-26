"use client";

import { useSidebar } from "../contexts/SidebarContext";

export default function MainContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <div className={`flex-1 min-w-0 transition-all duration-300 ${isCollapsed ? "lg:pl-20" : "lg:pl-64"}`}>
      {children}
    </div>
  );
}
