'use client'

import { useState, useEffect } from 'react'
import { LayoutDashboard, TrendingUp, CheckCircle2 } from 'lucide-react'
import { TodayBooking } from '../types'

interface Props {
  todayRevenue: number
  todayCount: number
  todayBookings: TodayBooking[]
  isCancelling: string | null
  onCancelBooking: (id: string) => void
}

export default function OverviewTab({ todayRevenue, todayCount, todayBookings, isCancelling, onCancelBooking }: Props) {
  const [now, setNow] = useState(new Date())

  // Belső óra: percenként frissít, hogy a 45 perc leteltekor azonnal átugorjon a vendég a teljesítettek közé
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  // Kalkuláció: Megnézzük, hogy az adott időpont + 45 perc a múltban van-e már
  const isCompleted = (timeStr: string) => {
    if (!timeStr) return false;
    const [h, m] = timeStr.split(':').map(Number);
    const bookingEndTime = new Date();
    bookingEndTime.setHours(h, m + 45, 0, 0);
    return bookingEndTime < now;
  }

  const upcomingBookings = todayBookings.filter(b => !isCompleted(b.time))
  const completedBookings = todayBookings.filter(b => isCompleted(b.time))

  return (
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

      <div className="flex flex-col gap-8 mt-4">
        {/* 1. AKTÍV / HÁTRALÉVŐ FOGLALÁSOK */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-4 border-b border-zinc-800 pb-2">Mai Beosztásod</h3>
          {upcomingBookings.length === 0 ? (
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 text-center text-zinc-500 backdrop-blur-sm">
              Nincs több hátralévő vendéged mára.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {upcomingBookings.map((booking) => (
                <div key={booking.id} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-5">
                    <div className="text-2xl font-black text-red-500 w-16 text-center">{booking.time}</div>
                    <div className="w-px h-10 bg-zinc-800 hidden sm:block"></div>
                    <div>
                      <div className="font-bold text-lg text-white">{booking.guestName}</div>
                      <div className="text-sm text-zinc-400">{booking.serviceName}</div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:items-end gap-1">
                    <div className="text-zinc-300 font-bold">{booking.price.toLocaleString('hu-HU')} Ft</div>
                    <div className="text-xs text-zinc-500">{booking.guestPhone}</div>
                    <button onClick={() => onCancelBooking(booking.id)} disabled={isCancelling === booking.id} className="text-red-500/70 hover:text-red-400 text-[10px] font-bold uppercase tracking-widest transition-colors mt-1 disabled:opacity-50">
                      {isCancelling === booking.id ? 'Folyamatban...' : 'Időpont Lemondása'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. TELJESÍTETT FOGLALÁSOK */}
        {completedBookings.length > 0 && (
          <div className="opacity-60 hover:opacity-100 transition-opacity duration-300">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-4 border-b border-zinc-800 pb-2 flex items-center gap-2">
              <CheckCircle2 size={16} /> Mai Teljesített Foglalások
            </h3>
            <div className="flex flex-col gap-3">
              {completedBookings.map((booking) => (
                <div key={booking.id} className="bg-zinc-950 border border-zinc-800/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 grayscale">
                  <div className="flex items-center gap-5">
                    <div className="text-xl font-bold text-zinc-600 w-16 text-center">{booking.time}</div>
                    <div className="w-px h-8 bg-zinc-800 hidden sm:block"></div>
                    <div>
                      <div className="font-bold text-md text-zinc-400">{booking.guestName}</div>
                      <div className="text-xs text-zinc-500">{booking.serviceName}</div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:items-end gap-1">
                    <div className="text-zinc-500 font-bold">{booking.price.toLocaleString('hu-HU')} Ft</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-green-500/50 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-sm mt-1">Teljesítve</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}