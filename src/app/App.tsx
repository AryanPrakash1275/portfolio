import { Header } from "../components/layout/Header";
import { Hero } from "../components/sections/Hero";
import { Projects } from "../components/sections/Projects";
import { GameSection } from "../components/sections/GameSection";
import { Skills } from "../components/sections/Skills";
import { Contact } from "../components/sections/Contact";
import { Footer } from "../components/layout/Footer";

export default function App() {
  return (
    <>
      <div id="bg-parallax" aria-hidden="true" />
      <Header />
      <main>
        <Hero />
        <Projects />
        <section id="game">
          <GameSection />
        </section>
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
