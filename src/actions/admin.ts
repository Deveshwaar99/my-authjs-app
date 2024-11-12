'use server'

import { currentUser } from '@/lib/auth'

export async function adminAction() {
  const user = await currentUser()
  if (user.role === 'ADMIN') {
    return 'SUCCESS' as const
  }
  return 'ERROR' as const
}
