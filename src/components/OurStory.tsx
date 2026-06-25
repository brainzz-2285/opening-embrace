import { useEffect, useRef, useState } from "react";
import { FloatingPetals } from "./FloatingPetals";
import photo1 from "@/assets/story-1.jpg.asset.json";
import photo2 from "@/assets/story-2.jpg.asset.json";
import photo3 from "@/assets/story-3.jpg.asset.json";

const PHOTOS = [
  { src: photo1.url, rotate: -5 },
  { src: photo2.url, rotate: 4 },
  { src: photo3.url, rotate: -3 },
];

export function OurStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0); // 0..1 across the whole pinned scroll

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      setProgress(total > 0 ? scrolled / total : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Two transitions: photo2 enters during 0..0.5, photo3 enters during 0.5..1
  const getCardStyle = (index: number): React.CSSProperties => {
    const baseRotate = PHOTOS[index].rotate;
    if (index === 0) {
      return {
        transform: `translate3d(-50%, -50%, 0) rotate(${baseRotate}deg)`,
        zIndex: 1,
      };
    }
    // index 1 → segment 0..0.5; index 2 → segment 0.5..1
    const segStart = (index - 1) * 0.5;
    const segEnd = segStart + 0.5;
    const local = Math.min(Math.max((progress - segStart) / (segEnd - segStart), 0), 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - local, 3);
    const translateY = 120 - eased * 120; // starts 120% below, settles at 0
    const rotate = baseRotate * eased; // rotates into place
    return {
      transform: `translate3d(-50%, calc(-50% + ${translateY}vh), 0) rotate(${rotate}deg)`,
      zIndex: index + 1,
      opacity: local > 0 ? 1 : 0,
    };
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ height: "300vh", backgroundColor: "#FCF8F4" }}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <FloatingPetals count={14} />

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 pt-12 sm:pt-16 px-6 text-center pointer-events-none">
          <p
            className="text-[0.65rem] sm:text-xs uppercase tracking-[0.5em]"
            style={{ color: "#b58863", fontFamily: "var(--font-serif)" }}
          >
            Our Story
          </p>
          <h2
            className="mt-3 text-4xl sm:text-5xl md:text-6xl text-gold-gradient"
            style={{ fontFamily: "var(--font-script)" }}
          >
            Forever Us
          </h2>
          <div className="mx-auto mt-3 h-px w-16 bg-gradient-to-r from-transparent via-[#c9a36a] to-transparent" />
        </div>

        {/* Stacked polaroids */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full">
            {PHOTOS.map((p, i) => (
              <div
                key={i}
                className="absolute left-1/2 top-1/2 will-change-transform transition-transform"
                style={{
                  ...getCardStyle(i),
                  transitionDuration: "120ms",
                  transitionTimingFunction: "ease-out",
                }}
              >
                <div
                  className="bg-white p-3 pb-12 sm:p-4 sm:pb-16"
                  style={{
                    boxShadow:
                      "0 30px 60px -20px rgba(120, 80, 60, 0.35), 0 12px 24px -8px rgba(120, 80, 60, 0.2)",
                    borderRadius: "4px",
                  }}
                >
                  <img
                    src={p.src}
                    alt=""
                    draggable={false}
                    className="block object-cover select-none"
                    style={{
                      width: "min(72vw, 320px)",
                      height: "min(96vw, 420px)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
