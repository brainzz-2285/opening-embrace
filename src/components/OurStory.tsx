import { useEffect, useRef, useState } from "react";
import { FloatingPetals } from "./FloatingPetals";
import photo1 from "@/assets/story-1.jpg.asset.json";
import photo2 from "@/assets/story-2.jpg.asset.json";
import photo3 from "@/assets/story-3.jpg.asset.json";

// Small resting offsets so previous photos peek out behind the top card.
const PHOTOS = [
  { src: photo1.url, restX: -3, restY: -2, rotate: -6 },
  { src: photo2.url, restX: 3, restY: 1, rotate: 4 },
  { src: photo3.url, restX: -1, restY: 3, rotate: -3 },
];

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

function getScrollParent(node: HTMLElement | null): HTMLElement | Window {
  let el: HTMLElement | null = node?.parentElement ?? null;
  while (el) {
    const style = getComputedStyle(el);
    const oy = style.overflowY;
    if ((oy === "auto" || oy === "scroll") && el.scrollHeight > el.clientHeight) {
      return el;
    }
    el = el.parentElement;
  }
  return window;
}

export function OurStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const scrollParent = getScrollParent(el);

    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = el.offsetHeight - vh;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      setProgress(total > 0 ? scrolled / total : 0);
    };

    update();
    const target: EventTarget = scrollParent;
    target.addEventListener("scroll", update, { passive: true } as AddEventListenerOptions);
    window.addEventListener("resize", update);
    return () => {
      target.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Photo i (i>=1) enters during [(i-1)/2, i/2] of progress.
  const getCardStyle = (index: number): React.CSSProperties => {
    const { restX, restY, rotate } = PHOTOS[index];
    if (index === 0) {
      return {
        transform: `translate3d(calc(-50% + ${restX}vw), calc(-50% + ${restY}vh), 0) rotate(${rotate}deg)`,
        zIndex: 1,
        opacity: 1,
      };
    }
    const segStart = (index - 1) / (PHOTOS.length - 1);
    const segEnd = index / (PHOTOS.length - 1);
    const local = Math.min(Math.max((progress - segStart) / (segEnd - segStart), 0), 1);
    const eased = easeOutCubic(local);
    const startY = 110; // vh below center
    const y = startY + (restY - startY) * eased;
    const x = restX * eased;
    const r = rotate * eased;
    return {
      transform: `translate3d(calc(-50% + ${x}vw), calc(-50% + ${y}vh), 0) rotate(${r}deg)`,
      zIndex: index + 1,
      opacity: local > 0.02 ? 1 : 0,
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

        <div className="absolute top-0 left-0 right-0 z-20 pt-10 sm:pt-14 px-6 text-center pointer-events-none">
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

        <div className="absolute inset-0">
          {PHOTOS.map((p, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 will-change-transform"
              style={{
                ...getCardStyle(i),
                transition: "transform 200ms ease-out, opacity 250ms ease-out",
              }}
            >
              <div
                className="bg-white p-3 pb-12 sm:p-4 sm:pb-16"
                style={{
                  boxShadow:
                    "0 30px 60px -20px rgba(120,80,60,0.35), 0 12px 24px -8px rgba(120,80,60,0.2)",
                  borderRadius: "4px",
                }}
              >
                <img
                  src={p.src}
                  alt=""
                  draggable={false}
                  className="block object-cover select-none"
                  style={{
                    width: "min(64vw, 280px)",
                    height: "min(85vw, 370px)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
