import { hasInlineLinks, RichText } from '../../../lib/richText';
import type { ResumeData } from '../../../types/resume';

interface Props {
  community: ResumeData['community'];
}

function formatLink(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
}

function renderCommunityItem(item: ResumeData['community']['openSource'][number]) {
  if (item.url) {
    return (
      <a href={formatLink(item.url)} target="_blank" rel="noreferrer">
        {item.label}
      </a>
    );
  }

  if (hasInlineLinks(item.label)) {
    return <RichText text={item.label} />;
  }

  return item.label;
}

export function CommunitySection({ community }: Props) {
  return (
    <section className="sidebar-section resume-section">
      <h2 className="resume-section-title">Community</h2>

      {community.openSource.length > 0 && (
        <>
          <h3 className="sidebar-subtitle">Open Source</h3>
          <ul className="community-list">
            {community.openSource.map((item) => (
              <li key={item.id}>{renderCommunityItem(item)}</li>
            ))}
          </ul>
        </>
      )}

      {community.blogs.length > 0 && (
        <>
          <h3 className="sidebar-subtitle">Blogs</h3>
          <ul className="community-list">
            {community.blogs.map((item) => (
              <li key={item.id}>{renderCommunityItem(item)}</li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
