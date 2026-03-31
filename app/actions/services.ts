'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// 1. Összes szolgáltatás lekérése
export async function getServices() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { name: 'asc' } // Ábécé sorrendben adja vissza
    })
    return { success: true, services }
  } catch (error) {
    console.error("Kritikus hiba a szolgáltatások lekérésekor:", error)
    return { success: false, error: "Nem sikerült betölteni az adatbázist." }
  }
}

// 2. Új szolgáltatás létrehozása
export async function createService(formData: FormData) {
  try {
    const name = formData.get('name') as string
    const durationMins = parseInt(formData.get('durationMins') as string)
    const price = parseInt(formData.get('price') as string)
    const description = formData.get('description') as string | null

    // Szigorú backend validáció: Nem bízunk a frontendben!
    if (!name || isNaN(durationMins) || isNaN(price)) {
      return { success: false, error: "Minden kötelező mezőt (Név, Időtartam, Ár) pontosan ki kell tölteni." }
    }

    await prisma.service.create({
      data: {
        name,
        durationMins,
        price,
        description
      }
    })

    // Újratöltjük az admin felületet, hogy azonnal látszódjon a változás
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error("Hiba a szolgáltatás létrehozásakor:", error)
    return { success: false, error: "Rendszerhiba történt a mentés során." }
  }
}

// 3. Szolgáltatás törlése
export async function deleteService(id: string) {
  try {
    await prisma.service.delete({
      where: { id }
    })
    revalidatePath('/dashboard')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Hiba a szolgáltatás törlésénél.' }
  }
}

export async function updateService(id: string, formData: FormData) {
  try {
    const name = formData.get('name') as string
    const durationMins = parseInt(formData.get('durationMins') as string)
    const price = parseInt(formData.get('price') as string)
    const description = formData.get('description') as string

    await prisma.service.update({
      where: { id },
      data: { name, durationMins, price, description }
    })

    revalidatePath('/dashboard')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Hiba a szolgáltatás módosításánál.' }
  }
}

