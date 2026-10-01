"use client";

import { useEffect, useRef } from "react";
import { getParticleCount } from "@/utils/getParticleCount";
import styles from "./ParticleField.module.scss";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  accent: boolean;
};

const LINK_DISTANCE = 96;
const POINTER_RADIUS = 140;
const MAX_SPEED = 0.35;
const ACCENT_RATIO = 0.14;

function createParticle(width: number, height: number): Particle {
  const accent = Math.random() < ACCENT_RATIO;

  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * MAX_SPEED * 2,
    vy: (Math.random() - 0.5) * MAX_SPEED * 2,
    radius: accent ? 1.8 + Math.random() * 1.4 : 0.8 + Math.random() * 1.1,
    accent,
  };
}

function readToken(element: Element, name: string, fallback: string) {
  return getComputedStyle(element).getPropertyValue(name).trim() || fallback;
}

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const accentColor = readToken(canvas, "--brand-red", "#ce101a");
    const baseColor = readToken(canvas, "--brand-silver", "#cbcac8");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let frameId = 0;
    let visible = true;
    const pointer = { x: 0, y: 0, active: false };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = getParticleCount(width, height);
      particles = particles.slice(0, count);
      while (particles.length < count) particles.push(createParticle(width, height));
      particles.forEach((p) => {
        p.x = Math.min(p.x, width);
        p.y = Math.min(p.y, height);
      });
    };

    const update = () => {
      for (const p of particles) {
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance > 0 && distance < POINTER_RADIUS * 0.45) {
            const force = (1 - distance / (POINTER_RADIUS * 0.45)) * 0.6;
            p.x += (dx / distance) * force;
            p.y += (dy / distance) * force;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        p.x = Math.max(0, Math.min(width, p.x));
        p.y = Math.max(0, Math.min(height, p.y));
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 0.6;
      ctx.strokeStyle = baseColor;

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance < LINK_DISTANCE) {
            ctx.globalAlpha = (1 - distance / LINK_DISTANCE) * 0.28;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      if (pointer.active) {
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 0.8;
        for (const p of particles) {
          const distance = Math.hypot(p.x - pointer.x, p.y - pointer.y);
          if (distance < POINTER_RADIUS) {
            ctx.globalAlpha = (1 - distance / POINTER_RADIUS) * 0.7;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        ctx.globalAlpha = p.accent ? 0.95 : 0.6;
        ctx.fillStyle = p.accent ? accentColor : baseColor;
        ctx.shadowColor = p.accent ? accentColor : "transparent";
        ctx.shadowBlur = p.accent ? 10 : 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      update();
      draw();
      frameId = requestAnimationFrame(loop);
    };

    const stop = () => {
      cancelAnimationFrame(frameId);
      frameId = 0;
    };

    const start = () => {
      if (frameId || reducedMotion.matches || !visible || document.hidden) return;
      frameId = requestAnimationFrame(loop);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
      if (!frameId) draw();
    };

    const onPointerLeave = () => {
      pointer.active = false;
      if (!frameId) draw();
    };

    const onVisibilityChange = () => (document.hidden ? stop() : start());

    const onMotionChange = () => {
      stop();
      draw();
      start();
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw();
    });

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });

    resize();
    draw();
    start();

    resizeObserver.observe(canvas);
    intersectionObserver.observe(canvas);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibilityChange);
    reducedMotion.addEventListener("change", onMotionChange);

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      reducedMotion.removeEventListener("change", onMotionChange);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
