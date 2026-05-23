export default function InterFrame({ left, center, right }) {
  return (
    <div className="ifrm">
      <span className="ifc">{left}</span>
      <span className="ifn">■ {center} ■</span>
      <span className="ifc">{right}</span>
    </div>
  );
}
