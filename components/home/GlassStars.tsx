import React from "react";

const positions = [
  { top: "15%", left: "10%", delay: "0s", size: "w-1.5 h-1.5", duration: "3s" },
  { top: "25%", right: "15%", delay: "1s", size: "w-2 h-2", duration: "4s" },
  { top: "60%", left: "8%", delay: "0.5s", size: "w-1 h-1", duration: "3.5s" },
  { top: "80%", right: "12%", delay: "1.5s", size: "w-1.5 h-1.5", duration: "5s" },
  { top: "45%", left: "45%", delay: "0.2s", size: "w-2 h-2", duration: "4.5s" },
  { top: "12%", right: "40%", delay: "1.2s", size: "w-1 h-1", duration: "3s" },
  { top: "85%", left: "25%", delay: "0.8s", size: "w-1.5 h-1.5", duration: "4s" },
  { top: "70%", right: "30%", delay: "2s", size: "w-2 h-2", duration: "3.8s" },
];

interface GlassStarsProps {
  colors: string[];
}

export function GlassStars({ colors }: GlassStarsProps) {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 ease-in-out">
      {positions.map((pos, i) => {
        const colorClass = colors[i % colors.length];
        return (
          <div
            key={i}
            className={`absolute rounded-full animate-twinkle ${pos.size} ${colorClass}`}
            style={{
              top: pos.top,
              left: pos.left,
              right: pos.right,
              animationDelay: pos.delay,
              animationDuration: pos.duration,
            }}
          />
        );
      })}
    </div>
  );
}
