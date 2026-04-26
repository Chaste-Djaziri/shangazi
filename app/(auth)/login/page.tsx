import type { Metadata } from "next";
import Image from "next/image";
import LoginForm from "./LoginForm";
import { Suspense } from "react";

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
        <Suspense fallback={<div className="animate-pulse bg-gray-50 h-[400px] w-full rounded-2xl" />}>
          <LoginForm />
        </Suspense>
      </section>
    </main>
  );
}
