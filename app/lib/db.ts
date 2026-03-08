import { neon } from '@neondatabase/serverless';
export const sql = neon(process.env.NEXT_NEON_URL!);