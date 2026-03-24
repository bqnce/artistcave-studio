'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { cancelBooking } from '@/app/actions/bookings'

import { TabType, UserDashboardProps } from './types'
import { UserSidebar, UserMobileHeader, UserMobileNav } from './components/Navigation'
import BookingsTab from './components/BookingsTab'
import ProfileTab from './components/ProfileTab'

export default function UserDashboard({ userName, userEmail, userPhone, upcomingBookings, pastBookings }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('bookings')
  const [isCancelling, setIsCancelling] = useState<string | null>(null)

  async function handleCancel(id: string) {
    if (!window.confirm("Biztosan lemondod ezt az időpontot?")) return
    setIsCancelling(id)
    await cancelBooking(id)
    setIsCancelling(null)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex overflow-hidden selection:bg-indigo-400/20">
      
      <UserSidebar activeTab={activeTab} setActiveTab={setActiveTab} userName={userName} userEmail={userEmail} />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative pb-28 md:pb-0 bg-zinc-950">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "url('/cave-texture.jpg')", backgroundSize: "cover" }}></div>
        
        <UserMobileHeader userName={userName} />

        <div className="p-6 md:p-12 lg:p-16 max-w-5xl w-full mx-auto relative z-10 flex-1">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
            
            {activeTab === 'bookings' && (
              <BookingsTab 
                upcomingBookings={upcomingBookings} 
                pastBookings={pastBookings} 
                isCancelling={isCancelling} 
                onCancel={handleCancel} 
              />
            )}

            {activeTab === 'profile' && (
              <ProfileTab userName={userName} userEmail={userEmail} userPhone={userPhone} />
            )}

          </motion.div>
        </div>
      </main>

      <UserMobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

    </div>
  )
}