"use client";

import { useRef, useEffect, useCallback, memo } from "react";

interface Sphere {
  x: number;
  y: number;
  r: number;
  z: number;
  vx: number;
  vy: number;
  phase: number;
  connections: number[];
  label: string;
}

const CONFIGS_DESKTOP = [
  [4, 28, 40, 0.75, 1.0],
  [5, 18, 28, 0.45, 0.75],
  [6, 10, 18, 0.15, 0.45],
  [4, 6, 12, 0.0, 0.15],
] as const;

const CONFIGS_MOBILE = [
  [3, 18, 28, 0.75, 1.0],
  [3, 12, 18, 0.4, 0.75],
  [4, 7, 12, 0.1, 0.4],
] as const;

const DRUG_NAMES = [
  "Аспирин",
  "Варфарин",
  "Метформин",
  "Парацетамол",
  "Ибупрофен",
  "Амоксициллин",
  "Омепразол",
  "Аторвастатин",
  "Амлодипин",
  "Диклофенак",
  "Лизиноприл",
  "Метопролол",
  "Симвастатин",
  "Цетиризин",
  "Азитромицин",
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function drawGlassSphere(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  z: number,
  now: number,
  phase: number,
  mobile: boolean,
  label: string
) {
  const baseOpacity = lerp(0.18, 0.72, z);

  if (z > 0.35) {
    ctx.save();
    ctx.globalAlpha = baseOpacity * 0.14;
    ctx.beginPath();
    ctx.ellipse(
      x + r * 0.12,
      y + r * 0.18,
      r * 0.85,
      r * 0.28,
      0,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = "rgba(100,120,200,0.35)";
    ctx.fill();
    ctx.restore();
  }

  const grad = ctx.createRadialGradient(
    x - r * 0.28,
    y - r * 0.32,
    r * 0.05,
    x,
    y,
    r
  );
  grad.addColorStop(0, `rgba(255,255,255,${baseOpacity * 0.96})`);
  grad.addColorStop(0.2, `rgba(240,246,255,${baseOpacity * 0.82})`);
  grad.addColorStop(0.5, `rgba(210,228,252,${baseOpacity * 0.6})`);
  grad.addColorStop(0.8, `rgba(185,210,248,${baseOpacity * 0.5})`);
  grad.addColorStop(1, `rgba(160,195,242,${baseOpacity * 0.65})`);

  ctx.save();
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.strokeStyle = `rgba(180,210,250,${baseOpacity * 0.55})`;
  ctx.lineWidth = Math.max(0.5, r * 0.04);
  ctx.stroke();
  ctx.restore();

  if (!mobile && z > 0.25 && r > 10) {
    const rimGrad = ctx.createRadialGradient(x, y, r * 0.7, x, y, r * 0.98);
    rimGrad.addColorStop(0, "rgba(200,220,255,0.00)");
    rimGrad.addColorStop(0.6, `rgba(200,220,255,${baseOpacity * 0.15})`);
    rimGrad.addColorStop(1, `rgba(160,195,255,${baseOpacity * 0.38})`);
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = rimGrad;
    ctx.fill();
    ctx.restore();
  }

  const hlR = r * lerp(0.28, 0.4, z);
  const hlGrad = ctx.createRadialGradient(
    x - r * 0.3,
    y - r * 0.34,
    0,
    x - r * 0.3,
    y - r * 0.34,
    hlR
  );
  hlGrad.addColorStop(0, `rgba(255,255,255,${baseOpacity * 1.0})`);
  hlGrad.addColorStop(0.45, `rgba(255,255,255,${baseOpacity * 0.5})`);
  hlGrad.addColorStop(1, "rgba(255,255,255,0.00)");
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.clip();
  ctx.beginPath();
  ctx.arc(x - r * 0.3, y - r * 0.34, hlR, 0, Math.PI * 2);
  ctx.fillStyle = hlGrad;
  ctx.fill();
  ctx.restore();

  if (!mobile && z > 0.4 && r > 14) {
    const hl2R = r * 0.13;
    const hl2Grad = ctx.createRadialGradient(
      x + r * 0.42,
      y + r * 0.38,
      0,
      x + r * 0.42,
      y + r * 0.38,
      hl2R
    );
    hl2Grad.addColorStop(0, `rgba(255,255,255,${baseOpacity * 0.5})`);
    hl2Grad.addColorStop(1, "rgba(255,255,255,0.00)");
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.clip();
    ctx.beginPath();
    ctx.arc(x + r * 0.42, y + r * 0.38, hl2R, 0, Math.PI * 2);
    ctx.fillStyle = hl2Grad;
    ctx.fill();
    ctx.restore();
  }

  if (!mobile && z > 0.72) {
    const ringPulse = 0.5 + 0.5 * Math.sin(now * 0.0008 + phase);
    ctx.save();
    ctx.globalAlpha = baseOpacity * 0.1 * ringPulse;
    ctx.beginPath();
    ctx.arc(x, y, r * (1.15 + ringPulse * 0.12), 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(160,195,255,0.8)";
    ctx.lineWidth = 1.0;
    ctx.stroke();
    ctx.restore();
  }

  // Эмийн нэр зурах
  if (r > 14 && z > 0.3) {
    const fontSize = Math.max(7, Math.min(r * 0.28, 10));
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r * 0.92, 0, Math.PI * 2);
    ctx.clip();

    ctx.font = `700 ${fontSize}px Inter, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.globalAlpha = Math.min(baseOpacity * 1.8, 0.9);
    ctx.shadowColor = "rgba(255, 255, 255, 0.9)";
    ctx.shadowBlur = 4;
    ctx.fillStyle = `rgba(171, 182, 214, 0.9)`;
    ctx.fillText(label, x, y, r * 1.7);

    ctx.restore();
  }
}

function drawConnection(
  ctx: CanvasRenderingContext2D,
  ax: number,
  ay: number,
  az: number,
  bx: number,
  by: number,
  bz: number
) {
  const dx = bx - ax,
    dy = by - ay;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist > 260) return;
  const avgZ = (az + bz) / 2;
  const fade = (1 - dist / 260) * lerp(0.1, 0.4, avgZ);
  const grad = ctx.createLinearGradient(ax, ay, bx, by);
  grad.addColorStop(0, `rgba(180,205,245,${fade})`);
  grad.addColorStop(0.5, `rgba(210,225,255,${fade * 1.2})`);
  grad.addColorStop(1, `rgba(180,205,245,${fade})`);
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(bx, by);
  ctx.strokeStyle = grad;
  ctx.lineWidth = lerp(0.4, 1.6, avgZ);
  ctx.stroke();
  ctx.restore();
}

const MoleculeBackground = memo(function MoleculeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spheresRef = useRef<Sphere[]>([]);
  const rafRef = useRef<number>(0);
  const initializedRef = useRef(false);
  const mobileRef = useRef(false);

  const initSpheres = useCallback((w: number, h: number) => {
    const mobile = w < 768;
    mobileRef.current = mobile;
    const configs = mobile ? CONFIGS_MOBILE : CONFIGS_DESKTOP;
    const spheres: Sphere[] = [];

    configs.forEach(([count, rMin, rMax, zMin, zMax]) => {
      for (let i = 0; i < count; i++) {
        const z = zMin + Math.random() * (zMax - zMin);
        const r = rMin + Math.random() * (rMax - rMin);
        let x: number, y: number;
        if (z > 0.65 && i < 2) {
          const edgeInset = mobile ? 0.05 : 0.02;
          const edgeSpan = mobile ? 0.18 : 0.22;
          x =
            i === 0
              ? w * edgeInset + Math.random() * w * edgeSpan
              : w * (1 - edgeInset - edgeSpan) + Math.random() * w * edgeSpan;
          y = h * 0.05 + Math.random() * h * 0.9;
        } else {
          x = w * 0.04 + Math.random() * w * 0.92;
          y = h * 0.04 + Math.random() * h * 0.92;
        }
        const speed = (1 - z + 0.1) * 0.08 * (mobile ? 0.5 : 1.0);
        spheres.push({
          x,
          y,
          r,
          z,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed * 0.65,
          phase: Math.random() * Math.PI * 2,
          connections: [],
          label: DRUG_NAMES[spheres.length % DRUG_NAMES.length],
        });
      }
    });

    const maxDist = mobile ? 200 : 230;
    for (let i = 0; i < spheres.length; i++) {
      for (let j = i + 1; j < spheres.length; j++) {
        const a = spheres[i],
          b = spheres[j];
        const dx = a.x - b.x,
          dy = a.y - b.y;
        if (
          Math.sqrt(dx * dx + dy * dy) < maxDist &&
          Math.abs(a.z - b.z) < 0.42
        ) {
          a.connections.push(j);
        }
      }
    }
    spheresRef.current = spheres;
  }, []);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const dpr = window.devicePixelRatio || 1;
    const w = parent.offsetWidth;
    const h = parent.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
    if (!initializedRef.current) {
      initSpheres(w, h);
      initializedRef.current = true;
    }
  }, [initSpheres]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    const now = performance.now();
    const spheres = spheresRef.current;
    const mobile = mobileRef.current;

    ctx.clearRect(0, 0, w, h);

    const margin = 80;
    for (const s of spheres) {
      s.x += s.vx;
      s.y += s.vy;
      if (s.x < -margin) s.x = w + margin;
      else if (s.x > w + margin) s.x = -margin;
      if (s.y < -margin) s.y = h + margin;
      else if (s.y > h + margin) s.y = -margin;
    }

    const sorted = [...spheres].sort((a, b) => a.z - b.z);

    for (const s of sorted) {
      for (const ci of s.connections) {
        const t = spheres[ci];
        if (!t) continue;
        drawConnection(ctx, s.x, s.y, s.z, t.x, t.y, t.z);
      }
    }
    for (const s of sorted) {
      drawGlassSphere(ctx, s.x, s.y, s.r, s.z, now, s.phase, mobile, s.label);
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) cancelAnimationFrame(rafRef.current);
      else rafRef.current = requestAnimationFrame(animate);
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [animate]);

  useEffect(() => {
    resize();
    rafRef.current = requestAnimationFrame(animate);
    const observer = new ResizeObserver(resize);
    const parent = canvasRef.current?.parentElement;
    if (parent) observer.observe(parent);
    return () => {
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, [resize, animate]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden select-none z-0">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 30%, #ffffff 0%, #eef4ff 35%, #dce8fb 70%, #cddaf5 100%)",
        }}
      />
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white/80" />
    </div>
  );
});

export default MoleculeBackground;
