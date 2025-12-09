"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";

const aboutImages = [
  "/profile/emma-claudine-1.jpeg",
  "/profile/emma-claudine-2.jpeg",
  "/profile/emma-claudine-4.jpeg",
  "/profile/emma-claudine-1.jpeg",
  "/profile/emma-claudine-2.jpeg",
  "/profile/emma-claudine-4.jpeg",
  "/profile/emma-claudine-1.jpeg",
  "/profile/emma-claudine-2.jpeg",
];

export default function About() {
  const aboutRef = useRef<HTMLElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const tl = gsap.timeline();
            
            // Animate images with stagger
            if (imagesRef.current) {
              const images = imagesRef.current.querySelectorAll(".about-image-item");
              tl.fromTo(
                images,
                { opacity: 0, scale: 0.8, rotation: -5 },
                { 
                  opacity: 1, 
                  scale: 1, 
                  rotation: 0, 
                  duration: 0.6, 
                  stagger: 0.1, 
                  ease: "power3.out" 
                }
              );
            }

            // Animate content
            if (contentRef.current) {
              const title = contentRef.current.querySelector(".about-title");
              const paragraphs = contentRef.current.querySelectorAll(".about-text");
              const button = contentRef.current.querySelector(".about-button");

              tl.fromTo(
                title,
                { opacity: 0, x: 30 },
                { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
                "-=0.3"
              )
              .fromTo(
                paragraphs,
                { opacity: 0, x: 20 },
                { opacity: 1, x: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" },
                "-=0.4"
              )
              .fromTo(
                button,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
                "-=0.4"
              );

              observer.disconnect();
            }
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    if (aboutRef.current) {
      observer.observe(aboutRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section className="about" ref={aboutRef}>
      <div className="about-container">
        <div className="about-grid">
          <div className="about-images" ref={imagesRef}>
            {aboutImages.map((src, index) => (
              <div key={index} className="about-image-item">
                <Image
                  src={src}
                  alt={`Emma Claudine ${index + 1}`}
                  width={200}
                  height={200}
                  className="about-image"
                />
              </div>
            ))}
          </div>
          <div className="about-content" ref={contentRef}>
            <h2 className="about-title">
              About <span className="about-title-accent">Shangazi</span>
            </h2>
            <div className="about-description">
              <h3 className="about-subtitle">Prominent Rwandan Journalist & Content Creator</h3>
              <p className="about-text">
                Emma Claudine, known as "Shangazi Emma-Claudine," is a prominent Rwandan journalist and content creator whose YouTube channel focuses on reproductive health, relationships, family planning, and youth counseling. Her channel has garnered over 410,000 subscribers and more than 30 million views as of April 2025.
              </p>
              
              <h3 className="about-subtitle">Breaking Taboos Through Education</h3>
              <p className="about-text">
                In 2005, Emma launched the radio program "Imenye Nawe" on Radio Salus, focusing on reproductive health and sexuality. Her empathetic approach earned her the affectionate title "Shangazi" (Auntie) among young listeners. She later became the Managing Editor of Ni Nyampinga, a magazine by Girl Effect Rwanda.
              </p>
              
              <h3 className="about-subtitle">Impact and Recognition</h3>
              <p className="about-text">
                Emma Claudine's work has been crucial in breaking taboos and providing accurate information to Rwandan youth. Her efforts have been recognized internationally, highlighting her role in empowering young people through education and open dialogue.
              </p>
            </div>
            <Link href="/about" className="about-button">
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
