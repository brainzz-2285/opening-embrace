import { useEffect, useMemo, useRef, useState } from "react";
import { FloatingPetals } from "./FloatingPetals";

const TARGET = new Date(2026, 11, 6, 0, 0, 0).getTime(); // 6 Dec 2026 local

type TimeParts = { days: number; hours: number; minutes: number; seconds: number };

function getParts(): TimeParts {
  const diff = Math.max(0, TARGET - Date.now());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds };
}

function FlipNumber({ value, pad = 2 }: { value: number; pad?: number }) {
  const text = String(value).padStart(pad, "0");
  const prev = useRef(text);
  const [display, setDisplay] = useState(text);
  const [anim, setAnim] = useState(false);

  useEffect(() => {
    if (text === prev.current) return;
    setAnim(true);
    const t = setTimeout(() => {
      setDisplay(text);
      prev.current = text;
      setAnim(false);
    }, 220);
    return () => clearTimeout(t);
  }, [text]);

  return (
    <span
      className="inline-block tabular-nums"
      style={{
        fontFamily: "var(--font-serif, 'Cormorant Garamond', Georgia, serif)",
        transition: "opacity 220ms ease, transform 220ms ease",
        opacity: anim ? 0 : 1,
        transform: anim ? "translateY(-6px)" : "translateY(0)",
      }}
    >
      {display}
    </span>
  );
}

function CountdownCard({ value, label, pad = 2 }: { value: number; label: string; pad?: number }) {
  return (
    <div
      className="relative flex flex-col items-center justify-center px-2 py-4 sm:px-4 sm:py-6"
      style={{
        minWidth: "4.5rem",
        borderRadius: "18px",
        background:
          "linear-gradient(160deg, rgba(255,255,255,0.85) 0%, rgba(252,242,232,0.7) 100%)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        boxShadow:
          "0 14px 38px -14px rgba(184,125,104,0.45), 0 2px 6px -2px rgba(120,70,55,0.15), inset 0 0 0 1px rgba(216,167,140,0.35)",
      }}
    >
      <div
        className="font-serif leading-none"
        style={{
          fontSize: "clamp(2rem, 8vw, 3.25rem)",
          color: "#7a4a3b",
          textShadow: "0 1px 0 rgba(255,255,255,0.8), 0 0 20px rgba(220,170,120,0.3)",
        }}
      >
        <FlipNumber value={value} pad={pad} />
      </div>
      <span
        className="mt-2 sm:mt-3 text-[0.55rem] sm:text-[0.65rem] uppercase tracking-[0.35em] sm:tracking-[0.45em] font-serif text-gold-deep/80"
      >
        {label}
      </span>
    </div>
  );
}

export function WeddingCountdown() {
  const [t, setT] = useState<TimeParts>(() => getParts());
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const id = setInterval(() => setT(getParts()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const sparkles = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 3 + Math.random() * 3,
        size: 2 + Math.random() * 3,
      })),
    [],
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] w-full overflow-hidden flex flex-col items-center justify-center px-6 py-20"
      style={{ backgroundColor: "#FCF8F4" }}
    >
      <FloatingPetals count={14} />

      {/* Sparkle particles */}
      <div className="pointer-events-none absolute inset-0">
        {sparkles.map((s) => (
          <span
            key={s.id}
            className="absolute block rounded-full"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              background:
                "radial-gradient(circle, rgba(255,235,200,0.95) 0%, rgba(220,170,120,0.4) 60%, transparent 100%)",
              animation: `sparkle-pop ${s.duration}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <div
        className={`relative z-10 w-full max-w-2xl text-center transition-all duration-1000 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <p className="font-serif italic text-sm sm:text-base text-gold-deep/85 max-w-md mx-auto leading-relaxed">
          “A lifetime of togetherness begins with one beautiful promise.”
        </p>

        <h2
          className="mt-8 text-5xl sm:text-6xl text-gold-gradient"
          style={{ fontFamily: "var(--font-script)" }}
        >
          The Wedding
        </h2>

        <div className="mt-4 flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold/60" />
          <span className="font-serif tracking-[0.35em] text-sm sm:text-base text-gold-deep">
            06 • DEC • 2026
          </span>
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold/60" />
        </div>

        {/* Timer */}
        <div className="relative mt-12">
          {/* Soft glow behind timer */}
          <div
            className="pointer-events-none absolute inset-0 -m-6"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(220,170,120,0.28) 0%, transparent 70%)",
              filter: "blur(20px)",
            }}
          />
          <div className="relative grid grid-cols-4 gap-2 sm:gap-4">
            <CountdownCard value={t.days} label="Days" pad={3} />
            <CountdownCard value={t.hours} label="Hours" />
            <CountdownCard value={t.minutes} label="Minutes" />
            <CountdownCard value={t.seconds} label="Seconds" />
          </div>
        </div>

        <p className="mt-12 font-serif italic text-base sm:text-lg text-gold-deep/90 max-w-md mx-auto">
          Every passing moment brings us closer to celebrating with you.
        </p>
      </div>
    </section>
  );
}
