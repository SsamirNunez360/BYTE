'use client';

import { useEffect, useState } from 'react';
import { Year, CAREERS } from '../data/courses';

export function useCourseCatalog(careerId?: string) {
  const [years, setYears] = useState<Year[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;

    async function loadCatalog() {
      if (!careerId) {
        if (active) {
          setYears([]);
          setLoading(false);
        }
        return;
      }

      try {
        const response = await fetch(`/api/courses?careerId=${careerId}`, { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          if (active && Array.isArray(data?.years) && data.years.length > 0) {
            setYears(data.years);
          } else if (active) {
            console.warn('Catálogo de cursos vacío o no válido, conservando datos locales.', data);
            setYears(CAREERS[careerId]?.years || []);
          }
        } else {
          setYears(CAREERS[careerId]?.years || []);
        }
      } catch (error) {
        console.error('Error loading course catalog from database:', error);
        if (active) setYears(CAREERS[careerId]?.years || []);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadCatalog();

    return () => {
      active = false;
    };
  }, [careerId]);

  return {
    years,
    loading,
  };
}
