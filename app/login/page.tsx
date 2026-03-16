"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/prisma/supabase"; // Supabase import a bejelentkezéshez
import { 
  Mail01Icon, 
  Key01Icon,
  ArrowLeft01Icon
} from "hugeicons-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    // Supabase bejelentkezési logika
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg("Hibás e-mail vagy jelszó! Kérlek, próbáld újra.");
      setIsLoading(false);
      return;
    }

    // Sikeres bejelentkezés
    router.push("/dashboard"); // Később ezt átirányíthatjuk a /dashboard-ra is, ha admin!
  };

  return (
    <main className="relative min-h-screen w-full flex bg-zinc-950 overflow-hidden">
      
      {/* BAL OLDAL: Látványelem (cave-texture.jpg) */}
      <div className="hidden lg:block lg:w-[50%] relative z-10">
        <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-zinc-950 to-transparent z-20"></div>
        <div className="absolute inset-0 bg-zinc-950/20 z-10 mix-blend-multiply"></div>
        {/* Egy kicsit sötétebb lila overlay a textúrához */}
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/60 to-transparent z-10 mix-blend-overlay"></div>
        
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/cave-texture.jpg" 
          alt="Artist Cave Texture" 
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* JOBB OLDAL: Bejelentkezési Űrlap */}
      <div className="w-full lg:w-[50%] lg:absolute lg:right-0 h-full flex items-center justify-center p-6 sm:p-12 relative z-0">
        
        {/* Barlang textúra a háttérben */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ 
            backgroundImage: "url('/portfolio-placeholder.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        ></div>

        <div className="w-full max-w-md relative z-10 flex flex-col">
          
          <Link href="/" className="flex items-center gap-2 text-zinc-500 hover:text-purple-400 transition-colors self-start mb-12 text-sm font-medium uppercase tracking-widest">
            <ArrowLeft01Icon size={18} />
            Vissza
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold tracking-tighter uppercase text-zinc-100 mb-2">
              Üdv újra a <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400">
                Barlangban
              </span>
            </h1>
            <p className="text-zinc-500 font-light text-sm mb-6">
              Jelentkezz be a fiókodba a foglalásaid és korábbi vágásaid kezeléséhez.
            </p>
          </motion.div>

          {/* Hibaüzenet */}
          {errorMsg && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {errorMsg}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.5 }} className="relative group">
              <Mail01Icon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none text-zinc-500 transition-colors duration-300 group-focus-within:text-purple-400" />
              <input 
                type="email" required placeholder="E-mail címed"
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3.5 pl-12 pr-4 text-zinc-100 placeholder-zinc-600 backdrop-blur-sm focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all duration-300"
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="relative group">
              <Key01Icon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none text-zinc-500 transition-colors duration-300 group-focus-within:text-purple-400" />
              <input 
                type="password" required placeholder="Jelszó"
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3.5 pl-12 pr-4 text-zinc-100 placeholder-zinc-600 backdrop-blur-sm focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all duration-300"
              />
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }} className="flex justify-end">
              <a href="#" className="text-xs text-zinc-500 hover:text-purple-400 transition-colors">
                Elfelejtetted a jelszavad?
              </a>
            </motion.div>

            <motion.button 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}
              type="submit"
              disabled={isLoading}
              className="mt-2 py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-300 bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-[0_0_20px_rgba(167,139,250,0.2)] hover:shadow-[0_0_30px_rgba(167,139,250,0.4)] hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? "Bejelentkezés..." : "Bejelentkezés"}
            </motion.button>

          </form>

          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-zinc-500 font-light">
              Nincs még fiókod?{' '}
              <Link href="/register" className="text-purple-400 font-medium hover:text-purple-300 transition-colors">
                Regisztrálj itt!
              </Link>
            </p>
          </motion.div>

        </div>
      </div>
    </main>
  );
}