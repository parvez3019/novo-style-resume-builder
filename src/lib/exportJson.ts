import type { ResumeData } from '../types/resume';

export function buildResumeJson(resume: ResumeData): string {
  return JSON.stringify(resume, null, 2);
}

export function exportJson(resume: ResumeData, filename = 'resume.json'): void {
  const blob = new Blob([buildResumeJson(resume)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
