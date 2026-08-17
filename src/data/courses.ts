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

export const ISC_YEARS: Year[] = [
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

export const IAGRO_YEARS: Year[] = [
  {
    year: 1, name: "Primer Año", color: "#818cf8",
    periods: [
      {
        p: 1, label: "P1", ca: 21,
        courses: [
          { code: "IAI-011", name: "Introducción a la Ingeniería Agroindustrial", ca: 3, status: "pending", prerequisites: [] },
          { code: "EG-011", name: "Español General", ca: 4, status: "pending", prerequisites: [] },
          { code: "IN-101", name: "Inglés I", ca: 4, status: "pending", prerequisites: [] },
          { code: "MM-110", name: "Matemática I", ca: 5, status: "pending", prerequisites: [] },
          { code: "MM-111", name: "Geometría y Trigonometría", ca: 5, status: "pending", prerequisites: [] },
        ]
      },
      {
        p: 2, label: "P2", ca: 20,
        courses: [
          { code: "ART-DEP", name: "Electiva del campo de arte o deporte", ca: 3, status: "pending", prerequisites: [] },
          { code: "QQ-103", name: "Química General", ca: 5, status: "pending", prerequisites: [] },
          { code: "MM-201", name: "Cálculo I", ca: 5, status: "pending", prerequisites: ["MM-110", "MM-111"] },
          { code: "BI-121", name: "Biología General", ca: 5, status: "pending", prerequisites: [] },
          { code: "DQ-101", name: "Dibujo I", ca: 2, status: "pending", prerequisites: ["MM-111"] },
        ]
      },
      {
        p: 3, label: "P3", ca: 19,
        courses: [
          { code: "SC-101", name: "Sociología", ca: 4, status: "pending", prerequisites: [] },
          { code: "QQ-221", name: "Química Orgánica", ca: 4, status: "pending", prerequisites: ["QQ-103"] },
          { code: "MM-211", name: "Vectores y Matrices", ca: 3, status: "pending", prerequisites: ["MM-110", "MM-111"] },
          { code: "FF-101", name: "Filosofía", ca: 4, status: "pending", prerequisites: [] },
          { code: "MB-113", name: "Microbiología General", ca: 4, status: "pending", prerequisites: ["BI-121"] },
        ]
      }
    ]
  },
  {
    year: 2, name: "Segundo Año", color: "#34d399",
    periods: [
      {
        p: 4, label: "P4", ca: 22,
        courses: [
          { code: "FS-100", name: "Física General I", ca: 5, status: "pending", prerequisites: ["MM-201", "MM-211"] },
          { code: "HH-101", name: "Historia de Honduras", ca: 4, status: "pending", prerequisites: [] },
          { code: "MM-202", name: "Cálculo II", ca: 5, status: "pending", prerequisites: ["MM-201"] },
          { code: "IN-102", name: "Inglés II", ca: 4, status: "pending", prerequisites: ["IN-101"] },
          { code: "MB-114", name: "Microbiología de Alimentos", ca: 4, status: "pending", prerequisites: ["MB-113"] },
        ]
      },
      {
        p: 5, label: "P5", ca: 18,
        courses: [
          { code: "FS-200", name: "Física General II", ca: 5, status: "pending", prerequisites: ["FS-100", "MM-202"] },
          { code: "MM-314", name: "Programación I", ca: 3, status: "pending", prerequisites: ["MM-211"] },
          { code: "QQ-211", name: "Química Analítica", ca: 4, status: "pending", prerequisites: ["QQ-103"] },
          { code: "AG-323", name: "Producción Pecuaria I", ca: 4, status: "pending", prerequisites: ["IAI-011", "BI-121"] },
          { code: "II-952", name: "Higiene y Seguridad Industrial", ca: 2, status: "pending", prerequisites: ["QQ-103"] },
        ]
      },
      {
        p: 6, label: "P6", ca: 17,
        courses: [
          { code: "ELEC-CN", name: "Electiva Ciencias Naturales", ca: 3, status: "pending", prerequisites: [] },
          { code: "AG-214", name: "Producción Agrícola I", ca: 4, status: "pending", prerequisites: ["IAI-011", "BI-121"] },
          { code: "MM-401", name: "Estadística", ca: 3, status: "pending", prerequisites: ["MM-202"] },
          { code: "QQ-533", name: "Bioquímica", ca: 4, status: "pending", prerequisites: ["QQ-221"] },
          { code: "MM-411", name: "Ecuaciones Diferenciales", ca: 3, status: "pending", prerequisites: ["MM-202"] },
        ]
      }
    ]
  },
  {
    year: 3, name: "Tercer Año", color: "#fb923c",
    periods: [
      {
        p: 7, label: "P7", ca: 18,
        courses: [
          { code: "IAI-327", name: "Métodos y Técnicas de Investigación", ca: 3, status: "pending", prerequisites: ["MM-401"] },
          { code: "DAE-926", name: "Administración de Empresas Agroindustriales", ca: 4, status: "pending", prerequisites: ["MM-110", "AG-214"] },
          { code: "IQ-297", name: "Principios de Operaciones Unitarias", ca: 4, status: "pending", prerequisites: ["FS-200", "QQ-211"] },
          { code: "AG-324", name: "Producción Pecuaria II", ca: 4, status: "pending", prerequisites: ["AG-323"] },
          { code: "TL-120", name: "Inglés Técnico", ca: 3, status: "pending", prerequisites: ["IN-102"] },
        ]
      },
      {
        p: 8, label: "P8", ca: 20,
        courses: [
          { code: "PO-940", name: "Psicología Industrial", ca: 4, status: "pending", prerequisites: ["DAE-926"] },
          { code: "AG-322", name: "Producción Agrícola II", ca: 4, status: "pending", prerequisites: ["AG-214"] },
          { code: "IQ-349", name: "Operaciones Unitarias Agroindustriales I", ca: 4, status: "pending", prerequisites: ["IQ-297"] },
          { code: "IAI-388", name: "Biotecnología de Alimentos", ca: 4, status: "pending", prerequisites: ["QQ-533", "MB-114"] },
          { code: "IAI-418", name: "Contabilidad Agroindustrial I", ca: 4, status: "pending", prerequisites: ["DAE-926"] },
        ]
      },
      {
        p: 9, label: "P9", ca: 19,
        courses: [
          { code: "IAI-459", name: "Calidad Total", ca: 4, status: "pending", prerequisites: ["MM-401", "DAE-926"] },
          { code: "II-222", name: "Ingeniería de Métodos", ca: 3, status: "pending", prerequisites: ["MM-401"] },
          { code: "IAI-429", name: "Diseño de Plantas Agroindustriales I", ca: 4, status: "pending", prerequisites: ["II-222", "IQ-349", "MM-314"] },
          { code: "IAI-469", name: "Tecnología de Alimentos", ca: 4, status: "pending", prerequisites: ["MB-114"] },
          { code: "IAI-449", name: "Contabilidad Agroindustrial II", ca: 4, status: "pending", prerequisites: ["IAI-418"] },
        ]
      }
    ]
  },
  {
    year: 4, name: "Cuarto Año", color: "#f472b6",
    periods: [
      {
        p: 10, label: "P10", ca: 18,
        courses: [
          { code: "IAI-4710", name: "Diseño de Plantas Agroindustriales II", ca: 4, status: "pending", prerequisites: ["IAI-429"] },
          { code: "IAI-4810", name: "Diseños Experimentales", ca: 3, status: "pending", prerequisites: ["MM-401", "IAI-327"] },
          { code: "OPT-1", name: "Optativa I", ca: 3, status: "pending", prerequisites: [] },
          { code: "DAE-615", name: "Mercadotecnia", ca: 4, status: "pending", prerequisites: ["IAI-418"] },
          { code: "IAI-5010", name: "Procesamiento de Cárnicos", ca: 4, status: "pending", prerequisites: ["IAI-469", "AG-324", "IQ-297"] },
        ]
      },
      {
        p: 11, label: "P11", ca: 19,
        courses: [
          { code: "ELEC-HUM", name: "Electiva Humanidades", ca: 3, status: "pending", prerequisites: [] },
          { code: "IAI-5511", name: "Procesamiento de Granos Básicos, Frutas y Hortalizas", ca: 4, status: "pending", prerequisites: ["IAI-469", "AG-322", "IQ-297"] },
          { code: "IAI-5411", name: "Procesamiento de Cultivos Agroindustriales", ca: 4, status: "pending", prerequisites: ["IAI-469", "AG-322", "IQ-349"] },
          { code: "IAI-5311", name: "Formulación y Evaluación de Proyectos Agroindustriales", ca: 4, status: "pending", prerequisites: ["DAE-615", "IAI-327", "IAI-449", "IAI-4710"] },
          { code: "IAI-5611", name: "Procesamiento de Lácteos", ca: 4, status: "pending", prerequisites: ["IAI-469", "AG-324", "IQ-349"] },
        ]
      },
      {
        p: 12, label: "P12", ca: 17,
        courses: [
          { code: "OPT-2", name: "Optativa II", ca: 3, status: "pending", prerequisites: [] },
          { code: "IAI-6012", name: "Seminario de Investigación", ca: 4, status: "pending", prerequisites: ["IAI-5311", "IAI-4810"] },
          { code: "IAI-5812", name: "Formulación, balanceo y elaboración de raciones", ca: 4, status: "pending", prerequisites: ["MM-211", "AG-324", "IQ-297"] },
          { code: "IAI-5712", name: "Gestión y procesamiento de subproductos y residuos agroindustriales", ca: 4, status: "pending", prerequisites: ["IAI-5010", "IAI-5611"] },
          { code: "DQ-103", name: "Dibujo Técnico", ca: 2, status: "pending", prerequisites: ["DQ-101"] },
        ]
      }
    ]
  }
];

export const CAREERS: Record<string, { name: string; years: Year[] }> = {
  'isc': { name: 'Ingeniería en Sistemas Computacionales', years: ISC_YEARS },
  'iagro': { name: 'Ingeniería Agroindustrial', years: IAGRO_YEARS },
};