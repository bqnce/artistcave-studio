'use server'

import * as React from 'react'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Resend } from 'resend'
import { render } from '@react-email/components'
import GuestEmail from '@/app/emails/GuestEmail'
import AdminEmail from '@/app/emails/AdminEmail'

// Resend inicializálása
const resend = new Resend(process.env.RESEND_API_KEY)

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

    // 2. Szolgáltatás lekérése (hogy megkapjuk a hosszát percekben és az árát)
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    })

    if (!service) {
      return { success: false, error: "A választott szolgáltatás nem található." }
    }

    // Kiszámoljuk a pontos befejezési időt
    const endTime = new Date(date.getTime() + service.durationMins * 60000)

    // 3. ÜTKÖZÉSVIZSGÁLAT 
    const conflictingBooking = await prisma.appointment.findFirst({
      where: {
        OR: [
          { date: { lte: date }, endTime: { gt: date } },
          { date: { lt: endTime }, endTime: { gte: endTime } },
          { date: { gte: date }, endTime: { lte: endTime } }
        ],
        status: { not: "CANCELLED" }
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

    // 4. Foglalás mentése
    await prisma.appointment.create({
      data: {
        date,
        endTime,
        serviceId,
        userId: userId || null,
        guestName,
        guestPhone,
        guestEmail,
        notes,
        status: "CONFIRMED"
      }
    })

    // --- 5. E-MAIL KÜLDÉSI BLOKK ---
    const formattedDate = date.toLocaleString('hu-HU', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    try {
      // 5/A. E-mail a Vendégnek (Csak ha megadta az email címét)
      if (guestEmail) {
        // 1. Lefordítjuk a React komponenst tiszta HTML-re
        const guestHtml = await render(
          <GuestEmail
            guestName={guestName || 'Vendég'}
            serviceName={service.name}
            dateTimeStr={formattedDate}
            price={service.price}
          />
        );

        // 2. Elküldjük a generált HTML-t
        await resend.emails.send({
          from: 'Artist Cave <onboarding@resend.dev>',
          to: guestEmail,
          subject: 'Időpontod megerősítve - Artist Cave',
          html: guestHtml // <-- ITT A VÁLTOZÁS! react prop helyett html prop
        });
      }

      // 5/B. E-mail az Adminnak (Neked)
      const ADMIN_EMAIL = 'csobadibence@gmail.com'; // <--- IDE ÍRD A SAJÁT CÍMED!

      const adminHtml = await render(
        <AdminEmail
          guestName={guestName || 'Ismeretlen'}
          guestPhone={guestPhone || 'Nem adta meg'}
          guestEmail={guestEmail || 'Nem adta meg'}
          serviceName={service.name}
          dateTimeStr={formattedDate}
        />
      );

      await resend.emails.send({
        from: 'Artist Cave Rendszer <onboarding@resend.dev>',
        to: ADMIN_EMAIL,
        subject: 'Új foglalás: ' + (guestName || 'Ismeretlen'),
        html: adminHtml // <-- ITT A VÁLTOZÁS! react prop helyett html prop
      });
    } catch (emailError) {
      console.error("Hiba az e-mail kiküldésekor:", emailError);
    }

    // Frissítjük a cache-t
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