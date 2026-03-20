'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, User, LogOut, Home, MapPin } from 'lucide-react'
import Link from 'next/link'

type TabType = 'bookings' | 'profile'

interface UserDashboardProps {
    userName: string;
    userEmail: string;
    userPhone: string;
}

export default function UserDashboard({ userName, userEmail, userPhone }: UserDashboardProps) {
    const [activeTab, setActiveTab] = useState<TabType>('bookings')

    // ÚJ FÜGGVÉNY: Keresztnév okos kinyerése
    const getGreetingName = (name: string) => {
        if (!name) return 'Vendég'
        const parts = name.trim().split(/\s+/)
        // Ha pontosan 2 szó (Vezetéknév Keresztnév), a másodikat adjuk vissza
        if (parts.length === 2) return parts[1]
        // Minden más esetben (1 szó vagy 3+ szó) a teljes nevet adjuk vissza
        return name
    }

    const menuItems = [
        { id: 'bookings', label: 'Foglalásaim', icon: Calendar },
        { id: 'profile', label: 'Profilom', icon: User },
    ] as const

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex overflow-hidden selection:bg-purple-500/30">

            {/* DESKTOP SIDEBAR */}
            <aside className="w-64 bg-zinc-900/50 border-r border-zinc-800 flex flex-col backdrop-blur-md z-20 hidden md:flex">
                <div className="p-5 border-b border-zinc-800/60 pt-6">
                    <span className="text-indigo-400 font-medium tracking-widest uppercase text-[10px] mb-2 block">Ügyfél Portál</span>
                    <h1 className="text-2xl font-bold tracking-tight text-white">
                        Szia, <span className="text-zinc-100">{getGreetingName(userName)}</span>!
                    </h1>
                </div>

                <nav className="flex-1 p-4 flex flex-col gap-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon
                        const isActive = activeTab === item.id
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                                    ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
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
                    <Link
                        href="/#foglalas"
                        className="flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-800 text-white transition-all duration-300 hover:brightness-110 hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-0.5 mb-2 group"
                    >
                        <Calendar size={18} className="text-white/80 group-hover:text-white transition-colors" />
                        <span className="text-[13px] font-bold uppercase tracking-widest">Új Foglalás</span>
                    </Link>

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
                <header className="md:hidden flex items-center justify-between h-20 px-6 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-30 flex-shrink-0">
                    <div className="flex-shrink-0">
                        <h1 className="text-lg font-bold tracking-tighter text-white">
                            Helló, <span className="text-indigo-400">{getGreetingName(userName)}</span>!
                        </h1>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                        <Link href="/" className="w-11 h-11 flex items-center justify-center text-zinc-600 hover:text-white transition-colors flex-shrink-0">
                            <Home size={21} />
                        </Link>
                        <div className="w-px h-5 bg-zinc-800/60 flex-shrink-0"></div>
                        <form action="/auth/signout" method="POST" className="flex flex-shrink-0 items-center">
                            <button type="submit" className="w-11 h-11 flex items-center justify-center text-red-900/70 hover:text-red-400 transition-colors flex-shrink-0">
                                <LogOut size={21} />
                            </button>
                        </form>
                    </div>
                </header>

                {/* TARTALOM */}
                <div className="p-6 md:p-10 lg:p-16 max-w-4xl w-full mx-auto relative z-10">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* 1. FOGLALÁSOK */}
                        {activeTab === 'bookings' && (
                            <div className="flex flex-col gap-8">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                                    <h2 className="text-xl md:text-2xl font-bold uppercase flex items-center gap-3">
                                        <Calendar className="text-purple-500" /> Foglalásaim
                                    </h2>
                                    <Link
                                        href="/#foglalas"
                                        className="flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-800 text-white transition-all duration-300 hover:brightness-110 hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-0.5 mb-2 group"
                                    >
                                        <Calendar size={18} className="text-white/80 group-hover:text-white transition-colors" />
                                        <span className="text-[13px] font-bold uppercase tracking-widest">Új Foglalás</span>
                                    </Link>
                                </div>

                                {/* Következő foglalás kártya */}
                                {/* Következő foglalás kártya */}
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-4 border-b border-zinc-800 pb-2">Következő Időpontod</h3>

                                    <div className="relative group">
                                        {/* Finom, pulzáló háttér-fény, ami mutatja, hogy ez egy aktív időpont */}
                                        <div className="absolute -inset-0.5 rounded-[2rem] bg-gradient-to-r from-indigo-500/20 to-violet-500/20 opacity-40 blur-xl group-hover:opacity-70 transition-opacity duration-500"></div>

                                        {/* Maga a kártya */}
                                        <div className="relative bg-zinc-900/60 border border-zinc-800 hover:border-indigo-500/30 rounded-[2rem] p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 backdrop-blur-xl transition-all duration-300">

                                            <div className="flex items-center gap-5 md:gap-6">
                                                {/* Naptár "ikon" doboz */}
                                                <div className="flex flex-col items-center justify-center bg-zinc-950/80 border border-zinc-800/80 rounded-2xl w-20 h-20 md:w-24 md:h-24 flex-shrink-0 shadow-inner">
                                                    <span className="text-indigo-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-0.5">Május</span>
                                                    <span className="text-2xl md:text-3xl font-extrabold text-white">18</span>
                                                </div>

                                                {/* Adatok */}
                                                <div className="flex flex-col justify-center">
                                                    <div className="flex items-center gap-2 mb-1.5">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
                                                        <span className="text-zinc-400 text-[11px] md:text-xs font-bold uppercase tracking-widest">Csütörtök • 16:30</span>
                                                    </div>
                                                    <div className="text-lg md:text-xl font-bold text-white mb-1.5 tracking-tight">Hajvágás + Szakáll igazítás</div>
                                                    <div className="text-zinc-500 text-xs font-medium flex items-center gap-1.5">
                                                        {/* Ha nincs MapPin importálva, egyszerűen vedd ki ezt az ikont */}
                                                        <MapPin size={14} className="text-zinc-600" />
                                                        Wesselényi u. 41.
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Gombok */}
                                            <div className="flex flex-row sm:flex-col gap-2 sm:min-w-[130px] flex-shrink-0">
                                                <button className="flex-1 bg-zinc-800/40 hover:bg-indigo-600 text-zinc-300 hover:text-white border border-zinc-700/50 hover:border-indigo-500 px-4 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all duration-300 text-center">
                                                    Módosítás
                                                </button>
                                                <button className="flex-1 bg-transparent hover:bg-red-500/10 text-red-400/70 hover:text-red-400 px-4 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all duration-300 text-center">
                                                    Lemondás
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                {/* Korábbi foglalások */}
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-4 border-b border-zinc-800 pb-2 mt-4">Korábbi Vágások</h3>
                                    <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 text-center text-zinc-500 backdrop-blur-sm">
                                        Itt fognak megjelenni a korábbi látogatásaid és a választott szolgáltatások.
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 2. PROFILOM */}
                        {activeTab === 'profile' && (
                            <div className="flex flex-col gap-8">
                                <h2 className="text-xl md:text-2xl font-bold uppercase flex items-center gap-3 mb-2">
                                    <User className="text-purple-500" /> Profilom
                                </h2>

                                <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <span className="text-zinc-500 uppercase tracking-widest text-xs font-bold block mb-2">Teljes Név</span>
                                            <div className="text-lg font-medium text-white bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3">{userName || 'Nincs megadva'}</div>
                                        </div>
                                        <div>
                                            <span className="text-zinc-500 uppercase tracking-widest text-xs font-bold block mb-2">E-mail Cím</span>
                                            <div className="text-lg font-medium text-zinc-400 bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 cursor-not-allowed">{userEmail}</div>
                                            <p className="text-xs text-zinc-600 mt-2">Az e-mail cím módosításához vedd fel velünk a kapcsolatot.</p>
                                        </div>
                                        <div>
                                            <span className="text-zinc-500 uppercase tracking-widest text-xs font-bold block mb-2">Telefonszám</span>
                                            <div className="text-lg font-medium text-white bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3">{userPhone || 'Nincs megadva'}</div>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-zinc-800 flex justify-end">
                                        <button className="bg-white text-black hover:bg-zinc-200 px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-colors">
                                            Adatok Mentése
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </main>

            {/* MOBIL ALSÓ NAVIGÁCIÓ */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-800 z-40 px-2 py-2 flex justify-around items-center safe-area-pb">
                {menuItems.map((item) => {
                    const Icon = item.icon
                    const isActive = activeTab === item.id
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex-1 flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl transition-all duration-300 ${isActive ? 'text-purple-400 bg-purple-500/10' : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                        >
                            <Icon size={22} />
                            <span className="text-[10px] font-bold uppercase tracking-widest truncate">{item.label}</span>
                        </button>
                    )
                })}
            </nav>

        </div>
    )
}