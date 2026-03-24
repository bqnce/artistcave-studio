import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import About from '@/components/About'
import Booking from '@/components/Booking'
import Contact from '@/components/Contact'
import { prisma } from '@/lib/prisma'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export default async function Home() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Cookie-k és Supabase kliens inicializálása
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

  // 1. PÁRHUZAMOSÍTOTT LEKÉRDEZÉSEK (Ez adja a sebességet)
  // Egyszerre indul a szolgáltatások, a foglalások és az auth lekérése
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

  // Serializáljuk a dátumokat, hogy a Kliens Komponens hiba nélkül megkapja
  const occupiedSlots = rawAppointments.map(app => ({
    date: app.date.toISOString(),
    endTime: app.endTime.toISOString()
  }))

  // 2. Adatbázis User lekérése
  // (Ez csak akkor fut le, ha van user.id, tehát függ az előző lekérdezéstől)
  let dbUser = null;
  if (user) {
    dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { name: true, phone: true }
    });
  }

  return (
    <main className="min-h-screen bg-zinc-950 selection:bg-purple-500/30 text-zinc-100 font-sans">
      <Navbar />
      <Hero />
      <Services />
      <About />
      
      {/* ITT ADJUK ÁT AZ FOGLALT SÁVOKAT ÉS A BEJELENTKEZETT USER ADATAIT */}
      <Booking 
        services={services} 
        occupiedSlots={occupiedSlots} 
        userId={user?.id} 
        userName={dbUser?.name || undefined}
        userPhone={dbUser?.phone || undefined}
      />
      
      <Contact />
    </main>
  )
}