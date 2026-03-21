'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Users, Scissors, Clock, LogOut, Home, LayoutDashboard, TrendingUp, Trash2, Plus, X, XCircle } from 'lucide-react'
import Link from 'next/link'
import { createService, deleteService } from '@/app/actions/services'

type TabType = 'overview' | 'bookings' | 'guests' | 'services' | 'schedules'

interface Service { id: string, name: string, durationMins: number, price: number, description: string | null }
interface TodayBooking { id: string, time: string, guestName: string, guestPhone: string, serviceName: string, price: number }
interface UpcomingBooking { id: string, date: string, time: string, guestName: string, serviceName: string, price: number }

interface AdminDashboardProps {
  userName: string
  initialServices: Service[]
  todayRevenue: number
  todayCount: number
  todayBookings: TodayBooking[]
  allUpcomingBookings: UpcomingBooking[]
  cancelledBookings: UpcomingBooking[] // Új prop a lemondottaknak!
}

// Dátum formázó segédfüggvények
const monthNamesHuLong = ["Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"];
const dayNamesHuShort = ["vas.", "hétf.", "kedd", "szerd.", "csüt.", "pént.", "szomb."];
const dayNamesHuLong = ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"];

function formatBookingDate(dateString: string) {
  const date = new Date(dateString)
  return {
    monthLong: monthNamesHuLong[date.getMonth()],
    dayNumStr: date.getDate().toString(),
    dayNameShort: dayNamesHuShort[date.getDay()],
    dayNameLong: dayNamesHuLong[date.getDay()],
    fullYear: date.getFullYear()
  }
}

export default function AdminDashboard({ 
  userName, initialServices, todayRevenue, todayCount, todayBookings, allUpcomingBookings, cancelledBookings 
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serviceError, setServiceError] = useState('')

  const menuItems = [
    { id: 'bookings', label: 'Foglalások', icon: Calendar },
    { id: 'guests', label: 'Vendégek', icon: Users },
    { id: 'services', label: 'Szolgáltatások', icon: Scissors },
    { id: 'schedules', label: 'Időpontok', icon: Clock },
  ] as const

  async function handleAddService(formData: FormData) {
    setIsSubmitting(true)
    setServiceError('')
    const res = await createService(formData)
    setIsSubmitting(false)
    if (res.success) setIsServiceModalOpen(false)
    else setServiceError(res.error || 'Hiba történt.')
  }

  async function handleDeleteService(id: string) {
    if (!window.confirm('Biztosan törlöd ezt a szolgáltatást?')) return
    const res = await deleteService(id)
    if (!res.success) alert(res.error)
  }

  // --- LOGIKA: Foglalások csoportosítása hónapok szerint az Adminnak ---
  const groupedUpcoming = allUpcomingBookings.reduce((acc, booking) => {
    const d = new Date(booking.date);
    const monthTitle = `${monthNamesHuLong[d.getMonth()]} ${d.getFullYear()}`;
    if (!acc[monthTitle]) acc[monthTitle] = [];
    acc[monthTitle].push(booking);
    return acc;
  }, {} as Record<string, UpcomingBooking[]>);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex overflow-hidden selection:bg-red-500/30">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="w-64 bg-zinc-900/50 border-r border-zinc-800 flex flex-col backdrop-blur-md z-20 hidden md:flex flex-shrink-0">
        <div className="p-6 border-b border-zinc-800">
          <span className="text-red-500 font-bold tracking-widest uppercase text-xs mb-1 block">Vezérlőpult</span>
          <h1 className="text-xl font-bold uppercase tracking-tighter">Főnöki <span className="text-red-500">Asztal</span></h1>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <button onClick={() => setActiveTab('overview')} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === 'overview' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300 border border-transparent'}`}>
            <LayoutDashboard size={18} /><span className="text-sm font-medium uppercase tracking-widest">Áttekintés</span>
          </button>
          <div className="h-px bg-zinc-800/50 my-2"></div>
          {menuItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === item.id ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300 border border-transparent'}`}>
              <item.icon size={18} /><span className="text-sm font-medium uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-zinc-800 flex flex-col gap-2">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300 transition-colors"><Home size={18} /><span className="text-sm font-medium uppercase tracking-widest">Főoldal</span></Link>
          <form action="/auth/signout" method="POST" className="flex items-center">
            <button type="submit" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500/70 hover:bg-red-950/30 hover:text-red-400 transition-colors"><LogOut size={18} /><span className="text-sm font-medium uppercase tracking-widest">Kijelentkezés</span></button>
          </form>
        </div>
      </aside>

      {/* FŐ TARTALMI RÉSZ */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative pb-24 md:pb-0">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('/cave-texture.jpg')", backgroundSize: "cover" }}></div>
        
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

        <div className="p-6 md:p-10 lg:p-16 max-w-6xl w-full mx-auto relative z-10 flex-1">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            
            {/* 1. ÁTTEKINTÉS */}
            {activeTab === 'overview' && (
              <div className="flex flex-col gap-10">
                <h2 className="text-xl md:text-2xl font-bold uppercase flex items-center gap-3"><LayoutDashboard className="text-red-500" /> Napi Áttekintés</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group hover:border-red-500/30 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><TrendingUp size={64} className="text-red-500" /></div>
                    <span className="text-zinc-500 uppercase tracking-widest text-xs font-bold block mb-2">Mai Várható Bevétel</span>
                    <div className="text-3xl font-bold text-white mb-1">{todayRevenue.toLocaleString('hu-HU')} Ft</div>
                    <div className="text-sm text-green-400/80 font-medium">{todayCount} vendég ma</div>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-4 border-b border-zinc-800 pb-2">Mai Beosztásod</h3>
                  {todayBookings.length === 0 ? (
                    <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 text-center text-zinc-500 backdrop-blur-sm">Mára nincsenek foglalásaid.</div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {todayBookings.map((booking) => (
                        <div key={booking.id} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-5">
                            <div className="text-2xl font-black text-red-500 w-16 text-center">{booking.time}</div>
                            <div className="w-px h-10 bg-zinc-800 hidden sm:block"></div>
                            <div>
                              <div className="font-bold text-lg text-white">{booking.guestName}</div>
                              <div className="text-sm text-zinc-400">{booking.serviceName}</div>
                            </div>
                          </div>
                          <div className="flex flex-col sm:items-end">
                            <div className="text-zinc-300 font-bold">{booking.price.toLocaleString('hu-HU')} Ft</div>
                            <div className="text-xs text-zinc-500">{booking.guestPhone}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* --- 2. FOGLALÁSOK (ÚJ ADMIN DIZÁJN) --- */}
            {activeTab === 'bookings' && (
              <div className="flex flex-col gap-10">
                <h2 className="text-xl md:text-2xl font-bold uppercase flex items-center gap-3 mb-2">
                  <Calendar className="text-red-500" /> Közelgő Időpontok
                </h2>
                
                {allUpcomingBookings.length === 0 ? (
                  <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 text-center text-zinc-500 backdrop-blur-sm">
                    Nincsenek jövőbeli foglalások.
                  </div>
                ) : (
                  <div className="flex flex-col gap-10">
                    {/* Hónapok szerinti iterálás */}
                    {Object.entries(groupedUpcoming).map(([monthTitle, bookings]) => (
                      <div key={monthTitle}>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-600 mb-5 pb-1 border-b border-zinc-800/60">
                          {monthTitle}
                        </h3>
                        <div className="flex flex-col gap-4">
                          {bookings.map((booking) => {
                            const { dayNumStr, dayNameShort, dayNameLong } = formatBookingDate(booking.date)
                            return (
                              <div key={booking.id} className={`bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-red-500/30 transition-colors`}>
                                 <div className="flex items-center gap-5 md:gap-6">
                                   <div className={`flex flex-col items-center justify-center bg-zinc-950/80 border border-zinc-800/80 rounded-xl w-16 h-16 flex-shrink-0 shadow-inner px-2`}>
                                      <span className="text-zinc-500 text-[10px] font-medium mb-0.5 uppercase tracking-widest">{dayNameShort}</span>
                                      <span className="text-xl font-extrabold text-white tracking-tighter">{dayNumStr}</span>
                                   </div>
                                   <div className="flex flex-col justify-center flex-1">
                                     <div className="flex items-center gap-2 mb-1.5">
                                        <span className="text-zinc-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">{dayNameLong} • {booking.time}</span>
                                     </div>
                                     <div className="text-base md:text-lg font-bold text-white mb-0.5 tracking-tight line-clamp-1">{booking.guestName}</div>
                                     <div className="text-zinc-500 text-xs font-medium">{booking.serviceName}</div>
                                   </div>
                                 </div>
                                 <div className="flex items-center justify-start sm:justify-end flex-shrink-0">
                                   <span className="text-sm font-bold text-zinc-300">{booking.price.toLocaleString('hu-HU')} Ft</span>
                                 </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Lemondott foglalások Admin nézet */}
                {cancelledBookings.length > 0 && (
                  <div className="mt-6">
                    <h2 className="text-xl md:text-2xl font-extrabold uppercase tracking-tight flex items-center gap-4 text-white mb-6">
                      <XCircle className="text-red-500" size={26} /> Lemondott foglalások
                    </h2>
                    <div className="bg-zinc-900/30 border border-red-950/20 rounded-3xl overflow-hidden backdrop-blur-sm shadow-inner">
                      {cancelledBookings.map((booking, index) => {
                        const { monthLong, dayNumStr } = formatBookingDate(booking.date)
                        return (
                          <div key={booking.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 md:p-6 ${index !== cancelledBookings.length - 1 ? 'border-b border-zinc-800/50' : ''}`}>
                            <div className="flex items-center gap-4 flex-1 mb-3 sm:mb-0">
                              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-red-500/10 text-red-500">
                                <XCircle size={20} />
                              </div>
                              <div>
                                <div className="font-bold text-sm md:text-base mb-1 text-zinc-500 line-through line-clamp-1">{booking.guestName}</div>
                                <div className="text-xs text-zinc-500 font-medium uppercase tracking-widest">{monthLong} {dayNumStr}. • {booking.time} ({booking.serviceName})</div>
                              </div>
                            </div>
                            <div className="text-xs font-bold uppercase tracking-widest text-red-500 px-3 py-1 bg-red-950/40 rounded-full inline-flex sm:block text-center w-max">Lemondva</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* VENDÉGEK */}
            {activeTab === 'guests' && (
              <div>
                <h2 className="text-xl md:text-2xl font-bold uppercase mb-6 flex items-center gap-3"><Users className="text-red-500" /> Vendég Adatbázis</h2>
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 text-center text-zinc-500 backdrop-blur-sm">A vendégkártyák és statisztikák ide fognak kerülni.</div>
              </div>
            )}

            {/* SZOLGÁLTATÁSOK */}
            {activeTab === 'services' && (
              <div>
                <h2 className="text-xl md:text-2xl font-bold uppercase mb-6 flex items-center gap-3"><Scissors className="text-red-500" /> Szolgáltatások</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                   {initialServices.length === 0 ? (
                      <div className="col-span-full bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 text-center text-zinc-500 backdrop-blur-sm">Még nincsenek szolgáltatások rögzítve.</div>
                   ) : (
                      initialServices.map((service) => (
                        <div key={service.id} className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 hover:border-red-500/30 transition-colors group">
                            <div className="flex justify-between items-start mb-4">
                              <span className="font-bold uppercase text-sm">{service.name}</span>
                              <div className="flex items-center gap-3">
                                <span className="text-zinc-500 text-xs bg-zinc-800 px-2 py-1 rounded-md">{service.durationMins} perc</span>
                                <button onClick={() => handleDeleteService(service.id)} className="text-zinc-600 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                              </div>
                            </div>
                            <div className="text-xl font-bold text-zinc-300">{service.price.toLocaleString('hu-HU')} Ft</div>
                            {service.description && <p className="text-xs text-zinc-500 mt-3 line-clamp-2">{service.description}</p>}
                        </div>
                      ))
                   )}
                   <button onClick={() => setIsServiceModalOpen(true)} className="border border-dashed border-zinc-700 rounded-xl p-5 flex flex-col items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-500 transition-colors min-h-[120px]">
                     <Plus size={24} className="mb-1" />
                     <span className="text-xs uppercase tracking-widest">Új Hozzáadása</span>
                   </button>
                </div>
              </div>
            )}

            {activeTab === 'schedules' && (
              <div>
                <h2 className="text-xl md:text-2xl font-bold uppercase mb-6 flex items-center gap-3"><Clock className="text-red-500" /> Munkaidő</h2>
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 text-center text-zinc-500 backdrop-blur-sm">Itt állíthatod be a munkaidődet.</div>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {/* MOBIL ALSÓ NAVIGÁCIÓ */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-800 z-40 px-1 py-2 flex justify-between items-center safe-area-pb">
        {menuItems.map((item) => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex-1 flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-all duration-300 ${activeTab === item.id ? 'text-red-400' : 'text-zinc-500 hover:text-zinc-300'}`}>
            <item.icon size={20} />
            <span className="text-[9px] font-bold uppercase tracking-widest mt-0.5 truncate w-full text-center">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* MODAL */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <h3 className="text-lg font-bold uppercase tracking-widest text-white">Új Szolgáltatás</h3>
              <button onClick={() => setIsServiceModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors"><X size={20} /></button>
            </div>
            <form action={handleAddService} className="p-6 flex flex-col gap-4">
              {serviceError && <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs font-bold uppercase tracking-widest p-3 rounded-lg text-center">{serviceError}</div>}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">Megnevezés</label>
                <input type="text" name="name" required placeholder="pl. Hajvágás" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">Időtartam (perc)</label>
                  <input type="number" name="durationMins" required placeholder="pl. 45" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">Ár (Ft)</label>
                  <input type="number" name="price" required placeholder="pl. 5000" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">Leírás (opcionális)</label>
                <textarea name="description" rows={2} placeholder="Rövid ismertető..." className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors resize-none"></textarea>
              </div>
              <button type="submit" disabled={isSubmitting} className="mt-2 w-full bg-red-600 hover:bg-red-500 text-white font-bold uppercase tracking-widest text-sm py-4 rounded-xl transition-colors disabled:opacity-50">
                {isSubmitting ? 'Mentés folyamatban...' : 'Szolgáltatás Mentése'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}