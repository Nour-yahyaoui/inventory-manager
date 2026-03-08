import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sql } from '../../lib/db';

export async function GET() {
  const userId = (await cookies()).get('userId')?.value;
  if (!userId) return NextResponse.json([]);

  // Use owner_id instead of user_id
  const garages = await sql`
    SELECT * FROM garages WHERE owner_id = ${parseInt(userId)} ORDER BY created_at DESC
  `;
  return NextResponse.json(garages);
}

export async function POST(request: Request) {
  const userId = (await cookies()).get('userId')?.value;
  if (!userId) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { name, address, monthly_rent, monthly_electricity, monthly_water } = await request.json();

  // Use owner_id instead of user_id
  const garages = await sql`
    INSERT INTO garages (owner_id, name, address, monthly_rent, monthly_electricity, monthly_water)
    VALUES (${parseInt(userId)}, ${name}, ${address}, ${monthly_rent || 0}, ${monthly_electricity || 0}, ${monthly_water || 0})
    RETURNING *
  `;

  return NextResponse.json(garages[0]);
}