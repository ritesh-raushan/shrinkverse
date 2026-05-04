"use client";
import { useEffect, useRef } from "react";

const ParticleCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        // Respect prefers-reduced-motion: render once, then bail out.
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        // Halve the particle count on small screens to save battery / paint cost.
        const isSmallScreen = window.innerWidth < 640;
        const particleCount = isSmallScreen ? 30 : 60;

        const particles = [];
        let rafId = null;
        let isRunning = true;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const createParticle = () => {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 4 + 2,
                speedX: Math.random() * 0.5 - 0.25,
                speedY: Math.random() * 0.5 - 0.25,
                opacity: Math.random() * 0.3 + 0.2,
            });
        };

        const drawFrame = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = particles.length - 1; i >= 0; i--) {
                const particle = particles[i];

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 255, 255, ${particle.opacity})`;
                ctx.fill();
                ctx.closePath();

                particle.x += particle.speedX;
                particle.y += particle.speedY;

                if (
                    particle.x > canvas.width ||
                    particle.x < 0 ||
                    particle.y > canvas.height ||
                    particle.y < 0
                ) {
                    particles.splice(i, 1);
                    createParticle();
                }
            }
        };

        const animate = () => {
            if (!isRunning) return;
            drawFrame();
            rafId = requestAnimationFrame(animate);
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                isRunning = false;
                if (rafId) cancelAnimationFrame(rafId);
                rafId = null;
            } else if (!reducedMotion) {
                isRunning = true;
                animate();
            }
        };

        window.addEventListener("resize", resizeCanvas);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        resizeCanvas();
        for (let i = 0; i < particleCount; i++) createParticle();

        if (reducedMotion) {
            // Static frame only.
            drawFrame();
        } else {
            animate();
        }

        return () => {
            isRunning = false;
            if (rafId) cancelAnimationFrame(rafId);
            window.removeEventListener("resize", resizeCanvas);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    return <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0, zIndex: -1 }} />;
};

export default ParticleCanvas;
