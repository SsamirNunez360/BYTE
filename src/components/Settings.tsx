'use client';

import { useState } from 'react';
import { YEARS, Course } from '../data/courses';

interface SettingsProps {
  approvedCourses: Set<string>;
  coursesPerPeriod: number;
  onCoursesPerPeriodChange: (num: number) => void;
  onSuggest: () => void;
  suggestedPlan: { period: string; courses: Course[] }[];
  completionYear: number | null;
  completionPeriod: string | null;
}

export default function Settings({
  approvedCourses,
  coursesPerPeriod,
  onCoursesPerPeriodChange,
  onSuggest,
  suggestedPlan,
  completionYear,
  completionPeriod
}: SettingsProps) {
  const totalCourses = YEARS.flatMap(y => y.periods.flatMap(p => p.courses)).length;
  const approvedCount = approvedCourses.size;
  const pendingCourses = YEARS.flatMap(y => y.periods.flatMap(p => p.courses)).filter(c => !approvedCourses.has(c.code));

  return (
    <div className="settings">
      <h2>Configuración del Plan Académico</h2>
      <div className="setting-item">
        <label>Clases aprobadas: {approvedCount} / {totalCourses}</label>
      </div>
      <div className="setting-item">
        <label htmlFor="coursesPerPeriod">Clases por período:</label>
        <input
          id="coursesPerPeriod"
          type="number"
          min="1"
          max="10"
          value={coursesPerPeriod}
          onChange={(e) => onCoursesPerPeriodChange(parseInt(e.target.value) || 1)}
        />
      </div>
      <button onClick={onSuggest}>Generar Plan Académico</button>
      {completionYear && completionPeriod && (
        <div className="completion-info">
          <p>Finalizarías en <strong>{completionYear}</strong>, período <strong>{completionPeriod}</strong></p>
        </div>
      )}
      {suggestedPlan.length > 0 && (
        <div className="suggestions">
          <div className="suggestions-header">
            <h3>Plan Académico Sugerido</h3>
            <div className="completion-badge">
              
              <span>Finalización Estimada: {completionPeriod} {completionYear}</span>
            </div>
          </div>
          <div className="plan-timeline">
            {suggestedPlan.map((item, index) => (
              <div key={index} className="plan-period">
                <div className="period-header">
                  <div className="period-dot"></div>
                  <div className="period-connector"></div>
                  <h4>{item.period}</h4>
                  <span className="course-count">{item.courses.length} clases</span>
                </div>
                <div className="period-courses">
                  {item.courses.map(course => (
                    <div key={course.code} className="course-item">
                      <div className="course-code">{course.code}</div>
                      <div className="course-name">{course.name}</div>
                      <div className="course-ca">{course.ca} CA</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="plan-completion">
              <div className="completion-dot"></div>
              <div className="completion-text">Fin del Plan de Estudios</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}