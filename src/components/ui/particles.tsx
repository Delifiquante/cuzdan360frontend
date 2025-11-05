"use client";
import React, { useRef, useEffect, useCallback } from "react";

interface ParticlesProps {
  className?: string;
  particleCount?: number;
  particleColors?: string[];
  particleSpread?: number;
  speed?: number;
  particleBaseSize?: number;
  moveParticlesOnHover?: boolean;
  alphaParticles?: boolean;
  disableRotation?: boolean;
}

const Particles: React.FC<ParticlesProps> = ({
  className,
  particleCount = 100,
  particleColors = ["#ffffff"],
  particleSpread = 10,
  speed = 0.1,
  particleBaseSize = 2,
  moveParticlesOnHover = false,
  alphaParticles = true,
  disableRotation = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<any[]>([]);
  const mouse = useRef({ x: -1000, y: -1000 });

  const createParticles = useCallback((width: number, height: number) => {
    particles.current = [];
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = Math.random() * particleBaseSize + 1;
      const color = particleColors[Math.floor(Math.random() * particleColors.length)];
      const velocity = {
        x: (Math.random() - 0.5) * speed,
        y: (Math.random() - 0.5) * speed,
      };
      particles.current.push({ x, y, radius, color, velocity });
    }
  }, [particleCount, particleColors, particleBaseSize, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createParticles(canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = event.clientX;
      mouse.current.y = event.clientY;
    };
    if (moveParticlesOnHover) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach((p) => {
        // Update position
        p.x += p.velocity.x;
        p.y += p.velocity.y;

        // Wall collision
        if (p.x < 0 || p.x > canvas.width) p.velocity.x *= -1;
        if (p.y < 0 || p.y > canvas.height) p.velocity.y *= -1;

        // Mouse interaction
        if (moveParticlesOnHover) {
          const dx = mouse.current.x - p.x;
          const dy = mouse.current.y - p.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < particleSpread) {
            p.x -= dx * 0.01;
            p.y -= dy * 0.01;
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = p.color;

        // Add glow effect
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 20;
        
        if (alphaParticles) {
            ctx.globalAlpha = 0.5;
        }
        ctx.fill();
        ctx.closePath();
        
        // Reset shadow
        ctx.shadowBlur = 0;
      });
      
      ctx.globalAlpha = 1;

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      if (moveParticlesOnHover) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [createParticles, moveParticlesOnHover, particleSpread, alphaParticles, disableRotation]);

  return <canvas ref={canvasRef} className={className} />;
};

export default Particles;
