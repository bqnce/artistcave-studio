'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createTimeBlock(formData: FormData) {
  try {
    const start = new Date(formData.get('start') as string)
    const end = new Date(formData.get('end') as string)
    const title = formData.get('title') as string || 'Szabadság'

    // Biztonsági ellenőrzés
    if (start >= end) {
      return { success: false, error: 'A befejezés nem lehet korábban, mint a kezdés!' }
    }

    // Ütközésvizsgálat: Biztosítsuk, hogy nincs már ott egy befoglalt vendég
    const overlappingAppointments = await prisma.appointment.findMany({
      where: {
        status: { not: "CANCELLED" },
        AND: [
          { date: { lt: end } },
          { endTime: { gt: start } }
        ]
      }
    })

    if (overlappingAppointments.length > 0) {
      return { success: false, error: 'Ebben az idősávban már van aktív vendégfoglalás! Előbb mondd le a foglalást.' }
    }

    await prisma.timeBlock.create({
      data: { start, end, title }
    })

    // Frissítjük a cache-t mindenhol, hogy eltűnjenek a szabad időpontok
    revalidatePath('/dashboard')
    revalidatePath('/')
    
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Kritikus hiba történt a blokkolás mentésekor.' }
  }
}

export async function deleteTimeBlock(id: string) {
  try {
    await prisma.timeBlock.delete({ where: { id } })
    revalidatePath('/dashboard')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Hiba a blokkolás törlésénél.' }
  }
}