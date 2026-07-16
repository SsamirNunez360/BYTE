'use client';

import { useMemo } from 'react';
import { Year } from '../data/courses';
import { getPhasedLearningPath, COURSE_GRAPH } from '../utils/courseGraph';

interface LearningPathViewProps {
  selectedCourse: string;
  setSelectedCourse: (course: string) => void;
  approvedCourses: Set<string>;
  years: Year[];
}

function StatPill({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        padding: '10px 16px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        minWidth: '100px',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '18px',
          fontWeight: 'bold',
          color,
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-accent)',
          fontSize: '11px',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {label}
      </span>
    </div>
  );
}

export default function LearningPathView({
  selectedCourse,
  setSelectedCourse,
  approvedCourses,
  years
}: LearningPathViewProps) {
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
  }, [approvedCourses, years]);

  const phasedPath = useMemo(
    () => getPhasedLearningPath(selectedCourse, approvedCourses),
    [selectedCourse, approvedCourses]
  );

  const targetCourse = COURSE_GRAPH.get(selectedCourse);
  const totalPending = phasedPath.reduce((acc, phase) => acc + phase.length, 0);

  return (
    <div className="learning-path-container">
      {/* Header Glass Section */}
      <div className="glass-header">
        <div className="glass-header-content">
          <h3 className="glass-title">Explorador de Ruta Académica</h3>
          <p className="glass-subtitle">Visualiza los grupos de materias por fases de cumplimiento.</p>
          
          <div className="course-selector-wrapper">
            <label htmlFor="path-course-select" className="selector-label">
              Curso Objetivo:
            </label>
            <div className="select-container">
              <select
                id="path-course-select"
                value={selectedCourse}
                onChange={e => setSelectedCourse(e.target.value)}
                className="glass-select"
              >
                {allPendingCourses.map(course => (
                  <option key={course.code} value={course.code}>
                    {course.code} - {course.name}
                  </option>
                ))}
              </select>
              <div className="select-arrow"></div>
            </div>
          </div>
        </div>

        <div className="glass-stats-grid">
          <StatPill
            label="Fases"
            value={phasedPath.length}
            color="var(--unah-blue)"
          />
          <StatPill
            label="Materias"
            value={totalPending}
            color="var(--unah-gold)"
          />
          {targetCourse && (
            <StatPill
              label="Dificultad"
              value={targetCourse.difficulty}
              color="var(--status-current)"
            />
          )}
        </div>
      </div>

      {/* Phased Content */}
      {phasedPath.length === 0 ? (
        <div className="glass-empty-state">
          <div className="empty-icon">✨</div>
          <h4>¡Ruta Completada!</h4>
          <p>Ya cumples con todos los requisitos para matricular <strong>{selectedCourse}</strong>.</p>
        </div>
      ) : (
        <div className="phased-roadmap" style={{ position: 'relative' }}>
          {phasedPath.map((phase, phaseIndex) => {
            const colors = ['#0066CC', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#EC4899'];
            const phaseColor = colors[phaseIndex % colors.length];

            return (
              <div key={phaseIndex} className="phase-row" style={{ '--phase-color': phaseColor } as any}>
                <div className="phase-indicator">
                  <div className="phase-number" style={{ color: phaseColor }}>{phaseIndex + 1}</div>
                  <div className="phase-label">Fase</div>
                </div>

                <div className="phase-courses">
                  {phase.map((code) => {
                    const node = COURSE_GRAPH.get(code);
                    const isTarget = code === selectedCourse;
                    
                    return (
                      <div 
                        key={code} 
                        id={`course-${code}`}
                        className={`glass-course-card ${isTarget ? 'target' : ''}`}
                      >
                        <div className="card-glass-glow" />
                        <div className="course-header">
                          <span className="course-code" style={{ color: phaseColor }}>{code}</span>
                          {node && (
                            <span className={`difficulty-dot ${node.difficulty}`} title={node.difficulty} />
                          )}
                        </div>
                        <div className="course-name">{node?.name ?? code}</div>
                        
                        {node && node.prerequisites.length > 0 && (
                          <div className="course-deps">
                            <span className="dep-label">Requisito:</span>
                            <div className="dep-list-detailed">
                              {node.prerequisites.map(p => {
                                const pNode = COURSE_GRAPH.get(p);
                                return (
                                  <div key={p} className={`dep-item-detailed ${approvedCourses.has(p) ? 'approved' : ''}`}>
                                    <span className="p-code">{p}</span>
                                    <span className="p-name">{pNode?.name ?? ''}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {phaseIndex < phasedPath.length - 1 && (
                  <div className="phase-divider" style={{ background: phaseColor }} />
                )}
              </div>
            );
          })}
        </div>
      )}

      <style jsx>{`
        .learning-path-container {
          display: flex;
          flex-direction: column;
          gap: 32px;
          padding: 8px;
        }

        .glass-header {
          background: var(--glass-bg);
          backdrop-filter: var(--glass-backdrop);
          -webkit-backdrop-filter: var(--glass-backdrop);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          padding: 32px;
          box-shadow: var(--glass-shadow);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 32px;
          flex-wrap: wrap;
          position: relative;
          overflow: hidden;
        }

        .glass-header::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, var(--unah-blue), transparent);
          opacity: 0.5;
        }

        .glass-header-content {
          flex: 1;
          min-width: 300px;
        }

        .glass-title {
          font-family: var(--font-heading);
          font-size: 28px;
          color: var(--text-primary);
          margin-bottom: 6px;
          letter-spacing: -0.5px;
        }

        .glass-subtitle {
          color: var(--text-muted);
          font-size: 15px;
          margin-bottom: 24px;
          max-width: 500px;
        }

        .course-selector-wrapper {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .selector-label {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--unah-blue);
          letter-spacing: 1px;
        }

        .select-container {
          position: relative;
          max-width: 450px;
        }

        .glass-select {
          width: 100%;
          padding: 14px 20px;
          background: var(--bg-accent);
          border: 1px solid var(--border);
          border-radius: 16px;
          font-family: var(--font-accent);
          font-size: 15px;
          color: var(--text-primary);
          appearance: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
        }

        .glass-select:focus {
          outline: none;
          border-color: var(--unah-blue);
          box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.15);
          background: var(--surface);
          transform: translateY(-1px);
        }

        .glass-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .phased-roadmap {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .phase-row {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          padding: 20px 0;
        }

        .phase-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 24px;
          background: var(--surface);
          padding: 6px 16px;
          border-radius: 999px;
          border: 1px solid var(--border);
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          z-index: 2;
          transition: transform 0.3s ease;
        }

        .phase-row:hover .phase-indicator {
          transform: scale(1.05);
          border-color: var(--unah-blue);
        }

        .phase-number {
          font-family: var(--font-heading);
          font-size: 20px;
          font-weight: 800;
          color: var(--unah-blue);
          line-height: 1;
        }

        .phase-label {
          font-size: 10px;
          text-transform: uppercase;
          color: var(--text-muted);
          font-weight: 800;
          letter-spacing: 0.5px;
        }

        .phase-courses {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 20px;
          width: 100%;
          padding: 32px;
          background: rgba(var(--unah-blue), 0.03);
          border-radius: 32px;
          border: 1px dashed var(--border);
          transition: all 0.3s ease;
        }

        .phase-row:hover .phase-courses {
          background: rgba(var(--unah-blue), 0.05);
          border-style: solid;
          border-color: rgba(var(--unah-blue), 0.2);
        }

        .glass-course-card {
          position: relative;
          width: 260px;
          background: var(--glass-bg);
          backdrop-filter: var(--glass-backdrop);
          -webkit-backdrop-filter: var(--glass-backdrop);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          padding: 20px;
          box-shadow: var(--glass-shadow);
          transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
          overflow: hidden;
        }

        .glass-course-card:hover {
          transform: translateY(-12px) scale(1.03);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
          border-color: var(--unah-blue);
        }

        .glass-course-card.target {
          border: 2px solid var(--unah-gold);
          background: linear-gradient(135deg, var(--glass-bg) 0%, rgba(184, 134, 11, 0.1) 100%);
        }

        .card-glass-glow {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at center, rgba(var(--unah-blue), 0.1) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .glass-course-card:hover .card-glass-glow {
          opacity: 1;
        }

        .course-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .course-code {
          font-family: var(--font-accent);
          font-weight: 800;
          font-size: 13px;
          color: var(--unah-blue);
          letter-spacing: 0.5px;
        }

        .difficulty-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          position: relative;
        }

        .difficulty-dot::after {
          content: '';
          position: absolute;
          top: -2px; left: -2px; right: -2px; bottom: -2px;
          border-radius: 50%;
          border: 1px solid currentColor;
          opacity: 0.3;
        }

        .difficulty-dot.básico { background: #10b981; color: #10b981; box-shadow: 0 0 12px rgba(16, 185, 129, 0.5); }
        .difficulty-dot.intermedio { background: #f59e0b; color: #f59e0b; box-shadow: 0 0 12px rgba(245, 158, 11, 0.5); }
        .difficulty-dot.avanzado { background: #ef4444; color: #ef4444; box-shadow: 0 0 12px rgba(239, 68, 68, 0.5); }

        .course-name {
          font-weight: 700;
          font-size: 15px;
          color: var(--text-primary);
          line-height: 1.5;
          margin-bottom: 16px;
          height: 45px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .course-deps {
          border-top: 1px solid var(--border);
          padding-top: 12px;
        }

        .dep-label {
          display: block;
          font-size: 10px;
          color: var(--text-muted);
          margin-bottom: 6px;
          text-transform: uppercase;
          font-weight: 700;
        }

        .dep-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .dep-pill {
          font-size: 10px;
          padding: 3px 8px;
          background: var(--bg-secondary);
          border-radius: 6px;
          color: var(--text-secondary);
          border: 1px solid var(--border);
          transition: all 0.2s ease;
        }

        .dep-pill.approved {
          background: var(--status-approved-bg);
          color: var(--status-approved);
          border-color: var(--status-approved-border);
        }

        .phase-connector {
          height: 80px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          margin: -10px 0;
        }

        .phased-roadmap {
          display: flex;
          flex-direction: column;
          gap: 40px;
          padding: 20px 0;
        }

        .phase-row {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .phase-courses {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 32px;
          width: 100%;
          padding: 32px 20px;
        }

        .glass-course-card {
          position: relative;
          width: 280px;
          background: var(--glass-bg);
          backdrop-filter: var(--glass-backdrop);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          padding: 24px;
          box-shadow: var(--glass-shadow);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .glass-course-card:hover {
          transform: translateY(-8px);
          border-color: var(--phase-color);
          box-shadow: 0 15px 30px rgba(0,0,0,0.15);
        }

        .course-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .course-code {
          font-family: var(--font-accent);
          font-weight: 800;
          font-size: 14px;
        }

        .difficulty-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .difficulty-dot.básico { background: #10b981; }
        .difficulty-dot.intermedio { background: #f59e0b; }
        .difficulty-dot.avanzado { background: #ef4444; }

        .course-name {
          font-weight: 700;
          font-size: 16px;
          color: var(--text-primary);
          line-height: 1.4;
          margin-bottom: 20px;
          height: 45px;
          overflow: hidden;
        }

        .course-deps {
          border-top: 1px solid var(--border);
          padding-top: 16px;
        }

        .dep-label {
          display: block;
          font-size: 11px;
          color: var(--unah-blue);
          margin-bottom: 10px;
          text-transform: uppercase;
          font-weight: 800;
          letter-spacing: 0.5px;
        }

        .dep-list-detailed {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .dep-item-detailed {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 8px 12px;
          background: var(--bg-accent);
          border-radius: 10px;
          border: 1px solid var(--border);
          transition: all 0.3s ease;
        }

        .dep-item-detailed.approved {
          background: var(--status-approved-bg);
          border-color: var(--status-approved-border);
        }

        .p-code {
          font-size: 11px;
          font-weight: 800;
          color: var(--unah-blue);
        }

        .dep-item-detailed.approved .p-code {
          color: var(--status-approved);
        }

        .p-name {
          font-size: 12px;
          color: var(--text-secondary);
          line-height: 1.2;
        }

        .phase-divider {
          width: 60px;
          height: 4px;
          border-radius: 2px;
          opacity: 0.3;
          margin: 20px 0;
        }

        .difficulty-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .difficulty-dot.básico { background: #10b981; }
        .difficulty-dot.intermedio { background: #f59e0b; }
        .difficulty-dot.avanzado { background: #ef4444; }

        .course-name {
          font-weight: 700;
          font-size: 15px;
          color: var(--text-primary);
          line-height: 1.5;
          margin-bottom: 16px;
          height: 45px;
          overflow: hidden;
        }

        .course-deps {
          border-top: 1px solid var(--border);
          padding-top: 12px;
        }

        .dep-label {
          display: block;
          font-size: 10px;
          color: var(--text-muted);
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .dep-list {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }

        .dep-pill {
          font-size: 9px;
          padding: 2px 6px;
          background: var(--bg-accent);
          border-radius: 4px;
          color: var(--text-secondary);
        }

        .dep-pill.approved {
          background: var(--status-approved-bg);
          color: var(--status-approved);
          border: 1px solid var(--status-approved-border);
        }

        .glass-empty-state {
          text-align: center;
          padding: 80px 40px;
          background: var(--glass-bg);
          backdrop-filter: var(--glass-backdrop);
          border: 2px dashed var(--border);
          border-radius: 40px;
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 24px;
        }

        .glass-empty-state h4 {
          font-family: var(--font-heading);
          font-size: 28px;
          color: var(--status-approved);
          margin-bottom: 12px;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .glass-course-card {
          animation: fadeInUp 0.8s cubic-bezier(0.23, 1, 0.32, 1) both;
        }
      `}</style>
    </div>
  );
}