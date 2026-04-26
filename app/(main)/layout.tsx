import MainHeader from "../components/header/MainHeader";
import MainSidebar from "../components/sidebar/MainSidebar";
import { SidebarProvider } from "../contexts/SidebarContext";
import MainContent from "./MainContent";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-[#FDFCFB]">
        <MainSidebar />
        <MainContent>
          <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
            <MainHeader />
          </header>
          <main className="min-h-screen">
            {children}
          </main>
        </MainContent>
      </div>
    </SidebarProvider>
  );
}
