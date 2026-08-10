"use client";

import { useEffect } from "react";

export default function CursorLight() {
    useEffect(() => {
        const dot = document.querySelector(".cursor-dot") as HTMLDivElement;
        const light = document.querySelector(".cursor-light") as HTMLDivElement;

        let mouseX = 0;
        let mouseY = 0;

        let lightX = 0;
        let lightY = 0;

        const move = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;

            document.documentElement.style.setProperty("--mouse-x", `${mouseX}px`);
            document.documentElement.style.setProperty("--mouse-y", `${mouseY}px`);
        };

        const animate = () => {
            lightX += (mouseX - lightX) * 0.12;
            lightY += (mouseY - lightY) * 0.12;

            light.style.transform = `translate(${lightX}px, 
                ${lightY}px)
                translate(-50%, -50%)`;


            requestAnimationFrame(animate);
        };

        animate();

        window.addEventListener("mousemove", move);

        const hoverElements = document.querySelectorAll(
            "a, button"
        );

        hoverElements.forEach((el) => {
            el.addEventListener("mouseenter", () => {
                dot.classList.add("hover");
                light.classList.add("hover");
            });

            el.addEventListener("mouseleave", () => {
                dot.classList.remove("hover");
                light.classList.remove("hover");
            });
        });

        return () => {
            window.removeEventListener("mousemove", move);
        };
    }, []);

    return (
        <>
            <div className="cursor-light" />
            <div className="cursor-dot" />
        </>
    );
}