"use client";

import React, { useEffect, useRef, useState } from "react";

interface Snowflake {
    x: number;
    y: number;
    radius: number;
    speed: number;
    wind: number;
    opacity: number;
    blur: number; // For depth of field
}

const SnowEffect: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        // Set initial size
        // Check for window existence to be safe with SSR (though useLayoutEffect/useEffect handles this on client)
        if (typeof window !== 'undefined') {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = windowSize.width;
        canvas.height = windowSize.height;

        const snowflakes: Snowflake[] = [];
        // Increase particle count for "bold" effect, but handle mobile performance
        const isMobile = windowSize.width < 768;
        const particleCount = isMobile ? 30 : Math.min(60, Math.floor(windowSize.width / 20));

        const createSnowflake = (width: number, height: number): Snowflake => {
            const depth = Math.random(); // 0 to 1, where 1 is close
            return {
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 4 + 1 + (depth * 2), // Close flakes are bigger
                speed: Math.random() * 1 + 0.5 + (depth * 0.5), // Close flakes fall faster
                wind: Math.random() * 0.5 - 0.25,
                opacity: Math.random() * 0.4 + 0.4, // Brighter flakes
                blur: Math.random() * 2 // Blur effect
            };
        };

        for (let i = 0; i < particleCount; i++) {
            snowflakes.push(createSnowflake(canvas.width, canvas.height));
        }

        let animationFrameId: number;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Optimize: Batch styling where possible or just simplify
            ctx.fillStyle = "white";

            snowflakes.forEach((flake) => {
                ctx.beginPath();
                ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
                // Depth simulation using only opacity, no expensive blur filter
                ctx.globalAlpha = flake.opacity;
                ctx.fill();

                // Update position
                flake.y += flake.speed;
                flake.x += flake.wind;

                // Simple wind variation
                flake.wind += (Math.random() - 0.5) * 0.01;
                if (flake.wind > 0.5) flake.wind = 0.5;
                if (flake.wind < -0.5) flake.wind = -0.5;

                // Reset
                if (flake.y > canvas.height) {
                    flake.y = -5;
                    flake.x = Math.random() * canvas.width;
                }
                if (flake.x > canvas.width) {
                    flake.x = 0;
                } else if (flake.x < 0) {
                    flake.x = canvas.width;
                }
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => cancelAnimationFrame(animationFrameId);
    }, [windowSize]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none z-[100]"
            style={{ pointerEvents: "none" }}
        />
    );
};

export default SnowEffect;
