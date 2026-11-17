// app/(main)/layout.tsx
import MainHeader from "../components/header/MainHeader";
import MainSidebar from "../components/sidebar/MainSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <SidebarProvider className="sec-portal bg-white" defaultOpen>
        <MainSidebar />
        <SidebarInset className="min-w-0 bg-white">
          <header className="sticky top-0 z-30 w-full bg-white">
            <MainHeader />
          </header>
          <div className="min-h-screen p-6 lg:p-10">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
