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
    desc: 'Wearable glove that simulates touch using Arduino + Unity + C#. Includes real-time finger tracking with ±2° accuracy via potentiometers and servo-based touch feedback, integrated with a custom Unity simulation paired with Oculus Quest VR. (AI slop for now)',
    tech: ['Arduino', 'Unity', 'C#', 'C++'],
    img: '/images/vrglove.jpg',
    github: 'https://github.com/monishramj/medvr-haptic-glove',
  },
  {
    title: 'Monkish: Chess Engine',
    desc: 'Chess engine with a neural network evaluator: a 6-layer CNN trained on 10M Stockfish-annotated positions, blended 70/30 with material score. Search is alpha-beta minimax at depth 3. (AI slop for now)',
    tech: ['Python', 'PyTorch', 'matplotlib'],
    img: '/images/chess_eval.png',
    github: 'https://github.com/monishramj/chess-engine',
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
    desc: 'systems (ESP32 microcontroller work)',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <path d="M16 5.5A7 7 0 1 0 16 14.5"/>
      </svg>
    ),
  },
  {
    name: 'C++',
    desc: 'embedded systems, VR simulations, Arduino',
    icon: (
      <svg viewBox="0 0 28 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <path d="M15 4A8 8 0 1 0 15 16"/>
        <path d="M19 8h4M21 6v4M24 8h4M26 6v4" strokeWidth="1.4"/>
      </svg>
    ),
  },
  {
    name: 'React',
    desc: 'web apps, design prototypes',
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
    name: 'SQL',
    desc: 'app databases (Supabase) + vector embeddings',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <ellipse cx="12" cy="5" rx="8" ry="3"/>
        <path d="M4 5v14c0 1.657 3.582 3 8 3s8-1.343 8-3V5"/>
        <path d="M4 12c0 1.657 3.582 3 8 3s8-1.343 8-3"/>
      </svg>
    ),
  },
];

export default function App() {
  return (
    <FilmStrip>
      <Frame num="01">
        <div className="frame-model-wrapper">
          <div className="frame-name-bg">
            <h1>Monish Ramesh<br></br>Jayakumar</h1>
            <p>CS Honors @ Purdue</p>
            <p>ML, SWE Tracks</p>
            <Button href="/resume.pdf" variant="outline" size="sm" icon={<DocIcon size={12} />} style={{ marginTop: '28px', marginBottom: '10px', pointerEvents: 'all' }}>
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
            defaultZoom={1.2}
            showScreenshotButton={false}
            environmentPreset="dawn"
            enableManualZoom={false}
            enableMouseParallax={true}
            autoFrame
            fadeIn
          />
        </div>
      </Frame>

      <InterFrame left="FILM STRIP" center="02" right="MONISH RJ" />

      <Frame num="02">
        <div className="eyebrow">featured projects</div>
        <div className="proj-list">
          {PROJECTS.map(p => <ProjectCard key={p.title} {...p} />)}
        </div>
      </Frame>

      <InterFrame left="FILM STRIP" center="03" right="MONISH RJ" />

      <Frame num="03">
        <div className="eyebrow">Skills</div>
        <div className="sk-grid">
          {SKILLS.map(s => (
            <div key={s.name} className="sk-item">
              <span className="sk-icon">{s.icon}</span>
              <div>
                <div className="sk-name">{s.name}</div>
                <div className="sk-desc">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Frame>
      <InterFrame left="FILM STRIP" center="04" right="MONISH RJ" />
      <Frame num="04">
        <div className="eyebrow">about me</div>
        <div className="about-layout">
          <div className="about-body">
            <p>currently diving into ML & Systems. fullstack dev is a side passion.</p>
            <p>i love movies, sketching characters, and being with family. currently growing an origami collection Star Wars ships, animals, whatever looks interesting.</p>
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

      </Frame>
      <InterFrame left="FILM STRIP" center="05" right="MONISH RJ" />
      <Frame num="05" scratch="65%">
      </Frame>
    </FilmStrip>
  );
}
