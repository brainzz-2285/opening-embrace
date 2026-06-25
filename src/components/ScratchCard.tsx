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

    const paintFoil = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      if (w === 0 || h === 0) return;

      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, w, h);

      // Base metallic rose-gold gradient (diagonal)
      const base = ctx.createLinearGradient(0, 0, w, h);
      base.addColorStop(0.0, "#c98a72");
      base.addColorStop(0.18, "#e8b89e");
      base.addColorStop(0.35, "#f6d7c1");
      base.addColorStop(0.5, "#efc2a8");
      base.addColorStop(0.65, "#f5d2bb");
      base.addColorStop(0.82, "#d49a82");
      base.addColorStop(1.0, "#b07a65");
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, w, h);

      // Diagonal reflective shine bands
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate(-Math.PI / 4);
      const bandLen = Math.hypot(w, h);
      const bands = [
        { offset: -bandLen * 0.25, width: bandLen * 0.06, alpha: 0.35 },
        { offset: -bandLen * 0.05, width: bandLen * 0.12, alpha: 0.22 },
        { offset: bandLen * 0.18, width: bandLen * 0.05, alpha: 0.28 },
      ];
      for (const b of bands) {
        const g = ctx.createLinearGradient(b.offset, 0, b.offset + b.width, 0);
        g.addColorStop(0, "rgba(255,255,255,0)");
        g.addColorStop(0.5, `rgba(255,245,232,${b.alpha})`);
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g;
        ctx.fillRect(b.offset, -bandLen, b.width, bandLen * 2);
      }
      ctx.restore();

      // Fine foil grain
      ctx.globalAlpha = 0.08;
      for (let i = 0; i < 90; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        ctx.fillStyle = Math.random() > 0.5 ? "#fff1e0" : "#7a4a3b";
        ctx.fillRect(x, y, 1 * dpr, 1 * dpr);
      }
      ctx.globalAlpha = 1;

      // SCRATCH text — centered
      const text = "SCRATCH";
      const fontSize = Math.max(14 * dpr, Math.min(22 * dpr, w * 0.13));
      ctx.font = `600 ${fontSize}px "Cormorant Garamond", Georgia, serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "rgba(110,55,40,0.78)";
      ctx.shadowColor = "rgba(255,240,225,0.6)";
      ctx.shadowBlur = 2 * dpr;
      // letter spacing via manual draw
      const letters = text.split("");
      const spacing = fontSize * 0.18;
      const widths = letters.map((l) => ctx.measureText(l).width);
      const total = widths.reduce((a, b) => a + b, 0) + spacing * (letters.length - 1);
      let cx = w / 2 - total / 2;
      for (let i = 0; i < letters.length; i++) {
        ctx.fillText(letters[i], cx + widths[i] / 2, h / 2);
        cx += widths[i] + spacing;
      }
      ctx.shadowBlur = 0;

      ctx.globalCompositeOperation = "destination-out";
    };

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      if (width === 0 || height === 0) return;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      if (!revealedRef.current) paintFoil();
    };

    requestAnimationFrame(resize);
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const ctx = canvas.getContext("2d")!;

    const pointerPos = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left) * dpr,
        y: (e.clientY - rect.top) * dpr,
      };
    };

    const scratchAt = (x: number, y: number) => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 28 * dpr, 0, Math.PI * 2);
      ctx.fill();
    };

    let lastCheck = 0;
    const checkProgress = () => {
      const now = performance.now();
      if (now - lastCheck < 120) return;
      lastCheck = now;
      const { width, height } = canvas;
      if (width === 0 || height === 0) return;
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
      if (cleared / total > 0.5 && !revealedRef.current) {
        revealedRef.current = true;
        setRevealed(true);
        ctx.globalCompositeOperation = "destination-out";
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

    return () => {
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
    };
  }, [onReveal]);

  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-[0.65rem] uppercase tracking-[0.45em] text-gold-deep/80 font-serif">
        {label}
      </span>
      <div
        ref={containerRef}
        className="group relative h-40 w-30 sm:h-44 sm:w-36 transition-transform duration-500 hover:-translate-y-1"
        style={{
          width: "7.5rem",
          borderRadius: "20px",
          overflow: "hidden",
          background: "#ffffff",
          boxShadow:
            "0 14px 38px -14px rgba(184,125,104,0.55), 0 4px 10px -3px rgba(120,70,55,0.20), 0 0 0 1px rgba(216,167,140,0.30), inset 0 0 0 1px rgba(255,255,255,0.4)",
        }}
      >
        {/* Reveal value */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${
            revealed ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <span
            className="font-serif"
            style={{
              fontSize: "2.5rem",
              letterSpacing: "0.05em",
              color: "#7a4a3b",
              textShadow: "0 1px 0 rgba(255,255,255,0.85), 0 0 18px rgba(220,170,120,0.35)",
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
          style={{ borderRadius: "20px" }}
        />

        {/* Glow ring after reveal */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            borderRadius: "20px",
            boxShadow: revealed
              ? "0 0 28px 2px rgba(220,170,120,0.5), inset 0 0 0 1px rgba(200,150,110,0.5)"
              : "inset 0 0 0 1px rgba(255,255,255,0.35)",
            transition: "box-shadow 700ms ease",
          }}
        />
      </div>
    </div>
  );
}
