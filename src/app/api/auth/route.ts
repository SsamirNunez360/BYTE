import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, userId, password } = body;

    if (action === 'login') {
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;
      
      if (user && user.password === password) {
        return NextResponse.json({ 
          success: true, 
          user: {
            id: user.id,
            isNewUser: !!user.is_new_user,
            manualSelectionCompleted: !!user.manual_selection_completed
          }
        });
      }
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    if (action === 'register') {
      const existing = db.prepare('SELECT id FROM users WHERE id = ?').get(userId);
      if (existing) {
        return NextResponse.json({ error: 'El usuario ya existe' }, { status: 400 });
      }

      db.prepare('INSERT INTO users (id, password, is_new_user, manual_selection_completed) VALUES (?, ?, 1, 0)')
        .run(userId, password);

      return NextResponse.json({ success: true });
    }

    if (action === 'update-onboarding') {
      db.prepare('UPDATE users SET manual_selection_completed = 1, is_new_user = 0 WHERE id = ?')
        .run(userId);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
  } catch (error) {
    console.error('Auth API Error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
