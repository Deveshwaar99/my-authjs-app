'use server'

import { signOut } from '@/auth'

export async function logoutAction() {
  try {
    await signOut()
  } catch (error) {
    console.error('[LOGOUT_ACTION_ERROR]', error)
    return { status: 'error', message: 'Somthing went wrong!' }
  }
}
