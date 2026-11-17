// app/(main)/settings/page.tsx
import type { Metadata } from "next";
import { neonAuth } from "@neondatabase/auth/next/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Shield, UserRound, ShieldAlert } from "lucide-react";
import AccountSettings from "../../components/settings/AccountSettings";

export const metadata: Metadata = {
  title: "Account Settings | SEC Portal",
  description: "Manage your SEC Portal account, password, sessions and appearance.",
};

export default async function SettingsPage() {
  const { user } = await neonAuth();
  if (!user) redirect("/login");

  const links = [
    { href: "#profile", label: "Profile", icon: UserRound },
    { href: "#security", label: "Security", icon: Shield },
    { href: "#danger", label: "Delete account", icon: ShieldAlert },
  ];

  return (
    <main className="mx-auto max-w-[1180px] pb-20">
      <header className="mb-8">
        <h1 className="font-[Fraunces] text-3xl text-gray-900">Account settings</h1>
        <p className="mt-2 font-[Manrope] text-sm text-gray-500">Manage your personal details, security, and preferences.</p>
      </header>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="lg:self-start lg:sticky lg:top-28">
          <nav aria-label="Settings sections" className="flex gap-2 overflow-x-auto pb-2 lg:flex-col">
            {links.map(({ href, label, icon: Icon }) => (
              <Link href={href} key={href} className="flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 font-[Manrope] text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900">
                <Icon size={18} aria-hidden="true" />{label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="min-w-0 space-y-8">
          <AccountSettings name={user.name || ""} email={user.email || ""} image={user.image} />
          <p className="text-sm text-gray-500">For additional data or privacy requests, visit the <Link href="/privacy" className="underline hover:text-gray-900">privacy policy</Link> or <Link href="/contact" className="underline hover:text-gray-900">contact support</Link>.</p>
        </div>
      </div>
    </main>
  );
}
