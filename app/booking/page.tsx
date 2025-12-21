import type { Metadata } from "next"
import BookingForm from "../components/booking/BookingForm"

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
    <main className="booking-page">
      <section className="booking-hero">
        <div className="booking-hero-content">
          <h1 className="booking-title">Booking</h1>
        </div>
      </section>

      <section className="booking-section">
        <div className="booking-container">
          <div className="booking-copy">
            <h2 className="booking-heading">
              Book <span className="about-highlight-accent">Shangazi</span>
            </h2>
            <p className="booking-subtext">
              Invite Shangazi Emma Claudine for speaking engagements, workshops, or collaborations focused on youth
              empowerment, reproductive health, and impactful storytelling.
            </p>
            <div className="booking-schedule">
              <div className="booking-schedule-header">Availability</div>
              <div className="booking-schedule-grid">
                <div className="booking-slot booking-slot-confirmed">
                  <span className="booking-slot-date">Apr 12</span>
                  <span className="booking-slot-status">Booked</span>
                </div>
                <div className="booking-slot booking-slot-open">
                  <span className="booking-slot-date">Apr 19</span>
                  <span className="booking-slot-status">Open</span>
                </div>
                <div className="booking-slot booking-slot-open">
                  <span className="booking-slot-date">Apr 26</span>
                  <span className="booking-slot-status">Open</span>
                </div>
                <div className="booking-slot booking-slot-hold">
                  <span className="booking-slot-date">May 03</span>
                  <span className="booking-slot-status">On Hold</span>
                </div>
                <div className="booking-slot booking-slot-confirmed">
                  <span className="booking-slot-date">May 10</span>
                  <span className="booking-slot-status">Booked</span>
                </div>
                <div className="booking-slot booking-slot-open">
                  <span className="booking-slot-date">May 17</span>
                  <span className="booking-slot-status">Open</span>
                </div>
              </div>
              <p className="booking-note">
                Please request dates at least 3 weeks in advance. We&apos;ll confirm availability or propose the closest
                open slot.
              </p>
            </div>
          </div>

          <BookingForm />
        </div>
      </section>
    </main>
  )
}
