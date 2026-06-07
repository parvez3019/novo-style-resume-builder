import { useState } from 'react';
import { EditorSection } from './EditorSection';

interface Props {
  skills: string[];
  onChange: (skills: string[]) => void;
}

export function SkillsEditor({ skills, onChange }: Props) {
  const [input, setInput] = useState('');

  const addSkill = () => {
    const trimmed = input.trim();
    if (!trimmed || skills.includes(trimmed)) return;
    onChange([...skills, trimmed]);
    setInput('');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addSkill();
    }
  };

  return (
    <EditorSection title="Skills">
      <div className="tag-input-wrap">
        {skills.map((skill) => (
          <span key={skill} className="tag-chip">
            {skill}
            <button type="button" onClick={() => onChange(skills.filter((s) => s !== skill))}>
              ×
            </button>
          </span>
        ))}
        <input
          className="tag-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type skill and press Enter"
        />
      </div>
    </EditorSection>
  );
}
