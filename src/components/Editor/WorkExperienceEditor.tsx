import { createId, type WorkExperience } from '../../types/resume';
import { EditorSection } from './EditorSection';

interface Props {
  jobs: WorkExperience[];
  onChange: (jobs: WorkExperience[]) => void;
}

function moveItem<T>(items: T[], index: number, direction: -1 | 1): T[] {
  const next = [...items];
  const target = index + direction;
  if (target < 0 || target >= next.length) return items;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function WorkExperienceEditor({ jobs, onChange }: Props) {
  const updateJob = (id: string, patch: Partial<WorkExperience>) => {
    onChange(jobs.map((job) => (job.id === id ? { ...job, ...patch } : job)));
  };

  const addJob = () => {
    onChange([
      ...jobs,
      {
        id: createId(),
        title: 'Job Title',
        company: 'Company',
        startDate: '2024',
        endDate: 'Present',
        location: 'City, Country',
        bullets: ['Describe an achievement or task'],
      },
    ]);
  };

  const removeJob = (id: string) => {
    onChange(jobs.filter((job) => job.id !== id));
  };

  const addBullet = (id: string) => {
    const job = jobs.find((j) => j.id === id);
    if (!job) return;
    updateJob(id, { bullets: [...job.bullets, ''] });
  };

  const updateBullet = (jobId: string, index: number, value: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;
    const bullets = [...job.bullets];
    bullets[index] = value;
    updateJob(jobId, { bullets });
  };

  const removeBullet = (jobId: string, index: number) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;
    updateJob(jobId, { bullets: job.bullets.filter((_, i) => i !== index) });
  };

  const moveBullet = (jobId: string, index: number, direction: -1 | 1) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;
    updateJob(jobId, { bullets: moveItem(job.bullets, index, direction) });
  };

  return (
    <EditorSection title="Work Experience">
      {jobs.map((job, jobIndex) => (
        <div key={job.id} className="entry-card">
          <div className="form-group">
            <label>Job Title</label>
            <input
              value={job.title}
              onChange={(e) => updateJob(job.id, { title: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Company</label>
            <input
              value={job.company}
              onChange={(e) => updateJob(job.id, { company: e.target.value })}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input
                value={job.startDate}
                onChange={(e) => updateJob(job.id, { startDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                value={job.endDate}
                onChange={(e) => updateJob(job.id, { endDate: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              value={job.location}
              onChange={(e) => updateJob(job.id, { location: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Bullets</label>
            <p className="field-hint">Tip: use [link text](https://url) for hyperlinks</p>
            {job.bullets.map((bullet, bulletIndex) => (
              <div key={bulletIndex} className="bullet-row">
                <textarea
                  value={bullet}
                  onChange={(e) => updateBullet(job.id, bulletIndex, e.target.value)}
                />
                <div>
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => moveBullet(job.id, bulletIndex, -1)}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => moveBullet(job.id, bulletIndex, 1)}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="icon-btn icon-btn--danger"
                    onClick={() => removeBullet(job.id, bulletIndex)}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
            <button type="button" className="add-btn" onClick={() => addBullet(job.id)}>
              + Add bullet
            </button>
          </div>
          <div className="form-group">
            <label>Tech Stack (optional)</label>
            <input
              value={job.techStack ?? ''}
              onChange={(e) => updateJob(job.id, { techStack: e.target.value || undefined })}
            />
          </div>
          <div className="entry-card__actions">
            <button
              type="button"
              className="icon-btn"
              onClick={() => onChange(moveItem(jobs, jobIndex, -1))}
            >
              Move up
            </button>
            <button
              type="button"
              className="icon-btn"
              onClick={() => onChange(moveItem(jobs, jobIndex, 1))}
            >
              Move down
            </button>
            <button
              type="button"
              className="icon-btn icon-btn--danger"
              onClick={() => removeJob(job.id)}
            >
              Remove job
            </button>
          </div>
        </div>
      ))}
      <button type="button" className="add-btn" onClick={addJob}>
        + Add job
      </button>
    </EditorSection>
  );
}
