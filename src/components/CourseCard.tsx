'use client';

import { Course } from '../data/courses';

interface CourseCardProps {
  course: Course;
  onToggleApproved: (code: string) => void;
  onToggleCurrent: (code: string) => void;
  isApproved: boolean;
  isCurrent: boolean;
}

export default function CourseCard({ 
  course, 
  onToggleApproved, 
  onToggleCurrent,
  isApproved, 
  isCurrent 
}: CourseCardProps) {
  
  const statusLabel =
    isApproved ? 'Aprobada' :
    isCurrent ? 'En curso' : 'Pendiente';

  const getBadge = () => {
    if (isApproved) {
      return <span className="card-badge badge-approved">Aprobada</span>;
    } else if (isCurrent) {
      return <span className="card-badge badge-current">En curso</span>;
    }
    return null;
  };

  return (
    <div 
      className={`card ${isApproved ? 'approved selected' : isCurrent ? 'current' : 'pending'}`} 
      onClick={(e) => {
        // Shift click o Alt click para marcar como "en curso" rápidamente?
        // Por ahora mantenemos el click simple para aprobar.
        // Pero el usuario pidió seleccionarlo en el registro.
        onToggleApproved(course.code);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        onToggleCurrent(course.code);
      }}
      title="Click para Aprobar, Click derecho para Marcar en curso"
    >
      <div className="card-top">
        <div className="card-code">{course.code}</div>
        <div className="card-status-pill">{statusLabel}</div>
      </div>
      <div className="card-name">{course.name}</div>
      <div className="card-footer">
        <span className="card-ca">{course.ca > 0 ? course.ca + ' CA' : 'Práct.'}</span>
        {getBadge()}
      </div>
    </div>
  );
}
