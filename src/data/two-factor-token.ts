import 'server-only'

import crypto from 'node:crypto'
import { db } from '@/db'
import { TwoFactorConfirmationTokens } from '@/db/schema'
import { eq } from 'drizzle-orm'
import 'server-only'

export async function generateTwoFactorToken({ userId, email }: { userId: string; email: string }) {
  try {
    const otp = crypto.randomInt(100_000, 1_000_000).toString()
    const expires = new Date(Date.now() + 1000 * 60 * 15) // 15 mins from now

    const twoFactorConfirmationToken = await db
      .insert(TwoFactorConfirmationTokens)
      .values({ userId, email, otp, expires })
      .returning()
      .then(res => res[0])

    return twoFactorConfirmationToken
  } catch (error) {
    console.error(`[GENERATE_TWO_FACTOR_TOKEN_ERROR] UserID: ${userId}, Email: ${email}`, error)
    throw error
  }
}

export async function getTwoFactorTokenByUserId({ userId }: { userId: string }) {
  try {
    const twoFactorConfirmationToken = await db
      .select()
      .from(TwoFactorConfirmationTokens)
      .where(eq(TwoFactorConfirmationTokens.userId, userId))
      .then(res => res[0])

    return twoFactorConfirmationToken
  } catch (error) {
    console.error(`[GET_TWO_FACTOR_TOKEN_ERROR] UserID: ${userId}`, error)
    throw error
  }
}

export async function deleteExistingTwoFactorTokenByUserId({ userId }: { userId: string }) {
  try {
    await db
      .delete(TwoFactorConfirmationTokens)
      .where(eq(TwoFactorConfirmationTokens.userId, userId))
  } catch (error) {
    console.error(`[DELETE_TWO_FACTOR_TOKEN_ERROR] UserID: ${userId}`, error)
    throw error
  }
}

export async function deleteExistingTwoFactorTokenById({ id }: { id: string }) {
  try {
    await db.delete(TwoFactorConfirmationTokens).where(eq(TwoFactorConfirmationTokens.id, id))
  } catch (error) {
    console.error(`[DELETE_TWO_FACTOR_TOKEN_BY_IDERROR] ID: ${id}`, error)
    throw error
  }
}

export async function confirmTwoFactorTokenByTokenId({ tokenId }: { tokenId: string }) {
  try {
    await db
      .update(TwoFactorConfirmationTokens)
      .set({ status: 'CONFIRMED' })
      .where(eq(TwoFactorConfirmationTokens.id, tokenId))
  } catch (error) {
    console.error('[CONFIRM_TWO_FACTOR_TOKEN_ERROR]', error)
    throw error
  }
}
