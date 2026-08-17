import db from '../lib/db';
import { INITIAL_USER_COURSES } from '../data/userCourses';
import { CAREERS } from '../data/courses';

function seed() {
  const insertCareer = db.prepare('INSERT OR REPLACE INTO careers (id, name) VALUES (?, ?)');
  const insertUser = db.prepare('INSERT OR IGNORE INTO users (id, password, is_new_user, manual_selection_completed, career_id) VALUES (?, ?, ?, ?, ?)');
  const insertCourseStatus = db.prepare('INSERT OR REPLACE INTO course_status (user_id, course_code, status) VALUES (?, ?, ?)');
  
  // Usamos db.prepare().run() devolviendo lastInsertRowid para los years ya que ahora son AUTOINCREMENT
  const insertYear = db.prepare('INSERT INTO years (career_id, year_number, name, color) VALUES (?, ?, ?, ?)');
  
  const insertPeriod = db.prepare('INSERT INTO periods (year_id, p, label, ca) VALUES (?, ?, ?, ?)');
  const insertCourse = db.prepare('INSERT OR REPLACE INTO courses (code, name, ca, status, equiv) VALUES (?, ?, ?, ?, ?)');
  const insertCoursePeriod = db.prepare('INSERT OR REPLACE INTO course_period (course_code, year_id, period) VALUES (?, ?, ?)');
  const insertPrerequisite = db.prepare('INSERT OR REPLACE INTO prerequisites (course_code, prerequisite_code) VALUES (?, ?)');

  const transaction = db.transaction(() => {
    // Semillas de catálogo de cursos para todas las carreras
    for (const [careerId, careerData] of Object.entries(CAREERS)) {
      insertCareer.run(careerId, careerData.name);
      
      careerData.years.forEach(year => {
        const result = insertYear.run(careerId, year.year, year.name, year.color);
        const yearId = result.lastInsertRowid;
        
        year.periods.forEach(period => {
          insertPeriod.run(yearId, period.p, period.label, period.ca);
          period.courses.forEach(course => {
            insertCourse.run(course.code, course.name, course.ca, course.status, course.equiv ? 1 : 0);
            insertCoursePeriod.run(course.code, yearId, period.p);
            course.prerequisites.forEach(prereq => {
              insertPrerequisite.run(course.code, prereq);
            });
          });
        });
      });
    }

    // Semillas de usuarios y su estado académico (Asignamos por defecto 'isc' a los usuarios base)
    for (const [userId, courses] of Object.entries(INITIAL_USER_COURSES)) {
      insertUser.run(userId, '123456789', 0, 1, 'isc');
      for (const courseCode of courses) {
        insertCourseStatus.run(userId, courseCode, 'approved');
      }
    }
  });

  transaction();
  console.log('Base de datos inicializada con múltiples carreras y usuarios.');
}

seed();
