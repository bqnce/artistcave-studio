'use client'

import { LayoutDashboard, TrendingUp } from 'lucide-react'
import { TodayBooking } from '../types'

interface Props {
  todayRevenue: number
  todayCount: number
  todayBookings: TodayBooking[]
  isCancelling: string | null
  onCancelBooking: (id: string) => void
}

export default function OverviewTab({ todayRevenue, todayCount, todayBookings, isCancelling, onCancelBooking }: Props) {
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
    </div>
  )
}