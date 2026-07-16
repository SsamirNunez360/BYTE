import db from '../lib/db';
import { INITIAL_USER_COURSES } from '../data/userCourses';
import { YEARS } from '../data/courses';

function seed() {
  const insertUser = db.prepare('INSERT OR IGNORE INTO users (id, password, is_new_user, manual_selection_completed) VALUES (?, ?, ?, ?)');
  const insertCourseStatus = db.prepare('INSERT OR REPLACE INTO course_status (user_id, course_code, status) VALUES (?, ?, ?)');
  const insertYear = db.prepare('INSERT OR REPLACE INTO years (year, name, color) VALUES (?, ?, ?)');
  const insertPeriod = db.prepare('INSERT INTO periods (year, p, label, ca) VALUES (?, ?, ?, ?)');
  const insertCourse = db.prepare('INSERT OR REPLACE INTO courses (code, name, ca, status, equiv) VALUES (?, ?, ?, ?, ?)');
  const insertCoursePeriod = db.prepare('INSERT OR REPLACE INTO course_period (course_code, year, period) VALUES (?, ?, ?)');
  const insertPrerequisite = db.prepare('INSERT OR REPLACE INTO prerequisites (course_code, prerequisite_code) VALUES (?, ?)');

  const transaction = db.transaction(() => {
    // Semillas de catálogo de cursos
    YEARS.forEach(year => {
      insertYear.run(year.year, year.name, year.color);
      year.periods.forEach(period => {
        insertPeriod.run(year.year, period.p, period.label, period.ca);
        period.courses.forEach(course => {
          insertCourse.run(course.code, course.name, course.ca, course.status, course.equiv ? 1 : 0);
          insertCoursePeriod.run(course.code, year.year, period.p);
          course.prerequisites.forEach(prereq => {
            insertPrerequisite.run(course.code, prereq);
          });
        });
      });
    });

    // Semillas de usuarios y su estado académico
    for (const [userId, courses] of Object.entries(INITIAL_USER_COURSES)) {
      insertUser.run(userId, '123456789', 0, 1);
      for (const courseCode of courses) {
        insertCourseStatus.run(userId, courseCode, 'approved');
      }
    }
  });

  transaction();
  console.log('Base de datos inicializada con catálogo de cursos y usuarios.');
}

seed();
