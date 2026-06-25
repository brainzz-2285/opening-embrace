import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import videoAsset from "@/assets/opening-envelope.mp4.asset.json";
import posterAsset from "@/assets/opening-envelope-poster.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Our Wedding Invitation" },
      { name: "description", content: "You are warmly invited to celebrate our wedding." },
    ],
  }),
  component: OpeningScreen,
});

type Stage = "poster" | "playing" | "revealed";

function OpeningScreen() {
  const videoRef = useRef<HTMLVideoElement>(null);
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

  return (
    <main className="relative h-[100svh] w-full overflow-hidden bg-ivory">
      {/* Video layer */}
      <div
        onClick={handleOpen}
        className={`absolute inset-0 cursor-pointer transition-opacity duration-1000 ${
          stage === "revealed" ? "opacity-0 pointer-events-none" : "opacity-100"
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

      {/* Invitation placeholder */}
      <section
        className={`absolute inset-0 flex items-center justify-center px-6 transition-opacity duration-[1400ms] ease-out ${
          stage === "revealed" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{
          background:
            "radial-gradient(ellipse at top, oklch(0.95 0.04 80) 0%, var(--ivory) 60%, oklch(0.92 0.035 25 / 0.6) 100%)",
        }}
      >
        <div className="text-center max-w-md animate-fade-up">
          <p className="text-[0.7rem] uppercase tracking-[0.5em] text-gold-deep/80">
            Together with their families
          </p>
          <h2
            className="mt-8 text-6xl sm:text-7xl text-gold-gradient"
            style={{ fontFamily: "var(--font-script)" }}
          >
            Our Story Begins
          </h2>
          <div className="mx-auto mt-8 flex items-center justify-center gap-3">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
            <span className="text-gold-deep">✦</span>
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold" />
          </div>
          <p className="mt-8 font-serif text-lg italic text-muted-foreground">
            Invitation details coming soon
          </p>
        </div>
      </section>
    </main>
  );
}
