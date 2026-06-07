import type { Education } from '../../../types/resume';

interface Props {
  education: Education[];
}

export function EducationSection({ education }: Props) {
  return (
    <section className="sidebar-section resume-section">
      <h2 className="resume-section-title">Education</h2>
      {education.map((edu) => (
        <div key={edu.id} className="education-entry">
          <p className="education-entry__degree">{edu.degree}</p>
          <p className="education-entry__institution">{edu.institution}</p>
          <p className="education-entry__years">
            {edu.startYear} - {edu.endYear},
          </p>
        </div>
      ))}
    </section>
  );
}
