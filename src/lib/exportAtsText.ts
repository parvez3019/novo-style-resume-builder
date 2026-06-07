import type { ResumeData } from '../types/resume';

function formatUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
}

export function buildAtsText(resume: ResumeData): string {
  const lines: string[] = [];

  lines.push(resume.personal.name.toUpperCase());
  lines.push(resume.personal.title);
  lines.push('');
  lines.push(resume.personal.summary);
  lines.push('');
  lines.push(`Email: ${resume.personal.email}`);
  lines.push(`Phone: ${resume.personal.phone}`);
  lines.push(`LinkedIn: ${formatUrl(resume.personal.linkedin)}`);
  lines.push(`GitHub: ${formatUrl(resume.personal.github)}`);
  lines.push('');

  lines.push('WORK EXPERIENCE');
  lines.push('');
  for (const job of resume.workExperience) {
    lines.push(`${job.title} | ${job.company} | ${job.startDate} - ${job.endDate} | ${job.location}`);
    for (const bullet of job.bullets) {
      lines.push(`- ${bullet}`);
    }
    if (job.techStack) {
      lines.push(`Tech Stack: ${job.techStack}`);
    }
    lines.push('');
  }

  lines.push('SKILLS');
  lines.push(resume.skills.join(', '));
  lines.push('');

  lines.push('COMMUNITY');
  lines.push('');
  lines.push('Open Source');
  for (const item of resume.community.openSource) {
    lines.push(`- ${item.label}${item.url ? ` (${formatUrl(item.url)})` : ''}`);
  }
  lines.push('');
  lines.push('Blogs');
  for (const item of resume.community.blogs) {
    lines.push(`- ${item.label}${item.url ? ` (${formatUrl(item.url)})` : ''}`);
  }
  lines.push('');

  lines.push('EDUCATION');
  lines.push('');
  for (const edu of resume.education) {
    lines.push(`${edu.degree}`);
    lines.push(`${edu.institution}`);
    lines.push(`${edu.startYear} - ${edu.endYear}`);
    lines.push('');
  }

  lines.push('ACHIEVEMENTS');
  lines.push('');
  for (const achievement of resume.achievements) {
    lines.push(`- ${achievement}`);
  }

  return lines.join('\n');
}

export function exportAtsText(resume: ResumeData, filename = 'resume.txt'): void {
  const text = buildAtsText(resume);
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
