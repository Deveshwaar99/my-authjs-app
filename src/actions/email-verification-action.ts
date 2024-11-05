'use server'

import { getUserByEmail, verifyUserEmailById } from '@/data/user'
import {
  deleteExistingVerificationTokenById,
  getVerificationTokenByToken,
} from '@/data/verificationToken'

export async function verifyEmailUsingVerificationToken(token: string) {
  try {
    const existingToken = await getVerificationTokenByToken(token)

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

    await verifyUserEmailById(existingUser.id, existingToken.email)
    await deleteExistingVerificationTokenById(existingToken.id)
    return {
      status: 'success' as const,
      message: 'Email verified successfully!',
    }
  } catch (error) {
    console.error('[VERIFY_EMAIL_USING_VERIFICATION_TOKEN_ERROR]', error)
    return {
      status: 'error' as const,
      message: 'An unexpected error occurred during email verification.',
    }
  }
}
