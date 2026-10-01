// Shelf geometry, in the TV's normalised units, shared by the 3D shelf and the camera framing.
export const COUNT = 10;
export const BOARD = 0.035; // shelf board thickness, in TV-relative units

// Everything is sized from the TV's normalised bounds so the shelf sits flush under it.
export function layout(b) {
  const tapeW = b.width * 0.06;
  const pitch = tapeW * 1.14;
  const tapeH = tapeW * 6.2;
  const tapeD = Math.min(b.depth * 0.8, tapeW * 4);
  const plateTop = b.bottomY;
  const floorTop = plateTop - BOARD - tapeH - 0.012;
  return { tapeW, pitch, tapeH, tapeD, plateTop, floorTop, bottom: floorTop - BOARD, rowW: pitch * COUNT };
}

// Camera frame for the skills view: the lower part of the TV down to the shelf floor.
export const shelfFrame = b => ({ top: b.bottomY + b.height * 0.28, bottom: layout(b).bottom, width: b.width });
