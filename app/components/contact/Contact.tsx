"use client"

import type React from "react"
import { useRef, useState } from "react"
import Image from "next/image"

export default function Contact() {
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
      phone: formData.get("phone"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? "Failed to send message.")
      }

      setStatus("success")
      formRef.current?.reset()
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : "Failed to send message.")
      setStatus("error")
    }
  }

  return (
    <section className="contact">
      <div className="contact-container">
        <div className="contact-left">
          <div className="contact-content">
            <p className="contact-kicker">Ask Shangazi</p>
            <h2 className="contact-title">
              Ask Freely,
              <br />
              You&apos;re Safe Here
            </h2>
            <p className="contact-subtitle">
              This space is for real questions and honest conversations.
              <br />
              Whether you&apos;re confused, curious or just need clarity, Shangazi
              <br />
              is here to listen and guide you, without judgment.
            </p>
          </div>
        </div>

        <div className="contact-right">
          <form className="contact-form" ref={formRef} onSubmit={handleSubmit}>
            <div className="contact-form-panel">
              <div className="contact-form-grid">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Full Name <span className="form-label-required">*</span>
                  </label>
                  <input type="text" id="name" name="name" className="form-input" required />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email Address <span className="form-label-required">*</span>
                  </label>
                  <input type="email" id="email" name="email" className="form-input" required />
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="form-label">
                    Phone
                  </label>
                  <input type="tel" id="phone" name="phone" className="form-input" />
                </div>

                <div className="form-group">
                  <label htmlFor="subject" className="form-label">
                    Select Subject <span className="form-label-required">*</span>
                  </label>
                  <div className="form-select-wrap">
                    <select id="subject" name="subject" className="form-input form-select" defaultValue="" required>
                      <option value="" disabled>
                        Select
                      </option>
                      <option value="Relationships">Relationships</option>
                      <option value="Personal Growth">Personal Growth</option>
                      <option value="Reproductive Health">Reproductive Health</option>
                      <option value="Family Guidance">Family Guidance</option>
                    </select>
                    <span className="form-select-icon" aria-hidden="true">
                      ⌄
                    </span>
                  </div>
                </div>
              </div>

              <div className="form-group form-group-message">
                <label htmlFor="message" className="form-label">
                  Message <span className="form-label-required">*</span>
                </label>
                <textarea id="message" name="message" className="form-textarea" rows={6} required />
              </div>

              <button type="submit" className="contact-submit" disabled={status === "loading"}>
                <span>{status === "loading" ? "Sending..." : "Send Message"}</span>
                <Image src="/vectors/right_arrow.svg" alt="" width={10} height={10} className="contact-submit-icon" />
              </button>

              <div className="contact-status">
                {status === "success" ? (
                  <div className="contact-success">
                    <p>Message sent successfully. We&apos;ll get back to you soon.</p>
                  </div>
                ) : null}
                {status === "error" ? (
                  <div className="contact-error">
                    <p>{error ?? "Something went wrong. Please try again."}</p>
                  </div>
                ) : null}
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
