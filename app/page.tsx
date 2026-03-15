import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhyUs from "@/components/WhyUs";
import Services from "@/components/Services";
import Spread from "@/components/Spread";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <WhyUs />
      <Services />
      <Spread />
      <CTA />
      <Footer />
    </main>
  );
}
