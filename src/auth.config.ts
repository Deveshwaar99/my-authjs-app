import bcryptjs from 'bcryptjs'
import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { getUserByEmail } from './data/user'
import { LoginSchema } from './schema'
import Github from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
export default {
  providers: [
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({ authorize }),
  ],
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
