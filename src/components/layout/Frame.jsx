export default function Frame({ id, label, num, scratch, children }) {
  return (
    <section className="frame" id={id} data-screen-label={label}>
      {scratch && <div className="scratch" style={{ left: scratch }} />}
      {num && <div className="fl">FRAME {num}</div>}
      {children}
    </section>
  );
}
