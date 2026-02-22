"use client";

import { motion } from "framer-motion";

interface MarqueeProps {
    items: string[];
    className?: string;
    speed?: number;
}

export default function Marquee({ items, className = "", speed = 30 }: MarqueeProps) {
    return (
        <div className={`overflow-hidden py-4 bg-primary text-white whitespace-nowrap mask-gradient ${className}`}>
            <div className="animate-marquee inline-flex gap-8 px-8">
                {[...items, ...items, ...items].map((item, index) => (
                    <div key={index} className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest">
                        <span>{item}</span>
                        <span className="w-2 h-2 rounded-full bg-white/50" />
                    </div>
                ))}
            </div>
        </div>
    );
}
