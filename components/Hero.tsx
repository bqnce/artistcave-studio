"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Mouse01Icon } from "hugeicons-react";
import heroArch from "@/public/hero-arch.webp";

// Animációs variánsok a konténernek (staggered delay)
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Az elemek 0.2 másodperces eltolással indulnak
    },
  },
};

// Animációs variánsok az egyes elemeknek (felfelé úszás)
const itemVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1], // Prémium, lassuló animáció
    },
  },
};

export default function Hero() {
  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-zinc-950 px-6 pt-24">

      {/* --- AZ ÍV (Atmospheric Light) INTEGRÁLÁSA --- */}
      <motion.div
        initial={{ opacity: 1 }} // Szigorúan 1, nincs animált belépés a LCP elemre!
        animate={{ opacity: 1 }}
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
      </motion.div>


      {/* --- HERO TARTALOM --- */}
      <motion.div
        className="relative z-10 text-center max-w-5xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >

        {/* Fő Címsor */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter uppercase text-zinc-100 leading-[0.95] mb-8"
        >
          Artist <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400">Cave</span> <br /> Studio
        </motion.h1>

        {/* Leírás */}
        <motion.p
          variants={itemVariants}
          className="max-w-xl mx-auto text-zinc-400 text-lg md:text-xl font-light mb-12 leading-relaxed"
        >
          Hagyományos borbélymesterség modern művészetté emelve. Egy dedikált menedék, ahol a stílusod új életre kel. Lépj be a barlangba.
        </motion.p>

        {/* CTA Gomb (ugyanaz a stílus, mint a navbarban) */}
        <motion.div variants={itemVariants}>
          <Link
            href="#foglalas"
            className="inline-block bg-gradient-to-r from-purple-400 to-violet-400 text-white px-10 py-5 rounded-sm text-base font-bold uppercase tracking-wider hover:opacity-90 hover:scale-[1.03] transition-all duration-300 shadow-[0_0_25px_rgba(167,139,250,0.3)] active:scale-95"
          >
            Időpontfoglalás
          </Link>
        </motion.div>
      </motion.div>


      {/* --- GÖRGETÉS JELZŐ (Scroll Indicator) --- */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-zinc-600 flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <span className="text-xs uppercase tracking-widest font-light">Görgess le</span>
        <motion.div
          animate={{ y: [0, 8, 0] }} // Függőleges le-fel mozgás
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <Mouse01Icon size={24} strokeWidth={1} />
        </motion.div>
      </motion.div>

    </section>
  );
}