import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Skills from "@/components/Skills";
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <>
      <SEO />
      
      <div className="min-h-screen">
        <Header />
        <main id="main-content">
          <Hero />
          <About />
          <Experience />
          <Skills />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;