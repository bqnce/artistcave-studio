import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/prisma' // BEHÚZZUK A PRISMÁT!
import { 
  UserIcon, 
  Calendar01Icon, 
  Logout01Icon,
  Home01Icon
} from "hugeicons-react";

export default async function DashboardPage() {
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

  // LEKÉRDEZZÜK A PRISMÁBÓL A SZEREPKÖRT!
  const dbUser = await prisma.user.findUnique({
    where: { email: user.email }
  })

  // HA A BORBÉLY LÉPETT BE, AZONNAL ÁTDOBJUK AZ ADMIN FELÜLETRE!
  if (dbUser?.role === 'ADMIN') {
    redirect('/admin')
  }

  // Next.js Server Action a biztonságos kijelentkezéshez
  const signOut = async () => {
    "use server"
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

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12 lg:p-24 relative overflow-hidden">
      
      {/* Halvány textúra a háttérben */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "url('/cave-texture.jpg')", backgroundSize: "cover" }}
      ></div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Fejléc és Navigáció */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-16 border-b border-zinc-800 pb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter uppercase mb-2">
              Szia, <span className="text-purple-400">{user.user_metadata?.name || 'Vendég'}</span>!
            </h1>
            <p className="text-zinc-500 font-light text-sm">
              Itt kezelheted a foglalásaidat és a fiókodat.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-purple-400 transition-colors text-sm font-medium uppercase tracking-widest bg-zinc-900/50 px-4 py-2 rounded-xl border border-zinc-800">
              <Home01Icon size={18} />
              Főoldal
            </Link>
            
            {/* Kijelentkezés gomb */}
            <form action={signOut}>
              <button type="submit" className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm font-medium uppercase tracking-widest bg-red-950/20 px-4 py-2 rounded-xl border border-red-900/30">
                <Logout01Icon size={18} />
                Kijelentkezés
              </button>
            </form>
          </div>
        </div>

        {/* Dashboard Kártyák */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Fiók Adatai Kártya */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-500/10 rounded-xl">
                <UserIcon size={24} className="text-purple-400" />
              </div>
              <h2 className="text-lg font-medium uppercase tracking-widest text-zinc-200">Adataim</h2>
            </div>
            <div className="space-y-4 text-sm font-light">
              <div>
                <span className="text-zinc-500 block mb-1">E-mail cím</span>
                <span className="text-zinc-300">{user.email}</span>
              </div>
              <div>
                <span className="text-zinc-500 block mb-1">Telefonszám</span>
                <span className="text-zinc-300">{user.user_metadata?.phone || 'Nincs megadva'}</span>
              </div>
            </div>
          </div>

          {/* Következő Foglalás Kártya */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm lg:col-span-2 flex flex-col justify-center items-center text-center">
            <div className="p-4 bg-zinc-800/50 rounded-full mb-4">
              <Calendar01Icon size={32} className="text-zinc-400" />
            </div>
            <h3 className="text-lg font-medium text-zinc-300 uppercase tracking-widest mb-2">Még nincs aktív foglalásod</h3>
            <p className="text-zinc-500 font-light text-sm mb-6 max-w-sm">
              Foglald le a következő időpontodat a barlangba, hogy mindig friss legyen a séród.
            </p>
            <Link href="/#foglalas" className="bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500 hover:text-white transition-all px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-widest">
              Új időpont foglalása
            </Link>
          </div>

        </div>
      </div>
    </main>
  )
}