'use client';

import { Course, Year } from '../data/courses';

interface AcademicStatsProps {
  approvedCourses: Set<string>;
  totalCourses: number;
  approvedCount: number;
  approvedCA: number;
  currentCA: number;
  years: Year[];
}

export default function AcademicStats({
  approvedCourses,
  totalCourses,
  approvedCount,
  approvedCA,
  currentCA,
  years
}: AcademicStatsProps) {
  // Calcular estadísticas por año
  const yearStats = years.map(year => {
    const yearCourses = year.periods.flatMap(p => p.courses);
    const yearApproved = yearCourses.filter(c => approvedCourses.has(c.code)).length;
    const yearTotal = yearCourses.length;
    const yearCA = yearCourses.filter(c => approvedCourses.has(c.code)).reduce((sum, c) => sum + c.ca, 0);
    const yearTotalCA = yearCourses.reduce((sum, c) => sum + c.ca, 0);

    return {
      year: year.year,
      name: year.name,
      approved: yearApproved,
      total: yearTotal,
      percentage: Math.round((yearApproved / yearTotal) * 100),
      ca: yearCA,
      totalCA: yearTotalCA,
      color: year.color
    };
  });

  // Calcular tiempo estimado restante
  const remainingCourses = Math.max(0, totalCourses - approvedCount);
  const avgCoursesPerPeriod = 4; // Asumiendo 4 cursos por período
  const periodsRemaining = totalCourses > 0 ? Math.ceil(remainingCourses / avgCoursesPerPeriod) : 0;
  const yearsRemaining = totalCourses > 0 ? Math.ceil(periodsRemaining / 3) : 0; // 3 períodos por año

  // Categorizar cursos por área (basado en códigos)
  const areaStats: Record<string, { approved: number; total: number; ca: number; totalCA: number }> = {
    'Matemáticas': { approved: 0, total: 0, ca: 0, totalCA: 0 },
    'Programación': { approved: 0, total: 0, ca: 0, totalCA: 0 },
    'Ingeniería': { approved: 0, total: 0, ca: 0, totalCA: 0 },
    'Idiomas': { approved: 0, total: 0, ca: 0, totalCA: 0 },
    'Humanidades': { approved: 0, total: 0, ca: 0, totalCA: 0 },
    'Ciencias': { approved: 0, total: 0, ca: 0, totalCA: 0 }
  };

  years.forEach(year =>
    year.periods.forEach(period =>
      period.courses.forEach(course => {
        let area = 'Ciencias'; // Default

        if (course.code.startsWith('MM-') || course.code.startsWith('MA-')) area = 'Matemáticas';
        else if (course.code.startsWith('ISC-') || course.code.startsWith('IISC-')) area = 'Programación';
        else if (course.code.includes('IE-') || course.code.includes('EL-') || course.code.includes('TE-')) area = 'Ingeniería';
        else if (course.code.startsWith('IN-')) area = 'Idiomas';
        else if (course.code.startsWith('FF-') || course.code.startsWith('SC-') || course.code.startsWith('EG-')) area = 'Humanidades';

        areaStats[area].total++;
        areaStats[area].totalCA += course.ca;

        if (approvedCourses.has(course.code)) {
          areaStats[area].approved++;
          areaStats[area].ca += course.ca;
        }
      })
    )
  );

  return (
    <div className="academic-stats">
      <div className="stats-header">
        <h2>Estadísticas Académicas</h2>
        <p className="stats-subtitle">Tu progreso en la carrera de Ingeniería en Sistemas Computacionales</p>
      </div>

      {/* Métricas principales */}
      <div className="stats-overview">
        <div className="stats-card">
          <div className="stats-value">{approvedCount}</div>
          <div className="stats-label">Cursos Aprobados</div>
          <div className="stats-subtext">de {totalCourses} totales</div>
        </div>

        <div className="stats-card">
          <div className="stats-value">{approvedCA + currentCA}</div>
          <div className="stats-label">Créditos Acumulados</div>
          <div className="stats-subtext">Unidades Valorativas</div>
        </div>

        <div className="stats-card">
          <div className="stats-value">
            {totalCourses > 0 ? Math.round((approvedCount / totalCourses) * 100) : 0}%
          </div>
          <div className="stats-label">Progreso General</div>
          <div className="stats-subtext">{remainingCourses} cursos restantes</div>
        </div>

        <div className="stats-card">
          <div className="stats-value">{yearsRemaining}</div>
          <div className="stats-label">Años Estimados</div>
          <div className="stats-subtext">para completar</div>
        </div>
      </div>

      {/* Progreso por año */}
      <div className="stats-section">
        <h3>Progreso por Año</h3>
        <div className="year-progress-grid">
          {yearStats.map(stat => (
            <div key={stat.year} className="year-progress-card">
              <div className="year-header">
                <span className="year-name">{stat.name}</span>
                <span className="year-percentage">{stat.percentage}%</span>
              </div>
              <div className="year-progress-bar">
                <div
                  className="year-progress-fill"
                  style={{
                    width: `${stat.percentage}%`,
                    backgroundColor: stat.color
                  }}
                ></div>
              </div>
              <div className="year-details">
                <span>{stat.approved}/{stat.total} cursos</span>
                <span>{stat.ca}/{stat.totalCA} UV</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progreso por área */}
      <div className="stats-section">
        <h3>Progreso por Área de Conocimiento</h3>
        <div className="area-progress-grid">
          {Object.entries(areaStats).map(([area, stats]) => {
            const percentage = stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0;
            return (
              <div key={area} className="area-progress-card">
                <div className="area-header">
                  <span className="area-name">{area}</span>
                  <span className="area-percentage">{percentage}%</span>
                </div>
                <div className="area-progress-bar">
                  <div
                    className="area-progress-fill"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="area-details">
                  <span>{stats.approved}/{stats.total} cursos</span>
                  <span>{stats.ca}/{stats.totalCA} UV</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
