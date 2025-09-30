import { lazy, Suspense } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";

const Skills = lazy(() => import("@/components/Skills"));

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <About />
        <Experience />
        <ErrorBoundary>
          <Suspense fallback={<section id="skills" className="section-padding"><div className="container-custom"><div className="text-center text-muted-foreground">Loading skills…</div></div></section>}>
            <Skills />
          </Suspense>
        </ErrorBoundary>
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
