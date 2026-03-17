import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
  const cookieStore = await cookies()

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

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const signOut = async () => {
    'use server'
    const cookieStore = await cookies()
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
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12 lg:p-24 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "url('/cave-texture.jpg')", backgroundSize: 'cover' }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10 border-b border-zinc-800 pb-8">
          <div>
            <span className="text-purple-500 font-bold tracking-widest uppercase text-xs mb-2 block">Dashboard</span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tighter uppercase">
              Szia, <span className="text-purple-400">{user.user_metadata?.name || 'Vendég'}</span>!
            </h1>
            <p className="text-zinc-500 font-light text-sm mt-2">Be vagy jelentkezve: {user.email}</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-zinc-400 hover:text-purple-400 transition-colors text-sm font-medium uppercase tracking-widest bg-zinc-900/50 px-4 py-2 rounded-xl border border-zinc-800"
            >
              Főoldal
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="text-red-300 hover:text-red-200 transition-colors text-sm font-medium uppercase tracking-widest bg-red-950/20 px-4 py-2 rounded-xl border border-red-900/30"
              >
                Kijelentkezés
              </button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-medium uppercase tracking-widest text-zinc-200 mb-3">Fiók</h2>
            <div className="text-sm font-light space-y-2">
              <div>
                <span className="text-zinc-500 block">E-mail</span>
                <span className="text-zinc-200">{user.email}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Név</span>
                <span className="text-zinc-200">{user.user_metadata?.name || '—'}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Telefon</span>
                <span className="text-zinc-200">{user.user_metadata?.phone || '—'}</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-medium uppercase tracking-widest text-zinc-200 mb-3">Következő lépés</h2>
            <p className="text-zinc-500 font-light text-sm">
              Ide jöhetnek később a foglalások, profil beállítások, stb. Most csak egy stabil, bejelentkezés-védett
              oldal.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

