import type { ResumeData } from '../../types/resume';
import { AchievementsEditor } from './AchievementsEditor';
import { CommunityEditor } from './CommunityEditor';
import { EducationEditor } from './EducationEditor';
import { PersonalInfoForm } from './PersonalInfoForm';
import { SkillsEditor } from './SkillsEditor';
import { ThemeEditor } from './ThemeEditor';
import { WorkExperienceEditor } from './WorkExperienceEditor';

interface Props {
  resume: ResumeData;
  onChange: (resume: ResumeData) => void;
}

export function EditorPanel({ resume, onChange }: Props) {
  return (
    <>
      <ThemeEditor
        theme={resume.theme}
        onChange={(theme) => onChange({ ...resume, theme })}
      />
      <PersonalInfoForm
        personal={resume.personal}
        onChange={(personal) => onChange({ ...resume, personal })}
      />
      <WorkExperienceEditor
        jobs={resume.workExperience}
        onChange={(workExperience) => onChange({ ...resume, workExperience })}
      />
      <SkillsEditor
        skills={resume.skills}
        onChange={(skills) => onChange({ ...resume, skills })}
      />
      <CommunityEditor
        community={resume.community}
        onChange={(community) => onChange({ ...resume, community })}
      />
      <EducationEditor
        education={resume.education}
        onChange={(education) => onChange({ ...resume, education })}
      />
      <AchievementsEditor
        achievements={resume.achievements}
        onChange={(achievements) => onChange({ ...resume, achievements })}
      />
    </>
  );
}
