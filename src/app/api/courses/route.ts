import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const years = db.prepare('SELECT year, name, color FROM years ORDER BY year').all() as Array<{ year: number; name: string; color: string }>;
    const periods = db.prepare('SELECT id, year, p, label, ca FROM periods ORDER BY year, p').all() as Array<{ id: number; year: number; p: number; label: string; ca: number }>;
    const courses = db.prepare('SELECT code, name, ca, status, equiv FROM courses').all() as Array<{ code: string; name: string; ca: number; status: string; equiv: number }>;
    const coursePeriods = db.prepare('SELECT course_code, year, period FROM course_period').all() as Array<{ course_code: string; year: number; period: number }>;
    const prerequisites = db.prepare('SELECT course_code, prerequisite_code FROM prerequisites').all() as Array<{ course_code: string; prerequisite_code: string }>;

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
      year: year.year,
      name: year.name,
      color: year.color,
      periods: periods
        .filter(period => period.year === year.year)
        .map(period => ({
          p: period.p,
          label: period.label,
          ca: period.ca,
          courses: coursePeriods
            .filter(cp => cp.year === year.year && cp.period === period.p)
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
