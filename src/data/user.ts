'use server'

import { db } from '@/db'
import { Role, users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import bcryptjs from 'bcryptjs'

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

export async function verifyUserEmailById(id: string, email: string) {
  try {
    await db.update(users).set({ email, emailVerified: new Date() }).where(eq(users.id, id))
  } catch (error) {
    console.error('[VERIFY_USER_EMAIL_BY_ID_ERROR]', error)
    throw new Error('Failed to verify user email.')
  }
}

export async function updateUserPassword({
  userId,
  password,
}: {
  userId: string
  password: string
}) {
  try {
    const hashedPassword = await bcryptjs.hash(password, 10)

    await db.update(users).set({ password: hashedPassword }).where(eq(users.id, userId))
  } catch (error) {
    console.error('[UPDATE_USER_PASSWORD_ERROR]', error)
    throw new Error('Failed to verify user email.')
  }
}

export async function updateOAuthUserInfo(
  userId: string,
  updates: Partial<{ name: string; role: 'USER' | 'ADMIN'; isTwoFactorEnabled: boolean }>,
) {
  try {
    await db.update(users).set(updates).where(eq(users.id, userId))
  } catch (error) {
    console.error('[UPDATE_OAUTH_USER_INFO_ERROR]', error)
    throw new Error('Failed to update user info.')
  }
}

export async function updateCredentialsUserInfo(
  userId: string,
  updates: Partial<{
    name: string
    role: 'USER' | 'ADMIN'
    isTwoFactorEnabled: boolean
    password: string
  }>,
) {
  try {
    await db.update(users).set(updates).where(eq(users.id, userId))
  } catch (error) {
    console.error('[UPDATE_CREDENTIALS_USER_INFO_ERROR]', error)
    throw new Error('Failed to update user info.')
  }
}
