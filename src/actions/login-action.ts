'use server'

import { signIn } from '@/auth'
import { DEFAULT_LOGIN_REDIRECT } from '@/middleware'
import { LoginSchema } from '@/schema'
import { AuthError } from 'next-auth'

export const loginAction = async (
  values: unknown,
): Promise<{ status: 'error' | 'success'; message: string } | undefined> => {
  const validatedFields = LoginSchema.safeParse(values)
  try {
    if (!validatedFields.success) {
      return { status: 'error', message: 'Invalid input fields!' }
    }
    const { email, password } = validatedFields.data
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

    throw error // CHECK THIS BUG
  }
}

export async function loginWithProvider(provider: 'google' | 'github') {
  try {
    await signIn(provider, { redirectTo: DEFAULT_LOGIN_REDIRECT })
  } catch (error) {
    console.error('[PROVIDERS_AUTH_ERROR]', error)
    if (error instanceof AuthError) {
      return { status: 'error', message: `Failed to login with ${provider}` }
    }
    throw error
  }
}
