'use client';

import React, { useEffect, useRef } from 'react';

export function SpinningCourt() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let rotation = 0;
    let scale = 1;
    let scaleDirection = 1;

    function drawCourt() {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);
      ctx.scale(scale, scale);

      // Court floor
      ctx.fillStyle = '#D2691E';
      ctx.fillRect(-150, -100, 300, 200);

      // Center line
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, -100);
      ctx.lineTo(0, 100);
      ctx.stroke();

      // Center circle
      ctx.beginPath();
      ctx.arc(0, 0, 30, 0, Math.PI * 2);
      ctx.strokeStyle = '#FF6B35';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Three-point arcs
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      
      ctx.beginPath();
      ctx.arc(-120, 0, 50, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(120, 0, 50, Math.PI / 2, (3 * Math.PI) / 2);
      ctx.stroke();

      ctx.restore();

      rotation += 0.02;
      scale += 0.002 * scaleDirection;
      
      if (scale > 1.1 || scale < 0.9) {
        scaleDirection *= -1;
      }
    }

    let animationFrameId: number;

    function animate() {
      drawCourt();
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
      className="absolute inset-0 -z-10 opacity-20 pointer-events-none w-full h-full"
    />
  );
}
