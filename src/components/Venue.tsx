import { useEffect, useRef, useState, type ReactNode } from "react";
import { FloatingPetals } from "@/components/FloatingPetals";

function FadeUp({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        opacity: visible ? 1 : 0,
        transition: "opacity 1100ms ease-out, transform 1100ms ease-out",
      }}
    >
      {children}
    </div>
  );
}

const MAPS_QUERY = "Raj+Mahal+Palace+Jaipur";
const MAPS_EMBED = `https://www.google.com/maps?q=${MAPS_QUERY}&output=embed`;
const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`;

export function Venue() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, #6b3a2e 0%, #4a2218 55%, #2e120c 100%)",
      }}
    >
      {/* Soft warm vignette + champagne shimmer */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-30 mix-blend-soft-light"
        style={{
          background:
            "linear-gradient(180deg, rgba(243,212,160,0.35) 0%, transparent 35%, rgba(243,212,160,0.25) 100%)",
        }}
      />

      <FloatingPetals count={18} />

      {/* Sparkles */}
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 24 }).map((_, i) => {
          const left = (i * 37) % 100;
          const top = (i * 53) % 100;
          const delay = (i % 8) * 0.6;
          const size = 2 + (i % 3);
          return (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: size,
                height: size,
                background: "rgba(247,224,176,0.9)",
                boxShadow: "0 0 8px rgba(247,224,176,0.85)",
                animation: `soft-pulse 3.6s ease-in-out ${delay}s infinite`,
              }}
            />
          );
        })}
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-3xl flex-col items-center justify-center px-6 py-24 text-center">
        <FadeUp>
          <p
            className="text-[0.7rem] uppercase tracking-[0.5em]"
            style={{ color: "#f3d4a0" }}
          >
            The Celebration
          </p>
          <h2
            className="mt-5 text-5xl sm:text-6xl text-gold-gradient"
            style={{ fontFamily: "var(--font-serif)", letterSpacing: "0.02em" }}
          >
            Venue
          </h2>
          <div className="mx-auto mt-6 flex items-center justify-center gap-3">
            <span className="h-px w-12" style={{ background: "linear-gradient(to right, transparent, #f3d4a0)" }} />
            <span className="inline-block h-1.5 w-1.5 rotate-45" style={{ background: "#f3d4a0" }} />
            <span className="h-px w-12" style={{ background: "linear-gradient(to left, transparent, #f3d4a0)" }} />
          </div>
        </FadeUp>

        <FadeUp delay={150}>
          <h3
            className="mt-10 text-3xl sm:text-4xl"
            style={{ fontFamily: "var(--font-serif)", color: "#fbeed3" }}
          >
            Raj Mahal Palace
          </h3>
          <p
            className="mt-2 text-sm uppercase tracking-[0.4em]"
            style={{ color: "#e8c897" }}
          >
            Jaipur, Rajasthan
          </p>
        </FadeUp>

        <FadeUp delay={300}>
          <div
            className="relative mt-10 w-full overflow-hidden rounded-2xl"
            style={{
              border: "1px solid rgba(243,212,160,0.35)",
              boxShadow:
                "0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(243,212,160,0.15)",
            }}
          >
            <iframe
              title="Raj Mahal Palace, Jaipur"
              src={MAPS_EMBED}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-[320px] w-full sm:h-[400px]"
              style={{ border: 0, filter: "saturate(0.95)" }}
              allowFullScreen
            />
          </div>

          <a
            href={MAPS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-3 rounded-full px-7 py-3 text-xs uppercase tracking-[0.35em] transition-transform duration-300 hover:scale-[1.03]"
            style={{
              color: "#3a1d14",
              background: "linear-gradient(135deg, #f7e0b0 0%, #e6b87a 50%, #c89464 100%)",
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.55)",
              fontFamily: "var(--font-serif)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 22s-7-7.58-7-13a7 7 0 1 1 14 0c0 5.42-7 13-7 13Z" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            Open in Google Maps
          </a>
        </FadeUp>

        <FadeUp delay={450}>
          <div className="mt-20 flex items-center justify-center gap-3">
            <span className="h-px w-16" style={{ background: "linear-gradient(to right, transparent, rgba(243,212,160,0.6))" }} />
            <span className="inline-block h-1.5 w-1.5 rotate-45" style={{ background: "#f3d4a0" }} />
            <span className="h-px w-16" style={{ background: "linear-gradient(to left, transparent, rgba(243,212,160,0.6))" }} />
          </div>

          <p
            className="mx-auto mt-10 max-w-xl text-base sm:text-lg leading-relaxed"
            style={{ fontFamily: "var(--font-serif)", color: "#fbeed3", fontStyle: "italic" }}
          >
            Your presence will make our special day even more memorable.
            <br />
            Come, celebrate, laugh, and create beautiful memories with us.
          </p>
        </FadeUp>

        <FadeUp delay={600}>
          <p
            className="mt-16 text-[0.7rem] uppercase tracking-[0.5em]"
            style={{ color: "#e8c897" }}
          >
            Warm regards,
          </p>
          <p
            className="mt-3 text-base sm:text-lg"
            style={{ fontFamily: "var(--font-serif)", color: "#fbeed3" }}
          >
            Mr. Rajesh Sharma &amp; Mrs. Sunita Sharma
            <br />
            <span style={{ color: "#e8c897" }}>and family</span>
          </p>
        </FadeUp>

        <FadeUp delay={800}>
          <div className="mt-20 flex items-center justify-center gap-4">
            <span className="h-px w-20" style={{ background: "linear-gradient(to right, transparent, #f3d4a0)" }} />
            <span className="text-[0.6rem] uppercase tracking-[0.6em]" style={{ color: "#f3d4a0" }}>
              Together Forever
            </span>
            <span className="h-px w-20" style={{ background: "linear-gradient(to left, transparent, #f3d4a0)" }} />
          </div>

          <h1
            className="mt-10 text-gold-gradient leading-[1.05]"
            style={{
              fontFamily: "var(--font-script)",
              fontSize: "clamp(4rem, 14vw, 8.5rem)",
              textShadow: "0 4px 40px rgba(243,212,160,0.35)",
            }}
          >
            Anant &amp; Priya
          </h1>

          <p
            className="mt-8 text-[0.65rem] uppercase tracking-[0.5em]"
            style={{ color: "rgba(243,212,160,0.7)" }}
          >
            06 · Dec · 2026 · Jaipur
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
