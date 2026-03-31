'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createBooking(formData: FormData) {
  try {
    const serviceId = formData.get('serviceId') as string
    const dateString = formData.get('date') as string // A frontend küldi ISO formátumban
    const guestName = formData.get('guestName') as string | null
    const guestPhone = formData.get('guestPhone') as string | null
    const userId = formData.get('userId') as string | null
    const notes = formData.get('notes') as string | null
    const guestEmail = formData.get('guestEmail') as string | null

    // 1. Alap validáció
    if (!serviceId || !dateString) {
      return { success: false, error: "Hiányzó adatok. Szolgáltatás és időpont kötelező!" }
    }

    const date = new Date(dateString)
    if (date < new Date()) {
      return { success: false, error: "Múltbeli időpontra nem foglalhatsz!" }
    }

    // 2. Szolgáltatás lekérése (hogy megkapjuk a hosszát percekben)
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    })

    if (!service) {
      return { success: false, error: "A választott szolgáltatás nem található." }
    }

    // Kiszámoljuk a pontos befejezési időt
    const endTime = new Date(date.getTime() + service.durationMins * 60000)

    // 3. ÜTKÖZÉSVIZSGÁLAT (A legfontosabb rész)
    // Megnézzük az adatbázisban, van-e olyan foglalás, amivel ez az idősáv metszi egymást
    const conflictingBooking = await prisma.appointment.findFirst({
      where: {
        OR: [
          { // 1. Eset: Az új foglalás kezdete beleesik egy meglévő foglalásba
            date: { lte: date },
            endTime: { gt: date }
          },
          { // 2. Eset: Az új foglalás vége beleesik egy meglévő foglalásba
            date: { lt: endTime },
            endTime: { gte: endTime }
          },
          { // 3. Eset: Az új foglalás teljesen bekebelez egy rövidebb meglévő foglalást
            date: { gte: date },
            endTime: { lte: endTime }
          }
        ],
        status: { not: "CANCELLED" } // A lemondott időpontokat figyelmen kívül hagyjuk
      }
    })

    if (conflictingBooking) {
      return { success: false, error: "Ez az időpont sajnos már foglalt, vagy belelóg egy másik foglalásba. Kérlek válassz másikat!" }
    }

    const conflictingBlock = await prisma.timeBlock.findFirst({
      where: {
        OR: [
          { start: { lte: date }, end: { gt: date } },
          { start: { lt: endTime }, end: { gte: endTime } },
          { start: { gte: date }, end: { lte: endTime } }
        ]
      }
    })
    
    if (conflictingBlock) {
      return { success: false, error: `Ez az időszak blokkolva van: „${conflictingBlock.title}". Kérlek válassz másik időpontot!` }
    }

    // 4. Foglalás mentése, ha a sáv tiszta
    await prisma.appointment.create({
      data: {
        date,
        endTime,
        serviceId,
        userId: userId || null,
        guestName,
        guestPhone,
        guestEmail,   // ÚJ
        notes,
        status: "CONFIRMED"
      }
    })

    // Frissítjük a cache-t, hogy minden naptár azonnal az új állapotot mutassa
    revalidatePath('/')
    revalidatePath('/dashboard')
    
    return { success: true }
  } catch (error) {
    console.error("Kritikus hiba a foglaláskor:", error)
    return { success: false, error: "Rendszerhiba történt a foglalás során." }
  }
}

export async function cancelBooking(bookingId: string) {
  try {
    await prisma.appointment.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" }
    })
    
    revalidatePath('/dashboard')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error("Hiba a lemondásnál:", error)
    return { success: false, error: "Nem sikerült lemondani az időpontot." }
  }
}

