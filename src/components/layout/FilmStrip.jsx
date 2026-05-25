export default function FilmStrip({ id, className, children }) {
  const cls = ['film-strip', className].filter(Boolean).join(' ');
  return (
    <main className={cls} id={id}>
      <div className="sprocket" aria-hidden="true" />
      <div className="strip-inner">{children}</div>
      <div className="sprocket" aria-hidden="true" />
    </main>
  );
}
