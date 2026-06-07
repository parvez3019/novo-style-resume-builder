import { createId, type ResumeData } from '../types/resume';
import { defaultTheme } from './theme';

function stripUrlWrapper(value: string): string {
  return value
    .replace(/^https?:\/\//i, '')
    .replace(/\s*\(.*\)\s*$/, '')
    .trim();
}

function parseCommunityItem(line: string): { label: string; url?: string } {
  const urlMatch = line.match(/^(.+?)\s*\((https?:\/\/[^)]+)\)\s*$/);
  if (urlMatch) {
    return { label: urlMatch[1].trim(), url: urlMatch[2] };
  }
  return { label: line.replace(/^-\s*/, '').trim() };
}

export function parseAtsText(text: string): ResumeData {
  const lines = text.split(/\r?\n/);
  let index = 0;

  const nextNonEmpty = (): string | null => {
    while (index < lines.length) {
      const line = lines[index]?.trim();
      index += 1;
      if (line) return line;
    }
    return null;
  };

  const peekNonEmpty = (): string | null => {
    for (let i = index; i < lines.length; i += 1) {
      const line = lines[i]?.trim();
      if (line) return line;
    }
    return null;
  };

  const name = nextNonEmpty() ?? '';
  const title = nextNonEmpty() ?? '';

  const summaryLines: string[] = [];
  while (index < lines.length) {
    const line = lines[index]?.trim() ?? '';
    if (/^Email:/i.test(line)) break;
    if (line) summaryLines.push(line);
    index += 1;
  }

  const readPrefixed = (prefix: RegExp): string => {
    const line = lines[index]?.trim() ?? '';
    if (prefix.test(line)) {
      index += 1;
      return line.replace(prefix, '').trim();
    }
    return '';
  };

  const email = readPrefixed(/^Email:\s*/i);
  const phone = readPrefixed(/^Phone:\s*/i);
  const linkedin = stripUrlWrapper(readPrefixed(/^LinkedIn:\s*/i));
  const github = stripUrlWrapper(readPrefixed(/^GitHub:\s*/i));

  while (index < lines.length && !/^WORK EXPERIENCE/i.test(lines[index] ?? '')) {
    index += 1;
  }
  if (index < lines.length) index += 1;

  const workExperience: ResumeData['workExperience'] = [];
  const sectionAfterWork = /^SKILLS|^EDUCATION/i;

  while (index < lines.length && !sectionAfterWork.test(lines[index] ?? '')) {
    const line = nextNonEmpty();
    if (!line) continue;
    if (sectionAfterWork.test(line)) {
      index -= 1;
      break;
    }

    const parts = line.split('|').map((part) => part.trim());
    if (parts.length < 4) continue;

    const [jobTitle, company, dateRange, location] = parts;
    const dateMatch = dateRange.match(/^(\d{4})\s*-\s*(Present|\d{4})/i);
    const startDate = dateMatch?.[1] ?? '';
    const endDate = dateMatch?.[2] ?? '';

    const bullets: string[] = [];
    let techStack: string | undefined;

    while (index < lines.length) {
      const bulletLine = peekNonEmpty();
      if (!bulletLine) {
        index += 1;
        continue;
      }
      if (sectionAfterWork.test(bulletLine)) break;
      if (bulletLine.includes('|') && bulletLine.match(/\d{4}\s*-\s*(Present|\d{4})/i)) break;

      index += 1;
      if (/^Tech Stack:/i.test(bulletLine)) {
        techStack = bulletLine.replace(/^Tech Stack:\s*/i, '').trim();
        continue;
      }
      bullets.push(bulletLine.replace(/^-\s*/, '').trim());
    }

    workExperience.push({
      id: createId(),
      title: jobTitle,
      company,
      startDate,
      endDate,
      location,
      bullets,
      techStack,
    });
  }

  if (/^EDUCATION/i.test(lines[index] ?? '')) {
    while (index < lines.length && !/^SKILLS/i.test(lines[index] ?? '')) {
      index += 1;
    }
  }

  while (index < lines.length && !/^SKILLS/i.test(lines[index] ?? '')) {
    index += 1;
  }
  if (index < lines.length) index += 1;

  const skillsLine = nextNonEmpty() ?? '';
  const skills = skillsLine
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean);

  while (index < lines.length && !/^COMMUNITY/i.test(lines[index] ?? '')) {
    index += 1;
  }
  if (index < lines.length) index += 1;

  const openSource: ResumeData['community']['openSource'] = [];
  const blogs: ResumeData['community']['blogs'] = [];

  let communitySection: 'openSource' | 'blogs' | null = null;
  while (index < lines.length && !/^(EDUCATION|ACHIEVEMENTS)/i.test(lines[index] ?? '')) {
    const line = lines[index]?.trim() ?? '';
    index += 1;
    if (!line) continue;
    if (/^Open Source/i.test(line)) {
      communitySection = 'openSource';
      continue;
    }
    if (/^Blogs/i.test(line)) {
      communitySection = 'blogs';
      continue;
    }
    if (line.startsWith('-') && communitySection) {
      const item = parseCommunityItem(line);
      const entry = { id: createId(), ...item };
      if (communitySection === 'openSource') openSource.push(entry);
      else blogs.push(entry);
    }
  }

  const parseEducationBlock = (): ResumeData['education'] => {
    while (index < lines.length && !/^EDUCATION/i.test(lines[index] ?? '')) {
      index += 1;
    }
    if (index < lines.length) index += 1;

    const entries: ResumeData['education'] = [];
    while (index < lines.length && !/^ACHIEVEMENTS/i.test(lines[index] ?? '')) {
      const degree = nextNonEmpty();
      if (!degree || /^ACHIEVEMENTS/i.test(degree)) break;
      const institution = nextNonEmpty() ?? '';
      const yearsLine = nextNonEmpty() ?? '';
      const yearMatch = yearsLine.match(/^(\d{4})\s*-\s*(\d{4})/);
      entries.push({
        id: createId(),
        degree,
        institution,
        startYear: yearMatch?.[1] ?? '',
        endYear: yearMatch?.[2] ?? '',
      });
    }
    return entries;
  };

  const education = /^EDUCATION/i.test(lines[index] ?? '') ? parseEducationBlock() : [];

  while (index < lines.length && !/^ACHIEVEMENTS/i.test(lines[index] ?? '')) {
    index += 1;
  }
  if (index < lines.length) index += 1;

  const achievements: string[] = [];
  while (index < lines.length) {
    const line = lines[index]?.trim() ?? '';
    index += 1;
    if (!line) continue;
    achievements.push(line.replace(/^-\s*/, '').trim());
  }

  return {
    theme: defaultTheme,
    personal: {
      name,
      title,
      summary: summaryLines.join(' '),
      email,
      phone,
      linkedin,
      github,
      photoUrl: '',
    },
    workExperience,
    skills,
    community: { openSource, blogs },
    education,
    achievements,
  };
}

export function isAtsFormat(text: string): boolean {
  return /^[\s\S]*\nEmail:\s*\S+/m.test(text) && /WORK EXPERIENCE/i.test(text);
}
