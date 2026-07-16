'use client';

import { useMemo } from 'react';
import { Course, Year } from '../data/courses';

interface CourseSelectionViewProps {
  title: string;
  subtitle: string;
  selectedCourses: Set<string>;
  setSelectedCourses: (courses: Set<string>) => void;
  onContinue: () => void;
  courseSearch: string;
  setCourseSearch: (search: string) => void;
  selectionType?: 'approved' | 'current';
  excludeCourses?: Set<string>;
  years: Year[];
}

export default function CourseSelectionView({
  title,
  subtitle,
  selectedCourses,
  setSelectedCourses,
  onContinue,
  courseSearch,
  setCourseSearch,
  selectionType = 'approved',
  excludeCourses = new Set(),
  years
}: CourseSelectionViewProps) {
  
  const toggleCourse = (code: string) => {
    const newSelected = new Set(selectedCourses);
    if (newSelected.has(code)) {
      newSelected.delete(code);
    } else {
      newSelected.add(code);
    }
    setSelectedCourses(newSelected);
  };

  const toggleYear = (yearCourses: string[], allSelected: boolean) => {
    const newSelected = new Set(selectedCourses);
    yearCourses.forEach(code => {
      if (allSelected) {
        newSelected.delete(code);
      } else {
        newSelected.add(code);
      }
    });
    setSelectedCourses(newSelected);
  };

  const totalCoursesCount = useMemo(() => years.reduce((acc, y) => 
    acc + y.periods.reduce((pAcc, p) => pAcc + p.courses.length, 0), 0
  ), [years]);

  return (
    <div className="course-selection-glass">
      <div className="selection-header">
        <div className="stepper">
          <div className="step active">{selectionType === 'approved' ? '1' : '2'}</div>
          <div className="step-line"></div>
          <div className="step">{selectionType === 'approved' ? '2' : '✓'}</div>
        </div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
        
        <div className="search-bar-container">
          <div className="search-input-wrapper">
            <span className="search-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input
              type="text"
              placeholder="Buscar por nombre o código..."
              value={courseSearch}
              onChange={(e) => setCourseSearch(e.target.value)}
              className="glass-search-input"
            />
          </div>
          <div className="quick-actions">
            <button onClick={() => setSelectedCourses(new Set())} className="text-action">Limpiar todo</button>
          </div>
        </div>
      </div>

      <div className="selection-scroll-area">
        {years.map((year) => {
          const yearCodes = year.periods.flatMap(p => 
            p.courses.filter(c => !excludeCourses.has(c.code)).map(c => c.code)
          );
          const filteredYearCourses = year.periods.flatMap(p => 
            p.courses.filter(c => 
              !excludeCourses.has(c.code) && (
                c.name.toLowerCase().includes(courseSearch.toLowerCase()) || 
                c.code.toLowerCase().includes(courseSearch.toLowerCase())
              )
            )
          );

          if (filteredYearCourses.length === 0) return null;

          const allYearSelected = yearCodes.every(code => selectedCourses.has(code));

          return (
            <div key={year.year} className="year-selection-group">
              <div className="year-group-header">
                <h3>{year.name}</h3>
                <button 
                  onClick={() => toggleYear(yearCodes, allYearSelected)}
                  className={`year-toggle-btn ${allYearSelected ? 'all' : ''}`}
                >
                  {allYearSelected ? 'Desmarcar Año' : 'Marcar Año Completo'}
                </button>
              </div>
              <div className="selection-grid">
                {filteredYearCourses.map((course) => (
                  <div 
                    key={course.code}
                    onClick={() => toggleCourse(course.code)}
                    className={`selection-card ${selectedCourses.has(course.code) ? 'selected' : ''}`}
                  >
                    <div className="check-indicator">
                      {selectedCourses.has(course.code) && <span>✓</span>}
                    </div>
                    <div className="card-info">
                      <span className="code">{course.code}</span>
                      <span className="name">{course.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="selection-footer-glass">
        <div className="progress-info">
          <div className="progress-text">
            <strong>{selectedCourses.size}</strong> materias {selectionType === 'approved' ? 'aprobadas' : 'en curso'}
          </div>
          <div className="progress-mini-bar">
            <div 
              className={`progress-mini-fill ${selectionType}`} 
              style={{ width: `${(selectedCourses.size / totalCoursesCount) * 100}%` }}
            />
          </div>
        </div>
        <button onClick={onContinue} className={`continue-btn ${selectionType}`}>
          {selectionType === 'approved' ? 'Siguiente Paso' : 'Finalizar Selección'}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

      <style jsx>{`
        .course-selection-glass {
          max-width: 1600px;
          width: 98%;
          margin: 10px auto;
          background: var(--glass-bg);
          backdrop-filter: var(--glass-backdrop);
          border: 1px solid var(--glass-border);
          border-radius: 32px;
          display: flex;
          flex-direction: column;
          height: 85vh;
          overflow: hidden;
          box-shadow: var(--glass-shadow);
        }

        .selection-header {
          padding: 40px;
          border-bottom: 1px solid var(--border);
          text-align: center;
        }

        .stepper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .step {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--bg-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 14px;
          color: var(--text-muted);
        }

        .step.active {
          background: var(--unah-blue);
          color: white;
          box-shadow: 0 0 15px rgba(0, 102, 204, 0.3);
        }

        .step-line {
          width: 40px;
          height: 2px;
          background: var(--border);
        }

        .selection-header h1 {
          font-family: var(--font-heading);
          font-size: 32px;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .selection-header p {
          color: var(--text-muted);
          font-size: 15px;
          margin-bottom: 32px;
        }

        .search-bar-container {
          display: flex;
          align-items: center;
          gap: 20px;
          max-width: 600px;
          margin: 0 auto;
        }

        .search-input-wrapper {
          flex: 1;
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          opacity: 0.5;
        }

        .glass-search-input {
          width: 100%;
          padding: 14px 14px 14px 44px;
          background: var(--surface);
          border: 2px solid var(--border);
          border-radius: 16px;
          font-size: 15px;
          transition: all 0.3s ease;
        }

        .glass-search-input:focus {
          border-color: var(--unah-blue);
          outline: none;
          box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.1);
        }

        .text-action {
          background: none;
          border: none;
          color: var(--unah-gold);
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          text-decoration: underline;
        }

        .selection-scroll-area {
          flex: 1;
          overflow-y: auto;
          padding: 40px;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .year-selection-group {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .year-group-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 12px;
          border-bottom: 2px solid var(--bg-accent);
        }

        .year-group-header h3 {
          font-family: var(--font-heading);
          font-size: 18px;
          color: var(--unah-blue);
        }

        .year-toggle-btn {
          padding: 6px 16px;
          background: var(--bg-accent);
          border: 1px solid var(--border);
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .year-toggle-btn:hover {
          background: var(--border);
        }

        .year-toggle-btn.all {
          background: var(--unah-gold);
          color: white;
          border-color: var(--unah-gold);
        }

        .selection-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
        }

        .selection-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: var(--surface);
          border: 2px solid var(--border);
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.2, 1, 0.2, 1);
        }

        .selection-card:hover {
          border-color: var(--unah-blue);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .selection-card.selected {
          background: ${selectionType === 'approved' ? 'var(--status-approved-bg)' : 'rgba(245,158,11,0.1)'};
          border-color: ${selectionType === 'approved' ? 'var(--status-approved)' : 'var(--unah-gold)'};
        }

        .check-indicator {
          width: 24px;
          height: 24px;
          border-radius: 8px;
          border: 2px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }

        .selected .check-indicator {
          background: ${selectionType === 'approved' ? 'var(--status-approved)' : 'var(--unah-gold)'};
          border-color: ${selectionType === 'approved' ? 'var(--status-approved)' : 'var(--unah-gold)'};
          color: white;
          font-weight: bold;
        }

        .card-info {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .code {
          font-size: 11px;
          font-weight: 800;
          color: var(--unah-blue);
          letter-spacing: 0.5px;
        }

        .name {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .selection-footer-glass {
          padding: 24px 40px;
          background: var(--surface);
          border-top: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 10;
        }

        .progress-info {
          flex: 1;
          max-width: 300px;
        }

        .progress-text {
          font-size: 13px;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }

        .progress-mini-bar {
          height: 6px;
          background: var(--bg-accent);
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-mini-fill.approved {
          background: var(--status-approved);
        }

        .progress-mini-fill.current {
          background: var(--unah-gold);
        }

        .continue-btn {
          padding: 14px 32px;
          background: var(--unah-blue);
          color: white;
          border: none;
          border-radius: 16px;
          font-weight: 800;
          font-size: 15px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .continue-btn.current {
          background: var(--unah-gold);
          color: var(--unah-navy);
        }

        .continue-btn:hover {
          background: var(--unah-navy);
          transform: scale(1.02);
          box-shadow: 0 8px 20px rgba(0, 102, 204, 0.3);
        }

        @media (max-width: 768px) {
          .course-selection-glass {
            height: 92vh;
            width: 100%;
            margin: 0;
            border-radius: 0;
          }

          .selection-header {
            padding: 20px;
          }

          .selection-header h1 {
            font-size: 24px;
          }

          .search-bar-container {
            flex-direction: column;
            gap: 12px;
          }

          .selection-scroll-area {
            padding: 20px;
          }

          .selection-grid {
            grid-template-columns: 1fr;
          }

          .selection-footer-glass {
            padding: 20px;
            flex-direction: column;
            gap: 16px;
          }

          .progress-info {
            max-width: 100%;
            width: 100%;
          }

          .continue-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
