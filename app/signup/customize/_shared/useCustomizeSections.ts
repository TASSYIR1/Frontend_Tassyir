'use client';

import { useEffect, useMemo, useState } from 'react';

export type SectionKey = 'about' | 'stats' | 'gallery' | 'contact';
export type SectionsState = Record<SectionKey, boolean>;

const STORAGE_KEY = 'tassyir_customize_sections_v1';

const defaultSections: SectionsState = {
  about: true,
  stats: true,
  gallery: true,
  contact: true,
};

export function useCustomizeSections() {
  const [sections, setSections] = useState<SectionsState>(defaultSections);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setHydrated(true);
        return;
      }
      const parsed = JSON.parse(raw) as Partial<SectionsState>;
      setSections((prev) => ({ ...prev, ...parsed }));
      setHydrated(true);
    } catch {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sections));
    } catch {
      // ignore
    }
  }, [sections, hydrated]);

  const api = useMemo(
    () => ({
      sections,
      setEnabled: (key: SectionKey, enabled: boolean) =>
        setSections((prev) => ({
          ...prev,
          [key]: enabled,
        })),
      toggle: (key: SectionKey) =>
        setSections((prev) => ({
          ...prev,
          [key]: !prev[key],
        })),
    }),
    [sections],
  );

  return api;
}
