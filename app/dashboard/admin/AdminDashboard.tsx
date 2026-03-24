'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cancelBooking } from '@/app/actions/bookings'
import { deleteService } from '@/app/actions/services'
import { Users, Clock } from 'lucide-react'

import { AdminDashboardProps, TabType } from './types'
import { AdminSidebar, AdminMobileHeader, AdminMobileNav } from './components/Navigation'
import OverviewTab from './components/OverviewTab'
import BookingsTab from './components/BookingsTab'
import ServicesTab from './components/ServicesTab'
import ServiceModal from './components/ServiceModal'
import BookingModal from './components/BookingModal'

export default function AdminDashboard({ 
  userName, initialServices, todayRevenue, todayCount, todayBookings, allUpcomingBookings, cancelledBookings 
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [isCancelling, setIsCancelling] = useState<string | null>(null)
  
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

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
              <div>
                <h2 className="text-xl md:text-2xl font-bold uppercase mb-6 flex items-center gap-3"><Users className="text-red-500" /> Vendég Adatbázis</h2>
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 text-center text-zinc-500 backdrop-blur-sm">A vendégkártyák és statisztikák ide fognak kerülni.</div>
              </div>
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