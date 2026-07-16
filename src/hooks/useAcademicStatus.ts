import { useEffect, useState } from 'react';

type UseAcademicStatusOptions = {
  startEmpty?: boolean;
};

export function useAcademicStatus(user?: string | null, options: UseAcademicStatusOptions = {}) {
  const [approvedCourses, setApprovedCourses] = useState<Set<string>>(new Set());
  const [currentCourses, setCurrentCourses] = useState<Set<string>>(new Set());
  const [hasLoaded, setHasLoaded] = useState(false);

  // Cargar datos desde la base de datos (vía API)
  useEffect(() => {
    if (!user) {
      setApprovedCourses(new Set());
      setCurrentCourses(new Set());
      setHasLoaded(false);
      return;
    }

    const fetchStatus = async () => {
      try {
        const response = await fetch(`/api/academic-status?user=${user}`, {
          cache: 'no-store'
        });
        if (response.ok) {
          const data = await response.json();
          setApprovedCourses(new Set(data.approved || []));
          setCurrentCourses(new Set(data.current || []));
        }
      } catch (error) {
        console.error("Error cargando estado académico:", error);
      } finally {
        setHasLoaded(true);
      }
    };

    fetchStatus();
  }, [user]);

  // Función para persistir cambios en la DB
  const persistChange = async (courseCode: string, status: 'approved' | 'current' | null) => {
    console.log(`[Hook] Intentando persistir: ${courseCode} -> ${status} (User: ${user})`);
    if (!user) {
      console.warn("[Hook] No se puede persistir: 'user' es null o undefined");
      return;
    }
    try {
      const response = await fetch('/api/academic-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user,
          courseCode,
          status,
          action: status === null ? 'delete' : 'save'
        })
      });
      if (response.ok) {
        console.log(`[Hook] Persistencia exitosa para ${courseCode}`);
      } else {
        console.error(`[Hook] Error en respuesta de API: ${response.status}`);
      }
    } catch (error) {
      console.error("[Hook] Error guardando cambio en DB:", error);
    }
  };

  const toggleApproved = (code: string) => {
    let newStatus: 'approved' | null = 'approved';
    
    setApprovedCourses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(code)) {
        newSet.delete(code);
        newStatus = null;
      } else {
        newSet.add(code);
        setCurrentCourses(cPrev => {
          const cNew = new Set(cPrev);
          cNew.delete(code);
          return cNew;
        });
      }
      return newSet;
    });

    persistChange(code, newStatus);
  };

  const toggleCurrent = (code: string) => {
    let newStatus: 'current' | null = 'current';

    setCurrentCourses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(code)) {
        newSet.delete(code);
        newStatus = null;
      } else {
        newSet.add(code);
        setApprovedCourses(aPrev => {
          const aNew = new Set(aPrev);
          aNew.delete(code);
          return aNew;
        });
      }
      return newSet;
    });

    persistChange(code, newStatus);
  };

  const replaceApprovedCourses = async (codes: Iterable<string>) => {
    const newSet = new Set(codes);
    setApprovedCourses(newSet);
    
    // Guardar cada una en la DB (o podrías crear un endpoint de batch después)
    if (user) {
      // Por simplicidad ahora, borramos las actuales y guardamos las nuevas
      // Pero para no saturar, al menos guardemos la intención
      for (const code of newSet) {
        persistChange(code, 'approved');
      }
    }
  };

  const replaceCurrentCourses = (codes: Iterable<string>) => {
    const newSet = new Set(codes);
    setCurrentCourses(newSet);
    if (user) {
      for (const code of newSet) {
        persistChange(code, 'current');
      }
    }
  };

  return {
    approvedCourses,
    currentCourses,
    toggleApproved,
    toggleCurrent,
    replaceApprovedCourses,
    replaceCurrentCourses,
    isApproved: (code: string) => approvedCourses.has(code),
    isCurrent: (code: string) => currentCourses.has(code),
    hasLoaded
  };
}
