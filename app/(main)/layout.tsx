import MainHeader from "../components/header/MainHeader";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="main-layout">
      <MainHeader />
      {children}
    </div>
  );
}
