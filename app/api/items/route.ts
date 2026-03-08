import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sql } from '../../lib/db';

export async function GET(request: Request) {
  const userId = (await cookies()).get('userId')?.value;
  if (!userId) return NextResponse.json([]);

  const { searchParams } = new URL(request.url);
  const garageId = searchParams.get('garageId');
  const limit = searchParams.get('limit');

  let items;
  if (garageId) {
    items = await sql`
      SELECT i.*, g.name as garage_name 
      FROM items i
      JOIN garages g ON i.garage_id = g.id
      WHERE i.garage_id = ${parseInt(garageId)} AND g.owner_id = ${parseInt(userId)}
      ORDER BY i.created_at DESC
      ${limit ? sql`LIMIT ${parseInt(limit)}` : sql``}
    `;
  } else {
    items = await sql`
      SELECT i.*, g.name as garage_name 
      FROM items i
      JOIN garages g ON i.garage_id = g.id
      WHERE g.owner_id = ${parseInt(userId)}
      ORDER BY i.created_at DESC
      ${limit ? sql`LIMIT ${parseInt(limit)}` : sql``}
    `;
  }

  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const userId = (await cookies()).get('userId')?.value;
  if (!userId) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { garage_id, name, quantity, price, image_url } = await request.json();

  // First verify the garage belongs to the user
  const garage = await sql`
    SELECT id FROM garages WHERE id = ${garage_id} AND owner_id = ${parseInt(userId)}
  `;

  if (garage.length === 0) {
    return NextResponse.json({ error: 'المخزن غير موجود' }, { status: 404 });
  }

  // Try with selling_price (most common in your schema)
  try {
    const items = await sql`
      INSERT INTO items (garage_id, owner_id, name, quantity, selling_price, image_url)
      VALUES (${garage_id}, ${parseInt(userId)}, ${name}, ${quantity || 0}, ${price || 0}, ${image_url || null})
      RETURNING *
    `;
    return NextResponse.json(items[0]);
  } catch (error: any) {
    // If selling_price fails, try purchase_price
    if (error.message?.includes('selling_price')) {
      const items = await sql`
        INSERT INTO items (garage_id, owner_id, name, quantity, purchase_price, image_url)
        VALUES (${garage_id}, ${parseInt(userId)}, ${name}, ${quantity || 0}, ${price || 0}, ${image_url || null})
        RETURNING *
      `;
      return NextResponse.json(items[0]);
    }
    throw error;
  }
}