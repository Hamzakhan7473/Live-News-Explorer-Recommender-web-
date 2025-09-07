'use client';

import { useEffect, useRef } from 'react';

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // No particle system - clean background

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw floating text elements
      const newsWords = ['NEWS', 'TRUTH', 'STORY', 'REPORT', 'UPDATE', 'ALERT', 'BREAKING', 'LIVE'];
      newsWords.forEach((word, index) => {
        const time = Date.now() * 0.001;
        const x = (canvas.width / newsWords.length) * index + Math.sin(time + index) * 20;
        const y = canvas.height * 0.3 + Math.cos(time * 0.5 + index) * 30;
        
        ctx.save();
        ctx.globalAlpha = 0.03;
        ctx.font = 'bold 24px Inter, sans-serif';
        ctx.fillStyle = '#374151';
        ctx.textAlign = 'center';
        ctx.fillText(word, x, y);
        ctx.restore();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
}
