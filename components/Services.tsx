import Image from "next/image";
import servicesGlow from "@/public/services-glow.webp";

const servicesData = [
  {
    category: "Haj",
    items: [
      { name: "Hajvágás", description: "Mosás, vágás, formázás és styling", duration: "45 perc", price: "5 000 Ft" },
      { name: "Gyermek hajvágás", description: "Vágás és formázás 12 éves korig", duration: "40 perc", price: "4 000 Ft" },
    ]
  },
  {
    category: "Szakáll & Komplex",
    items: [
      { name: "Szakáll igazítás", description: "Szakállvágás, kontúrozás, ápolás", duration: "20 perc", price: "3 500 Ft" },
      { name: "Barber treatment", description: "Teljes hajvágás és prémium szakáll igazítás", duration: "1 óra", price: "8 000 Ft" },
    ]
  }
];

export default function Services() {
  return (
    <section 
      id="szolgaltatasok" 
      // py-32-ről py-16-ra csökkentve az alsó-felső padding
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-zinc-950 py-16 px-6 md:px-12 lg:px-24"
    >
      
      {/* --- HÁTTÉRFÉNY --- */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 mix-blend-screen">
        <Image
          src={servicesGlow} 
          alt="Szolgáltatások Hangulatfény"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-zinc-950 to-transparent z-0"></div>
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-zinc-950 to-transparent z-0"></div>
      <div className="absolute inset-0 bg-zinc-950/70 z-0 pointer-events-none"></div>

      {/* --- TARTALOM (Z-10) --- */}
      <div className="relative z-10 w-full max-w-3xl mx-auto">
        
        {/* Fejléc */}
        <div className="text-center mb-10">
          <span className="text-zinc-400 uppercase tracking-[0.4em] font-light text-xs md:text-sm mb-3 inline-block">
            Árlista & Szolgáltatások
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase text-zinc-100 leading-tight">
            A Stílus <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400">Ára</span>
          </h2>
        </div>

        {/* LISTA ELRENDEZÉS */}
        <div className="flex flex-col gap-8">
          {servicesData.map((category, catIndex) => (
            <div key={catIndex} className="flex flex-col w-full">
              
              {/* Kategória Cím */}
              {/* mb-8-ról mb-3-ra csökkentve a kategória cím alatti távolság */}
              <div className="flex items-center gap-4 mb-3">
                <h3 className="text-lg font-light uppercase tracking-widest text-zinc-400 whitespace-nowrap">
                  {category.category}
                </h3>
                <div className="h-[1px] w-full bg-zinc-800/80"></div>
              </div>

              {/* Szolgáltatás Sorok */}
              <div className="flex flex-col">
                {category.items.map((item, itemIndex) => (
                  <div 
                    key={itemIndex} 
                    // py-6-ról py-4-re csökkentve a sorok belső magassága
                    className="group flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-4 border-b border-zinc-800/50 hover:border-purple-500/40 transition-colors duration-300"
                  >
                    {/* Bal oldal: Név és Leírás */}
                    <div className="flex flex-col gap-1">
                      <span className="text-lg font-medium text-zinc-100 uppercase tracking-wider group-hover:text-purple-300 transition-colors duration-300">
                        {item.name}
                      </span>
                      <span className="text-xs text-zinc-500 font-light">
                        {item.description}
                      </span>
                    </div>

                    {/* Jobb oldal: Ár és Időtartam */}
                    <div className="flex flex-col sm:items-end gap-1">
                      <span className="text-lg font-bold text-zinc-100 whitespace-nowrap">
                        {item.price}
                      </span>
                      <span className="text-xs text-zinc-500 font-light whitespace-nowrap">
                        {item.duration}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

        {/* Bottom CTA Gomb */}
        <div className="mt-12 text-center">
          <a
            href="#foglalas"
            className="inline-block border border-purple-500/50 text-purple-200 px-10 py-3.5 rounded-sm text-sm font-bold uppercase tracking-widest hover:bg-purple-500/10 hover:border-purple-400 hover:text-white transition-all duration-300"
          >
            Foglalj Időpontot
          </a>
        </div>

      </div>
    </section>
  );
}