'use server'

import { prisma } from '@/lib/prisma'

export async function syncUserToDatabase(id: string, email: string, name: string, phone: string) {
  try {
    // Létrehozzuk a felhasználót a Supabase-től kapott PONTOS ID-val!
    const user = await prisma.user.create({
      data: {
        id, // <-- Ez köti össze a két rendszert!
        email,
        name,
        phone,
      },
    })
    
    return { success: true, user }
  } catch (error) {
    console.error('Adatbázis szinkronizációs hiba:', error)
    return { error: 'Sikeres hitelesítés, de hiba történt a profil mentésekor.' }
  }
}