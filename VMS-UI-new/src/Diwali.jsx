import React, { useEffect, useRef } from 'react';

const Fireworks = () => {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const probability = 0.04;
  const animationDuration = 1/2 * 60 * 1000; // 10 minutes in milliseconds
  const startTime = useRef(Date.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w, h;

    const resizeCanvas = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    const updateWorld = () => {
      if (Date.now() - startTime.current < animationDuration) {
        update();
        paint();
        requestAnimationFrame(updateWorld);
      }
    };

    const update = () => {
      if (particles.current.length < 500 && Math.random() < probability) {
        createFirework();
      }
      particles.current = particles.current.filter(particle => particle.move());
    };

    const paint = () => {
      ctx.clearRect(0, 0, w, h); // Clear canvas for each frame
      ctx.globalCompositeOperation = 'lighter';
      particles.current.forEach(particle => particle.draw(ctx));
    };

    const createFirework = () => {
      const xPoint = Math.random() * (w - 200) + 100;
      const yPoint = Math.random() * (h - 200) + 100;
      const nFire = Math.random() * 50 + 100;

      // Generate random RGB values within 0-255
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      const c = `rgb(${r}, ${g}, ${b})`;

      for (let i = 0; i < nFire; i++) {
        const particle = new Particle(xPoint, yPoint, c);
        particles.current.push(particle);
      }
    };

    class Particle {
        constructor(x, y) {
            this.w = this.h = Math.random() * 4 + 2; // Particle size
            this.x = x;
            this.y = y;

            // Set velocity based on angle for an explosive effect
            const angle = Math.random() * 2 * Math.PI; // Random angle
            const speed = Math.random() * 10 + 5; // Increased speed
            this.vx = Math.cos(angle) * speed; // X velocity
            this.vy = Math.sin(angle) * speed; // Y velocity

            this.alpha = Math.random() * 0.5 + 0.5;

            // Cracker colors: yellow, orange, and red
            const colors = ['red', 'orange', 'yellow'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        gravity = 0.05;

        move() {
            this.x += this.vx;
            this.vy += this.gravity;
            this.y += this.vy;
            this.alpha -= 0.005; // Slightly faster fade out
            return this.x > -this.w && this.x < w && this.y < h && this.alpha > 0;
        }

        draw(c) {
            c.save();
            c.beginPath();
            c.translate(this.x + this.w / 2, this.y + this.h / 2);
            c.arc(0, 0, this.w, 0, Math.PI * 2);
            c.fillStyle = this.color;
            c.globalAlpha = this.alpha;
            c.closePath();
            c.fill();
            c.restore();
        }
    }

    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener("resize", handleResize);
    resizeCanvas();
    requestAnimationFrame(updateWorld);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0, // Set z-index of canvas
        backgroundColor: 'transparent', // Set background to transparent
      }}
    />
  );
};
export default Fireworks