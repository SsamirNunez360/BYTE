export interface Course {
  code: string;
  name: string;
  ca: number;
  status: 'approved' | 'current' | 'pending';
  prerequisites: string[]; 
  equiv?: boolean;
}

export interface Period {
  p: number;
  label: string;
  ca: number;
  courses: Course[];
}

export interface Year {
  year: number;
  name: string;
  color: string;
  periods: Period[];
}

export const YEARS: Year[] = [
  {
    year: 1, name: "Primer Año", color: "#818cf8",
    periods: [
      {
        p: 1, label: "P1", ca: 21,
        courses: [
          { code: "ISC-101", name: "Introducción a la Ingeniería en Sistemas Computacionales", ca: 4, status: "approved", prerequisites: [] },
          { code: "EG-011", name: "Español General", ca: 4, status: "approved", prerequisites: [] },
          { code: "MM-110", name: "Matemática I", ca: 5, status: "approved", prerequisites: [] },
          { code: "SC-101", name: "Sociología", ca: 4, status: "approved", prerequisites: [] },
          { code: "IN-101", name: "Optativa I: Campo de las Lenguas Extranjeras (Inglés I)", ca: 4, status: "approved", prerequisites: [] },
        ]
      },
      {
        p: 2, label: "P2", ca: 17,
        courses: [
          { code: "ISC-102", name: "Programación Estructurada", ca: 4, status: "approved", prerequisites: ["ISC-101"], equiv: true },
          { code: "FF-101", name: "Filosofía", ca: 4, status: "approved", prerequisites: [] },
          { code: "MM-111", name: "Geometría y Trigonometría", ca: 5, status: "approved", prerequisites: [] },
          { code: "IN-102", name: "Inglés II", ca: 4, status: "approved", prerequisites: ["IN-101"] },
        ]
      },
      {
        p: 3, label: "P3", ca: 17,
        courses: [
          { code: "ISC-103", name: "Programación Orientada a Objetos", ca: 5, status: "approved", prerequisites: ["ISC-102"], equiv: true },
          { code: "MM-201", name: "Cálculo I", ca: 5, status: "approved", prerequisites: ["MM-110", "MM-111"] },
          { code: "MM-211", name: "Vectores y Matrices", ca: 3, status: "approved", prerequisites: ["MM-110", "MM-111"] },
          { code: "IN-103", name: "Inglés III", ca: 4, status: "approved", prerequisites: ["IN-102"] },
        ]
      },
    ]
  },
  {
    year: 2, name: "Segundo Año", color: "#34d399",
    periods: [
      {
        p: 1, label: "P1", ca: 18,
        courses: [
          { code: "MM-420", name: "Matemática Discreta", ca: 4, status: "approved", prerequisites: ["MM-110"] },
          { code: "MM-202", name: "Cálculo II", ca: 5, status: "approved", prerequisites: ["MM-201", "MM-211"] },
          { code: "FS-100", name: "Física I", ca: 5, status: "approved", prerequisites: ["MM-201", "MM-211"] },
          { code: "HH-101", name: "Historia de Honduras", ca: 4, status: "approved", prerequisites: [] },
        ]
      },
      {
        p: 2, label: "P2", ca: 15,
        courses: [
          { code: "ISC-204", name: "Paradigmas de Programación", ca: 4, status: "pending", prerequisites: ["ISC-103"] },
          { code: "MM-401", name: "Estadística I", ca: 3, status: "approved", prerequisites: ["MM-202"] },
          { code: "FS-200", name: "Física II", ca: 5, status: "pending", prerequisites: ["FS-100"] },
          { code: "OPT-II", name: "Optativa II: Campo de las Humanidades", ca: 3, status: "approved", prerequisites: [] },
        ]
      },
      {
        p: 3, label: "P3", ca: 15,
        courses: [
          { code: "OPT-III", name: "Optativa III: Campo de las Artes y el Deporte", ca: 3, status: "approved", prerequisites: [] },
          { code: "ISC-211", name: "Estructuras de Datos", ca: 4, status: "pending", prerequisites: ["MM-420", "MM-211", "ISC-103"], equiv: true },
          { code: "AGE-102", name: "Administración", ca: 4, status: "approved", prerequisites: ["MM-401"] },
          { code: "IE-326", name: "Instalaciones Eléctricas para Centros de Datos", ca: 4, status: "pending", prerequisites: ["FS-200"] },
        ]
      },
    ]
  },
  {
    year: 3, name: "Tercer Año", color: "#fb923c",
    periods: [
      {
        p: 1, label: "P1", ca: 17,
        courses: [
          { code: "ISC-321", name: "Fundamentos de Base de Datos", ca: 5, status: "pending", prerequisites: ["MM-420"] },
          { code: "ISC-351", name: "Contabilidad Financiera", ca: 4, status: "approved", prerequisites: ["AGE-102"], equiv: true },
          { code: "ISC-331", name: "Redes de Datos I", ca: 4, status: "pending", prerequisites: ["IE-326"] },
          { code: "ISC-333", name: "Sistemas Operativos I", ca: 4, status: "approved", prerequisites: ["ISC-211"], equiv: true },
        ]
      },
      {
        p: 2, label: "P2", ca: 16,
        courses: [
          { code: "ISC-312", name: "Teoría de la Computación", ca: 4, status: "pending", prerequisites: ["ISC-211", "ISC-204"] },
          { code: "ISC-341", name: "Sistemas de Información", ca: 4, status: "pending", prerequisites: ["ISC-351"] },
          { code: "ISC-332", name: "Redes de Datos II", ca: 4, status: "pending", prerequisites: ["ISC-331"] },
          { code: "ISC-334", name: "Sistemas Operativos II", ca: 4, status: "pending", prerequisites: ["ISC-333"] },
        ]
      },
      {
        p: 3, label: "P3", ca: 16,
        courses: [
          { code: "ISC-305", name: "Programación Web", ca: 4, status: "pending", prerequisites: ["ISC-321"] },
          { code: "ISC-313", name: "Compiladores", ca: 4, status: "pending", prerequisites: ["ISC-312"] },
          { code: "ISC-306", name: "Análisis de Requerimientos", ca: 4, status: "pending", prerequisites: ["ISC-341", "ISC-321"] },
          { code: "ISC-336", name: "Diseño Digital", ca: 4, status: "pending", prerequisites: ["ISC-334"] },
        ]
      },
    ]
  },
  {
    year: 4, name: "Cuarto Año", color: "#f472b6",
    periods: [
      {
        p: 1, label: "P1", ca: 17,
        courses: [
          { code: "ISC-407", name: "Programación Móvil", ca: 5, status: "pending", prerequisites: ["ISC-305"] },
          { code: "ISC-414", name: "Inteligencia Artificial", ca: 4, status: "pending", prerequisites: ["ISC-313", "MM-401"] },
          { code: "ISC-435", name: "Administración de Servidores", ca: 4, status: "pending", prerequisites: ["ISC-334", "ISC-332"] },
          { code: "ISC-437", name: "Arquitectura de Computadoras", ca: 4, status: "pending", prerequisites: ["ISC-336"] },
        ]
      },
      {
        p: 2, label: "P2", ca: 16,
        courses: [
          { code: "ISC-408", name: "Ingeniería del Software", ca: 4, status: "pending", prerequisites: ["ISC-306", "ISC-407"] },
          { code: "ISC-422", name: "Administración de Base de Datos", ca: 4, status: "pending", prerequisites: ["ISC-321"] },
          { code: "ISC-442", name: "Seguridad Informática", ca: 4, status: "pending", prerequisites: ["ISC-435"] },
          { code: "ISC-443", name: "Industria de TI", ca: 4, status: "pending", prerequisites: ["ISC-306"] },
        ]
      },
      {
        p: 3, label: "P3", ca: 16,
        courses: [
          { code: "ISC-409", name: "Calidad de Software", ca: 4, status: "pending", prerequisites: ["ISC-408"] },
          { code: "ISC-423", name: "Ciencia de Datos", ca: 4, status: "pending", prerequisites: ["ISC-422"] },
          { code: "ISC-415", name: "Tecnologías Emergentes", ca: 4, status: "pending", prerequisites: ["ISC-305", "ISC-437", "ISC-332"] },
          { code: "ISC-445", name: "Proyectos de TI", ca: 4, status: "pending", prerequisites: ["ISC-443", "ISC-442"] },
        ]
      },
    ]
  },
  {
    year: 5, name: "Quinto Año", color: "#a78bfa",
    periods: [
      {
        p: 1, label: "P1", ca: 15,
        courses: [
          { code: "OPT-IV", name: "Optativa IV: Campo de las Ciencias Naturales", ca: 3, status: "approved", prerequisites: [] },
          { code: "ISC-552", name: "Seminario de Investigación", ca: 4, status: "pending", prerequisites: ["ISC-415", "ISC-445", "ISC-423", "ISC-437"] },
          { code: "ISC-544", name: "Auditoría Informática", ca: 4, status: "pending", prerequisites: ["ISC-442"] },
          { code: "ISC-546", name: "Ejecución de Proyectos de TI", ca: 4, status: "pending", prerequisites: ["ISC-445"] },
        ]
      },
      {
        p: 2, label: "P2", ca: 0,
        courses: [
          { code: "PPS", name: "Práctica Profesional Supervisada", ca: 0, status: "pending", prerequisites: ["ISC-552"] },
        ]
      },
    ]
  },
];