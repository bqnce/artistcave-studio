import About from "@/components/About";
import Booking from "@/components/Booking";
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
      <section id="kapcsolat" className="h-screen bg-zinc-950 flex items-center justify-center border-t border-zinc-800">
        <h2 className="text-3xl text-zinc-500">Kapcsolat szekció jön ide</h2>
      </section>
    </>
  );
}