"use client"

import { useRef, useState } from "react"

export default function NewsletterForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus("loading")
    setError(null)

    const formData = new FormData(e.currentTarget)
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
    }

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? "Unable to subscribe right now.")
      }

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
        <input type="text" name="name" placeholder="Names" aria-label="Names" required />
      </label>
      <label className="newsletter-input">
        <span className="sr-only">Email</span>
        <input type="email" name="email" placeholder="Email" aria-label="Email" required />
      </label>
      <button type="submit" className="newsletter-submit" disabled={status === "loading"}>
        {status === "loading" ? "Signing up..." : "Signup For Newsletter"}
      </button>
      {status === "success" ? <p className="newsletter-success">Thanks for subscribing!</p> : null}
      {error ? <p className="newsletter-error">{error}</p> : null}
    </form>
  )
}
