import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sql } from '../../lib/db';

export async function GET() {
  try {
    const userId = (await cookies()).get('userId')?.value;
    
    if (!userId) {
      return NextResponse.json({ user: null });
    }

    const users = await sql`
      SELECT id, email, full_name FROM users WHERE id = ${parseInt(userId)}
    `;

    return NextResponse.json({ user: users[0] || null });
  } catch (error) {
    console.error('Me error:', error);
    return NextResponse.json({ user: null });
  }
}