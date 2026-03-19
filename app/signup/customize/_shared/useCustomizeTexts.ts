'use client';

import { useEffect, useMemo, useState } from 'react';

export type TextKey =
  | 'homeTagline'
  | 'homeTitle'
  | 'homeDescription'
  | 'aboutTitle'
  | 'aboutDescription'
  | 'galleryTitle'
  | 'galleryDescription';
export type CustomizeTextsState = Record<TextKey, string>;

const STORAGE_KEY = 'tassyir_customize_texts_v1';

const defaultTexts: CustomizeTextsState = {
  homeTagline: 'من أول مستقبل آمن',
  homeTitle: 'مدرسة تمكين',
  homeDescription: 'مدرسة دروس خصوصية للطور الابتدائي',
  aboutTitle: 'من نحن ؟',
  aboutDescription:
    'مدرسة دروس خصوصية للطور الابتدائي ومدرسة دروس خصوصية للطور الابتدائي ومدرسة دروس خصوصية للطور الابتدائي',
  galleryTitle: 'معرض الصور',
  galleryDescription: 'أبرز اللقطات داخل المؤسسة',
};

export function useCustomizeTexts() {
  const [texts, setTexts] = useState<CustomizeTextsState>(defaultTexts);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setHydrated(true);
        return;
      }
      const parsed = JSON.parse(raw) as Partial<CustomizeTextsState>;
      setTexts((prev) => ({ ...prev, ...parsed }));
      setHydrated(true);
    } catch {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(texts));
    } catch {
      // ignore
    }
  }, [texts, hydrated]);

  const api = useMemo(
    () => ({
      texts,
      setText: (key: TextKey, value: string) =>
        setTexts((prev) => ({
          ...prev,
          [key]: value,
        })),
    }),
    [texts],
  );

  return api;
}
