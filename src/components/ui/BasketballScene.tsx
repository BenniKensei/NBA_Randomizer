'use client';

import React, { useEffect, useRef } from 'react';

export function BasketballScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let rotation = 0;

    function drawBasketball() {
      if (!ctx || !canvas) return;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 100;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw basketball
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);

      // Orange circle
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#FF6B35';
      ctx.fill();

      // Black lines
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      
      // Horizontal line
      ctx.beginPath();
      ctx.moveTo(-radius, 0);
      ctx.lineTo(radius, 0);
      ctx.stroke();

      // Vertical line
      ctx.beginPath();
      ctx.moveTo(0, -radius);
      ctx.lineTo(0, radius);
      ctx.stroke();

      // Curved lines
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.7, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.7, Math.PI / 2, (3 * Math.PI) / 2);
      ctx.stroke();

      ctx.restore();

      rotation += 0.01;
    }

    let animationFrameId: number;

    function animate() {
      drawBasketball();
      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 -z-10 opacity-30 pointer-events-none"
    />
  );
}
