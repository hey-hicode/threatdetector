"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface SplitTextProps {
    text: string;
    className?: string;
    delay?: number;
    duration?: number;
    ease?: string;
    splitType?: "chars" | "words"; // Simplified to chars/words
    from?: any;
    to?: any;
    threshold?: number;
    rootMargin?: string;
    textAlign?: string;
    onLetterAnimationComplete?: () => void;
    showCallback?: boolean;
}

export default function SplitText({
    text,
    className = "",
    delay = 50,
    duration = 1.25,
    ease = "power3.out",
    splitType = "chars",
    from = { opacity: 0, y: 40 },
    to = { opacity: 1, y: 0 },
    threshold = 0.1,
    rootMargin = "-100px",
    textAlign = "center",
    onLetterAnimationComplete,
    showCallback = false,
}: SplitTextProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const observer = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting) {
                        const elements =
                            splitType === "chars"
                                ? containerRef.current?.querySelectorAll(".char")
                                : containerRef.current?.querySelectorAll(".word");

                        if (elements && elements.length > 0) {
                            gsap.fromTo(elements, from, {
                                ...to,
                                duration,
                                delay: delay / 1000,
                                ease,
                                stagger: 0.05,
                                onComplete: () => {
                                    if (showCallback && onLetterAnimationComplete) {
                                        onLetterAnimationComplete();
                                    }
                                },
                            });
                        }
                        observer.disconnect();
                    }
                },
                { threshold, rootMargin }
            );

            if (containerRef.current) {
                observer.observe(containerRef.current);
            }

            return () => observer.disconnect();
        },
        { scope: containerRef }
    );

    const words = text.split(" ");

    return (
        <div
            ref={containerRef}
            className={`${className} overflow-hidden`}
            style={{ textAlign: textAlign as any }}
        >
            {words.map((word, wordIndex) => (
                <span
                    key={wordIndex}
                    className="word inline-block whitespace-nowrap mr-[0.2em]"
                >
                    {splitType === "chars"
                        ? word.split("").map((char, charIndex) => (
                            <span key={charIndex} className="char inline-block">
                                {char}
                            </span>
                        ))
                        : word}
                </span>
            ))}
        </div>
    );
}
