import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sql } from '../../../lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;
    
    if (!userId) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { id } = await params;
    const saleId = parseInt(id);

    if (isNaN(saleId)) {
      return NextResponse.json({ error: 'معرف غير صالح' }, { status: 400 });
    }

    // Get sale details
    const sales = await sql`
      SELECT s.*, g.name as garage_name 
      FROM sales s
      JOIN garages g ON s.garage_id = g.id
      WHERE s.id = ${saleId} AND s.user_id = ${parseInt(userId)}
    `;

    if (sales.length === 0) {
      return NextResponse.json({ error: 'الفاتورة غير موجودة' }, { status: 404 });
    }

    // Get sale items with item details
    const items = await sql`
      SELECT si.*, i.name, i.image_url
      FROM sale_items si
      JOIN items i ON si.item_id = i.id
      WHERE si.sale_id = ${saleId}
    `;

    return NextResponse.json({
      ...sales[0],
      items: items || []
    });
  } catch (error) {
    console.error('Error fetching sale:', error);
    return NextResponse.json({ error: 'فشل في جلب الفاتورة' }, { status: 500 });
  }
}