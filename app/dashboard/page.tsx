import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AdminDashboard from './AdminDashboard'
import UserDashboard from './UserDashboard'

export default async function DashboardPage() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options: any) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options: any) { cookieStore.set({ name, value: '', ...options }) },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id }
  })

  if (!dbUser) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
        <div className="bg-red-950/30 border border-red-900 p-6 rounded-xl text-center">
          <h1 className="text-xl font-bold text-red-500 mb-2">Kritikus Rendszerhiba</h1>
          <p className="text-zinc-400">A profilod nem található az adatbázisban. Lépj kapcsolatba az üzemeltetővel.</p>
        </div>
      </div>
    )
  }

  // ==========================================
  // UI SZÉTVÁLASZTÁSA: ADMIN NÉZET
  // ==========================================
  if (dbUser.role === 'ADMIN') {
    const services = await prisma.service.findMany({ orderBy: { name: 'asc' } })

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todayEnd = new Date()
    todayEnd.setHours(23, 59, 59, 999)

    // Mai aktív
    const todayBookingsRaw = await prisma.appointment.findMany({
      where: { date: { gte: todayStart, lte: todayEnd }, status: { not: "CANCELLED" } },
      include: { service: true, user: true },
      orderBy: { date: 'asc' }
    })

    // Jövőbeli aktív
    const upcomingBookingsRaw = await prisma.appointment.findMany({
      where: { date: { gte: todayStart }, status: { not: "CANCELLED" } },
      include: { service: true, user: true },
      orderBy: { date: 'asc' }
    })

    // ÚJ: Lemondott foglalások (csak az utolsó 20 darab, hogy ne legyen végtelen a lista)
    const cancelledBookingsRaw = await prisma.appointment.findMany({
      where: { status: "CANCELLED" },
      include: { service: true, user: true },
      orderBy: { date: 'desc' },
      take: 20
    })

    const todayRevenue = todayBookingsRaw.reduce((sum, app) => sum + app.service.price, 0)
    const todayCount = todayBookingsRaw.length

    const todayBookings = todayBookingsRaw.map(app => ({
      id: app.id,
      time: app.date.toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' }),
      guestName: app.user?.name || app.guestName || 'Ismeretlen',
      guestPhone: app.user?.phone || app.guestPhone || '-',
      serviceName: app.service.name,
      price: app.service.price
    }))

    const allUpcomingBookings = upcomingBookingsRaw.map(app => ({
      id: app.id,
      date: app.date.toISOString(),
      time: app.date.toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' }),
      guestName: app.user?.name || app.guestName || 'Ismeretlen',
      serviceName: app.service.name,
      price: app.service.price
    }))

    const cancelledBookings = cancelledBookingsRaw.map(app => ({
      id: app.id,
      date: app.date.toISOString(),
      time: app.date.toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' }),
      guestName: app.user?.name || app.guestName || 'Ismeretlen',
      serviceName: app.service.name,
      price: app.service.price
    }))

    return (
      <AdminDashboard 
        userName={dbUser.name || 'Főnök'} 
        initialServices={services} 
        todayRevenue={todayRevenue}
        todayCount={todayCount}
        todayBookings={todayBookings}
        allUpcomingBookings={allUpcomingBookings}
        cancelledBookings={cancelledBookings}
      />
    )
  }

  // ==========================================
  // UI SZÉTVÁLASZTÁSA: VENDÉG NÉZET (USER)
  // ==========================================
  const userAppointments = await prisma.appointment.findMany({
    where: { userId: dbUser.id },
    include: { service: true },
    orderBy: { date: 'asc' }
  })

  const now = new Date()

  const upcomingBookings = userAppointments
    .filter(app => app.date >= now && app.status !== "CANCELLED")
    .map(app => ({
      id: app.id,
      date: app.date.toISOString(),
      serviceName: app.service.name,
      price: app.service.price
    }))

  const pastBookings = userAppointments
    .filter(app => app.date < now || app.status === "CANCELLED")
    .map(app => ({
      id: app.id,
      date: app.date.toISOString(),
      serviceName: app.service.name,
      status: app.status
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <UserDashboard 
      userName={dbUser.name || ''} 
      userEmail={dbUser.email || ''} 
      userPhone={dbUser.phone || ''} 
      upcomingBookings={upcomingBookings}
      pastBookings={pastBookings}
    />
  )
}