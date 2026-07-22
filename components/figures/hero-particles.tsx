"use client";

import { useEffect, useRef } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * THE INTAKE STREAM — one continuous, never-ending fluid flow, on a single
 * <canvas> (no CSS dots, no static cloud).
 *
 * Every particle lives one loop of the whole metaphor:
 *   spawn far left (chaotic, wide cone)
 *     → accelerate toward the lens, compressing onto the optical aperture
 *       → pass through the glass (the transition point)
 *         → emerge ORDERED, a clean ray
 *           → travel to the single red verdict point, reddening + brightening
 *             → resolve there, and respawn on the left.
 *
 * Thousands of these run at once and the stream never stops. Additive blending
 * ('lighter') gives the light-through-glass read. Respects reduced-motion by
 * painting a single settled frame of the same flow.
 *
 * All positions are fractions (0–1) of the stage: `focal` = the lens aperture,
 * `red` = the verdict point.
 */

type P = {
  x: number;
  y: number;
  seed: number;
  phase: 0 | 1; // 0 = intake (chaotic → compressing), 1 = resolved (ordered → red)
  ray: number; // aperture offset ∈ [-0.5, 0.5] — which ordered ray it becomes
  sz: number;
};

function rand(seed: number) {
  const t = Math.sin(seed * 12.9898) * 43758.5453;
  return t - Math.floor(t);
}

export function HeroParticles({
  focalX = 0.5,
  focalY = 0.44,
  redX = 0.85,
  redY = 0.44,
  count = 1500,
  reach = 0.6,
}: {
  focalX?: number;
  focalY?: number;
  redX?: number;
  redY?: number;
  count?: number;
  /** how far back (fraction of the larger dim) the chaotic intake spawns */
  reach?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const parts: P[] = [];
    const SPREAD = 0.6; // intake cone half-angle (radians)

    const geom = () => ({
      fx: w * focalX,
      fy: h * focalY,
      rx: w * redX,
      ry: h * redY,
      apH: h * 0.05, // half-height of the compressed aperture
      maxR: Math.max(w, h) * reach,
    });

    const spawnIntake = (p: P, seedShift: number) => {
      const { fx, fy, maxR } = geom();
      const s = p.seed + seedShift;
      const a = Math.PI + (rand(s * 3.1 + 1) - 0.5) * 2 * SPREAD;
      const r = (0.12 + Math.pow(rand(s * 1.7), 1.4) * 0.88) * maxR + 30;
      p.x = fx + Math.cos(a) * r;
      p.y = fy + Math.sin(a) * r * 0.72 + (rand(s * 7.7) - 0.5) * h * 0.05;
      p.ray = rand(s * 5.3) - 0.5;
      p.phase = 0;
      p.sz = 0.6 + rand(s * 9.1) * 1.5;
    };

    // place a particle mid-flight along its ordered ray (initial population)
    const placeBeam = (p: P, t: number) => {
      const { fx, fy, rx, ry, apH } = geom();
      const ay = fy + p.ray * apH;
      p.phase = 1;
      p.x = fx + (rx - fx) * t;
      p.y = ay + (ry - ay) * t;
    };

    const build = () => {
      parts.length = 0;
      for (let i = 0; i < count; i++) {
        const p: P = { x: 0, y: 0, seed: i * 0.6180339 + 0.123, phase: 0, ray: 0, sz: 1 };
        spawnIntake(p, i * 0.01);
        // seed ~38% already resolved & distributed along the ordered rays so the
        // whole path is populated from the first frame
        if (rand(p.seed * 2.2) < 0.38) placeBeam(p, rand(p.seed * 4.4));
        parts.push(p);
      }
    };

    const step = (p: P, t: number) => {
      const { fx, fy, rx, ry, apH, maxR } = geom();
      if (p.phase === 0) {
        const ty = fy + p.ray * apH;
        const dx = fx - p.x;
        const dy = ty - p.y;
        const dist = Math.hypot(dx, dy) || 0.001;
        const nx = dx / dist;
        const ny = dy / dist;
        const prox = 1 - Math.min(dist / maxR, 1);
        const speed = 0.5 + Math.pow(prox, 1.7) * 5.6;
        // one coherent low-frequency curl field, damped hard toward the lens →
        // chaos far out, smooth compression as it nears the aperture
        const damp = (1 - prox) * (1 - prox);
        const turb = Math.sin(p.x * 0.006 + p.y * 0.004 + t * 0.00045) * 1.7 * damp;
        p.x += nx * speed - ny * turb;
        p.y += ny * speed + nx * turb;
        if (p.x >= fx - 1) {
          p.phase = 1;
          p.x = fx;
          p.y = ty;
        }
      } else {
        const dx = rx - p.x;
        const dy = ry - p.y;
        const dist = Math.hypot(dx, dy) || 0.001;
        const t01 = Math.min(Math.max((p.x - fx) / (rx - fx || 1), 0), 1);
        const speed = 1.5 + t01 * 3.8; // ordered, accelerating to the verdict
        p.x += (dx / dist) * speed;
        p.y += (dy / dist) * speed;
        if (p.x >= rx - 1 || dist < 3) spawnIntake(p, 137.3 + t * 0.0003);
      }
    };

    const draw = (p: P) => {
      const { fx, fy, rx, ry, maxR } = geom();
      if (p.phase === 0) {
        const dx = fx - p.x;
        const dy = fy + p.ray * (h * 0.05) - p.y;
        const dist = Math.hypot(dx, dy) || 0.001;
        const prox = 1 - Math.min(dist / maxR, 1);
        const nx = dx / dist;
        const ny = dy / dist;
        const alpha = 0.12 + prox * 0.8;
        const col = `rgba(255,${232 + Math.round(prox * 20)},${208 + Math.round(prox * 42)},${alpha})`;
        if (prox > 0.5) {
          const len = 3 + prox * prox * 20;
          ctx.strokeStyle = col;
          ctx.lineWidth = Math.max(0.5, p.sz * (1.1 - prox * 0.5));
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + nx * len, p.y + ny * len);
          ctx.stroke();
        } else {
          const sz = p.sz * (0.7 + prox * 0.9);
          ctx.fillStyle = col;
          ctx.fillRect(p.x - sz / 2, p.y - sz / 2, sz, sz);
        }
      } else {
        const t01 = Math.min(Math.max((p.x - fx) / (rx - fx || 1), 0), 1);
        const dx = rx - p.x;
        const dy = ry - p.y;
        const d = Math.hypot(dx, dy) || 0.001;
        const nx = dx / d;
        const ny = dy / d;
        const len = 4 + t01 * 10;
        const alpha = 0.3 + t01 * 0.6;
        // whiten near the glass → redden into the verdict point
        const g = Math.round(232 - t01 * 150);
        const b = Math.round(210 - t01 * 170);
        const ex = p.x + nx * len;
        const ey = p.y + ny * len;
        // faint chromatic split just past the glass (refraction)
        if (t01 < 0.3) {
          const cf = (0.3 - t01) * 6;
          ctx.lineWidth = 0.8;
          ctx.strokeStyle = `rgba(90,200,220,${alpha * 0.35})`;
          ctx.beginPath();
          ctx.moveTo(p.x - ny * cf, p.y + nx * cf);
          ctx.lineTo(ex - ny * cf, ey + nx * cf);
          ctx.stroke();
        }
        ctx.strokeStyle = `rgba(255,${g},${b},${alpha})`;
        ctx.lineWidth = Math.max(0.6, 1.4 - t01 * 0.6);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(ex, ey);
        ctx.stroke();
      }
    };

    const drawFrame = (t: number) => {
      const { fx, fy, rx, ry } = geom();
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      // compression bloom at the lens aperture
      const bR = Math.max(w, h) * 0.15;
      const b1 = ctx.createRadialGradient(fx, fy, 0, fx, fy, bR);
      b1.addColorStop(0, "rgba(255,250,238,0.6)");
      b1.addColorStop(0.16, "rgba(255,224,168,0.26)");
      b1.addColorStop(0.5, "rgba(214,150,80,0.06)");
      b1.addColorStop(1, "rgba(214,150,80,0)");
      ctx.fillStyle = b1;
      ctx.beginPath();
      ctx.arc(fx, fy, bR, 0, Math.PI * 2);
      ctx.fill();

      if (!reduced) for (const p of parts) step(p, t);
      for (const p of parts) draw(p);

      // soft bloom at the red verdict point (the particles resolve here)
      const rR = Math.max(w, h) * 0.05;
      const b2 = ctx.createRadialGradient(rx, ry, 0, rx, ry, rR);
      b2.addColorStop(0, "rgba(255,90,58,0.5)");
      b2.addColorStop(0.4, "rgba(255,60,40,0.14)");
      b2.addColorStop(1, "rgba(255,60,40,0)");
      ctx.fillStyle = b2;
      ctx.beginPath();
      ctx.arc(rx, ry, rR, 0, Math.PI * 2);
      ctx.fill();

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
      if (reduced) {
        // settle the flow, then hold a single frame
        for (let i = 0; i < 220; i++) for (const p of parts) step(p, i * 16);
        drawFrame(0);
      }
    };

    let raf = 0;
    const loop = (t: number) => {
      drawFrame(t);
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
  }, [reduced, focalX, focalY, redX, redY, count, reach]);

  return <canvas ref={canvasRef} className="hs-canvas" aria-hidden="true" />;
}
