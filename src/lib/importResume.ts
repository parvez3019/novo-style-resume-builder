import { defaultResume } from '../data/defaultResume';
import type { ResumeData } from '../types/resume';
import { isAtsFormat, parseAtsText } from './parseAtsText';
import { parseResumeText } from './parseResumeText';

async function extractTextFromPdf(file: File): Promise<string> {
  const [{ getDocument, GlobalWorkerOptions }, workerModule] = await Promise.all([
    import('pdfjs-dist'),
    import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
  ]);

  GlobalWorkerOptions.workerSrc = workerModule.default;

  const buffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: buffer }).promise;
  const pages: string[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const pageLines: string[] = [];
    let currentLine = '';

    for (const item of content.items) {
      if (!('str' in item)) continue;
      currentLine += item.str;
      if ('hasEOL' in item && item.hasEOL) {
        pageLines.push(currentLine.trim());
        currentLine = '';
      }
    }

    if (currentLine.trim()) pageLines.push(currentLine.trim());
    pages.push(pageLines.join('\n'));
  }

  return pages.join('\n\n');
}

function mergeWithTemplate(
  parsed: ResumeData,
  options: { photoUrl?: string; theme?: ResumeData['theme'] } = {},
): ResumeData {
  return {
    theme: options.theme ?? defaultResume.theme,
    personal: {
      name: parsed.personal.name || defaultResume.personal.name,
      title: parsed.personal.title || defaultResume.personal.title,
      summary: parsed.personal.summary || defaultResume.personal.summary,
      email: parsed.personal.email || defaultResume.personal.email,
      phone: parsed.personal.phone || defaultResume.personal.phone,
      linkedin: parsed.personal.linkedin || defaultResume.personal.linkedin,
      github: parsed.personal.github || defaultResume.personal.github,
      photoUrl: options.photoUrl ?? '',
    },
    workExperience:
      parsed.workExperience.length > 0 ? parsed.workExperience : defaultResume.workExperience,
    skills: parsed.skills.length > 0 ? parsed.skills : defaultResume.skills,
    community: {
      openSource: parsed.community.openSource,
      blogs: parsed.community.blogs,
    },
    education: parsed.education.length > 0 ? parsed.education : defaultResume.education,
    achievements: parsed.achievements,
  };
}

export async function importResumeFile(
  file: File,
  options: { photoUrl?: string; theme?: ResumeData['theme'] } = {},
): Promise<ResumeData> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'txt' || file.type === 'text/plain') {
    const text = await file.text();
    const parsed = isAtsFormat(text) ? parseAtsText(text) : parseResumeText(text);
    return mergeWithTemplate(parsed, options);
  }

  if (extension === 'pdf' || file.type === 'application/pdf') {
    const text = await extractTextFromPdf(file);
    if (!text.trim()) {
      throw new Error('Could not extract text from this PDF. Try a text-based PDF or .txt export.');
    }
    const parsed = isAtsFormat(text) ? parseAtsText(text) : parseResumeText(text);
    return mergeWithTemplate(parsed, options);
  }

  throw new Error('Unsupported file type. Upload a .pdf or .txt resume.');
}

export type ImportResumeResult =
  | { ok: true; data: ResumeData }
  | { ok: false; error: string };

export async function tryImportResumeFile(
  file: File,
  options: { photoUrl?: string; theme?: ResumeData['theme'] } = {},
): Promise<ImportResumeResult> {
  try {
    const data = await importResumeFile(file, options);
    return { ok: true, data };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Failed to import resume.',
    };
  }
}
