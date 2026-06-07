import type { ReactNode } from 'react';

const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;

export function formatHref(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const withProtocol = /^https?:\/\//i.test(trimmed) || /^mailto:/i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const parsed = new URL(withProtocol);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:' || parsed.protocol === 'mailto:') {
      return parsed.href;
    }
  } catch {
    return null;
  }

  return null;
}

export function parseRichText(text: string, linkClassName = 'resume-link'): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  LINK_PATTERN.lastIndex = 0;
  while ((match = LINK_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const label = match[1];
    const href = formatHref(match[2]);

    if (href) {
      nodes.push(
        <a
          key={`${match.index}-${label}`}
          href={href}
          className={linkClassName}
          target="_blank"
          rel="noreferrer"
        >
          {label}
        </a>,
      );
    } else {
      nodes.push(match[0]);
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length > 0 ? nodes : [text];
}

interface RichTextProps {
  text: string;
  className?: string;
}

export function RichText({ text, className = 'resume-link' }: RichTextProps) {
  return <>{parseRichText(text, className)}</>;
}

export function hasInlineLinks(text: string): boolean {
  LINK_PATTERN.lastIndex = 0;
  return LINK_PATTERN.test(text);
}
