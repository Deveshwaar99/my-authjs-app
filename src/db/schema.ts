import { relations } from 'drizzle-orm'
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core'
import { nanoid } from 'nanoid'
import type { AdapterAccount } from 'next-auth/adapters'

export const rolesEnum = pgEnum('role', ['USER', 'ADMIN'])
export type Role = (typeof rolesEnum.enumValues)[number]

export const twoFactorTokenEnum = pgEnum('twoFactorTokenEnum', ['PENDING', 'CONFIRMED', 'EXPIRED'])

export const users = pgTable('users', {
  id: varchar('id', { length: 12 })
    .primaryKey()
    .$defaultFn(() => nanoid(12)),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: varchar('password', { length: 60 }),
  role: rolesEnum('role').default('USER').notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  isTwoFactorEnabled: boolean('isTwoFactorEnabled').default(false),
})

export const accounts = pgTable(
  'accounts',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccount['type']>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  accounts => ({
    compoundKey: primaryKey({
      columns: [accounts.provider, accounts.providerAccountId],
    }),
  }),
)

export const authenticators = pgTable(
  'authenticator',
  {
    credentialID: text('credentialID').notNull().unique(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    providerAccountId: text('providerAccountId').notNull(),
    credentialPublicKey: text('credentialPublicKey').notNull(),
    counter: integer('counter').notNull(),
    credentialDeviceType: text('credentialDeviceType').notNull(),
    credentialBackedUp: boolean('credentialBackedUp').notNull(),
    transports: text('transports'),
  },
  authenticator => ({
    compositePk: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  }),
)

export const verificationTokens = pgTable(
  'verificationTokens',
  {
    id: varchar('id', { length: 12 })
      .primaryKey()
      .$defaultFn(() => nanoid(12)),
    email: text('email').notNull().unique(),
    token: text('token').unique().notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  table => ({
    uniqueEmailAndVerificationToken: uniqueIndex('unique_email_verification_token').on(
      table.email,
      table.token,
    ),
  }),
)

export const PasswordResetTokens = pgTable(
  'passwordResetTokens',
  {
    id: varchar('id', { length: 12 })
      .primaryKey()
      .$defaultFn(() => nanoid(12)),
    token: text('token').unique().notNull(),
    email: text('email').notNull().unique(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  table => ({
    uniqueEmailAndResetToken: uniqueIndex('unique_email_reset_token').on(table.email, table.token),
  }),
)

export const TwoFactorConfirmationTokens = pgTable('twoFactorConfirmationTokens', {
  id: varchar('id', { length: 12 })
    .primaryKey()
    .$defaultFn(() => nanoid(12)),
  otp: varchar('otp', { length: 6 }).notNull(),
  userId: text('userId')
    .unique()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  email: text('email').notNull().unique(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
  status: twoFactorTokenEnum('status').default('PENDING').notNull(),
})

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  authenticators: many(authenticators),
}))

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}))

export const authenticatorsRelations = relations(authenticators, ({ one }) => ({
  user: one(users, {
    fields: [authenticators.userId],
    references: [users.id],
  }),
}))

// Types
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Account = typeof accounts.$inferSelect
export type NewAccount = typeof accounts.$inferInsert
export type Authenticator = typeof authenticators.$inferSelect
export type NewAuthenticator = typeof authenticators.$inferInsert
export type VerificationToken = typeof verificationTokens.$inferSelect
export type NewVerificationToken = typeof verificationTokens.$inferInsert
