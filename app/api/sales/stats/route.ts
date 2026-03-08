import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sql } from '../../../lib/db';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;
    
    if (!userId) {
      return NextResponse.json({ 
        summary: {
          total_sales: 0,
          total_revenue: 0,
          average_sale: 0,
          total_profit: 0
        },
        daily: []
      });
    }

    // Get total sales count and revenue
    const salesStats = await sql`
      SELECT 
        COUNT(*) as total_sales,
        COALESCE(SUM(total_amount), 0) as total_revenue,
        COALESCE(AVG(total_amount), 0) as average_sale
      FROM sales
      WHERE user_id = ${parseInt(userId)}
    `;

    // Get total profit
    const profitStats = await sql`
      SELECT COALESCE(SUM((price_at_sale - cost_at_sale) * quantity), 0) as total_profit
      FROM sale_items si
      JOIN sales s ON si.sale_id = s.id
      WHERE s.user_id = ${parseInt(userId)}
    `;

    // Get recent daily stats (last 7 days)
    const dailyStats = await sql`
      SELECT 
        DATE(s.sale_date) as date,
        COUNT(DISTINCT s.id) as sales_count,
        COALESCE(SUM(s.total_amount), 0) as revenue,
        COALESCE(SUM((si.price_at_sale - si.cost_at_sale) * si.quantity), 0) as profit
      FROM sales s
      LEFT JOIN sale_items si ON s.id = si.sale_id
      WHERE s.user_id = ${parseInt(userId)}
        AND s.sale_date >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY DATE(s.sale_date)
      ORDER BY date DESC
    `;

    const summary = {
      total_sales: Number(salesStats[0]?.total_sales) || 0,
      total_revenue: Number(salesStats[0]?.total_revenue) || 0,
      average_sale: Number(salesStats[0]?.average_sale) || 0,
      total_profit: Number(profitStats[0]?.total_profit) || 0
    };

    return NextResponse.json({
      summary,
      daily: dailyStats.map(day => ({
        date: day.date,
        count: Number(day.sales_count),
        revenue: Number(day.revenue),
        profit: Number(day.profit)
      }))
    });
    
  } catch (error) {
    console.error('Error in sales stats:', error);
    // Return empty data instead of error
    return NextResponse.json({
      summary: {
        total_sales: 0,
        total_revenue: 0,
        average_sale: 0,
        total_profit: 0
      },
      daily: []
    });
  }
}