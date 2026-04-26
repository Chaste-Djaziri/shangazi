"use client";

import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/auth-client";
import { useRouter } from "next/navigation";

export default function MainHeader() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  return (
    <header className="header border-b border-gray-100">
      <div className="header-container">
        <Link href="/discover" className="logo-link">
          <Image
            src="/logo/Shangazi Logo Variations-1.png"
            alt="Shangazi Logo"
            width={120}
            height={40}
            priority
            className="logo-image"
            style={{ width: "auto", height: "auto" }}
          />
        </Link>

        <nav className="nav desktop-nav">
          <Link href="/discover" className="nav-link">
            Discover
          </Link>
          <Link href="/blog" className="nav-link">
            Articles
          </Link>
          <Link href="/booking" className="nav-link">
            My Guidance
          </Link>
        </nav>

        <div className="header-actions">
          <div className="flex items-center gap-4">
            <button 
              type="button" 
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-red-600 transition-colors"
            >
              Logout
            </button>
            <Link href="/profile" className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-gray-100 hover:border-primary transition-colors">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold">
                  {(session?.user?.name?.[0] || session?.user?.email?.[0] || "?").toUpperCase()}
                </div>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
