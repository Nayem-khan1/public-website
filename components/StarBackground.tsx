"use client";

interface Star {
    id: number;
    size: number;
    x: number;
    y: number;
    opacity: number;
    animationDuration: number;
}

interface Meteor {
    id: number;
    size: number;
    x: number;
    y: number;
    delay: number;
    animationDuration: number;
}

const stars: Star[] = Array.from({ length: 48 }, (_, index) => ({
    id: index,
    size: (index % 3) + 1,
    x: (index * 17) % 100,
    y: (index * 11) % 100,
    opacity: 0.45 + ((index % 5) * 0.1),
    animationDuration: 2 + (index % 4),
}));

const meteors: Meteor[] = Array.from({ length: 4 }, (_, index) => ({
    id: index,
    size: 1 + (index % 2),
    x: 12 + (index * 23),
    y: 6 + (index * 4),
    delay: index * 3.5,
    animationDuration: 3 + index,
}));

export const StarBackground = () => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {stars.map((star) => (
                <div
                    key={star.id}
                    className="absolute rounded-full bg-white animate-pulse-subtle"
                    style={{
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        opacity: star.opacity,
                        animationDuration: `${star.animationDuration}s`,
                    }}
                />
            ))}

            {meteors.map((meteor) => (
                <div
                    key={meteor.id}
                    className="absolute bg-gradient-to-r from-white to-transparent animate-meteor"
                    style={{
                        width: `${meteor.size * 50}px`,
                        height: `${meteor.size * 2}px`,
                        left: `${meteor.x}%`,
                        top: `${meteor.y}%`,
                        animationDelay: `${meteor.delay}s`,
                        animationDuration: `${meteor.animationDuration}s`,
                    }}
                />
            ))}
        </div>
    );
};
