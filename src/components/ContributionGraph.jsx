import { useEffect, useRef, useState } from 'react';
import { buildCalendar } from './contributions';

export default function ContributionGraph() {
  const [calendar, setCalendar] = useState(null);
  const [failed, setFailed] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    let active = true;
    fetch('https://github-contributions-api.jogruber.de/v4/monishramj?y=all', { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error('Contributions unavailable');
        return response.json();
      })
      .then(data => { if (active) setCalendar(buildCalendar(data)); })
      .catch(() => { if (active) setFailed(true); })
      .finally(() => clearTimeout(timeout));
    return () => { active = false; clearTimeout(timeout); controller.abort(); };
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; // latest weeks sit at the bottom
  }, [calendar]);

  return (
    <div className="contrib-section" aria-busy={!calendar && !failed}>
      {!calendar ? <p className="contrib-message" role="status">{failed ? <>the calendar couldn’t load. <a href="https://github.com/monishramj" target="_blank" rel="noopener noreferrer">View activity on GitHub ↗</a></> : 'tuning in to github…'}</p> : <>
        <div className="contrib-graph-wrap">
          <div className="contrib-graph" ref={scrollRef} tabIndex={0} role="region" aria-label={`GitHub contribution calendar: ${calendar.total.toLocaleString()} contributions in the last year. Scroll vertically to explore.`}>
            <div className="contrib-scroll-inner">
              <div className="contrib-months" aria-hidden="true">{calendar.months.map(({ week, label }) => <span key={week} className="contrib-month-label" style={{ top: `calc(${week} * (var(--cell) + var(--gap)))` }}>{label}</span>)}</div>
              <div className="contrib-grid">{calendar.cells.map((day, index) => day ? <div key={day.date} className="contrib-cell" data-level={day.level} role="img" aria-label={`${day.count} contributions on ${day.date}`} title={`${day.count} contributions on ${day.date}`} /> : <div key={`empty-${index}`} className="contrib-cell contrib-cell--empty" />)}</div>
            </div>
          </div>
        </div>
      </>}
    </div>
  );
}
