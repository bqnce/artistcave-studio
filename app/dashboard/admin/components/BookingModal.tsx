'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Scissors, Clock, User as UserIcon, Phone, X, CheckCircle2, ChevronLeft, ChevronRight, Mail } from 'lucide-react'
import { createBooking } from '@/app/actions/bookings'
import { Service, UpcomingBooking } from '../types'

const formatToLocalISO = (date: Date) => {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().split('T')[0];
};

const monthNamesHu = ["Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"];
const shortDays = ['H', 'K', 'Sz', 'Cs', 'P', 'Sz', 'V'];

const getFormattedDate = (isoString: string) => {
  if (!isoString) return "-";
  const d = new Date(isoString);
  return `${monthNamesHu[d.getMonth()].slice(0, 3)}. ${d.getDate()}.`;
}

interface BookingModalProps {
  onClose: () => void;
  services: Service[];
  allUpcomingBookings: UpcomingBooking[];
}

export default function BookingModal({ onClose, services, allUpcomingBookings }: BookingModalProps) {
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [guestName, setGuestName] = useState("")
  const [guestPhone, setGuestPhone] = useState("")
  const [guestEmail, setGuestEmail] = useState("")
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false)
  const [bookingMessage, setBookingMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const activeServiceData = services.find((s) => s.id === selectedService);

  // --- NAPTÁR LOGIKA ---
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 30);

  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const isPrevDisabled = currentMonth.getFullYear() === today.getFullYear() && currentMonth.getMonth() === today.getMonth();
  const isNextDisabled = currentMonth.getFullYear() === maxDate.getFullYear() && currentMonth.getMonth() === maxDate.getMonth();

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const startOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1; // Hétfő = 0

  const calendarDays = [];
  for (let i = 0; i < startOffset; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));

  const isDateSelectable = (date: Date) => {
    if (!date) return false;
    if (date.getDay() === 0) return false; // Vasárnap zárva
    if (date < today) return false;
    if (date > maxDate) return false;
    return true;
  };

  // --- ÜTKÖZÉSVIZSGÁLAT LOGIKA ---
  const occupiedSlots = allUpcomingBookings.map(booking => {
    const service = services.find(s => s.name === booking.serviceName);
    const durationMins = service ? service.durationMins : 30;
    const start = new Date(booking.date);
    const end = new Date(start.getTime() + durationMins * 60000);
    return { start, end };
  });

  const getAvailableTimeSlots = () => {
    if (!selectedDate || !activeServiceData) return [];

    const slots: string[] = [];
    const now = new Date();
    const serviceDurationMs = activeServiceData.durationMins * 60000;

    for (let h = 10; h <= 17; h++) {
      ["00", "15", "30", "45"].forEach((m) => {
        const timeString = `${h}:${m}`;
        const slotStart = new Date(`${selectedDate}T${timeString}`);
        const slotEnd = new Date(slotStart.getTime() + serviceDurationMs);

        if (slotStart <= now) return;

        const isOverlapping = occupiedSlots.some(occ => {
          return slotStart < occ.end && slotEnd > occ.start;
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
    setIsBookingSubmitting(true);
    setBookingMessage(null);

    const formData = new FormData();
    formData.append('serviceId', selectedService);
    formData.append('date', `${selectedDate}T${selectedTime}`);
    formData.append('guestName', guestName);
    formData.append('guestPhone', guestPhone);
    formData.append('guestEmail', guestEmail);


    const res = await createBooking(formData);
    setIsBookingSubmitting(false);

    if (res.success) {
      setBookingMessage({ type: 'success', text: 'Sikeres foglalás!' });
      setSelectedService(null);
      setSelectedDate(null);
      setSelectedTime(null);
      setGuestName("");
      setGuestPhone("");
      setGuestEmail("")
      setTimeout(onClose, 2000);
    } else {
      setBookingMessage({ type: 'error', text: res.error || 'Hiba történt a foglalás során.' });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-950/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-5xl max-h-[95vh] bg-zinc-950 border border-zinc-800/60 rounded-[2rem] shadow-2xl flex flex-col relative overflow-hidden"
      >
        <div className="flex-shrink-0 flex items-center justify-between p-6 md:px-10 border-b border-zinc-800/60 bg-zinc-950/50 backdrop-blur-xl z-20">
          <div>
            <span className="text-red-500 uppercase tracking-[0.2em] font-black text-[10px] mb-1 block">Admin Rögzítés</span>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">Új Időpont Hozzáadása</h2>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 relative">
            <div className="lg:col-span-7 flex flex-col gap-10">

              {/* 1. Szolgáltatás */}
              <div className="flex flex-col gap-4">
                <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <Scissors size={14} className="text-red-500" /> 1. Szolgáltatás
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {services.map((service) => {
                    const isSelected = selectedService === service.id;
                    return (
                      <button
                        key={service.id}
                        onClick={() => { setSelectedService(service.id); setSelectedTime(null); }}
                        className={`relative flex flex-col text-left p-5 rounded-2xl border transition-all duration-300 overflow-hidden group ${isSelected ? "border-red-500 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.1)]" : "border-zinc-800 bg-zinc-900/30 hover:border-zinc-700"
                          }`}
                      >
                        {isSelected && <CheckCircle2 size={16} className="absolute top-4 right-4 text-red-500" />}
                        <span className={`font-bold text-sm mb-1 ${isSelected ? "text-red-100" : "text-zinc-200"}`}>{service.name}</span>
                        <div className="flex items-center gap-3 text-[11px] font-medium tracking-wide">
                          <span className={isSelected ? "text-red-400" : "text-zinc-500"}>{service.durationMins} perc</span>
                          <span className="text-zinc-700">•</span>
                          <span className={isSelected ? "text-red-300" : "text-zinc-400"}>{service.price.toLocaleString('hu-HU')} Ft</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 2. ÚJ NAPTÁR (Dátum) */}
              <div className={`flex flex-col gap-4 transition-opacity duration-500 ${selectedService ? "opacity-100" : "opacity-30 pointer-events-none"}`}>
                <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <Calendar size={14} className={selectedService ? "text-red-500" : "text-zinc-600"} /> 2. Dátum
                </h3>

                <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-3xl p-5 sm:p-6 shadow-inner">
                  <div className="flex items-center justify-between mb-5">
                    <button onClick={handlePrevMonth} disabled={isPrevDisabled} type="button" className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-800 text-zinc-400 disabled:opacity-30 disabled:hover:bg-transparent transition-all">
                      <ChevronLeft size={18} />
                    </button>
                    <span className="text-sm font-black uppercase tracking-widest text-zinc-200">
                      {monthNamesHu[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </span>
                    <button onClick={handleNextMonth} disabled={isNextDisabled} type="button" className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-800 text-zinc-400 disabled:opacity-30 disabled:hover:bg-transparent transition-all">
                      <ChevronRight size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {shortDays.map((d, index) => (
                      <div key={`day-${index}`} className="text-[10px] font-bold uppercase text-zinc-500 text-center">{d}</div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1 sm:gap-2">
                    {calendarDays.map((date, i) => {
                      if (!date) return <div key={`empty-${i}`} className="p-2"></div>;

                      const selectable = isDateSelectable(date);
                      const dateStr = formatToLocalISO(date);
                      const isSelected = selectedDate === dateStr;
                      const isToday = formatToLocalISO(today) === dateStr;

                      return (
                        <button
                          key={i}
                          type="button"
                          disabled={!selectable}
                          onClick={() => { setSelectedDate(dateStr); setSelectedTime(null); }}
                          className={`relative h-10 w-full sm:h-12 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-300
                            ${isSelected
                              ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] scale-105 z-10'
                              : selectable
                                ? 'bg-zinc-950 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800/50 hover:border-zinc-600'
                                : 'text-zinc-700 cursor-not-allowed opacity-30'}
                          `}
                        >
                          {date.getDate()}
                          {isToday && !isSelected && (
                            <div className="absolute bottom-1 w-1 h-1 rounded-full bg-red-500/50"></div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* 3. Időpont */}
              <div className={`flex flex-col gap-4 transition-opacity duration-500 ${selectedDate ? "opacity-100" : "opacity-30 pointer-events-none"}`}>
                <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <Clock size={14} className={selectedDate ? "text-red-500" : "text-zinc-600"} /> 3. Szabad Időpontok
                </h3>
                {availableTimeSlots.length === 0 ? (
                  <div className="text-[11px] font-bold uppercase tracking-widest text-red-500 bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-center">Nincs szabad hely ezen a napon.</div>
                ) : (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                    {availableTimeSlots.map((time, index) => {
                      const isSelected = selectedTime === time;
                      return (
                        <button
                          key={index}
                          onClick={() => setSelectedTime(time)}
                          className={`py-3 text-xs font-bold rounded-xl border transition-all duration-300 ${isSelected ? "border-red-500 bg-red-500 text-white shadow-lg shadow-red-500/20 scale-105" : "border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
                            }`}
                        >
                          {time}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* JOBB OSZLOP: ADATOK */}
            <div className="lg:col-span-5 relative">
              <div className="sticky top-0 bg-zinc-900/30 border border-zinc-800/50 p-6 md:p-8 rounded-3xl flex flex-col gap-8 backdrop-blur-md">

                <div>
                  <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-zinc-800/60 pb-3 mb-4">Összegzés</h3>
                  <div className="flex flex-col gap-3 text-sm font-medium">
                    <div className="flex justify-between items-center"><span className="text-zinc-500">Szolgáltatás:</span><span className="text-zinc-200 font-bold">{activeServiceData ? activeServiceData.name : "-"}</span></div>
                    <div className="flex justify-between items-center"><span className="text-zinc-500">Dátum:</span><span className="text-zinc-200 font-bold">{selectedDate ? getFormattedDate(selectedDate) : "-"}</span></div>
                    <div className="flex justify-between items-center"><span className="text-zinc-500">Időpont:</span><span className="text-red-400 font-bold">{selectedTime ? selectedTime : "-"}</span></div>
                    {activeServiceData && (
                      <div className="flex justify-between items-center pt-3 mt-1 border-t border-zinc-800/60">
                        <span className="text-zinc-400 font-bold text-xs uppercase tracking-widest">Fizetendő:</span>
                        <span className="text-white font-black text-lg">{activeServiceData.price.toLocaleString('hu-HU')} Ft</span>
                      </div>
                    )}
                  </div>
                </div>

                {bookingMessage && (
                  <div className={`p-4 rounded-xl border flex items-center justify-center text-center ${bookingMessage.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                    <span className="text-xs font-bold uppercase tracking-widest">{bookingMessage.text}</span>
                  </div>
                )}

                <div className={`flex flex-col gap-4 transition-opacity duration-500 ${selectedTime && bookingMessage?.type !== 'success' ? "opacity-100" : "opacity-30 pointer-events-none"}`}>
                  <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-zinc-800/60 pb-3">Vendég Adatai</h3>

                  <div className="relative group">
                    <UserIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-zinc-500 group-focus-within:text-red-400 transition-colors" />
                    <input type="text" placeholder="Vendég neve" value={guestName} onChange={(e) => setGuestName(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3.5 pl-11 pr-4 text-sm text-zinc-100 focus:outline-none focus:border-red-500 transition-colors" />
                  </div>

                  {/* ÚJ */}
                  <div className="relative group">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-zinc-500 group-focus-within:text-red-400 transition-colors" />
                    <input type="email" placeholder="E-mail cím" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3.5 pl-11 pr-4 text-sm text-zinc-100 focus:outline-none focus:border-red-500 transition-colors" />
                  </div>

                  <div className="relative group">
                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-zinc-500 group-focus-within:text-red-400 transition-colors" />
                    <input type="tel" placeholder="Telefonszám (+36...)" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3.5 pl-11 pr-4 text-sm text-zinc-100 focus:outline-none focus:border-red-500 transition-colors" />
                  </div>

                  <button onClick={handleBookingSubmit} disabled={!guestName || isBookingSubmitting} className={`mt-2 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${guestName && !isBookingSubmitting ? "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20 hover:scale-[1.02]" : "bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed"}`}>
                    {isBookingSubmitting ? 'Feldolgozás...' : 'Időpont Véglegesítése'}
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}