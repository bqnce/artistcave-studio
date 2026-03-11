"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion";
import aboutImage from "@/public/szalon.jpg";
import caveTexture from "@/public/cave-texture.jpg";
// Hugeicons importálása a 3 értékhez
import {
    Scissor01Icon,
    GlassesIcon,
    BrushIcon
} from "hugeicons-react";

// Animációs variánsok a szekciónak (felfelé úszás)
const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 1,
            ease: [0.22, 1, 0.36, 1], // Prémium, lassuló animáció
            staggerChildren: 0.2 // Az értékek egymás után úsznak be
        },
    },
};

// Az értékek listája ikonokkal
const values = [
    {
        title: "Kézműves Precizitás",
        description: "Minden vágás, minden vonal a barlang filozófiáját tükrözi: a legapróbb részletekre való odafigyelést.",
        icon: Scissor01Icon
    },
    {
        title: "Prémium Hangulat",
        description: "Egy dedikált menedék, ahol a kényelem, a minőségi italok és a nyugalom vár.",
        icon: GlassesIcon
    },
    {
        title: "Egyedi Stílus",
        description: "Nem hiszünk az sablonokban. Az arcodhoz és személyiségedhez szabott stílust alkotunk.",
        icon: BrushIcon
    }
];

export default function About() {
    return (
        <section
            id="rolunk"
            className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-zinc-950 py-24 px-6 md:px-12 lg:px-24"
        >

            {/* --- AZ ÚJ SZEMCSÉS TEXTÚRA INTEGRÁLÁSA (Háttér) --- */}
            {/* Ezt a public/cave-texture.png fájllal kell használni */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-10">
                <Image
                    src={caveTexture} // Győződj meg róla, hogy a kép a public mappában van ezen a néven
                    alt="Barlang Belső Textúra"
                    fill
                    className="object-cover opacity-80"
                />
                {/* Sötét gradient maszkok, hogy a textúra beleolvadjon az előtte/utána lévő szekcióba */}
                <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-zinc-950 to-transparent"></div>
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-zinc-950 to-transparent"></div>
            </div>


            {/* --- ASZIMMETRIKUS TARTALOM (Z-10) --- */}
            <motion.div
                className="relative z-10 w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible" // Csak akkor indul, ha a felhasználó oda görget
                viewport={{ once: true, amount: 0.3 }} // Csak egyszer fut le, 30%-os láthatóságnál
            >

                {/* Bal Oldal: Menő Fotó */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm group border border-zinc-900/50">
                    <Image
                        src={aboutImage} // Egy ideiglenes, sötét hangulatú Unsplash kép
                        alt="Artist Cave Studio Belső Tér"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Sötétoverlay, hogy illeszkedjen a barlanghoz, és lila glow */}
                    <div className="absolute inset-0 bg-zinc-950/40 transition-opacity group-hover:opacity-10"></div>
                    <div className="absolute -inset-10 bg-purple-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>


                {/* Jobb Oldal: Filozófia és Értékek */}
                <div className="flex flex-col justify-center h-full gap-12 lg:pl-8">

                    {/* Címsor és Leírás */}
                    <div>
                        <span className="text-zinc-500 uppercase tracking-[0.3em] font-light text-xs md:text-sm mb-4 inline-block">
                            A Filozófia
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase text-zinc-100 leading-[1.1] mb-6">
                            Ahol a stílus és a művészet találkozik.
                        </h2>
                        <p className="text-zinc-400 text-base md:text-lg font-light leading-relaxed">
                            Az Artist Cave Studio nem csupán egy fodrászat, hanem egy dedikált tér (a "Barlang"), ahol a hagyományos borbélymesterség modern művészetté emelkedik. Célunk, hogy ne csak egy frizurát, hanem egy élményt adjunk, ami tükrözi a belsődet.
                        </p>
                    </div>

                    {/* Értékek Lista - SZÍNES, ELEGÁNS DESIGN */}
                    <ul className="flex flex-col gap-8 mt-2">
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <motion.li
                                    key={index}
                                    variants={sectionVariants}
                                    className="group flex items-start gap-6"
                                >
                                    {/* Ikon: alapból lila és világít, hoverre még fényesebb */}
                                    <div className="flex-shrink-0 relative mt-1">
                                        {/* Háttérfény (glow): alapból is látszik, hoverre erősödik és nő */}
                                        <div className="absolute inset-0 bg-purple-500/30 blur-md rounded-full transition-all duration-300"></div>
                                        {/* Maga az ikon: lila, hoverre világosabb lesz és ragyog */}
                                        <Icon
                                            size={32}
                                            className="relative text-purple-400 transition-colors duration-300 group-hover:text-purple-300"
                                            strokeWidth={1.5}
                                        />
                                    </div>

                                    {/* Szöveges rész */}
                                    <div>
                                        <h4 className="text-lg md:text-xl font-semibold tracking-wide text-zinc-100 uppercase mb-2 group-hover:text-white transition-colors duration-300 group-hover:translate-x-1 transition-transform">
                                            {value.title}
                                        </h4>
                                        <p className="text-zinc-400 text-sm md:text-base font-light leading-relaxed">
                                            {value.description}
                                        </p>
                                    </div>
                                </motion.li>
                            );
                        })}
                    </ul>



                </div>

            </motion.div>

        </section>
    );
}