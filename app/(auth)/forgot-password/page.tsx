"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/auth-client";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);
    try {
      const { error: sendError } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "forget-password",
      });
      if (sendError) throw sendError;
      setShowOtpInput(true);
      setMessage("Verification code sent to your email.");
    } catch (err: any) {
      setError(err.message || "Failed to send verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);
    try {
      const { error: resetError } = await authClient.emailOtp.resetPassword({
        email,
        otp,
        password,
      });
      if (resetError) throw resetError;
      
      setMessage("Password reset successfully! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setError(err.message || "Invalid code or failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

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
            <p className="auth-subtitle">
              {showOtpInput ? "Enter code and new password" : "Regain access to the SEC Portal"}
            </p>
          </header>

          {message && (
            <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-md text-sm">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          {!showOtpInput ? (
            <form className="auth-form" onSubmit={handleSendOtp}>
              <div className="form-group">
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
                {isLoading ? "Sending code..." : "Send Reset Code"}
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleResetPassword}>
              <div className="form-group">
                <label htmlFor="otp" className="form-label">Verification Code</label>
                <input 
                  type="text" 
                  id="otp" 
                  className="form-input text-center tracking-widest font-bold" 
                  placeholder="000000"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group mt-4">
                <label htmlFor="password" className="form-label">New Password</label>
                <input 
                  type="password" 
                  id="password" 
                  className="form-input" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required 
                />
              </div>

              <button 
                type="submit" 
                className="auth-submit-btn"
                disabled={isLoading || otp.length < 6}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>

              <div className="mt-4 text-center">
                <button 
                  type="button" 
                  onClick={handleSendOtp}
                  disabled={isLoading}
                  className="text-sm text-primary font-semibold hover:underline"
                >
                  Resend Code
                </button>
              </div>
            </form>
          )}

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
