// Shelf and tape geometry in the TV's normalised units. The shelf is a small cubby (floor, back,
// sides) built inside the lower compartment of the model's own table, just under its mid shelf.
export const COUNT = 10;
const SLAB = 0.085; // bottom slab's share of the table height (measured from the GLB)
const MID = 0.36; // underside of the mid shelf (holds the VCR), as a share of the table height from the top
const BOARD = 0.022;
const UPRIGHT = 6; // the rest lean left against the last upright one, resting on each other
const LEAN = 10 * Math.PI / 180;
const WOBBLE = [0.006, -0.008, 0.004, 0.009, -0.005, 0.007]; // tiny tilts so the upright ones aren't ruler-straight
const ZJITTER = [0.004, -0.003, 0.005, -0.004, 0.002, -0.005, 0.003, -0.002, 0.004, -0.003];

export function layout(b) {
  const [x0, y0, z0] = b.table.min;
  const [x1, y1, z1] = b.table.max;
  const tableH = y1 - y0;
  const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
  const ceiling = y1 - MID * tableH;
  const floorTop = y0 + SLAB * tableH + BOARD;
  const innerW = (x1 - x0) * 0.86; // between the table legs
  const tapeH = (ceiling - floorTop) * 0.95;
  // width chosen so the 6 upright + 4 leaning tapes fit across the shelf
  const tapeW = Math.min(tapeH / 6.2, innerW * 0.94 / 11.9);
  const gap = tapeW * 0.14;
  const tapeD = Math.min(tapeW * 4, (z1 - z0) * 0.7);

  const slots = [];
  let x = 0;
  for (let i = 0; i < UPRIGHT; i++) { slots.push({ x: x + tapeW / 2, tilt: WOBBLE[i] }); x += tapeW + gap; }
  let xl = x - gap + tapeH * Math.sin(LEAN) + 0.002; // bottom-left corner: top-left corner touches the last upright tape
  for (let i = UPRIGHT; i < COUNT; i++) { slots.push({ x: xl, tilt: LEAN, lean: true }); xl += tapeW / Math.cos(LEAN) + 0.0015; }
  const right = Math.max(...slots.map(s => s.x + (s.lean ? tapeW * Math.cos(LEAN) : tapeW / 2)));
  const shift = cx - right / 2; // slots start at x=0 on the left edge, so centre the span on the table
  slots.forEach((s, i) => { s.x += shift; s.z = cz + ZJITTER[i]; });

  return { tapeW, tapeH, tapeD, floorTop, ceiling, cx, cz, innerW, board: BOARD, depth: (z1 - z0) * 0.92, slots, top: y1, bottom: y0, width: x1 - x0 };
}

// Camera frame for the skills view: the table, with spare room below so the bottom fade doesn't eat the floor.
export const shelfFrame = b => {
  const l = layout(b);
  return { top: l.top + 0.04, bottom: l.bottom - 0.1, width: l.width * 1.35, lift: 0.16 };
};
