import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import videoAsset from "@/assets/opening-envelope.mp4.asset.json";
import posterAsset from "@/assets/opening-envelope-poster.jpg.asset.json";
import introAsset from "@/assets/intro-page.mp4.asset.json";
import { SaveTheDate } from "@/components/SaveTheDate";
import { WeddingCountdown } from "@/components/WeddingCountdown";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Our Wedding Invitation" },
      { name: "description", content: "You are warmly invited to celebrate our wedding." },
    ],
  }),
  component: OpeningScreen,
});

type Stage = "poster" | "playing" | "revealed" | "savedate";

function OpeningScreen() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const introRef = useRef<HTMLVideoElement>(null);
  const introBgRef = useRef<HTMLVideoElement>(null);
  const [stage, setStage] = useState<Stage>("poster");

  const handleOpen = async () => {
    if (stage !== "poster") return;
    const v = videoRef.current;
    if (!v) return;
    setStage("playing");
    try {
      await v.play();
    } catch {
      setStage("revealed");
    }
  };

  useEffect(() => {
    if (stage !== "revealed") return;
    introRef.current?.play().catch(() => {});
    introBgRef.current?.play().catch(() => {});
  }, [stage]);

  return (
    <main className="relative h-[100svh] w-full overflow-hidden bg-ivory">
      {/* Video layer */}
      <div
        onClick={handleOpen}
        className={`absolute inset-0 cursor-pointer transition-opacity duration-1000 ${
          stage === "revealed" || stage === "savedate" ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <video
          ref={videoRef}
          src={videoAsset.url}
          poster={posterAsset.url}
          preload="metadata"
          playsInline
          muted
          onEnded={() => setStage("revealed")}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Soft vignette + tint */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, oklch(0.2 0.02 30 / 0.55) 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 mix-blend-soft-light"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.95 0.04 80 / 0.25) 0%, transparent 40%, oklch(0.82 0.06 22 / 0.18) 100%)",
          }}
        />

        {/* Overlay text — only on poster */}
        {stage === "poster" && (
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 px-6 text-center sm:pb-28">
            <p
              className="font-serif text-[0.7rem] uppercase tracking-[0.45em] text-ivory/85 animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              You are invited
            </p>

            <h1
              className="mt-6 text-5xl sm:text-6xl text-gold-gradient animate-fade-up"
              style={{
                fontFamily: "var(--font-script)",
                animationDelay: "0.5s",
                textShadow: "0 2px 24px oklch(0.2 0.02 30 / 0.45)",
              }}
            >
              Tap to Open
            </h1>

            <div
              className="mt-5 flex items-center gap-3 animate-fade-up"
              style={{ animationDelay: "0.9s" }}
            >
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold/70" />
              <span className="text-[0.65rem] uppercase tracking-[0.5em] text-ivory/90 animate-soft-pulse">
                Tap anywhere
              </span>
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold/70" />
            </div>

            <p
              className="mt-4 text-xs tracking-[0.3em] uppercase text-ivory/70 animate-shimmer-in"
              style={{ animationDelay: "1.1s" }}
            >
              Your Invitation
            </p>
          </div>
        )}
      </div>

      {/* Intro video section */}
      <section
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-[1400ms] ease-out ${
          stage === "revealed" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ backgroundColor: "oklch(0.16 0.015 30)" }}
      >
        {/* Blurred backdrop layer */}
        <video
          ref={introBgRef}
          src={introAsset.url}
          playsInline
          muted
          loop
          preload="auto"
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover scale-125 blur-2xl opacity-40"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 30%, oklch(0.12 0.015 30 / 0.85) 100%)",
          }}
        />

        {/* Foreground intro video */}
        <video
          ref={introRef}
          src={introAsset.url}
          playsInline
          muted
          preload="auto"
          onEnded={() => setStage("savedate")}
          className="relative z-10 max-h-full max-w-full h-full w-full object-contain"
        />
      </section>

      {/* Save the Date + Countdown */}
      <div
        className={`absolute inset-0 transition-opacity duration-[1400ms] ease-out overflow-y-auto ${
          stage === "savedate" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <SaveTheDate />
        <WeddingCountdown />
      </div>

    </main>
  );
}
