import Hero from "./components/hero/Hero";
import Stats from "./components/stats/Stats";
import About from "./components/about/About";
import Topics from "./components/topics/Topics";
import Featured from "./components/featured/Featured";
import Contact from "./components/contact/Contact";
import Footer from "./components/footer/Footer";
import ScrollToTop from "./components/scroll-to-top/ScrollToTop";

export default function Home() {
  return (
    <main>
      <Hero />
      <Stats />
      <About />
      <Topics />
      <Featured />
      <Contact />
      <Footer />
      <ScrollToTop />
    </main>
  );
}
