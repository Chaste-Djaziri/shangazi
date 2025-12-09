import Hero from "./components/hero/Hero";
import Stats from "./components/stats/Stats";
import About from "./components/about/About";
import Topics from "./components/topics/Topics";
import Featured from "./components/featured/Featured";

export default function Home() {
  return (
    <main>
      <Hero />
      <Stats />
      <About />
      <Topics />
      <Featured />
    </main>
  );
}
