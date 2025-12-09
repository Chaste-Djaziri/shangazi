"use client";

import { useState, useEffect, useRef } from "react";

interface StatData {
  value: number;
  suffix: string;
  label: string;
}

const statsData: StatData[] = [
  { value: 410, suffix: "K+", label: "YouTube Subscribers" },
  { value: 30, suffix: "M+", label: "Video Views" },
  { value: 20, suffix: "+", label: "Years Experience" },
  { value: 1000, suffix: "s", label: "Lives Impacted" },
];

function formatNumber(value: number, suffix: string): string {
  if (suffix === "K+") {
    return `${Math.floor(value)}K+`;
  } else if (suffix === "M+") {
    return `${Math.floor(value)}M+`;
  } else if (suffix === "+") {
    return `${Math.floor(value)}+`;
  } else if (suffix === "s") {
    return `${Math.floor(value)}s`;
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

function StatItem({ stat, isVisible }: { stat: StatData; isVisible: boolean }) {
  const count = useCounterAnimation(stat.value, 2000, isVisible);

  return (
    <div className="stat-item">
      <div className="stat-number">
        {formatNumber(count, stat.suffix)}
      </div>
      <div className="stat-label">{stat.label}</div>
    </div>
  );
}

export default function Stats() {
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Once visible, we can disconnect the observer
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the section is visible
      }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section className="stats" ref={statsRef}>
      <div className="stats-container">
        {statsData.map((stat, index) => (
          <StatItem key={index} stat={stat} isVisible={isVisible} />
        ))}
      </div>
    </section>
  );
}
