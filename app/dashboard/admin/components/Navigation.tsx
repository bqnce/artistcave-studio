'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { LayoutDashboard, Calendar, Users, Scissors, Clock, Home, LogOut } from 'lucide-react'
import { TabType } from '../types'

const menuItems = [
  { id: 'bookings', label: 'Foglalások', icon: Calendar },
  { id: 'guests', label: 'Vendégek', icon: Users },
  { id: 'services', label: 'Szolgáltatások', icon: Scissors },
  { id: 'schedules', label: 'Időpontok', icon: Clock },
] as const

// --- ÚJ, KREATÍV ASZTALI SIDEBAR ---
export function AdminSidebar({ activeTab, setActiveTab }: { activeTab: TabType, setActiveTab: (t: TabType) => void }) {
  return (
    <aside className="w-[280px] bg-zinc-950/80 border-r border-zinc-800/50 flex flex-col backdrop-blur-2xl z-20 hidden md:flex flex-shrink-0 relative">
      {/* Finom felső piros fényhatás */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-red-500/5 to-transparent pointer-events-none"></div>

      {/* Logó / Fejléc Szekció */}
      <div className="p-8 pt-10">
        <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-black uppercase tracking-[0.2em] mb-4 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
          Vezérlőpult
        </div>
        <h1 className="text-3xl font-black tracking-tighter uppercase text-white">
          Főnöki <br/><span className="text-transparent bg-clip-text bg-gradient-to-br from-red-400 to-red-600">Asztal</span>
        </h1>
      </div>

      {/* Fő Navigáció */}
      <nav className="flex-1 px-4 flex flex-col gap-1.5 relative z-10 mt-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`group relative flex items-center gap-4 px-5 py-4 rounded-2xl transition-colors duration-300 overflow-hidden ${
            activeTab === 'overview' ? 'text-white' : 'text-zinc-500 hover:text-zinc-200'
          }`}
        >
          {activeTab === 'overview' && (
            <motion.div
              layoutId="adminActiveBg"
              className="absolute inset-0 bg-gradient-to-r from-red-500/15 to-transparent border-l-[3px] border-red-500 z-0"
              initial={false}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            />
          )}
          <LayoutDashboard size={20} className={`relative z-10 transition-colors duration-300 ${activeTab === 'overview' ? 'text-red-500' : 'group-hover:text-red-400'}`} />
          <span className="relative z-10 text-xs font-bold uppercase tracking-widest mt-0.5">Áttekintés</span>
        </button>

        <div className="h-px bg-zinc-800/40 my-3 mx-5"></div>

        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`group relative flex items-center gap-4 px-5 py-4 rounded-2xl transition-colors duration-300 overflow-hidden ${
                isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-200'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="adminActiveBg"
                  className="absolute inset-0 bg-gradient-to-r from-red-500/15 to-transparent border-l-[3px] border-red-500 z-0"
                  initial={false}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <item.icon size={20} className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-red-500' : 'group-hover:text-red-400'}`} />
              <span className="relative z-10 text-xs font-bold uppercase tracking-widest mt-0.5">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Alsó Szekció (Kilépés / Főoldal) */}
      <div className="p-6 border-t border-zinc-800/50 flex flex-col gap-2 relative z-10">
        <Link href="/" className="group flex items-center gap-4 px-5 py-3.5 rounded-xl text-zinc-500 hover:bg-zinc-900/50 hover:text-white transition-all duration-300">
          <Home size={18} className="text-zinc-600 group-hover:text-zinc-300 transition-colors" />
          <span className="text-xs font-bold uppercase tracking-widest mt-0.5">Főoldal</span>
        </Link>
        <form action="/auth/signout" method="POST" className="w-full">
          <button type="submit" className="group w-full flex items-center gap-4 px-5 py-3.5 rounded-xl text-red-500/70 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 border border-transparent hover:border-red-500/20">
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-xs font-bold uppercase tracking-widest mt-0.5">Kijelentkezés</span>
          </button>
        </form>
      </div>
    </aside>
  )
}

// --- MOBIL NÉZETEK (Teljesen érintetlenül, ahogy kérted) ---
export function AdminMobileHeader({ activeTab, setActiveTab }: { activeTab: TabType, setActiveTab: (t: TabType) => void }) {
  return (
    <header className="md:hidden flex items-center justify-between h-20 px-5 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30 flex-shrink-0">
      <div className="flex-shrink-0"><h1 className="text-base font-bold uppercase tracking-tighter">Főnöki <span className="text-red-500">Asztal</span></h1></div>
      <div className="flex items-center gap-1 sm:gap-2">
        <button onClick={() => setActiveTab('overview')} className={`w-10 h-10 flex-shrink-0 flex items-center justify-center relative transition-colors ${activeTab === 'overview' ? 'text-red-400' : 'text-zinc-500 hover:text-zinc-300'}`}>
          <LayoutDashboard size={20} /><span className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full transition-colors ${activeTab === 'overview' ? 'bg-red-500' : 'bg-transparent'}`}></span>
        </button>
        <div className="w-px h-5 bg-zinc-800 mx-1 flex-shrink-0"></div>
        <Link href="/" className="w-10 h-10 flex-shrink-0 flex items-center justify-center text-zinc-500 hover:text-white transition-colors"><Home size={20} /></Link>
        <form action="/auth/signout" method="POST" className="flex flex-shrink-0 items-center">
          <button type="submit" className="w-10 h-10 flex items-center justify-center text-red-500/70 hover:text-red-400 transition-colors"><LogOut size={20} /></button>
        </form>
      </div>
    </header>
  )
}

export function AdminMobileNav({ activeTab, setActiveTab }: { activeTab: TabType, setActiveTab: (t: TabType) => void }) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-800 z-40 px-1 py-2 flex justify-between items-center safe-area-pb">
      {menuItems.map((item) => (
        <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex-1 flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-all duration-300 ${activeTab === item.id ? 'text-red-400' : 'text-zinc-500 hover:text-zinc-300'}`}>
          <item.icon size={20} />
          <span className="text-[9px] font-bold uppercase tracking-widest mt-0.5 truncate w-full text-center">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}