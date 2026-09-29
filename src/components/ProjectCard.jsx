import { useRef } from 'react';

export default function ProjectCard({ title, desc, tech = [], img, github, devpost, store, index }) {
  const dialog = useRef(null);
  return (
    <article className="project-card">
      <button className="project-image" onClick={() => dialog.current.showModal()} aria-label={`Explore ${title}`}>
        <img src={img} alt="" loading="lazy" />
        <span className="project-number">{String(index).padStart(2, '0')}</span>
        <span className="project-caption"><span className="project-category">{tech.slice(0, 2).join(' / ')}</span><span className="project-title">{title}</span></span>
        <span className="project-arrow" aria-hidden="true">↗</span>
      </button>
      <dialog ref={dialog} className="project-dialog" aria-label={title} onClick={event => { if (event.target === event.currentTarget) dialog.current.close(); }}>
        <button className="project-close" onClick={() => dialog.current.close()} aria-label={`Close ${title}`}>×</button>
        <img className="project-detail-image" src={img} alt={title} loading="lazy" />
        <div className="project-info">
          <h3>{title}</h3><p>{desc}</p>
          <ul className="project-tags" aria-label="Technologies">{tech.map(tag => <li key={tag}>{tag}</li>)}</ul>
          <div className="project-links">
            {github && <a href={github} target="_blank" rel="noopener noreferrer" aria-label={`${title} source on GitHub`}>Source ↗</a>}
            {devpost && <a href={devpost} target="_blank" rel="noopener noreferrer">Devpost ↗</a>}
            {store && <a href={store} target="_blank" rel="noopener noreferrer">View app ↗</a>}
          </div>
        </div>
      </dialog>
    </article>
  );
}
