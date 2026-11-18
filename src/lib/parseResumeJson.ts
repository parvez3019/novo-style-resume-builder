import {
  createId,
  type CommunityItem,
  type Education,
  type ResumeData,
  type ResumeTheme,
  type WorkExperience,
} from '../types/resume';
import { defaultTheme, FONT_OPTIONS } from './theme';

const INVALID = 'This JSON file is not a resume exported from this app.';

type Obj = Record<string, unknown>;

function isObject(value: unknown): value is Obj {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function fail(message: string): never {
  throw new Error(`${INVALID} ${message}`);
}

function str(value: unknown, path: string): string {
  if (typeof value !== 'string') fail(`Expected "${path}" to be text.`);
  return value;
}

function strList(value: unknown, path: string): string[] {
  if (!Array.isArray(value)) fail(`Expected "${path}" to be a list.`);
  return value.map((item, i) => str(item, `${path}[${i}]`));
}

function objList(value: unknown, path: string): Obj[] {
  if (!Array.isArray(value)) fail(`Expected "${path}" to be a list.`);
  return value.map((item, i) => {
    if (!isObject(item)) fail(`Expected "${path}[${i}]" to be an object.`);
    return item;
  });
}

function entryId(value: unknown): string {
  return typeof value === 'string' && value ? value : createId();
}

function oneOf<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

function parseTheme(value: unknown): ResumeTheme {
  const theme = isObject(value) ? value : {};
  const spacing = ['compact', 'normal', 'relaxed'] as const;
  return {
    fontFamily: oneOf(
      theme.fontFamily,
      FONT_OPTIONS.map((font) => font.id),
      defaultTheme.fontFamily,
    ),
    accentColor:
      typeof theme.accentColor === 'string' && /^#[0-9a-f]{6}$/i.test(theme.accentColor)
        ? theme.accentColor
        : defaultTheme.accentColor,
    fontSize: oneOf(theme.fontSize, ['small', 'medium', 'large'] as const, defaultTheme.fontSize),
    lineSpacing: oneOf(theme.lineSpacing, spacing, defaultTheme.lineSpacing),
    sectionSpacing: oneOf(theme.sectionSpacing, spacing, defaultTheme.sectionSpacing),
  };
}

function parsePhotoUrl(value: unknown): string {
  if (value === undefined || value === '') return '';
  const url = str(value, 'personal.photoUrl');
  if (!/^(data:image\/|https?:\/\/)/i.test(url)) {
    fail('"personal.photoUrl" must be an image data URL or an http(s) link.');
  }
  return url;
}

function parseCommunity(value: unknown, path: string): CommunityItem[] {
  return objList(value, path).map((item, i) => {
    const label = str(item.label, `${path}[${i}].label`);
    const url = item.url === undefined ? undefined : str(item.url, `${path}[${i}].url`);
    return { id: entryId(item.id), label, ...(url ? { url } : {}) };
  });
}

function parseWork(value: unknown): WorkExperience[] {
  return objList(value, 'workExperience').map((job, i) => {
    const p = `workExperience[${i}]`;
    const techStack =
      job.techStack === undefined ? undefined : str(job.techStack, `${p}.techStack`);
    return {
      id: entryId(job.id),
      title: str(job.title, `${p}.title`),
      company: str(job.company, `${p}.company`),
      startDate: str(job.startDate, `${p}.startDate`),
      endDate: str(job.endDate, `${p}.endDate`),
      location: str(job.location, `${p}.location`),
      bullets: strList(job.bullets, `${p}.bullets`),
      ...(techStack ? { techStack } : {}),
    };
  });
}

function parseEducation(value: unknown): Education[] {
  return objList(value, 'education').map((edu, i) => {
    const p = `education[${i}]`;
    return {
      id: entryId(edu.id),
      degree: str(edu.degree, `${p}.degree`),
      institution: str(edu.institution, `${p}.institution`),
      startYear: str(edu.startYear, `${p}.startYear`),
      endYear: str(edu.endYear, `${p}.endYear`),
    };
  });
}

/** Parses and validates a resume JSON export. Throws an Error with a friendly message. */
export function parseResumeJson(text: string): ResumeData {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error('Could not read this file as JSON.');
  }
  if (!isObject(raw)) fail('Expected a JSON object.');
  if (!isObject(raw.personal)) fail('Expected "personal" to be an object.');
  const personal = raw.personal;
  if (!isObject(raw.community)) fail('Expected "community" to be an object.');

  return {
    theme: parseTheme(raw.theme),
    personal: {
      name: str(personal.name, 'personal.name'),
      title: str(personal.title, 'personal.title'),
      summary: str(personal.summary, 'personal.summary'),
      email: str(personal.email, 'personal.email'),
      phone: str(personal.phone, 'personal.phone'),
      linkedin: str(personal.linkedin, 'personal.linkedin'),
      github: str(personal.github, 'personal.github'),
      photoUrl: parsePhotoUrl(personal.photoUrl),
    },
    workExperience: parseWork(raw.workExperience),
    skills: strList(raw.skills, 'skills'),
    community: {
      openSource: parseCommunity(raw.community.openSource, 'community.openSource'),
      blogs: parseCommunity(raw.community.blogs, 'community.blogs'),
    },
    education: parseEducation(raw.education),
    achievements: strList(raw.achievements, 'achievements'),
  };
}
