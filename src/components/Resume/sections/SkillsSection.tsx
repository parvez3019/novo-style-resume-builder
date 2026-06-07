interface Props {
  skills: string[];
}

export function SkillsSection({ skills }: Props) {
  return (
    <section className="sidebar-section resume-section">
      <h2 className="resume-section-title">Skills</h2>
      <div className="skills-list">
        {skills.map((skill) => (
          <span key={skill} className="skill-pill">
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}
