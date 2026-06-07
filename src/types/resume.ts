export interface CommunityItem {
  id: string;
  label: string;
  url?: string;
}

export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  location: string;
  bullets: string[];
  techStack?: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  startYear: string;
  endYear: string;
}

export type FontSizePreset = 'small' | 'medium' | 'large';
export type SpacingPreset = 'compact' | 'normal' | 'relaxed';

export interface ResumeTheme {
  fontFamily: string;
  accentColor: string;
  fontSize: FontSizePreset;
  lineSpacing: SpacingPreset;
  sectionSpacing: SpacingPreset;
}

export interface ResumeData {
  theme: ResumeTheme;
  personal: {
    name: string;
    title: string;
    summary: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    photoUrl: string;
  };
  workExperience: WorkExperience[];
  skills: string[];
  community: {
    openSource: CommunityItem[];
    blogs: CommunityItem[];
  };
  education: Education[];
  achievements: string[];
}

export function createId(): string {
  return crypto.randomUUID();
}
