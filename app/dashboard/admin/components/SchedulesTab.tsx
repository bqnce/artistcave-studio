'use client'

import { useState, useEffect } from 'react'
import { 
  Clock01Icon, 
  Scissor01Icon, 
  Package01Icon, 
  Settings02Icon, 
  Delete02Icon, 
  Store01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon
} from 'hugeicons-react'
import { UpcomingBooking, TimeBlock } from '../types'
import { deleteTimeBlock } from '@/app/actions/schedules'

interface Props {
  timeBlocks: TimeBlock[]
  allUpcomingBookings: UpcomingBooking[]
  onOpenBookingModal: () => void
  onOpenTimeBlockModal: (date: Date) => void
}

const START_HOUR = 8;
const END_HOUR = 20;
const TOTAL_HOURS = END_HOUR - START_HOUR;
const ROW_HEIGHT = 80;

export default function SchedulesTab({ timeBlocks, allUpcomingBookings, onOpenBookingModal, onOpenTimeBlockModal }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [currentMonthView, setCurrentMonthView] = useState<Date>(new Date())
  const [currentTimeMinutes, setCurrentTimeMinutes] = useState(0)
  const [now, setNow] = useState(new Date())

  // --- VALÓS IDEJŰ ÓRA ---
  useEffect(() => {
    const updateTime = () => {
      const currentNow = new Date();
      setNow(currentNow);
      
      if (isSameDay(currentNow, selectedDate)) {
        setCurrentTimeMinutes((currentNow.getHours() - START_HOUR) * 60 + currentNow.getMinutes());
      } else {
        setCurrentTimeMinutes(-1);
      }
    };
    updateTime();
    const timer = setInterval(updateTime, 60000); 
    return () => clearInterval(timer);
  }, [selectedDate]);

  // --- SEGÉDFÜGGVÉNYEK ---
  const isSameDay = (d1: string | Date, d2: Date) => {
    const date1 = new Date(d1);
    return date1.getFullYear() === d2.getFullYear() && date1.getMonth() === d2.getMonth() && date1.getDate() === d2.getDate()
  }

  const formatTime = (isoString: string | null) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Budapest' });
  }

  async function handleDeleteBlock(id: string) {
    if(confirm('Biztosan törlöd ezt a blokkolást/szabadságot?')) {
      await deleteTimeBlock(id)
    }
  }

  // --- SAJÁT NAPTÁR MATEMATIKA ---
  const prevMonth = () => {
    setCurrentMonthView(new Date(currentMonthView.getFullYear(), currentMonthView.getMonth() - 1, 1));
  }
  const nextMonth = () => {
    setCurrentMonthView(new Date(currentMonthView.getFullYear(), currentMonthView.getMonth() + 1, 1));
  }

  const generateCalendarDays = () => {
    const year = currentMonthView.getFullYear();
    const month = currentMonthView.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Hétfő = 0 alapú eltolás kiszámítása
    let startOffset = firstDay.getDay() - 1;
    if (startOffset === -1) startOffset = 6; // Vasárnap

    const days: (Date | null)[] = [];
    for (let i = 0; i < startOffset; i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));
    
    return days;
  }

  const calendarDays = generateCalendarDays();
  const weekDays = ['H', 'K', 'Sze', 'Cs', 'P', 'Szo', 'V'];

  // Napi szűrések
  const dayBookings = allUpcomingBookings.filter(b => isSameDay(b.date, selectedDate))
  const dayBlocks = timeBlocks.filter(b => isSameDay(b.start, selectedDate))

  return (
    <div className="flex flex-col h-full gap-8">
      
      {/* FEJLÉC ÉS AKCIÓK */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-6 border-b border-zinc-800/80">
        <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-100 uppercase tracking-tighter flex items-center gap-3">
          <Clock01Icon size={32} className="text-red-500" /> IDŐPONTOK
        </h1>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => onOpenTimeBlockModal(selectedDate)} 
            className="px-5 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-[11px] font-black text-zinc-300 hover:text-white hover:border-zinc-600 transition-all uppercase tracking-widest flex items-center gap-2"
          >
             <Package01Icon size={16} /> Szabadság / Blokkolás
          </button>
          <button 
            onClick={onOpenBookingModal} 
            className="px-5 py-3 bg-red-600 text-white border border-red-700 rounded-xl text-[11px] font-black hover:bg-red-500 hover:scale-[1.02] transition-all uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-red-600/20"
          >
            <Scissor01Icon size={16} /> Új Vendég
          </button>
        </div>
      </div>

      {/* OSZTOTT KÉPERNYŐS LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        
        {/* BAL OLDAL: Saját építésű Naptár */}
        <div className="lg:col-span-4 bg-zinc-950 border border-zinc-800 p-6 rounded-3xl shadow-inner flex flex-col gap-6 h-fit">
          <div className="flex items-center justify-between border-b border-zinc-800/60 pb-4">
            <button onClick={prevMonth} className="p-2 bg-zinc-900 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"><ArrowLeft01Icon size={18} /></button>
            <span className="text-sm font-bold uppercase tracking-widest text-zinc-200">
              {currentMonthView.toLocaleDateString('hu-HU', { year: 'numeric', month: 'long' })}
            </span>
            <button onClick={nextMonth} className="p-2 bg-zinc-900 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"><ArrowRight01Icon size={18} /></button>
          </div>

          <div className="w-full">
            {/* Napok fejléce */}
            <div className="grid grid-cols-7 mb-2">
              {weekDays.map(day => (
                <div key={day} className="text-center text-[10px] font-bold uppercase tracking-widest text-zinc-500 py-2">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Naptár rács */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((date, i) => {
                if (!date) return <div key={`empty-${i}`} className="h-10 w-full" />;
                
                const isSelected = isSameDay(date, selectedDate);
                const isToday = isSameDay(date, new Date());

                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    className={`h-10 w-full rounded-xl text-sm font-bold transition-all relative flex items-center justify-center
                      ${isSelected ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'}
                      ${isToday && !isSelected ? 'text-red-400' : ''}
                    `}
                  >
                    {date.getDate()}
                    {/* Mai nap jelző pötty, ha nincs kiválasztva */}
                    {isToday && !isSelected && (
                      <span className="absolute bottom-1 w-1 h-1 bg-red-500 rounded-full"></span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* JOBB OLDAL: Napi idővonal (Timeline) */}
        <div className="lg:col-span-8 bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col relative h-[600px] lg:h-[700px]">
          
          <div className="p-6 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl z-20 sticky top-0">
              <span className="text-red-500 text-[10px] font-black uppercase tracking-[0.2em] block mb-1">
                 {isSameDay(now, selectedDate) ? "Ma" : selectedDate.toLocaleDateString('hu-HU', { weekday: 'long' })}
              </span>
              <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
                {selectedDate.toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric'})}
              </h3>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar relative px-4 sm:px-6 py-4">
            <div className="relative w-full" style={{ height: `${TOTAL_HOURS * ROW_HEIGHT}px`, marginTop: '10px', marginBottom: '40px' }}>
              
              {/* Órasáv rács */}
              {Array.from({ length: TOTAL_HOURS + 1 }).map((_, i) => {
                const hour = START_HOUR + i;
                const top = i * ROW_HEIGHT;
                return (
                  <div key={hour} className="absolute w-full flex items-center" style={{ top: `${top}px`, transform: 'translateY(-50%)' }}>
                    <div className="w-[50px] flex-shrink-0 text-[11px] font-black text-zinc-500 tracking-widest bg-zinc-950">
                      {hour.toString().padStart(2, '0')}:00
                    </div>
                    <div className="flex-1 border-t border-zinc-800/60"></div>
                  </div>
                );
              })}

              {/* AKTUÁLIS IDŐ VONAL */}
              {currentTimeMinutes > 0 && currentTimeMinutes < TOTAL_HOURS * 60 && (
                <div 
                  className="absolute left-[50px] right-0 flex items-center z-30 pointer-events-none" 
                  style={{ top: `${(currentTimeMinutes / 60) * ROW_HEIGHT}px`, transform: 'translateY(-50%)' }}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                  <div className="flex-1 h-[2px] bg-red-500 rounded-full opacity-80"></div>
                </div>
              )}

              {/* Részletek renderelése (Vendégek & Blokkok) */}
              <div className="absolute left-[60px] right-0 top-0 bottom-0 z-10">
                
                {/* 1. VENDÉG FOGLALÁSOK RENDERELÉSE */}
                {dayBookings.map(booking => {
                  const startTime = new Date(booking.date);
                  const durationMins = 45; 
                  const endTime = new Date(startTime.getTime() + durationMins * 60000);
                  const isPast = endTime < now;

                  const startMins = (startTime.getHours() - START_HOUR) * 60 + startTime.getMinutes();
                  const top = (startMins / 60) * ROW_HEIGHT;
                  const height = (durationMins / 60) * ROW_HEIGHT;

                  return (
                    <div 
                      key={booking.id} 
                      className={`absolute left-0 right-4 rounded-2xl p-4 flex flex-col justify-center overflow-hidden transition-all duration-300 cursor-default group shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] ${
                        isPast 
                          ? 'bg-zinc-900/40 border border-zinc-800/30 opacity-40 grayscale' 
                          : 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-800'
                      }`}
                      style={{ top: `${top}px`, height: `${height - 4}px` }} 
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex flex-shrink-0 items-center justify-center border ${
                          isPast ? 'bg-zinc-900/50 text-zinc-500 border-zinc-800/50' : 'bg-zinc-950 text-red-500 border-zinc-800/80'
                        }`}>
                          <Store01Icon size={18} />
                        </div>
                        <div className="flex flex-col">
                           <span className={`text-sm font-bold uppercase tracking-wider line-clamp-1 ${isPast ? 'text-zinc-400' : 'text-white'}`}>
                             {booking.guestName}
                           </span>
                           <span className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 line-clamp-1 ${isPast ? 'text-zinc-600' : 'text-zinc-400'}`}>
                             {booking.serviceName} • {formatTime(booking.date)}
                           </span>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {/* 2. SZABADSÁGOK / BLOKKOK RENDERELÉSE */}
                {dayBlocks.map(block => {
                  const startDate = new Date(block.start);
                  const endDate = new Date(block.end);
                  const isPast = endDate < now;

                  const startMins = (startDate.getHours() - START_HOUR) * 60 + startDate.getMinutes();
                  const top = (startMins / 60) * ROW_HEIGHT;
                  const durationMins = (endDate.getTime() - startDate.getTime()) / 60000;
                  const height = (durationMins / 60) * ROW_HEIGHT;

                  return (
                    <div 
                      key={block.id} 
                      className={`absolute left-0 right-4 border-l-4 rounded-r-2xl px-5 py-4 flex flex-col justify-center relative overflow-hidden group shadow-[0_0_15px_rgba(239,68,68,0.05)] ${
                        isPast
                          ? 'bg-red-950/5 border-red-900/30 opacity-40 grayscale'
                          : 'bg-red-950/20 border-red-600'
                      }`}
                      style={{ top: `${top}px`, height: `${height - 4}px` }} 
                    >
                      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #ef4444 10px, #ef4444 20px)' }}></div>
                      
                      <div className="flex items-center gap-4 relative z-10">
                        <div className={`w-10 h-10 rounded-full flex flex-shrink-0 items-center justify-center border ${
                          isPast ? 'bg-red-950/20 text-red-800 border-red-900/30' : 'bg-red-950/40 text-red-500 border-red-900/50'
                        }`}>
                          <Settings02Icon size={18} />
                        </div>
                        <div className="flex flex-col">
                            <span className={`text-sm font-bold uppercase tracking-wider line-clamp-1 ${isPast ? 'text-red-900/60' : 'text-red-100'}`}>
                              {block.title}
                            </span>
                            <span className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${isPast ? 'text-red-900/40' : 'text-red-400'}`}>
                               {formatTime(block.start)} - {formatTime(block.end)}
                            </span>
                        </div>
                      </div>
                      
                      {!isPast && (
                        <button 
                          onClick={() => handleDeleteBlock(block.id)} 
                          className="absolute top-1/2 -translate-y-1/2 right-4 text-red-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all z-20 bg-zinc-950 p-2 rounded-full border border-red-900/50 shadow-lg"
                        >
                          <Delete02Icon size={16} />
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}