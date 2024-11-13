import 'server-only'

import { db } from '@/db'
import { accounts } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function getAccountByUserId(id: string) {
  try {
    return await db
      .select()
      .from(accounts)
      .where(eq(accounts.userId, id))
      .then(res => res[0])
  } catch (error) {
    console.error('[GET_ACCOUNT_BY_USER_ID_ERROR]', error)
    return null
  }
}
