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
import { createBooking } from "@/app/actions/bookings";

interface Service {
  id: string;
  name: string;
  durationMins: number;
  price: number;
}

interface OccupiedSlot {
  date: string;
  endTime: string;
}

// Helyi időzónára optimalizált dátum generátor
const generateUpcomingDays = () => {
  const days = [];
  const today = new Date();
  const dayNames = ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"];
  const monthNames = ["Jan.", "Feb.", "Már.", "Ápr.", "Máj.", "Jún.", "Júl.", "Aug.", "Szep.", "Okt.", "Nov.", "Dec."];

  for (let i = 0; i < 5; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    // YYYY-MM-DD formátum generálása a helyi időzóna szerint
    const offset = d.getTimezoneOffset() * 60000;
    const localISODate = new Date(d.getTime() - offset).toISOString().split('T')[0];

    days.push({
      id: localISODate,
      day: i === 0 ? "Ma" : i === 1 ? "Holnap" : dayNames[d.getDay()],
      date: `${monthNames[d.getMonth()]} ${d.getDate()}.`
    });
  }
  return days;
};
const upcomingDays = generateUpcomingDays();

// COMPONENT
export default function Booking({
  services,
  userId,
  occupiedSlots
}: {
  services: Service[],
  userId?: string,
  occupiedSlots: OccupiedSlot[]
}) {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [authMode, setAuthMode] = useState<"guest" | "login">("guest");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const activeServiceData = services.find((s) => s.id === selectedService);

  // --- AZ OKOS IDŐPONT GENERÁTOR ---
  const getAvailableTimeSlots = () => {
    if (!selectedDate || !activeServiceData) return [];

    const slots: string[] = [];
    const serviceDurationMs = activeServiceData.durationMins * 60000;
    const now = new Date();

    for (let h = 10; h <= 17; h++) {
      ["00", "15", "30", "45"].forEach((m) => {
        const timeString = `${h}:${m}`;
        const slotStart = new Date(`${selectedDate}T${timeString}`);
        const slotEnd = new Date(slotStart.getTime() + serviceDurationMs);

        // 1. Múltbeli időpontok kiszűrése (ha a mai napot választotta)
        if (slotStart <= now) return;

        // 2. Ütközésvizsgálat a már lefoglalt sávokkal
        const isOverlapping = occupiedSlots.some(occ => {
          const occStart = new Date(occ.date);
          const occEnd = new Date(occ.endTime);
          // Matematikai metszet: a mi kezdetünk előbb van, mint a másik vége, ÉS a mi végünk később van, mint a másik kezdete
          return slotStart < occEnd && slotEnd > occStart;
        });

        if (!isOverlapping) {
          slots.push(timeString);
        }
      });
    }
    return slots;
  };

  const availableTimeSlots = getAvailableTimeSlots();

  async function handleBookingSubmit() {
    if (!selectedService || !selectedDate || !selectedTime) return;

    setIsSubmitting(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('serviceId', selectedService);

    const combinedDateTime = new Date(`${selectedDate}T${selectedTime}`);
    formData.append('date', combinedDateTime.toISOString());

    if (userId) {
      formData.append('userId', userId);
    } else {
      formData.append('guestName', name);
      formData.append('guestPhone', phone);
    }

    const res = await createBooking(formData);

    setIsSubmitting(false);

    if (res.success) {
      setMessage({ type: 'success', text: 'Sikeres foglalás! Várunk szeretettel.' });
      setSelectedService(null);
      setSelectedDate(null);
      setSelectedTime(null);
      setName("");
      setPhone("");
      // Itt érdemes lehetne újrahúzni az oldalt, de mivel a revalidatePath lefut a backendben, 
      // az occupiedSlots prop automatikusan frissülni fog a következő interakciónál.
    } else {
      setMessage({ type: 'error', text: res.error || 'Hiba történt a foglalás során.' });
    }
  }

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

          {/* BAL OSZLOP */}
          <div className="lg:col-span-7 flex flex-col gap-12">

            {/* 1. Szolgáltatás */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-medium text-zinc-200 uppercase tracking-widest flex items-center gap-2">
                <Scissor01Icon size={20} className="text-purple-400" />
                1. Szolgáltatás
              </h3>

              {services.length === 0 ? (
                <div className="text-zinc-500 text-sm p-4 border border-zinc-800 rounded bg-zinc-900/30">
                  Jelenleg nincsenek elérhető szolgáltatások.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => {
                        setSelectedService(service.id);
                        setSelectedTime(null); // Reseteljük az időt, mert más szolgáltatás más szabad sávokat adhat ki!
                      }}
                      className={`flex flex-col text-left p-4 rounded-sm border transition-all duration-200 ${selectedService === service.id
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-zinc-800 bg-zinc-900/30 hover:border-zinc-600"
                        }`}
                    >
                      <span className={`font-semibold uppercase text-sm ${selectedService === service.id ? "text-purple-300" : "text-zinc-300"}`}>
                        {service.name}
                      </span>
                      <div className="flex justify-between items-center mt-2 text-xs text-zinc-500 font-light">
                        <span>{service.durationMins} perc</span>
                        <span>{service.price.toLocaleString('hu-HU')} Ft</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
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
                    className={`flex flex-col items-center justify-center min-w-[90px] p-3 rounded-sm border transition-all duration-200 ${selectedDate === day.id
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
                3. Szabad Időpontok
              </h3>

              {availableTimeSlots.length === 0 ? (
                <div className="text-red-400 text-sm p-4 border border-red-900/50 rounded bg-red-500/10">
                  Erre a napra és szolgáltatásra már nincs elegendő szabad hely.
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {availableTimeSlots.map((time, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 text-sm rounded-sm border transition-all duration-200 ${selectedTime === time
                        ? "border-purple-500 bg-purple-500/10 text-purple-200 font-bold"
                        : "border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
                        }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              )}
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
                  <span className="text-zinc-200 font-medium uppercase text-right">
                    {activeServiceData ? activeServiceData.name : "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">Időpont:</span>
                  <span className="text-zinc-200 font-medium uppercase text-right">
                    {selectedDate ? upcomingDays.find(d => d.id === selectedDate)?.date : "-"} {selectedTime ? selectedTime : ""}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-zinc-800/50">
                  <span className="text-zinc-500">Fizetendő:</span>
                  <span className="text-purple-300 font-bold text-lg">
                    {activeServiceData ? `${activeServiceData.price.toLocaleString('hu-HU')} Ft` : "-"}
                  </span>
                </div>
              </div>

              {/* VISSZAJELZÉS (Siker vagy Hiba) */}
              {message && (
                <div className={`p-5 rounded-2xl border flex flex-col items-center justify-center gap-4 text-center ${message.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
                  }`}>
                  <span className="text-sm font-bold uppercase tracking-widest">{message.text}</span>

                  {/* ÚJ GOMB: Ha sikeres a foglalás és be van jelentkezve a Vendég */}
                  {message.type === 'success' && userId && (
                    <Link
                      href="/dashboard"
                      className="mt-2 px-6 py-3 bg-zinc-950 hover:bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-600 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300"
                    >
                      Foglalásaim megtekintése
                    </Link>
                  )}
                </div>
              )}

              {/* TABS (Fülek) ÉS ŰRLAP (Csak akkor aktív, ha van időpont ÉS nincs még sikeres foglalás leadva) */}
              <div className={`flex flex-col gap-6 transition-opacity duration-500 ${selectedTime && message?.type !== 'success' ? "opacity-100" : "opacity-30 pointer-events-none"}`}>

                <div className="flex p-1 bg-zinc-950/50 border border-zinc-800 rounded-sm">
                  <button
                    onClick={() => setAuthMode("guest")}
                    className={`flex-1 py-2 text-xs sm:text-sm font-medium uppercase tracking-wider transition-all duration-300 rounded-sm ${authMode === "guest"
                      ? "bg-zinc-800 text-zinc-100 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-300"
                      }`}
                  >
                    Vendégként
                  </button>
                  <button
                    onClick={() => setAuthMode("login")}
                    className={`flex-1 py-2 text-xs sm:text-sm font-medium uppercase tracking-wider transition-all duration-300 rounded-sm ${authMode === "login"
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
                    suppressHydrationWarning
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-5"
                  >
                    <div className="relative group">
                      <UserIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none text-zinc-500 transition-colors duration-300 group-focus-within:text-purple-400" />
                      <input
                        type="text"
                        placeholder={userId ? "Bejelentkezve (Profilhoz kötve)" : "Teljes Neved"}
                        disabled={!!userId}
                        value={name} onChange={(e) => setName(e.target.value)}
                        className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3.5 pl-12 pr-4 text-zinc-100 placeholder-zinc-600 backdrop-blur-sm focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all duration-300 disabled:opacity-50"
                      />
                    </div>
                    <div className="relative group">
                      <SmartPhone01Icon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none text-zinc-500 transition-colors duration-300 group-focus-within:text-purple-400" />
                      <input
                        type="tel"
                        placeholder={userId ? "Bejelentkezve" : "Telefonszámod (+36...)"}
                        disabled={!!userId}
                        value={phone} onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3.5 pl-12 pr-4 text-zinc-100 placeholder-zinc-600 backdrop-blur-sm focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all duration-300 disabled:opacity-50"
                      />
                    </div>
                    <button
                      onClick={handleBookingSubmit}
                      disabled={(!userId && (!name || !phone)) || isSubmitting}
                      className={`mt-4 py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-300 ${((userId || (name && phone)) && !isSubmitting)
                        ? "bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-[0_0_20px_rgba(167,139,250,0.2)] hover:shadow-[0_0_30px_rgba(167,139,250,0.4)] hover:scale-[1.02] active:scale-95 cursor-pointer"
                        : "bg-zinc-950/50 border border-zinc-800 text-zinc-500 cursor-not-allowed"
                        }`}
                    >
                      {isSubmitting ? 'Feldolgozás...' : 'Foglalás Véglegesítése'}
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
                      className={`mt-4 py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-300 ${email && password
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