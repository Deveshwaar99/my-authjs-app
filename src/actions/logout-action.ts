'use server'

import { signOut } from '@/auth'
import { redirect } from 'next/navigation'

export async function logoutAction() {
  try {
    await signOut()
    redirect('/')
  } catch (error) {
    console.error('[LOGOUT_ACTION_ERROR]', error)
    return { status: 'error', message: 'Somthing went wrong!' }
  }
}
