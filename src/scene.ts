/**
 * The sky behind the card, as on the map's title screen: twinkling stars, rabbits flapping
 * across, and two sword ferns unfurling in the corners. All decorative (aria-hidden); still
 * under reduced motion. Ported from the map's TitleScreen, FlyingRabbits and TitleFerns.
 */
import { midrib, pinnaLength, progress, STIPE, type Frond } from './fern.ts';

const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── stars ──
function stars(sky: HTMLElement) {
  for (let i = 0; i < 24; i++) {
    const s = document.createElement('span');
    s.className = 'star';
    s.style.left = `${(i * 37) % 100}%`;
    s.style.top = `${(i * 53) % 60}%`;
    s.style.animationDelay = `${(i % 7) * 0.4}s`;
    sky.append(s);
  }
}

// ── flying rabbits ──
const RABBIT_COLORS: Record<string, string> = { k: '#2b2350', w: '#ffffff', g: '#d9d4ec', p: '#ff7eb6', t: '#2ec4b6' };
/** A rabbit flying right, its ears for wings: upstroke, then downstroke. 20×13 each. */
const FLYING_RABBIT = [
  [
    '...........kk..kk...', '..........kwwkkwwk..', '..........kwpkkwpk..', '..........kwpkkwpk..',
    '...........kwkkwk...', '..........kkwwwwkk..', '..kk.....kwwwwwwkwk.', '.kwwkkkkkwwwwwwwwwpk',
    '.kwwwwwwwwwwwwwwwwk.', 'ttkgwwwwwtttttwwgk..', '.ttkkgwwwwwwwwggk...', '..kwwkkkkkkkkkkwwk..',
    '...kk..........kk...',
  ],
  [
    '....................', '......kkkk..........', '.....kwwppkkkk......', '......kkkwwppwkk....',
    '.........kkkwwwk....', '..........kkwwwwkk..', '..kk.....kwwwwwwkwk.', '.kwwkkkkkwwwwwwwwwpk',
    '.kwwwwwwwwwwwwwwwwk.', '.tkgwwwwwtttttwwgk..', 'tt.kkgwwwwwwwwggk...', '..kwwkkkkkkkkkkwwk..',
    '...kk..........kk...',
  ],
];

function rabbitSheet(): string {
  const c = document.createElement('canvas');
  c.width = 40;
  c.height = 13;
  const ctx = c.getContext('2d')!;
  FLYING_RABBIT.forEach((grid, f) =>
    grid.forEach((row, y) =>
      [...row].forEach((ch, x) => {
        const color = RABBIT_COLORS[ch];
        if (!color) return;
        ctx.fillStyle = color;
        ctx.fillRect(f * 20 + x, y, 1, 1);
      }),
    ),
  );
  return c.toDataURL();
}

interface Flight { top: number; dur: number; delay: number; scale: number; left: boolean; rare?: boolean }
const BEHIND: Flight[] = [
  { top: 8, dur: 14, delay: 0, scale: 3, left: false },
  { top: 22, dur: 19, delay: 6, scale: 2, left: true },
  { top: 40, dur: 11, delay: 3, scale: 4, left: false },
  { top: 15, dur: 23, delay: 11, scale: 2, left: false },
  { top: 52, dur: 16, delay: 9, scale: 3, left: true },
];
const FRONT: Flight[] = [
  { top: 30, dur: 26, delay: 22, scale: 7, left: false, rare: true },
  { top: 58, dur: 37, delay: 21, scale: 6, left: true, rare: true },
];

function rabbits(into: HTMLElement, flights: Flight[], sheet: string) {
  flights.forEach((f, i) => {
    const span = document.createElement('span');
    span.className = `flyer${f.left ? ' flyer-left' : ''}${f.rare ? ' flyer-rare' : ''}`;
    span.style.top = `${f.top}%`;
    span.style.animationDuration = `${f.dur}s`;
    span.style.animationDelay = `-${f.delay}s`;
    const b = document.createElement('i');
    Object.assign(b.style, {
      backgroundImage: `url(${sheet})`,
      width: `${20 * f.scale}px`,
      height: `${13 * f.scale}px`,
      backgroundSize: `${40 * f.scale}px ${13 * f.scale}px`,
      animationDelay: `-${i * 0.3}s`,
    });
    b.style.setProperty('--flap', `-${40 * f.scale}px`);
    span.append(b);
    into.append(span);
  });
}

// ── ferns ──
const W = 160;
const H = 120;
const FPS = 15;
const hex = (h: string) => {
  const n = parseInt(h.slice(1), 16);
  return (0xff << 24) | ((n & 0xff) << 16) | (n & 0xff00) | (n >> 16);
};
const SHADE = hex('#173f26');
const STEM = hex('#2b6234');
const LEAF = hex('#3b9146');
const SUN = hex('#76c85a');
const SCALE = hex('#a88d5c');
const BUD = hex('#a6cf6c');

/** A clump of sword fern: fronds fanned round the crown, the middle ones longest. */
function clump(seed: number, start: number): Frond[] {
  const n = 11;
  return Array.from({ length: n }, (_, i) => {
    const off = (i / (n - 1) - 0.5) * 2.5 + Math.sin(seed + i * 2.3) * 0.08;
    return {
      angle: -Math.PI / 2 + off,
      length: 100 - 26 * Math.abs(off) + Math.sin(seed * 3 + i) * 6,
      delay: start + ((i * 7 + seed) % n) * 0.45,
    };
  });
}

function drawFern(buf: Uint32Array, fronds: Frond[], t: number) {
  buf.fill(0);
  const shade: number[] = [];
  const color: number[] = [];
  const put = (x: number, y: number, c: number) => {
    const px = Math.round(x + W / 2);
    const py = Math.round(y + H - 2);
    if (px < 0 || py < 0 || px >= W || py >= H) return;
    shade.push(px, py);
    color.push(px, py, c);
  };
  fronds.forEach((f, i) => {
    const { e, u } = still ? { e: 1, u: 1 } : progress(f, t);
    if (e <= 0) return;
    const rib = midrib(f, u, e, still ? 0 : 0.0016 * Math.sin(t * 0.9 + i * 1.7));
    const L = rib.at(-1)!.s;
    rib.forEach((p, j) => {
      if (p.open < 1) {
        const nx = -Math.sin(p.a);
        const ny = Math.cos(p.a);
        for (const w of [-1, 0, 1]) put(p.x + nx * w, p.y + ny * w, (j + w) % 4 ? BUD : SCALE);
        return;
      }
      put(p.x, p.y, STEM);
      if (j % 5 || p.s < STIPE * L) return;
      const side = (j / 5) % 2 ? 1 : -1;
      const len = pinnaLength(f, p, L) * e;
      const a = p.a + side * (Math.PI / 2 - 0.55);
      for (let d = 1; d <= len; d += 0.5) {
        put(p.x + Math.cos(a) * d, p.y + Math.sin(a) * d + d * d * 0.012, d > len - 1 || side < 0 ? SUN : LEAF);
      }
    });
  });
  for (let k = 0; k < shade.length; k += 2) {
    for (const [dx, dy] of [[1, 0], [0, 1], [1, 1]]) {
      const nx = shade[k] + dx;
      const ny = shade[k + 1] + dy;
      if (nx >= 0 && ny >= 0 && nx < W && ny < H) buf[ny * W + nx] = SHADE;
    }
  }
  for (let k = 0; k < color.length; k += 3) buf[color[k + 1] * W + color[k]] = color[k + 2];
}

function fern(into: HTMLElement, seed: number, start: number, side: string) {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  canvas.className = `fern fern-${side}`;
  into.append(canvas);
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(W, H);
  const buf = new Uint32Array(img.data.buffer);
  const fronds = clump(seed, start);
  const t0 = performance.now();
  let last = -1;
  const frame = (now: number) => {
    const t = (now - t0) / 1000;
    const n = Math.floor(t * FPS);
    if (n !== last) {
      last = n;
      drawFern(buf, fronds, t);
      ctx.putImageData(img, 0, 0);
    }
    if (!still) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

export function scene() {
  const sky = document.querySelector<HTMLElement>('.sky');
  const front = document.querySelector<HTMLElement>('.front');
  if (!sky || !front) return;
  const sheet = rabbitSheet();
  stars(sky);
  rabbits(sky, BEHIND, sheet);
  fern(front, 1, 0.3, 'left');
  fern(front, 4, 1.6, 'right');
  rabbits(front, FRONT, sheet);
}
