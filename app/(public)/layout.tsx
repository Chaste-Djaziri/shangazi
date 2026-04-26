import ClientChrome from "../components/chrome/ClientChrome";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientChrome>{children}</ClientChrome>;
}
