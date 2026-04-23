'use client'

import Link from 'next/link'
import { Calendar, ChevronRight, MapPin, XCircle, CheckCircle2 } from 'lucide-react'
import { BookingData } from '../types'
import { formatBookingDate } from '../utils'

interface Props {
  upcomingBookings: BookingData[]
  pastBookings: BookingData[]
  isCancelling: string | null
  onCancel: (id: string) => void
}

export default function BookingsTab({ upcomingBookings, pastBookings, isCancelling, onCancel }: Props) {
  // Logika: Csoportosítás és szűrés
  const groupedUpcoming = upcomingBookings.reduce((acc, booking) => {
    const date = new Date(booking.date);
    const monthNamesHuLong = ["Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"];
    const monthTitle = `${monthNamesHuLong[date.getMonth()]} ${date.getFullYear()}`;
    
    if (!acc[monthTitle]) acc[monthTitle] = [];
    acc[monthTitle].push(booking);
    return acc;
  }, {} as Record<string, BookingData[]>);

  const absoluteFirstUpcomingId = upcomingBookings[0]?.id;
  const actualAttendedPast = pastBookings.filter(b => b.status !== "CANCELLED");
  const actualCancelledPast = pastBookings.filter(b => b.status === "CANCELLED");

  return (
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

      {/* --- KÖVETKEZŐ IDŐPONTOK --- */}
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
                                  <MapPin size={14} className="text-zinc-600" /> Egyetem út 1. E/7 mélyföldszint (dohánybolt mellett), Miskolc, Hungary, 3515
                               </div>
                             </div>
                           </div>

                           <div className="flex flex-row sm:flex-col gap-2 sm:min-w-[130px] flex-shrink-0">
                              <button 
                                onClick={() => onCancel(booking.id)}
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

      {/* --- LEMONDOTT FOGLALÁSOK --- */}
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
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-red-500/10 text-red-500">
                      <XCircle size={20} />
                    </div>
                    <div>
                      <div className="font-bold text-sm md:text-base mb-1 text-zinc-500 line-through line-clamp-1">{booking.serviceName}</div>
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

      {/* --- ELŐZMÉNYEK --- */}
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
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-zinc-800/50 text-green-500/70">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <div className="font-bold text-sm md:text-base mb-1 text-zinc-200 line-clamp-1">{booking.serviceName}</div>
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
  )
}