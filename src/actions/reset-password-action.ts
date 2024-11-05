'use server'

import {
  deletePasswordResetTokenByEmail,
  deletePasswordResetTokenById,
  generatePasswordResetToken,
  getPasswordResetTokenByToken,
} from '@/data/password-reset-token'
import { getUserByEmail, updateUserPassword } from '@/data/user'
import { sendPasswordResetEmail } from '@/lib/email'
import { NewPasswordSchema, PasswordResetSchema } from '@/schema'
import type { z } from 'zod'

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

export async function setNewPasswordAction(
  values: z.infer<typeof NewPasswordSchema>,
  token?: string,
) {
  if (!token) {
    return { status: 'error' as const, message: 'Missing token!' }
  }

  try {
    const validatedFields = NewPasswordSchema.safeParse(values)
    if (!validatedFields.success) {
      return {
        status: 'error' as const,
        message: 'Invalid input fields!',
      }
    }
    const { password } = validatedFields.data
    const existingToken = await getPasswordResetTokenByToken(token)

    if (!existingToken) {
      return {
        status: 'error' as const,
        message: 'Token does not exist!',
      }
    }

    const hasTokenExpired = new Date(existingToken.expires) < new Date()
    if (hasTokenExpired) {
      return {
        status: 'error' as const,
        message: 'Token has expired!',
      }
    }

    const existingUser = await getUserByEmail(existingToken.email)
    if (!existingUser) {
      return {
        status: 'error' as const,
        message: 'Email does not exist!',
      }
    }

    await updateUserPassword({ password, userId: existingUser.id })
    await deletePasswordResetTokenById(existingToken.id)

    return {
      status: 'success' as const,
      message: 'Password updated! Redirecting to login page...',
    }
  } catch (error) {
    console.error('[RESET_PASSWORD_ACTION_ERROR]', error)
    return {
      status: 'error' as const,
      message: 'An unexpected error occurred during password reset.',
    }
  }
}
