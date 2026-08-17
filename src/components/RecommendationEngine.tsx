'use client';

import { useState, useMemo } from 'react';
import { Course, Year } from '../data/courses';
import {
  validatePrerequisites,
  getRecommendations,
  COURSE_GRAPH,
  type Recommendation
} from '../utils/courseGraph';
import ValidationView from './ValidationView';
import LearningPathView from './LearningPathView';

interface SuggestedPlanItem {
  period: string;
  courses: Course[];
}

interface RecommendationEngineProps {
  approvedCourses: Set<string>;
  currentCourses: Set<string>;
  suggestedPlan: SuggestedPlanItem[];
  years: Year[];
}

export default function RecommendationEngine({
  approvedCourses,
  currentCourses,
  suggestedPlan,
  years
}: RecommendationEngineProps) {
  const [selectedCourse, setSelectedCourse] = useState<string>('IE-326');
  const [viewMode, setViewMode] = useState<'planPeriodo' | 'validation' | 'path'>('planPeriodo');

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
  }, [approvedCourses, years]);

  // Obtener todas las clases del plan para el selector
  const allCareerCourses = useMemo(() => {
    return years.flatMap(y => y.periods.flatMap(p => p.courses));
  }, [years]);

  const selectedCourseValue = useMemo(() => {
    const availableCodes = new Set(allCareerCourses.map(course => course.code));
    if (availableCodes.has(selectedCourse)) {
      return selectedCourse;
    }

    // Por defecto, intentar mostrar la última clase (e.g. PPS) para que abarque toda la ruta
    const ppsCourse = allCareerCourses.find(c => c.code === 'PPS');
    return ppsCourse?.code ?? allCareerCourses[allCareerCourses.length - 1]?.code ?? 'IE-326';
  }, [allCareerCourses, selectedCourse]);

  const nextSuggestedPeriod = suggestedPlan[0] ?? null;

  const projectedCompletedCourses = useMemo(
    () => new Set([...approvedCourses, ...currentCourses]),
    [approvedCourses, currentCourses]
  );

  // Obtener recomendaciones con base en el próximo período del plan sugerido.
  const recommendations = useMemo(() => {
    if (nextSuggestedPeriod) {
      return nextSuggestedPeriod.courses.map((course, index) => {
        const validation = validatePrerequisites(course.code, projectedCompletedCourses, allCareerCourses);
        const graphCourse = COURSE_GRAPH.get(course.code);
        const difficulty = graphCourse?.difficulty || 'intermedio';

        return {
          courseCode: course.code,
          courseName: course.name,
          canTake: validation.canTake,
          reason: validation.canTake
            ? 'Incluida en tu plan sugerido para el próximo período.'
            : `Faltan prerequisitos: ${validation.missingPrerequisites.map(p => p.name).join(', ')}`,
          missingPrerequisites: validation.missingPrerequisites.map(p => p.code),
          difficulty,
          recommendationScore: validation.canTake ? 100 : 0
        };
      });
    }

    return getRecommendations(approvedCourses, currentCourses, allPendingCourses, allCareerCourses);
  }, [approvedCourses, allPendingCourses, currentCourses, nextSuggestedPeriod, projectedCompletedCourses, allCareerCourses]);

  return (
    <div className="recommendation-engine-glass">
      <div className="rec-glass-header">
        <div className="header-text">
          <h2 className="glass-title">Motor de Recomendación Académica</h2>
        </div>
      </div>

      {/* Selector de vista con estética Glass */}
      <div className="glass-tabs">
        <button
          className={`glass-tab ${viewMode === 'planPeriodo' || viewMode === 'validation' ? 'active' : ''}`}
          onClick={() => setViewMode('planPeriodo')}
        >
          {viewMode === 'validation' ? '← Volver al Plan' : 'Plan Próximo Período'}
        </button>
        <button
          className={`glass-tab ${viewMode === 'path' ? 'active' : ''}`}
          onClick={() => setViewMode('path')}
        >
          Ruta de Aprendizaje
        </button>
      </div>

      <div className="rec-view-container">
        {viewMode === 'planPeriodo' && (
          <div className="rec-suggestions-grid">
            <div className="grid-header">
              <h3 className="section-title">
                {nextSuggestedPeriod
                  ? `Clases sugeridas para ${nextSuggestedPeriod.period}`
                  : 'Recomendaciones Generales'}
              </h3>
              <div className="status-legend">
                <span className="legend-dot ready"></span> Listas
                <span className="legend-dot pending"></span> Pendientes
              </div>
            </div>

            <div className="rec-cards-container">
              {recommendations.map((rec, index) => (
                <div
                  key={rec.courseCode}
                  className={`rec-glass-card ${rec.canTake ? 'ready' : 'pending'}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="card-top">
                    <div className="course-identity">
                      <span className="course-code">{rec.courseCode}</span>
                      <h4 className="course-name">{rec.courseName}</h4>
                    </div>
                    <div className={`diff-pill ${rec.difficulty}`}>
                      {rec.difficulty}
                    </div>
                  </div>

                  <div className="card-score-section">
                    <div className="score-header">
                      <span className="score-label">Prioridad Académica</span>
                      <span className="score-value">{rec.recommendationScore}%</span>
                    </div>
                    <div className="score-track">
                      <div
                        className="score-fill"
                        style={{ width: `${rec.recommendationScore}%` }}
                      ></div>
                    </div>
                  </div>

                  <p className="rec-reason">{rec.reason}</p>

                  {rec.missingPrerequisites.length > 0 && (
                    <div className="missing-box">
                      <span className="missing-label">Requisitos faltantes:</span>
                      <div className="missing-tags">
                        {rec.missingPrerequisites.map(p => (
                          <span key={p} className="missing-tag">{p}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {viewMode === 'validation' && (
          <div className="view-fade-in">
            <ValidationView
              selectedCourse={selectedCourseValue}
              setSelectedCourse={setSelectedCourse}
              approvedCourses={approvedCourses}
              years={years}
            />
          </div>
        )}

        {viewMode === 'path' && (
          <div className="view-fade-in">
            <LearningPathView
              selectedCourse={selectedCourseValue}
              setSelectedCourse={setSelectedCourse}
              approvedCourses={approvedCourses}
              years={years}
            />
          </div>
        )}

      </div>

      <style jsx>{`
        .recommendation-engine-glass {
          padding: 30px;
          background: var(--glass-bg);
          backdrop-filter: var(--glass-backdrop);
          border: 1px solid var(--glass-border);
          border-radius: 30px;
          box-shadow: var(--glass-shadow);
        }

        .rec-glass-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 40px;
        }

        .header-icon-badge {
          width: 56px;
          height: 56px;
          background: var(--bg-accent);
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
        }

        .glass-title {
          font-family: var(--font-heading);
          font-size: 26px;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .glass-subtitle {
          font-size: 14px;
          color: var(--text-muted);
        }

        .glass-tabs {
          display: flex;
          gap: 10px;
          padding: 6px;
          background: var(--bg-accent);
          border-radius: 16px;
          margin-bottom: 40px;
          width: fit-content;
        }

        .glass-tab {
          padding: 10px 24px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-family: var(--font-accent);
          font-weight: 700;
          font-size: 13px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .glass-tab:hover {
          color: var(--unah-blue);
        }

        .glass-tab.active {
          background: var(--surface);
          color: var(--unah-blue);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }

        .grid-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .section-title {
          font-family: var(--font-heading);
          font-size: 20px;
          color: var(--unah-blue);
        }

        .status-legend {
          display: flex;
          align-items: center;
          gap: 15px;
          font-size: 12px;
          color: var(--text-muted);
        }

        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .legend-dot.ready { background: var(--status-approved); }
        .legend-dot.pending { background: var(--unah-gold); }

        .rec-cards-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        .rec-glass-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 24px;
          transition: all 0.4s cubic-bezier(0.2, 1, 0.2, 1);
          animation: slideUp 0.6s ease both;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .rec-glass-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.1);
          border-color: var(--unah-blue);
        }

        .rec-glass-card.ready {
          border-top: 5px solid var(--status-approved);
        }

        .rec-glass-card.pending {
          border-top: 5px solid var(--unah-gold);
        }

        .course-identity {
          margin-bottom: 16px;
        }

        .course-code {
          font-family: var(--font-accent);
          font-weight: 900;
          font-size: 12px;
          color: var(--unah-blue);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .course-name {
          font-size: 17px;
          font-weight: 800;
          color: var(--text-primary);
          margin-top: 4px;
          line-height: 1.3;
        }

        .diff-pill {
          padding: 4px 12px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .diff-pill.básico { background: #ecfdf5; color: #065f46; }
        .diff-pill.intermedio { background: #fffbeb; color: #92400e; }
        .diff-pill.avanzado { background: #fef2f2; color: #991b1b; }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .card-score-section {
          margin-bottom: 20px;
        }

        .score-header {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          margin-bottom: 6px;
        }

        .score-track {
          height: 6px;
          background: var(--bg-accent);
          border-radius: 3px;
          overflow: hidden;
        }

        .score-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--unah-blue), var(--unah-light-blue));
          border-radius: 3px;
        }

        .rec-reason {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 20px;
        }

        .missing-box {
          background: var(--bg-accent);
          padding: 12px;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .missing-label {
          display: block;
          font-size: 11px;
          font-weight: 800;
          color: var(--unah-gold);
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .missing-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .missing-tag {
          font-size: 11px;
          font-weight: 700;
          background: var(--surface);
          padding: 4px 10px;
          border-radius: 6px;
          color: var(--text-primary);
          border: 1px solid var(--border);
        }

        .glass-action-btn {
          width: 100%;
          padding: 12px;
          background: var(--unah-blue);
          color: white;
          border: none;
          border-radius: 14px;
          font-weight: 700;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .glass-action-btn:hover {
          background: var(--unah-navy);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 102, 204, 0.3);
        }

        .view-fade-in {
          animation: fadeIn 0.4s ease-out both;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
