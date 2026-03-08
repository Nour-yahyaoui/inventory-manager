import { NextResponse } from 'next/server';
import { sql } from '../../lib/db';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني وكلمة المرور مطلوبان' },
        { status: 400 }
      );
    }

    // Use password_hash in the query
    const users = await sql`
      SELECT * FROM users WHERE email = ${email} AND password_hash = ${password}
    `;

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'خطأ في البريد الإلكتروني أو كلمة المرور' },
        { status: 401 }
      );
    }

    const user = users[0];
    
    const response = NextResponse.json(
      { user: { id: user.id, email: user.email, full_name: user.full_name } },
      { status: 200 }
    );
    
    response.cookies.set('userId', user.id.toString(), { 
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}