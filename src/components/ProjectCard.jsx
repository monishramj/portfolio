export default function ProjectCard({ title, desc, tech = [], img, github, devpost, store, index }) {
  return (
    <article className="project-card">
      <a className="project-image" href={github || store || devpost} target="_blank" rel="noopener noreferrer" aria-label={`Explore ${title}`}>
        <img src={img} alt="" loading="lazy" />
        <span className="project-number">{String(index).padStart(2, '0')}</span>
        <span className="project-arrow" aria-hidden="true">↗</span>
      </a>
      <div className="project-info">
        <h3>{title}</h3>
        <p>{desc}</p>
        <ul className="project-tags" aria-label="Technologies">{tech.map(tag => <li key={tag}>{tag}</li>)}</ul>
        <div className="project-links">
          {github && <a href={github} target="_blank" rel="noopener noreferrer" aria-label={`${title} source on GitHub`}>Source ↗</a>}
          {devpost && <a href={devpost} target="_blank" rel="noopener noreferrer" aria-label={`${title} on Devpost`}>Devpost ↗</a>}
          {store && <a href={store} target="_blank" rel="noopener noreferrer" aria-label={`${title} app`}>View app ↗</a>}
        </div>
      </div>
    </article>
  );
}
