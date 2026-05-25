import { useState } from 'react';
import FilmStrip from './components/layout/FilmStrip';
import Frame from './components/layout/Frame';
import InterFrame from './components/layout/InterFrame';
import ModelViewer from './components/ModelViewer';
import Button, { DocIcon } from './components/Button';
import ProjectCard from './components/ProjectCard';

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

const PROJECTS = [
  {
    title: 'MedVR Haptic Glove',
    desc: 'Wearable glove that simulates touch feedback. Real-time finger tracking + custom Unity simulation with an Oculus Quest.',
    tech: ['Arduino', 'Unity', 'C#'],
    img: '/images/vrglove.jpg',
    github: 'https://github.com/monishramj/medvr-haptic-glove',
  },
  {
    title: 'Monkish ♔',
    desc: 'Chess engine with a neural network evaluator: 6-layer CNN trained on 10M Stockfish-eval positions.',
    tech: ['Python', 'PyTorch', 'matplotlib'],
    img: '/images/chess_eval.png',
    github: 'https://github.com/monishramj/chess-engine',
  },
  {
    title: 'Drone Survey Mission',
    desc: 'Computer vision algorithm to identify ground targets + GPS survey pipeline',
    tech: ['Python', 'OpenCV', 'DroneKit', 'RPi 5'],
    img: '/images/drone.jpeg',
    github: 'https://github.com/monishramj/uas4stem-survey-mission',
  },
];

const EXPERIENCE = [
  {
    role: 'Undergraduate Research Assistant',
    org: 'Aphasia Recovery Lab — Dr. Jiyeon Lee',
    location: 'West Lafayette, IN',
    date: 'Jan 2026 – Present',
    tech: ['Python', 'PyTorch', 'Scikit-learn'],
    bullets: [
      'working under Prof. Jiyeon Lee + Dr. Yan Cong to build ML pipelines that analyze speech patterns and support aphasia treatment',
      'engineered automated diagnostic pipeline to distinguish aphasia from control speech — 72% accuracy via gradient boosting',
      'extracted high-dimensional linguistic features from 1,600+ speech records using LLM surprisal analysis',
      'optimized models with nested K-fold cross-validation and grid search across 4+ classifiers on large-scale clinical datasets',
    ],
  },
  {
    role: 'Software Team Engineer',
    org: 'Purdue Lunabotics',
    location: 'West Lafayette, IN',
    date: 'Aug 2025 – Present',
    tech: ['Python', 'Grounded SAM', 'ROS 2', 'Linux/UNIX'],
    bullets: [
      'Develop obstacle detection models using Grounded SAM to identify lunar hazards',
      'Train ML vision models on UNIX-based RCAC HPC systems',
      'Collaborate across subteams to deploy competition-ready software under strict reliability constraints',
    ],
  },
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
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="7.5" cy="12" r="5.5"/>
        <circle cx="16.5" cy="12" r="5.5"/>
        <line x1="5" y1="12" x2="10" y2="12"/>
        <line x1="7.5" y1="9.5" x2="7.5" y2="14.5"/>
        <line x1="14" y1="12" x2="19" y2="12"/>
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
      <svg viewBox="-1 -1 26 26" fill="currentColor" aria-hidden="true">
        <path d="M14.314 0 2.3 12l3.7 3.7L21.686 0z" opacity=".55"/>
        <path d="M14.314 11.368 6.179 19.5l3.791 3.791 3.886-3.886 5.831-5.831z"/>
      </svg>
    ),
  },
  {
    name: 'Supabase',
    desc: 'postgres databases, auth, storage + pgvector embeddings for AI apps',
    icon: (
      <svg viewBox="0 0 109 113" fill="currentColor" aria-hidden="true">
        <path d="M63.708 110.284c-2.86 3.601-8.658 1.628-8.727-2.97l-1.007-67.251h45.22c8.19 0 12.758 9.46 7.665 15.874L63.708 110.284z"/>
        <path d="M63.708 110.284c-2.86 3.601-8.658 1.628-8.727-2.97l-1.007-67.251h45.22c8.19 0 12.758 9.46 7.665 15.874L63.708 110.284z" opacity=".2"/>
        <path d="M45.317 2.071c2.86-3.601 8.657-1.628 8.726 2.97l.442 67.251H9.265c-8.19 0-12.758-9.46-7.664-15.875L45.317 2.071z"/>
      </svg>
    ),
  },
];

export default function App() {
  const [activeSkill, setActiveSkill] = useState(SKILLS[0].name);
  const selected = SKILLS.find(s => s.name === activeSkill);

  return (
    <FilmStrip>
      <Frame num="01">
        <div className="frame-model-wrapper">
          <div className="frame-name-bg">
            <h1>Monish Ramesh<br></br>Jayakumar</h1>
            <p>CS Honors @ Purdue</p>
            <p>ML, SWE Tracks</p>
            <Button href="/resume.pdf" variant="outline" size="sm" icon={<DocIcon size={12} />} style={{ marginTop: '20px', marginBottom: '10px', pointerEvents: 'all' }}>
              Resume
            </Button>
            <div className="hero-social">
              <a href="https://github.com/monishramj" target="_blank" rel="noopener" className="hero-social-link" title="GitHub"><GhIcon size={15} /></a>
              <a href="https://www.linkedin.com/in/monish-rj" target="_blank" rel="noopener" className="hero-social-link" title="LinkedIn"><LiIcon size={15} /></a>
              <a href="mailto:mrameshj@purdue.edu" className="hero-social-link" title="Email"><MailIcon size={15} /></a>
            </div>
          </div>
          <ModelViewer
            url="/grandmas_tv.glb"
            width="55%"
            height={400}
            modelXOffset={0}
            modelYOffset={0}
            defaultRotationX={190}
            defaultRotationY={20}
            defaultZoom={1.1}
            showScreenshotButton={false}
            environmentPreset="dawn"
            enableManualZoom={false}
            enableMouseParallax={true}
            autoFrame
            fadeIn
          />
        </div>
      </Frame>

      <InterFrame left="FILM STRIP" center="02" right="WELCOME!" />

      <Frame num="02">
        <div className="eyebrow">featured projects</div>
        <div className="proj-list">
          {PROJECTS.map(p => <ProjectCard key={p.title} {...p} />)}
        </div>
      </Frame>

      <InterFrame left="FILM STRIP" center="03" right="MONISH RJ" />
      <Frame num="03">
        <div className="eyebrow">about me</div>
        <div className="about-layout">
          <div className="about-body">
            <p>currently loving it at Purdue University as a CS major and JHMC Honors student. currently, i'm in Purdue Lunabotics. beyond robotics, i've worked with VR systems and ML through mobile apps, simulation/game dev, and embedded systems programming.</p>
            <p>i love movies, love to get creative drawing characters in my sketchbook, being with my family. i also have an origami collection of miscellaneous sorts: Star Wars, animals, random cool shapes.</p>
          </div>
          <div className="about-right">
            <div className="about-meta">
              <div className="mi">
                <div className="mi-label">Based in</div>
                <span className="mi-val">IL, 🇺🇸</span>
              </div>
              <div className="mi">
                <div className="mi-label">Degree</div>
                <span className="mi-val">B.S. Computer Science Honors</span>
                <span>-</span>
                <span className="mi-val"><b>tracks: </b>Machine Intelligence, Systems, Software</span>
              </div>
            </div>
          </div>
        </div>

        <div className="eyebrow" style={{ marginTop: '36px' }}>currently</div>
        <div className="now-list">
          <div className="now-row">
            <div className="now-left">
              <span className="now-role">Undergrad Research Assistant</span>
              <span className="now-org">Aphasia Recovery Lab</span>
            </div>
            <span className="now-date">Jan 2026 – Present</span>
          </div>
          <div className="now-row">
            <div className="now-left">
              <span className="now-role">Software Team Engineer</span>
              <span className="now-org">Purdue Lunabotics</span>
            </div>
            <span className="now-date">Aug 2025 – Present</span>
          </div>
          <div className="now-row">
            <div className="now-left">
              <span className="now-role">Software Developer</span>
              <span className="now-org">UPlate</span>
            </div>
            <span className="now-date">Feb 2026 – Present</span>
          </div>
        </div>

        <div className="eyebrow" style={{ marginTop: '36px' }}>Skills</div>
        <p className="sk-blurb">i've worked with many technologies. here's some i know.</p>
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
      <InterFrame left="FILM STRIP" center="04" right="THE END" />
      <Frame num="04">
        <div className="end-frame">
          <div className="eyebrow">fin.</div>
          <p className="end-thanks">i'm always open to meeting new people and communicating. feel free to reach out!</p>
          <div className="end-links">
            <a href="https://github.com/monishramj" target="_blank" rel="noopener" className="end-link"><GhIcon size={14} /> github</a>
            <a href="https://www.linkedin.com/in/monish-rj" target="_blank" rel="noopener" className="end-link"><LiIcon size={14} /> linkedin</a>
            <a href="mailto:mrameshj@purdue.edu" className="end-link"><MailIcon size={14} /> email</a>
          </div>
          <div className="end-sig">— monish rj, {new Date().getFullYear()}</div>
        </div>
      </Frame>
    </FilmStrip>
  );
}
