'use client';

import { Year } from '../data/courses';
import PeriodBlock from './PeriodBlock';

interface YearBlockProps {
  year: Year;
  approvedCourses: Set<string>;
  currentCourses: Set<string>;
  onToggleApproved: (code: string) => void;
  onToggleCurrent: (code: string) => void;
  animationDelay: number;
}

export default function YearBlock({ 
  year, 
  approvedCourses, 
  currentCourses,
  onToggleApproved, 
  onToggleCurrent,
  animationDelay 
}: YearBlockProps) {
  const allCourses = year.periods.flatMap(p => p.courses);
  const approved = allCourses.filter(c => approvedCourses.has(c.code)).length;
  const current = allCourses.filter(c => currentCourses.has(c.code)).length;
  const total = allCourses.length;
  const pct = Math.round((approved + current * 0.5) / total * 100);

  return (
    <div className="year-block" style={{ animationDelay: `${animationDelay}s` }}>
      <div className="year-header">
        <div className="year-header-main">
          <div className="year-number" style={{ color: year.color, borderColor: `${year.color}30`, background: `${year.color}12` }}>
            Año {year.year}
          </div>
          <div className="year-copy">
            <div className="year-title">{year.name}</div>
            <div className="year-subtitle">{year.periods.length} períodos · {total} asignaturas</div>
          </div>
        </div>
        <div className="year-header-side">
          <div className="year-stats">{approved}/{total} aprobadas</div>
          <div className="year-percent" style={{ color: year.color }}>{pct}%</div>
        </div>
      </div>
      <div className="year-periods">
        {year.periods.map(period => (
          <PeriodBlock
            key={period.p}
            period={period}
            yearColor={year.color}
            approvedCourses={approvedCourses}
            currentCourses={currentCourses}
            onToggleApproved={onToggleApproved}
            onToggleCurrent={onToggleCurrent}
          />
        ))}
      </div>
      <div className="year-progress">
        <div className="year-prog-track">
          <div className="year-prog-fill" style={{ width: `${pct}%`, background: year.color }}></div>
        </div>
      </div>
    </div>
  );
}
