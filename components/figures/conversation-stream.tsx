"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { conversationStream } from "@/lib/content";

/**
 * FIG. A — THE CONVERSATION STREAM (the cover exhibit).
 *
 * The whole idea in one live installation: millions of scattered customer
 * opinions (left, ~50 drifting HTML chips) each emit a thin, curved stream of
 * light that converges — organically, like rivers joining — into ONE fixed
 * perception card on the far right. Survey Surf does not generate the insight;
 * it discovers the one that already exists.
 *
 * Three layers, in cascade order:
 *   1. <canvas>  — the streams: curved tributary lines + thousands of tiny
 *                  light particles travelling along them, densest and warmest
 *                  where everything merges just outside the card. (behind chips)
 *   2. chips     — real customer phrases, HTML, drifting like dust in sunlight
 *                  via Framer Motion. Multiple depth layers (opacity + blur).
 *   3. card      — the market's one perception. Fixed. Never moves.
 *
 * Canvas carries the particle field (per the brief); Framer Motion carries the
 * chips; motion collapses to one settled frame under prefers-reduced-motion.
 */

const { phrases, perception } = conversationStream;

/* Depth layers — the "dust in sunlight" read. Each chip is assigned one; it
   sets base opacity, blur and scale so the field has real depth without noise. */
const DEPTHS = [
  { op: 0.34, blur: 1.7, scale: 0.84, weight: 3 }, // far
  { op: 0.6, blur: 0.6, scale: 0.93, weight: 4 }, // mid
  { op: 0.86, blur: 0, scale: 1, weight: 3 }, // near
] as const;

/** Deterministic PRNG (sin hash) — SSR-safe, no Math.random at render. */
function rand(seed: number) {
  const t = Math.sin(seed * 12.9898) * 43758.5453;
  return t - Math.floor(t);
}

type Tier = "desktop" | "tablet" | "mobile";

type Chip = {
  text: string;
  /** base position, fraction of the stage (0–1) */
  fx: number;
  fy: number;
  depth: number; // index into DEPTHS
  rot: number; // static tilt, deg
  /** drift, in px, applied by Framer Motion */
  dx: number;
  dy: number;
  dur: number;
  delay: number;
  pulse: boolean; // occasionally breathes to near-full opacity
  spin: number; // gentle ±rotation added on top of rot (deg), 0 = none
};

/* Chip field lives on the left; the stream occupies the centre; the card is
   pinned right. Chips avoid the right third so they never sit over the card. */
const FIELD = { x0: 0.02, x1: 0.53, y0: 0.06, y1: 0.94 };

/* Per-tier field: how many chips, the starting grid, and the assumed stage
   size (px) the relaxation reasons about so chips separate at real scale. */
const TIER_CFG = {
  desktop: { count: 44, cols: 5, W: 860, H: 720 },
  tablet: { count: 26, cols: 4, W: 660, H: 430 },
  mobile: { count: 15, cols: 3, W: 350, H: 330 },
} as const;

/**
 * Build a deterministic chip field: a brick-offset jittered grid, then a few
 * separation passes so no two pills overlap. Fully seeded → SSR-safe and
 * identical every render, so the canvas line origins always match the DOM.
 */
function buildChips(tier: Tier): Chip[] {
  const { count, cols, W, H } = TIER_CFG[tier];
  const rows = Math.ceil(count / cols);
  const cellW = (FIELD.x1 - FIELD.x0) / cols;
  const cellH = (FIELD.y1 - FIELD.y0) / rows;

  const chips: Chip[] = [];
  const hx: number[] = []; // half-width of each pill, as a fraction of W
  const hy: number[] = []; // half-height, as a fraction of H

  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const s = i * 1.618 + 0.31;

    // brick offset: every other row shifts half a cell so pills never stack
    const brick = (row % 2) * 0.5;
    const jx = (rand(s * 1.7) - 0.5) * cellW * 0.5;
    const jy = (rand(s * 2.3) - 0.5) * cellH * 0.5;
    const fx = FIELD.x0 + (col + 0.5 + brick) * cellW + jx;
    const fy = FIELD.y0 + (row + 0.5) * cellH + jy;

    // weighted depth pick — mostly far/mid, fewer sharp foreground chips
    const r = rand(s * 3.9);
    const depth = r < 0.32 ? 0 : r < 0.74 ? 1 : 2;
    const scale = DEPTHS[depth]?.scale ?? 1;

    // a few chips wear a slight tilt; fewer gently spin
    const tilted = rand(s * 4.4) < 0.42;
    const rot = tilted ? (rand(s * 5.1) - 0.5) * 4 : 0; // ±2°
    const spin = !tilted && rand(s * 6.7) < 0.3 ? (rand(s * 7.3) < 0.5 ? 1.6 : -1.6) : 0;

    const text = phrases[i % phrases.length] ?? "";
    // estimate the rendered pill's footprint so overlaps can be separated
    const wpx = (text.length * 6.3 + 26) * scale;
    const hpx = 25 * scale;

    chips.push({
      text,
      fx,
      fy,
      depth,
      rot,
      dx: (rand(s * 8.1) - 0.5) * 18, // gentle drift, px
      dy: (rand(s * 9.5) - 0.5) * 14,
      dur: 13 + rand(s * 10.2) * 12, // 13–25s, all different → no shared loop
      delay: rand(s * 11.9) * -18, // negative → begin mid-cycle
      pulse: rand(s * 13.1) < 0.22,
      spin,
    });
    hx.push(wpx / 2 / W);
    hy.push(hpx / 2 / H);
  }

  // relaxation — push overlapping pills apart along their shallowest overlap
  const gx = 12 / W;
  const gy = 9 / H;
  for (let iter = 0; iter < 16; iter++) {
    for (let i = 0; i < chips.length; i++) {
      const a = chips[i];
      const hxi = hx[i];
      const hyi = hy[i];
      if (!a || hxi === undefined || hyi === undefined) continue;
      for (let j = i + 1; j < chips.length; j++) {
        const b = chips[j];
        const hxj = hx[j];
        const hyj = hy[j];
        if (!b || hxj === undefined || hyj === undefined) continue;
        const dx = a.fx - b.fx;
        const dy = a.fy - b.fy;
        const minx = hxi + hxj + gx;
        const miny = hyi + hyj + gy;
        const adx = Math.abs(dx);
        const ady = Math.abs(dy);
        if (adx < minx && ady < miny) {
          const ox = minx - adx;
          const oy = miny - ady;
          if (ox < oy) {
            const dir = dx === 0 ? (rand(i * 7.1 + j) < 0.5 ? -1 : 1) : Math.sign(dx);
            a.fx += (dir * ox) / 2;
            b.fx -= (dir * ox) / 2;
          } else {
            const dir = dy === 0 ? (rand(i * 3.3 + j) < 0.5 ? -1 : 1) : Math.sign(dy);
            a.fy += (dir * oy) / 2;
            b.fy -= (dir * oy) / 2;
          }
        }
      }
    }
    for (const c of chips) {
      c.fx = Math.min(FIELD.x1, Math.max(FIELD.x0, c.fx));
      c.fy = Math.min(FIELD.y1, Math.max(FIELD.y0, c.fy));
    }
  }
  return chips;
}

function useTier(): Tier {
  const [tier, setTier] = useState<Tier>("desktop");
  useEffect(() => {
    const mq = (q: string) => window.matchMedia(q);
    const mobile = mq("(max-width: 680px)");
    const tablet = mq("(max-width: 979px)");
    const read = () => setTier(mobile.matches ? "mobile" : tablet.matches ? "tablet" : "desktop");
    read();
    mobile.addEventListener("change", read);
    tablet.addEventListener("change", read);
    return () => {
      mobile.removeEventListener("change", read);
      tablet.removeEventListener("change", read);
    };
  }, []);
  return tier;
}

export function ConversationStream() {
  const reduced = useReducedMotion();
  const tier = useTier();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const chips = useMemo(() => buildChips(tier), [tier]);

  return (
    <figure
      className="cs"
      aria-label="Millions of scattered customer opinions converging into one market perception"
    >
      <figcaption className="cs-caption">
        FIG. A · The conversation stream — millions of scattered opinions resolve
        into the single perception the market already holds.
      </figcaption>

      <div className="cs-stage">
        {/* Layer 1 — the streams of light (curved tributaries + particles). */}
        <StreamCanvas chips={chips} reduced={reduced} tier={tier} mounted={mounted} />

        {/* Layer 2 — the drifting opinion chips (HTML). */}
        {mounted ? (
          <div className="cs-chips" aria-hidden="true">
            {chips.map((c, i) => (
              <ChipEl key={i} chip={c} reduced={reduced} />
            ))}
          </div>
        ) : null}

        {/* Layer 3 — the one perception. Fixed. Everything flows into it. */}
        <aside className="cs-card" aria-label="The market's perception">
          <span className="cs-card-glow" aria-hidden="true" />
          <p className="cs-card-eyebrow">
            <span className="cs-card-dot" aria-hidden="true" />
            {perception.eyebrow}
          </p>
          <blockquote className="cs-card-quote">{perception.quote}</blockquote>
          <div className="cs-card-rule" aria-hidden="true" />
          <dl className="cs-card-stats">
            {perception.stats.map((s) => (
              <div className="cs-card-stat" key={s.label}>
                <dt className="cs-card-stat-val">{s.value}</dt>
                <dd className="cs-card-stat-cap">{s.label}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </figure>
  );
}

/* ------------------------------------------------------------------ chip */

function ChipEl({ chip, reduced }: { chip: Chip; reduced: boolean }) {
  const d = DEPTHS[chip.depth] ?? DEPTHS[1];
  const style = {
    left: `${chip.fx * 100}%`,
    top: `${chip.fy * 100}%`,
    "--op": d.op,
    "--blur": `${d.blur}px`,
  } as CSSProperties;

  // Static, finished frame under reduced motion.
  if (reduced) {
    return (
      <div className="cs-chip" style={style} data-depth={chip.depth}>
        <span
          className="cs-chip-in"
          style={{ transform: `scale(${d.scale}) rotate(${chip.rot}deg)`, opacity: d.op }}
        >
          {chip.text}
        </span>
      </div>
    );
  }

  const rotFrom = chip.rot;
  const rotTo = chip.rot + chip.spin;

  return (
    <motion.div
      className="cs-chip"
      style={style}
      data-depth={chip.depth}
      initial={false}
      animate={{
        x: [0, chip.dx, 0, -chip.dx * 0.6, 0],
        y: [0, chip.dy, -chip.dy * 0.7, 0, 0],
      }}
      transition={{
        duration: chip.dur,
        repeat: Infinity,
        ease: "easeInOut",
        delay: chip.delay,
      }}
    >
      <motion.span
        className="cs-chip-in"
        initial={false}
        animate={{
          scale: d.scale,
          rotate: chip.spin ? [rotFrom, rotTo, rotFrom] : rotFrom,
          opacity: chip.pulse ? [d.op, Math.min(1, d.op + 0.16), d.op] : d.op,
        }}
        transition={{
          duration: chip.dur * 0.7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: chip.delay,
        }}
      >
        {chip.text}
      </motion.span>
    </motion.div>
  );
}

/* --------------------------------------------------------------- canvas */

type Particle = {
  line: number; // which tributary it rides
  t: number; // position along the curve, 0→1
  spd: number; // base speed
  sz: number; // base size
};

type Curve = {
  // cubic bezier control points, in px
  p0x: number;
  p0y: number;
  p1x: number;
  p1y: number;
  p2x: number;
  p2y: number;
  p3x: number;
  p3y: number;
};

function bez(a: number, b: number, c: number, d: number, t: number) {
  const mt = 1 - t;
  return mt * mt * mt * a + 3 * mt * mt * t * b + 3 * mt * t * t * c + t * t * t * d;
}

function StreamCanvas({
  chips,
  reduced,
  tier,
  mounted,
}: {
  chips: Chip[];
  reduced: boolean;
  tier: Tier;
  mounted: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // the card is the sibling <aside> — measured so the mouth tracks it exactly
    const stage = canvas.parentElement as HTMLElement | null;
    cardRef.current = (stage?.querySelector(".cs-card") as HTMLElement) ?? null;

    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let mouthX = 0;
    let mouthY = 0;

    const curves: Curve[] = [];
    // pre-rendered static line layer (curves never move → draw once per resize)
    const lineLayer = document.createElement("canvas");
    const lctx = lineLayer.getContext("2d");

    const particles: Particle[] = [];
    // more chips carry the stream on wider screens; fewer particles when calm
    const perLine = tier === "desktop" ? 42 : tier === "tablet" ? 30 : 22;

    const buildCurves = () => {
      curves.length = 0;
      for (const c of chips) {
        const p0x = c.fx * w;
        const p0y = c.fy * h;
        const p3x = mouthX;
        const p3y = mouthY;
        const dx = p3x - p0x;
        // leave the chip travelling horizontally, then flatten into the mouth
        // from a narrow vertical band so the tributaries "merge like rivers"
        const p1x = p0x + dx * 0.42;
        const p1y = p0y;
        const p2x = p3x - Math.max(60, dx * 0.16);
        const p2y = p3y + (p0y - p3y) * 0.1;
        curves.push({ p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y });
      }
    };

    const buildParticles = () => {
      particles.length = 0;
      for (let li = 0; li < curves.length; li++) {
        // dimmer/farther chips feed slightly fewer particles → real depth
        const depth = chips[li]?.depth ?? 1;
        const n = Math.round(perLine * (0.6 + depth * 0.2));
        for (let k = 0; k < n; k++) {
          const s = li * 3.7 + k * 0.913 + 0.17;
          particles.push({
            line: li,
            t: rand(s), // spread along the whole path from frame one
            spd: 0.0016 + rand(s * 2.1) * 0.0022,
            sz: 0.6 + rand(s * 3.3) * 1.3,
          });
        }
      }
    };

    const renderLines = () => {
      if (!lctx) return;
      lineLayer.width = Math.max(1, Math.round(w * dpr));
      lineLayer.height = Math.max(1, Math.round(h * dpr));
      lctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lctx.clearRect(0, 0, w, h);
      lctx.globalCompositeOperation = "lighter";
      lctx.lineCap = "round";

      const SEG = 26;
      for (let li = 0; li < curves.length; li++) {
        const cv = curves[li];
        if (!cv) continue;
        const depth = chips[li]?.depth ?? 1;
        const base = 0.05 + depth * 0.018; // near chips read a touch brighter
        let px = cv.p0x;
        let py = cv.p0y;
        for (let i = 1; i <= SEG; i++) {
          const t = i / SEG;
          const x = bez(cv.p0x, cv.p1x, cv.p2x, cv.p3x, t);
          const y = bez(cv.p0y, cv.p1y, cv.p2y, cv.p3y, t);
          // visible where it leaves the chip, brightening toward the confluence
          const a = base * (0.5 + t * t * 2.3);
          const g = Math.round(246 - t * 26);
          const b = Math.round(232 - t * 54);
          lctx.strokeStyle = `rgba(255,${g},${b},${a})`;
          lctx.lineWidth = 0.55 + t * 0.5;
          lctx.beginPath();
          lctx.moveTo(px, py);
          lctx.lineTo(x, y);
          lctx.stroke();
          px = x;
          py = y;
        }
      }
      lctx.globalCompositeOperation = "source-over";
    };

    const drawMouthGlow = (pulse: number) => {
      // the confluence — warm white with a tiny hint of muted red
      const r1 = Math.max(w, h) * (0.06 + pulse * 0.006);
      const g1 = ctx.createRadialGradient(mouthX, mouthY, 0, mouthX, mouthY, r1);
      g1.addColorStop(0, `rgba(255,248,236,${0.5 + pulse * 0.12})`);
      g1.addColorStop(0.35, "rgba(255,226,196,0.16)");
      g1.addColorStop(0.7, "rgba(196,86,58,0.06)"); // muted red, barely there
      g1.addColorStop(1, "rgba(196,86,58,0)");
      ctx.fillStyle = g1;
      ctx.beginPath();
      ctx.arc(mouthX, mouthY, r1, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawParticle = (p: Particle) => {
      const cv = curves[p.line];
      if (!cv) return;
      const t = p.t;
      const x = bez(cv.p0x, cv.p1x, cv.p2x, cv.p3x, t);
      const y = bez(cv.p0y, cv.p1y, cv.p2y, cv.p3y, t);
      // fade in off the chip, burn brightest at the confluence, fade at the card
      const rampIn = Math.min(1, t / 0.12);
      const fadeOut = t > 0.9 ? Math.max(0, (1 - t) / 0.1) : 1;
      const bright = 0.18 + t * t * 0.85;
      const alpha = Math.min(1, bright) * rampIn * fadeOut;
      const g = Math.round(248 - t * 30);
      const b = Math.round(236 - t * 60);
      const size = p.sz * (0.7 + t * 0.9);
      ctx.fillStyle = `rgba(255,${g},${b},${alpha})`;
      ctx.fillRect(x - size / 2, y - size / 2, size, size);
    };

    const measureMouth = () => {
      const card = cardRef.current;
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      if (card) {
        const cr = card.getBoundingClientRect();
        mouthX = cr.left - rect.left - 6; // just outside the card's left edge
        mouthY = cr.top - rect.top + cr.height / 2;
      } else {
        mouthX = w * 0.66;
        mouthY = h * 0.5;
      }
    };

    let time = 0;
    const drawFrame = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      // the static tributaries
      if (lctx) ctx.drawImage(lineLayer, 0, 0, w, h);
      // particles accelerate near the confluence
      if (!reduced) {
        time += 1;
        for (const p of particles) {
          const accel = 0.5 + p.t * p.t * 2.6;
          p.t += p.spd * accel;
          if (p.t >= 1) p.t -= 1 + rand(p.line * 1.3 + p.t) * 0.04;
        }
      }
      for (const p of particles) drawParticle(p);
      const pulse = reduced ? 0.5 : 0.5 + Math.sin(time * 0.03) * 0.5;
      drawMouthGlow(pulse);
      ctx.globalCompositeOperation = "source-over";
    };

    const resize = () => {
      measureMouth();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildCurves();
      renderLines();
      buildParticles();
      drawFrame(); // paint at least one settled frame immediately
    };

    let raf = 0;
    const loop = () => {
      drawFrame();
      raf = requestAnimationFrame(loop);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    if (!reduced) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [chips, reduced, tier, mounted]);

  return <canvas ref={canvasRef} className="cs-canvas" aria-hidden="true" />;
}
