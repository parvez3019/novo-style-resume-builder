import { useState, type ReactNode } from 'react';

interface Props {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function EditorSection({ title, defaultOpen = true, children }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="editor-section">
      <div className="editor-section__header" onClick={() => setOpen(!open)}>
        <h2>{title}</h2>
        <span>{open ? '−' : '+'}</span>
      </div>
      <div className={`editor-section__body${open ? '' : ' collapsed'}`}>
        {children}
      </div>
    </section>
  );
}
