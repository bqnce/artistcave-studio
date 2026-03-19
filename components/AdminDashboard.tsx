'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Users, Scissors, Clock, LogOut, Home, LayoutDashboard, TrendingUp } from 'lucide-react'
import Link from 'next/link'

type TabType = 'overview' | 'bookings' | 'guests' | 'services' | 'schedules'

export default function AdminDashboard({ userName }: { userName: string }) {
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  // KIVETTÜK az 'overview'-t innen, így az alsó mobilos sávban csak 4 ikon lesz!
  const menuItems = [
    { id: 'bookings', label: 'Foglalások', icon: Calendar },
    { id: 'guests', label: 'Vendégek', icon: Users },
    { id: 'services', label: 'Szolgáltatások', icon: Scissors },
    { id: 'schedules', label: 'Időpontok', icon: Clock },
  ] as const

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex overflow-hidden selection:bg-purple-500/30">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="w-64 bg-zinc-900/50 border-r border-zinc-800 flex flex-col backdrop-blur-md z-20 hidden md:flex">
        <div className="p-6 border-b border-zinc-800">
          <span className="text-red-500 font-bold tracking-widest uppercase text-xs mb-1 block">Vezérlőpult</span>
          <h1 className="text-xl font-bold uppercase tracking-tighter">Főnöki <span className="text-red-500">Asztal</span></h1>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2">
          {/* ASZTALI NÉZET: Áttekintés gomb külön, legfelül */}
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              activeTab === 'overview' 
              ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
              : 'text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300 border border-transparent'
            }`}
          >
            <LayoutDashboard size={18} />
            <span className="text-sm font-medium uppercase tracking-widest">Áttekintés</span>
          </button>

          <div className="h-px bg-zinc-800/50 my-2"></div>

          {/* A többi 4 menüpont */}
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                  : 'text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300 border border-transparent'
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium uppercase tracking-widest">{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-zinc-800 flex flex-col gap-2">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300 transition-colors">
            <Home size={18} />
            <span className="text-sm font-medium uppercase tracking-widest">Főoldal</span>
          </Link>
          <form action="/auth/signout" method="POST">
            <button type="submit" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500/70 hover:bg-red-950/30 hover:text-red-400 transition-colors">
              <LogOut size={18} />
              <span className="text-sm font-medium uppercase tracking-widest">Kijelentkezés</span>
            </button>
          </form>
        </div>
      </aside>

      {/* FŐ TARTALMI RÉSZ */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative pb-24 md:pb-0">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('/cave-texture.jpg')", backgroundSize: "cover" }}></div>
        
        {/* MOBIL FEJLÉC (Navbar) */}
        <header className="md:hidden flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30">
           <div>
             <span className="text-red-500 font-bold tracking-widest uppercase text-[10px] block">Vezérlőpult</span>
             <h1 className="text-lg font-bold uppercase tracking-tighter">Főnöki Asztal</h1>
           </div>
           
           <div className="flex items-center justify-center gap-5">
             {/* MOBIL NAVBAR GOMB: Áttekintés */}
             <button 
               onClick={() => setActiveTab('overview')}
               className={`${activeTab === 'overview' ? 'text-red-400' : 'text-zinc-500 hover:text-zinc-300'} transition-colors relative`}
             >
               <LayoutDashboard size={22} />
               {activeTab === 'overview' && (
                 <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full"></span>
               )}
             </button>

             <div className="w-px h-5 bg-zinc-800"></div>

             <Link href="/" className="text-zinc-500 hover:text-white transition-colors">
               <Home size={20} />
             </Link>
             <form action="/auth/signout" method="POST" className='flex items-center'>
               <button type="submit" className="text-red-500/70 hover:text-red-400 transition-colors">
                 <LogOut size={20} />
               </button>
             </form>
           </div>
        </header>

        {/* TARTALOM */}
        <div className="p-6 md:p-10 lg:p-16 max-w-6xl w-full mx-auto relative z-10">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* 1. ÁTTEKINTÉS */}
            {activeTab === 'overview' && (
              <div className="flex flex-col gap-10">
                <h2 className="text-xl md:text-2xl font-bold uppercase flex items-center gap-3">
                  <LayoutDashboard className="text-red-500" /> Napi Áttekintés
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Napi */}
                  <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group hover:border-red-500/30 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <TrendingUp size={64} className="text-red-500" />
                    </div>
                    <span className="text-zinc-500 uppercase tracking-widest text-xs font-bold block mb-2">Mai Bevétel</span>
                    <div className="text-3xl font-bold text-white mb-1">32 500 Ft</div>
                    <div className="text-sm text-green-400/80 font-medium">+6 vágás ma</div>
                  </div>

                  {/* Heti */}
                  <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group hover:border-red-500/30 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <TrendingUp size={64} className="text-red-500" />
                    </div>
                    <span className="text-zinc-500 uppercase tracking-widest text-xs font-bold block mb-2">Heti Bevétel</span>
                    <div className="text-3xl font-bold text-white mb-1">145 000 Ft</div>
                    <div className="text-sm text-zinc-400 font-medium">28 vágás a héten</div>
                  </div>

                  {/* Havi */}
                  <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group hover:border-red-500/30 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <TrendingUp size={64} className="text-red-500" />
                    </div>
                    <span className="text-zinc-500 uppercase tracking-widest text-xs font-bold block mb-2">Havi Bevétel</span>
                    <div className="text-3xl font-bold text-white mb-1">680 000 Ft</div>
                    <div className="text-sm text-zinc-400 font-medium">Május hónap</div>
                  </div>
                </div>

                {/* Közelgő Foglalások Lista */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-4 border-b border-zinc-800 pb-2">Közelgő Foglalások (Ma)</h3>
                  
                  <div className="flex flex-col gap-3">
                    {[
                      { time: '14:30', name: 'Kovács Péter', service: 'Hajvágás', price: '5 000 Ft', active: true },
                      { time: '15:15', name: 'Nagy Gábor', service: 'Szakáll igazítás', price: '3 500 Ft', active: false },
                      { time: '16:00', name: 'Tóth Bence', service: 'Haj + Szakáll', price: '8 000 Ft', active: false },
                    ].map((booking, idx) => (
                      <div key={idx} className={`flex items-center justify-between p-4 rounded-xl border ${booking.active ? 'bg-red-500/10 border-red-500/30' : 'bg-zinc-900/30 border-zinc-800'}`}>
                        <div className="flex items-center gap-4">
                          <div className={`text-lg font-bold ${booking.active ? 'text-red-400' : 'text-zinc-300'}`}>{booking.time}</div>
                          <div>
                            <div className="font-bold text-zinc-100">{booking.name}</div>
                            <div className="text-xs text-zinc-500 uppercase tracking-widest mt-0.5">{booking.service}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-zinc-300">{booking.price}</div>
                          {booking.active && <div className="text-[10px] text-red-400 uppercase tracking-widest font-bold mt-1 animate-pulse">Következő</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. FOGLALÁSOK */}
            {activeTab === 'bookings' && (
              <div>
                <h2 className="text-xl md:text-2xl font-bold uppercase mb-6 flex items-center gap-3">
                  <Calendar className="text-red-500" /> Napi Foglalások
                </h2>
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 text-center text-zinc-500 backdrop-blur-sm">
                   A teljes heti/havi naptár nézeted fog itt megjelenni.
                </div>
              </div>
            )}

            {/* 3. VENDÉGEK */}
            {activeTab === 'guests' && (
              <div>
                <h2 className="text-xl md:text-2xl font-bold uppercase mb-6 flex items-center gap-3">
                  <Users className="text-red-500" /> Vendég Adatbázis
                </h2>
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 text-center text-zinc-500 backdrop-blur-sm">
                   Itt lesz kilistázva az összes regisztrált felhasználód neve, telefonja és költései.
                </div>
              </div>
            )}

            {/* 4. SZOLGÁLTATÁSOK */}
            {activeTab === 'services' && (
              <div>
                <h2 className="text-xl md:text-2xl font-bold uppercase mb-6 flex items-center gap-3">
                  <Scissors className="text-red-500" /> Szolgáltatások
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                   {[1,2,3].map((i) => (
                     <div key={i} className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 hover:border-red-500/30 transition-colors cursor-pointer">
                        <div className="flex justify-between items-start mb-4">
                           <span className="font-bold uppercase text-sm">Hajvágás {i}</span>
                           <span className="text-zinc-500 text-xs bg-zinc-800 px-2 py-1 rounded-md">45 perc</span>
                        </div>
                        <div className="text-xl font-bold text-zinc-300">5 000 Ft</div>
                     </div>
                   ))}
                   <button className="border border-dashed border-zinc-700 rounded-xl p-5 flex flex-col items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-500 transition-colors min-h-[120px]">
                     <span className="text-2xl mb-1">+</span>
                     <span className="text-xs uppercase tracking-widest">Új Hozzáadása</span>
                   </button>
                </div>
              </div>
            )}

            {/* 5. IDŐPONTOK */}
            {activeTab === 'schedules' && (
              <div>
                <h2 className="text-xl md:text-2xl font-bold uppercase mb-6 flex items-center gap-3">
                  <Clock className="text-red-500" /> Munkaidő
                </h2>
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 text-center text-zinc-500 backdrop-blur-sm">
                   Itt állíthatod be, hogy mely napokon dolgozol, mikor van ebédszünet, vagy ha elmész szabadságra.
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {/* MOBIL ALSÓ NAVIGÁCIÓ (Itt már csak 4 ikon maradt!) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-800 z-40 px-1 py-2 flex justify-between items-center safe-area-pb">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-all duration-300 ${
                isActive ? 'text-red-400' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Icon size={20} />
              <span className="text-[9px] font-bold uppercase tracking-widest mt-0.5 truncate w-full text-center">{item.label}</span>
            </button>
          )
        })}
      </nav>

    </div>
  )
}