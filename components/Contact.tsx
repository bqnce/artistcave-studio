"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import {
    Location01Icon,
    Clock01Icon,
    SmartPhone01Icon,
    Mail01Icon,
    InstagramIcon,
    Facebook01Icon,
    LinkSquare01Icon,
    UserCircleIcon,
    Key01Icon,
    UserAdd01Icon
} from "hugeicons-react";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1, y: 0,
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
};

export default function Contact() {
    return (
        <section
            id="kapcsolat"
            className="relative min-h-screen w-full flex flex-col items-center justify-center bg-zinc-950 py-24 px-6 md:px-12 lg:px-24 border-t border-zinc-900"
        >
            <div className="relative z-10 w-full max-w-7xl mx-auto">

                {/* Fejléc */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.8 }}
                    className="mb-16 md:mb-24"
                >
                    <span className="text-zinc-500 uppercase tracking-[0.4em] font-light text-xs md:text-sm mb-4 inline-block">
                        Kapcsolat
                    </span>
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase text-zinc-100 leading-tight">
                        Várunk a <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400">Barlangban</span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                    {/* BAL OSZLOP: Információk */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        className="flex flex-col gap-12"
                    >

                        {/* Lokáció */}
                        <motion.div variants={itemVariants} className="flex items-start gap-6 group">
                            <div className="p-3 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-400 group-hover:text-purple-400 group-hover:border-purple-500/50 transition-colors">
                                <Location01Icon size={28} strokeWidth={1.5} />
                            </div>
                            <div className="flex flex-col gap-1 pt-1">
                                <h4 className="text-sm text-zinc-500 uppercase tracking-widest font-medium">Lokáció</h4>
                                <p className="text-lg text-zinc-200 font-light">3515 Miskolc, Egyetem út 1.</p>
                                <p className="text-sm text-purple-400 font-medium tracking-wide mt-1">E/7 épület, Alagsor</p>
                            </div>
                        </motion.div>

                        {/* Nyitvatartás */}
                        <motion.div variants={itemVariants} className="flex items-start gap-6 group">
                            <div className="p-3 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-400 group-hover:text-purple-400 group-hover:border-purple-500/50 transition-colors">
                                <Clock01Icon size={28} strokeWidth={1.5} />
                            </div>
                            <div className="flex flex-col gap-1 pt-1 w-full max-w-xs">
                                <h4 className="text-sm text-zinc-500 uppercase tracking-widest font-medium mb-2">Nyitvatartás</h4>
                                <div className="flex justify-between text-zinc-200 font-light border-b border-zinc-800/50 pb-2 mb-2">
                                    <span>Hétfő - Péntek</span>
                                    <span>10:00 - 19:00</span>
                                </div>
                                <div className="flex justify-between text-zinc-200 font-light border-b border-zinc-800/50 pb-2 mb-2">
                                    <span>Szombat</span>
                                    <span>10:00 - 14:00</span>
                                </div>
                                <div className="flex justify-between text-zinc-500 font-light">
                                    <span>Vasárnap</span>
                                    <span>Zárva</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Elérhetőségek */}
                        <motion.div variants={itemVariants} className="flex items-start gap-6 group">
                            <div className="p-3 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-400 group-hover:text-purple-400 group-hover:border-purple-500/50 transition-colors">
                                <SmartPhone01Icon size={28} strokeWidth={1.5} />
                            </div>
                            <div className="flex flex-col gap-2 pt-1">
                                <h4 className="text-sm text-zinc-500 uppercase tracking-widest font-medium">Elérhetőségek</h4>
                                <a href="tel:+36301234567" className="text-lg text-zinc-200 font-light hover:text-purple-400 transition-colors">
                                    +36 30 123 4567
                                </a>
                                <a href="mailto:hello@artistcave.hu" className="text-md text-zinc-400 font-light hover:text-purple-400 transition-colors flex items-center gap-2">
                                    <Mail01Icon size={16} /> hello@artistcave.hu
                                </a>
                            </div>
                        </motion.div>

                        {/* Gyorslinkek */}
                        <motion.div variants={itemVariants} className="flex items-start gap-6 group">
                            <div className="p-3 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-400 group-hover:text-purple-400 group-hover:border-purple-500/50 transition-colors">
                                <LinkSquare01Icon size={28} strokeWidth={1.5} />
                            </div>
                            <div className="flex flex-col gap-3 pt-1 w-full max-w-xs">
                                <h4 className="text-sm text-zinc-500 uppercase tracking-widest font-medium mb-1">Gyorslinkek</h4>
                                <Link href="/dashboard" className="flex items-center gap-3 text-zinc-300 font-light hover:text-purple-400 transition-colors border-b border-zinc-800/50 pb-2">
                                    <UserCircleIcon size={18} className="text-zinc-500" /> Vezérlőpult
                                </Link>
                                <Link href="/login" className="flex items-center gap-3 text-zinc-300 font-light hover:text-purple-400 transition-colors border-b border-zinc-800/50 pb-2">
                                    <Key01Icon size={18} className="text-zinc-500" /> Bejelentkezés
                                </Link>
                                <Link href="/register" className="flex items-center gap-3 text-zinc-300 font-light hover:text-purple-400 transition-colors">
                                    <UserAdd01Icon size={18} className="text-zinc-500" /> Regisztráció
                                </Link>
                            </div>
                        </motion.div>

                        {/* Social Media */}
                        <motion.div variants={itemVariants} className="flex gap-4 pt-4 border-t border-zinc-800/60 mt-2">
                            <a href="#" className="p-4 rounded-full border border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:text-white hover:bg-purple-600 hover:border-purple-500 transition-all duration-300">
                                <InstagramIcon size={24} />
                            </a>
                            <a href="#" className="p-4 rounded-full border border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:text-white hover:bg-blue-600 hover:border-blue-500 transition-all duration-300">
                                <Facebook01Icon size={24} />
                            </a>
                        </motion.div>

                    </motion.div>

                    {/* JOBB OSZLOP: Sötét Térkép */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full h-[500px] lg:h-[700px] rounded-2xl overflow-hidden border border-zinc-800 relative group shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-zinc-950/20 group-hover:pointer-events-none transition-colors z-10"></div>
                        <iframe
                            src="https://maps.google.com/maps?q=48.07976797750405,20.769014232355698&t=&z=18&ie=UTF8&iwloc=&output=embed"
                            width="100%"
                            height="100%"
                            style={{
                                border: 0,
                                filter: "invert(90%) hue-rotate(180deg) grayscale(40%) contrast(110%)"
                            }}
                            allowFullScreen={false}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="z-0"
                        ></iframe>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}