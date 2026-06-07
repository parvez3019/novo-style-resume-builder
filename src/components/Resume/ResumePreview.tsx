import { useEffect } from 'react';
import { loadThemeFont, themeToCssVariables } from '../../lib/theme';
import type { ResumeData } from '../../types/resume';
import { AchievementsSection } from './sections/AchievementsSection';
import { CommunitySection } from './sections/CommunitySection';
import { EducationSection } from './sections/EducationSection';
import { ResumeHeader } from './sections/ResumeHeader';
import { SkillsSection } from './sections/SkillsSection';
import { WorkExperienceSection } from './sections/WorkExperienceSection';
import '../../styles/resume-template.css';

interface Props {
  resume: ResumeData;
}

export function ResumePreview({ resume }: Props) {
  useEffect(() => {
    loadThemeFont(resume.theme.fontFamily);
  }, [resume.theme.fontFamily]);

  return (
    <div className="resume-preview-frame">
      <article
        className="resume-page"
        id="resume-preview"
        style={themeToCssVariables(resume.theme)}
      >
        <ResumeHeader personal={resume.personal} />
        <div className="resume-body">
          <div className="resume-main">
            <WorkExperienceSection jobs={resume.workExperience} />
          </div>
          <aside className="resume-sidebar">
            <SkillsSection skills={resume.skills} />
            <CommunitySection community={resume.community} />
            <EducationSection education={resume.education} />
            <AchievementsSection achievements={resume.achievements} />
          </aside>
        </div>
      </article>
    </div>
  );
}
