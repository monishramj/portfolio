import { Component, lazy, Suspense, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ContributionGraph from '../components/ContributionGraph';
import { PROJECTS } from '../data/projects';

const ModelViewer = lazy(() => import('../components/ModelViewer'));
const CHANNELS = [
  { id: 'about', title: 'About me', img: `${import.meta.env.BASE_URL}images/monish.jpeg` },
  ...PROJECTS.map(project => ({ ...project, id: project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') })),
];
const channelUrl = channel => channel.id === 'about' ? '/' : `/?channel=${channel.id}`;

class Television extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    const { channel } = this.props;
    const image = <img className="screen-fallback" src={channel.img} alt={channel.title} />;
    if (this.state.failed) return image;
    return <Suspense fallback={image}><ModelViewer
      url={`${import.meta.env.BASE_URL}grandmas_tv.glb`}
      width="100%" height="100%" defaultRotationX={180} defaultRotationY={0} defaultZoom={1.5}
      screenTextureSrc={channel.img} screenTextureFit={channel.id === 'about' ? 'cover' : 'contain'}
      environmentPreset="dawn"
      enableManualZoom={false} enableManualRotation={false} enableMouseParallax={false} enableHoverRotation={false}
      showScreenshotButton={false} focusScreen autoFrame
    /></Suspense>;
  }
}

export default function Home() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const index = Math.max(0, CHANNELS.findIndex(item => item.id === params.get('channel')));
  const channel = CHANNELS[index];
  const view = ['activity', 'contact'].includes(params.get('view')) ? params.get('view') : index ? 'projects' : 'about';
  const preview = useRef(null);

  return (
    <main className="portfolio">
      <a className="skip-link" href="#screen-content" onClick={event => { event.preventDefault(); document.getElementById('screen-content').focus(); }}>Skip to content</a>
      <aside className="identity">
        <div><h1>monish<br />ramesh<br /><span>jayakumar.</span></h1><p className="identity-note">CS Honors @ Purdue</p></div>
        <div className="identity-bottom">
          <nav aria-label="Main navigation">
            <Link to="/" aria-current={view === 'about' ? 'page' : undefined}>about me</Link>
            <Link to={channelUrl(CHANNELS[1])} aria-current={view === 'projects' ? 'page' : undefined}>projects</Link>
            <Link to="/?view=activity" aria-current={view === 'activity' ? 'page' : undefined}>github activity</Link>
            <Link to="/?view=contact" aria-current={view === 'contact' ? 'page' : undefined}>contact</Link>
          </nav>
          <div className="small-links"><a href={`${import.meta.env.BASE_URL}resume.pdf`} target="_blank" rel="noopener noreferrer">résumé ↗</a><a href="https://github.com/monishramj" target="_blank" rel="noopener noreferrer">github ↗</a></div>
        </div>
      </aside>

      <section className="screen-panel" id="screen-content" tabIndex={-1} aria-label="Portfolio content">
        {view === 'activity' ? <div className="activity-panel"><p className="eyebrow">github / monishramj</p><h2>Little by little.</h2><ContributionGraph /><a className="inline-link" href="https://github.com/monishramj" target="_blank" rel="noopener noreferrer">View on GitHub ↗</a></div> : <>
          <div className="screen-stage" role="img" aria-label={`TV showing ${view === 'contact' ? 'About me' : channel.title}`}><Television channel={view === 'contact' ? CHANNELS[0] : channel} /></div>
          {view === 'contact' ? <div className="screen-caption contact-panel"><h2>Say hello.</h2><a href="mailto:mrameshj@purdue.edu">mrameshj@purdue.edu ↗</a><a href="https://www.linkedin.com/in/monish-rj" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a></div> : <>
            <div className="channel-controls" aria-label="Channel controls"><Link to={channelUrl(CHANNELS[(index + CHANNELS.length - 1) % CHANNELS.length])} aria-label="Previous channel">←</Link><span aria-live="polite" aria-atomic="true">{String(index + 1).padStart(2, '0')} / {String(CHANNELS.length).padStart(2, '0')} <span className="channel-label">{channel.title}</span></span><Link to={channelUrl(CHANNELS[(index + 1) % CHANNELS.length])} aria-label="Next channel">→</Link></div>
            <div className="screen-caption">
              {index === 0 ? <><p>CS major and JHMC Honors student at Purdue. My main interests lie in ML + AI, yet i've worked with VR, mobile apps, simulation/game dev, and embedded systems.</p><p>love movies, sketching, and I have an origami collection.</p></> : <><h2>{channel.title}</h2><p>{channel.desc}</p><div className="project-meta"><span>{channel.tech.join(' · ')}</span><div><a href={channel.github} target="_blank" rel="noopener noreferrer">Source ↗</a>{channel.devpost && <a href={channel.devpost} target="_blank" rel="noopener noreferrer">Devpost ↗</a>}{channel.store && <a href={channel.store} target="_blank" rel="noopener noreferrer">App ↗</a>}<button onClick={() => preview.current.showModal()}>Enlarge ↗</button></div></div></>}
            </div>
          </>}
        </>}
      </section>
      <dialog ref={preview} className="image-preview" aria-label={`${channel.title} image preview`} onClick={event => { if (event.target === event.currentTarget) preview.current.close(); }}><div className="preview-bar"><span>{channel.title}</span><button onClick={() => preview.current.close()} aria-label="Close image preview">×</button></div><img src={channel.img} alt={channel.title} /></dialog>
    </main>
  );
}
