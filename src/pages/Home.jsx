import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FilmStrip from '../components/layout/FilmStrip';
import Frame from '../components/layout/Frame';
import InterFrame from '../components/layout/InterFrame';
import ModelViewer from '../components/ModelViewer';
import Button, { DocIcon } from '../components/Button';
import ResumeModal from '../components/ResumeModal';
import ProjectCard from '../components/ProjectCard';
import Stack from '../components/Stack';
import { PROJECTS } from '../data/projects';

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

const SKILLS = [
  {
    name: 'Python',
    desc: 'ML (PyTorch, scikit-learn, Hugging Face)',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.9S0 5.789 0 11.969c0 6.18 3.403 5.963 3.403 5.963h2.032v-2.867s-.109-3.404 3.348-3.404h5.766s3.24.052 3.24-3.13V3.13S18.28 0 11.914 0zm-3.2 1.812a1.04 1.04 0 1 1 0 2.08 1.04 1.04 0 0 1 0-2.08z"/>
        <path d="M12.086 24c6.094 0 5.714-2.656 5.714-2.656l-.007-2.752h-5.814v-.826h8.121S24 18.211 24 12.031c0-6.18-3.403-5.963-3.403-5.963h-2.032v2.867s.109 3.404-3.348 3.404H9.451s-3.24-.052-3.24 3.13V20.87S5.72 24 12.086 24zm3.2-1.812a1.04 1.04 0 1 1 0-2.08 1.04 1.04 0 0 1 0 2.08z"/>
      </svg>
    ),
  },
  {
    name: 'C',
    desc: 'ESP32 microcontroller work',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <path d="M16 5.5A7 7 0 1 0 16 14.5"/>
      </svg>
    ),
  },
  {
    name: 'Arduino',
    desc: 'embedded systems, sensors, servo control, serial comms',
    icon: (
      <svg viewBox="0 0 48 48" fill="currentColor" aria-hidden="true">
        <path d="M35.7,34.7c-7.7,0-13.2-8.9-13.4-9.3l-0.6-1l0.6-1C22.5,22.9,28,14,35.7,14C41.4,14,46,18.6,46,24.3S41.4,34.7,35.7,34.7z M26.4,24.3c1.5,2,5.1,6.3,9.2,6.3c3.5,0,6.3-2.8,6.3-6.3c0-3.5-2.8-6.3-6.3-6.3C31.5,18,27.9,22.3,26.4,24.3z"/>
        <path d="M12.3,34.7C6.6,34.7,2,30,2,24.3S6.6,14,12.3,14c7.9,0,13.2,8.9,13.4,9.3l0.6,1l-0.6,1C25.5,25.7,20,34.7,12.3,34.7z M12.3,18C8.8,18,6,20.8,6,24.3c0,3.5,2.8,6.3,6.3,6.3c4.2,0,7.8-4.3,9.3-6.3C20.2,22.3,16.6,18,12.3,18z"/>
        <path d="M10,23h6v2h-6V23z"/>
        <path d="M32,23h6v2h-6V23z"/>
        <path d="M34,21h2v6h-2V21z"/>
      </svg>
    ),
  },
  {
    name: 'React',
    desc: 'web + mobile apps (React Native)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
        <circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none"/>
        <ellipse cx="12" cy="12" rx="10" ry="3.8"/>
        <ellipse cx="12" cy="12" rx="10" ry="3.8" transform="rotate(60 12 12)"/>
        <ellipse cx="12" cy="12" rx="10" ry="3.8" transform="rotate(120 12 12)"/>
      </svg>
    ),
  },
  {
    name: 'Flutter',
    desc: 'cross-platform iOS & Android (Dart)',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path fill="none" d="M0 0h24v24H0z"/>
        <path fillRule="nonzero" d="M13.503 2.001l-10 10 3.083 3.083 13.08-13.083h-6.163zm-.006 9.198L8.122 16.62 13.494 22h6.189l-5.387-5.4 5.389-5.4h-6.188z"/>
      </svg>
    ),
  },
];

const FEATURED = PROJECTS.filter(p => p.featured);

const NAV_SECTIONS = ['projects', 'about', 'currently', 'skills'];

export default function Home() {
  const [activeSkill, setActiveSkill] = useState(SKILLS[0].name);
  const [visits, setVisits] = useState(null);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 900px)').matches);
  const [resumeOpen, setResumeOpen] = useState(false);
  const navigate = useNavigate();
  const splitMainRef = useRef(null);

  useEffect(() => {
    fetch('https://abacus.jasoncameron.dev/hit/monishramj.dev/pageviews')
      .then(r => r.json())
      .then(d => setVisits(d.value))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    const onChange = e => setIsMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const selected = SKILLS.find(s => s.name === activeSkill);

  const scrollToSection = id => {
    const container = splitMainRef.current;
    const el = document.getElementById(id);
    if (!container || !el) return;
    const top =
      el.getBoundingClientRect().top -
      container.getBoundingClientRect().top +
      container.scrollTop -
      24;
    container.scrollTo({ top, behavior: 'smooth' });
  };

  const socials = (
    <div className="hero-social">
      <a href="https://github.com/monishramj" target="_blank" rel="noopener noreferrer" className="hero-social-link" title="GitHub"><GhIcon size={17} /></a>
      <a href="https://www.linkedin.com/in/monish-rj" target="_blank" rel="noopener noreferrer" className="hero-social-link" title="LinkedIn"><LiIcon size={17} /></a>
      <a href="mailto:mrameshj@purdue.edu" className="hero-social-link" title="Email"><MailIcon size={17} /></a>
      <button type="button" onClick={() => setResumeOpen(true)} className="hero-social-link" title="Resume"><DocIcon size={17} /></button>
    </div>
  );

  const sections = (
    <>
      <Frame id="projects">
          <div className="proj-section-head">
            <div className="eyebrow" style={{ marginBottom: 0 }}>featured</div>
            <Button size="sm" onClick={() => navigate('/projects')}>
              see all projects
            </Button>
          </div>
          <div className="proj-list">
            {FEATURED.map(p => <ProjectCard key={p.title} {...p} />)}
          </div>
        </Frame>

        <InterFrame />
        <Frame id="about">
          <div className="eyebrow">about me</div>
          <div className="about-layout">
            <div className="about-body">
              <p>CS major and JHMC Honors student at Purdue. My main interests lie in ML + AI, yet i've worked with VR, mobile apps, simulation/game dev, and embedded systems.</p>
              <p>love movies, sketching, and I have an origami collection.</p>
            </div>
            <div className="about-right">
              <div className="about-meta">
                <div className="mi">
                  <div className="mi-label">Based in</div>
                  <span className="mi-val">IL, 🇺🇸</span>
                </div>
                <div className="mi">
                  <div className="mi-label">Degree</div>
                  <span className="mi-val">B.S. Computer Science Honors: 3+1 BS/MS Track</span>
                  <span className="mi-val"><b>tracks: </b>Machine Intelligence, Systems</span>
                </div>
              </div>
            </div>
          </div>
        </Frame>

        <InterFrame />
        <Frame id="currently">
          <div className="eyebrow">currently</div>
          <Stack items={CURRENTLY} />
        </Frame>

        <InterFrame />
        <Frame id="skills">
          <div className="eyebrow">Skills</div>
          <p className="sk-blurb">i've worked with various technologies. here's some i know.</p>
          <div className="sk-display">
            <div className="sk-display-name">{selected.name}</div>
            <div className="sk-display-desc">{selected.desc}</div>
          </div>
          <div className="sk-icon-row">
            {SKILLS.map(s => (
              <button
                key={s.name}
                className={`sk-icon-btn${s.name === activeSkill ? ' active' : ''}`}
                onClick={() => setActiveSkill(s.name)}
                title={s.name}
              >
                {s.icon}
              </button>
            ))}
          </div>
        </Frame>

        <InterFrame />
        <Frame id="contact">
          <div className="end-frame">
            <div className="eyebrow">fin</div>
            <p className="end-thanks">thanks for reading - always open to meeting new people. feel free to reach out!</p>
            <div className="end-links">
              <a href="https://github.com/monishramj" target="_blank" rel="noopener noreferrer" className="end-link"><GhIcon size={14} /> github</a>
              <a href="https://www.linkedin.com/in/monish-rj" target="_blank" rel="noopener noreferrer" className="end-link"><LiIcon size={14} /> linkedin</a>
              <a href="mailto:mrameshj@purdue.edu" className="end-link"><MailIcon size={14} /> email</a>
            </div>
            <div className="end-sig">
              — monish r.j, {new Date().getFullYear()}
              {visits !== null && <><span className="end-dot">·</span><span className="end-visits">{visits.toLocaleString()} visits</span></>}
            </div>
          </div>
        </Frame>
    </>
  );

  if (isMobile) {
    return (
      <>
      <FilmStrip>
        <Frame id="hero">
          <div className="frame-model-wrapper">
            <div className="frame-name-bg">
              <h1>Monish Ramesh<br></br>Jayakumar</h1>
              <p>CS Honors @ Purdue</p>
              <p>ML, SWE Tracks</p>
              {socials}
            </div>
            <ModelViewer
              url={`${import.meta.env.BASE_URL}grandmas_tv.glb`}
              width="55%"
              height={400}
              modelXOffset={0}
              modelYOffset={0}
              defaultRotationX={190}
              defaultRotationY={20}
              defaultZoom={1.05}
              showScreenshotButton={false}
              screenTextureSrc={`${import.meta.env.BASE_URL}images/monish.jpeg`}
              environmentPreset="dawn"
              enableManualZoom={false}
              enableMouseParallax={true}
              autoFrame
              fadeIn
            />
          </div>
        </Frame>
        <InterFrame />
        {sections}
      </FilmStrip>
      <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />
      </>
    );
  }

  return (
    <>
    <div className="split">
      <aside className="split-side">
        <div className="split-hero">
          <div className="split-name">
            <h1>Monish Ramesh<br></br>Jayakumar</h1>
            <p className="split-tag">CS Honors @ Purdue</p>
            <p className="split-tag">ML, SWE Tracks</p>
          </div>
          <div className="split-tv">
            <ModelViewer
              url={`${import.meta.env.BASE_URL}grandmas_tv.glb`}
              width="100%"
              height={600}
              modelXOffset={0}
              modelYOffset={0}
              defaultRotationX={190}
              defaultRotationY={20}
              defaultZoom={1.5}
              showScreenshotButton={false}
              screenTextureSrc={`${import.meta.env.BASE_URL}images/monish.jpeg`}
              environmentPreset="dawn"
              enableManualZoom={false}
              enableMouseParallax={true}
              autoFrame
              fadeIn
            />
          </div>
        </div>
        <nav className="split-nav">
          {NAV_SECTIONS.map(id => (
            <a
              key={id}
              href={`#${id}`}
              onClick={e => {
                e.preventDefault();
                if (id === 'projects') {
                  navigate('/projects');
                } else {
                  scrollToSection(id);
                }
              }}
            >
              {id}
            </a>
          ))}
        </nav>
        {socials}
      </aside>

      <div className="split-main" ref={splitMainRef}>
        <FilmStrip className="film-strip--split">
          {sections}
        </FilmStrip>
      </div>
    </div>
    <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />
    </>
  );
}
