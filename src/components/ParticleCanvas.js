
'use client';
import { useEffect, useRef } from "react";

const ParticleCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const particles = [];
        const particleCount = 60;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        const createParticle = () => {
            const size = Math.random() * 4 + 2; // Particle size between 2px and 6px
            const xPosition = Math.random() * canvas.width;
            const yPosition = Math.random() * canvas.height;

            particles.push({
                x: xPosition,
                y: yPosition,
                size: size,
                speedX: Math.random() * 0.5 - 0.25, // Random horizontal speed
                speedY: Math.random() * 0.5 - 0.25, // Random vertical speed
                opacity: Math.random() * 0.3 + 0.2, // Lower opacity for subtlety
            });
        };

        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((particle, index) => {
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 255, 255, ${particle.opacity})`; // Neon cyan color
                ctx.fill();
                ctx.closePath();

                // Update particle position
                particle.x += particle.speedX;
                particle.y += particle.speedY;

                // Remove particles that go off-screen
                if (
                    particle.x > canvas.width ||
                    particle.x < 0 ||
                    particle.y > canvas.height ||
                    particle.y < 0
                ) {
                    particles.splice(index, 1);
                    createParticle(); // Create a new particle to replace the one removed
                }
            });

            requestAnimationFrame(animateParticles);
        };

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            createParticle();
        }

        animateParticles();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
        };
    }, []);

    return <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0, zIndex: -1 }} />;
};

export default ParticleCanvas;