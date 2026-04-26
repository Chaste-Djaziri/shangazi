import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Forgot Password | SEC Portal",
  description: "Reset your SEC Portal password to regain access to your account.",
};

export default function ForgotPasswordPage() {
  return (
    <main className="auth-layout">
      {/* Left side: Image */}
      <section className="auth-image-side">
        <Image
          src="/backgrounds/stories_1.png"
          alt="Shangazi Emma Claudine"
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div className="auth-image-overlay" />
        <div className="auth-image-content">
          <h2 className="auth-image-title">
            Secure Your <br />
            Account
          </h2>
          <p className="auth-image-text">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>
      </section>

      {/* Right side: Form */}
      <section className="auth-form-side">
        <div className="auth-card">
          <header className="auth-header">
            <h1 className="auth-title">Reset Password</h1>
            <p className="auth-subtitle">Regain access to the SEC Portal</p>
          </header>

          <form className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input 
                type="email" 
                id="email" 
                className="form-input" 
                placeholder="name@example.com"
                required 
              />
            </div>

            <button type="submit" className="auth-submit-btn">
              Send Reset Link
            </button>
          </form>

          <footer className="auth-footer">
            <p>
              Remember your password?{" "}
              <Link href="/login" className="auth-footer-link">
                Back to login
              </Link>
            </p>
            <div className="mt-4">
              <Link href="/" className="text-sm hover:underline text-gray-500">
                Back to home
              </Link>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}
