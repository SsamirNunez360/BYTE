'use client';

import { useMemo } from 'react';
import { validatePrerequisites, SPECIALIZATION_PATHS } from '../utils/courseGraph';

interface SpecializationViewProps {
  approvedCourses: Set<string>;
}

export default function SpecializationView({ approvedCourses }: SpecializationViewProps) {
  // Filtrar especialidades accesibles
  const accessibleSpecializations = useMemo(() => {
    return SPECIALIZATION_PATHS.filter(spec => {
      const canTakeMost = spec.courses.filter(code => {
        const validation = validatePrerequisites(code, approvedCourses);
        return validation.canTake;
      }).length >= spec.courses.length * 0.66; // Al menos 66% accesibles

      return canTakeMost;
    });
  }, [approvedCourses]);

  return (
    <div className="rec-content">
      <div className="rec-section">
        <h3>Especialidades Disponibles</h3>
        <p className="rec-description">
          Especialidades que puedes cursar basadas en tus cursos aprobados.
        </p>

        {accessibleSpecializations.length === 0 ? (
          <div className="rec-no-specializations">
            <p>No tienes suficientes cursos aprobados para acceder a especialidades específicas aún.</p>
            <p>Continúa aprobando cursos para desbloquear más opciones.</p>
          </div>
        ) : (
          <div className="rec-specializations-grid">
            {accessibleSpecializations.map(spec => (
              <div key={spec.name} className="rec-specialization-card">
                <div className="rec-spec-header">
                  <h4>{spec.name}</h4>
                  <span className="rec-spec-difficulty">{spec.difficulty}</span>
                </div>

                <div className="rec-spec-description">
                  <p>{spec.description}</p>
                </div>

                <div className="rec-spec-courses">
                  <h5>Cursos principales ({spec.courses.length}):</h5>
                  <ul>
                    {spec.courses.map(code => {
                      const validation = validatePrerequisites(code, approvedCourses);
                      return (
                        <li key={code} className={`rec-spec-course ${validation.canTake ? 'available' : 'locked'}`}>
                          <span className="rec-course-code">{code}</span>
                          <span className="rec-course-status">
                            {validation.canTake ? 'Disponible' : 'Bloqueado'}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}