"use client"

export default function BookingForm() {
  return (
    <form className="booking-form" onSubmit={(e) => e.preventDefault()}>
      <div className="booking-form-grid">
        <label className="booking-input">
          <span className="booking-label">Full Name</span>
          <input type="text" name="name" placeholder="Full Name" aria-label="Full Name" required />
        </label>
        <label className="booking-input">
          <span className="booking-label">Organization</span>
          <input type="text" name="organization" placeholder="Organization / Company" aria-label="Organization" />
        </label>
        <label className="booking-input">
          <span className="booking-label">Email</span>
          <input type="email" name="email" placeholder="Email" aria-label="Email" required />
        </label>
        <label className="booking-input">
          <span className="booking-label">Phone</span>
          <input type="tel" name="phone" placeholder="Phone" aria-label="Phone" />
        </label>
        <label className="booking-input">
          <span className="booking-label">City & Venue</span>
          <input type="text" name="city" placeholder="City / Venue" aria-label="City" />
        </label>
        <label className="booking-input">
          <span className="booking-label">Preferred Date</span>
          <input type="date" name="date" aria-label="Preferred Date" required />
        </label>
        <label className="booking-input">
          <span className="booking-label">Preferred Time</span>
          <select name="time" aria-label="Preferred Time">
            <option value="">Select a time</option>
            <option value="morning">Morning (8am - 11am)</option>
            <option value="afternoon">Afternoon (12pm - 4pm)</option>
            <option value="evening">Evening (5pm - 8pm)</option>
          </select>
        </label>
        <label className="booking-input">
          <span className="booking-label">Engagement Type</span>
          <select name="engagement" aria-label="Engagement Type" required>
            <option value="">Select type</option>
            <option value="keynote">Keynote / Talk</option>
            <option value="workshop">Workshop / Training</option>
            <option value="panel">Panel / Interview</option>
            <option value="media">Media Appearance</option>
            <option value="consultation">Consultation</option>
          </select>
        </label>
      </div>
      <label className="booking-input booking-input-full">
        <span className="booking-label">Event Details</span>
        <textarea name="details" placeholder="Audience, theme, goals, and desired outcomes" aria-label="Event Details" rows={4} />
      </label>
      <div className="booking-form-footer">
        <p className="booking-footnote">Response within 2 business days. Dates are tentative until confirmed by our team.</p>
        <button type="submit" className="booking-submit">
          Request Booking
        </button>
      </div>
    </form>
  )
}
