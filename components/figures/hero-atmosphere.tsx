"use client";

import { useEffect, useRef } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * The AIR of the room — the single thing that turns a flat dark panel into a
 * photographed space. A live <canvas> of slow-drifting dust motes suspended in
 * the room, plus a breathing volumetric haze. Motes only catch the light where
 * a practical source falls on them (the two desk lamps and the lens glow), so
 * the air reads as lit rather than uniformly sprinkled — exactly how dust looks
 * in a lamp beam on camera.
 *
 * Full-bleed, sits between the room and the desk. Additive blend. Reduced-motion
 * paints a single still, sparse field.
 */

type Mote = {
  x: number;
  y: number;
  z: number; // 0.3..1 — depth: nearer motes are larger + drift faster
  vx: number;
  vy: number;
  ph: number; // twinkle phase
  seed: number;
};

// practical light sources, as fractions of the section — motes brighten near these
const LIGHTS: { x: number; y: number; r: number; warm: boolean }[] = [
  { x: 0.37, y: 0.72, r: 0.2, warm: true }, // left lamp
  { x: 0.82, y: 0.68, r: 0.18, warm: true }, // right lamp
  { x: 0.55, y: 0.44, r: 0.22, warm: false }, // lens / convergence glow
];

function rand(s: number) {
  const t = Math.sin(s * 12.9898) * 43758.5453;
  return t - Math.floor(t);
}

export function HeroAtmosphere() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const motes: Mote[] = [];
    const COUNT = 220;

    const build = () => {
      motes.length = 0;
      for (let i = 0; i < COUNT; i++) {
        const z = 0.3 + rand(i * 1.7) * 0.7;
        motes.push({
          x: rand(i * 2.3) * w,
          y: rand(i * 3.9) * h,
          z,
          vx: (rand(i * 5.1) - 0.5) * 0.12 * z,
          vy: (-0.05 - rand(i * 6.7) * 0.14) * z, // drift gently upward
          ph: rand(i * 8.3) * Math.PI * 2,
          seed: i * 0.6180339,
        });
      }
    };

    // how strongly a point is lit by the practical sources (0..~1)
    const litness = (fx: number, fy: number) => {
      let l = 0;
      for (const s of LIGHTS) {
        const dx = fx - s.x;
        const dy = fy - s.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        l += Math.max(0, 1 - d / s.r) * (s.warm ? 1 : 0.7);
      }
      return Math.min(l, 1.3);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const m of motes) {
        if (!reduced) {
          m.x += m.vx;
          m.y += m.vy;
          if (m.y < -8) {
            m.y = h + 8;
            m.x = rand(m.seed + t * 0.0001) * w;
          }
          if (m.x < -8) m.x = w + 8;
          else if (m.x > w + 8) m.x = -8;
        }
        const lit = litness(m.x / w, m.y / h);
        if (lit <= 0.02) continue; // dust only shows where light lands
        const tw = 0.6 + 0.4 * Math.sin(t * 0.0011 + m.ph);
        const a = Math.min(0.5, lit * 0.34 * tw) * m.z;
        const size = (0.5 + m.z * 1.7) * (0.8 + lit * 0.5);
        // warm dust, a touch cooler in the lens glow
        const warm = litness(m.x / w, m.y / h);
        const g = 232 - Math.round((1 - Math.min(warm, 1)) * 8);
        ctx.fillStyle = `rgba(255,${g},${196 + Math.round(m.z * 30)},${a})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
      if (reduced) draw(0);
    };

    let raf = 0;
    const loop = (t: number) => {
      draw(t);
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
  }, [reduced]);

  return <canvas ref={ref} className="hero-atmosphere" aria-hidden="true" />;
}
