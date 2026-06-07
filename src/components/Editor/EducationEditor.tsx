import { createId, type Education } from '../../types/resume';
import { EditorSection } from './EditorSection';

interface Props {
  education: Education[];
  onChange: (education: Education[]) => void;
}

export function EducationEditor({ education, onChange }: Props) {
  const updateEntry = (id: string, field: keyof Education, value: string) => {
    onChange(
      education.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry,
      ),
    );
  };

  return (
    <EditorSection title="Education">
      {education.map((entry) => (
        <div key={entry.id} className="entry-card">
          <div className="form-group">
            <label>Degree</label>
            <input
              value={entry.degree}
              onChange={(e) => updateEntry(entry.id, 'degree', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Institution</label>
            <input
              value={entry.institution}
              onChange={(e) => updateEntry(entry.id, 'institution', e.target.value)}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Start Year</label>
              <input
                value={entry.startYear}
                onChange={(e) => updateEntry(entry.id, 'startYear', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>End Year</label>
              <input
                value={entry.endYear}
                onChange={(e) => updateEntry(entry.id, 'endYear', e.target.value)}
              />
            </div>
          </div>
          <button
            type="button"
            className="icon-btn icon-btn--danger"
            onClick={() => onChange(education.filter((e) => e.id !== entry.id))}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className="add-btn"
        onClick={() =>
          onChange([
            ...education,
            {
              id: createId(),
              degree: 'Degree',
              institution: 'Institution',
              startYear: '2020',
              endYear: '2024',
            },
          ])
        }
      >
        + Add education
      </button>
    </EditorSection>
  );
}
