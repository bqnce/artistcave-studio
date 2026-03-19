import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import AdminDashboard from '@/components/AdminDashboard'

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
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 border-b border-zinc-800 pb-6">
          <div>
            <span className="text-purple-500 font-bold tracking-widest uppercase text-xs mb-1 block">Saját Fiók</span>
            <h1 className="text-3xl font-bold uppercase">Szia, <span className="text-purple-400">{dbUser.name || 'Vendég'}</span>!</h1>
          </div>
          <div className="flex items-center gap-4">
             <Link href="/" className="text-sm font-medium uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Új Foglalás</Link>
             <form action={signOut}>
               <button type="submit" className="bg-zinc-900 text-zinc-400 border border-zinc-800 px-4 py-2 rounded-lg text-sm font-bold uppercase hover:bg-zinc-800 hover:text-white transition-colors">
                 Kijelentkezés
               </button>
             </form>
          </div>
        </div>
        <p className="text-zinc-400">Itt fogod látni a közelgő és korábbi hajvágásaidat.</p>
      </div>
    </main>
  )
}