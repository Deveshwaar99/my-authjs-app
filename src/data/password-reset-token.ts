import 'server-only'

import { db } from '@/db'
import { PasswordResetTokens } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'

export async function generatePasswordResetToken(email: string) {
  try {
    const token = nanoid()
    const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

    const passwordResetToken = await db
      .insert(PasswordResetTokens)
      .values({ token, email, expires })
      .returning()
      .then(res => res[0])

    return passwordResetToken
  } catch (error) {
    console.error(`[GENERATE_PASSWORD_RESET_TOKEN_ERROR] Email: ${email}`, error)
    throw error
  }
}

export async function deletePasswordResetTokenByEmail(email: string) {
  try {
    await db.delete(PasswordResetTokens).where(eq(PasswordResetTokens.email, email))
  } catch (error) {
    console.error(`[DELETE_PASSWORD_RESET_TOKEN_BY_EMAIL_ERROR] Email: ${email}`, error)
    throw error
  }
}
export async function deletePasswordResetTokenById(id: string) {
  try {
    await db.delete(PasswordResetTokens).where(eq(PasswordResetTokens.id, id))
  } catch (error) {
    console.error(`[DELETE_PASSWORD_RESET_TOKEN_BY_ID_ERROR] Email: ${id}`, error)
    throw error
  }
}

export async function getPasswordResetTokenByToken(token: string) {
  try {
    return await db
      .select()
      .from(PasswordResetTokens)
      .where(eq(PasswordResetTokens.token, token))
      .then(res => res[0])
  } catch (error) {
    console.error('[GET_PASSWORD_RESET_TOKEN_BY_TOKEN_ERROR]', error)
    return null
  }
}

export async function getPasswordResetTokenByEmail(email: string) {
  try {
    return await db
      .select()
      .from(PasswordResetTokens)
      .where(eq(PasswordResetTokens.email, email))
      .then(res => res[0])
  } catch (error) {
    console.error('[GET_PASSWORD_RESET_TOKEN_BY_EMAIL_ERROR]', error)
    return null
  }
}
