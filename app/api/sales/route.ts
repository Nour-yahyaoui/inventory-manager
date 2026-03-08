import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sql } from '../../lib/db';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;
    
    if (!userId) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      garage_id, 
      items, 
      customer_name, 
      customer_phone,
      payment_method,
      notes 
    } = body;

    if (!garage_id || !items || items.length === 0) {
      return NextResponse.json({ error: 'بيانات غير كاملة' }, { status: 400 });
    }

    console.log('Processing sale for garage:', garage_id);

    // First verify the garage exists
    const garageCheck = await sql`
      SELECT id FROM garages WHERE id = ${garage_id} AND owner_id = ${parseInt(userId)}
    `;

    if (garageCheck.length === 0) {
      return NextResponse.json({ error: 'المخزن غير موجود' }, { status: 404 });
    }

    let subtotal = 0;
    const saleItems = [];

    // Process items one by one with error handling
    for (const item of items) {
      try {
        // Get current item
        const currentItem = await sql`
          SELECT i.*, 
                 COALESCE(i.selling_price, i.price, 0) as sale_price,
                 COALESCE(i.purchase_price, 0) as cost_price
          FROM items i
          WHERE i.id = ${item.id} AND i.garage_id = ${garage_id}
        `;

        if (currentItem.length === 0) {
          return NextResponse.json({ 
            error: `الصنف غير موجود: ${item.id}` 
          }, { status: 404 });
        }

        const dbItem = currentItem[0];
        
        if (dbItem.quantity < item.quantity) {
          return NextResponse.json({ 
            error: `الكمية غير كافية لـ ${dbItem.name}. المتوفر: ${dbItem.quantity}` 
          }, { status: 400 });
        }

        const salePrice = Number(dbItem.sale_price) || 0;
        const costPrice = Number(dbItem.cost_price) || 0;
        const itemTotal = salePrice * item.quantity;
        subtotal += itemTotal;

        saleItems.push({
          id: item.id,
          quantity: item.quantity,
          price: salePrice,
          cost: costPrice,
          total: itemTotal
        });

      } catch (itemError) {
        console.error('Error processing item:', itemError);
        return NextResponse.json({ 
          error: 'فشل في معالجة الصنف' 
        }, { status: 500 });
      }
    }

    // Create sale record
    const newSales = await sql`
      INSERT INTO sales (
        garage_id, user_id, customer_name, customer_phone,
        subtotal, total_amount, payment_method, notes
      ) VALUES (
        ${garage_id}, ${parseInt(userId)}, ${customer_name || null}, 
        ${customer_phone || null}, ${subtotal}, ${subtotal}, 
        ${payment_method || 'cash'}, ${notes || null}
      )
      RETURNING *
    `;

    const sale = newSales[0];

    // Insert sale items and update inventory
    for (const item of saleItems) {
      await sql`
        INSERT INTO sale_items (
          sale_id, item_id, quantity, price_at_sale, cost_at_sale, total_price
        ) VALUES (
          ${sale.id}, ${item.id}, ${item.quantity}, 
          ${item.price}, ${item.cost}, ${item.total}
        )
      `;

      await sql`
        UPDATE items 
        SET quantity = quantity - ${item.quantity},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${item.id}
      `;
    }

    return NextResponse.json(sale, { status: 201 });
    
  } catch (error: any) {
    console.error('Error creating sale:', error);
    
    // Handle connection timeout specifically
    if (error.code === 'UND_ERR_CONNECT_TIMEOUT' || error.message?.includes('timeout')) {
      return NextResponse.json({ 
        error: 'فشل الاتصال بقاعدة البيانات. الرجاء المحاولة مرة أخرى.' 
      }, { status: 503 });
    }
    
    return NextResponse.json({ 
      error: 'فشل في إنشاء الفاتورة. الرجاء المحاولة مرة أخرى.' 
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;
    
    if (!userId) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const garageId = searchParams.get('garageId');
    const limit = searchParams.get('limit');

    let sales;
    if (garageId) {
      sales = await sql`
        SELECT s.*, g.name as garage_name 
        FROM sales s
        JOIN garages g ON s.garage_id = g.id
        WHERE s.garage_id = ${parseInt(garageId)} AND s.user_id = ${parseInt(userId)}
        ORDER BY s.sale_date DESC
        ${limit ? sql`LIMIT ${parseInt(limit)}` : sql``}
      `;
    } else {
      sales = await sql`
        SELECT s.*, g.name as garage_name 
        FROM sales s
        JOIN garages g ON s.garage_id = g.id
        WHERE s.user_id = ${parseInt(userId)}
        ORDER BY s.sale_date DESC
        ${limit ? sql`LIMIT ${parseInt(limit)}` : sql``}
      `;
    }

    return NextResponse.json(sales || []);
    
  } catch (error: any) {
    console.error('Error fetching sales:', error);
    
    if (error.code === 'UND_ERR_CONNECT_TIMEOUT') {
      return NextResponse.json({ 
        error: 'فشل الاتصال بقاعدة البيانات' 
      }, { status: 503 });
    }
    
    return NextResponse.json({ error: 'فشل في جلب المبيعات' }, { status: 500 });
  }
}