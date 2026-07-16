'use client';

import { useEffect, useState } from 'react';
import { Year, YEARS } from '../data/courses';

export function useCourseCatalog() {
  const [years, setYears] = useState<Year[]>(YEARS);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;

    async function loadCatalog() {
      try {
        const response = await fetch('/api/courses', { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          if (active && Array.isArray(data?.years) && data.years.length > 0) {
            setYears(data.years);
          } else if (active) {
            console.warn('Catálogo de cursos vacío o no válido, conservando datos locales.', data);
          }
        }
      } catch (error) {
        console.error('Error loading course catalog from database:', error);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadCatalog();

    return () => {
      active = false;
    };
  }, []);

  return {
    years,
    loading,
  };
}
