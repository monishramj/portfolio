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
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
  }, [calendar]);

  return (
    <div className="contrib-section" aria-busy={!calendar && !failed}>
      {!calendar ? <p className="contrib-message" role="status">{failed ? <>The calendar couldn’t load. <a href="https://github.com/monishramj" target="_blank" rel="noopener noreferrer">View activity on GitHub ↗</a></> : 'Tuning in to GitHub…'}</p> : <>
        <div className="contrib-header"><span><strong>{calendar.total.toLocaleString()} contributions</strong> in the last year</span><span>A little progress, day by day.</span></div>
        <div className="contrib-graph" ref={scrollRef} tabIndex={0} role="region" aria-label="GitHub contribution calendar. Scroll horizontally to explore the last year.">
          <div className="contrib-scroll-inner">
            <div className="contrib-months" aria-hidden="true">{calendar.months.map(({ week, label }) => <span key={week} className="contrib-month-label" style={{ left: week * 17 }}>{label}</span>)}</div>
            <div className="contrib-grid">{calendar.cells.map((day, index) => day ? <div key={day.date} className="contrib-cell" data-level={day.level} role="img" aria-label={`${day.count} contributions on ${day.date}`} title={`${day.count} contributions on ${day.date}`} /> : <div key={`empty-${index}`} className="contrib-cell contrib-cell--empty" />)}</div>
          </div>
        </div>
        <div className="contrib-footer"><span>Small squares. Lots of late nights.</span><div className="contrib-legend" aria-label="Contribution intensity from less to more"><span>Less</span>{[0, 1, 2, 3, 4].map(level => <span key={level} className="contrib-cell" data-level={level} aria-hidden="true" />)}<span>More</span></div></div>
      </>}
    </div>
  );
}
