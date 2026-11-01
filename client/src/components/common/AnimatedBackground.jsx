import React, { useEffect, useRef, useCallback } from 'react';

/**
 * AnimatedBackground - Canvas-based particle & gradient background
 * Used in hero sections and promotional areas.
 * Lightweight, respects prefers-reduced-motion.
 */
const AnimatedBackground = ({
  variant = 'hero', // 'hero' | 'subtle' | 'dark' | 'particles-only'
  className = '',
  particleCount = 35,
  interactive = true,
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef([]);

  const colorPalettes = {
    hero: {
      particles: ['rgba(199, 243, 107, 0.4)', 'rgba(199, 243, 107, 0.2)', 'rgba(255, 255, 255, 0.15)', 'rgba(15, 118, 110, 0.3)'],
      lines: 'rgba(199, 243, 107, 0.06)',
      glow: ['rgba(199, 243, 107, 0.08)', 'rgba(15, 118, 110, 0.1)'],
    },
    subtle: {
      particles: ['rgba(15, 118, 110, 0.12)', 'rgba(15, 118, 110, 0.06)', 'rgba(199, 243, 107, 0.08)'],
      lines: 'rgba(15, 118, 110, 0.03)',
      glow: ['rgba(15, 118, 110, 0.04)', 'rgba(199, 243, 107, 0.03)'],
    },
    dark: {
      particles: ['rgba(199, 243, 107, 0.5)', 'rgba(199, 243, 107, 0.25)', 'rgba(255, 255, 255, 0.12)'],
      lines: 'rgba(199, 243, 107, 0.08)',
      glow: ['rgba(199, 243, 107, 0.1)', 'rgba(15, 118, 110, 0.15)'],
    },
    'particles-only': {
      particles: ['rgba(15, 118, 110, 0.1)', 'rgba(199, 243, 107, 0.06)'],
      lines: 'transparent',
      glow: [],
    },
  };

  const createParticles = useCallback((width, height) => {
    const palette = colorPalettes[variant] || colorPalettes.hero;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        color: palette.particles[Math.floor(Math.random() * palette.particles.length)],
        opacity: Math.random() * 0.5 + 0.2,
        pulseSpeed: Math.random() * 0.01 + 0.005,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }
    return particles;
  }, [variant, particleCount]);

  useEffect(() => {
    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.parentElement.offsetWidth;
    let height = canvas.parentElement.offsetHeight;

    const setSize = () => {
      width = canvas.parentElement.offsetWidth;
      height = canvas.parentElement.offsetHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    setSize();

    particlesRef.current = createParticles(width, height);

    const handleMouseMove = (e) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const palette = colorPalettes[variant] || colorPalettes.hero;

    const drawGlowOrbs = (time) => {
      if (!palette.glow.length) return;
      
      // Orb 1 — slow drift
      const orb1X = width * 0.3 + Math.sin(time * 0.0003) * width * 0.1;
      const orb1Y = height * 0.4 + Math.cos(time * 0.0004) * height * 0.15;
      const g1 = ctx.createRadialGradient(orb1X, orb1Y, 0, orb1X, orb1Y, width * 0.35);
      g1.addColorStop(0, palette.glow[0]);
      g1.addColorStop(1, 'transparent');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, width, height);

      // Orb 2 — opposite drift
      if (palette.glow[1]) {
        const orb2X = width * 0.7 + Math.cos(time * 0.0005) * width * 0.12;
        const orb2Y = height * 0.6 + Math.sin(time * 0.0003) * height * 0.1;
        const g2 = ctx.createRadialGradient(orb2X, orb2Y, 0, orb2X, orb2Y, width * 0.3);
        g2.addColorStop(0, palette.glow[1]);
        g2.addColorStop(1, 'transparent');
        ctx.fillStyle = g2;
        ctx.fillRect(0, 0, width, height);
      }
    };

    const drawParticles = (time) => {
      particlesRef.current.forEach((p) => {
        // Move
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around edges
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Pulse opacity
        const pulse = Math.sin(time * p.pulseSpeed + p.pulseOffset) * 0.3 + 0.7;

        // Mouse interaction — subtle attract
        if (interactive) {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            p.x += dx * 0.002;
            p.y += dy * 0.002;
          }
        }

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * pulse, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity * pulse;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    };

    const drawConnections = () => {
      if (palette.lines === 'transparent') return;
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = palette.lines;
            ctx.globalAlpha = 1 - dist / 120;
            ctx.lineWidth = 0.5;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
    };

    const animate = (time) => {
      ctx.clearRect(0, 0, width, height);
      drawGlowOrbs(time);
      drawParticles(time);
      drawConnections();
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    if (interactive) {
      canvas.addEventListener('mousemove', handleMouseMove);
    }

    const handleResize = () => {
      setSize();
      particlesRef.current = createParticles(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (interactive) {
        canvas.removeEventListener('mousemove', handleMouseMove);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [variant, particleCount, interactive, createParticles]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-auto ${className}`}
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
};

export default AnimatedBackground;

