import dotenv from "dotenv"
dotenv.config()
import { Pool } from "pg"

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
    connectionTimeoutMillis: 15000,
});
console.log(typeof process.env.DATABASE_URL)
export default pool;
