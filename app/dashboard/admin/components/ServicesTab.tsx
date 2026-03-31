'use client'

import { Scissors, Plus, Trash2 } from 'lucide-react'
import { Edit02Icon } from 'hugeicons-react'
import { Service } from '../types'

interface Props {
  services: Service[]
  onOpenModal: () => void
  onEditService: (service: Service) => void // Új prop a szerkesztéshez
  onDelete: (id: string) => void
  isDeleting: string | null
}

export default function ServicesTab({ services, onOpenModal, onEditService, onDelete, isDeleting }: Props) {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-bold uppercase flex items-center gap-3"><Scissors className="text-red-500" /> Szolgáltatások</h2>
        <button onClick={onOpenModal} className="bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/20">
          <Plus size={16} /> Új Hozzáadása
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.length === 0 ? (
          <div className="col-span-full bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 text-center text-zinc-500 backdrop-blur-sm">Nincsenek még szolgáltatások rögzítve.</div>
        ) : (
          services.map(service => (
            <div key={service.id} className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6 flex flex-col justify-between group hover:border-zinc-700 transition-colors">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-red-500/10 text-red-500 rounded-xl"><Scissors size={20} /></div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onEditService(service)} 
                      className="p-2 text-zinc-400 hover:text-blue-400 transition-colors"
                      title="Szerkesztés"
                    >
                      <Edit02Icon size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete(service.id)} 
                      disabled={isDeleting === service.id} 
                      className="p-2 text-zinc-400 hover:text-red-500 transition-colors disabled:opacity-50"
                      title="Törlés"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{service.name}</h3>
                <p className="text-xs text-zinc-500 line-clamp-2 min-h-[32px]">{service.description || "Nincs leírás."}</p>
              </div>
              <div className="mt-5 pt-4 border-t border-zinc-800 flex justify-between items-center">
                <span className="text-sm font-bold text-zinc-300">{service.durationMins} perc</span>
                <span className="text-lg font-black text-red-400">{service.price.toLocaleString('hu-HU')} Ft</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}