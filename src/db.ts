import { Pool } from "pg"

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in environment")
}

declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined
}

// Ensure TLS for Neon / managed Postgres. `rejectUnauthorized: false` is commonly used
// for hosted providers that require TLS but provide certificates not trusted by Node.
const pool: Pool =
  global.__pgPool ?? new Pool({ connectionString, ssl: { rejectUnauthorized: false } as any })
if (!global.__pgPool) global.__pgPool = pool

export async function query(text: string, params?: any[]) {
  const res = await pool.query(text, params)
  return res
}

export default { query }
