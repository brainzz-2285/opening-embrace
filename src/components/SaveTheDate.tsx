import { useEffect, useMemo, useState } from "react";
import { ScratchCard } from "./ScratchCard";
import { FloatingPetals } from "./FloatingPetals";

export function SaveTheDate() {
  const [revealed, setRevealed] = useState({ day: false, month: false, year: false });
  const allRevealed = revealed.day && revealed.month && revealed.year;
  const [showSparkles, setShowSparkles] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (!allRevealed) return;
    setShowSparkles(true);
    const t1 = setTimeout(() => setShowMessage(true), 600);
    const t2 = setTimeout(() => setShowSparkles(false), 2200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [allRevealed]);

  const sparkles = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: 20 + Math.random() * 60,
        delay: Math.random() * 1.4,
        size: 4 + Math.random() * 8,
      })),
    [showSparkles],
  );

  const confettiColors = ["#d9a45a", "#e8c07a", "#f5d8b8", "#c98a72", "#b07a65", "#fff4d6"];
  const confetti = useMemo(
    () =>
      Array.from({ length: 80 }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = 180 + Math.random() * 320;
        return {
          id: i,
          dx: Math.cos(angle) * distance,
          dy: Math.sin(angle) * distance - 60,
          rotate: Math.random() * 720 - 360,
          delay: Math.random() * 0.25,
          duration: 1.6 + Math.random() * 1.2,
          color: confettiColors[i % confettiColors.length],
          w: 6 + Math.random() * 6,
          h: 10 + Math.random() * 8,
        };
      }),
    [showSparkles],
  );

  return (
    <section
      className="relative min-h-[100svh] w-full overflow-hidden flex flex-col items-center justify-center px-6 py-20"
      style={{ backgroundColor: "#FCF8F4" }}
    >
      <FloatingPetals count={16} />

      {/* Subtle radial vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(212,170,140,0.10) 100%)",
        }}
      />

      <header className="relative z-10 text-center max-w-md">
        <p className="text-[0.7rem] uppercase tracking-[0.55em] text-gold-deep/80 font-serif animate-fade-up">
          The Date
        </p>
        <h2
          className="mt-5 text-5xl sm:text-6xl text-gold-gradient animate-fade-up"
          style={{ fontFamily: "var(--font-script)", animationDelay: "0.15s" }}
        >
          Save the Date
        </h2>
        <p
          className="mt-5 font-serif italic text-base sm:text-lg text-muted-foreground animate-fade-up"
          style={{ animationDelay: "0.3s" }}
        >
          Scratch below to reveal our wedding date
        </p>
        <div className="mx-auto mt-6 flex items-center justify-center gap-3">
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold/60" />
          <span className="text-gold-deep/70 text-xs">✦</span>
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold/60" />
        </div>
      </header>

      <div className="relative z-10 mt-12 flex items-start justify-center gap-3 sm:gap-5">
        <ScratchCard label="Day" value="06" onReveal={() => setRevealed((r) => ({ ...r, day: true }))} />
        <ScratchCard label="Month" value="DEC" onReveal={() => setRevealed((r) => ({ ...r, month: true }))} />
        <ScratchCard label="Year" value="2026" onReveal={() => setRevealed((r) => ({ ...r, year: true }))} />

      </div>

      {/* Final message */}
      <div
        className={`relative z-10 mt-12 text-center transition-all duration-1000 ${
          showMessage ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
      >
        <p className="font-serif italic text-lg sm:text-xl text-gold-deep">
          We can't wait to celebrate with you.
        </p>
      </div>


      {/* Sparkle burst */}
      {showSparkles && (
        <div className="pointer-events-none absolute inset-0 z-20">
          {sparkles.map((s) => (
            <span
              key={s.id}
              className="absolute block"
              style={{
                left: `${s.left}%`,
                top: `${s.top}%`,
                width: s.size,
                height: s.size,
                animation: `sparkle-pop 1.6s ease-out ${s.delay}s both`,
              }}
            >
              <svg viewBox="0 0 24 24" width="100%" height="100%">
                <path
                  d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z"
                  fill="url(#sparkleGrad)"
                />
                <defs>
                  <linearGradient id="sparkleGrad" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="#fff4d6" />
                    <stop offset="60%" stopColor="#e8c07a" />
                    <stop offset="100%" stopColor="#b8893f" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
