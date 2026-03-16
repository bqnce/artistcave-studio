"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Calendar01Icon, 
  Clock01Icon, 
  Scissor01Icon, 
  UserIcon, 
  SmartPhone01Icon,
  Mail01Icon,
  Key01Icon
} from "hugeicons-react";
import Link from "next/link";

const services = [
  { id: "hair", name: "Hajvágás", duration: "45p", price: "5 000 Ft" },
  { id: "kid", name: "Gyermek hajvágás", duration: "40p", price: "4 000 Ft" },
  { id: "beard", name: "Szakáll igazítás", duration: "20p", price: "3 500 Ft" },
  { id: "combo", name: "Barber treatment", duration: "1ó", price: "8 000 Ft" },
];

const upcomingDays = [
  { id: "day1", day: "Ma", date: "Máj. 14." },
  { id: "day2", day: "Holnap", date: "Máj. 15." },
  { id: "day3", day: "Szerda", date: "Máj. 16." },
  { id: "day4", day: "Csütörtök", date: "Máj. 17." },
  { id: "day5", day: "Péntek", date: "Máj. 18." },
];

const generateTimeSlots = () => {
  const slots: string[] = [];
  for (let h = 10; h <= 17; h++) {
    ["00", "15", "30", "45"].forEach((m) => slots.push(`${h}:${m}`));
  }
  return slots;
};
const timeSlots = generateTimeSlots();

export default function Booking() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  // Új State a tabok kezeléséhez ("guest" vagy "login")
  const [authMode, setAuthMode] = useState<"guest" | "login">("guest");
  
  // Vendég adatok
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  
  // Bejelentkezés adatok
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const activeServiceData = services.find((s) => s.id === selectedService);

  return (
    <section 
      id="foglalas" 
      className="relative min-h-screen w-full flex flex-col items-center justify-center bg-zinc-950 py-24 px-6 md:px-12 lg:px-24 border-t border-zinc-900"
    >
      <div className="relative z-10 w-full max-w-6xl mx-auto">
        
        {/* Fejléc */}
        <div className="text-center mb-16">
          <span className="text-zinc-500 uppercase tracking-[0.4em] font-light text-xs md:text-sm mb-3 inline-block">
            Időpontfoglalás
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase text-zinc-100 leading-tight">
            Foglald le a <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400">Helyed</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* BAL OSZLOP: A választási folyamat */}
          <div className="lg:col-span-7 flex flex-col gap-12">
            
            {/* 1. Szolgáltatás */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-medium text-zinc-200 uppercase tracking-widest flex items-center gap-2">
                <Scissor01Icon size={20} className="text-purple-400" />
                1. Szolgáltatás
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => {
                      setSelectedService(service.id);
                      setSelectedTime(null);
                    }}
                    className={`flex flex-col text-left p-4 rounded-sm border transition-all duration-200 ${
                      selectedService === service.id 
                        ? "border-purple-500 bg-purple-500/10" 
                        : "border-zinc-800 bg-zinc-900/30 hover:border-zinc-600"
                    }`}
                  >
                    <span className={`font-semibold uppercase text-sm ${selectedService === service.id ? "text-purple-300" : "text-zinc-300"}`}>
                      {service.name}
                    </span>
                    <div className="flex justify-between items-center mt-2 text-xs text-zinc-500 font-light">
                      <span>{service.duration}</span>
                      <span>{service.price}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Dátum */}
            <div className={`flex flex-col gap-4 transition-opacity duration-500 ${selectedService ? "opacity-100" : "opacity-30 pointer-events-none"}`}>
              <h3 className="text-lg font-medium text-zinc-200 uppercase tracking-widest flex items-center gap-2">
                <Calendar01Icon size={20} className={selectedService ? "text-purple-400" : "text-zinc-600"} />
                2. Dátum
              </h3>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {upcomingDays.map((day) => (
                  <button
                    key={day.id}
                    onClick={() => {
                      setSelectedDate(day.id);
                      setSelectedTime(null);
                    }}
                    className={`flex flex-col items-center justify-center min-w-[90px] p-3 rounded-sm border transition-all duration-200 ${
                      selectedDate === day.id 
                        ? "border-purple-500 bg-purple-500/10" 
                        : "border-zinc-800 bg-zinc-900/30 hover:border-zinc-600"
                    }`}
                  >
                    <span className={`text-xs uppercase tracking-widest mb-1 ${selectedDate === day.id ? "text-purple-300" : "text-zinc-500"}`}>
                      {day.day}
                    </span>
                    <span className={`font-medium ${selectedDate === day.id ? "text-zinc-100" : "text-zinc-300"}`}>
                      {day.date}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Időpont */}
            <div className={`flex flex-col gap-4 transition-opacity duration-500 ${selectedDate ? "opacity-100" : "opacity-30 pointer-events-none"}`}>
              <h3 className="text-lg font-medium text-zinc-200 uppercase tracking-widest flex items-center gap-2">
                <Clock01Icon size={20} className={selectedDate ? "text-purple-400" : "text-zinc-600"} />
                3. Időpont (15 perces bontás)
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                {timeSlots.map((time, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedTime(time)}
                    className={`py-2 text-sm rounded-sm border transition-all duration-200 ${
                      selectedTime === time
                        ? "border-purple-500 bg-purple-500/10 text-purple-200 font-bold"
                        : "border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

          </div>


          {/* JOBB OSZLOP: Összegzés és Adatfelvétel/Bejelentkezés */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-32 bg-zinc-900/40 border border-zinc-800 p-8 rounded-sm backdrop-blur-sm flex flex-col gap-8">
              
              <h3 className="text-xl font-medium text-zinc-100 uppercase tracking-widest border-b border-zinc-800 pb-4">
                Összegzés
              </h3>

              {/* Foglalás részletei */}
              <div className="flex flex-col gap-4 text-sm font-light">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">Szolgáltatás:</span>
                  <span className="text-zinc-200 font-medium uppercase">
                    {activeServiceData ? activeServiceData.name : "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">Időpont:</span>
                  <span className="text-zinc-200 font-medium uppercase">
                    {selectedDate ? upcomingDays.find(d => d.id === selectedDate)?.date : "-"} {selectedTime ? selectedTime : ""}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-zinc-800/50">
                  <span className="text-zinc-500">Fizetendő:</span>
                  <span className="text-purple-300 font-bold text-lg">
                    {activeServiceData ? activeServiceData.price : "-"}
                  </span>
                </div>
              </div>

              {/* TABS (Fülek) ÉS ŰRLAP (Csak akkor aktív, ha van időpont) */}
              <div className={`flex flex-col gap-6 mt-4 transition-opacity duration-500 ${selectedTime ? "opacity-100" : "opacity-30 pointer-events-none"}`}>
                
                {/* Fülek (Vendég / Bejelentkezés) */}
                <div className="flex p-1 bg-zinc-950/50 border border-zinc-800 rounded-sm">
                  <button
                    onClick={() => setAuthMode("guest")}
                    className={`flex-1 py-2 text-xs sm:text-sm font-medium uppercase tracking-wider transition-all duration-300 rounded-sm ${
                      authMode === "guest" 
                        ? "bg-zinc-800 text-zinc-100 shadow-sm" 
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    Vendégként
                  </button>
                  <button
                    onClick={() => setAuthMode("login")}
                    className={`flex-1 py-2 text-xs sm:text-sm font-medium uppercase tracking-wider transition-all duration-300 rounded-sm ${
                      authMode === "login" 
                        ? "bg-zinc-800 text-zinc-100 shadow-sm" 
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    Bejelentkezés
                  </button>
                </div>

                {/* ŰRLAP: Vendég */}
                {authMode === "guest" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-5"
                  >
                    <div className="relative group">
                      <UserIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none text-zinc-500 transition-colors duration-300 group-focus-within:text-purple-400" />
                      <input 
                        type="text" 
                        placeholder="Teljes Neved"
                        value={name} onChange={(e) => setName(e.target.value)}
                        className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3.5 pl-12 pr-4 text-zinc-100 placeholder-zinc-600 backdrop-blur-sm focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all duration-300"
                      />
                    </div>
                    <div className="relative group">
                      <SmartPhone01Icon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none text-zinc-500 transition-colors duration-300 group-focus-within:text-purple-400" />
                      <input 
                        type="tel" 
                        placeholder="Telefonszámod (+36...)"
                        value={phone} onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3.5 pl-12 pr-4 text-zinc-100 placeholder-zinc-600 backdrop-blur-sm focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all duration-300"
                      />
                    </div>
                    <button 
                      disabled={!name || !phone}
                      className={`mt-4 py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-300 ${
                        name && phone
                          ? "bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-[0_0_20px_rgba(167,139,250,0.2)] hover:shadow-[0_0_30px_rgba(167,139,250,0.4)] hover:scale-[1.02] active:scale-95 cursor-pointer"
                          : "bg-zinc-950/50 border border-zinc-800 text-zinc-500 cursor-not-allowed"
                      }`}
                    >
                      Foglalás Véglegesítése
                    </button>
                  </motion.div>
                )}

                {/* ŰRLAP: Bejelentkezés */}
                {authMode === "login" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-5"
                  >
                    <div className="relative group">
                      <Mail01Icon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none text-zinc-500 transition-colors duration-300 group-focus-within:text-purple-400" />
                      <input 
                        type="email" 
                        placeholder="E-mail címed"
                        value={email} onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3.5 pl-12 pr-4 text-zinc-100 placeholder-zinc-600 backdrop-blur-sm focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all duration-300"
                      />
                    </div>
                    <div className="relative group">
                      <Key01Icon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none text-zinc-500 transition-colors duration-300 group-focus-within:text-purple-400" />
                      <input 
                        type="password" 
                        placeholder="Jelszó"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3.5 pl-12 pr-4 text-zinc-100 placeholder-zinc-600 backdrop-blur-sm focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all duration-300"
                      />
                    </div>
                    
                    <button 
                      disabled={!email || !password}
                      className={`mt-4 py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-300 ${
                        email && password
                          ? "bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-[0_0_20px_rgba(167,139,250,0.2)] hover:shadow-[0_0_30px_rgba(167,139,250,0.4)] hover:scale-[1.02] active:scale-95 cursor-pointer"
                          : "bg-zinc-950/50 border border-zinc-800 text-zinc-500 cursor-not-allowed"
                      }`}
                    >
                      Belépés & Foglalás
                    </button>

                    <div className="text-center mt-2">
                      <Link href="/register" className="text-xs text-zinc-500 hover:text-purple-400 transition-colors">
                        Nincs még fiókod? Regisztrálj itt.
                      </Link>
                    </div>
                  </motion.div>
                )}

              </div>

            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 4px; }
      `}</style>
    </section>
  );
}