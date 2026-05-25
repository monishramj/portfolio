const ExternalIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginLeft: '3px', verticalAlign: 'middle', opacity: 0.7 }}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

export default function Stack({ items }) {
  return (
    <div className="now-list">
      {items.map((item, i) => (
        <div className="now-row" key={i}>
          <div className="now-left">
            <span className="now-role">{item.role}</span>
            {item.href ? (
              <a href={item.href} target="_blank" rel="noopener" className="now-org">
                {item.org}<ExternalIcon />
              </a>
            ) : (
              <span className="now-org">{item.org}</span>
            )}
          </div>
          <span className="now-date">{item.date}</span>
        </div>
      ))}
    </div>
  );
}
