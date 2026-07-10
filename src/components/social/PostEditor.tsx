"use client";

import { forwardRef, useImperativeHandle, useRef, useState, type PointerEvent } from "react";
import { Type } from "lucide-react";
import { cn } from "@/lib/utils";

const FILTERS = [
  { value: "none", label: "Original", css: "none" },
  { value: "mono", label: "Mono", css: "grayscale(1) contrast(1.05)" },
  { value: "warm", label: "Warm", css: "sepia(0.35) saturate(1.4) brightness(1.05)" },
  { value: "cool", label: "Cool", css: "hue-rotate(-15deg) saturate(1.2) brightness(1.02)" },
  { value: "vivid", label: "Vivid", css: "saturate(1.6) contrast(1.15)" },
  { value: "fade", label: "Fade", css: "contrast(0.85) brightness(1.1) saturate(0.75)" },
] as const;

type FilterValue = (typeof FILTERS)[number]["value"];

const TEXT_COLORS = ["#ffffff", "#ff4d2e", "#1ec98b", "#111111"];

interface TextLayer {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
}

export interface PostEditorHandle {
  exportBlob: () => Promise<Blob | null>;
}

interface PostEditorProps {
  imageUrl: string;
}

/**
 * Instagram/Snap-style edit step shown after picking an image: filter
 * presets plus a draggable text overlay. Everything here is preview-only
 * (CSS filter + absolutely-positioned text inputs) - exportBlob() is what
 * actually bakes the filter and text into the pixels via canvas, which is
 * what gets uploaded, not the raw picked file.
 */
export const PostEditor = forwardRef<PostEditorHandle, PostEditorProps>(function PostEditor({ imageUrl }, ref) {
  const [filter, setFilter] = useState<FilterValue>("none");
  const [layers, setLayers] = useState<TextLayer[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const dragState = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);

  const activeFilterCss = FILTERS.find((f) => f.value === filter)?.css ?? "none";

  function addText() {
    setLayers((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text: "Double-tap to recolor", x: 0.5, y: 0.5, color: TEXT_COLORS[0] },
    ]);
  }

  function updateLayerText(id: string, text: string) {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, text } : l)));
  }

  function cycleLayerColor(id: string) {
    setLayers((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l;
        const idx = TEXT_COLORS.indexOf(l.color);
        return { ...l, color: TEXT_COLORS[(idx + 1) % TEXT_COLORS.length] };
      }),
    );
  }

  function removeLayer(id: string) {
    setLayers((prev) => prev.filter((l) => l.id !== id));
  }

  function handlePointerDown(e: PointerEvent<HTMLDivElement>, id: string) {
    const container = containerRef.current;
    const layer = layers.find((l) => l.id === id);
    if (!container || !layer) return;
    const rect = container.getBoundingClientRect();
    dragState.current = {
      id,
      offsetX: e.clientX - (rect.left + layer.x * rect.width),
      offsetY: e.clientY - (rect.top + layer.y * rect.height),
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    const drag = dragState.current;
    const container = containerRef.current;
    if (!drag || !container) return;
    const rect = container.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (e.clientX - drag.offsetX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (e.clientY - drag.offsetY - rect.top) / rect.height));
    setLayers((prev) => prev.map((l) => (l.id === drag.id ? { ...l, x, y } : l)));
  }

  function handlePointerUp() {
    dragState.current = null;
  }

  useImperativeHandle(ref, () => ({
    async exportBlob() {
      const img = imgRef.current;
      if (!img) return null;

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      ctx.filter = activeFilterCss;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.filter = "none";

      for (const layer of layers) {
        const fontSize = Math.round(canvas.width * 0.07);
        ctx.font = `700 ${fontSize}px sans-serif`;
        ctx.fillStyle = layer.color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "rgba(0,0,0,0.45)";
        ctx.shadowBlur = 8;
        ctx.fillText(layer.text, layer.x * canvas.width, layer.y * canvas.height);
      }

      return await new Promise<Blob | null>((resolve) => canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.92));
    },
  }));

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={containerRef}
        className="relative touch-none select-none overflow-hidden rounded-lg border border-border bg-black"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={imageUrl}
          alt="Selected preview"
          className="max-h-72 w-full object-contain"
          style={{ filter: activeFilterCss }}
        />
        {layers.map((layer) => (
          <div
            key={layer.id}
            onPointerDown={(e) => handlePointerDown(e, layer.id)}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-move touch-none"
            style={{ left: `${layer.x * 100}%`, top: `${layer.y * 100}%` }}
          >
            <input
              value={layer.text}
              onChange={(e) => updateLayerText(layer.id, e.target.value)}
              onDoubleClick={() => cycleLayerColor(layer.id)}
              style={{ color: layer.color }}
              className="w-44 border-none bg-transparent text-center text-lg font-bold outline-none [text-shadow:0_1px_6px_rgba(0,0,0,0.6)]"
            />
          </div>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              filter === f.value
                ? "border-signal bg-signal/10 text-signal"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={addText}
          className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <Type size={13} />
          Add text
        </button>
        {layers.length > 0 && (
          <button
            type="button"
            onClick={() => removeLayer(layers[layers.length - 1].id)}
            className="text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            Remove last text
          </button>
        )}
      </div>
    </div>
  );
});
