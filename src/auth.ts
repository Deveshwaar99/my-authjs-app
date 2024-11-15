// import authConfig from '@/auth.config'
// import { getAccountByUserId } from '@/data/account'
// import {
//   deleteExistingTwoFactorTokenById,
//   getTwoFactorTokenByUserId,
// } from '@/data/two-factor-token'
// import { getUserById } from '@/data/user'
// import { db } from '@/db'
// import { accounts, authenticators, users } from '@/db/schema'
// import { DrizzleAdapter } from '@auth/drizzle-adapter'
// import { eq } from 'drizzle-orm'
// import NextAuth from 'next-auth'

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   pages: {
//     signIn: '/auth/login',
//     error: '/auth/error',
//   },
//   events: {
//     linkAccount: async ({ user }) => {
//       if (!user.id) return
//       await db.update(users).set({ emailVerified: new Date() }).where(eq(users.id, user.id))
//     },
//   },
//   callbacks: {
//     signIn: async ({ user, account }) => {
//       if (!user || !account || !user.id) return false

//       if (account.provider === 'credentials') {
//         const existingUser = await getUserById(user.id)

//         //Prevent SignIn without email verification
//         if (!existingUser?.emailVerified) return false

//         //2FA Check
//         if (existingUser.isTwoFactorEnabled) {
//           const twoFactorConfirmation = await getTwoFactorTokenByUserId({ userId: existingUser.id })
//           if (!twoFactorConfirmation || twoFactorConfirmation.status !== 'CONFIRMED') return false

//           await deleteExistingTwoFactorTokenById({ id: twoFactorConfirmation.id })
//         }
//       }

//       return true
//     },
//     session: async ({ token, session }) => {
//       if (token?.sub && session?.user) {
//         session.user.id = token.sub
//       }
//       if (token?.name && session?.user) {
//         session.user.role = token.name
//       }
//       if (token?.email && session?.user) {
//         session.user.role = token.email
//       }
//       if (token?.role && session?.user) {
//         session.user.role = token.role
//       }
//       if (session?.user) {
//         session.user.isOAuth = token.isOAuth as boolean
//         session.user.isTwoFactorEnabled = token.isTwoFactorEnabled
//       }
//       return session
//     },
//     jwt: async ({ token }) => {
//       if (!token.sub) return token
//       const existingUser = await getUserById(token.sub)
//       if (existingUser) {
//         const OAuthAccount = await getAccountByUserId(existingUser.id)
//         token.name = existingUser.name
//         token.email = existingUser.email
//         token.role = existingUser.role
//         token.isOAuth = !!OAuthAccount
//         token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled
//       }
//       return token
//     },
//   },
//   adapter: DrizzleAdapter(db, {
//     usersTable: users,
//     accountsTable: accounts,
//     // verificationTokensTable: verificationTokens,
//     authenticatorsTable: authenticators,
//   }),
//   session: { strategy: 'jwt' },
//   ...authConfig,
// })

import authConfig from '@/auth.config'
import { getAccountByUserId } from '@/data/account'
import {
  deleteExistingTwoFactorTokenById,
  getTwoFactorTokenByUserId,
} from '@/data/two-factor-token'
import { getUserById } from '@/data/user'
import { db } from '@/db'
import { accounts, authenticators, users } from '@/db/schema'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { eq } from 'drizzle-orm'
import NextAuth from 'next-auth'
import type { Session, User, Account } from 'next-auth'
import type { JWT } from 'next-auth/jwt'

// Type definitions for better type safety
interface ExtendedUser extends User {
  role?: string
  isOAuth?: boolean
  isTwoFactorEnabled?: boolean
}

interface ExtendedSession extends Session {
  user: ExtendedUser
}

const validateCredentialsSignIn = async (userId: string) => {
  const existingUser = await getUserById(userId)

  if (!existingUser?.emailVerified) {
    return false
  }

  if (existingUser.isTwoFactorEnabled) {
    const twoFactorConfirmation = await getTwoFactorTokenByUserId({ userId })

    if (!twoFactorConfirmation || twoFactorConfirmation.status !== 'CONFIRMED') {
      return false
    }

    await deleteExistingTwoFactorTokenById({ id: twoFactorConfirmation.id })
  }

  return true
}

// Separate token enhancement function
const enhanceToken = async (token: JWT): Promise<JWT> => {
  if (!token.sub) return token

  const existingUser = await getUserById(token.sub)
  if (!existingUser) return token

  const OAuthAccount = await getAccountByUserId(existingUser.id)

  return {
    ...token,
    name: existingUser.name,
    email: existingUser.email,
    role: existingUser.role,
    isOAuth: !!OAuthAccount,
    isTwoFactorEnabled: existingUser.isTwoFactorEnabled,
  }
}

// Main NextAuth configuration
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
      if (!user?.id || !account) return false

      if (account.provider === 'credentials') {
        return validateCredentialsSignIn(user.id)
      }

      return true
    },

    session: ({ token, session }: { token: JWT; session: ExtendedSession }) => {
      if (!session.user) return session

      session.user.id = token.sub
      session.user.role = token.role as string
      session.user.isOAuth = token.isOAuth as boolean
      session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean

      return session
    },

    jwt: async ({ token }) => enhanceToken(token),
  },

  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    authenticatorsTable: authenticators,
  }),

  session: { strategy: 'jwt' },

  ...authConfig,
})
