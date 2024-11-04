'use server'

import { signIn } from '@/auth'
import type { FormStatusProps } from '@/components/form-status'
import { getUserByEmail } from '@/data/user'
import {
  deleteExistingVerificationTokensByEmail,
  generateVerificationToken,
} from '@/data/verificationToken'
import { sendVerificationEmail } from '@/lib/email'
import { DEFAULT_LOGIN_REDIRECT } from '@/middleware'
import { LoginSchema } from '@/schema'
import { AuthError } from 'next-auth'

export const loginAction = async (values: unknown): Promise<FormStatusProps> => {
  const validatedFields = LoginSchema.safeParse(values)
  try {
    if (!validatedFields.success) {
      return { status: 'error' as const, message: 'Invalid input fields!' }
    }
    const { email, password } = validatedFields.data

    const existingUser = await getUserByEmail(email)

    if (!existingUser || !existingUser.email) {
      return { status: 'error', message: 'Email does not exist!' }
    }

    if (!existingUser.password) {
      return {
        status: 'error',
        message: 'It looks like you signed up using a different authentication method. ',
      }
    }

    if (!existingUser.emailVerified) {
      await deleteExistingVerificationTokensByEmail(email)
      const verificationToken = await generateVerificationToken(email)
      await sendVerificationEmail(verificationToken.email, verificationToken.token)
      return { status: 'success', message: 'Verification email sent!' }
    }

    await signIn('credentials', { email, password, redirectTo: DEFAULT_LOGIN_REDIRECT })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { status: 'error', message: 'Invalid credentials!' }
        default:
          return { status: 'error', message: 'Somthing went wrong!' }
      }
    }

    console.error('[LOGIN_ERROR]', error)

    throw error // CHECK THIS BUG
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
