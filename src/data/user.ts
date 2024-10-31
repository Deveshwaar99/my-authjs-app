'use server'

import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function getUserByEmail(email: string) {
  try {
    const res = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .then(res => res[0])
    return res ?? null
  } catch (error) {
    console.error('[GET_USER_BY_EMAIL_ERROR]', error)
    return null
  }
}

export async function getUserById(id: string) {
  try {
    return await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .then(res => res[0])
  } catch (error) {
    console.error('[GET_USER_BY_ID_ERROR]', error)
    return null
  }
}
