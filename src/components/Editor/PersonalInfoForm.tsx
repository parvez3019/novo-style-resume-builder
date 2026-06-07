import type { ResumeData } from '../../types/resume';
import { EditorSection } from './EditorSection';

interface Props {
  personal: ResumeData['personal'];
  onChange: (personal: ResumeData['personal']) => void;
}

export function PersonalInfoForm({ personal, onChange }: Props) {
  const update = (field: keyof ResumeData['personal'], value: string) => {
    onChange({ ...personal, [field]: value });
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange({ ...personal, photoUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <EditorSection title="Personal Info">
      <div className="form-group">
        <label htmlFor="name">Full Name</label>
        <input
          id="name"
          value={personal.name}
          onChange={(e) => update('name', e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="title">Job Title</label>
        <input
          id="title"
          value={personal.title}
          onChange={(e) => update('title', e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="summary">Summary</label>
        <textarea
          id="summary"
          value={personal.summary}
          onChange={(e) => update('summary', e.target.value)}
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            value={personal.email}
            onChange={(e) => update('email', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            value={personal.phone}
            onChange={(e) => update('phone', e.target.value)}
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="linkedin">LinkedIn</label>
        <input
          id="linkedin"
          value={personal.linkedin}
          onChange={(e) => update('linkedin', e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="github">GitHub</label>
        <input
          id="github"
          value={personal.github}
          onChange={(e) => update('github', e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="photo">Profile Photo</label>
        <input id="photo" type="file" accept="image/*" onChange={handlePhotoUpload} />
        {personal.photoUrl && (
          <img className="photo-preview" src={personal.photoUrl} alt="Preview" />
        )}
      </div>
    </EditorSection>
  );
}
