import type { Metadata } from "next"
import ComingSoon from "../components/coming-soon/ComingSoon"

export const metadata: Metadata = {
  title: "Login | Shangazi Emma Claudine",
  description:
    "Sign in to manage your bookings, newsletter preferences, and profile with Emma Claudine (Shangazi).",
  keywords: ["Emma Claudine", "Shangazi", "Shangazi Emma Claudine", "login", "account"],
}

export default function LoginPage() {
  return (
    <ComingSoon
      title="Login"
      subtitle="Member access launching soon"
      description="We are preparing a secure member area for newsletters, bookings, and updates from Emma Claudine (Shangazi)."
      primaryHref="/newsletter"
      primaryLabel="Join the Newsletter"
    />
  )
}
