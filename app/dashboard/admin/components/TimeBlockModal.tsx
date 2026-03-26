'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, CalendarOff } from 'lucide-react'
import { createTimeBlock } from '@/app/actions/schedules'

interface Props {
  onClose: () => void;
  selectedDate: Date;
}

export default function TimeBlockModal({ onClose, selectedDate }: Props) {
  const [title, setTitle] = useState("Szabadság / Szünet")
  const [startTime, setStartTime] = useState("12:00")
  const [endTime, setEndTime] = useState("13:00")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const dateStr = selectedDate.toISOString().split('T')[0];

  async function handleSubmit() {
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData()
    formData.append('title', title)
    // Összerakjuk a pontos dátumot és időt
    formData.append('start', new Date(`${dateStr}T${startTime}`).toISOString())
    formData.append('end', new Date(`${dateStr}T${endTime}`).toISOString())

    const res = await createTimeBlock(formData)
    
    if (res.success) {
      onClose()
    } else {
      setError(res.error || "Hiba történt.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-zinc-950/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        className="w-full max-w-md bg-zinc-950 border border-zinc-800/60 rounded-[2rem] shadow-2xl p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CalendarOff className="text-red-500" /> Idősáv Blokkolása
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-xs rounded-xl font-bold uppercase tracking-widest text-center">{error}</div>}

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Megnevezés</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Kezdés</label>
              <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Befejezés</label>
              <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none" />
            </div>
          </div>

          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting} 
            className="w-full mt-4 bg-red-600 hover:bg-red-500 text-white font-bold uppercase tracking-widest text-xs py-4 rounded-xl transition-all"
          >
            {isSubmitting ? 'Mentés...' : 'Blokkolás Létrehozása'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}