import { useNavigate } from 'react-router-dom';
import FilmStrip from '../components/layout/FilmStrip';
import Frame from '../components/layout/Frame';
import Button from '../components/Button';
import ProjectCard from '../components/ProjectCard';
import ContributionGraph from '../components/ContributionGraph';
import { PROJECTS } from '../data/projects';

export default function ProjectsPage() {
  const navigate = useNavigate();

  return (
    <FilmStrip className="film-strip--wide">
      <Frame num="P">
        <div className="proj-page-head">
          <Button size="sm" arrow="left" onClick={() => navigate('/')}>
            back
          </Button>
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
