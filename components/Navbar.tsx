"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Store01Icon, 
  Scissor01Icon, 
  Image02Icon, 
  Mail01Icon 
} from "hugeicons-react";

const navLinks = [
  { title: "Rólunk", href: "#rolunk", icon: Store01Icon },
  { title: "Szolgáltatások", href: "#szolgaltatasok", icon: Scissor01Icon },
  { title: "Munkáink", href: "#munkaink", icon: Image02Icon },
  { title: "Kapcsolat", href: "#kapcsolat", icon: Mail01Icon },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-zinc-950/90 backdrop-blur-md py-4 shadow-sm shadow-black/50" : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Bal oldal: Logo + Per jel + Menüpontok */}
          <div className="flex items-center gap-6 lg:gap-8">
            <Link href="/" className="relative z-50 whitespace-nowrap">
              <span className="text-zinc-100 font-bold tracking-widest uppercase text-lg lg:text-xl">
                Artist Cave <span className="text-zinc-500 font-light">Studio</span>
              </span>
            </Link>

            {/* Asztali menüpontok a / jellel */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <span className="text-zinc-700 text-2xl font-light hidden md:block">/</span>
              <ul className="flex gap-6 lg:gap-8 text-sm font-medium text-zinc-300 uppercase tracking-wide">
                {navLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="flex items-center gap-2 hover:text-white hover:translate-y-[-1px] transition-all duration-200"
                      >
                        <Icon size={18} className="text-zinc-500" />
                        {link.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Jobb oldal: CTA Gomb + Mobil Hamburger */}
          <div className="flex items-center gap-4">
            {/* Asztali CTA Gomb (Light Purple Gradient) */}
            <Link
              href="#foglalas"
              className="hidden md:block bg-gradient-to-r from-purple-400 to-violet-400 text-white px-6 py-2.5 rounded-sm text-sm font-bold uppercase tracking-wider hover:opacity-90 hover:scale-[1.02] transition-all duration-200 shadow-[0_0_15px_rgba(167,139,250,0.25)]"
            >
              Időpontfoglalás
            </Link>

            {/* Mobil Hamburger Ikon */}
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="relative z-50 w-10 h-10 md:hidden flex flex-col justify-center items-end gap-2 focus:outline-none"
              aria-label="Menü megnyitása"
            >
              <motion.span
                animate={isOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                className="block h-[2px] w-7 bg-zinc-100 origin-center transition-all"
              />
              <motion.span
                animate={isOpen ? { rotate: -45, y: -5, width: "1.75rem" } : { rotate: 0, y: 0, width: "1.25rem" }}
                className="block h-[2px] bg-zinc-100 origin-center transition-all"
              />
            </button>
          </div>

        </div>
      </nav>

      {/* Mobil Menü Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-zinc-950 flex flex-col items-center justify-center px-6"
          >
            <ul className="flex flex-col items-start gap-8 mb-12 w-full max-w-xs mx-auto">
              {navLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="w-full"
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-6 text-2xl font-light text-zinc-200 uppercase tracking-widest hover:text-purple-400 transition-colors w-full"
                    >
                      <Icon size={28} className="text-zinc-500" />
                      {link.title}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {/* Mobil CTA Gomb (Light Purple Gradient) */}
              <Link
                href="#foglalas"
                onClick={() => setIsOpen(false)}
                className="bg-gradient-to-r from-purple-400 to-violet-400 text-white px-8 py-4 rounded-sm text-lg font-bold uppercase tracking-wider active:scale-95 transition-transform shadow-[0_0_20px_rgba(167,139,250,0.3)] inline-block"
              >
                Időpontfoglalás
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}