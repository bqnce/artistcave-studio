"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu01Icon, Cancel01Icon, UserCircleIcon } from "hugeicons-react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Főoldal", href: "/" },
    { name: "Szolgáltatások", href: "/#szolgaltatasok" },
    { name: "Rólunk", href: "/#rolunk" },
    { name: "Kapcsolat", href: "/#kapcsolat" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled ? "bg-zinc-950/80 backdrop-blur-md py-4 border-b border-zinc-900" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-black tracking-tighter text-white">
          ARTIST<span className="text-violet-500">CAVE</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
            >
              {link.name}
            </Link>
          ))}
          
          <div className="h-6 w-px bg-zinc-800 mx-2" />

          <Link
            href="/login"
            className="text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
          >
            Belépés
          </Link>
          <Link
            href="/register"
            className="bg-violet-600 text-white px-6 py-2.5 rounded-full text-sm font-black uppercase tracking-widest hover:bg-violet-500 transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)]"
          >
            Regisztráció
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(true)}>
          <Menu01Icon size={28} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 bg-zinc-950 z-[60] flex flex-col p-8"
          >
            <div className="flex justify-end mb-12">
              <button onClick={() => setIsOpen(false)} className="text-zinc-500">
                <Cancel01Icon size={32} />
              </button>
            </div>
            <div className="flex flex-col gap-8 items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-3xl font-black uppercase tracking-tighter text-white"
                >
                  {link.name}
                </Link>
              ))}
              <div className="w-12 h-1 bg-zinc-900 my-4" />
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="text-xl font-bold uppercase tracking-widest text-zinc-400"
              >
                Belépés
              </Link>
              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="w-full text-center bg-violet-600 text-white py-4 rounded-2xl text-xl font-black uppercase tracking-widest"
              >
                Regisztráció
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}