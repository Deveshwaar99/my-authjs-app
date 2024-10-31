'use server'

import { getUserByEmail } from '@/data/user'
import { db } from '@/db'
import { users } from '@/db/schema'
import { RegisterSchemaBackend } from '@/schema'
import bcryptjs from 'bcryptjs'

export async function registerAction(values: unknown): Promise<{
  status: 'error' | 'success'
  message: string
}> {
  const validatedFields = RegisterSchemaBackend.safeParse(values)
  if (!validatedFields.success) {
    return { status: 'error', message: 'Invalid input fields!' }
  }
  const { name, email, password } = validatedFields.data
  const existingUser = await getUserByEmail(email)
  if (existingUser) {
    return { status: 'error', message: 'User already exists' }
  }

  const hashedPassword = await bcryptjs.hash(password, 10)

  await db.insert(users).values({ name, email, password: hashedPassword })

  return { status: 'success', message: 'Account created successfully!' }
}
