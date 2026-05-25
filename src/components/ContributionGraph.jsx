import { useState, useEffect, useRef } from 'react';

const USERNAME = 'monishramj';
const API = `https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=all`;
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function ContributionGraph() {
  const [data, setData] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [tip, setTip] = useState(null);
  const [tipVisible, setTipVisible] = useState(false);
  const hideTimer = useRef(null);
  const scrollRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    fetch(API).then(r => r.json()).then(d => {
      setData(d);
      // small rAF delay so the element is in the DOM before opacity transitions
      requestAnimationFrame(() => requestAnimationFrame(() => setLoaded(true)));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
  }, [data]);

  useEffect(() => {
    const el = scrollRef.current;
    const wrap = wrapRef.current;
    if (!el || !wrap) return;
    const onScroll = () => {
      wrap.classList.toggle('contrib-graph-wrap--at-start', el.scrollLeft === 0);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [data]);

  const cellSize = 15;
  const gap = 3;
  const colW = cellSize + gap;

  // Always render the section to reserve space; content fades in once loaded
  const ready = data?.contributions?.length > 0;

  let days = [], cells = [], monthLabels = [], total = 0;
  if (ready) {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    days = data.contributions
      .filter(d => new Date(d.date + 'T00:00:00') <= today)
      .sort((a, b) => a.date.localeCompare(b.date));
    const firstDow = new Date(days[0].date + 'T00:00:00').getDay();
    cells = [...Array(firstDow).fill(null), ...days];
    total = data.total && typeof data.total === 'object'
      ? Object.values(data.total).reduce((s, v) => s + v, 0)
      : days.reduce((s, d) => s + d.count, 0);

    const weeks = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
    let lastMonth = -1;
    weeks.forEach((week, wi) => {
      const firstReal = week.find(c => c !== null);
      if (!firstReal) return;
      const m = new Date(firstReal.date + 'T00:00:00').getMonth();
      if (m !== lastMonth) { monthLabels.push({ wi, label: MONTHS[m] }); lastMonth = m; }
    });
  }

  const showTip = (e, d) => {
    clearTimeout(hideTimer.current);
    const cell = e.currentTarget.getBoundingClientRect();
    const count = d.count;
    setTip({
      text: `${count} contribution${count !== 1 ? 's' : ''} on ${formatDate(d.date)}`,
      x: cell.left + cell.width / 2,
      y: cell.top,
    });
    setTipVisible(true);
  };

  const hideTip = () => {
    hideTimer.current = setTimeout(() => setTipVisible(false), 80);
  };

  return (
    <div className="contrib-section">
      <div
        className="contrib-content"
        style={{ opacity: loaded ? 1 : 0 }}
      >
        <div style={{ marginBottom: '14px', fontSize: '11px', color: 'var(--text-muted)' }}>
          {total.toLocaleString()} contributions: and more to come!
        </div>
        <div className="contrib-graph-wrap" ref={wrapRef}>
          <div className="contrib-graph" ref={scrollRef}>
            <div className="contrib-scroll-inner">
              <div className="contrib-months">
                {monthLabels.map(({ wi, label }) => (
                  <div key={label + wi} className="contrib-month-label" style={{ left: wi * colW }}>
                    {label}
                  </div>
                ))}
              </div>
              <div className="contrib-grid">
                {cells.map((d, i) =>
                  d === null ? (
                    <div key={i} className="contrib-cell contrib-cell--empty" />
                  ) : (
                    <div
                      key={d.date}
                      className="contrib-cell"
                      data-level={d.level}
                      onMouseEnter={e => showTip(e, d)}
                      onMouseLeave={hideTip}
                    />
                  )
                )}
              </div>
            </div>
            <div
              className="contrib-tip"
              style={{ left: tip?.x ?? 0, top: tip?.y ?? 0, opacity: tipVisible ? 1 : 0 }}
            >
              {tip?.text ?? ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
