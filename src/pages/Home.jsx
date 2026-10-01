import { Component, lazy, Suspense, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ContributionGraph from '../components/ContributionGraph';
import VhsShelf from '../components/VhsShelf';
import { shelfFrame } from '../components/shelfLayout';
import { PROJECTS } from '../data/projects';
import { SKILLS } from '../data/skills';

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
    resume: <><path d="M14 2H5v20h14V7zM14 2v5h5M8 12h8M8 16h6" /></>,
  };
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

class Television extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    const { channel, reducedMotion, view, selectedSkill, onSelectSkill } = this.props;
    const fallback = <img className="screen-fallback" src={channel.img} alt={channel.title} />;
    if (this.state.failed) return fallback;
    return <Suspense fallback={fallback}><ModelViewer
      url={`${base}grandmas_tv.glb`} width="100%" height="100%"
      defaultRotationX={180} defaultRotationY={0} defaultZoom={1.9}
      screenTextureSrc={channel.img} screenTextureFit={channel.fit} screenTextureFocus={channel.focus}
      environmentPreset="dawn" enableManualZoom={false} enableManualRotation={false}
      enableMouseParallax={!reducedMotion} enableHoverRotation={!reducedMotion}
      showScreenshotButton={false} focusScreen autoFrame
      focus={view === 'skills' ? shelfFrame : 'screen'} instantFocus={reducedMotion}
    >{bounds => <VhsShelf bounds={bounds} skills={SKILLS} selected={selectedSkill} active={view === 'skills'} onSelect={onSelectSkill} />}</ModelViewer></Suspense>;
  }
}

export default function Home() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const projectIndex = CHANNELS.findIndex(project => project.id === params.get('channel'));
  const view = SECTIONS.includes(params.get('view')) ? params.get('view') : projectIndex >= 0 ? 'projects' : 'about';
  const index = Math.max(0, projectIndex);
  const channel = view === 'projects' ? CHANNELS[index] : ABOUT;
  const [selectedSkill, setSelectedSkill] = useState(0);
  const [reducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const preview = useRef(null);
  const skill = SKILLS[selectedSkill];
  const previous = projectUrl((index + CHANNELS.length - 1) % CHANNELS.length);
  const next = projectUrl((index + 1) % CHANNELS.length);

  return <main className="portfolio">
    <a className="skip-link" href="#screen-content" onClick={event => { event.preventDefault(); document.getElementById('screen-content').focus(); }}>skip to content</a>
    <aside className="identity">
      <div><h1>monish<br /><em>ramesh <br />jayakumar</em></h1><p className="identity-note">cs honors @ purdue</p></div>
      <div className="identity-bottom"><nav aria-label="Main navigation">{SECTIONS.map((id, i) => <Link key={id} to={id === 'about' ? '/' : `/?view=${id}`} aria-current={view === id ? 'page' : undefined}>{LABELS[i]}</Link>)}</nav>
        <div className="social-links" aria-label="social links">
          {[
            ['github', 'github', 'https://github.com/monishramj'], ['linkedin', 'linkedin', 'https://www.linkedin.com/in/monish-rj'],
            ['mail', 'email', 'mailto:mrameshj@purdue.edu'], ['resume', 'résumé', `${base}resume.pdf`],
          ].map(([icon, label, href]) => <a key={icon} href={href} aria-label={label} title={label} target={icon === 'mail' ? undefined : '_blank'} rel="noopener noreferrer"><Icon name={icon} /></a>)}
        </div>
      </div>
    </aside>
    <section className="screen-panel" id="screen-content" tabIndex={-1} aria-label="portfolio content">
      <div className={`screen-stage ${view === 'projects' ? 'clickable' : ''}`} role="img" aria-label={`tv showing ${channel.title}`} onClick={view === 'projects' ? () => preview.current.showModal() : undefined}>
        <Television channel={channel} reducedMotion={reducedMotion} view={view} selectedSkill={selectedSkill} onSelectSkill={setSelectedSkill} />
        <div className="tuning-flash" key={channel.id} aria-hidden="true" />
        <div className="glass-edge" aria-hidden="true"><i /><i /><i /><i /></div>
      </div>
      {view === 'skills' && <div className="sr-only-group" role="group" aria-label="skills">{SKILLS.map((item, i) => <button key={item.name} className="sr-only" aria-pressed={selectedSkill === i} onClick={() => setSelectedSkill(i)}>{item.name}</button>)}</div>}
      {view === 'projects' && <button className="sr-only" onClick={() => preview.current.showModal()}>enlarge image</button>}
      <div className="screen-caption">
        {view === 'about' && <><p>CS major and JMHC Honors student at Purdue. My main interests lie in ML + AI, yet i've worked with VR, mobile apps, simulation/game dev, and embedded systems.</p><p>love movies, sketching, and I have an origami collection.</p></>}
        {view === 'projects' && <>
          <h2>{channel.title}</h2><p>{channel.desc}</p>
          <div className="project-meta"><span>{channel.tech.join(' · ')}</span><div><a href={channel.github} target="_blank" rel="noopener noreferrer">source ↗</a>{channel.devpost && <a href={channel.devpost} target="_blank" rel="noopener noreferrer">devpost ↗</a>}{channel.store && <a href={channel.store} target="_blank" rel="noopener noreferrer">app ↗</a>}</div></div>
          <div className="channels"><Link to={previous} aria-label="previous project">‹</Link>{CHANNELS.map((item, i) => <Link key={item.id} to={projectUrl(i)} aria-label={item.title} aria-current={i === index ? 'true' : undefined} className="tick" />)}<Link to={next} aria-label="next project">›</Link></div>
        </>}
        {view === 'skills' && <div className="skill-detail" aria-live="polite" aria-atomic="true">
          <span className="skill-category">{skill.category}</span><h2>{skill.name}</h2><p>{skill.detail}</p>
          <ContributionGraph />
        </div>}
      </div>
    </section>
    <dialog ref={preview} className="image-preview" aria-label={`${channel.title} image preview`} onClick={event => { if (event.target === event.currentTarget) preview.current.close(); }}><div className="preview-bar"><span>{channel.title}</span><button onClick={() => preview.current.close()} aria-label="close image preview">×</button></div><img src={channel.img} alt={channel.title} /></dialog>
  </main>;
}
