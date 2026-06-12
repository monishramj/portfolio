import { useNavigate } from 'react-router-dom';
import FilmStrip from '../components/layout/FilmStrip';
import Frame from '../components/layout/Frame';
import Button from '../components/Button';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <FilmStrip>
      <Frame>
        <div className="not-found">
          <div className="eyebrow">404</div>
          <p className="not-found-msg">oops - this page doesn't exist.<br />maybe it never did.</p>
          <Button size="sm" arrow="left" onClick={() => navigate('/')}>go home</Button>
        </div>
      </Frame>
    </FilmStrip>
  );
}
