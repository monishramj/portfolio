import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// import ContributionGraph from '../components/ContributionGraph'; // hidden for now; see the commented usage below
import VhsShelf from '../components/VhsShelf';
import { shelfFrame } from '../components/shelfLayout';
import { PROJECTS } from '../data/projects';
import { SKILLS } from '../data/skills';
import { EXPERIENCE } from '../data/experience';

const ModelViewer = lazy(() => import('../components/ModelViewer'));
const SECTIONS = ['about', 'projects', 'skills'];
const LABELS = ['about me', 'projects', 'skills'];
const base = import.meta.env.BASE_URL;
const ABOUT = { id: 'about', title: 'About me', img: `${base}images/monish.jpeg` };
const CHANNELS = PROJECTS.map(project => ({ ...project, id: project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') }));
const projectUrl = index => `/?view=projects&channel=${CHANNELS[index].id}`;

function Icon({ name }) {
  const paths = {
    github: <path d="M9 19c-4.3 1.3-4.3-2.2-6-2.7M15 22v-3.5c0-1 .1-1.4-.5-2 3.3-.4 6.7-1.6 6.7-7.3A5.7 5.7 0 0 0 19.7 5a5.3 5.3 0 0 0-.1-4s-1.3-.4-4.3 1.6a14.8 14.8 0 0 0-7.8 0C4.5.6 3.2 1 3.2 1a5.3 5.3 0 0 0-.1 4A5.7 5.7 0 0 0 1.6 9c0 5.7 3.4 6.9 6.7 7.3-.6.6-.6 1.2-.5 2V22" />,
    linkedin: <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M7 10v7m0-10v.1M11 17v-7m0 3a3 3 0 0 1 6 0v4" /></>,
    mail: <><rect x="2" y="4" width="20" height="16" rx="3" /><path d="m3 6 9 7 9-7" /></>,
    check: <path d="M4 12.5l5 5L20 6.5" />,
    resume: <><path d="M14 2H5v20h14V7zM14 2v5h5M8 12h8M8 16h6" /></>,
  };
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const AUTOPLAY_MS = 2000; // how long each project stays up before the carousel moves on
const EMAIL = 'mrameshj@purdue.edu';
// Same counter and key as the previous site, so the existing count carries on. Only production
// loads count (/hit); local development just reads it (/get) so testing doesn't inflate it.
const VISITS_URL = `https://abacus.jasoncameron.dev/${import.meta.env.PROD ? 'hit' : 'get'}/monishramj.dev/pageviews`;

// Copies the address instead of opening a mail app (which many visitors don't have set up).
// If the clipboard isn't available (insecure context, permission denied) it falls back to mailto.
function EmailButton() {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);
  const copy = async () => {
    try { await navigator.clipboard.writeText(EMAIL); } catch { window.location.href = `mailto:${EMAIL}`; return; }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1800);
  };
  return <button type="button" className={copied ? 'copied' : undefined} aria-label="copy email address" title={copied ? 'copied!' : 'copy email'} onClick={copy}>
    <Icon name={copied ? 'check' : 'mail'} /><span className="sr-only" role="status">{copied ? 'email copied to clipboard' : ''}</span>
  </button>;
}

class Television extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onReady?.(); } // nothing to wait for: show the photo fallback
  render() {
    const { channel, reducedMotion, view, selectedSkill, onSelectSkill, onReady } = this.props;
    const fallback = <img className="screen-fallback" src={channel.img} alt={channel.title} />;
    if (this.state.failed) return fallback;
    return <Suspense fallback={null}><ModelViewer
      url={`${base}grandmas_tv.glb`} width="100%" height="100%"
      defaultRotationX={180} defaultRotationY={0} defaultZoom={1.9}
      screenTextureSrc={channel.img} screenTextureFit={channel.fit} screenTextureFocus={channel.focus} screenDip={!reducedMotion} onReady={onReady}
      environmentPreset="dawn" enableManualZoom={false} enableManualRotation={false}
      enableMouseParallax={!reducedMotion} enableHoverRotation={!reducedMotion}
      showScreenshotButton={false} focusScreen autoFrame
      focus={view === 'skills' ? shelfFrame : 'screen'} instantFocus={reducedMotion}
    >{bounds => <VhsShelf bounds={bounds} skills={SKILLS} selected={selectedSkill} active={view === 'skills'} onSelect={onSelectSkill} />}</ModelViewer></Suspense>;
  }
}

export default function Home() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const projectIndex = CHANNELS.findIndex(project => project.id === params.get('channel'));
  const view = SECTIONS.includes(params.get('view')) ? params.get('view') : projectIndex >= 0 ? 'projects' : 'about';
  const index = Math.max(0, projectIndex);
  const channel = view === 'projects' ? CHANNELS[index] : ABOUT;
  const [selectedSkill, setSelectedSkill] = useState(0);
  const [visits, setVisits] = useState(null);
  const [tvReady, setTvReady] = useState(false);
  const markTvReady = useCallback(() => setTvReady(true), []);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [tabVisible, setTabVisible] = useState(() => !document.hidden);
  const [reducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const preview = useRef(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch(VISITS_URL, { signal: controller.signal }).then(r => r.json()).then(d => { if (typeof d.value === 'number') setVisits(d.value); }).catch(() => {});
    return () => controller.abort();
  }, []);
  const skill = SKILLS[selectedSkill];
  const previous = projectUrl((index + CHANNELS.length - 1) % CHANNELS.length);
  const next = projectUrl((index + 1) % CHANNELS.length);

  // once the TV is up, quietly fetch every project photo so the carousel never waits on the network
  useEffect(() => {
    if (!tvReady) return;
    const idle = window.requestIdleCallback || (fn => setTimeout(fn, 200));
    const handle = idle(() => CHANNELS.forEach(item => { new Image().src = item.img; }));
    return () => (window.cancelIdleCallback || clearTimeout)(handle);
  }, [tvReady]);

  // the stage stays hidden until the TV is fully ready (see ModelViewer's onReady); never wait forever, though
  useEffect(() => {
    const t = setTimeout(markTvReady, 10000);
    return () => clearTimeout(t);
  }, [markTvReady]);

  useEffect(() => {
    const onVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  // Automatic carousel: after AUTOPLAY_MS on a project, move to the next. Any pause condition (pointer over the
  // TV stage (not the caption below it), keyboard focus inside it, popup open, hidden tab, reduced motion) stops it, and changing
  // project by hand resets the clock because `index` is a dependency. Auto steps replace history entries.
  const autoplay = view === 'projects' && !reducedMotion && tabVisible && !hovered && !focused && !previewOpen;
  useEffect(() => {
    if (!autoplay) return;
    const timer = setTimeout(() => navigate(next, { replace: true }), AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [autoplay, index, next, navigate]);

  return <main className="portfolio">
    <a className="skip-link" href="#screen-content" onClick={event => { event.preventDefault(); document.getElementById('screen-content').focus(); }}>skip to content</a>
    <aside className="identity">
      <div><h1>monish<br /><em>ramesh <br />jayakumar</em></h1><p className="identity-note">cs honors @ purdue</p></div>
      <section className="experience" aria-label="experience"><ul>{EXPERIENCE.map(item => <li key={item.role}><span>{item.role}</span><span>{item.org} · {item.when}</span></li>)}</ul></section>
      {/* <ContributionGraph /> hidden for now: re-enable together with the import above (and the graph test in tests/portfolio.spec.js) */}
      <div className="identity-bottom"><nav aria-label="Main navigation">{SECTIONS.map((id, i) => <Link key={id} to={id === 'about' ? '/' : `/?view=${id}`} aria-current={view === id ? 'page' : undefined}>{LABELS[i]}</Link>)}</nav>
        <div className="social-links" aria-label="social links">
          {[
            ['github', 'github', 'https://github.com/monishramj'], ['linkedin', 'linkedin', 'https://www.linkedin.com/in/monish-rj'],
          ].map(([icon, label, href]) => <a key={icon} href={href} aria-label={label} title={label} target="_blank" rel="noopener noreferrer"><Icon name={icon} /></a>)}
          <EmailButton />
          <a href={`${base}resume.pdf`} aria-label="résumé" title="résumé" target="_blank" rel="noopener noreferrer"><Icon name="resume" /></a>
        </div>
      </div>
    </aside>
    <section className="screen-panel" id="screen-content" tabIndex={-1} aria-label="portfolio content"
      onFocus={() => setFocused(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
      <div className={`screen-stage ${view === 'projects' ? 'clickable' : ''} ${tvReady ? '' : 'booting'}`} onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)} role="img" aria-label={`tv showing ${channel.title}`} onClick={view === 'projects' ? () => { setPreviewOpen(true); preview.current.showModal(); } : undefined}>
        <Television channel={channel} reducedMotion={reducedMotion} onReady={markTvReady} view={view} selectedSkill={selectedSkill} onSelectSkill={setSelectedSkill} />
        <div className="glass-edge" aria-hidden="true"><i /><i /><i /><i /></div>
      </div>
      {view === 'skills' && <div className="sr-only-group" role="group" aria-label="skills">{SKILLS.map((item, i) => <button key={item.name} className="sr-only" aria-pressed={selectedSkill === i} onClick={() => setSelectedSkill(i)}>{item.name}</button>)}</div>}
      {view === 'projects' && <button className="sr-only" onClick={() => { setPreviewOpen(true); preview.current.showModal(); }}>enlarge image</button>}
      <div className="screen-caption">
        <div className="caption-body">
          {view === 'about' && <><p>CS major and JMHC Honors student at Purdue. My main interests lie in ML + AI, yet i've worked with VR, mobile apps, simulation/game dev, and embedded systems.</p><p>love movies, sketching, and I have an origami collection.</p></>}
          {view === 'projects' && <>
            <h2 className="project-title">{channel.title}</h2><p>{channel.desc}</p>
            <div className="project-meta"><span>{channel.tech.join(' · ')}</span><div><a href={channel.github} target="_blank" rel="noopener noreferrer">source ↗</a>{channel.devpost && <a href={channel.devpost} target="_blank" rel="noopener noreferrer">devpost ↗</a>}{channel.store && <a href={channel.store} target="_blank" rel="noopener noreferrer">app ↗</a>}</div></div>
          </>}
          {view === 'skills' && <div className="skill-detail" aria-live="polite" aria-atomic="true">
            <h2>{skill.name}</h2><p>{skill.detail}</p>
          </div>}
        </div>
        {view === 'projects' && <div className="channels"><Link to={previous} aria-label="previous project">‹</Link>{CHANNELS.map((item, i) => <Link key={item.id} to={projectUrl(i)} aria-label={item.title} aria-current={i === index ? 'true' : undefined} className="tick" />)}<Link to={next} aria-label="next project">›</Link></div>}
      </div>
      {visits !== null && <span className="visits">{visits.toLocaleString()} visits</span>}
    </section>
    <dialog ref={preview} className="image-preview" onClose={() => setPreviewOpen(false)} aria-label={`${channel.title} image preview`} onClick={event => { if (event.target === event.currentTarget) preview.current.close(); }}>
      <div className="preview-body">
        <img src={channel.img} alt={channel.title} />
        <div className="preview-caption"><span>{channel.title}</span>{channel.tech && <span>{channel.tech.join(' · ')}</span>}</div>
        <button className="preview-close" onClick={() => preview.current.close()} aria-label="close image preview"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><path d="M1.5 1.5l9 9M10.5 1.5l-9 9" /></svg></button>
      </div>
    </dialog>
  </main>;
}
