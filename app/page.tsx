import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import About from '@/components/About'
import Booking from '@/components/Booking'
import Contact from '@/components/Contact'
import { prisma } from '@/lib/prisma'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Suspense } from 'react'

// --- 1. LASSÚ ADATKÉRŐ KOMPONENS ---
// Ezt kiszerveztük ide, hogy ne blokkolja a főoldal azonnali betöltését!
async function BookingDataFetcher() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
      },
    }
  )

  const [services, rawAppointments, { data: { user } }] = await Promise.all([
    prisma.service.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, price: true, durationMins: true }
    }),
    prisma.appointment.findMany({
      where: {
        date: { gte: today },
        status: { not: "CANCELLED" }
      },
      select: {
        date: true,
        endTime: true,
      }
    }),
    supabase.auth.getUser()
  ]);

  const occupiedSlots = rawAppointments.map(app => ({
    date: app.date.toISOString(),
    endTime: app.endTime.toISOString()
  }))

  let dbUser = null;
  if (user) {
    dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { name: true, phone: true }
    });
  }

  return (
    <Booking
      services={services}
      occupiedSlots={occupiedSlots}
      userId={user?.id}
      userName={dbUser?.name || undefined}
      userPhone={dbUser?.phone || undefined}
    />
  )
}

// --- 2. FŐOLDAL (Azonnal betöltődik) ---
export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 selection:bg-purple-500/30 text-zinc-100 font-sans">
      <Navbar />

      {/* A Hero azonnal megjelenik, nem vár a Supabase-re! */}
      <Hero />
      <Services />
      <About />

      {/* A Booking szekciót körbevesszük egy Suspense-szel. 
          Amíg a szerver lekéri a usert és a foglalásokat, egy elegáns töltőképernyőt mutatunk, 
          de a weboldal többi része már rég használható! */}
      <Suspense fallback={
        <div className="w-full min-h-screen py-24 flex flex-col items-center justify-center bg-zinc-950 border-t border-zinc-900">
          <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-zinc-500 font-bold uppercase tracking-widest text-xs">Foglalási rendszer betöltése...</p>
        </div>
      }>
        <BookingDataFetcher />
      </Suspense>

      <Contact />
    </main>
  )
}