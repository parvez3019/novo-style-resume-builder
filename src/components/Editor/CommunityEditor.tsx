import { createId, type ResumeData } from '../../types/resume';
import { EditorSection } from './EditorSection';

interface Props {
  community: ResumeData['community'];
  onChange: (community: ResumeData['community']) => void;
}

function CommunityListEditor({
  title,
  items,
  onChange,
}: {
  title: string;
  items: ResumeData['community']['openSource'];
  onChange: (items: ResumeData['community']['openSource']) => void;
}) {
  const updateItem = (id: string, field: 'label' | 'url', value: string) => {
    onChange(
      items.map((item) => {
        if (item.id !== id) return item;
        if (field === 'url') {
          return { ...item, url: value || undefined };
        }
        return { ...item, label: value };
      }),
    );
  };

  return (
    <>
      <h3 style={{ margin: '0 0 8px', fontSize: '12px' }}>{title}</h3>
      {items.map((item) => (
        <div key={item.id} className="entry-card">
          <div className="form-group">
            <label>Label</label>
            <p className="field-hint">Tip: use [link text](https://url) or fill URL below</p>
            <input
              value={item.label}
              onChange={(e) => updateItem(item.id, 'label', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>URL (optional)</label>
            <input
              value={item.url ?? ''}
              onChange={(e) => updateItem(item.id, 'url', e.target.value)}
            />
          </div>
          <button
            type="button"
            className="icon-btn icon-btn--danger"
            onClick={() => onChange(items.filter((i) => i.id !== item.id))}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className="add-btn"
        onClick={() =>
          onChange([...items, { id: createId(), label: 'New item' }])
        }
      >
        + Add {title.toLowerCase()} item
      </button>
    </>
  );
}

export function CommunityEditor({ community, onChange }: Props) {
  return (
    <EditorSection title="Community">
      <CommunityListEditor
        title="Open Source"
        items={community.openSource}
        onChange={(openSource) => onChange({ ...community, openSource })}
      />
      <CommunityListEditor
        title="Blogs"
        items={community.blogs}
        onChange={(blogs) => onChange({ ...community, blogs })}
      />
    </EditorSection>
  );
}
