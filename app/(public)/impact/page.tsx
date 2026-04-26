import type { Metadata } from "next"
import ComingSoon from "../components/coming-soon/ComingSoon"

export const metadata: Metadata = {
  title: "Impact | Shangazi Emma Claudine",
  description:
    "Explore the impact of Emma Claudine (Shangazi) and Shangazi Emma Claudine across communities and youth programs.",
  keywords: ["Emma Claudine", "Shangazi", "Shangazi Emma Claudine", "impact", "youth programs"],
}

export default function ImpactPage() {
  return (
    <ComingSoon
      title="Impact"
      subtitle="Stories, metrics, and initiatives"
      description="Impact reports for Shangazi Emma Claudine are being compiled. Check back soon for highlights."
      primaryHref="/social-proof"
      primaryLabel="See Social Proof"
    />
  )
}
