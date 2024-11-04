'use server'

import { getUserByEmail } from '@/data/user'
import {
  type CustomPgTransaction,
  deleteExistingVerificationTokens,
  generateVerificationToken,
} from '@/data/verificationToken'
import { db } from '@/db'
import { users } from '@/db/schema'
import { sendVerificationEmail } from '@/lib/email'
import { RegisterSchemaBackend } from '@/schema'
import bcryptjs from 'bcryptjs'

export async function registerAction(values: unknown) {
  const validatedFields = RegisterSchemaBackend.safeParse(values)
  if (!validatedFields.success) {
    return {
      status: 'error' as const,
      message: 'Invalid input fields!',
    }
  }

  const { name, email, password } = validatedFields.data

  const existingUser = await getUserByEmail(email)
  if (existingUser) {
    return {
      status: 'error' as const,
      message: 'User already exists',
    }
  }

  const hashedPassword = await bcryptjs.hash(password, 10)

  try {
    await db.transaction(async trx => {
      await trx.insert(users).values({ name, email, password: hashedPassword })
      await deleteExistingVerificationTokens(email, trx as unknown as CustomPgTransaction)
      const verificationToken = await generateVerificationToken(
        email,
        trx as unknown as CustomPgTransaction,
      )
      await sendVerificationEmail(verificationToken.email, verificationToken.token)
    })

    return {
      status: 'success' as const,
      message: 'Confirmation email sent!',
    }
  } catch (error) {
    console.error('[REGISTRATION_ERROR]:', error)
    return {
      status: 'error' as const,
      message: 'Registration failed. Please try again later.',
    }
  }
}

export type RegistrationResult = Awaited<ReturnType<typeof registerAction>>
