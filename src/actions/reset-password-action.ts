'use server'

import {
  deletePasswordResetTokenByEmail,
  generatePasswordResetToken,
} from '@/data/password-reset-token'
import { getUserByEmail } from '@/data/user'
import { sendPasswordResetEmail } from '@/lib/email'
import { PasswordResetSchema } from '@/schema'
import { z } from 'zod'

export async function resetPasswordAction(values: unknown) {
  const validatedFields = PasswordResetSchema.safeParse(values)
  if (validatedFields.error) {
    return { status: 'error' as const, message: 'Invalid email!' }
  }
  const { email } = validatedFields.data

  const existingUser = await getUserByEmail(email)

  if (!existingUser) {
    return { status: 'error' as const, message: 'Email does not exist!' }
  }

  try {
    await deletePasswordResetTokenByEmail(email)
    const passwordResetToken = await generatePasswordResetToken(email)
    await sendPasswordResetEmail({ email, token: passwordResetToken.token })
    return { status: 'success' as const, message: 'Reset email sent!' }
  } catch (error) {
    console.error(`[PASSWORD_RESET_ACTION_ERROR] EMAIL:${email}`, error)
    return {
      status: 'error' as const,
      message: 'An unexpected error occurred during password reset.',
    }
  }
}
