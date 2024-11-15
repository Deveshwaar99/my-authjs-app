'use server'

import { signIn } from '@/auth'
import {
  confirmTwoFactorTokenByTokenId,
  deleteExistingTwoFactorTokenByUserId,
  generateTwoFactorToken,
  getTwoFactorTokenByUserId,
} from '@/data/two-factor-token'
import { getUserByEmail } from '@/data/user'
import {
  deleteExistingVerificationTokensByEmail,
  generateVerificationToken,
  getVerificationTokenByEmail,
} from '@/data/verificationToken'
import { sendTwoFactorTokenEmail, sendVerificationEmail } from '@/lib/email'
import { matchPassword } from '@/lib/utils'
import { DEFAULT_LOGIN_REDIRECT } from '@/middleware'
import { LoginSchema } from '@/schema'
import { AuthError } from 'next-auth'

// Types for better type safety
type LoginResponse = {
  status?: 'error' | 'success'
  message?: string
  twoFactor?: boolean
}

// Separate validation functions
const validateUser = async (
  _email: string,
  existingUser: Awaited<ReturnType<typeof getUserByEmail>>,
): Promise<LoginResponse | null> => {
  if (!existingUser?.email) {
    return { status: 'error', message: 'Email does not exist!' }
  }

  if (!existingUser.password) {
    return {
      status: 'error',
      message: 'Please use your original authentication method to sign in.',
    }
  }

  return null
}

const handleEmailVerification = async (email: string): Promise<LoginResponse> => {
  const existingToken = await getVerificationTokenByEmail(email)
  const isTokenValid = existingToken && new Date(existingToken.expires) > new Date()

  if (!isTokenValid) {
    await deleteExistingVerificationTokensByEmail(email)
    const newToken = await generateVerificationToken(email)
    await sendVerificationEmail(newToken.email, newToken.token)
  }

  return { status: 'success', message: 'Verification email sent!' }
}

const validateTwoFactorToken = async (
  token: { otp: string; expires: Date; status: string; id: string } | null,
): Promise<LoginResponse | null> => {
  if (!token) {
    return { status: 'error', message: 'Invalid code!' }
  }

  if (new Date(token.expires) < new Date() || token.status !== 'PENDING') {
    return { status: 'error', message: 'Code expired!' }
  }

  return null
}

const handleTwoFactorAuth = async (
  userId: string,
  email: string,
  otp?: string,
): Promise<LoginResponse> => {
  const existingToken = await getTwoFactorTokenByUserId({ userId })

  if (otp) {
    const validationError = await validateTwoFactorToken(existingToken)
    if (validationError) return validationError

    if (existingToken?.otp !== otp) {
      return { status: 'error', message: 'Invalid code!' }
    }

    await confirmTwoFactorTokenByTokenId({ tokenId: existingToken.id })
    return {} // Continue with login
  }

  // Generate new token if none exists or expired
  if (!existingToken || new Date(existingToken.expires) < new Date()) {
    await deleteExistingTwoFactorTokenByUserId({ userId })
    const newToken = await generateTwoFactorToken({ userId, email })
    await sendTwoFactorTokenEmail({
      email: newToken.email,
      otp: newToken.otp,
    })
  }

  return { twoFactor: true }
}

export const loginAction = async (values: unknown): Promise<LoginResponse> => {
  try {
    const validatedFields = LoginSchema.safeParse(values)

    if (!validatedFields.success) {
      return { status: 'error', message: 'Invalid input fields!' }
    }

    const { email, password, twoFactorOtp } = validatedFields.data
    const existingUser = await getUserByEmail(email)

    // Validate user existence and authentication method
    const userValidationError = await validateUser(email, existingUser)
    if (userValidationError) return userValidationError

    // Handle unverified email
    if (!existingUser?.emailVerified) {
      return handleEmailVerification(email)
    }

    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const isPasswordMatch = matchPassword({ password, hash: existingUser.password! })
    if (!isPasswordMatch) {
      return { status: 'error', message: 'Incorrect email or password!' }
    }
    if (existingUser.isTwoFactorEnabled && existingUser.email) {
      // Handle 2FA if enabled
      const twoFactorResponse = await handleTwoFactorAuth(
        existingUser.id,
        existingUser.email,
        twoFactorOtp,
      )
      if (twoFactorResponse.twoFactor || twoFactorResponse.status === 'error') {
        return twoFactorResponse
      }
    }

    // Proceed with regular sign in
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    })

    return { status: 'success', message: 'Login successful!' }
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        status: 'error',
        message:
          error.type === 'CredentialsSignin' ? 'Invalid credentials!' : 'Something went wrong!',
      }
    }

    console.error('[LOGIN_ERROR]', error)
    throw error //some bug
    // return { status: 'error', message: 'An unexpected error occurred.' }
  }
}

// export async function loginWithProvider(provider: 'google' | 'github') {
//   try {
//     await signIn(provider, { redirectTo: DEFAULT_LOGIN_REDIRECT })
//   } catch (error) {
//     if (error instanceof AuthError) {
//       return { status: 'error' as const, message: `Failed to login with ${provider}` }
//     }
//     console.error('[PROVIDERS_AUTH_ERROR]', error)
//     // throw error
//   }
// }
