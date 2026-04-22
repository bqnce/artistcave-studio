import Link from "next/link";
import { ArrowLeft01Icon } from "hugeicons-react";

export default function AdatkezelesPage() {
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
          Adatkezelési Tájékoztató
        </h1>
        <p className="text-zinc-500 font-medium mb-12 uppercase tracking-widest text-sm">
          Hatályos: 2026. április 22-től
        </p>

        <div className="space-y-12 text-sm md:text-base leading-relaxed">
          
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-zinc-800 pb-2">1. Az Adatkezelő adatai</h2>
            <ul className="space-y-2 text-zinc-400">
              <li><strong className="text-zinc-200">Adatkezelő neve:</strong> [CÉGNÉV / VÁLLALKOZÓ NEVE]</li>
              <li><strong className="text-zinc-200">Székhely:</strong> [PONTOS CÍM IDE]</li>
              <li><strong className="text-zinc-200">Adószám:</strong> [ADÓSZÁM IDE]</li>
              <li><strong className="text-zinc-200">E-mail:</strong> hello@artistcave.hu</li>
              <li><strong className="text-zinc-200">Telefon:</strong> +36 30 123 4567</li>
            </ul>
            <p className="text-zinc-500 mt-4 text-xs">
              Az Adatkezelő magára nézve kötelezőnek ismeri el a jelen jogi közlemény tartalmát, és kötelezettséget vállal arra, hogy szolgáltatásával kapcsolatos adatkezelése megfelel a hatályos jogszabályokban (különösen a GDPR-ban) meghatározott elvárásoknak.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-zinc-800 pb-2">2. A kezelt adatok köre, célja és jogalapja</h2>
            <p className="text-zinc-400 mb-4">
              A weboldalon történő időpontfoglalás és a szolgáltatás teljesítése érdekében az alábbi személyes adatokat kezeljük:
            </p>
            <ul className="list-disc pl-5 space-y-3 text-zinc-400">
              <li><strong className="text-zinc-200">Név:</strong> Szükséges a vendég azonosításához és a megszólításhoz.</li>
              <li><strong className="text-zinc-200">Telefonszám:</strong> Szükséges a gyors kapcsolattartáshoz esetleges csúszás, lemondás vagy egyeztetés esetén.</li>
              <li><strong className="text-zinc-200">E-mail cím:</strong> Szükséges a foglalás automatikus visszaigazolásához és a rendszerüzenetek küldéséhez.</li>
            </ul>
            <p className="text-zinc-400 mt-4">
              <strong className="text-zinc-200">Az adatkezelés jogalapja:</strong> A szerződés teljesítése (GDPR 6. cikk (1) bek. b) pont), illetve az érintett kifejezett hozzájárulása.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-zinc-800 pb-2">3. Adatfeldolgozók és Adattovábbítás</h2>
            <p className="text-zinc-400 mb-4">
              A zökkenőmentes működés érdekében külső technológiai partnereket (adatfeldolgozókat) veszünk igénybe. Az adataidat harmadik félnek marketing célból SOHA nem adjuk el.
            </p>
            <ul className="list-disc pl-5 space-y-3 text-zinc-400">
              <li><strong className="text-zinc-200">Tárhelyszolgáltató és Adatbázis:</strong> Vercel Inc. / Supabase (Szerverek és adatbázis hosztolása).</li>
              <li><strong className="text-zinc-200">E-mail rendszer:</strong> Resend (Tranzakciós és visszaigazoló e-mailek kiküldése).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-zinc-800 pb-2">4. Az adatok megőrzési ideje</h2>
            <p className="text-zinc-400 mb-4">
              A foglalás során megadott adatokat a szolgáltatás teljesítését követően a számviteli törvényeknek megfelelően (számlázási adatok esetén 8 évig), egyéb esetben a hozzájárulás visszavonásáig vagy a felhasználói fiók törléséig tároljuk. A lemondott vagy meg nem valósult foglalásokhoz tartozó adatokat 1 éven belül töröljük a rendszerből.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-zinc-800 pb-2">5. Az Érintett (Vendég) jogai</h2>
            <p className="text-zinc-400 mb-4">
              Bármikor jogosult vagy tájékoztatást kérni a személyes adataid kezeléséről, kérheted azok helyesbítését, törlését (elfeledtetéshez való jog), vagy zárolását. Kérésedet a hello@artistcave.hu e-mail címre küldött levélben teheted meg. A kérelmet legfeljebb 30 napon belül teljesítjük. Amennyiben úgy érzed, hogy az adatkezelés megsértette a jogaidat, panasszal élhetsz a Nemzeti Adatvédelmi és Információszabadság Hatóságnál (NAIH).
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}