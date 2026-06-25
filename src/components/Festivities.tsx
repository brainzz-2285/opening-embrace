import { useEffect, useRef, useState } from "react";
import { FloatingPetals } from "@/components/FloatingPetals";
import invitationAsset from "@/assets/invitation.png.asset.json";
import carnivalAsset from "@/assets/carnival.mp4.asset.json";
import sangeetAsset from "@/assets/sangeet.mp4.asset.json";
import weddingAsset from "@/assets/wedding.mp4.asset.json";

function FadeUp({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: "opacity 1100ms ease-out, transform 1100ms ease-out",
      }}
    >
      {children}
    </div>
  );
}

function AutoVideo({ src, label }: { src: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(v);
    return () => obs.disconnect();
  }, []);

  return (
    <FadeUp className="relative w-full min-h-[100svh] flex flex-col items-center justify-center px-4 py-10">
      <p
        className="font-serif text-[0.65rem] sm:text-xs uppercase tracking-[0.5em] mb-6"
        style={{ color: "#b08968" }}
      >
        {label}
      </p>
      <div
        className="relative w-full max-w-5xl overflow-hidden rounded-2xl"
        style={{
          boxShadow: "0 30px 80px -20px rgba(176,137,104,0.35), 0 0 0 1px rgba(201,168,76,0.15)",
        }}
      >
        <video
          ref={ref}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="block w-full h-auto object-cover"
        />
      </div>
    </FadeUp>
  );
}

export function Festivities() {
  return (
    <section
      className="relative w-full"
      style={{ backgroundColor: "#FCF8F4" }}
    >
      <FloatingPetals />

      <FadeUp className="relative w-full min-h-[100svh] flex flex-col items-center justify-center text-center px-6 py-20">
        <p
          className="font-serif text-[0.7rem] sm:text-xs uppercase tracking-[0.5em]"
          style={{ color: "#b08968" }}
        >
          The Celebrations Unfold
        </p>
        <h2
          className="mt-6 text-5xl sm:text-7xl"
          style={{
            fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
            color: "#7a4a3b",
            letterSpacing: "0.02em",
            fontWeight: 400,
          }}
        >
          Festivities
        </h2>
        <div className="mt-6 flex items-center gap-3">
          <span className="h-px w-12" style={{ background: "linear-gradient(to right, transparent, #c9a84c)" }} />
          <span className="text-[0.6rem] uppercase tracking-[0.5em]" style={{ color: "#c9a84c" }}>
            ✦
          </span>
          <span className="h-px w-12" style={{ background: "linear-gradient(to left, transparent, #c9a84c)" }} />
        </div>

        <div
          className="mt-12 w-full max-w-3xl overflow-hidden rounded-2xl"
          style={{
            boxShadow: "0 30px 80px -20px rgba(176,137,104,0.35), 0 0 0 1px rgba(201,168,76,0.18)",
          }}
        >
          <img
            src={invitationAsset.url}
            alt="Formal wedding invitation"
            className="block w-full h-auto"
          />
        </div>
      </FadeUp>

      <AutoVideo src={carnivalAsset.url} label="Carnival" />
      <AutoVideo src={sangeetAsset.url} label="Sangeet" />
      <AutoVideo src={weddingAsset.url} label="Wedding" />
    </section>
  );
}
