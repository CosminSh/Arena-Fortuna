export function triggerGladiatorArenaSparks() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    document.body.removeChild(canvas);
    return;
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    alpha: number;
    life: number;
    maxLife: number;
  }

  const particles: Particle[] = [];
  const colors = ['#f59e0b', '#fbbf24', '#ef4444', '#f97316', '#ffffff'];

  // Spawn 60 fiery arena embers & golden sparks from center
  const centerX = canvas.width / 2;
  const centerY = canvas.height * 0.5;

  for (let i = 0; i < 70; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 12;
    particles.push({
      x: centerX,
      y: centerY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2, // upward bias for embers
      size: 3 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      life: 0,
      maxLife: 35 + Math.random() * 30,
    });
  }

  let animationFrameId: number;

  function render() {
    ctx!.clearRect(0, 0, canvas.width, canvas.height);

    let activeCount = 0;
    for (const p of particles) {
      p.life++;
      if (p.life < p.maxLife) {
        activeCount++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // Gravity pull
        p.alpha = 1 - p.life / p.maxLife;

        ctx!.save();
        ctx!.globalAlpha = p.alpha;
        ctx!.fillStyle = p.color;
        ctx!.shadowColor = p.color;
        ctx!.shadowBlur = 10;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
      }
    }

    if (activeCount > 0) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(animationFrameId);
      if (document.body.contains(canvas)) {
        document.body.removeChild(canvas);
      }
    }
  }

  render();
}
