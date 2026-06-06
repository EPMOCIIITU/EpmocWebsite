import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function GridBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const handleMouseMove = (e) => {
      gsap.to(mouseRef.current, { x: e.clientX, y: e.clientY, duration: 0.5 });
    };
    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId;

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const size = 40; 
      const scrollY = window.scrollY * 0.2;
      
      for (let x = 0; x < canvas.width; x += size) {
        for (let y = 0; y < canvas.height; y += size) {
          let drawY = (y - scrollY % size);
          const dist = Math.hypot(x - mouseRef.current.x, drawY - mouseRef.current.y);
          const opacity = Math.max(0, 1 - dist / 300);
          
          ctx.beginPath(); 
          ctx.arc(x, drawY, 1, 0, Math.PI * 2);
          ctx.fillStyle = opacity > 0 ? `rgba(0, 255, 65, ${opacity * 0.5})` : 'rgba(255,255,255,0.1)';
          ctx.fill();
        }
      }
      animationFrameId = requestAnimationFrame(drawGrid);
    };
    drawGrid();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas id="grid-canvas" ref={canvasRef} className="fixed inset-0 z-0"></canvas>;
}
