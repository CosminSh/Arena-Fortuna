import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  baseAlpha: number;
  alpha: number;
  alphaPulse: number;
  color: string;
  wobbleSpeed: number;
  wobbleOffset: number;
}

export const BackgroundParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    const colors = [
      '#f59e0b', // Amber Gold
      '#fbbf24', // Bright Gold
      '#ef4444', // Crimson Ember
      '#f97316', // Orange Flame
      '#fef3c7', // Warm White Spark
    ];

    const particleCount = Math.min(60, Math.floor((width * height) / 22000));
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.8 + 0.8,
        speedY: -(0.25 + Math.random() * 0.65),
        speedX: (Math.random() - 0.5) * 0.35,
        baseAlpha: 0.2 + Math.random() * 0.6,
        alpha: 0.2 + Math.random() * 0.6,
        alphaPulse: 0.006 + Math.random() * 0.015,
        color: colors[Math.floor(Math.random() * colors.length)],
        wobbleSpeed: 0.01 + Math.random() * 0.02,
        wobbleOffset: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.y += p.speedY;
        p.x += p.speedX + Math.sin(time * p.wobbleSpeed + p.wobbleOffset) * 0.3;

        p.alpha += Math.sin(time * p.alphaPulse) * 0.006;
        if (p.alpha < 0.1) p.alpha = 0.1;
        if (p.alpha > p.baseAlpha) p.alpha = p.baseAlpha;

        // Subtle interactive mouse float reaction
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          p.x += (dx / dist) * force * 1.4;
          p.y += (dy / dist) * force * 1.4;
        }

        if (p.y < -10 || p.x < -10 || p.x > width + 10) {
          p.y = height + Math.random() * 15;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.size > 2 ? 8 : 4;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

export default BackgroundParticles;
