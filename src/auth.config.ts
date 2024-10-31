import bcryptjs from 'bcryptjs'
import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { getUserByEmail } from './data/user'
import { LoginSchema } from './schema'

export default {
  providers: [Credentials({ authorize })],
} satisfies NextAuthConfig

async function authorize(credentials: unknown) {
  const validatedFields = LoginSchema.safeParse(credentials)
  if (!validatedFields.success) {
    return null
  }
  const { email, password } = validatedFields.data
  const user = await getUserByEmail(email)

  if (!user || !user?.password) {
    return null
  }

  const passwordMatch = await bcryptjs.compare(password, user.password)
  if (!passwordMatch) return null

  return user
}
