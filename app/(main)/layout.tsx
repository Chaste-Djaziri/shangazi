export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="main-layout">
      {/* We can add a specialized sidebar or dashboard header here later */}
      {children}
    </div>
  );
}
