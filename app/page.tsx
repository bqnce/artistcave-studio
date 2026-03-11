import About from "@/components/About";
import Booking from "@/components/Booking";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import Services from "@/components/Services";

export default function Home() {
  return (
    <>
      {/* 1. HERO SZEKCIÓ */}
      <Hero />

      {/* 2. ABOUT SZEKCIÓ */}
      <About />

      {/* SZOLGÁLTATÁSOK SZEKCIÓ*/}
      <Services />
      
      {/* Időpontfoglalás SZEKCIÓ */}
      <Booking />

      {/* KAPCSOLAT SZEKCIÓ */}
      <Contact />
    </>
  );
}