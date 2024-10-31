import 'server-only'

// import 'dotenv/config'
// import { drizzle } from 'drizzle-orm/vercel-postgres'
// import * as schema from '@/db/schema'
// import postgres from 'postgres'

// const db = drizzle({
//   connection: {
//     connectionString: process.env.DATABASE_URL,
//     // ssl: true,
//   },
//   schema,
// })
// const queryClient = postgres(process.env.DATABASE_URL!)
// const db = drizzle(queryClient, { schema })
// export { db }

import { drizzle } from 'drizzle-orm/vercel-postgres'
import { sql } from '@vercel/postgres'

export const db = drizzle({ client: sql })
