import NextAuth from 'next-auth'
import authConfig from './auth.config'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from './db'
import { users, accounts, verificationTokens, authenticators } from './db/schema'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    verificationTokensTable: verificationTokens,
    authenticatorsTable: authenticators,
  }),
  session: { strategy: 'jwt' },
  ...authConfig,
})
