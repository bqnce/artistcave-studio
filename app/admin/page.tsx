import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { 
  Logout01Icon,
  Calendar01Icon,
  UserMultipleIcon,
  Scissor01Icon
} from "hugeicons-react";

export default async function AdminDashboard() {
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

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // ELLENŐRIZZÜK, HOGY TÉNYLEG AZ ADMIN-E
  const dbUser = await prisma.user.findUnique({
    where: { email: user.email }
  })

  if (dbUser?.role !== 'ADMIN') {
    // Ha egy sima vendég próbál ide bejutni az URL átírásával, kidobjuk!
    redirect('/dashboard')
  }

  const signOut = async () => {
    "use server"
    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options: any) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options: any) { cookieStore.set({ name, value: '', ...options }) },
      },
    })
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12 lg:p-24 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('/cave-texture.jpg')", backgroundSize: "cover" }}></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Fejléc */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12 border-b border-zinc-800 pb-8">
          <div>
            <span className="text-purple-500 font-bold tracking-widest uppercase text-xs mb-2 block">Vezérlőpult</span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tighter uppercase mb-2">
              Szia, Főnök!
            </h1>
            <p className="text-zinc-500 font-light text-sm">
              Itt látod az összes foglalást és a vendégeidet.
            </p>
          </div>
          
          <form action={signOut}>
            <button type="submit" className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm font-medium uppercase tracking-widest bg-red-950/20 px-4 py-2 rounded-xl border border-red-900/30">
              <Logout01Icon size={18} />
              Kijelentkezés
            </button>
          </form>
        </div>

        {/* Gyorsstatisztikák */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex items-center gap-4">
            <div className="p-4 bg-purple-500/10 rounded-xl text-purple-400"><Calendar01Icon size={28} /></div>
            <div>
              <p className="text-zinc-500 text-sm font-light uppercase tracking-widest">Mai Foglalások</p>
              <p className="text-2xl font-bold text-zinc-100">0</p>
            </div>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex items-center gap-4">
            <div className="p-4 bg-blue-500/10 rounded-xl text-blue-400"><UserMultipleIcon size={28} /></div>
            <div>
              <p className="text-zinc-500 text-sm font-light uppercase tracking-widest">Összes Vendég</p>
              <p className="text-2xl font-bold text-zinc-100">1</p>
            </div>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex items-center gap-4">
            <div className="p-4 bg-green-500/10 rounded-xl text-green-400"><Scissor01Icon size={28} /></div>
            <div>
              <p className="text-zinc-500 text-sm font-light uppercase tracking-widest">Bevétel (Hó)</p>
              <p className="text-2xl font-bold text-zinc-100">0 Ft</p>
            </div>
          </div>
        </div>

        {/* Naptár / Táblázat Placeholder */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 min-h-[400px] flex items-center justify-center text-center">
          <div>
            <h3 className="text-xl font-medium text-zinc-400 uppercase tracking-widest mb-2">Hamarosan érkezik...</h3>
            <p className="text-zinc-600 font-light text-sm">Ide fogjuk bekötni az adatbázisból a tényleges foglalási naptárat!</p>
          </div>
        </div>

      </div>
    </main>
  )
}