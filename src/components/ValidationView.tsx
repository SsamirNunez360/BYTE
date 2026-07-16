'use client';

import { useMemo } from 'react';
import { Year } from '../data/courses';
import { validatePrerequisites, type PrerequisiteCheckResult } from '../utils/courseGraph';

interface ValidationViewProps {
  selectedCourse: string;
  setSelectedCourse: (course: string) => void;
  approvedCourses: Set<string>;
  years: Year[];
}

export default function ValidationView({
  selectedCourse,
  setSelectedCourse,
  approvedCourses,
  years
}: ValidationViewProps) {
  // Obtener todos los cursos pendientes
  const allPendingCourses = useMemo(() => {
    const pending: Array<{ code: string; name: string }> = [];
    years.forEach(year =>
      year.periods.forEach(period =>
        period.courses.forEach(course => {
          if (course.status === 'pending' && !approvedCourses.has(course.code)) {
            pending.push({ code: course.code, name: course.name });
          }
        })
      )
    );
    return pending;
  }, [approvedCourses]);

  // Validar prerequisitos del curso seleccionado
  const prerequisiteCheck = useMemo(() => {
    return validatePrerequisites(selectedCourse, approvedCourses);
  }, [selectedCourse, approvedCourses]);

  return (
    <div className="rec-content">
      <div className="rec-section">
        <h3>Validar Prerequisitos de un Curso</h3>
        <div className="rec-input-group">
          <label htmlFor="course-select">Seleccionar curso a validar:</label>
          <select
            id="course-select"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="rec-select"
          >
            {allPendingCourses.map(course => (
              <option key={course.code} value={course.code}>
                {course.code} - {course.name}
              </option>
            ))}
          </select>
        </div>

        <div className="rec-result">
          <h4>Resultado de Validación:</h4>
          <div className={`rec-status ${prerequisiteCheck.canTake ? 'success' : 'error'}`}>
            <span className="rec-status-icon">
              {prerequisiteCheck.canTake ? '✓' : '✗'}
            </span>
            <span className="rec-status-text">
              {prerequisiteCheck.canTake
                ? 'Puedes llevar este curso'
                : 'No puedes llevar este curso aún'
              }
            </span>
          </div>

          {!prerequisiteCheck.canTake && prerequisiteCheck.missingPrerequisites.length > 0 && (
            <div className="rec-missing-prereqs">
              <h5>Prerequisitos faltantes:</h5>
              <ul>
                {prerequisiteCheck.missingPrerequisites.map(course => (
                  <li key={course.code} className="rec-missing-item">
                    {course.code} - {course.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {prerequisiteCheck.canTake && prerequisiteCheck.satisfiedPrerequisites.length > 0 && (
            <div className="rec-satisfied-prereqs">
              <h5>Prerequisitos cumplidos:</h5>
              <ul>
                {prerequisiteCheck.satisfiedPrerequisites.map(course => (
                  <li key={course.code} className="rec-satisfied-item">
                    {course.code} - {course.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}