interface Props {
  achievements: string[];
}

export function AchievementsSection({ achievements }: Props) {
  return (
    <section className="sidebar-section resume-section">
      <h2 className="resume-section-title">Achievements</h2>
      <ul className="achievements-list">
        {achievements.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
