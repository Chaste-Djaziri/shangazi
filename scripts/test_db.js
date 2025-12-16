// Run with: node -r dotenv/config scripts/test_db.js
const { Pool } = require('pg')

let connectionString = process.env.DATABASE_URL
if (!connectionString) {
  // Try to read from local .env
  try {
    const fs = require('fs')
    const env = fs.readFileSync('.env', 'utf8')
    for (const line of env.split(/\n/)) {
      const m = line.match(/^DATABASE_URL\s*=\s*(.+)$/)
      if (m) {
        // strip surrounding quotes if present
        connectionString = m[1].replace(/^['"]|['"]$/g, '')
        process.env.DATABASE_URL = connectionString
        break
      }
    }
  } catch (e) {
    // ignore
  }
}

if (!connectionString) {
  console.error('DATABASE_URL not set')
  process.exit(1)
}

async function run() {
  const pool = new Pool({ connectionString })
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS public.blog_views (
      id bigserial PRIMARY KEY,
      post_id text NOT NULL UNIQUE,
      views bigint NOT NULL DEFAULT 0,
      last_viewed timestamptz NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )`)

    const testId = 'test-post-12345'
    const up = await pool.query(
      `INSERT INTO public.blog_views (post_id, views, last_viewed)
       VALUES ($1, 1, now())
       ON CONFLICT (post_id) DO UPDATE SET views = public.blog_views.views + 1, last_viewed = now()
       RETURNING views`,
      [testId]
    )

    console.log('Upsert result:', up.rows[0])

    const sel = await pool.query(`SELECT * FROM public.blog_views WHERE post_id = $1`, [testId])
    console.log('Row:', sel.rows[0])
  } catch (err) {
    console.error(err)
  } finally {
    await pool.end()
  }
}

run()
