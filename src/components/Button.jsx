export const DocIcon = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2.5" y="1.5" width="9" height="12" rx="1" />
    <path d="M5 5h4M5 8h4M5 11h2" />
    <path d="M9.5 1.5v3h3" strokeWidth="1.2" />
  </svg>
);

export default function Button({
  children,
  href,
  icon,
  variant = 'outline',
  size = 'md',
  className = '',
  ...props
}) {
  const cls = `btn btn--${variant} btn--${size}${className ? ' ' + className : ''}`;
  const content = (
    <>
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
    </>
  );

  if (href) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener" {...props}>
        {content}
      </a>
    );
  }

  return (
    <button className={cls} {...props}>
      {content}
    </button>
  );
}
