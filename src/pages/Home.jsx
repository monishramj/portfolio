import { lazy, Suspense, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ResumeModal from '../components/ResumeModal';
import ProjectCard from '../components/ProjectCard';
import ContributionGraph from '../components/ContributionGraph';
import Stack from '../components/Stack';
import { PROJECTS } from '../data/projects';

const ModelViewer = lazy(() => import('../components/ModelViewer'));

const GhIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
);

const LiIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const MailIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="M2 7l10 7 10-7"/>
  </svg>
);

const CURRENTLY = [
  { role: 'Undergrad Research Assistant', org: 'Aphasia Recovery Lab', href: 'https://www.purdue.edu/hhs/slhs/aphasia/', date: 'Jan 2026 – Present', desc: 'benchmarking LLM output on clinical speech data to model language recovery in aphasia patients.' },
  { role: 'Software Developer', org: 'UPlate', href: 'https://u-plate.com/', date: 'Feb 2026 – Present', desc: 'developing frontend architecture and ML-assisted food logging features.' },
];


const FEATURED = PROJECTS.filter(project => project.featured);
const MORE = PROJECTS.filter(project => !project.featured);
const SKILLS = [
  ['Python', 'PyTorch · scikit-learn · Hugging Face'],
  ['C / Arduino', 'Embedded systems · sensors · servo control'],
  ['React', 'Web · React Native'],
  ['Flutter', 'Dart · iOS & Android'],
];

export default function Home() {
  const [resumeOpen, setResumeOpen] = useState(false);
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    else window.scrollTo({ top: 0 });
  }, [hash]);

  return (
    <div className="portfolio" id="top">
      <a className="skip-link" href="#/#content">Skip to content</a>
      <header className="site-header">
        <Link className="wordmark" to="/" aria-label="Monish RJ, home">mrj<span>✳</span></Link>
        <nav aria-label="Main navigation">
          <Link to="/#projects">Work</Link>
          <Link to="/#about">About</Link>
          <Link to="/#activity">Activity</Link>
          <a href="mailto:mrameshj@purdue.edu">Let’s talk <span aria-hidden="true">↗</span></a>
        </nav>
      </header>

      <main id="content" tabIndex={-1}>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span className="status-dot" /> CS Honors @ Purdue</p>
            <h1 id="hero-title">monish<br />ramesh<br /><span>jayakumar.</span></h1>
            <p className="hero-intro">Exploring machine intelligence.<br />Building things you can interact with.</p>
            <div className="hero-actions">
              <Link className="primary-link" to="/#projects">Explore my work <span aria-hidden="true">↘</span></Link>
              <button className="text-link" onClick={() => setResumeOpen(true)}>Résumé <span aria-hidden="true">↗</span></button>
            </div>
            <div className="hero-social" aria-label="Social links">
              <a href="https://github.com/monishramj" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><GhIcon size={18} /></a>
              <a href="https://www.linkedin.com/in/monish-rj" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LiIcon size={18} /></a>
              <a href="mailto:mrameshj@purdue.edu" aria-label="Email"><MailIcon size={18} /></a>
              <span>ML, software & a little hardware.</span>
            </div>
          </div>
          <figure className="hero-tv">
            <div className="tv-label"><span>CHANNEL 01</span><span>PERSONAL BROADCAST</span></div>
            <div className="tv-stage" role="img" aria-label="Interactive vintage television displaying a portrait of Monish">
              <Suspense fallback={<img className="tv-placeholder" src={`${import.meta.env.BASE_URL}images/monish.jpeg`} alt="" />}>
                <ModelViewer
                  url={`${import.meta.env.BASE_URL}grandmas_tv.glb`}
                  width="100%" height="100%"
                  defaultRotationX={190} defaultRotationY={20} defaultZoom={1.05}
                  showScreenshotButton={false}
                  screenTextureSrc={`${import.meta.env.BASE_URL}images/monish.jpeg`}
                  environmentPreset="none" ambientIntensity={1.6} keyLightIntensity={3}
                  enableManualZoom={false} enableMouseParallax={false} enableHoverRotation={false}
                  autoFrame fadeIn
                />
              </Suspense>
            </div>
            <figcaption><span className="status-dot" /> A familiar face. A different frequency.<span className="drag-hint">drag to rotate ↔</span></figcaption>
          </figure>
        </section>

        <section className="section" id="projects" aria-labelledby="projects-title">
          <div className="section-heading">
            <div><p className="eyebrow">01 / Selected work</p><h2 id="projects-title">A few things I’ve built<span>.</span></h2></div>
            <p>From neural networks<br />to things with wires.</p>
          </div>
          <div className="project-grid">
            {FEATURED.map((project, index) => <ProjectCard key={project.title} {...project} index={index + 1} />)}
          </div>
          <details className="more-projects">
            <summary><span className="more-label">More projects <span className="count">{MORE.length.toString().padStart(2, '0')}</span></span><span className="expand-icon" aria-hidden="true">+</span></summary>
            <div className="project-grid project-grid--archive">
              {MORE.map((project, index) => <ProjectCard key={project.title} {...project} index={FEATURED.length + index + 1} />)}
            </div>
          </details>
        </section>

        <section className="section about-section" id="about" aria-labelledby="about-title">
          <div className="about-copy">
            <p className="eyebrow">02 / A little context</p>
            <h2 id="about-title">Curiosity is<br />the common thread<span>.</span></h2>
            <p>I’m a CS major and JHMC Honors student at Purdue, on the 3+1 BS/MS track. My main interests are ML and AI, but curiosity has taken me into VR, mobile apps, simulation, and embedded systems.</p>
            <p>Off screen: movies, sketching, and my origami collection.</p>
            <div className="about-note"><span>BASED IN</span> Illinois, US <span className="note-divider">/</span> Purdue University</div>
          </div>
          <div className="about-details">
            <h3 className="eyebrow">Currently</h3>
            <Stack items={CURRENTLY} />
            <h3 className="eyebrow toolkit-heading">My toolkit</h3>
            <dl className="toolkit">{SKILLS.map(([name, description]) => <div key={name}><dt>{name}</dt><dd>{description}</dd></div>)}</dl>
          </div>
        </section>

        <section className="section" id="activity" aria-labelledby="activity-title">
          <div className="section-heading">
            <div><p className="eyebrow">03 / In the works</p><h2 id="activity-title">One commit at a time<span>.</span></h2></div>
            <a className="text-link" href="https://github.com/monishramj" target="_blank" rel="noopener noreferrer"><GhIcon /> @monishramj <span aria-hidden="true">↗</span></a>
          </div>
          <ContributionGraph />
        </section>

        <footer className="site-footer" id="contact">
          <div className="footer-main"><div><p className="eyebrow">Keep the conversation going</p><h2>Have something in mind<span>?</span></h2></div><a className="contact-link" href="mailto:mrameshj@purdue.edu">Let’s talk <span aria-hidden="true">↗</span></a></div>
          <div className="footer-bottom"><span>© {new Date().getFullYear()} Monish Ramesh Jayakumar</span><span className="footer-fin">Thanks for tuning in. <i>fin.</i></span><Link to="/">Back to top ↑</Link></div>
        </footer>
      </main>
      <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />
    </div>
  );
}
