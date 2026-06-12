export default function Frame({ id, label, scratch, children }) {
  return (
    <section className="frame" id={id} data-screen-label={label}>
      {scratch && <div className="scratch" style={{ left: scratch }} />}
      {children}
    </section>
  );
}
