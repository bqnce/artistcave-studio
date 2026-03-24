'use client'

import { User } from 'lucide-react'

interface Props {
  userName: string
  userEmail: string
  userPhone: string
}

export default function ProfileTab({ userName, userEmail, userPhone }: Props) {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-zinc-800/80 pb-6 mb-2">
        <h2 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight flex items-center gap-4 text-white">
          <User className="text-indigo-400" size={26} /> Profilom
        </h2>
      </div>
      <div className="bg-gradient-to-br from-zinc-900/80 to-indigo-950/40 border border-zinc-800/60 rounded-3xl p-7 md:p-10 backdrop-blur-xl shadow-2xl shadow-black/20">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            <div>
              <span className="text-zinc-600 uppercase tracking-widest text-[11px] font-bold block mb-2.5 ml-1">Teljes Név</span>
              <div className="text-base font-medium text-white bg-zinc-950/60 border border-zinc-800/60 rounded-2xl px-5 py-4 shadow-inner">{userName || 'Nincs megadva'}</div>
            </div>
            <div>
              <span className="text-zinc-600 uppercase tracking-widest text-[11px] font-bold block mb-2.5 ml-1">E-mail Cím</span>
              <div className="text-base font-medium text-zinc-500 bg-zinc-950/60 border border-zinc-800/60 rounded-2xl px-5 py-4 shadow-inner cursor-not-allowed">{userEmail}</div>
            </div>
            <div>
              <span className="text-zinc-600 uppercase tracking-widest text-[11px] font-bold block mb-2.5 ml-1">Telefonszám</span>
              <div className="text-base font-medium text-white bg-zinc-950/60 border border-zinc-800/60 rounded-2xl px-5 py-4 shadow-inner">{userPhone || 'Nincs megadva'}</div>
            </div>
         </div>
         <div className="mt-10 pt-8 border-t border-zinc-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs text-zinc-500 max-w-sm">Az e-mail cím vagy a jelszó módosításához biztonsági okokból kérlek vedd fel velünk a kapcsolatot.</p>
            <button className="bg-zinc-100 text-zinc-950 hover:bg-white px-7 py-3.5 rounded-xl text-[13px] font-bold uppercase tracking-widest transition-all hover:scale-[1.02] shadow-lg flex-shrink-0">
              Adatok Frissítése
            </button>
         </div>
      </div>
    </div>
  )
}