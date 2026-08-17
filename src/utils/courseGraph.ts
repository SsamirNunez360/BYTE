/**
 * Sistema de Recomendación Basado en Grafo de Dependencias Académicas
 * Motor inteligente que valida prerrequisitos y sugiere cursos
 */

export interface CourseNode {
  code: string;
  name: string;
  prerequisites: string[]; // Códigos de cursos que son requisito
  recommendedAfter?: string[]; // Cursos recomendados llevar después
  difficulty: 'básico' | 'intermedio' | 'avanzado';
}

/**
 * Grafo de dependencias académicas
 * Define los prerequisitos para cada curso
 */
export const COURSE_GRAPH: Map<string, CourseNode> = new Map([
  // PRIMER AÑO
  ['ISC-101', {
    code: 'ISC-101',
    name: 'Introducción a la Ingeniería en Sistemas Computacionales',
    prerequisites: [],
    difficulty: 'básico'
  }],
  ['EG-011', {
    code: 'EG-011',
    name: 'Español General',
    prerequisites: [],
    difficulty: 'básico'
  }],
  ['MM-110', {
    code: 'MM-110',
    name: 'Matemática I',
    prerequisites: [],
    difficulty: 'básico'
  }],
  ['SC-101', {
    code: 'SC-101',
    name: 'Sociología',
    prerequisites: [],
    difficulty: 'básico'
  }],
  ['IN-101', {
    code: 'IN-101',
    name: 'Optativa I: Campo de las Lenguas Extranjeras (Inglés I)',
    prerequisites: [],
    difficulty: 'básico'
  }],
  ['ISC-102', {
    code: 'ISC-102',
    name: 'Programación Estructurada',
    prerequisites: ['ISC-101'],
    difficulty: 'intermedio'
  }],
  ['FF-101', {
    code: 'FF-101',
    name: 'Filosofía',
    prerequisites: [],
    difficulty: 'básico'
  }],
  ['MM-111', {
    code: 'MM-111',
    name: 'Geometría y Trigonometría',
    prerequisites: [],
    difficulty: 'intermedio'
  }],
  ['IN-102', {
    code: 'IN-102',
    name: 'Inglés II',
    prerequisites: ['IN-101'],
    difficulty: 'intermedio'
  }],
  ['ISC-103', {
    code: 'ISC-103',
    name: 'Programación Orientada a Objetos',
    prerequisites: ['ISC-102'],
    difficulty: 'intermedio'
  }],
  ['MM-201', {
    code: 'MM-201',
    name: 'Cálculo I',
    prerequisites: ['MM-110', 'MM-111'],
    difficulty: 'intermedio'
  }],
  ['MM-211', {
    code: 'MM-211',
    name: 'Vectores y Matrices',
    prerequisites: ['MM-110', 'MM-111'],
    difficulty: 'intermedio'
  }],
  ['IN-103', {
    code: 'IN-103',
    name: 'Inglés III',
    prerequisites: ['IN-102'],
    difficulty: 'intermedio'
  }],

  // SEGUNDO AÑO
  ['MM-420', {
    code: 'MM-420',
    name: 'Matemáticas Discretas',
    prerequisites: ['MM-110'],
    difficulty: 'intermedio'
  }],
  ['MM-202', {
    code: 'MM-202',
    name: 'Cálculo II',
    prerequisites: ['MM-201', 'MM-211'],
    difficulty: 'avanzado'
  }],
  ['FS-100', {
    code: 'FS-100',
    name: 'Física I',
    prerequisites: ['MM-201', 'MM-211'],
    difficulty: 'intermedio'
  }],
  ['HH-101', {
    code: 'HH-101',
    name: 'Historia de Honduras',
    prerequisites: [],
    difficulty: 'básico'
  }],
  ['ISC-204', {
    code: 'ISC-204',
    name: 'Paradigmas de Programación',
    prerequisites: ['ISC-103'],
    difficulty: 'avanzado'
  }],
  ['MM-401', {
    code: 'MM-401',
    name: 'Estadística I',
    prerequisites: ['MM-202'],
    difficulty: 'intermedio'
  }],
  ['FS-200', {
    code: 'FS-200',
    name: 'Física II',
    prerequisites: ['FS-100'],
    difficulty: 'avanzado'
  }],
  ['OPT-II', {
    code: 'OPT-II',
    name: 'Optativa II: Campo de las Humanidades',
    prerequisites: [],
    difficulty: 'básico'
  }],
  ['OPT-III', {
    code: 'OPT-III',
    name: 'Optativa III: Campo de las Artes y el Deporte',
    prerequisites: [],
    difficulty: 'básico'
  }],
  ['ISC-211', {
    code: 'ISC-211',
    name: 'Estructuras de Datos',
    prerequisites: ['MM-420', 'MM-211', 'ISC-103'],
    difficulty: 'avanzado'
  }],
  ['AGE-102', {
    code: 'AGE-102',
    name: 'Administración',
    prerequisites: ['MM-401'],
    difficulty: 'intermedio'
  }],
  ['IE-326', {
    code: 'IE-326',
    name: 'Instalaciones Eléctricas para Centros de Datos',
    prerequisites: ['FS-200'],
    difficulty: 'avanzado'
  }],

  // TERCER AÑO
  ['ISC-321', {
    code: 'ISC-321',
    name: 'Fundamentos de Base de Datos',
    prerequisites: ['MM-420'],
    difficulty: 'intermedio'
  }],
  ['ISC-351', {
    code: 'ISC-351',
    name: 'Contabilidad Financiera',
    prerequisites: ['AGE-102'],
    difficulty: 'intermedio'
  }],
  ['ISC-331', {
    code: 'ISC-331',
    name: 'Redes de Datos I',
    prerequisites: ['IE-326'],
    difficulty: 'intermedio'
  }],
  ['ISC-333', {
    code: 'ISC-333',
    name: 'Sistemas Operativos I',
    prerequisites: ['ISC-211'],
    difficulty: 'intermedio'
  }],
  ['ISC-312', {
    code: 'ISC-312',
    name: 'Teoría de la Computación',
    prerequisites: ['ISC-211', 'ISC-204'],
    difficulty: 'avanzado'
  }],
  ['ISC-341', {
    code: 'ISC-341',
    name: 'Sistemas de Información',
    prerequisites: ['ISC-351'],
    difficulty: 'intermedio'
  }],
  ['ISC-332', {
    code: 'ISC-332',
    name: 'Redes de Datos II',
    prerequisites: ['ISC-331'],
    difficulty: 'avanzado'
  }],
  ['ISC-334', {
    code: 'ISC-334',
    name: 'Sistemas Operativos II',
    prerequisites: ['ISC-333'],
    difficulty: 'avanzado'
  }],
  ['ISC-305', {
    code: 'ISC-305',
    name: 'Programación Web',
    prerequisites: ['ISC-321'],
    difficulty: 'intermedio'
  }],
  ['ISC-313', {
    code: 'ISC-313',
    name: 'Compiladores',
    prerequisites: ['ISC-312'],
    difficulty: 'avanzado'
  }],
  ['ISC-306', {
    code: 'ISC-306',
    name: 'Análisis de Requerimientos',
    prerequisites: ['ISC-341', 'ISC-321'],
    difficulty: 'intermedio'
  }],
  ['ISC-336', {
    code: 'ISC-336',
    name: 'Diseño Digital',
    prerequisites: ['ISC-334'],
    difficulty: 'avanzado'
  }],

  // CUARTO AÑO
  ['ISC-407', {
    code: 'ISC-407',
    name: 'Programación Móvil',
    prerequisites: ['ISC-305'],
    difficulty: 'avanzado'
  }],
  ['ISC-414', {
    code: 'ISC-414',
    name: 'Inteligencia Artificial',
    prerequisites: ['ISC-313', 'MM-401'],
    difficulty: 'avanzado'
  }],
  ['ISC-435', {
    code: 'ISC-435',
    name: 'Administración de Servidores',
    prerequisites: ['ISC-334', 'ISC-332'],
    difficulty: 'avanzado'
  }],
  ['ISC-437', {
    code: 'ISC-437',
    name: 'Arquitectura de Computadoras',
    prerequisites: ['ISC-336'],
    difficulty: 'avanzado'
  }],
  ['ISC-408', {
    code: 'ISC-408',
    name: 'Ingeniería del Software',
    prerequisites: ['ISC-306', 'ISC-407'],
    difficulty: 'avanzado'
  }],
  ['ISC-422', {
    code: 'ISC-422',
    name: 'Administración de Base de Datos',
    prerequisites: ['ISC-321'],
    difficulty: 'avanzado'
  }],
  ['ISC-442', {
    code: 'ISC-442',
    name: 'Seguridad Informática',
    prerequisites: ['ISC-435'],
    difficulty: 'avanzado'
  }],
  ['ISC-443', {
    code: 'ISC-443',
    name: 'Industria de TI',
    prerequisites: ['ISC-306'],
    difficulty: 'avanzado'
  }],
  ['ISC-409', {
    code: 'ISC-409',
    name: 'Calidad de Software',
    prerequisites: ['ISC-408'],
    difficulty: 'avanzado'
  }],
  ['ISC-423', {
    code: 'ISC-423',
    name: 'Ciencia de Datos',
    prerequisites: ['ISC-422'],
    difficulty: 'avanzado'
  }],
  ['ISC-415', {
    code: 'ISC-415',
    name: 'Tecnologías Emergentes',
    prerequisites: ['ISC-305', 'ISC-437', 'ISC-332'],
    difficulty: 'avanzado'
  }],
  ['ISC-445', {
    code: 'ISC-445',
    name: 'Proyectos de TI',
    prerequisites: ['ISC-443', 'ISC-442'],
    difficulty: 'avanzado'
  }],

  // QUINTO AÑO
  ['OPT-IV', {
    code: 'OPT-IV',
    name: 'Optativa IV: Campo de las Ciencias Naturales',
    prerequisites: [],
    difficulty: 'básico'
  }],
  ['ISC-552', {
    code: 'ISC-552',
    name: 'Seminario de Investigación',
    prerequisites: ['ISC-415', 'ISC-445', 'ISC-423', 'ISC-437'],
    difficulty: 'avanzado'
  }],
  ['ISC-544', {
    code: 'ISC-544',
    name: 'Auditoría Informática',
    prerequisites: ['ISC-442'],
    difficulty: 'avanzado'
  }],
  ['ISC-546', {
    code: 'ISC-546',
    name: 'Ejecución de Proyectos de TI',
    prerequisites: ['ISC-445'],
    difficulty: 'avanzado'
  }],
  ['PPS', {
    code: 'PPS',
    name: 'Práctica Profesional Supervisada',
    prerequisites: ['ISC-552'],
    difficulty: 'avanzado'
  }],
]);

/**
 * Resultado de validación de prerequisitos
 */
export interface PrerequisiteCheckResult {
  canTake: boolean;
  courseCode: string;
  courseName: string;
  missingPrerequisites: CourseNode[];
  satisfiedPrerequisites: CourseNode[];
}

/**
 * Resultado de recomendación de curso
 */
export interface Recommendation {
  courseCode: string;
  courseName: string;
  canTake: boolean;
  reason: string;
  missingPrerequisites: string[];
  difficulty: 'básico' | 'intermedio' | 'avanzado';
  recommendationScore: number; // 0-100
}

function getCourseNode(code: string, allCareerCourses?: Array<{ code: string, name: string, prerequisites: string[] }>): CourseNode | undefined {
  if (COURSE_GRAPH.has(code)) {
    return COURSE_GRAPH.get(code);
  }
  if (allCareerCourses) {
    const c = allCareerCourses.find(x => x.code === code);
    if (c) {
      return {
        code: c.code,
        name: c.name,
        prerequisites: c.prerequisites,
        difficulty: 'intermedio'
      };
    }
  }
  return undefined;
}

function countUnlockedCourses(courseCode: string, allCareerCourses?: Array<{ code: string, name: string, prerequisites: string[] }>): number {
  let unlocked = 0;
  
  if (allCareerCourses) {
    for (const course of allCareerCourses) {
      if (course.prerequisites.includes(courseCode)) unlocked++;
    }
  } else {
    for (const course of COURSE_GRAPH.values()) {
      if (course.prerequisites.includes(courseCode)) unlocked++;
    }
  }

  return unlocked;
}

function getDifficultyBonus(difficulty: CourseNode['difficulty']): number {
  switch (difficulty) {
    case 'básico':
      return 8;
    case 'intermedio':
      return 12;
    case 'avanzado':
      return 6;
    default:
      return 0;
  }
}

/**
 * Valida si un estudiante puede llevar un curso específico
 * @param courseCode - Código del curso a validar
 * @param approvedCourses - Conjunto de cursos aprobados por el estudiante
 * @returns Resultado de la validación
 */
export function validatePrerequisites(
  courseCode: string,
  approvedCourses: Set<string>,
  allCareerCourses?: Array<{ code: string, name: string, prerequisites: string[] }>
): PrerequisiteCheckResult {
  const course = getCourseNode(courseCode, allCareerCourses);

  if (!course) {
    return {
      canTake: false,
      courseCode,
      courseName: 'Curso no encontrado',
      missingPrerequisites: [],
      satisfiedPrerequisites: []
    };
  }

  const missing: CourseNode[] = [];
  const satisfied: CourseNode[] = [];

  for (const prereqCode of course.prerequisites) {
    const prereqCourse = getCourseNode(prereqCode, allCareerCourses);
    if (prereqCourse) {
      if (approvedCourses.has(prereqCode)) {
        satisfied.push(prereqCourse);
      } else {
        missing.push(prereqCourse);
      }
    }
  }

  return {
    canTake: missing.length === 0,
    courseCode,
    courseName: course.name,
    missingPrerequisites: missing,
    satisfiedPrerequisites: satisfied
  };
}

/**
 * Obtiene recomendaciones de cursos para el siguiente período
 */
export function getRecommendations(
  approvedCourses: Set<string>,
  currentCourses: Set<string>,
  pendingCourses: Array<{ code: string; name: string, prerequisites: string[] }>,
  allCareerCourses?: Array<{ code: string, name: string, prerequisites: string[] }>
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  for (const pendingCourse of pendingCourses) {
    if (currentCourses.has(pendingCourse.code)) {
      continue; // Skip if already in progress
    }

    const validation = validatePrerequisites(
      pendingCourse.code,
      approvedCourses,
      allCareerCourses
    );

    const course = getCourseNode(pendingCourse.code, allCareerCourses);
    if (!course) continue;

    let recommendationScore = 0;
    let reason = '';
    const unlockedCourses = countUnlockedCourses(pendingCourse.code, allCareerCourses);

    if (validation.canTake) {
      recommendationScore = Math.min(
        100,
        70 + getDifficultyBonus(course.difficulty) + Math.min(unlockedCourses * 6, 18)
      );

      reason = unlockedCourses > 0
        ? `Cumples todos los prerequisitos y este curso desbloquea ${unlockedCourses} clase(s) más.`
        : 'Cumples todos los prerequisitos y puedes llevarlo en el siguiente período.';
    } else {
      const missingCount = validation.missingPrerequisites.length;
      recommendationScore = Math.max(
        0,
        24 - missingCount * 10 + Math.min(unlockedCourses * 2, 6)
      );

      reason = `Aún no puedes llevarlo. Requiere completar: ${validation.missingPrerequisites.map(p => p.name).join(', ')}`;
    }

    recommendations.push({
      courseCode: pendingCourse.code,
      courseName: pendingCourse.name,
      canTake: validation.canTake,
      reason,
      missingPrerequisites: validation.missingPrerequisites.map(p => p.code),
      difficulty: course.difficulty,
      recommendationScore
    });
  }

  // Priorizar primero cursos que ya se pueden llevar, y dentro de cada grupo por score.
  return recommendations.sort((a, b) => {
    if (a.canTake !== b.canTake) {
      return a.canTake ? -1 : 1;
    }

    return b.recommendationScore - a.recommendationScore;
  });
}

/**
 * Obtiene la ruta de aprendizaje estructurada por fases (niveles de profundidad)
 */
export function getPhasedLearningPath(
  targetCode: string,
  approvedCourses: Set<string>,
  allCareerCourses?: Array<{ code: string, name: string, prerequisites: string[] }>
): string[][] {
  const targetCourse = getCourseNode(targetCode, allCareerCourses);
  if (!targetCourse) return [];

  // 1. Obtener todos los cursos necesarios (recursivo) que NO están aprobados
  const required = new Set<string>();
  const visited = new Set<string>();

  function collect(code: string) {
    if (visited.has(code)) return;
    visited.add(code);

    const course = getCourseNode(code, allCareerCourses);
    if (!course) return;

    for (const prereq of course.prerequisites) {
      if (!approvedCourses.has(prereq)) {
        required.add(prereq);
        collect(prereq);
      }
    }
  }

  // Si el curso objetivo no está aprobado, inclúyelo
  if (!approvedCourses.has(targetCode)) {
    required.add(targetCode);
    collect(targetCode);
  } else {
    return [];
  }

  // 2. Agrupar en fases (Kahn's algorithm-like leveling)
  const phases: string[][] = [];
  const remaining = new Set(required);

  while (remaining.size > 0) {
    const currentPhase: string[] = [];
    
    for (const code of remaining) {
      const course = getCourseNode(code, allCareerCourses)!;
      // Un curso va en esta fase si todos sus prerequisitos requeridos 
      // ya fueron colocados en fases anteriores o ya están aprobados.
      const allPrereqsSatisfied = course.prerequisites.every(
        p => approvedCourses.has(p) || (required.has(p) && !remaining.has(p))
      );

      if (allPrereqsSatisfied) {
        currentPhase.push(code);
      }
    }

    if (currentPhase.length === 0) {
      break;
    }

    phases.push(currentPhase);
    currentPhase.forEach(code => remaining.delete(code));
  }

  return phases;
}

/**
 * Detecta cursos relacionados o "roadmaps" de especialización
 */
export interface SpecializationPath {
  name: string;
  description: string;
  courses: string[];
  difficulty: string;
  prerequisitesCount: number;
}

export const SPECIALIZATION_PATHS: SpecializationPath[] = [
  {
    name: 'Especialización en Sistemas Operativos y Redes',
    description: 'Desarrollo de expertise en administración de sistemas, redes y seguridad',
    courses: ['ISC-333', 'ISC-334', 'ISC-331', 'ISC-332', 'ISC-435', 'ISC-442'],
    difficulty: 'avanzado',
    prerequisitesCount: 3
  },
  {
    name: 'Especialización en Bases de Datos',
    description: 'Dominio en gestión de datos, análisis y administración de BD',
    courses: ['ISC-321', 'ISC-422', 'ISC-423'],
    difficulty: 'avanzado',
    prerequisitesCount: 2
  },
  {
    name: 'Especialización en Desarrollo de Software',
    description: 'Experto en arquitectura, desarrollo e ingeniería de software',
    courses: ['ISC-305', 'ISC-408', 'ISC-409', 'ISC-407'],
    difficulty: 'avanzado',
    prerequisitesCount: 2
  },
  {
    name: 'Especialización en Inteligencia Artificial',
    description: 'Especialista en IA, machine learning y ciencia de datos',
    courses: ['ISC-414', 'ISC-423', 'ISC-415'],
    difficulty: 'avanzado',
    prerequisitesCount: 2
  }
];
