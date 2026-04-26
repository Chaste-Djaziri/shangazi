import type { Metadata } from "next"
import ComingSoon from "../components/coming-soon/ComingSoon"

export const metadata: Metadata = {
  title: "Media | Shangazi Emma Claudine",
  description:
    "Press appearances, interviews, and media resources featuring Emma Claudine (Shangazi) and Shangazi Emma Claudine.",
  keywords: ["Emma Claudine", "Shangazi", "Shangazi Emma Claudine", "media", "press"],
}

export default function MediaPage() {
  return (
    <ComingSoon
      title="Media"
      subtitle="Press, interviews, and media resources"
      description="Our media kit and press resources for Shangazi Emma Claudine are on the way. Contact us for urgent requests."
      primaryHref="/contact"
      primaryLabel="Request Media Kit"
    />
  )
}
