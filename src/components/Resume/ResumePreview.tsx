import { useEffect, useRef, useState } from 'react';
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
  const pageRef = useRef<HTMLElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(false);

  // The marker is always positioned at 297mm, so its offsetTop is the A4 page height in px.
  useEffect(() => {
    const page = pageRef.current;
    const marker = markerRef.current;
    if (!page || !marker) return;
    const measure = () => setOverflows(page.offsetHeight > marker.offsetTop + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(page);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    loadThemeFont(resume.theme.fontFamily);
  }, [resume.theme.fontFamily]);

  return (
    <div className="resume-preview-frame">
      <article
        ref={pageRef}
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
      <div
        ref={markerRef}
        className={`page-break-marker no-print${overflows ? ' page-break-marker--visible' : ''}`}
        role={overflows ? 'status' : undefined}
        aria-hidden={overflows ? undefined : true}
      >
        <span className="page-break-marker__badge">
          Page 2 starts here. Try the Small template size or Compact spacing to fit one page.
        </span>
      </div>
    </div>
  );
}
