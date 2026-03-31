'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar01Icon, Cancel01Icon } from 'hugeicons-react'
import { createTimeBlock } from '@/app/actions/schedules'

interface Props {
  onClose: () => void;
  selectedDate: Date;
}

export default function TimeBlockModal({ onClose, selectedDate }: Props) {
  const [title, setTitle] = useState("Ebédszünet / Szabadság")
  const [startTime, setStartTime] = useState("12:00")
  const [endTime, setEndTime] = useState("13:00")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // A kiválasztott naptári nap stringgé alakítása (pl: 2026-03-24)
  const pad = (n: number) => String(n).padStart(2, '0')
  const dateStr = `${selectedDate.getFullYear()}-${pad(selectedDate.getMonth() + 1)}-${pad(selectedDate.getDate())}`
  
  async function handleSubmit() {
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData()
    formData.append('title', title)
    // Pontos ISO dátum összerakása a backend számára
    formData.append('start', new Date(`${dateStr}T${startTime}`).toISOString())
    formData.append('end', new Date(`${dateStr}T${endTime}`).toISOString())

    const res = await createTimeBlock(formData)
    
    if (res.success) {
      onClose() // Sikeres mentésnél bezárjuk az ablakot (a cache frissül, megjelenik a rácson)
    } else {
      // Itt kapjuk meg az általad megírt backend hibaüzeneteket!
      setError(res.error || "Hiba történt a blokkolás során.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-zinc-950/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        className="w-full max-w-md bg-zinc-950 border border-zinc-800/60 rounded-[2rem] shadow-2xl p-6 md:p-8"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <Calendar01Icon size={24} className="text-red-500" /> Idő Blokkolása
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <Cancel01Icon size={24} />
          </button>
        </div>

        {/* Backend Hibaüzenet Megjelenítése */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-500 text-xs rounded-xl font-bold uppercase tracking-widest text-center leading-relaxed">
            {error}
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Megnevezés</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 text-white font-medium focus:border-red-500 focus:outline-none transition-colors" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Kezdés</label>
              <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 text-white font-medium focus:border-red-500 focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Befejezés</label>
              <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 text-white font-medium focus:border-red-500 focus:outline-none transition-colors" />
            </div>
          </div>

          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !startTime || !endTime} 
            className="w-full mt-4 bg-red-600 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(239,68,68,0.2)]"
          >
            {isSubmitting ? 'Mentés...' : 'Blokkolás Mentése'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}