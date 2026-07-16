import { useEffect, useState } from 'react';

import { INITIAL_USER_COURSES } from '../data/userCourses';

const DEFAULT_FALLBACK_COURSES = [
  "ISC-101", "EG-011", "MM-110", "SC-101", "IN-101"
];

type UseApprovedCoursesOptions = {
  startEmpty?: boolean;
};

export function useApprovedCourses(user?: string | null, options: UseApprovedCoursesOptions = {}) {
  const [approvedCourses, setApprovedCourses] = useState<Set<string>>(new Set());
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (!user) {
      setApprovedCourses(new Set());
      setHasLoaded(false);
      return;
    }

    setHasLoaded(false);

    const key = `approvedCourses_${user}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsedSaved = JSON.parse(saved);
      // Migrar códigos antiguos que puedan estar guardados en el navegador
      const migrated = parsedSaved.map((code: string) => {
        if (code === 'IISC-101') return 'ISC-101';
        if (code === 'IISC-103') return 'ISC-103';
        return code;
      });
      setApprovedCourses(new Set(migrated));
    } else {
      if (options.startEmpty) {
        setApprovedCourses(new Set());
      } else {
        // Buscar clases específicas para el usuario, si no existen usar el fallback
        const userInitial = INITIAL_USER_COURSES[user] || DEFAULT_FALLBACK_COURSES;
        setApprovedCourses(new Set(userInitial));
      }
    }

    setHasLoaded(true);
  }, [options.startEmpty, user]);

  useEffect(() => {
    if (!user || !hasLoaded) return;

    const key = `approvedCourses_${user}`;
    localStorage.setItem(key, JSON.stringify([...approvedCourses]));
  }, [approvedCourses, hasLoaded, user]);

  const toggleApproved = (code: string) => {
    setApprovedCourses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(code)) {
        newSet.delete(code);
      } else {
        newSet.add(code);
      }
      return newSet;
    });
  };

  const addApproved = (code: string) => {
    setApprovedCourses(prev => new Set([...prev, code]));
  };

  const removeApproved = (code: string) => {
    setApprovedCourses(prev => {
      const newSet = new Set(prev);
      newSet.delete(code);
      return newSet;
    });
  };

  const replaceApprovedCourses = (codes: Iterable<string>) => {
    setApprovedCourses(new Set(codes));
  };

  const isApproved = (code: string) => approvedCourses.has(code);

  return {
    approvedCourses,
    toggleApproved,
    addApproved,
    removeApproved,
    replaceApprovedCourses,
    isApproved
  };
}
