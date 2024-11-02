// import 'server-only'

// import { drizzle } from 'drizzle-orm/vercel-postgres'
// import { sql } from '@vercel/postgres'
import * as schema from './schema'
// export const db = drizzle()

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

// biome-ignore lint/style/noNonNullAssertion: <explanation>
const connectionString = process.env.POSTGRES_URL!
const client = postgres(connectionString)
export const db = drizzle(client, { schema })
