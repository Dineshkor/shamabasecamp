import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Rhythms from "@/components/Rhythms";
import ParallaxBanner from "@/components/ParallaxBanner";
import Experience from "@/components/Experience";
import Gallery from "@/components/Gallery";
import GettingThere from "@/components/GettingThere";
import BookingForm from "@/components/BookingForm";
import Footer from "@/components/Footer";
import ScrollVectorBackground from "@/components/ScrollVectorBackground";
import AmbientParticles from "@/components/AmbientParticles";
import ZenMode from "@/components/ZenMode";
import VideoShowcase from "@/components/VideoShowcase";

export default function Home() {
  return (
    <>
      <ScrollVectorBackground />
      <AmbientParticles />
      <Navbar />
      <main>
        <Hero />

        <About />

        <Rhythms />

        <ParallaxBanner
          image="/images/sixthcampimage.jpg"
          alt="Saryu valley panorama from Shama Village"
          title="Where Rivers Begin"
          subtitle="Perched above the Saryu valley, every sunrise is a private showing"
        />

        <Experience />

        <VideoShowcase />

        <Gallery />

        <GettingThere />

        <ParallaxBanner
          image="/images/fourteenimage.jpg"
          alt="Golden hour on snow peaks"
        />

        <BookingForm />
      </main>
      <ZenMode />
      <Footer />
    </>
  );
}
