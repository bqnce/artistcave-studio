import Link from "next/link";
import { ArrowLeft01Icon } from "hugeicons-react";

export default function ASZFPage() {
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

        <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
          Általános Szerződési Feltételek
        </h1>
        <p className="text-zinc-500 font-medium mb-12 uppercase tracking-widest text-sm">
          Utolsó frissítés: 2026. április 22.
        </p>

        <div className="space-y-12 text-sm md:text-base leading-relaxed">
          
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-zinc-800 pb-2">1. Szolgáltató adatai</h2>
            <ul className="space-y-2 text-zinc-400">
              <li><strong className="text-zinc-200">Cégnév / Vállalkozó neve:</strong> [CÉGNÉV IDE]</li>
              <li><strong className="text-zinc-200">Székhely:</strong> 3530 Miskolc, [PONTOS CÍM IDE]</li>
              <li><strong className="text-zinc-200">Adószám:</strong> [ADÓSZÁM IDE]</li>
              <li><strong className="text-zinc-200">Nyilvántartási szám:</strong> [NYILVÁNTARTÁSI SZÁM IDE]</li>
              <li><strong className="text-zinc-200">E-mail cím:</strong> hello@artistcave.hu</li>
              <li><strong className="text-zinc-200">Telefonszám:</strong> +36 30 123 4567</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-zinc-800 pb-2">2. Általános rendelkezések</h2>
            <p className="text-zinc-400 mb-4">
              A jelen Általános Szerződési Feltételek (a továbbiakban: ÁSZF) tartalmazzák a Szolgáltató által üzemeltetett Artist Cave szalon (a továbbiakban: Szalon) szolgáltatásainak igénybevételére vonatkozó feltételeket. A foglalás leadásával a Vendég kijelenti, hogy a jelen ÁSZF-et megismerte, megértette és magára nézve kötelezőnek ismeri el.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-zinc-800 pb-2">3. Foglalás menete</h2>
            <p className="text-zinc-400 mb-4">
              Időpontot foglalni a weboldalon keresztül, online formában lehetséges. A foglalás akkor tekinthető véglegesnek, amikor a Szolgáltató a megadott e-mail címre elküldi a visszaigazolást. A Szolgáltató fenntartja a jogot, hogy indokolt esetben (pl. technikai hiba, betegség) a foglalást törölje vagy módosítsa, melyről a Vendéget haladéktalanul értesíti.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-red-400 mb-4 border-b border-zinc-800 pb-2">4. Lemondási és Késési Feltételek (Kérjük, olvasd el figyelmesen!)</h2>
            <p className="text-zinc-400 mb-4">
              Az időd értékes, ahogy a miénk is. Ennek tiszteletben tartása érdekében az alábbi szabályok érvényesek:
            </p>
            <ul className="list-disc pl-5 space-y-3 text-zinc-400">
              <li><strong className="text-zinc-200">Díjmentes lemondás:</strong> Az időpontot legkésőbb a lefoglalt időpont előtt <strong>24 órával</strong> lehet díjmentesen lemondani vagy módosítani.</li>
              <li><strong className="text-zinc-200">Késői lemondás / No-show:</strong> Amennyiben a Vendég 24 órán belül mondja le az időpontot, vagy értesítés nélkül nem jelenik meg, a Szolgáltató fenntartja a jogot, hogy a szolgáltatás árának <strong>50%-át, illetve 100%-át</strong> kiszámlázza, vagy a Vendéget a további online foglalásból kizárja a tartozás rendezéséig.</li>
              <li><strong className="text-zinc-200">Késés:</strong> Maximum 10 perc késést tudunk tolerálni. Ezt meghaladó késés esetén a Szolgáltató megtagadhatja a szolgáltatás elvégzését a következő vendég idejének tiszteletben tartása végett, ami szintén "No-show"-nak minősül.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-zinc-800 pb-2">5. Fizetési feltételek</h2>
            <p className="text-zinc-400 mb-4">
              A szolgáltatások ellenértékének kiegyenlítése a helyszínen, a szolgáltatás igénybevétele után történik. A weboldalon feltüntetett árak bruttó árak és magyar forintban (HUF) értendők. A Szolgáltató fenntartja a jogot az árváltoztatásra, amely azonban nem érinti a már sikeresen visszaigazolt foglalásokat.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-zinc-800 pb-2">6. Felelősség</h2>
            <p className="text-zinc-400 mb-4">
              A Szolgáltató mindent megtesz a szolgáltatások legmagasabb szakmai színvonalon történő elvégzéséért. A Vendég köteles a szolgáltatás megkezdése előtt tájékoztatni a szakembert minden olyan egészségügyi tényezőről (pl. allergia, bőrbetegség), amely befolyásolhatja a szolgáltatást. Ezek elhallgatásából fakadó károkért a Szolgáltató nem vállal felelősséget.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}