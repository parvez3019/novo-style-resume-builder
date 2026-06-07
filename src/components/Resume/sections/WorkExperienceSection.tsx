import { RichText } from '../../../lib/richText';
import type { WorkExperience } from '../../../types/resume';

interface Props {
  jobs: WorkExperience[];
}

export function WorkExperienceSection({ jobs }: Props) {
  return (
    <section className="resume-section">
      <h2 className="resume-section-title">Work Experience</h2>
      {jobs.map((job) => (
        <article key={job.id} className="work-entry">
          <div className="work-entry__head">
            <div className="work-entry__accent" aria-hidden="true" />
            <div className="work-entry__meta">
              <h3 className="work-entry__title">{job.title}</h3>
              <p className="work-entry__company">{job.company}</p>
              <div className="work-entry__timeline">
                <span className="work-entry__dates">
                  {job.startDate} - {job.endDate},
                </span>
                <span className="work-entry__location">{job.location}</span>
              </div>
            </div>
          </div>
          <div className="work-entry__body">
            <p className="work-entry__label">Achievements/Tasks</p>
            <ul className="work-entry__bullets">
              {job.bullets.map((bullet, index) => (
                <li key={index}>
                  <RichText text={bullet} />
                </li>
              ))}
            </ul>
            {job.techStack && (
              <p className="work-entry__tech">
                <strong>Tech Stack:</strong> {job.techStack}
              </p>
            )}
          </div>
        </article>
      ))}
    </section>
  );
}
