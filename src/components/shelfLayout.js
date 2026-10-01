// Tape geometry in the TV's normalised units. The tapes stand in the lower compartment of the
// model's own table, on its bottom slab and up against the mid shelf, so no extra geometry is needed.
export const COUNT = 10;
const SLAB = 0.085; // each table slab's share of the table height (measured from the GLB)
const MID = 0.36; // underside of the mid shelf (holds the VCR), as a share of the table height from the top

export function layout(b) {
  const [x0, y0, z0] = b.table.min;
  const [x1, y1, z1] = b.table.max;
  const tableH = y1 - y0;
  const floorTop = y0 + tableH * SLAB;
  const cavityH = tableH * (1 - MID - SLAB); // lower compartment: bottom slab up to the mid shelf
  const tapeH = cavityH * 0.94;
  const pitch = Math.min(tapeH / 6.2 * 1.14, (x1 - x0) * 0.8 / COUNT);
  const tapeW = pitch / 1.14;
  const tapeD = Math.min(tapeW * 4, (z1 - z0) * 0.7);
  return { tapeW, pitch, tapeH, tapeD, floorTop, cx: (x0 + x1) / 2, cz: (z0 + z1) / 2, top: y1, bottom: y0, width: x1 - x0 };
}

// Camera frame for the skills view: the table, with spare room below so the bottom fade doesn't eat the floor.
export const shelfFrame = b => {
  const l = layout(b);
  return { top: l.top + 0.04, bottom: l.bottom - 0.1, width: l.width * 1.35 };
};
