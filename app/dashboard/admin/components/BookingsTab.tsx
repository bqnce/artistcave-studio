'use client'

import { Calendar, Plus, XCircle } from 'lucide-react'
import { UpcomingBooking } from '../types'

interface Props {
  allUpcomingBookings: UpcomingBooking[]
  cancelledBookings: UpcomingBooking[]
  isCancelling: string | null
  onCancelBooking: (id: string) => void
  onOpenBookingModal: () => void
}

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

export default function BookingsTab({ allUpcomingBookings, cancelledBookings, isCancelling, onCancelBooking, onOpenBookingModal }: Props) {
  const groupedUpcoming = allUpcomingBookings.reduce((acc, booking) => {
    const d = new Date(booking.date);
    const monthTitle = `${monthNamesHuLong[d.getMonth()]} ${d.getFullYear()}`;
    if (!acc[monthTitle]) acc[monthTitle] = [];
    acc[monthTitle].push(booking);
    return acc;
  }, {} as Record<string, UpcomingBooking[]>);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/60 pb-6">
          <h2 className="text-xl md:text-2xl font-bold uppercase flex items-center gap-3">
              <Calendar className="text-red-500" /> Közelgő Időpontok
          </h2>
          <button onClick={onOpenBookingModal} className="bg-red-600 hover:bg-red-500 text-white px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
            <Plus size={18} /> Manuális Rögzítés
          </button>
      </div>
      
      {allUpcomingBookings.length === 0 ? (
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 text-center text-zinc-500 backdrop-blur-sm">
          Nincsenek jövőbeli foglalások.
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {Object.entries(groupedUpcoming).map(([monthTitle, bookings]) => (
            <div key={monthTitle}>
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-600 mb-5 pb-1 border-b border-zinc-800/60">{monthTitle}</h3>
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
                       <div className="flex flex-col sm:items-end justify-center flex-shrink-0 gap-2">
                         <span className="text-sm font-bold text-zinc-300">{booking.price.toLocaleString('hu-HU')} Ft</span>
                         <button onClick={() => onCancelBooking(booking.id)} disabled={isCancelling === booking.id} className="text-red-500/70 hover:text-red-400 text-[10px] font-bold uppercase tracking-widest transition-colors disabled:opacity-50">
                           {isCancelling === booking.id ? 'Folyamatban...' : 'Törlés'}
                         </button>
                       </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

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
  )
}