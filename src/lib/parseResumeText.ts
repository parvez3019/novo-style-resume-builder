import { defaultTheme } from './theme';
import { createId, type ResumeData } from '../types/resume';

const SECTION_HEADERS = [
  'WORK EXPERIENCE',
  'SKILLS',
  'COMMUNITY',
  'EDUCATION',
  'ACHIEVEMENTS',
] as const;

type SectionName = (typeof SECTION_HEADERS)[number];

function normalizeLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/\t+/g, ' ').trim())
    .filter((line) => line.length > 0);
}

function extractContact(text: string) {
  const email = text.match(/[\w.+-]+@[\w.-]+\.\w+/)?.[0] ?? '';
  const phone =
    text.match(/\+?\d[\d\s()-]{8,}\d/)?.[0]?.replace(/\s{2,}/g, ' ').trim() ?? '';
  const linkedin =
    text.match(/linkedin\.com\/in\/[\w-]+/i)?.[0] ?? '';
  const github = text.match(/github\.com\/[\w-]+/i)?.[0] ?? '';
  return { email, phone, linkedin, github };
}

function splitSections(lines: string[]): Map<SectionName | 'header', string[]> {
  const sections = new Map<SectionName | 'header', string[]>();
  let current: SectionName | 'header' = 'header';
  sections.set('header', []);

  for (const line of lines) {
    const header = SECTION_HEADERS.find((name) => line.toUpperCase() === name);
    if (header) {
      current = header;
      sections.set(current, []);
      continue;
    }
    sections.get(current)?.push(line);
  }

  return sections;
}

function parseHeaderSection(lines: string[], contacts: ReturnType<typeof extractContact>) {
  const contactValues = new Set(
    [contacts.email, contacts.phone, contacts.linkedin, contacts.github].filter(Boolean),
  );

  const contentLines = lines.filter(
    (line) =>
      !contactValues.has(line) &&
      !line.includes(contacts.email) &&
      !(contacts.phone && line.includes(contacts.phone.replace(/\s/g, ''))) &&
      !/linkedin\.com/i.test(line) &&
      !/github\.com/i.test(line),
  );

  const name = contentLines[0] ?? '';
  const title = contentLines[1] ?? '';
  const summary = contentLines.slice(2).join(' ');

  return { name, title, summary };
}

const DATE_LINE = /^(.+?)\s+(\d{4})\s*-\s*(Present|\d{4})\s*,?\s*(.*)$/i;
const DATE_ONLY = /^(\d{4})\s*-\s*(Present|\d{4})\s*,?\s*(.*)$/i;

function parseWorkExperience(lines: string[]): ResumeData['workExperience'] {
  const jobs: ResumeData['workExperience'] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (/^Achievements\/Tasks$/i.test(line)) {
      index += 1;
      continue;
    }

    const inlineMatch = line.match(DATE_LINE);
    if (inlineMatch) {
      const [, company, startDate, endDate, location] = inlineMatch;
      const title = index > 0 ? lines[index - 1] : 'Job Title';
      index += 1;
      const { bullets, techStack, nextIndex } = collectJobBody(lines, index);
      index = nextIndex;
      jobs.push({
        id: createId(),
        title: title === company ? 'Job Title' : title,
        company: company.trim(),
        startDate,
        endDate,
        location: location.trim(),
        bullets,
        techStack,
      });
      continue;
    }

    const dateOnlyMatch = line.match(DATE_ONLY);
    if (dateOnlyMatch && index >= 2) {
      const company = lines[index - 1];
      const title = lines[index - 2];
      const [, startDate, endDate, location] = dateOnlyMatch;
      index += 1;
      const { bullets, techStack, nextIndex } = collectJobBody(lines, index);
      index = nextIndex;
      jobs.push({
        id: createId(),
        title,
        company,
        startDate,
        endDate,
        location: location.trim(),
        bullets,
        techStack,
      });
      continue;
    }

    index += 1;
  }

  return jobs;
}

function collectJobBody(lines: string[], startIndex: number) {
  const bullets: string[] = [];
  let techStack: string | undefined;
  let index = startIndex;

  while (index < lines.length) {
    const line = lines[index];

    if (SECTION_HEADERS.some((header) => line.toUpperCase() === header)) break;
    if (/^Achievements\/Tasks$/i.test(line)) {
      index += 1;
      continue;
    }
    if (DATE_ONLY.test(line)) break;
    if (DATE_LINE.test(line)) break;
    if (index + 2 < lines.length && DATE_ONLY.test(lines[index + 2])) break;

    if (/^Tech Stack[:\-]/i.test(line)) {
      techStack = line.replace(/^Tech Stack[:\-]\s*/i, '').trim();
      index += 1;
      continue;
    }

    if (/^[•\-–—]\s/.test(line)) {
      bullets.push(line.replace(/^[•\-–—]\s*/, '').trim());
      index += 1;
      continue;
    }

    if (line.length > 20 && !/^\d{4}/.test(line)) {
      bullets.push(line);
      index += 1;
      continue;
    }

    break;
  }

  return { bullets, techStack, nextIndex: index };
}

function parseSkills(lines: string[]): string[] {
  const skills: string[] = [];

  for (const line of lines) {
    if (line.includes(',')) {
      skills.push(
        ...line
          .split(',')
          .map((skill) => skill.trim())
          .filter(Boolean),
      );
      continue;
    }

    skills.push(
      ...line
        .split(/\t+|\s{2,}/)
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 1),
    );
  }

  return skills;
}

function parseCommunity(lines: string[]) {
  const openSource: ResumeData['community']['openSource'] = [];
  const blogs: ResumeData['community']['blogs'] = [];
  let section: 'openSource' | 'blogs' | null = null;

  for (const line of lines) {
    if (/^Open Source/i.test(line)) {
      section = 'openSource';
      continue;
    }
    if (/^Blogs/i.test(line)) {
      section = 'blogs';
      continue;
    }

    const cleaned = line.replace(/^[•\-–—]\s*/, '').trim();
    if (!cleaned || !section) continue;

    const urlMatch = cleaned.match(/(https?:\/\/\S+)$/);
    const entry = {
      id: createId(),
      label: urlMatch ? cleaned.replace(urlMatch[0], '').trim() : cleaned,
      url: urlMatch?.[1],
    };

    if (section === 'openSource') openSource.push(entry);
    else blogs.push(entry);
  }

  return { openSource, blogs };
}

function parseEducation(lines: string[]): ResumeData['education'] {
  const education: ResumeData['education'] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const yearMatch = line.match(/^(\d{4})\s*-\s*(\d{4}),?$/);

    if (yearMatch && index >= 2) {
      education.push({
        id: createId(),
        degree: lines[index - 2],
        institution: lines[index - 1],
        startYear: yearMatch[1],
        endYear: yearMatch[2],
      });
      index += 1;
      continue;
    }

    if (yearMatch && index >= 1) {
      education.push({
        id: createId(),
        degree: lines[index - 1],
        institution: '',
        startYear: yearMatch[1],
        endYear: yearMatch[2],
      });
      index += 1;
      continue;
    }

    index += 1;
  }

  return education;
}

function parseAchievements(lines: string[]): string[] {
  return lines
    .map((line) => line.replace(/^[•\-–—]\s*/, '').trim())
    .filter(Boolean);
}

export function parseResumeText(text: string): ResumeData {
  const lines = normalizeLines(text);
  const contacts = extractContact(text);
  const sections = splitSections(lines);

  const header = parseHeaderSection(sections.get('header') ?? [], contacts);
  const workExperience = parseWorkExperience(sections.get('WORK EXPERIENCE') ?? []);
  const skills = parseSkills(sections.get('SKILLS') ?? []);
  const community = parseCommunity(sections.get('COMMUNITY') ?? []);
  const education = parseEducation(sections.get('EDUCATION') ?? []);
  const achievements = parseAchievements(sections.get('ACHIEVEMENTS') ?? []);

  return {
    theme: defaultTheme,
    personal: {
      ...contacts,
      name: header.name,
      title: header.title,
      summary: header.summary,
      photoUrl: '',
    },
    workExperience: workExperience.length > 0 ? workExperience : [],
    skills: skills.length > 0 ? skills : [],
    community,
    education: education.length > 0 ? education : [],
    achievements,
  };
}
