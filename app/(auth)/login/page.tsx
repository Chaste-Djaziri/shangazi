import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Login | Shangazi Emma Claudine",
  description: "Sign in to the SEC Portal to manage your profile and preferences.",
};

export default function LoginPage() {
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
            Ask Freely, <br />
            You&apos;re Safe Here
          </h2>
          <p className="auth-image-text">
            Join our community for honest conversations, practical guidance, and trusted support on life and relationships.
          </p>
        </div>
      </section>

      {/* Right side: Form */}
      <section className="auth-form-side">
        <div className="auth-card">
          <header className="auth-header">
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Log in to the SEC Portal</p>
          </header>

          <div className="auth-social-group">
            <button type="button" className="social-btn">
              <span className="social-btn-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.11c-.22-.66-.35-1.36-.35-2.11s.13-1.45.35-2.11V7.05H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.95l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.51 6.16-4.51z" fill="#EA4335"/>
                </svg>
              </span>
              <span>Continue with Google</span>
            </button>

            <button type="button" className="social-btn">
              <span className="social-btn-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.05 20.28c-.96.95-2.04 1.72-3.23 2.3-.32.16-.68-.04-.68-.41v-1.63c0-.62-.21-1.22-.6-1.72.39-.04.78-.1 1.16-.19 1.95-.44 3.41-2.18 3.41-4.22 0-2.39-1.95-4.34-4.34-4.34-.63 0-1.23.13-1.78.38-.56-.25-1.15-.38-1.78-.38-2.39 0-4.34 1.95-4.34 4.34 0 2.04 1.46 3.78 3.41 4.22.38.09.77.15 1.16.19-.39.5-.6 1.1-.6 1.72v1.63c0 .37-.36.57-.68.41-1.19-.58-2.27-1.35-3.23-2.3C2.88 18.25 1 15.35 1 12c0-6.07 4.93-11 11-11s11 4.93 11 11c0 3.35-1.88 6.25-4.95 8.28zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
                </svg>
              </span>
              <span>Continue with Apple</span>
            </button>
          </div>

          <div className="auth-divider">Or continue with email</div>

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
              Log In
            </button>
          </form>

          <footer className="auth-footer">
            <p>
              Don&apos;t have an account?{" "}
              <Link href="/newsletter" className="auth-footer-link">
                Join our newsletter
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
