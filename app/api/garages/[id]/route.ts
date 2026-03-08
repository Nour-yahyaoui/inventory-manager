import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sql } from '../../../lib/db';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = (await cookies()).get('userId')?.value;
    if (!userId) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { id } = await params;
    const garageId = parseInt(id);

    if (isNaN(garageId)) {
      return NextResponse.json({ error: 'معرف غير صالح' }, { status: 400 });
    }

    // First check if garage belongs to user and delete it
    const result = await sql`
      DELETE FROM garages 
      WHERE id = ${garageId} AND owner_id = ${parseInt(userId)}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'المخزن غير موجود' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting garage:', error);
    return NextResponse.json({ error: 'فشل في حذف المخزن' }, { status: 500 });
  }
}

// If you have other methods like PUT, update them too
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = (await cookies()).get('userId')?.value;
    if (!userId) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { id } = await params;
    const garageId = parseInt(id);

    if (isNaN(garageId)) {
      return NextResponse.json({ error: 'معرف غير صالح' }, { status: 400 });
    }

    const body = await request.json();
    const { name, address, monthly_rent, monthly_electricity, monthly_water } = body;

    // Update the garage
    const result = await sql`
      UPDATE garages 
      SET 
        name = COALESCE(${name}, name),
        address = COALESCE(${address}, address),
        monthly_rent = COALESCE(${monthly_rent}, monthly_rent),
        monthly_electricity = COALESCE(${monthly_electricity}, monthly_electricity),
        monthly_water = COALESCE(${monthly_water}, monthly_water),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${garageId} AND owner_id = ${parseInt(userId)}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'المخزن غير موجود' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error updating garage:', error);
    return NextResponse.json({ error: 'فشل في تحديث المخزن' }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = (await cookies()).get('userId')?.value;
    if (!userId) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { id } = await params;
    const garageId = parseInt(id);

    if (isNaN(garageId)) {
      return NextResponse.json({ error: 'معرف غير صالح' }, { status: 400 });
    }

    const result = await sql`
      SELECT * FROM garages 
      WHERE id = ${garageId} AND owner_id = ${parseInt(userId)}
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'المخزن غير موجود' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error fetching garage:', error);
    return NextResponse.json({ error: 'فشل في جلب المخزن' }, { status: 500 });
  }
}