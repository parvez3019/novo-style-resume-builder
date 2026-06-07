import { createId, type ResumeData } from '../types/resume';
import { defaultTheme } from '../lib/theme';

export const defaultResume: ResumeData = {
  theme: defaultTheme,
  personal: {
    name: 'Your Name',
    title: 'Your Job Title',
    summary:
      'Write a brief professional summary highlighting your experience, strengths, and career goals.',
    email: 'you@email.com',
    phone: '+1 000 000 0000',
    linkedin: 'linkedin.com/in/yourprofile',
    github: 'github.com/yourusername',
    photoUrl: '',
  },
  workExperience: [
    {
      id: createId(),
      title: 'Job Title',
      company: 'Company Name',
      startDate: '2020',
      endDate: 'Present',
      location: 'City, Country',
      bullets: ['Describe a key achievement or responsibility.'],
    },
  ],
  skills: ['Skill One', 'Skill Two', 'Skill Three'],
  community: {
    openSource: [],
    blogs: [],
  },
  education: [
    {
      id: createId(),
      degree: 'Degree Name',
      institution: 'University Name',
      startYear: '2016',
      endYear: '2020',
    },
  ],
  achievements: [],
};
