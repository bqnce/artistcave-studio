'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, User, LogOut, Home, ChevronRight } from 'lucide-react'
import { TabType } from '../types'
import { getGreetingName } from '../utils'

const menuItems = [
  { id: 'bookings', label: 'Foglalásaim', icon: Calendar },
  { id: 'profile', label: 'Profilom', icon: User },
] as const

export function UserSidebar({ activeTab, setActiveTab, userName, userEmail }: { activeTab: TabType, setActiveTab: (t: TabType) => void, userName: string, userEmail: string }) {
  return (
    <aside className="w-68 bg-zinc-900/40 border-r border-zinc-800/60 flex flex-col backdrop-blur-xl z-20 hidden md:flex relative flex-shrink-0">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent"></div>
      <div className="p-7 border-b border-zinc-800/60 pt-10">
        <span className="text-indigo-400 font-medium tracking-widest uppercase text-[10px] mb-2 block">Ügyfél Portál</span>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Szia, <span className="text-zinc-100">{getGreetingName(userName)}</span>!
        </h1>
        <p className="text-zinc-500 text-xs mt-1.5">{userEmail}</p>
      </div>
      <nav className="flex-1 p-5 flex flex-col gap-2.5 pt-8">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center group gap-3.5 px-5 py-3.5 rounded-2xl transition-all duration-300 relative ${
                isActive 
                ? 'bg-gradient-to-r from-zinc-900/80 to-indigo-950/40 text-indigo-400 border border-indigo-950/60 shadow-inner' 
                : 'text-zinc-500 hover:text-zinc-200 border border-transparent'
              }`}
            >
              <Icon size={19} className={`${isActive ? 'text-indigo-400' : 'text-zinc-600 group-hover:text-zinc-400'} transition-colors`} />
              <span className="text-[13px] font-medium uppercase tracking-widest">{item.label}</span>
              {isActive && <motion.div layoutId="activeNavDesktop" className="absolute -left-1.5 top-1/2 -translate-y-1/2 h-8 w-1 bg-indigo-400 rounded-full"></motion.div>}
            </button>
          )
        })}
      </nav>
      <div className="p-5 border-t border-zinc-800/60 flex flex-col gap-3 pb-8">
        <Link href="/#foglalas" className="w-full bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-800 text-white px-6 py-4 rounded-2xl text-[13px] font-bold uppercase tracking-widest transition-all hover:brightness-110 hover:shadow-lg hover:shadow-indigo-950/50 flex justify-between items-center group">
          <span>Új Foglalás</span>
          <ChevronRight size={18} className="text-white/60 group-hover:translate-x-0.5 transition-transform" />
        </Link>
        <div className="flex gap-2.5">
           <Link href="/" className="flex-1 flex items-center justify-center gap-2.5 p-3.5 rounded-xl text-zinc-600 hover:bg-zinc-900/60 hover:text-zinc-300 transition-colors border border-transparent hover:border-zinc-800/60"><Home size={17} /></Link>
           <form action="/auth/signout" method="POST" className="flex-1">
             <button type="submit" className="w-full flex items-center justify-center gap-2.5 p-3.5 rounded-xl text-red-900/70 hover:bg-red-950/30 hover:text-red-400 transition-colors border border-transparent hover:border-red-900/40"><LogOut size={17} /></button>
           </form>
        </div>
      </div>
    </aside>
  )
}

export function UserMobileHeader({ userName }: { userName: string }) {
  return (
    <header className="md:hidden flex items-center justify-between h-20 px-6 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-30 flex-shrink-0">
      <div className="flex-shrink-0">
        <h1 className="text-lg font-bold tracking-tighter text-white">Helló, <span className="text-indigo-400">{getGreetingName(userName)}</span>!</h1>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <Link href="/" className="w-11 h-11 flex items-center justify-center text-zinc-600 hover:text-white transition-colors flex-shrink-0"><Home size={21} /></Link>
        <div className="w-px h-5 bg-zinc-800/60 flex-shrink-0"></div>
        <form action="/auth/signout" method="POST" className="flex flex-shrink-0 items-center">
          <button type="submit" className="w-11 h-11 flex items-center justify-center text-red-900/70 hover:text-red-400 transition-colors flex-shrink-0"><LogOut size={21} /></button>
        </form>
      </div>
    </header>
  )
}

export function UserMobileNav({ activeTab, setActiveTab }: { activeTab: TabType, setActiveTab: (t: TabType) => void }) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-950/90 backdrop-blur-2xl border-t border-zinc-800/60 z-40 px-3 py-3 flex justify-around items-center safe-area-pb shadow-2xl shadow-black/50">
      {menuItems.map((item) => {
        const Icon = item.icon
        const isActive = activeTab === item.id
        return (
          <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex-1 flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl transition-all duration-300 relative ${isActive ? 'text-indigo-400' : 'text-zinc-600 hover:text-zinc-300'}`}>
            <Icon size={22} className={`${isActive ? 'text-indigo-400' : 'text-zinc-700'}`} />
            <span className="text-[10px] font-medium uppercase tracking-widest mt-1 truncate">{item.label}</span>
            {isActive && <motion.div layoutId="activeNavMobile" className="absolute inset-0 rounded-2xl bg-gradient-to-t from-indigo-400/10 to-transparent -z-10"></motion.div>}
          </button>
        )
      })}
    </nav>
  )
}