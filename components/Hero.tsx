import Image from "next/image";
import Link from "next/link";
import { Mouse01Icon } from "hugeicons-react";
import heroArch from "@/public/hero-arch.webp";

export default function Hero() {
  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-zinc-950 px-6 pt-24">

      {/* --- AZ ÍV (Atmospheric Light) INTEGRÁLÁSA --- */}
      <div
        className="absolute top-0 left-0 w-full h-[60%] z-0 pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
        }}
      >
        <Image
          src={heroArch} // Bizonyosodj meg róla, hogy webp kiterjesztésű!
          alt="Artist Cave Studio Hangulatfény"
          fill
          priority={true} // <-- NE HAGYD LE!
          quality={85} // <-- Kicsit lejjebb vesszük a minőséget a drasztikus méretcsökkenésért
          sizes="100vw"
          className="object-cover object-top opacity-80 blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/20 to-zinc-950"></div>
      </div>


      {/* --- HERO TARTALOM --- */}
      <div className="relative z-10 text-center max-w-5xl">

        {/* Fő Címsor */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter uppercase text-zinc-100 leading-[0.95] mb-8">
          Artist <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400">Cave</span> <br /> Studio
        </h1>

        {/* Leírás */}
        <p className="max-w-xl mx-auto text-zinc-400 text-lg md:text-xl font-light mb-12 leading-relaxed">
          Hagyományos borbélymesterség modern művészetté emelve. Egy dedikált menedék, ahol a stílusod új életre kel. Lépj be a barlangba.
        </p>

        {/* CTA Gomb (ugyanaz a stílus, mint a navbarban) */}
        <div>
          <Link
            href="#foglalas"
            className="inline-block bg-gradient-to-r from-purple-400 to-violet-400 text-white px-10 py-5 rounded-sm text-base font-bold uppercase tracking-wider hover:opacity-90 hover:scale-[1.03] transition-all duration-300 shadow-[0_0_25px_rgba(167,139,250,0.3)] active:scale-95"
          >
            Időpontfoglalás
          </Link>
        </div>
      </div>


      {/* --- GÖRGETÉS JELZŐ (Scroll Indicator) --- */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-zinc-600 flex flex-col items-center gap-2">
        <span className="text-xs uppercase tracking-widest font-light">Tudj meg többet!</span>
        <div className="animate-bounce">
          <Mouse01Icon size={24} strokeWidth={1} />
        </div>
      </div>

    </section>
  );
}