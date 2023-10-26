import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'
import { randomUUID } from 'crypto'
import 'dotenv/config'
import { Environment } from 'vitest'

const prisma = new PrismaClient()

function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schema)

  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'web',
  async setup() {
    const schema = randomUUID()

    const databaseURL = generateDatabaseURL(schema)

    process.env.DATABASE_URL = databaseURL

    execSync('npx prisma migrate deploy')

    return {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        )
      },
    }
  },
}
