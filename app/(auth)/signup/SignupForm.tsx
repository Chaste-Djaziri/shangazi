"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/auth-client";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await authClient.signUp.email({
        email,
        password: "password", // Neon Auth email-only usually implies OTP or a placeholder
        name,
        callbackURL: "/discover",
      });
    } catch (err: any) {
      setError(err.message || "Failed to sign up");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google") => {
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/discover",
        // Note: For signup we WANT it to create the account if it doesn't exist
      });
    } catch (err: any) {
      setError(err.message || `Failed to sign up with ${provider}`);
    }
  };

  return (
    <div className="auth-card">
      <header className="auth-header">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join the SEC Portal</p>
      </header>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="auth-social-group">
        <button 
          type="button" 
          className="social-btn"
          onClick={() => handleSocialLogin("google")}
        >
          <span className="social-btn-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.11c-.22-.66-.35-1.36-.35-2.11s.13-1.45.35-2.11V7.05H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.95l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.51 6.16-4.51z" fill="#EA4335"/>
            </svg>
          </span>
          <span>Sign up with Google</span>
        </button>
      </div>

      <div className="auth-divider">Or sign up with email</div>

      <form className="auth-form" onSubmit={handleEmailSignup}>
        <div className="form-group">
          <label htmlFor="name" className="form-label">Full Name</label>
          <input 
            type="text" 
            id="name" 
            className="form-input" 
            placeholder="Emma Claudine"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required 
          />
        </div>
        <div className="form-group mt-4">
          <label htmlFor="email" className="form-label">Email Address</label>
          <input 
            type="email" 
            id="email" 
            className="form-input" 
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>

        <button 
          type="submit" 
          className="auth-submit-btn"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <footer className="auth-footer">
        <p>
          Already have an account?{" "}
          <Link href="/login" className="auth-footer-link">
            Log in
          </Link>
        </p>
        <div className="mt-4">
          <Link href="/" className="text-sm hover:underline text-gray-500">
            Back to home
          </Link>
        </div>
      </footer>
    </div>
  );
}
