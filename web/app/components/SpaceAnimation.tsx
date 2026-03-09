"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  brightness: number;
  twinkleSpeed: number;
  twinklePhase: number;
  driftX: number;
  driftY: number;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function SpaceAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Star host position (upper-right quadrant)
    const STAR_X_FRAC = 0.72;
    const STAR_Y_FRAC = 0.30;

    // Transit timing
    const TRANSIT_DURATION = 12000; // ms
    const PAUSE_DURATION = 4000;    // ms

    // Stars
    const NUM_STARS = 220;
    const stars: Star[] = Array.from({ length: NUM_STARS }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 1.5 + 0.3,
      brightness: Math.random() * 0.5 + 0.3,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinklePhase: Math.random() * Math.PI * 2,
      driftX: (Math.random() - 0.5) * 0.00004,
      driftY: (Math.random() - 0.5) * 0.00002,
    }));

    let rafId: number;
    let frameCount = 0;
    let lastTime = 0;
    let transitTimer = 0;
    let phase: "transit" | "pause" = "transit";

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.scale(dpr, dpr);
    }

    function draw(timestamp: number) {
      const delta = lastTime === 0 ? 16 : timestamp - lastTime;
      lastTime = timestamp;
      frameCount++;

      // Advance transit timer
      transitTimer += delta;
      let transitProgress = 0;

      if (phase === "transit") {
        transitProgress = Math.min(transitTimer / TRANSIT_DURATION, 1);
        if (transitTimer >= TRANSIT_DURATION) {
          phase = "pause";
          transitTimer = 0;
        }
      } else {
        transitProgress = 1;
        if (transitTimer >= PAUSE_DURATION) {
          phase = "transit";
          transitTimer = 0;
        }
      }

      const W = canvas!.offsetWidth;
      const H = canvas!.offsetHeight;

      // Logical star position
      const starX = W * STAR_X_FRAC;
      const starY = H * STAR_Y_FRAC;
      const starRadius = Math.min(W, H) * 0.055;

      // Exoplanet position
      const easedProgress = easeInOutCubic(phase === "pause" ? 1 : transitProgress);
      const planetStartX = starX - starRadius * 3.5;
      const planetEndX = starX + starRadius * 3.5;
      const planetX = planetStartX + (planetEndX - planetStartX) * easedProgress;
      const planetY = starY + starRadius * 0.05;
      const planetRadius = starRadius * 0.28;

      // Compute star brightness dip (12% max dip when planet center over star center)
      const distToStar = Math.abs(planetX - starX);
      const overlapFrac = Math.max(0, 1 - distToStar / starRadius);
      const starBrightness = 1 - overlapFrac * 0.12;

      ctx!.clearRect(0, 0, W, H);

      // ── 1. Background ──────────────────────────────────────────
      const bgGrad = ctx!.createRadialGradient(starX, starY, 0, starX, starY, W * 0.8);
      bgGrad.addColorStop(0, `rgba(8,16,38,${starBrightness})`);
      bgGrad.addColorStop(0.4, "rgba(3,6,18,1)");
      bgGrad.addColorStop(1, "rgba(1,2,8,1)");
      ctx!.fillStyle = bgGrad;
      ctx!.fillRect(0, 0, W, H);

      // ── 2. Starfield ───────────────────────────────────────────
      for (const star of stars) {
        // Drift
        star.x = (star.x + star.driftX + 1) % 1;
        star.y = (star.y + star.driftY + 1) % 1;

        const sx = star.x * W;
        const sy = star.y * H;

        // Twinkle
        const twinkle = 0.6 + 0.4 * Math.sin(frameCount * star.twinkleSpeed + star.twinklePhase);
        const alpha = star.brightness * twinkle * starBrightness;

        ctx!.beginPath();
        ctx!.arc(sx, sy, star.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(220,235,255,${alpha})`;
        ctx!.fill();
      }

      // ── 3. Host star glow layers ───────────────────────────────
      const sb = starBrightness;

      // Outer glow (large, soft)
      const glow1 = ctx!.createRadialGradient(starX, starY, 0, starX, starY, starRadius * 6);
      glow1.addColorStop(0, `rgba(255,220,140,${0.18 * sb})`);
      glow1.addColorStop(0.3, `rgba(255,180,80,${0.10 * sb})`);
      glow1.addColorStop(1, "rgba(255,160,60,0)");
      ctx!.fillStyle = glow1;
      ctx!.beginPath();
      ctx!.arc(starX, starY, starRadius * 6, 0, Math.PI * 2);
      ctx!.fill();

      // Mid glow
      const glow2 = ctx!.createRadialGradient(starX, starY, 0, starX, starY, starRadius * 2.5);
      glow2.addColorStop(0, `rgba(255,235,160,${0.45 * sb})`);
      glow2.addColorStop(0.5, `rgba(255,200,100,${0.20 * sb})`);
      glow2.addColorStop(1, "rgba(255,180,80,0)");
      ctx!.fillStyle = glow2;
      ctx!.beginPath();
      ctx!.arc(starX, starY, starRadius * 2.5, 0, Math.PI * 2);
      ctx!.fill();

      // Inner core glow
      const glow3 = ctx!.createRadialGradient(starX, starY, 0, starX, starY, starRadius * 1.1);
      glow3.addColorStop(0, `rgba(255,255,240,${0.95 * sb})`);
      glow3.addColorStop(0.5, `rgba(255,240,180,${0.75 * sb})`);
      glow3.addColorStop(1, `rgba(255,210,100,${0.30 * sb})`);
      ctx!.fillStyle = glow3;
      ctx!.beginPath();
      ctx!.arc(starX, starY, starRadius * 1.1, 0, Math.PI * 2);
      ctx!.fill();

      // Solid star disk
      const diskGrad = ctx!.createRadialGradient(
        starX - starRadius * 0.2, starY - starRadius * 0.2, 0,
        starX, starY, starRadius
      );
      diskGrad.addColorStop(0, `rgba(255,255,250,${sb})`);
      diskGrad.addColorStop(0.6, `rgba(255,235,150,${0.95 * sb})`);
      diskGrad.addColorStop(1, `rgba(255,180,60,${0.85 * sb})`);
      ctx!.fillStyle = diskGrad;
      ctx!.beginPath();
      ctx!.arc(starX, starY, starRadius, 0, Math.PI * 2);
      ctx!.fill();

      // Lens flare — 4-point cross spikes
      const flareAlpha = 0.35 * sb;
      const spikeLen = starRadius * 4.5;
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 2) {
        const grad = ctx!.createLinearGradient(
          starX, starY,
          starX + Math.cos(angle) * spikeLen,
          starY + Math.sin(angle) * spikeLen
        );
        grad.addColorStop(0, `rgba(255,245,200,${flareAlpha})`);
        grad.addColorStop(0.3, `rgba(255,230,150,${flareAlpha * 0.4})`);
        grad.addColorStop(1, "rgba(255,220,100,0)");
        ctx!.strokeStyle = grad;
        ctx!.lineWidth = 1.5;
        ctx!.beginPath();
        ctx!.moveTo(starX, starY);
        ctx!.lineTo(
          starX + Math.cos(angle) * spikeLen,
          starY + Math.sin(angle) * spikeLen
        );
        ctx!.stroke();
      }

      // Secondary blue lens flare blob
      const flareOffX = starX - starRadius * 2.2;
      const flareOffY = starY + starRadius * 1.2;
      const blueFlare = ctx!.createRadialGradient(flareOffX, flareOffY, 0, flareOffX, flareOffY, starRadius * 0.8);
      blueFlare.addColorStop(0, `rgba(100,160,255,${0.22 * sb})`);
      blueFlare.addColorStop(1, "rgba(80,140,255,0)");
      ctx!.fillStyle = blueFlare;
      ctx!.beginPath();
      ctx!.arc(flareOffX, flareOffY, starRadius * 0.8, 0, Math.PI * 2);
      ctx!.fill();

      // ── 4. Exoplanet disk (on top of star) ────────────────────
      ctx!.beginPath();
      ctx!.arc(planetX, planetY, planetRadius, 0, Math.PI * 2);
      ctx!.fillStyle = "rgba(4,8,20,0.95)";
      ctx!.fill();

      // Planet rim (thin atmosphere ring)
      const rimGrad = ctx!.createRadialGradient(
        planetX, planetY, planetRadius * 0.85,
        planetX, planetY, planetRadius * 1.08
      );
      rimGrad.addColorStop(0, "rgba(60,100,180,0)");
      rimGrad.addColorStop(0.6, "rgba(80,140,220,0.15)");
      rimGrad.addColorStop(1, "rgba(100,160,255,0)");
      ctx!.fillStyle = rimGrad;
      ctx!.beginPath();
      ctx!.arc(planetX, planetY, planetRadius * 1.08, 0, Math.PI * 2);
      ctx!.fill();

      // ── 5. Planet horizon (drawn last) ────────────────────────
      const horizonR = H * 1.6;
      const horizonCX = W * 0.5;
      const horizonCY = H + horizonR - H * 0.28;

      // Atmospheric limb glow (multi-layer)
      const atmGlow1 = ctx!.createRadialGradient(
        horizonCX, horizonCY, horizonR - H * 0.12,
        horizonCX, horizonCY, horizonR + H * 0.04
      );
      atmGlow1.addColorStop(0, `rgba(30,80,180,${0.55 * sb})`);
      atmGlow1.addColorStop(0.4, `rgba(50,120,220,${0.30 * sb})`);
      atmGlow1.addColorStop(0.75, `rgba(60,140,240,${0.12 * sb})`);
      atmGlow1.addColorStop(1, "rgba(40,100,200,0)");

      ctx!.save();
      ctx!.beginPath();
      ctx!.arc(horizonCX, horizonCY, horizonR + H * 0.04, 0, Math.PI * 2);
      ctx!.arc(horizonCX, horizonCY, Math.max(0, horizonR - H * 0.14), 0, Math.PI * 2, true);
      ctx!.fillStyle = atmGlow1;
      ctx!.fill("evenodd");
      ctx!.restore();

      // Planet surface (solid dark circle covering bottom)
      const surfaceGrad = ctx!.createRadialGradient(
        horizonCX, horizonCY - horizonR * 0.1, horizonR * 0.5,
        horizonCX, horizonCY, horizonR
      );
      surfaceGrad.addColorStop(0, "rgba(8,14,35,1)");
      surfaceGrad.addColorStop(0.7, "rgba(5,10,25,1)");
      surfaceGrad.addColorStop(1, "rgba(3,7,18,1)");
      ctx!.beginPath();
      ctx!.arc(horizonCX, horizonCY, horizonR - H * 0.02, 0, Math.PI * 2);
      ctx!.fillStyle = surfaceGrad;
      ctx!.fill();

      // Horizon edge glow line
      const edgeGlow = ctx!.createRadialGradient(
        horizonCX, horizonCY, horizonR - H * 0.025,
        horizonCX, horizonCY, horizonR + H * 0.015
      );
      edgeGlow.addColorStop(0, `rgba(40,100,220,${0.70 * sb})`);
      edgeGlow.addColorStop(0.5, `rgba(70,140,255,${0.45 * sb})`);
      edgeGlow.addColorStop(1, "rgba(50,120,230,0)");

      ctx!.save();
      ctx!.beginPath();
      ctx!.arc(horizonCX, horizonCY, horizonR + H * 0.015, 0, Math.PI * 2);
      ctx!.arc(horizonCX, horizonCY, Math.max(0, horizonR - H * 0.03), 0, Math.PI * 2, true);
      ctx!.fillStyle = edgeGlow;
      ctx!.fill("evenodd");
      ctx!.restore();

      // Purple-blue haze gradient over bottom 35%
      const hazeGrad = ctx!.createLinearGradient(0, H * 0.65, 0, H);
      hazeGrad.addColorStop(0, "rgba(20,30,80,0)");
      hazeGrad.addColorStop(0.3, `rgba(15,25,70,${0.55 * sb})`);
      hazeGrad.addColorStop(0.7, `rgba(10,18,55,${0.80 * sb})`);
      hazeGrad.addColorStop(1, "rgba(5,10,30,0.95)");
      ctx!.fillStyle = hazeGrad;
      ctx!.fillRect(0, H * 0.65, W, H * 0.35);

      rafId = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
}
