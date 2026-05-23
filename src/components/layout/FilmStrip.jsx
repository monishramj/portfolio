export default function FilmStrip({ id, children }) {
  return (
    <main className="film-strip" id={id}>
      <div className="sprocket" aria-hidden="true" />
      <div className="strip-inner">{children}</div>
      <div className="sprocket" aria-hidden="true" />
    </main>
  );
}
