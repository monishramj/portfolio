import { useNavigate } from 'react-router-dom';
import FilmStrip from '../components/layout/FilmStrip';
import Frame from '../components/layout/Frame';
import ProjectCard from '../components/ProjectCard';
import ContributionGraph from '../components/ContributionGraph';
import { PROJECTS } from '../data/projects';

const ArrowLeft = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 12H5M12 5l-7 7 7 7"/>
  </svg>
);

export default function ProjectsPage() {
  const navigate = useNavigate();

  return (
    <FilmStrip className="film-strip--wide">
      <Frame num="P">
        <div className="proj-page-head">
          <button className="proj-back" onClick={() => navigate('/')}>
            <ArrowLeft /> back
          </button>
          <div className="eyebrow" style={{ marginTop: '20px' }}>my work</div>
        </div>
        <div className="proj-grid">
          {PROJECTS.map(p => (
            <ProjectCard key={p.title} {...p} variant="row" />
          ))}
        </div>
        <ContributionGraph />
      </Frame>
    </FilmStrip>
  );
}
