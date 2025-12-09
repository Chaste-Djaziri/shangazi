import Hero from "./components/hero/Hero";
import Stats from "./components/stats/Stats";
import About from "./components/about/About";
import Topics from "./components/topics/Topics";

export default function Home() {
  return (
    <main>
      <Hero />
      <Stats />
      <About />
      <Topics />
    </main>
  );
}
