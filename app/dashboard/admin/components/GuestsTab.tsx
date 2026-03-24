'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, X } from 'lucide-react'
import { UserData } from '../types'

interface Props {
  users: UserData[]
}

export default function GuestsTab({ users }: Props) {
  const [guestSearch, setGuestSearch] = useState("")
  const [selectedGuest, setSelectedGuest] = useState<UserData | null>(null)

  return (
    <div className="flex flex-col gap-10">
      
      {/* FEJLÉC ÉS KERESŐ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-zinc-800/80 pb-6">
        <h2 className="text-xl md:text-2xl font-bold uppercase flex items-center gap-3">
          <Users className="text-red-500" /> Vendég Adatbázis
        </h2>
        <div className="relative w-full sm:w-72">
          <input 
            type="text" 
            placeholder="Keresés név vagy e-mail alapján..." 
            value={guestSearch}
            onChange={(e) => setGuestSearch(e.target.value)}
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>
      </div>

      {/* KÁRTYÁK GRIDJE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users
          .filter(u => 
            (u.name?.toLowerCase().includes(guestSearch.toLowerCase()) || 
            u.email.toLowerCase().includes(guestSearch.toLowerCase()))
          )
          .map(user => (
          <button 
            key={user.id}
            onClick={() => setSelectedGuest(user)}
            className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6 text-left hover:border-red-500/50 hover:bg-zinc-900/80 transition-all duration-300 group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Users size={64} className="text-red-500" />
            </div>
            
            <div className="flex items-center gap-4 mb-5 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 font-black text-lg border border-red-500/20">
                {user.name ? user.name.charAt(0).toUpperCase() : '?'}
              </div>
              <div>
                <h3 className="font-bold text-white text-base line-clamp-1">{user.name || 'Névtelen Vendég'}</h3>
                <p className="text-xs text-zinc-500">{user.email}</p>
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-zinc-500 border-t border-zinc-800/60 pt-4 relative z-10">
              <span className="text-red-400">{user.appointments.length} foglalás</span>
              <span>Csatlakozott: {user.createdAt.split('T')[0]}</span>
            </div>
          </button>
        ))}
        
        {users.length === 0 && (
          <div className="col-span-full text-center text-zinc-500 py-10 bg-zinc-900/20 rounded-2xl border border-zinc-800/50">
            Még nincsenek regisztrált vendégek.
          </div>
        )}
      </div>

      {/* VENDÉG RÉSZLETEK MODAL */}
      <AnimatePresence>
        {selectedGuest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="w-full max-w-2xl max-h-[90vh] bg-zinc-950 border border-zinc-800/60 rounded-[2rem] shadow-2xl flex flex-col relative overflow-hidden"
            >
              <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-zinc-800/60 bg-zinc-950/50 backdrop-blur-xl z-20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 font-black text-xl border border-red-500/20">
                    {selectedGuest.name ? selectedGuest.name.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedGuest.name || 'Névtelen'}</h2>
                    <div className="text-xs text-zinc-500 flex gap-3 mt-0.5">
                      <span>{selectedGuest.email}</span>
                      {selectedGuest.phone && <span>• {selectedGuest.phone}</span>}
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedGuest(null)} className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4">Korábbi és Jövőbeli Foglalások</h3>
                
                {selectedGuest.appointments.length === 0 ? (
                  <div className="text-center text-zinc-600 py-10 bg-zinc-900/30 rounded-2xl border border-zinc-800/50 text-sm font-bold uppercase tracking-widest">
                    A vendégnek nincsenek foglalásai.
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {selectedGuest.appointments.map(app => {
                      const d = new Date(app.date);
                      const isCancelled = app.status === "CANCELLED";
                      
                      return (
                        <div key={app.id} className={`flex items-center justify-between p-4 rounded-xl border ${isCancelled ? 'bg-red-950/10 border-red-900/20 opacity-70' : 'bg-zinc-900/40 border-zinc-800/60 hover:border-zinc-700'}`}>
                          <div>
                            <div className={`font-bold text-sm mb-1 ${isCancelled ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>
                              {app.serviceName}
                            </div>
                            <div className="text-xs font-bold tracking-widest uppercase text-zinc-500">
                              {d.getFullYear()}. {(d.getMonth() + 1).toString().padStart(2, '0')}. {d.getDate().toString().padStart(2, '0')}. • {d.getHours().toString().padStart(2, '0')}:{d.getMinutes().toString().padStart(2, '0')}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className={`text-sm font-bold ${isCancelled ? 'text-zinc-600' : 'text-zinc-300'}`}>
                              {app.price.toLocaleString('hu-HU')} Ft
                            </span>
                            {isCancelled ? (
                              <span className="text-[9px] font-black uppercase tracking-widest text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">Lemondva</span>
                            ) : (
                              <span className="text-[9px] font-black uppercase tracking-widest text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">Aktív / Teljesített</span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}