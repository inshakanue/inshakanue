import { Suspense, lazy } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";
import SEO from "@/components/SEO";
import { Separator } from "@/components/ui/separator";

// Lazy load components that may have module-level issues
const Skills = lazy(() => import("@/components/Skills"));
const Contact = lazy(() => import("@/components/Contact"));
const LatestBlogs = lazy(() => import("@/components/LatestBlogs").then(m => ({ default: m.LatestBlogs })));

const Index = () => {
  return (
    <>
      <SEO />
      
      <div className="min-h-screen">
        <Header />
        <main id="main-content">
          <Hero />
          <ErrorBoundary>
            <About />
          </ErrorBoundary>
          <Experience />
          <ErrorBoundary>
            <Suspense fallback={null}>
              <Skills />
            </Suspense>
          </ErrorBoundary>
          <ErrorBoundary>
            <Suspense fallback={null}>
              <Contact />
            </Suspense>
          </ErrorBoundary>
          <div className="container-custom py-8">
            <Separator className="bg-border/50" />
          </div>
          <ErrorBoundary>
            <Suspense fallback={null}>
              <LatestBlogs />
            </Suspense>
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
