import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AdminDashboard from '@/components/AdminDashboard'
import UserDashboard from '@/components/UserDashboard'

export default async function DashboardPage() {
  const cookieStore = await cookies()

  // 1. SUPABASE HITELESÍTÉS ELLENŐRZÉSE
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // 2. PRISMA ADATBÁZIS LEKÉRDEZÉS (Itt dől el a szerepkör)
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id }
  })

  // Ha valamiért beregisztrált az Auth-ba, de nincs a DB-ben (hibás szinkronizáció)
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

  // KIJELENTKEZÉS AKCIÓ
  const signOut = async () => {
    'use server'
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
    await supabase.auth.signOut()
    redirect('/login')
  }

  // 3. UI SZÉTVÁLASZTÁSA: ADMIN NÉZET
  if (dbUser.role === 'ADMIN') {
    // ITT HÍVJUK BE A KLIENST, és átadjuk neki a nevet!
    return <AdminDashboard userName={dbUser.name || 'Főnök'} />
  }

  // 4. UI SZÉTVÁLASZTÁSA: VENDÉG NÉZET (USER)
  return (
    <UserDashboard 
      userName={dbUser.name || ''} 
      userEmail={dbUser.email || ''} 
      userPhone={dbUser.phone || ''} 
    />
  )
}