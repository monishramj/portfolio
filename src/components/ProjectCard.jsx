import { useState } from 'react';

const GhSvg = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
);

const DpSvg = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M6.002 1.61L0 12.004 6.002 22.39h11.996L24 12.004 17.998 1.61zm1.593 4.084h3.947c3.605 0 6.276 1.695 6.276 6.31 0 4.436-3.21 6.302-6.456 6.302H7.595zm2.517 2.449v7.714h1.241c2.646 0 3.862-1.55 3.862-3.861.009-2.569-1.096-3.853-3.767-3.853z"/>
  </svg>
);

const LinkSvg = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);

export default function ProjectCard({ title, desc, tech = [], img, github, devpost, store, variant = 'featured' }) {
  const [loaded, setLoaded] = useState(false);

  const imgBlock = (
    <div className="proj-img-outer">
      <div className="proj-img-wrap">
        {img
          ? <img src={img} alt={title} loading="lazy" onLoad={() => setLoaded(true)} style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.3s ease' }} />
          : <span className="proj-img-ph">{title.charAt(0)}</span>}
        {variant === 'featured' && (
          <div className="proj-overlay">
            <h3 className="proj-title">{title}</h3>
          </div>
        )}
      </div>
      {variant === 'featured' && [
        github  && { href: github,  icon: <GhSvg />,   title: 'View on GitHub'  },
        devpost && { href: devpost, icon: <DpSvg />,   title: 'View on Devpost' },
        store   && { href: store,   icon: <LinkSvg />, title: 'External link'   },
      ].filter(Boolean).map((link, i) => (
        <a key={i} href={link.href} target="_blank" rel="noopener noreferrer"
           className={`proj-arc-btn proj-arc-btn--${i + 1}`} title={link.title}>
          {link.icon}
        </a>
      ))}
    </div>
  );

  if (variant === 'row') {
    return (
      <article className="proj-card proj-card--row">
        {imgBlock}
        <div className="proj-row-text">
          <div className="proj-title-row">
            <h3 className="proj-title proj-title--row">{title}</h3>
            <div className="proj-inline-links">
              {github && (
                <a href={github} target="_blank" rel="noopener noreferrer" className="proj-inline-btn" title="View on GitHub">
                  <GhSvg />
                </a>
              )}
              {devpost && (
                <a href={devpost} target="_blank" rel="noopener noreferrer" className="proj-inline-btn" title="View on Devpost">
                  <DpSvg />
                </a>
              )}
              {store && (
                <a href={store} target="_blank" rel="noopener noreferrer" className="proj-inline-btn" title="External link">
                  <LinkSvg />
                </a>
              )}
            </div>
          </div>
          {desc && <p className="proj-desc--row">{desc}</p>}
          {tech.length > 0 && (
            <div className="proj-tags--row">
              {tech.map(t => <span key={t} className="proj-tag">{t}</span>)}
            </div>
          )}
        </div>
      </article>
    );
  }

  return (
    <article className="proj-card">
      {imgBlock}
      {desc && <p className="proj-desc">{desc}</p>}
      {tech.length > 0 && (
        <div className="proj-tags">
          {tech.map(t => <span key={t} className="proj-tag">{t}</span>)}
        </div>
      )}
    </article>
  );
}
