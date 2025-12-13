"use client"

export default function NewsletterForm() {
  return (
    <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
      <label className="newsletter-input">
        <span className="sr-only">Name</span>
        <input type="text" name="name" placeholder="Names" aria-label="Names" required />
      </label>
      <label className="newsletter-input">
        <span className="sr-only">Email</span>
        <input type="email" name="email" placeholder="Email" aria-label="Email" required />
      </label>
      <button type="submit" className="newsletter-submit">
        Signup For Newsletter
      </button>
    </form>
  )
}
