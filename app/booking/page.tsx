import type { Metadata } from "next"
import ComingSoon from "../components/coming-soon/ComingSoon"

export const metadata: Metadata = {
  title: "Booking | Shangazi Emma Claudine",
  description:
    "Book engagements with Emma Claudine (Shangazi) and Shangazi Emma Claudine for keynotes, workshops, panels, or consultations.",
  keywords: [
    "Emma Claudine",
    "Shangazi",
    "Shangazi Emma Claudine",
    "Book Shangazi Emma Claudine",
    "Emma Claudine booking",
    "Shangazi speaking",
    "Rwanda keynote",
    "Shangazi workshop",
  ],
}

export default function BookingPage() {
  return (
    <ComingSoon
      title="Booking"
      subtitle="Speaking engagements and workshops"
      description="Bookings for Emma Claudine (Shangazi) are opening soon. Share your request and we will get back to you."
      primaryHref="/contact"
      primaryLabel="Request Booking"
    />
  )
}
