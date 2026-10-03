import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Intro from './components/Intro';

export default function App() {
  return (
    <>
    <Intro />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projects" element={<Navigate to="/?channel=medvr-haptic-glove" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </>
  );
}
