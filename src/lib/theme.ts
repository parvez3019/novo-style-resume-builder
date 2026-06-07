import type { CSSProperties } from 'react';
import type { ResumeTheme } from '../types/resume';

export type FontSizePreset = ResumeTheme['fontSize'];
export type SpacingPreset = ResumeTheme['lineSpacing'];

export interface FontOption {
  id: string;
  label: string;
  family: string;
  google?: string;
}

export const FONT_OPTIONS: FontOption[] = [
  { id: 'ubuntu', label: 'Ubuntu', family: "'Ubuntu', sans-serif", google: 'Ubuntu:wght@400;700' },
  { id: 'lato', label: 'Lato', family: "'Lato', sans-serif", google: 'Lato:wght@400;700' },
  {
    id: 'open-sans',
    label: 'Open Sans',
    family: "'Open Sans', sans-serif",
    google: 'Open+Sans:wght@400;700',
  },
  { id: 'roboto', label: 'Roboto', family: "'Roboto', sans-serif", google: 'Roboto:wght@400;700' },
  {
    id: 'source-sans',
    label: 'Source Sans 3',
    family: "'Source Sans 3', sans-serif",
    google: 'Source+Sans+3:wght@400;700',
  },
  {
    id: 'merriweather',
    label: 'Merriweather',
    family: "'Merriweather', serif",
    google: 'Merriweather:wght@400;700',
  },
  {
    id: 'georgia',
    label: 'Georgia',
    family: 'Georgia, "Times New Roman", serif',
  },
];

export const FONT_SIZE_OPTIONS: { id: FontSizePreset; label: string; basePt: number }[] = [
  { id: 'small', label: 'Small', basePt: 7 },
  { id: 'medium', label: 'Medium', basePt: 8 },
  { id: 'large', label: 'Large', basePt: 9 },
];

/** Relative size of each text role (bullet = 1.0 is body base). */
export const TYPOGRAPHY_RATIOS = {
  sectionHeading: 1.125,
  jobTitle: 1.0625,
  company: 1.0625,
  bullet: 1,
  meta: 0.875,
} as const;

function formatPt(value: number): string {
  const rounded = Math.round(value * 1000) / 1000;
  return `${rounded}pt`;
}

export function getBasePt(fontSize: FontSizePreset): number {
  return FONT_SIZE_OPTIONS.find((option) => option.id === fontSize)?.basePt ?? 8;
}

export function getTypographySizes(fontSize: FontSizePreset) {
  const basePt = getBasePt(fontSize);
  return {
    base: formatPt(basePt),
    sectionHeading: formatPt(basePt * TYPOGRAPHY_RATIOS.sectionHeading),
    jobTitle: formatPt(basePt * TYPOGRAPHY_RATIOS.jobTitle),
    company: formatPt(basePt * TYPOGRAPHY_RATIOS.company),
    bullet: formatPt(basePt * TYPOGRAPHY_RATIOS.bullet),
    meta: formatPt(basePt * TYPOGRAPHY_RATIOS.meta),
  };
}

export const LINE_SPACING_OPTIONS: {
  id: SpacingPreset;
  label: string;
  lineHeight: number;
  lineGap: string;
}[] = [
  { id: 'compact', label: 'Compact', lineHeight: 1.2, lineGap: '0px' },
  { id: 'normal', label: 'Normal', lineHeight: 1.32, lineGap: '2px' },
  { id: 'relaxed', label: 'Relaxed', lineHeight: 1.5, lineGap: '4px' },
];

export const SECTION_SPACING_OPTIONS: {
  id: SpacingPreset;
  label: string;
  sectionGap: string;
  entryGap: string;
  titleGap: string;
  bodyPadding: string;
}[] = [
  {
    id: 'compact',
    label: 'Compact',
    sectionGap: '4px',
    entryGap: '4px',
    titleGap: '3px',
    bodyPadding: '3mm 11mm 8mm',
  },
  {
    id: 'normal',
    label: 'Normal',
    sectionGap: '8px',
    entryGap: '7px',
    titleGap: '6px',
    bodyPadding: '5mm 11mm 5mm',
  },
  {
    id: 'relaxed',
    label: 'Relaxed',
    sectionGap: '14px',
    entryGap: '12px',
    titleGap: '10px',
    bodyPadding: '7mm 11mm 12mm',
  },
];

export const ACCENT_COLOR_PRESETS = [
  { label: 'Classic Blue', value: '#3a8fd8' },
  { label: 'Navy', value: '#2c5282' },
  { label: 'Teal', value: '#319795' },
  { label: 'Forest', value: '#2f855a' },
  { label: 'Purple', value: '#6b46c1' },
  { label: 'Slate', value: '#4a5568' },
  { label: 'Crimson', value: '#c53030' },
];

export const defaultTheme: ResumeTheme = {
  fontFamily: 'ubuntu',
  accentColor: '#3a8fd8',
  fontSize: 'medium',
  lineSpacing: 'normal',
  sectionSpacing: 'normal',
};

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const normalized = hex.replace('#', '');
  if (!/^[0-9a-f]{6}$/i.test(normalized)) return null;
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

export function accentToHeaderBg(accentColor: string): string {
  const rgb = hexToRgb(accentColor);
  if (!rgb) return '#eef3f8';
  const mix = (channel: number) => Math.round(channel * 0.08 + 255 * 0.92);
  return `rgb(${mix(rgb.r)}, ${mix(rgb.g)}, ${mix(rgb.b)})`;
}

export function getFontOption(fontFamily: string): FontOption {
  return FONT_OPTIONS.find((font) => font.id === fontFamily) ?? FONT_OPTIONS[0];
}

export function getBaseFontSize(fontSize: FontSizePreset): string {
  return getTypographySizes(fontSize).base;
}

export function getLineSpacing(lineSpacing: SpacingPreset) {
  return LINE_SPACING_OPTIONS.find((option) => option.id === lineSpacing) ?? LINE_SPACING_OPTIONS[1];
}

export function getSectionSpacing(sectionSpacing: SpacingPreset) {
  return (
    SECTION_SPACING_OPTIONS.find((option) => option.id === sectionSpacing) ??
    SECTION_SPACING_OPTIONS[1]
  );
}

export function themeToCssVariables(theme: ResumeTheme): CSSProperties {
  const font = getFontOption(theme.fontFamily);
  const line = getLineSpacing(theme.lineSpacing);
  const section = getSectionSpacing(theme.sectionSpacing);
  const type = getTypographySizes(theme.fontSize);

  return {
    '--resume-base': type.base,
    '--resume-section-heading': type.sectionHeading,
    '--resume-job-title': type.jobTitle,
    '--resume-company': type.company,
    '--resume-bullet': type.bullet,
    '--resume-meta': type.meta,
    '--resume-font': font.family,
    '--resume-blue': theme.accentColor,
    '--resume-header-bg': accentToHeaderBg(theme.accentColor),
    '--resume-line-height': String(line.lineHeight),
    '--resume-line-gap': line.lineGap,
    '--resume-section-gap': section.sectionGap,
    '--resume-entry-gap': section.entryGap,
    '--resume-title-gap': section.titleGap,
    '--resume-body-padding': section.bodyPadding,
  } as CSSProperties;
}

const loadedFonts = new Set<string>();

export function loadThemeFont(fontFamily: string): void {
  const font = getFontOption(fontFamily);
  if (!font.google || loadedFonts.has(font.id)) return;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${font.google}&display=swap`;
  document.head.appendChild(link);
  loadedFonts.add(font.id);
}

export function mergeTheme(theme?: Partial<ResumeTheme>): ResumeTheme {
  return { ...defaultTheme, ...theme };
}
