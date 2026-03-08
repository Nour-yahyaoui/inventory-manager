import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sql } from '../../../lib/db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = (await cookies()).get('userId')?.value;
    if (!userId) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const { id } = await params; // Await the params Promise
    const itemId = parseInt(id);
    
    // Validate that we have a valid number
    if (isNaN(itemId)) {
      return NextResponse.json({ error: 'معرف غير صالح' }, { status: 400 });
    }

    const { name, quantity, price, image_url } = await request.json();

    // Try with selling_price first
    try {
      const items = await sql`
        UPDATE items 
        SET name = ${name}, 
            quantity = ${quantity}, 
            selling_price = ${price}, 
            image_url = ${image_url},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${itemId} AND owner_id = ${parseInt(userId)}
        RETURNING *
      `;
      
      if (items.length === 0) {
        return NextResponse.json({ error: 'العنصر غير موجود' }, { status: 404 });
      }
      
      return NextResponse.json(items[0]);
    } catch (error: any) {
      // If selling_price fails, try purchase_price
      if (error.message?.includes('selling_price')) {
        const items = await sql`
          UPDATE items 
          SET name = ${name}, 
              quantity = ${quantity}, 
              purchase_price = ${price}, 
              image_url = ${image_url},
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ${itemId} AND owner_id = ${parseInt(userId)}
          RETURNING *
        `;
        
        if (items.length === 0) {
          return NextResponse.json({ error: 'العنصر غير موجود' }, { status: 404 });
        }
        
        return NextResponse.json(items[0]);
      }
      throw error;
    }
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = (await cookies()).get('userId')?.value;
    if (!userId) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const { id } = await params; // Await the params Promise
    const itemId = parseInt(id);
    
    // Validate that we have a valid number
    if (isNaN(itemId)) {
      return NextResponse.json({ error: 'معرف غير صالح' }, { status: 400 });
    }

    const result = await sql`
      DELETE FROM items 
      WHERE id = ${itemId} AND owner_id = ${parseInt(userId)}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'العنصر غير موجود' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}