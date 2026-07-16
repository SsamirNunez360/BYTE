import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const user = searchParams.get('user');

  if (!user) {
    return NextResponse.json({ error: 'User is required' }, { status: 400 });
  }

  try {
    const rows = db.prepare('SELECT course_code, status FROM course_status WHERE user_id = ?').all(user) as { course_code: string, status: string }[];
    
    const approved = rows.filter(r => r.status === 'approved').map(r => r.course_code);
    const current = rows.filter(r => r.status === 'current').map(r => r.course_code);

    return NextResponse.json({ approved, current });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { user, courseCode, status, action } = await request.json();

    if (!user || !courseCode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Asegurarse de que el usuario existe
    db.prepare('INSERT OR IGNORE INTO users (id) VALUES (?)').run(user);

    if (action === 'delete') {
      db.prepare('DELETE FROM course_status WHERE user_id = ? AND course_code = ?').run(user, courseCode);
    } else {
      db.prepare('INSERT OR REPLACE INTO course_status (user_id, course_code, status) VALUES (?, ?, ?)').run(user, courseCode, status);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
