'use client';

import { Period } from '../data/courses';
import CourseCard from './CourseCard';

interface PeriodBlockProps {
  period: Period;
  yearColor: string;
  approvedCourses: Set<string>;
  currentCourses: Set<string>;
  onToggleApproved: (code: string) => void;
  onToggleCurrent: (code: string) => void;
}

export default function PeriodBlock({ 
  period, 
  yearColor, 
  approvedCourses, 
  currentCourses,
  onToggleApproved,
  onToggleCurrent
}: PeriodBlockProps) {
  const periodCA = period.courses.reduce((s, c) => s + c.ca, 0);

  return (
    <div className="period-block">
      <div className="period-sidebar" style={{ borderColor: `${yearColor}28`, background: `${yearColor}10` }}>
        <div className="period-label" style={{ color: yearColor }}>{period.label}</div>
        <div className="period-meta">
          {periodCA > 0 && <div className="period-ca">{periodCA} CA</div>}
          <div className="period-count">{period.courses.length} clases</div>
        </div>
      </div>
      <div className="period-content">
        <div className="period-line" style={{ background: yearColor }}></div>
        <div className="cards-grid">
          {period.courses.map(course => (
            <CourseCard
              key={course.code}
              course={course}
              onToggleApproved={onToggleApproved}
              onToggleCurrent={onToggleCurrent}
              isApproved={approvedCourses.has(course.code)}
              isCurrent={currentCourses.has(course.code)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
