import type { Metadata } from "next"
import ComingSoon from "../components/coming-soon/ComingSoon"

export const metadata: Metadata = {
  title: "Services | Shangazi Emma Claudine",
  description:
    "Discover services from Emma Claudine (Shangazi) and Shangazi Emma Claudine, including workshops, talks, and collaborations.",
  keywords: [
    "Emma Claudine",
    "Shangazi",
    "Shangazi Emma Claudine",
    "Emma Claudine workshops",
    "Shangazi collaborations",
    "Rwanda speaker",
    "Shangazi booking",
  ],
}

export default function ServicesPage() {
  return (
    <ComingSoon
      title="Services"
      subtitle="Workshops, talks, and collaborations"
      description="Services for Emma Claudine (Shangazi) are being prepared. Check back soon for new programs and booking details."
      primaryHref="/contact"
      primaryLabel="Inquire Now"
    />
  )
}
