import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const careerId = searchParams.get('careerId');

    if (!careerId) {
      return NextResponse.json({ error: 'careerId es requerido' }, { status: 400 });
    }

    const years = db.prepare('SELECT id, year_number, name, color FROM years WHERE career_id = ? ORDER BY year_number').all(careerId) as Array<{ id: number; year_number: number; name: string; color: string }>;
    
    if (years.length === 0) {
      return NextResponse.json({ years: [] });
    }

    const yearIds = years.map(y => y.id);
    const placeholders = yearIds.map(() => '?').join(',');

    const periods = db.prepare(`SELECT id, year_id, p, label, ca FROM periods WHERE year_id IN (${placeholders}) ORDER BY year_id, p`).all(...yearIds) as Array<{ id: number; year_id: number; p: number; label: string; ca: number }>;
    const coursePeriods = db.prepare(`SELECT course_code, year_id, period FROM course_period WHERE year_id IN (${placeholders})`).all(...yearIds) as Array<{ course_code: string; year_id: number; period: number }>;
    
    // Solo obtenemos los cursos que pertenecen a los periods de esta carrera
    const courseCodes = [...new Set(coursePeriods.map(cp => cp.course_code))];
    if (courseCodes.length === 0) {
      return NextResponse.json({ years: years.map(y => ({ year: y.year_number, name: y.name, color: y.color, periods: [] })) });
    }

    const coursePlaceholders = courseCodes.map(() => '?').join(',');
    const courses = db.prepare(`SELECT code, name, ca, status, equiv FROM courses WHERE code IN (${coursePlaceholders})`).all(...courseCodes) as Array<{ code: string; name: string; ca: number; status: string; equiv: number }>;
    const prerequisites = db.prepare(`SELECT course_code, prerequisite_code FROM prerequisites WHERE course_code IN (${coursePlaceholders})`).all(...courseCodes) as Array<{ course_code: string; prerequisite_code: string }>;

    const courseMap = new Map(courses.map(course => [course.code, {
      code: course.code,
      name: course.name,
      ca: course.ca,
      status: course.status,
      equiv: Boolean(course.equiv),
      prerequisites: [] as string[]
    }]));

    prerequisites.forEach(pr => {
      const course = courseMap.get(pr.course_code);
      if (course) {
        course.prerequisites.push(pr.prerequisite_code);
      }
    });

    const yearsResult = years.map(year => ({
      year: year.year_number,
      name: year.name,
      color: year.color,
      periods: periods
        .filter(period => period.year_id === year.id)
        .map(period => ({
          p: period.p,
          label: period.label,
          ca: period.ca,
          courses: coursePeriods
            .filter(cp => cp.year_id === year.id && cp.period === period.p)
            .map(cp => courseMap.get(cp.course_code))
            .filter((course): course is { code: string; name: string; ca: number; status: string; equiv: boolean; prerequisites: string[] } => Boolean(course))
        }))
    }));

    return NextResponse.json({ years: yearsResult });
  } catch (error) {
    console.error('Error fetching course catalog:', error);
    return NextResponse.json({ error: 'No se pudo cargar el catálogo de cursos' }, { status: 500 });
  }
}
