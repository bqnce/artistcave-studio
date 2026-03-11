import Hero from "@/components/Hero";

export default function Home() {
  return (
    <>
      {/* 1. HERO SZEKCIÓ */}
      <Hero />

      {/* SZOLGÁLTATÁSOK SZEKCIÓ (Helykitöltő a görgetés teszteléséhez) */}
      <section id="szolgaltatasok" className="h-screen bg-zinc-950 flex items-center justify-center border-t border-zinc-800">
        <h2 className="text-3xl text-zinc-500">Szolgáltatások szekció jön ide</h2>
      </section>
      
      {/* MUNKÁINK SZEKCIÓ */}
      <section id="munkaink" className="h-screen bg-zinc-900 flex items-center justify-center border-t border-zinc-800">
        <h2 className="text-3xl text-zinc-500">Munkáink szekció jön ide</h2>
      </section>

      {/* KAPCSOLAT SZEKCIÓ */}
      <section id="kapcsolat" className="h-screen bg-zinc-950 flex items-center justify-center border-t border-zinc-800">
        <h2 className="text-3xl text-zinc-500">Kapcsolat szekció jön ide</h2>
      </section>
    </>
  );
}