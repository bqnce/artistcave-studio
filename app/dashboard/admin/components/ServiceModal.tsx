'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { motion } from 'framer-motion'
import { createService } from '@/app/actions/services'

export default function ServiceModal({ onClose }: { onClose: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serviceError, setServiceError] = useState('')

  async function handleAddService(formData: FormData) {
    setIsSubmitting(true)
    setServiceError('')
    const res = await createService(formData)
    setIsSubmitting(false)
    if (res.success) onClose()
    else setServiceError(res.error || 'Hiba történt.')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.95}} className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <h3 className="text-lg font-bold uppercase tracking-widest text-white">Új Szolgáltatás</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors"><X size={20} /></button>
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
      </motion.div>
    </div>
  )
}