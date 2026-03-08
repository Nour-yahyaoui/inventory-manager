import { NextResponse } from 'next/server';
import { sql } from '../../lib/db';

export async function POST(request: Request) {
  try {
    const { email, password, full_name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني وكلمة المرور مطلوبان' },
        { status: 400 }
      );
    }

    // Simple email validation
    if (!email.includes('@') || !email.includes('.')) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني غير صالح' },
        { status: 400 }
      );
    }

    if (password.length < 3) {
      return NextResponse.json(
        { error: 'كلمة المرور يجب أن تكون 3 أحرف على الأقل' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existing = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني موجود بالفعل' },
        { status: 400 }
      );
    }

    // Create user - using password_hash instead of password
    const users = await sql`
      INSERT INTO users (email, password_hash, full_name) 
      VALUES (${email}, ${password}, ${full_name || null})
      RETURNING id, email, full_name
    `;

    const user = users[0];
    
    const response = NextResponse.json(
      { user },
      { status: 201 }
    );
    
    response.cookies.set('userId', user.id.toString(), { 
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
    
    return response;
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}