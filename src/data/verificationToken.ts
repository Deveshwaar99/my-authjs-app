'use server'

import { db } from '@/db'
import type * as schema from '@/db/schema'
import { verificationTokens } from '@/db/schema'
import { eq } from 'drizzle-orm'
import type { PgTransaction } from 'drizzle-orm/pg-core'
import type { PostgresJsDatabase, PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js'
import { nanoid } from 'nanoid'
import type { Sql } from 'postgres'

export type CustomPostgresDatabase = PostgresJsDatabase<typeof import('@/db/schema')> & {
  $client: Sql<Record<string, unknown>>
}

export type CustomPgTransaction = PgTransaction<PostgresJsQueryResultHKT, typeof schema>

export async function generateVerificationToken(
  email: string,
  trx: CustomPgTransaction | CustomPostgresDatabase = db,
) {
  try {
    const token = nanoid()
    const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

    const [verificationToken] = await trx
      .insert(verificationTokens)
      .values({ token, email, expires })
      .returning()

    return verificationToken
  } catch (error) {
    console.error(`[GENERATE_VERIFICATION_TOKEN_ERROR] Email: ${email}`, error)
    throw error
  }
}

export async function getVerificationTokenByEmail(email: string) {
  try {
    return await db
      .select()
      .from(verificationTokens)
      .where(eq(verificationTokens.email, email))
      .then(res => res[0])
  } catch (error) {
    console.error(`[GET_VERIFICATION_TOKEN_BY_EMAIL_ERROR] Email: ${email}`, error)
    return null
  }
}

export async function getVerificationTokenByToken(token: string) {
  try {
    return await db
      .select()
      .from(verificationTokens)
      .where(eq(verificationTokens.token, token))
      .then(res => res[0])
  } catch (error) {
    console.error(`[GET_VERIFICATION_TOKEN_BY_TOKEN_ERROR] TOKEN:${token}`, error)
    return null
  }
}

export async function deleteExistingVerificationTokensByEmail(
  email: string,
  trx: CustomPgTransaction | CustomPostgresDatabase = db,
) {
  try {
    await trx.delete(verificationTokens).where(eq(verificationTokens.email, email))
  } catch (error) {
    console.error(`[DELETE_VERIFICATION_TOKEN_BY_EMAIL_ERROR] Email: ${email}`, error)
    throw error
  }
}

export async function deleteExistingVerificationTokenById(id: string) {
  try {
    await db.delete(verificationTokens).where(eq(verificationTokens.id, id))
  } catch (error) {
    console.error(`[DELETE_VERIFICATION_TOKEN_BY_ID_ERROR] ID: ${id}`, error)
    throw error
  }
}
