import { DrizzleAdapter } from '@auth/drizzle-adapter'
import NextAuth from 'next-auth'
import authConfig from './auth.config'
import { getUserById } from './data/user'
import { db } from './db'
import { accounts, authenticators, users, verificationTokens } from './db/schema'
import { eq } from 'drizzle-orm'
import { getAccountByUserId } from './data/account'

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  events: {
    linkAccount: async ({ user }) => {
      if (!user.id) return
      await db.update(users).set({ emailVerified: new Date() }).where(eq(users.id, user.id))
    },
  },
  callbacks: {
    signIn: async ({ user, account }) => {
      if (!user || !account || !user.id) return false

      if (account.provider === 'credentials') {
        const existingUser = await getUserById(user.id)

        //Prevent SignIn without email verification
        if (!existingUser?.emailVerified) return false

        //TODO 2FA Check
      }

      return true
    },
    session: async ({ token, session }) => {
      if (token?.sub && session?.user) {
        session.user.id = token.sub
      }
      if (token?.name && session?.user) {
        session.user.role = token.name
      }
      if (token?.email && session?.user) {
        session.user.role = token.email
      }
      if (token?.role && session?.user) {
        session.user.role = token.role
      }
      if (session?.user) {
        session.user.isOAuth = token.isOAuth as boolean
      }
      return session
    },
    jwt: async ({ token }) => {
      if (!token.sub) return token
      const existingUser = await getUserById(token.sub)
      if (existingUser) {
        const OAuthAccount = await getAccountByUserId(existingUser.id)
        token.name = existingUser.name
        token.email = existingUser.email
        token.role = existingUser.role
        token.isOAuth = !!OAuthAccount
      }
      return token
    },
  },
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    // verificationTokensTable: verificationTokens,
    authenticatorsTable: authenticators,
  }),
  session: { strategy: 'jwt' },
  ...authConfig,
})
