'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Scissors, X } from 'lucide-react'
import { createService, updateService } from '@/app/actions/services'
import { Service } from '../types'

interface Props {
  onClose: () => void;
  serviceToEdit?: Service; // Ha ezt megkapja, akkor szerkesztő módban indul
}

export default function ServiceModal({ onClose, serviceToEdit }: Props) {
  const [name, setName] = useState(serviceToEdit?.name || "")
  const [durationMins, setDurationMins] = useState(serviceToEdit?.durationMins.toString() || "30")
  const [price, setPrice] = useState(serviceToEdit?.price.toString() || "5000")
  const [description, setDescription] = useState(serviceToEdit?.description || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEditing = !!serviceToEdit;

  async function handleSubmit() {
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData()
    formData.append('name', name)
    formData.append('durationMins', durationMins)
    formData.append('price', price)
    formData.append('description', description)

    let res;
    if (isEditing) {
      res = await updateService(serviceToEdit.id, formData);
    } else {
      res = await createService(formData);
    }
    
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
        className="w-full max-w-md bg-zinc-950 border border-zinc-800/60 rounded-[2rem] shadow-2xl p-6 md:p-8"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Scissors className="text-red-500" /> {isEditing ? 'Szolgáltatás Szerkesztése' : 'Új Szolgáltatás'}
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-xs rounded-xl font-bold uppercase tracking-widest text-center">{error}</div>}

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Megnevezés</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="pl. Prémium Hajvágás" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Időtartam (perc)</label>
              <input type="number" value={durationMins} onChange={e => setDurationMins(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Ár (Ft)</label>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Leírás (opcionális)</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none resize-none"></textarea>
          </div>

          <button 
            onClick={handleSubmit} 
            disabled={!name || !durationMins || !price || isSubmitting} 
            className="w-full mt-4 bg-red-600 hover:bg-red-500 text-white font-bold uppercase tracking-widest text-xs py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Mentés...' : (isEditing ? 'Módosítások Mentése' : 'Létrehozás')}
          </button>
        </div>
      </motion.div>
    </div>
  )
}