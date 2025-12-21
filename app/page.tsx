import Hero from "./components/hero/Hero";
import SeoHighlights from "./components/seo/SeoHighlights";
import Stats from "./components/stats/Stats";
import About from "./components/about/About";
import Topics from "./components/topics/Topics";
import Featured from "./components/featured/Featured";
import Contact from "./components/contact/Contact";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shangazi Emma Claudine | Emma Claudine",
  description:
    "Shangazi Emma Claudine is a Rwandan journalist and content creator known for youth empowerment, relationships, and reproductive health education.",
  keywords: ["Emma Claudine", "Shangazi", "Shangazi Emma Claudine"],
};

export default function Home() {
  return (
    <main>
      <Hero />
      <SeoHighlights />
      <Stats />
      <About />
      <Topics />
      <Featured />
      <Contact />
    </main>
  );
}
