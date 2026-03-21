'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, User, LogOut, Home, ChevronRight, MapPin, XCircle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { cancelBooking } from '@/app/actions/bookings'

type TabType = 'bookings' | 'profile'

interface BookingData {
  id: string
  date: string
  serviceName: string
  price?: number
  status?: string
}

interface UserDashboardProps {
  userName: string;
  userEmail: string;
  userPhone: string;
  upcomingBookings: BookingData[];
  pastBookings: BookingData[];
}

// segédfüggvények a szép magyar dátumokhoz
const monthNamesHuLong = [
  "Január", "Február", "Március", "Április", "Május", "Június",
  "Július", "Augusztus", "Szeptember", "Október", "November", "December"
];

const dayNamesHuShort = ["vas.", "hétf.", "kedd", "szerd.", "csüt.", "pént.", "szomb."];
const dayNamesHuLong = ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"];

function formatBookingDate(dateString: string) {
  const date = new Date(dateString)
  const dayNum = date.getDate()
  const dayNameShort = dayNamesHuShort[date.getDay()]
  const dayNameLong = dayNamesHuLong[date.getDay()];
  const monthLong = monthNamesHuLong[date.getMonth()];
  
  const hours = date.getHours().toString().padStart(2, '0')
  const mins = date.getMinutes().toString().padStart(2, '0')

  return {
    monthLong,
    dayNumStr: dayNum.toString(),
    subtitle: `${dayNameLong} • ${hours}:${mins}`,
    timeStr: `${hours}:${mins}`,
    dayNameShort // vas.
  }
}

export default function UserDashboard({ userName, userEmail, userPhone, upcomingBookings, pastBookings }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('bookings')
  const [isCancelling, setIsCancelling] = useState<string | null>(null)

  const menuItems = [
    { id: 'bookings', label: 'Foglalásaim', icon: Calendar },
    { id: 'profile', label: 'Profilom', icon: User },
  ] as const

  const getGreetingName = (name: string) => {
    if (!name) return 'Vendég'
    const parts = name.trim().split(/\s+/)
    if (parts.length === 2) return parts[1]
    return name
  }

  async function handleCancel(id: string) {
    if (!window.confirm("Biztosan lemondod ezt az időpontot?")) return
    setIsCancelling(id)
    await cancelBooking(id)
    setIsCancelling(null)
  }

  // --- LOGIKA: Adatok csoportosítása és szűrése ---

  // 1. Közelgő foglalások csoportosítása hónapok szerint
  const groupedUpcoming = upcomingBookings.reduce((acc, booking) => {
    const date = new Date(booking.date);
    const monthTitle = `${monthNamesHuLong[date.getMonth()]} ${date.getFullYear()}`;
    
    if (!acc[monthTitle]) {
      acc[monthTitle] = [];
    }
    acc[monthTitle].push(booking);
    return acc;
  }, {} as Record<string, BookingData[]>);

  // 2. Az abszolút első közelgő foglalás ID-ja (a kiemeléshez)
  const absoluteFirstUpcomingId = upcomingBookings[0]?.id;

  // 3. Múltbeli foglalások szétválasztása: Tényleg teljesített vs Lemondott
  const actualAttendedPast = pastBookings.filter(b => b.status !== "CANCELLED");
  const actualCancelledPast = pastBookings.filter(b => b.status === "CANCELLED");

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex overflow-hidden selection:bg-indigo-400/20">
      
      {/* DESKTOP SIDEBAR (Változatlan) */}
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

      {/* FŐ TARTALMI RÉSZ */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative pb-28 md:pb-0 bg-zinc-950">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "url('/cave-texture.jpg')", backgroundSize: "cover" }}></div>
        
        {/* MOBIL FEJLÉC */}
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

        {/* TARTALOM TERÜLET */}
        <div className="p-6 md:p-12 lg:p-16 max-w-5xl w-full mx-auto relative z-10 flex-1">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} >
            
            {/* --- 1. FOGLALÁSOK FÜL --- */}
            {activeTab === 'bookings' && (
              <div className="flex flex-col gap-14">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-zinc-800/80 pb-6">
                  <h2 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight flex items-center gap-4 text-white">
                    <Calendar className="text-indigo-400" size={26} /> Foglalásaim
                  </h2>
                  <Link href="/#foglalas" className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-800 text-white px-7 py-3.5 rounded-2xl text-[13px] font-bold uppercase tracking-widest transition-all hover:brightness-110 hover:shadow-lg hover:shadow-indigo-950/40 text-center flex items-center gap-2.5 group">
                    <ChevronRight size={18} className="text-white/60 -ml-1 group-hover:-translate-x-0.5 transition-transform rotate-180" />
                    Új Időpont Foglalása
                  </Link>
                </div>

                {/* --- 1a. KÖVETKEZŐ IDŐPONTOK (Hónapok szerint csoportosítva) --- */}
                <div>
                  <h2 className="text-xl md:text-2xl font-extrabold uppercase tracking-tight flex items-center gap-4 text-white mb-6">
                    Következő Időpontjaid
                  </h2>

                  {upcomingBookings.length === 0 ? (
                    <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-3xl p-10 text-center text-zinc-600 backdrop-blur-sm shadow-inner">
                      Nincs közelgő foglalásod.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-10">
                      {Object.entries(groupedUpcoming).map(([monthTitle, bookings]) => (
                        <div key={monthTitle}>
                          {/* Hónap Címe - Kért design */}
                          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-600 mb-5 pb-1 border-b border-zinc-800/60">
                            {monthTitle}
                          </h3>
                          
                          <div className="flex flex-col gap-5">
                            {bookings.map((booking) => {
                              const { dayNumStr, subtitle, dayNameShort } = formatBookingDate(booking.date)
                              const isAbsoluteFirst = booking.id === absoluteFirstUpcomingId

                              return (
                                <div key={booking.id} className="relative group">
                                  {isAbsoluteFirst && <div className="absolute -inset-0.5 rounded-[2rem] bg-gradient-to-r from-indigo-500/20 to-violet-500/20 opacity-40 blur-xl group-hover:opacity-70 transition-opacity duration-500"></div>}
                                  
                                  <div className={`relative bg-zinc-900/60 border ${isAbsoluteFirst ? 'border-indigo-500/30' : 'border-zinc-800'} rounded-[2rem] p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 backdrop-blur-xl transition-all duration-300`}>
                                     
                                     <div className="flex items-center gap-5 md:gap-6">
                                       {/* DátumBox finomítva (közelebb a képhez) */}
                                       <div className={`flex flex-col items-center justify-center bg-zinc-950/80 border ${isAbsoluteFirst ? 'border-indigo-500/30' : 'border-zinc-800/80'} rounded-2xl w-20 h-20 flex-shrink-0 shadow-inner px-3`}>
                                          <span className={`${isAbsoluteFirst ? 'text-indigo-400' : 'text-zinc-500'} text-[11px] font-medium mb-0.5`}>{dayNameShort}</span>
                                          <span className="text-3xl font-extrabold text-white tracking-tighter">{dayNumStr}</span>
                                       </div>

                                       <div className="flex flex-col justify-center flex-1">
                                         <div className="flex items-center gap-2 mb-1.5">
                                            {isAbsoluteFirst && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>}
                                            <span className="text-zinc-400 text-[11px] md:text-xs font-bold uppercase tracking-widest">{subtitle}</span>
                                         </div>
                                         <div className="text-lg md:text-xl font-bold text-white mb-1.5 tracking-tight line-clamp-1">{booking.serviceName}</div>
                                         <div className="text-zinc-500 text-xs font-medium flex items-center gap-1.5">
                                            <MapPin size={14} className="text-zinc-600" /> Wesselényi u. 41.
                                         </div>
                                       </div>
                                     </div>

                                     <div className="flex flex-row sm:flex-col gap-2 sm:min-w-[130px] flex-shrink-0">
                                        <button 
                                          onClick={() => handleCancel(booking.id)}
                                          disabled={isCancelling === booking.id}
                                          className="flex-1 bg-transparent hover:bg-red-500/10 text-red-400/70 hover:text-red-400 border border-red-900/30 px-4 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all duration-300 text-center disabled:opacity-50"
                                        >
                                          {isCancelling === booking.id ? 'Lemondás...' : 'Lemondás'}
                                        </button>
                                     </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* --- 1b. LEMONDOTT FOGLALÁSOK (Kért külön címszó) --- */}
                {actualCancelledPast.length > 0 && (
                  <div className="mt-4">
                    <h2 className="text-xl md:text-2xl font-extrabold uppercase tracking-tight flex items-center gap-4 text-white mb-6">
                      <XCircle className="text-red-500" size={26} /> Lemondott foglalások
                    </h2>
                    
                    <div className="bg-zinc-900/30 border border-red-950/20 rounded-3xl overflow-hidden backdrop-blur-sm shadow-inner">
                      {actualCancelledPast.map((booking, index) => {
                        const { monthLong, dayNumStr, timeStr } = formatBookingDate(booking.date)
                        
                        return (
                          <div key={booking.id} className={`flex items-center justify-between p-5 md:p-6 ${index !== actualCancelledPast.length - 1 ? 'border-b border-zinc-800/50' : ''}`}>
                            <div className="flex items-center gap-4 flex-1">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-red-500/10 text-red-500`}>
                                <XCircle size={20} />
                              </div>
                              <div>
                                <div className={`font-bold text-sm md:text-base mb-1 text-zinc-500 line-through line-clamp-1`}>{booking.serviceName}</div>
                                <div className="text-xs text-zinc-500 font-medium uppercase tracking-widest">{monthLong} {dayNumStr}. • {timeStr}</div>
                              </div>
                            </div>
                            <div className="text-xs font-bold uppercase tracking-widest text-red-500 px-3 py-1 bg-red-950/40 rounded-full">Lemondva</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* --- 1c. ELŐZMÉNYEK (Korábbi, teljesített vágások) --- */}
                <div className="mt-4">
                  <h2 className="text-xl md:text-2xl font-extrabold uppercase tracking-tight flex items-center gap-4 text-white mb-6">
                    <CheckCircle2 className="text-green-500/70" size={26} /> Előzmények
                  </h2>
                  
                  {actualAttendedPast.length === 0 ? (
                    <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-3xl p-12 text-center text-zinc-600 backdrop-blur-sm shadow-inner">
                       <Calendar size={32} className="mx-auto text-zinc-700 mb-4" />
                       <p className='text-sm font-medium'>Még nem jártál nálunk.</p>
                    </div>
                  ) : (
                    <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-3xl overflow-hidden backdrop-blur-sm">
                      {actualAttendedPast.map((booking, index) => {
                        const { monthLong, dayNumStr, timeStr } = formatBookingDate(booking.date)
                        
                        return (
                          <div key={booking.id} className={`flex items-center justify-between p-5 md:p-6 ${index !== actualAttendedPast.length - 1 ? 'border-b border-zinc-800/50' : ''}`}>
                            <div className="flex items-center gap-4 flex-1">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-zinc-800/50 text-green-500/70`}>
                                <CheckCircle2 size={20} />
                              </div>
                              <div>
                                <div className={`font-bold text-sm md:text-base mb-1 text-zinc-200 line-clamp-1`}>{booking.serviceName}</div>
                                <div className="text-xs text-zinc-500 font-medium uppercase tracking-widest">{monthLong} {dayNumStr}. • {timeStr}</div>
                              </div>
                            </div>
                            <div className="text-xs text-zinc-600 font-medium">Sikeresen teljesítve</div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* --- 2. PROFILOM FÜL (Változatlan) --- */}
            {activeTab === 'profile' && (
              <div className="flex flex-col gap-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-zinc-800/80 pb-6 mb-2">
                  <h2 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight flex items-center gap-4 text-white">
                    <User className="text-indigo-400" size={26} /> Profilom
                  </h2>
                </div>
                <div className="bg-gradient-to-br from-zinc-900/80 to-indigo-950/40 border border-zinc-800/60 rounded-3xl p-7 md:p-10 backdrop-blur-xl shadow-2xl shadow-black/20">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                      <div>
                        <span className="text-zinc-600 uppercase tracking-widest text-[11px] font-bold block mb-2.5 ml-1">Teljes Név</span>
                        <div className="text-base font-medium text-white bg-zinc-950/60 border border-zinc-800/60 rounded-2xl px-5 py-4 shadow-inner">{userName || 'Nincs megadva'}</div>
                      </div>
                      <div>
                        <span className="text-zinc-600 uppercase tracking-widest text-[11px] font-bold block mb-2.5 ml-1">E-mail Cím</span>
                        <div className="text-base font-medium text-zinc-500 bg-zinc-950/60 border border-zinc-800/60 rounded-2xl px-5 py-4 shadow-inner cursor-not-allowed">{userEmail}</div>
                      </div>
                      <div>
                        <span className="text-zinc-600 uppercase tracking-widest text-[11px] font-bold block mb-2.5 ml-1">Telefonszám</span>
                        <div className="text-base font-medium text-white bg-zinc-950/60 border border-zinc-800/60 rounded-2xl px-5 py-4 shadow-inner">{userPhone || 'Nincs megadva'}</div>
                      </div>
                   </div>
                   <div className="mt-10 pt-8 border-t border-zinc-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <p className="text-xs text-zinc-500 max-w-sm">Az e-mail cím vagy a jelszó módosításához biztonsági okokból kérlek vedd fel velünk a kapcsolatot.</p>
                      <button className="bg-zinc-100 text-zinc-950 hover:bg-white px-7 py-3.5 rounded-xl text-[13px] font-bold uppercase tracking-widest transition-all hover:scale-[1.02] shadow-lg flex-shrink-0">
                        Adatok Frissítése
                      </button>
                   </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {/* MOBIL ALSÓ NAVIGÁCIÓ (Változatlan) */}
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
    </div>
  )
}