'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react'
import { UpcomingBooking, TimeBlock } from '../types'
import { deleteTimeBlock } from '@/app/actions/schedules'

interface Props {
  timeBlocks: TimeBlock[]
  allUpcomingBookings: UpcomingBooking[]
  onOpenBookingModal: () => void
  onOpenTimeBlockModal: (date: Date) => void
}

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8) // 8:00 - 20:00

export default function SchedulesTab({ timeBlocks, allUpcomingBookings, onOpenBookingModal, onOpenTimeBlockModal }: Props) {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const prevDay = () => { const d = new Date(selectedDate); d.setDate(d.getDate() - 1); setSelectedDate(d); }
  const nextDay = () => { const d = new Date(selectedDate); d.setDate(d.getDate() + 1); setSelectedDate(d); }
  
  const isSameDay = (d1: string | Date, d2: Date) => {
    const date1 = new Date(d1);
    return date1.getFullYear() === d2.getFullYear() && date1.getMonth() === d2.getMonth() && date1.getDate() === d2.getDate()
  }

  // Szűrés a kiválasztott napra
  const dayBookings = allUpcomingBookings.filter(b => isSameDay(b.date, selectedDate))
  const dayBlocks = timeBlocks.filter(b => isSameDay(b.start, selectedDate))

  async function handleDeleteBlock(id: string) {
    if(confirm('Biztosan törlöd ezt a blokkolást/szabadságot?')) {
      await deleteTimeBlock(id)
    }
  }

  return (
    <div className="flex flex-col h-full bg-zinc-900/20 rounded-3xl border border-zinc-800/50 overflow-hidden">
      
      {/* Naptár Fejléc */}
      <div className="flex items-center justify-between p-6 border-b border-zinc-800/80 bg-zinc-950/50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button onClick={prevDay} className="p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors"><ChevronLeft size={20} /></button>
          <div className="text-lg font-bold uppercase tracking-widest text-white">
            {selectedDate.toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
          </div>
          <button onClick={nextDay} className="p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors"><ChevronRight size={20} /></button>
        </div>
        
        <div className="flex gap-3">
          <button onClick={() => onOpenTimeBlockModal(selectedDate)} className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-bold text-zinc-300 hover:text-white hover:border-zinc-600 transition-all uppercase tracking-widest">
            Szabadság / Blokkolás
          </button>
          <button onClick={onOpenBookingModal} className="flex items-center gap-2 px-4 py-2 bg-red-600/20 border border-red-500/50 rounded-lg text-xs font-bold text-red-500 hover:bg-red-600 hover:text-white transition-all uppercase tracking-widest">
            <Plus size={16} /> Új Vendég
          </button>
        </div>
      </div>

      {/* Idővonal (Timeline) Rács */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative bg-zinc-950/30">
        <div className="relative min-h-[800px] w-full pb-10">
          
          {/* Háttér rács */}
          {HOURS.map(hour => (
            <div key={hour} className="flex absolute w-full border-t border-zinc-800/50" style={{ top: `${(hour - 8) * 60}px`, height: '60px' }}>
              <div className="w-16 text-right pr-4 pt-2 text-xs font-bold text-zinc-600 border-r border-zinc-800/50 bg-zinc-950/50">
                {hour}:00
              </div>
              <div className="flex-1 group hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => onOpenBookingModal()}></div>
            </div>
          ))}

          {/* VENDÉG FOGLALÁSOK RENDERELÉSE */}
          {dayBookings.map(booking => {
            const [h, m] = booking.time.split(':').map(Number);
            const top = (h - 8) * 60 + m;
            return (
              <div 
                key={booking.id} 
                className="absolute left-[70px] right-4 bg-zinc-800/90 border-l-4 border-red-500 rounded-r-xl p-3 shadow-lg flex flex-col justify-center overflow-hidden hover:bg-zinc-700/90 transition-colors cursor-default"
                style={{ top: `${top}px`, height: '58px', zIndex: 10 }}
              >
                <span className="text-xs font-bold text-white line-clamp-1">{booking.guestName}</span>
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest line-clamp-1">{booking.serviceName} • {booking.time}</span>
              </div>
            )
          })}

          {/* SZABADSÁGOK / BLOKKOK RENDERELÉSE */}
          {dayBlocks.map(block => {
            const startDate = new Date(block.start);
            const endDate = new Date(block.end);
            const startH = startDate.getHours();
            const startM = startDate.getMinutes();
            const top = (startH - 8) * 60 + startM;
            const durationMins = (endDate.getTime() - startDate.getTime()) / 60000;
            
            return (
              <div 
                key={block.id} 
                className="absolute left-[70px] right-4 bg-zinc-950/80 border border-zinc-800 rounded-xl p-3 flex flex-col justify-center items-center backdrop-blur-sm group"
                style={{ top: `${top}px`, height: `${durationMins}px`, zIndex: 5 }}
              >
                {/* Sraffozott (csíkos) minta a háttérben, ami a Google Naptár stílust hozza */}
                <div className="absolute inset-0 opacity-20 rounded-xl" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #ef4444 10px, #ef4444 20px)' }}></div>
                
                <span className="text-xs font-black text-zinc-400 uppercase tracking-widest relative z-10 bg-zinc-950 px-2 rounded-md">{block.title}</span>
                <button onClick={() => handleDeleteBlock(block.id)} className="absolute top-2 right-2 text-zinc-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all z-20">
                  <Trash2 size={16} />
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}