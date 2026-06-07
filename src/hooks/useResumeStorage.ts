import { useEffect, useState } from 'react';
import { defaultResume } from '../data/defaultResume';
import { mergeTheme } from '../lib/theme';
import type { ResumeData } from '../types/resume';

const STORAGE_KEY = 'novo-resume-builder-data-v2';

function hydrateResume(stored: Partial<ResumeData>): ResumeData {
  return {
    ...defaultResume,
    ...stored,
    theme: mergeTheme(stored.theme),
    personal: { ...defaultResume.personal, ...stored.personal },
    workExperience: stored.workExperience ?? defaultResume.workExperience,
    skills: stored.skills ?? defaultResume.skills,
    community: stored.community ?? defaultResume.community,
    education: stored.education ?? defaultResume.education,
    achievements: stored.achievements ?? defaultResume.achievements,
  };
}

export function useResumeStorage() {
  const [resume, setResume] = useState<ResumeData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return hydrateResume(JSON.parse(stored) as Partial<ResumeData>);
      }
    } catch {
      // ignore parse errors
    }
    return defaultResume;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resume));
  }, [resume]);

  const resetTemplate = () => setResume(defaultResume);

  return { resume, setResume, resetTemplate };
}
