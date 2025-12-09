import Hero from "./components/hero/Hero";
import Stats from "./components/stats/Stats";
import About from "./components/about/About";

export default function Home() {
  return (
    <main>
      <Hero />
      <Stats />
      <About />
    </main>
  );
}
