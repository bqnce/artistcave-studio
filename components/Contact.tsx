"use client";

import { motion } from "framer-motion";
import { 
  InstagramIcon, 
  Facebook01Icon, 
  Location01Icon, 
  Mail01Icon, 
  SmartPhone01Icon 
} from "hugeicons-react";
import Link from "next/link";

export default function Contact() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="kapcsolat" className="bg-zinc-950 border-t border-zinc-900 pt-20 pb-10 px-6 overflow-hidden relative">
      {/* Háttér Glow - finom lila derengés */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent shadow-[0_0_20px_rgba(139,92,246,0.3)]" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* BRAND SZEKCIÓ */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="text-3xl font-black tracking-tighter text-white">
              ARTIST<span className="text-violet-500">CAVE</span>
            </Link>
            <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-xs">
              Több, mint egy szalon. Egy közösségi tér, ahol a stílus és a kreativitás találkozik. Emeld új szintre a megjelenésed.
            </p>
            <div className="flex gap-4">
              <SocialLink href="https://www.instagram.com/artistcave.studio/" icon={<InstagramIcon size={20} />} />
              <SocialLink href="https://www.facebook.com/p/Artist-Cave-Studio-61581355923522/" icon={<Facebook01Icon size={20} />} />
            </div>
          </div>

          {/* GYORS LINKEK */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-8">Navigáció</h4>
            <ul className="flex flex-col gap-4">
              <FooterLink href="/">Főoldal</FooterLink>
              <FooterLink href="/#szolgaltatasok">Szolgáltatások</FooterLink>
              <FooterLink href="/#rolunk">Rólunk</FooterLink>
              <FooterLink href="/#kapcsolat">Kapcsolat</FooterLink>
            </ul>
          </div>

          {/* JOGI LINKEK */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-8">Jogi Tudnivalók</h4>
            <ul className="flex flex-col gap-4">
              <FooterLink href="/aszf">Általános Szerződési Feltételek</FooterLink>
              <FooterLink href="/adatkezeles">Adatkezelési Tájékoztató</FooterLink>
              <FooterLink href="/impresszum">Impresszum</FooterLink>
            </ul>
          </div>

          {/* ELÉRHETŐSÉG */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-8">Kapcsolat</h4>
            <ul className="flex flex-col gap-5">
              <li className="flex items-start gap-3 text-zinc-400 group">
                <Location01Icon size={18} className="text-violet-500 shrink-0" />
                <span className="text-sm font-medium group-hover:text-zinc-200 transition-colors">
                Egyetem út 1. E/7 mélyföldszint (dohánybolt mellett), Miskolc, Hungary, 3515</span>
              </li>
              <li className="flex items-center gap-3 text-zinc-400 group">
                <Mail01Icon size={18} className="text-violet-500 shrink-0" />
                <span className="text-sm font-medium group-hover:text-zinc-200 transition-colors">hello@artistcave.hu</span>
              </li>
              <li className="flex items-center gap-3 text-zinc-400 group">
                <SmartPhone01Icon size={18} className="text-violet-500 shrink-0" />
                <span className="text-sm font-medium group-hover:text-zinc-200 transition-colors">+36 30 123 4567</span>
              </li>
            </ul>
          </div>

        </div>

        {/* ALSÓ SZEKCIÓ */}
        <div className="pt-8 border-t border-zinc-900/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
            © {currentYear} ARTIST CAVE STUDIO. Minden jog fenntartva.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">Design & Dev:</span>
            <a href="https://www.instagram.com/bqnce/" target="_blank" className="text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-violet-400 transition-colors cursor-default">@BQNCE</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Segédkomponensek a tisztább kódért
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link 
        href={href} 
        className="text-sm font-bold text-zinc-500 hover:text-violet-400 transition-all flex items-center gap-2 group"
      >
        <span className="w-0 h-px bg-violet-500 transition-all group-hover:w-3" />
        {children}
      </Link>
    </li>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-violet-500/50 transition-all hover:shadow-[0_0_15px_rgba(139,92,246,0.15)]"
    >
      {icon}
    </a>
  );
}