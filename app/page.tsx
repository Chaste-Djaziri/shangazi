import Hero from "./components/hero/Hero";
import Stats from "./components/stats/Stats";
import About from "./components/about/About";
import Topics from "./components/topics/Topics";
import Featured from "./components/featured/Featured";
import Contact from "./components/contact/Contact";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Discover Shangazi Emma Claudine's work in youth empowerment, reproductive health guidance, media, and honest conversations that feel personal and practical.",
  keywords: [
    "Emma Claudine",
    "Shangazi",
    "Shangazi Emma Claudine",
    "Rwandan journalist",
    "reproductive health guidance",
    "relationship advice Rwanda",
    "youth empowerment Rwanda",
  ],
  alternates: {
    canonical: "https://shangazi.rw",
  },
  openGraph: {
    title: "Shangazi Emma Claudine | Trusted Guidance That Feels Personal",
    description:
      "Explore Shangazi Emma Claudine's platform for honest conversations, practical guidance, and trusted support around life, relationships, and reproductive health.",
    url: "https://shangazi.rw",
    type: "website",
    images: [
      {
        url: "/profile/about.png",
        width: 1200,
        height: 630,
        alt: "Shangazi Emma Claudine homepage",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shangazi Emma Claudine | Trusted Guidance That Feels Personal",
    description:
      "Honest conversations, practical guidance, and trusted support from Shangazi Emma Claudine.",
    images: ["/profile/about.png"],
  },
};

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Stats />
      <Topics limit={3} showAllButton />
      <Featured />
      <Contact />
    </main>
  );
}
