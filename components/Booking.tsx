"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scissor01Icon,
  Calendar01Icon,
  UserCircleIcon,
  ArrowRight01Icon,
  ArrowLeft01Icon,
  CheckmarkCircle02Icon
} from "hugeicons-react";
import { createBooking } from "@/app/actions/bookings";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

interface Service {
  id: string;
  name: string;
  price: number;
  durationMins: number;
}
interface OccupiedSlot { date: string; endTime: string; }
interface TimeBlock { start: string; end: string; }

interface Props {
  services: Service[];
  occupiedSlots: OccupiedSlot[];
  timeBlocks?: TimeBlock[];
  userId?: string;
  userName?: string;
  userPhone?: string;
  userEmail?: string;
}

export default function Booking({ services, occupiedSlots, timeBlocks = [], userId, userName, userPhone, userEmail }: Props) {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [guestName, setGuestName] = useState(userName || "");
  const [guestPhone, setGuestPhone] = useState(userPhone || "");
  const [guestEmail, setGuestEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // IN-LINE LOGIN STATE
  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // JAVÍTÁS 1: Ha a user bejelentkezik a beágyazott ablakban, azonnal frissítjük a state-et az adatbázisból érkező propokból!
  useEffect(() => {
    if (userName) setGuestName(userName);
    if (userPhone) setGuestPhone(userPhone);
  }, [userName, userPhone]);

  // --- IDŐPONT GENERÁLÓ ÉS ÜTKÖZÉSVIZSGÁLÓ LOGIKA ---
  const availableTimes = useMemo(() => {
    if (!selectedService) return [];
    const times: string[] = [];
    const now = new Date();

    // Napi beosztás: 10:00 - 19:00 (hétköznap), 10:00 - 14:00 (szombat)
    const isSaturday = selectedDate.getDay() === 6;
    const isSunday = selectedDate.getDay() === 0;
    if (isSunday) return []; // Vasárnap zárva

    const startHour = 10;
    const endHour = isSaturday ? 14 : 19;

    for (let h = startHour; h < endHour; h++) {
      for (let m = 0; m < 60; m += 15) {
        const slotStart = new Date(selectedDate);
        slotStart.setHours(h, m, 0, 0);

        const slotEnd = new Date(slotStart.getTime() + selectedService.durationMins * 60000);

        if (slotStart <= new Date(now.getTime() + 60 * 60000)) continue;

        const closingTime = new Date(selectedDate);
        closingTime.setHours(endHour, 0, 0, 0);
        if (slotEnd > closingTime) continue;

        const isOccupied = occupiedSlots.some(occ => {
          const occStart = new Date(occ.date);
          const occEnd = new Date(occ.endTime);
          return (slotStart < occEnd && slotEnd > occStart);
        });
        if (isOccupied) continue;

        const isBlocked = timeBlocks.some(block => {
          const blockStart = new Date(block.start);
          const blockEnd = new Date(block.end);
          return (slotStart < blockEnd && slotEnd > blockStart);
        });
        if (isBlocked) continue;

        times.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      }
    }
    return times;
  }, [selectedDate, selectedService, occupiedSlots, timeBlocks]);

  const dates = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  }).filter(d => d.getDay() !== 0);

  // BEÁGYAZOTT BEJELENTKEZÉS LOGIKA
  async function handleLogin() {
    setIsLoggingIn(true);
    setLoginError(null);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    if (error) {
      setLoginError("Helytelen e-mail vagy jelszó.");
      setIsLoggingIn(false);
    } else {
      router.refresh();
      setShowLogin(false);
      setIsLoggingIn(false);
    }
  }

  async function handleBook() {
    if (!selectedService || !selectedTime) return;
    if (!userId && (!guestName || !guestPhone)) return;

    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append('serviceId', selectedService.id);
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const bookingDate = new Date(selectedDate);
    bookingDate.setHours(hours, minutes, 0, 0);
    formData.append('date', bookingDate.toISOString());

    // JAVÍTÁS 2: Szigorúan mindig elküldjük a nevet és a telefont az adatbázisnak, függetlenül a státusztól!
    formData.append('guestName', guestName || userName || 'Ismeretlen');
    formData.append('guestPhone', guestPhone || userPhone || '');
    formData.append('guestEmail', guestEmail || userEmail || '');
    if (userId) {
      formData.append('userId', userId);
    }


    const res = await createBooking(formData);
    if (res.success) {
      setSuccess(true);
    } else {
      setError(res.error || "Hiba történt a foglalás során.");
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <section id="foglalas" className="min-h-screen flex items-center justify-center py-24 px-6 bg-zinc-950">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
            <CheckmarkCircle02Icon size={48} />
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-4">Sikeres Foglalás!</h2>
          <p className="text-zinc-400 mb-8">Várunk szeretettel a megadott időpontban. A részletekről e-mailt küldtünk.</p>
          <div className="max-w-sm mx-auto flex flex-col items-center gap-3">
            {userId && (
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full bg-violet-600 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-violet-500 transition-colors shadow-[0_8px_30px_rgba(139,92,246,0.35)]"
              >
                Foglalás megtekintése
              </button>
            )}
            {userId && (
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-600 py-1">
                Vagy
              </span>
            )}
            <button onClick={() => window.location.reload()} className="w-full bg-zinc-900 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors border border-zinc-800">
              Új foglalás leadása
            </button>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="foglalas" className="min-h-screen py-24 px-6 md:px-12 bg-zinc-950 border-t border-zinc-900 relative">
      <div className="max-w-4xl mx-auto">

        {/* WIZARD FEJLÉC */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6">Időpontfoglalás</h2>
          <div className="flex items-center justify-center gap-4 max-w-sm mx-auto">
            <StepIndicator current={step} target={1} icon={<Scissor01Icon size={18} />} label="Szolgáltatás" />
            <div className={`h-0.5 flex-1 ${step >= 2 ? 'bg-violet-500' : 'bg-zinc-800'} transition-colors duration-500`}></div>
            <StepIndicator current={step} target={2} icon={<Calendar01Icon size={18} />} label="Időpont" />
            <div className={`h-0.5 flex-1 ${step >= 3 ? 'bg-violet-500' : 'bg-zinc-800'} transition-colors duration-500`}></div>
            <StepIndicator current={step} target={3} icon={<UserCircleIcon size={18} />} label="Adatok" />
          </div>
        </div>

        {/* WIZARD TARTALOM */}
        <div className="bg-zinc-950/50 border border-zinc-800/80 rounded-[2rem] p-6 md:p-10 shadow-2xl relative overflow-hidden">
          <AnimatePresence mode="wait">

            {/* 1. LÉPÉS: SZOLGÁLTATÁS */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex flex-col gap-4">
                <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest mb-4">Válassz szolgáltatást</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map(service => (
                    <div
                      key={service.id}
                      onClick={() => { setSelectedService(service); setStep(2); }}
                      className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-violet-500/40 rounded-2xl p-6 cursor-pointer transition-all group flex flex-col justify-between min-h-[140px]"
                    >
                      <div>
                        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-violet-300 transition-colors">{service.name}</h4>
                        <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">{service.durationMins} perc</span>
                      </div>
                      <div className="text-xl font-black text-white mt-4">{service.price.toLocaleString('hu-HU')} Ft</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 2. LÉPÉS: DÁTUM ÉS IDŐPONT */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <div className="flex items-center gap-4 mb-8">
                  <button onClick={() => setStep(1)} className="p-2 bg-zinc-900 text-zinc-400 rounded-lg hover:text-white transition-colors"><ArrowLeft01Icon size={20} /></button>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">{selectedService?.name}</h3>
                    <span className="text-[10px] text-violet-400 font-bold uppercase tracking-widest">{selectedService?.durationMins} perc • {selectedService?.price.toLocaleString('hu-HU')} Ft</span>
                  </div>
                </div>

                <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest mb-4">1. Válassz napot</h3>
                <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-4 mb-6">
                  {dates.map((d, i) => {
                    const isSelected = d.toDateString() === selectedDate.toDateString();
                    return (
                      <button
                        key={i}
                        onClick={() => { setSelectedDate(d); setSelectedTime(null); }}
                        className={`flex-shrink-0 flex flex-col items-center justify-center w-20 h-24 rounded-2xl border transition-all ${isSelected ? 'bg-violet-600 border-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.3)]' : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800'}`}
                      >
                        <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isSelected ? 'text-violet-200' : 'text-zinc-500'}`}>{d.toLocaleDateString('hu-HU', { weekday: 'short' })}</span>
                        <span className={`text-2xl font-black ${isSelected ? 'text-white' : 'text-zinc-300'}`}>{d.getDate()}</span>
                        <span className={`text-[10px] font-bold uppercase ${isSelected ? 'text-violet-200' : 'text-zinc-600'}`}>{d.toLocaleDateString('hu-HU', { month: 'short' })}</span>
                      </button>
                    )
                  })}
                </div>

                <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest mb-4">2. Válassz időpontot</h3>
                {availableTimes.length === 0 ? (
                  <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-center">
                    <p className="text-zinc-400 font-medium">Sajnos erre a napra már nincs szabad időpontunk ehhez a szolgáltatáshoz.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {availableTimes.map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-3 rounded-xl font-bold text-sm transition-all border ${selectedTime === time ? 'bg-violet-600 text-white border-violet-500 shadow-lg' : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-600'}`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setStep(3)}
                    disabled={!selectedTime}
                    className="bg-zinc-100 text-zinc-950 px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-20 flex items-center gap-2"
                  >
                    Tovább <ArrowRight01Icon size={20} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* 3. LÉPÉS: ADATOK & VÉGLEGESÍTÉS */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <div className="flex items-center gap-4 mb-8">
                  <button onClick={() => setStep(2)} className="p-2 bg-zinc-900 text-zinc-400 rounded-lg hover:text-white transition-colors"><ArrowLeft01Icon size={20} /></button>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">Összegzés és Foglalás</h3>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8 flex flex-col md:flex-row justify-between md:items-center gap-6">
                  <div>
                    <span className="text-[10px] font-black text-violet-400 uppercase tracking-widest block mb-1">Kiválasztott időpont</span>
                    <div className="text-xl font-black text-white">{selectedDate.toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric' })} • {selectedTime}</div>
                    <div className="text-sm text-zinc-400 font-medium mt-1">{selectedService?.name} ({selectedService?.durationMins} perc)</div>
                  </div>
                  <div className="text-3xl font-black text-white">{selectedService?.price.toLocaleString('hu-HU')} Ft</div>
                </div>

                {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-500 text-sm rounded-xl font-bold uppercase tracking-widest text-center">{error}</div>}

                {/* VENDÉG ŰRLAP VAGY BEJELENTKEZÉS */}
                {!userId ? (
                  <div className="mb-8">
                    {/* Beágyazott In-Line Bejelentkezés */}
                    <div className="mb-8 p-5 bg-zinc-900/80 rounded-2xl border border-violet-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all overflow-hidden">
                      {showLogin ? (
                        <div className="w-full flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-bold text-white flex items-center gap-2"><UserCircleIcon size={18} className="text-violet-300" /> Bejelentkezés</h4>
                            <button onClick={() => setShowLogin(false)} className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest hover:text-white transition-colors">Vissza</button>
                          </div>

                          {loginError && <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-xs rounded-xl font-bold uppercase tracking-widest text-center">{loginError}</div>}

                          <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="E-mail cím" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-3.5 text-white font-medium focus:border-violet-500 focus:outline-none transition-colors" />
                          <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="Jelszó" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-3.5 text-white font-medium focus:border-violet-500 focus:outline-none transition-colors" />

                          <button
                            onClick={handleLogin}
                            disabled={isLoggingIn || !loginEmail || !loginPassword}
                            className="w-full mt-2 bg-violet-600 text-white px-6 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-violet-500 transition-all disabled:opacity-50"
                          >
                            {isLoggingIn ? 'Belépés folyamatban...' : 'Belépés és folytatás'}
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-violet-900/30 flex items-center justify-center text-violet-300">
                              <UserCircleIcon size={24} />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-white">Visszatérő vendég vagy?</h4>
                              <p className="text-[10px] text-violet-300/80 uppercase tracking-widest font-bold mt-0.5">Lépj be a gyorsabb foglaláshoz</p>
                            </div>
                          </div>
                          <button onClick={() => setShowLogin(true)} className="px-5 py-2.5 bg-zinc-800/50 hover:bg-zinc-700/60 text-violet-200 border border-violet-700/50 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all text-center whitespace-nowrap shadow-[0_0_10px_rgba(139,92,246,0.2)]">
                            Bejelentkezés
                          </button>
                        </>
                      )}
                    </div>

                    {!showLogin && (
                      <>
                        <div className="flex items-center gap-4 mb-6 opacity-50">
                          <div className="h-px bg-zinc-800 flex-1"></div>
                          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Vagy foglalj vendégként</span>
                          <div className="h-px bg-zinc-800 flex-1"></div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Teljes Neved</label>
                            <input type="text" value={guestName} onChange={e => setGuestName(e.target.value)} placeholder="pl. Kovács János" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 text-white font-medium focus:border-violet-500 focus:outline-none transition-colors" />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">E-mail címed</label>
                            <input type="email" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} placeholder="pl. kovacs.janos@gmail.com" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 text-white font-medium focus:border-violet-500 focus:outline-none transition-colors" />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Telefonszámod</label>
                            <input type="tel" value={guestPhone} onChange={e => setGuestPhone(e.target.value)} placeholder="+36 30 123 4567" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 text-white font-medium focus:border-violet-500 focus:outline-none transition-colors" />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="mb-8 p-5 bg-zinc-900/80 rounded-2xl border border-zinc-800 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-violet-900/30 flex items-center justify-center text-violet-300">
                      <UserCircleIcon size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Be vagy jelentkezve</h4>
                      <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mt-0.5">{userName}</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleBook}
                  disabled={isSubmitting || (!userId && (!guestName || !guestPhone || !guestEmail))}
                  className="w-full bg-violet-600 text-white px-8 py-5 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-violet-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed drop-shadow-[0_0_20px_rgba(139,92,246,0.4)]"
                >
                  {isSubmitting ? 'Feldolgozás...' : 'Foglalás Véglegesítése'}
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

// Segédkomponens a Step UI-hoz
function StepIndicator({ current, target, icon, label }: { current: number, target: number, icon: React.ReactNode, label: string }) {
  const isActive = current >= target;
  const isCurrent = current === target;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${isActive ? 'bg-violet-600 border-violet-600 text-white drop-shadow-[0_0_10px_rgba(139,92,246,0.6)]' : 'bg-zinc-900 border-zinc-800 text-zinc-600'}`}>
        {icon}
      </div>
      <span className={`text-[9px] font-black uppercase tracking-widest ${isCurrent ? 'text-violet-400' : 'text-zinc-600'}`}>{label}</span>
    </div>
  )
}