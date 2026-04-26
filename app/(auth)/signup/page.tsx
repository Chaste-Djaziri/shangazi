import type { Metadata } from "next";
import Image from "next/image";
import SignupForm from "./SignupForm";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Sign Up | Shangazi Emma Claudine",
  description: "Create an account for the SEC Portal to access exclusive content and personalized features.",
};

export default function SignupPage() {
  return (
    <main className="auth-layout flex-row-reverse">
      {/* Form Side (now on left because of flex-row-reverse) */}
      <section className="auth-form-side">
        <Suspense fallback={<div className="animate-pulse bg-gray-50 h-[400px] w-full rounded-2xl" />}>
          <SignupForm />
        </Suspense>
      </section>

      {/* Image Side (now on right because of flex-row-reverse) */}
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
            Begin Your Journey <br />
            With Us
          </h2>
          <p className="auth-image-text">
            Join a community dedicated to growth, honest conversations, and supportive guidance.
          </p>
        </div>
      </section>
    </main>
  );
}
