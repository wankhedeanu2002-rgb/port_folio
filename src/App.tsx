import { SoundProvider } from "@/context/SoundContext";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { TechStack } from "@/components/sections/TechStack";
import { Approach } from "@/components/sections/Approach";
import { Principles } from "@/components/sections/Principles";
import { Terminal } from "@/components/sections/Terminal";
import { ResumeSection } from "@/components/sections/ResumeSection";
import { Contact } from "@/components/sections/Contact";
import { PortfolioChatbot } from "@/components/chatbot/PortfolioChatbot";
import { GlobalPointerSpotlight } from "@/components/ui/GlobalPointerSpotlight";

export default function App() {
  return (
    <SoundProvider>
      <GlobalPointerSpotlight />
      <div className="noise-overlay" aria-hidden="true" />
      <ScrollProgress />
      <Navbar />
      <main className="pb-[calc(4.5rem+env(safe-area-inset-bottom))] sm:pb-[calc(5rem+env(safe-area-inset-bottom))]">
        <Hero />
        <SectionDivider label="01 — About" />
        <About />
        <SectionDivider label="02 — Experience" />
        <Experience />
        <SectionDivider label="03 — Projects" />
        <Projects />
        <SectionDivider label="04 — Stack" />
        <TechStack />
        <Approach />
        <Principles />
        <Terminal />
        <ResumeSection />
        <Contact />
      </main>
      <Footer />
      <PortfolioChatbot />
    </SoundProvider>
  );
}
