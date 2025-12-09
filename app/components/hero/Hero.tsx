"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface SocialStat {
  value: number;
  suffix: string;
  label: string;
  href: string;
  icon: string;
  alt: string;
  className: string;
}

const socialStats: SocialStat[] = [
  {
    value: 482,
    suffix: "K",
    label: "Subscribers",
    href: "https://www.youtube.com/@emmaclaudine/videos",
    icon: "/socials/youtube.png",
    alt: "YouTube",
    className: "youtube-subscribers social-link",
  },
  {
    value: 244,
    suffix: "K",
    label: "Followers",
    href: "https://www.facebook.com/emmaclaudine1",
    icon: "/socials/facebook.png",
    alt: "Facebook",
    className: "facebook-followers social-link",
  },
  {
    value: 152.3,
    suffix: "K",
    label: "Followers",
    href: "https://www.tiktok.com/@emmaclaudine1",
    icon: "/socials/tiktok.png",
    alt: "TikTok",
    className: "tiktok-followers social-link",
  },
  {
    value: 59.9,
    suffix: "K",
    label: "Followers",
    href: "https://www.instagram.com/emmaclaudine1/",
    icon: "/socials/instagram.png",
    alt: "Instagram",
    className: "instagram-followers social-link",
  },
];

function formatSocialNumber(value: number, suffix: string): string {
  // Format with one decimal place if needed
  if (value % 1 !== 0) {
    return `${value.toFixed(1)}${suffix}`;
  }
  return `${Math.floor(value)}${suffix}`;
}

function useCounterAnimation(
  targetValue: number,
  duration: number = 2000,
  isVisible: boolean
) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = targetValue * easeOutQuart;

      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(targetValue);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [targetValue, duration, isVisible]);

  return count;
}

function SocialLink({ stat, isVisible }: { stat: SocialStat; isVisible: boolean }) {
  const count = useCounterAnimation(stat.value, 2000, isVisible);

  // Map alt text to icon class names
  const iconClassMap: Record<string, string> = {
    YouTube: "youtube-icon",
    Facebook: "facebook-icon",
    TikTok: "tiktok-icon",
    Instagram: "instagram-icon",
  };

  return (
    <a
      href={stat.href}
      target="_blank"
      rel="noopener noreferrer"
      className={stat.className}
    >
      <Image
        src={stat.icon}
        alt={stat.alt}
        width={40}
        height={40}
        className={iconClassMap[stat.alt] || "icon"}
      />
      <div className={stat.label === "Subscribers" ? "subscribers-info" : "followers-info"}>
        <span className={stat.label === "Subscribers" ? "subscribers-count" : "followers-count"}>
          {formatSocialNumber(count, stat.suffix)}
        </span>
        <span className={stat.label === "Subscribers" ? "subscribers-label" : "followers-label"}>
          {stat.label}
        </span>
      </div>
    </a>
  );
}

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.2, // Trigger when 20% of the hero is visible
      }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero-container">
        <div className="hero-left">
          <h1 className="hero-name">
            <span className="hero-name-pink">Shangazi</span>
            <span className="hero-name-green">Emma Claudine</span>
          </h1>
          <p className="hero-description">
            Your trusted auntie providing guidance on reproductive health, relationships, and personal development.
          </p>
          <div className="hero-actions">
            <a href="/ask-question" className="btn-primary hero-btn">
              Ask a Question
            </a>
            <a href="/topics" className="btn-secondary hero-btn">
              Explore Topics
            </a>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-image-wrapper">
            <Image
              src="/shangazi.png"
              alt="Shangazi"
              width={800}
              height={600}
              priority
              className="hero-image"
            />
            {socialStats.map((stat, index) => (
              <SocialLink key={index} stat={stat} isVisible={isVisible} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
