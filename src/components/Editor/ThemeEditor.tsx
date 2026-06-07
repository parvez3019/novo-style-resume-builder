import {
  ACCENT_COLOR_PRESETS,
  FONT_OPTIONS,
  FONT_SIZE_OPTIONS,
  getTypographySizes,
  LINE_SPACING_OPTIONS,
  SECTION_SPACING_OPTIONS,
} from '../../lib/theme';
import type { ResumeTheme } from '../../types/resume';
import { EditorSection } from './EditorSection';

interface Props {
  theme: ResumeTheme;
  onChange: (theme: ResumeTheme) => void;
}

export function ThemeEditor({ theme, onChange }: Props) {
  const update = <K extends keyof ResumeTheme>(key: K, value: ResumeTheme[K]) => {
    onChange({ ...theme, [key]: value });
  };

  return (
    <EditorSection title="Appearance">
      <div className="form-group">
        <label htmlFor="font-family">Font</label>
        <select
          id="font-family"
          value={theme.fontFamily}
          onChange={(e) => update('fontFamily', e.target.value)}
        >
          {FONT_OPTIONS.map((font) => (
            <option key={font.id} value={font.id}>
              {font.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="font-size">Template size</label>
        <p className="field-hint">
          Scales section headings, job titles, companies, and bullet text together.
        </p>
        <select
          id="font-size"
          value={theme.fontSize}
          onChange={(e) => update('fontSize', e.target.value as ResumeTheme['fontSize'])}
        >
          {FONT_SIZE_OPTIONS.map((size) => {
            const type = getTypographySizes(size.id);
            return (
              <option key={size.id} value={size.id}>
                {size.label} — sections {type.sectionHeading}, jobs {type.jobTitle}, bullets{' '}
                {type.bullet}
              </option>
            );
          })}
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="line-spacing">Line spacing</label>
          <select
            id="line-spacing"
            value={theme.lineSpacing}
            onChange={(e) => update('lineSpacing', e.target.value as ResumeTheme['lineSpacing'])}
          >
            {LINE_SPACING_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="section-spacing">Section spacing</label>
          <select
            id="section-spacing"
            value={theme.sectionSpacing}
            onChange={(e) =>
              update('sectionSpacing', e.target.value as ResumeTheme['sectionSpacing'])
            }
          >
            {SECTION_SPACING_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="accent-color">Accent color</label>
        <div className="color-picker-row">
          <input
            id="accent-color"
            type="color"
            value={theme.accentColor}
            onChange={(e) => update('accentColor', e.target.value)}
          />
          <input
            type="text"
            value={theme.accentColor}
            onChange={(e) => update('accentColor', e.target.value)}
            spellCheck={false}
          />
        </div>
        <div className="color-presets">
          {ACCENT_COLOR_PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              className={`color-swatch${theme.accentColor === preset.value ? ' active' : ''}`}
              title={preset.label}
              style={{ backgroundColor: preset.value }}
              onClick={() => update('accentColor', preset.value)}
            />
          ))}
        </div>
      </div>
    </EditorSection>
  );
}
