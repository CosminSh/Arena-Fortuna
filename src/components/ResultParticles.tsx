import React, { useEffect, useRef } from 'react';

interface ResultParticlesProps {
  isVictory: boolean;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  alpha: number;
  maxAlpha: number;
  decay: number;
  spin: number;
  rotation: number;
}

export const ResultParticles: React.FC<ResultParticlesProps> = ({ isVictory }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    const victoryColors = ['#f59e0b', '#facc15', '#10b981', '#34d399', '#fef08a', '#ffffff'];
    const defeatColors = ['#ef4444', '#f87171', '#f97316', '#b91c1c', '#6b7280', '#fb923c'];
    const palette = isVictory ? victoryColors : defeatColors;

    const particles: Particle[] = [];
    const maxParticles = isVictory ? 70 : 45;

    // Initial burst from center
    const centerX = width / 2;
    const centerY = height * 0.35;

    for (let i = 0; i < maxParticles; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = isVictory ? Math.random() * 4 + 1.5 : Math.random() * 2 + 0.8;
      particles.push({
        x: centerX + (Math.random() - 0.5) * 40,
        y: centerY + (Math.random() - 0.5) * 40,
        size: isVictory ? Math.random() * 4 + 1.5 : Math.random() * 3 + 1,
        speedX: Math.cos(angle) * speed + (Math.random() - 0.5) * 0.8,
        speedY: isVictory ? Math.sin(angle) * speed - 1.2 : -Math.abs(Math.sin(angle) * speed * 0.8) - 0.5,
        color: palette[Math.floor(Math.random() * palette.length)],
        alpha: Math.random() * 0.6 + 0.4,
        maxAlpha: Math.random() * 0.6 + 0.4,
        decay: isVictory ? 0.003 + Math.random() * 0.006 : 0.004 + Math.random() * 0.005,
        spin: (Math.random() - 0.5) * 0.08,
        rotation: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // Continuous subtle ambient spawning
      if (particles.length < maxParticles && time % 3 === 0) {
        particles.push({
          x: Math.random() * width,
          y: isVictory ? height + 10 : height + 5,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * (isVictory ? 1.2 : 0.6),
          speedY: isVictory ? -(Math.random() * 2 + 1) : -(Math.random() * 1.5 + 0.5),
          color: palette[Math.floor(Math.random() * palette.length)],
          alpha: 0.1,
          maxAlpha: Math.random() * 0.7 + 0.3,
          decay: 0.003 + Math.random() * 0.005,
          spin: (Math.random() - 0.5) * 0.06,
          rotation: Math.random() * Math.PI * 2,
        });
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.x += p.speedX + Math.sin(time * 0.03 + i) * 0.4;
        p.y += p.speedY;
        p.rotation += p.spin;

        if (p.alpha < p.maxAlpha && p.y > 50) {
          p.alpha += 0.03;
        } else {
          p.alpha -= p.decay;
        }

        if (p.alpha <= 0 || p.y < -20 || p.x < -20 || p.x > width + 20) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.size > 2.5 ? 10 : 5;

        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (isVictory && i % 3 === 0) {
          // Diamond / star sparkle for victory
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 1.8);
          ctx.lineTo(p.size * 0.8, 0);
          ctx.lineTo(0, p.size * 1.8);
          ctx.lineTo(-p.size * 0.8, 0);
          ctx.closePath();
          ctx.fill();
        } else {
          // Standard circular spark / ember particle
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isVictory]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        borderRadius: 'inherit',
      }}
    />
  );
};
