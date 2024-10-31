import { getUserByEmail } from '@/data/user'
import { db } from '.'
import { users } from './schema'

async function testConnection() {
  try {
    const result = await db.select().from(users).limit(1)
    const result2 = await getUserByEmail('david@ymail.com') // biome-ignore lint/suspicious/noConsoleLog: <explanation>
    console.log('Connection successful:', result, result2)
  } catch (error) {
    console.error('Error connecting to the database:', error)
  }
}

testConnection()
