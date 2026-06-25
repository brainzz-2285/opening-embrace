import { useMemo } from "react";

const PETAL_COLORS = [
  "#f7d4c8",
  "#f1bfae",
  "#e9b3a0",
  "#f9dfd2",
  "#ecc4b3",
];

export function FloatingPetals({ count = 14 }: { count?: number }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 12,
        duration: 14 + Math.random() * 14,
        size: 10 + Math.random() * 14,
        sway: 20 + Math.random() * 40,
        rotate: Math.random() * 360,
        color: PETAL_COLORS[i % PETAL_COLORS.length],
        opacity: 0.35 + Math.random() * 0.35,
      })),
    [count],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {petals.map((p) => (
        <span
          key={p.id}
          className="absolute -top-10 block"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            transform: `rotate(${p.rotate}deg)`,
            animation: `petal-fall ${p.duration}s linear ${p.delay}s infinite`,
            // @ts-expect-error CSS custom prop
            "--sway": `${p.sway}px`,
          }}
        >
          <svg viewBox="0 0 24 24" width="100%" height="100%">
            <path
              d="M12 2 C16 6 18 11 12 22 C6 11 8 6 12 2 Z"
              fill={p.color}
            />
          </svg>
        </span>
      ))}
    </div>
  );
}
