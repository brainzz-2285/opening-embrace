import { useEffect, useRef, useState } from "react";

type Props = {
  label: string;
  value: string;
  onReveal: () => void;
};

export function ScratchCard({ label, value, onReveal }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const drawingRef = useRef(false);
  const revealedRef = useRef(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      paintFoil();
    };

    const paintFoil = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const w = canvas.width;
      const h = canvas.height;

      // Rose-gold foil gradient
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, "#e8b9a3");
      grad.addColorStop(0.35, "#f4d3bf");
      grad.addColorStop(0.55, "#d99b82");
      grad.addColorStop(0.8, "#f0c3aa");
      grad.addColorStop(1, "#b87d68");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Subtle shimmer streaks
      ctx.globalAlpha = 0.14;
      for (let i = 0; i < 5; i++) {
        const x = (i / 5) * w + Math.random() * 20;
        ctx.fillStyle = i % 2 === 0 ? "#fff" : "#7a4a3b";
        ctx.fillRect(x, 0, 2 * dpr, h);
      }
      ctx.globalAlpha = 1;

      // SCRATCH text — readable, centered
      const scratchText = "SCRATCH";
      const fontSize = Math.min(18 * dpr, w * 0.18);
      ctx.font = `${fontSize}px "Cormorant Garamond", "Georgia", serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "rgba(110, 60, 45, 0.82)";

      const totalWidth = ctx.measureText(scratchText).width;
      const spacing = fontSize * 0.55;
      const drawnWidth = totalWidth + spacing * (scratchText.length - 1);
      const startX = (w - drawnWidth) / 2;
      for (let i = 0; i < scratchText.length; i++) {
        const char = scratchText[i];
        const charWidth = ctx.measureText(char).width;
        const x = startX + i * (totalWidth / scratchText.length + spacing) + charWidth / 2;
        ctx.fillText(char, x, h / 2);
      }

    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const ctx = canvas.getContext("2d")!;
    ctx.globalCompositeOperation = "destination-out";

    const pointerPos = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left) * dpr,
        y: (e.clientY - rect.top) * dpr,
      };
    };

    const scratchAt = (x: number, y: number) => {
      ctx.beginPath();
      ctx.arc(x, y, 26 * dpr, 0, Math.PI * 2);
      ctx.fill();
    };

    let lastCheck = 0;
    const checkProgress = () => {
      const now = performance.now();
      if (now - lastCheck < 120) return;
      lastCheck = now;
      const { width, height } = canvas;
      const step = Math.max(8, Math.floor(width / 30));
      const data = ctx.getImageData(0, 0, width, height).data;
      let cleared = 0;
      let total = 0;
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const idx = (y * width + x) * 4 + 3;
          if (data[idx] === 0) cleared++;
          total++;
        }
      }
      if (cleared / total > 0.45 && !revealedRef.current) {
        revealedRef.current = true;
        setRevealed(true);
        // Clear remaining foil
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fillRect(0, 0, width, height);
        onReveal();
      }
    };

    const onDown = (e: PointerEvent) => {
      if (revealedRef.current) return;
      drawingRef.current = true;
      canvas.setPointerCapture(e.pointerId);
      const { x, y } = pointerPos(e);
      scratchAt(x, y);
    };
    const onMove = (e: PointerEvent) => {
      if (!drawingRef.current || revealedRef.current) return;
      const { x, y } = pointerPos(e);
      scratchAt(x, y);
      checkProgress();
    };
    const onUp = () => {
      drawingRef.current = false;
      checkProgress();
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("pointerleave", onUp);

    return () => {
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("pointerleave", onUp);
    };
  }, [onReveal]);

  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-[0.65rem] uppercase tracking-[0.45em] text-gold-deep/80 font-serif">
        {label}
      </span>
      <div
        ref={containerRef}
        className="group relative h-32 w-24 sm:h-36 sm:w-28 rounded-xl overflow-hidden transition-transform duration-500 hover:-translate-y-1"
        style={{
          background: "#ffffff",
          boxShadow:
            "0 8px 28px -10px rgba(184,125,104,0.45), 0 2px 6px -2px rgba(120,70,55,0.18), inset 0 0 0 1px rgba(216,167,140,0.35)",
        }}
      >

        {/* Reveal value */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${
            revealed ? "scale-100 opacity-100" : "scale-95 opacity-90"
          }`}
        >
          <span
            className="text-gold-gradient font-serif"
            style={{
              fontSize: "2.25rem",
              letterSpacing: "0.05em",
              filter: revealed
                ? "drop-shadow(0 2px 12px rgba(200,140,90,0.45))"
                : "none",
            }}
          >
            {value}
          </span>
        </div>

        {/* Scratch canvas */}
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 touch-none transition-opacity duration-700 ${
            revealed ? "opacity-0 pointer-events-none" : "opacity-100 cursor-grab active:cursor-grabbing"
          }`}
        />

        {/* Inner border / glow */}
        <div
          className="pointer-events-none absolute inset-0 rounded-xl"
          style={{
            boxShadow: revealed
              ? "0 0 24px 2px rgba(220,170,120,0.45), inset 0 0 0 1px rgba(200,150,110,0.5)"
              : "inset 0 0 0 1px rgba(255,255,255,0.35)",
            transition: "box-shadow 700ms ease",
          }}
        />
      </div>
    </div>
  );
}
