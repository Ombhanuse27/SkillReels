import pg from 'pg';

const { Pool } = pg;

// We are hardcoding the string to ensure the connection happens
const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_14nHzxLAoUKg@ep-rapid-unit-atbpbtj2-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require",
  ssl: { rejectUnauthorized: false }
});

export default pool;