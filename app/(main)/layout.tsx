import MainHeader from "../components/header/MainHeader";
import MainSidebar from "../components/sidebar/MainSidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#FDFCFB]">
      <MainSidebar />
      <div className="flex-1 lg:pl-64 transition-[padding] duration-300">
        <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
          <MainHeader />
        </header>
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
