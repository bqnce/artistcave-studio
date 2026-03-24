'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cancelBooking } from '@/app/actions/bookings'
import { deleteService } from '@/app/actions/services'
import { Users, Clock, X } from 'lucide-react'

import { AdminDashboardProps, TabType, UserData } from './types'
import { AdminSidebar, AdminMobileHeader, AdminMobileNav } from './components/Navigation'
import OverviewTab from './components/OverviewTab'
import BookingsTab from './components/BookingsTab'
import ServicesTab from './components/ServicesTab'
import ServiceModal from './components/ServiceModal'
import BookingModal from './components/BookingModal'
import GuestsTab from './components/GuestsTab'

export default function AdminDashboard({
  userName, initialServices, todayRevenue, todayCount, todayBookings, allUpcomingBookings, cancelledBookings, users // <-- users hozzáadva
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [isCancelling, setIsCancelling] = useState<string | null>(null)

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  // ÚJ STATE-EK A VENDÉGEKHEZ:
  const [selectedGuest, setSelectedGuest] = useState<UserData | null>(null);
  const [guestSearch, setGuestSearch] = useState("");

  async function handleCancelBooking(id: string) {
    if (!window.confirm("Biztosan lemondod a vendég időpontját? A hely azonnal felszabadul!")) return
    setIsCancelling(id)
    await cancelBooking(id)
    setIsCancelling(null)
  }

  async function handleDeleteService(id: string) {
    if (!window.confirm('Biztosan törlöd ezt a szolgáltatást?')) return
    const res = await deleteService(id)
    if (!res.success) alert(res.error)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex overflow-hidden selection:bg-red-500/30">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative pb-24 md:pb-0">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('/cave-texture.jpg')", backgroundSize: "cover" }}></div>
        <AdminMobileHeader activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="p-6 md:p-10 lg:p-16 max-w-6xl w-full mx-auto relative z-10 flex-1">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

            {activeTab === 'overview' && (
              <OverviewTab todayRevenue={todayRevenue} todayCount={todayCount} todayBookings={todayBookings} isCancelling={isCancelling} onCancelBooking={handleCancelBooking} />
            )}

            {activeTab === 'bookings' && (
              <BookingsTab allUpcomingBookings={allUpcomingBookings} cancelledBookings={cancelledBookings} isCancelling={isCancelling} onCancelBooking={handleCancelBooking} onOpenBookingModal={() => setIsBookingModalOpen(true)} />
            )}

            {activeTab === 'services' && (
              <ServicesTab services={initialServices} onDeleteService={handleDeleteService} onOpenServiceModal={() => setIsServiceModalOpen(true)} />
            )}

            {activeTab === 'guests' && (
              <GuestsTab users={users} />
            )}

            {activeTab === 'schedules' && (
              <div>
                <h2 className="text-xl md:text-2xl font-bold uppercase mb-6 flex items-center gap-3"><Clock className="text-red-500" /> Munkaidő</h2>
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 text-center text-zinc-500 backdrop-blur-sm">Itt állíthatod be a munkaidődet.</div>
              </div>
            )}

          </motion.div>
        </div>
      </main>

      <AdminMobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

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

      <AnimatePresence>
        {isServiceModalOpen && <ServiceModal onClose={() => setIsServiceModalOpen(false)} />}
        {isBookingModalOpen && (
          <BookingModal
            onClose={() => setIsBookingModalOpen(false)}
            services={initialServices}
            allUpcomingBookings={allUpcomingBookings}
          />
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 4px; }
      `}</style>
    </div>
  )
}