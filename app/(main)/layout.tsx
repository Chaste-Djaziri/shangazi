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
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
