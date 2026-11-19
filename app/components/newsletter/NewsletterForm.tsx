"use client"

import { useRef, useState } from "react"
import Link from "next/link"

export default function NewsletterForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus("loading")
    setError(null)
    setSuccessMessage("")

    const formData = new FormData(e.currentTarget)
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      consent: formData.get("consent") === "on",
    }

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok || data.success !== true) {
        throw new Error(data.error ?? "Unable to subscribe right now.")
      }

      setSuccessMessage(data.message || "You are subscribed to Shangazi updates.")
      setStatus("success")
      formRef.current?.reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to subscribe right now.")
      setStatus("error")
    }
  }

  return (
    <form className="newsletter-form" onSubmit={handleSubmit} ref={formRef}>
      <label className="newsletter-input">
        <span className="sr-only">Name</span>
        <input type="text" name="name" placeholder="Enter your name" aria-label="Your name" autoComplete="name" minLength={2} maxLength={120} required />
      </label>
      <label className="newsletter-input">
        <span className="sr-only">Email</span>
        <input type="email" name="email" placeholder="Enter your email" aria-label="Email address" autoComplete="email" maxLength={254} required />
      </label>
      <label className="flex items-start gap-2 text-sm text-gray-600"><input type="checkbox" name="consent" required className="mt-1" /> I agree to receive Shangazi emails and understand I can unsubscribe anytime. See the <Link href="/privacy" className="underline">Privacy Policy</Link>.</label>
      <button type="submit" className="newsletter-submit" disabled={status === "loading"}>
        {status === "loading" ? "Signing up..." : "Signup For Newsletter"}
      </button>
      {status === "success" ? <p className="newsletter-success" role="status">{successMessage}</p> : null}
      {error ? <p className="newsletter-error" role="alert">{error}</p> : null}
    </form>
  )
}
