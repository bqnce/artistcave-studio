import Link from "next/link";
import { ArrowLeft01Icon } from "hugeicons-react";

export default function ImpresszumPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 py-24 px-6 relative selection:bg-violet-500/30">
      {/* Finom háttér glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[300px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 uppercase tracking-widest hover:text-violet-400 transition-colors mb-12"
        >
          <ArrowLeft01Icon size={18} /> Vissza a főoldalra
        </Link>

        <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-12">
          Impresszum
        </h1>

        <div className="space-y-12 text-sm md:text-base leading-relaxed">
          
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-zinc-800 pb-2">Szolgáltató (Üzemeltető) adatai</h2>
            <ul className="space-y-3 text-zinc-400">
              <li><strong className="text-zinc-200">Cégnév / Egyéni vállalkozó neve:</strong> [CÉGNÉV IDE]</li>
              <li><strong className="text-zinc-200">Székhely:</strong> [PONTOS CÍM IDE]</li>
              <li><strong className="text-zinc-200">Adószám:</strong> [ADÓSZÁM IDE]</li>
              <li><strong className="text-zinc-200">Nyilvántartási szám / Cégjegyzékszám:</strong> [NYILVÁNTARTÁSI SZÁM IDE]</li>
              <li><strong className="text-zinc-200">Nyilvántartást vezető bíróság/hatóság:</strong> [HATÓSÁG NEVE IDE, pl. Miskolci Törvényszék Cégbírósága]</li>
              <li><strong className="text-zinc-200">E-mail cím:</strong> hello@artistcave.hu</li>
              <li><strong className="text-zinc-200">Telefonszám:</strong> +36 30 123 4567</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-zinc-800 pb-2">Tárhelyszolgáltató adatai</h2>
            <p className="text-zinc-500 mb-4 text-xs uppercase tracking-widest font-bold">
              Kérjük, írd át a valós hosting szolgáltatódra (pl. Vercel, Netlify, Rackhost)!
            </p>
            <ul className="space-y-3 text-zinc-400">
              <li><strong className="text-zinc-200">Cégnév:</strong> Vercel Inc.</li>
              <li><strong className="text-zinc-200">Székhely:</strong> 440 N Barranca Ave #4133 Covina, CA 91723</li>
              <li><strong className="text-zinc-200">E-mail cím:</strong> privacy@vercel.com</li>
              <li><strong className="text-zinc-200">Weboldal:</strong> https://vercel.com</li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
}