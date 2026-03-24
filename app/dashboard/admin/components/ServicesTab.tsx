'use client'

import { Scissors, Trash2, Plus } from 'lucide-react'
import { Service } from '../types'

interface Props {
  services: Service[]
  onDeleteService: (id: string) => void
  onOpenServiceModal: () => void
}

export default function ServicesTab({ services, onDeleteService, onOpenServiceModal }: Props) {
  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold uppercase mb-6 flex items-center gap-3"><Scissors className="text-red-500" /> Szolgáltatások</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.length === 0 ? (
            <div className="col-span-full bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 text-center text-zinc-500 backdrop-blur-sm">Még nincsenek szolgáltatások rögzítve.</div>
          ) : (
            services.map((service) => (
              <div key={service.id} className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 hover:border-red-500/30 transition-colors group">
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-bold uppercase text-sm">{service.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-zinc-500 text-xs bg-zinc-800 px-2 py-1 rounded-md">{service.durationMins} perc</span>
                      <button onClick={() => onDeleteService(service.id)} className="text-zinc-600 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-zinc-300">{service.price.toLocaleString('hu-HU')} Ft</div>
                  {service.description && <p className="text-xs text-zinc-500 mt-3 line-clamp-2">{service.description}</p>}
              </div>
            ))
          )}
          <button onClick={onOpenServiceModal} className="border border-dashed border-zinc-700 rounded-xl p-5 flex flex-col items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-500 transition-colors min-h-[120px]">
            <Plus size={24} className="mb-1" />
            <span className="text-xs uppercase tracking-widest">Új Hozzáadása</span>
          </button>
      </div>
    </div>
  )
}