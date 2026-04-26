import type { Metadata } from "next"
import ComingSoon from "../components/coming-soon/ComingSoon"

export const metadata: Metadata = {
  title: "Social Proof | Shangazi Emma Claudine",
  description:
    "Community stories, testimonials, and proof of impact from Emma Claudine (Shangazi) and Shangazi Emma Claudine.",
  keywords: ["Emma Claudine", "Shangazi", "Shangazi Emma Claudine", "social proof", "impact"],
}

export default function SocialProofPage() {
  return (
    <ComingSoon
      title="Social Proof"
      subtitle="Community stories and testimonials"
      description="We are collecting stories and testimonials that highlight Shangazi Emma Claudine's community impact."
      primaryHref="/testimonials"
      primaryLabel="View Testimonials"
    />
  )
}
