import { EditorSection } from './EditorSection';

interface Props {
  achievements: string[];
  onChange: (achievements: string[]) => void;
}

export function AchievementsEditor({ achievements, onChange }: Props) {
  const updateItem = (index: number, value: string) => {
    const next = [...achievements];
    next[index] = value;
    onChange(next);
  };

  return (
    <EditorSection title="Achievements">
      {achievements.map((item, index) => (
        <div key={index} className="entry-card">
          <div className="form-group">
            <label>Achievement</label>
            <textarea
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
            />
          </div>
          <button
            type="button"
            className="icon-btn icon-btn--danger"
            onClick={() => onChange(achievements.filter((_, i) => i !== index))}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className="add-btn"
        onClick={() => onChange([...achievements, 'New achievement'])}
      >
        + Add achievement
      </button>
    </EditorSection>
  );
}
