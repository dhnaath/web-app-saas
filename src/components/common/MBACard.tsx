import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Star, ArrowRight, RotateCcw } from "lucide-react";

export interface MBACardFeatureItem {
  title: string;
  to: string;
  icon?: React.ComponentType<{ className?: string; size?: number }>;
  desc?: string;
}

export interface MBACardProps {
  id?: string;
  title: string;
  to: string;
  icon: React.ComponentType<{ className?: string; size?: number; strokeWidth?: number }>;
  badge?: string;
  shortDesc?: string;
  features?: MBACardFeatureItem[];
  isFav: boolean;
  toggleFavorite: (to: string) => void;
  gradient?: string;
  accentGradient?: string;
}

const GRADIENT_PALETTES = [
  "bg-linear-to-br from-blue-500 to-indigo-700",
  "bg-linear-to-br from-indigo-500 to-purple-700",
  "bg-linear-to-br from-purple-500 to-pink-700",
  "bg-linear-to-br from-rose-500 to-red-700",
  "bg-linear-to-br from-amber-500 to-orange-700",
  "bg-linear-to-br from-emerald-500 to-teal-700",
  "bg-linear-to-br from-cyan-500 to-blue-700",
  "bg-linear-to-br from-violet-500 to-fuchsia-700",
  "bg-linear-to-br from-fuchsia-500 to-rose-700",
  "bg-linear-to-br from-sky-500 to-blue-700",
  "bg-linear-to-br from-teal-500 to-emerald-700",
];

function getHashGradient(title: string): string {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % GRADIENT_PALETTES.length;
  return GRADIENT_PALETTES[idx];
}

export function MBACard({
  title,
  to,
  icon: Icon,
  badge,
  shortDesc,
  features = [],
  isFav,
  toggleFavorite,
  gradient,
  accentGradient,
}: MBACardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [interactionConfig, setInteractionConfig] = useState(() => ({
    axis: Math.random() > 0.5 ? "x" : "y",
    dir: Math.random() > 0.5 ? 1 : -1,
  }));

  const handleFlip = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setInteractionConfig((prev) => {
      let nextAxis = prev.axis;
      let nextDir = prev.dir;
      while (nextAxis === prev.axis && nextDir === prev.dir) {
        nextAxis = Math.random() > 0.5 ? "x" : "y";
        nextDir = Math.random() > 0.5 ? 1 : -1;
      }
      return { axis: nextAxis, dir: nextDir };
    });
    setIsFlipped((prev) => !prev);
  };

  const cardGradient =
    gradient ||
    (accentGradient
      ? accentGradient.startsWith("bg-")
        ? accentGradient
        : `bg-gradient-to-br ${accentGradient}`
      : getHashGradient(title));

  const mainPath = to.split("?")[0];
  const mainSearch = to.includes("?")
    ? Object.fromEntries(new URLSearchParams(to.split("?")[1]))
    : undefined;

  return (
    <div className="w-full [perspective:1000px] min-h-[300px]">
      <motion.div
        className="relative w-full h-full min-h-[300px] [transform-style:preserve-3d]"
        animate={{
          rotateX: isFlipped && interactionConfig.axis === "x" ? 180 * interactionConfig.dir : 0,
          rotateY: isFlipped && interactionConfig.axis === "y" ? 180 * interactionConfig.dir : 0,
        }}
        transition={{ duration: 0.6, type: "spring", stiffness: 80, damping: 15 }}
      >
        {/* Front Face (Gaya Kotak Tools 100 MBA) */}
        <div className="w-full h-full rounded-2xl border border-border bg-card p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4 group [backface-visibility:hidden]">
          <div>
            <div className="flex items-start justify-between gap-3">
              <Link
                to={mainPath as any}
                search={mainSearch as any}
                className="flex items-center gap-3.5 group/header min-w-0 flex-1 outline-none"
              >
                <div
                  className={`h-12 w-12 rounded-full flex items-center justify-center text-white shadow-xs shrink-0 ${cardGradient} group-hover/header:scale-105 transition-transform`}
                >
                  <Icon className="h-6 w-6 opacity-90 drop-shadow-sm" strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-base text-foreground group-hover/header:text-primary transition-colors truncate">
                    {title}
                  </h4>
                  {badge && (
                    <span className="text-[11px] text-muted-foreground truncate block mt-0.5">
                      {badge}
                    </span>
                  )}
                </div>
              </Link>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFavorite(to);
                }}
                className={`p-1.5 rounded-xl border transition-all cursor-pointer active:scale-95 shrink-0 ${
                  isFav
                    ? "border-amber-400/50 bg-amber-400/10 text-amber-400 shadow-xs"
                    : "border-border/60 hover:border-amber-400/30 hover:bg-muted/60 text-muted-foreground hover:text-amber-400"
                }`}
                title={isFav ? "Hapus dari Favorit Dock" : "Tambah ke Favorit Dock (Maksimal 5)"}
                aria-label={isFav ? `Hapus ${title} dari favorit` : `Tambahkan ${title} ke favorit dock`}
              >
                <Star
                  className={`size-4 transition-transform ${
                    isFav ? "fill-amber-400 text-amber-400 scale-110" : ""
                  }`}
                />
              </button>
            </div>

            <div className="mt-3 pt-3 border-t border-border/60">
              <span className="text-[10px] font-bold tracking-wider text-muted-foreground block mb-2 text-center">
                Features ({features.length}):
              </span>

              <div className="flex flex-wrap justify-center gap-1.5 max-h-[195px] overflow-y-auto pr-0.5 [scrollbar-width:thin]">
                {features.map((feat, idx) => {
                  const FeatIcon = feat.icon || Icon;
                  const featPath = feat.to.split("?")[0];
                  const featSearch = feat.to.includes("?")
                    ? Object.fromEntries(new URLSearchParams(feat.to.split("?")[1]))
                    : undefined;

                  return (
                    <Link
                      key={idx}
                      to={featPath as any}
                      search={featSearch as any}
                      title={feat.desc || feat.title}
                      className="min-w-[calc((100%-0.75rem)/3)] max-w-full inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted/60 hover:bg-primary/10 hover:text-primary text-[11px] font-medium text-foreground transition-all cursor-pointer border border-border/40 hover:border-primary/30 group/chip"
                    >
                      <FeatIcon size={12} className="text-primary shrink-0 group-hover/chip:scale-110 transition-transform" />
                      <span className="text-center leading-snug whitespace-normal">{feat.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="border-t border-border/50 pt-3 flex items-center justify-end text-xs">
            <button
              type="button"
              onClick={handleFlip}
              className="px-2.5 py-1 rounded-lg border border-border/70 hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors shadow-2xs group/btn"
              title="Lihat Related"
            >
              <span className="text-[11px]">Related</span>
              <ArrowRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Back Face (Warna gradien app + rincian + tombol kembali persis Tools 100 MBA) */}
        <div
          className={`absolute inset-0 w-full h-full rounded-2xl ${cardGradient} p-5 shadow-lg border border-white/20 flex flex-col justify-between overflow-hidden [backface-visibility:hidden]`}
          style={{
            transform:
              interactionConfig.axis === "x"
                ? `rotateX(${180 * interactionConfig.dir}deg)`
                : `rotateY(${180 * interactionConfig.dir}deg)`,
          }}
        >
          <div className="space-y-2.5 text-white">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0">
                <Icon size={16} strokeWidth={2} />
              </div>
              <h5 className="font-bold text-sm text-white truncate drop-shadow-xs">{title}</h5>
            </div>
            {shortDesc && (
              <p className="text-xs text-white/90 leading-relaxed line-clamp-5 drop-shadow-2xs">
                {shortDesc}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between w-full pt-3 border-t border-white/15">
            <Link
              to={mainPath as any}
              search={mainSearch as any}
              className="px-3 py-1.5 rounded-lg bg-white/95 hover:bg-white text-slate-900 text-xs font-bold active:scale-95 transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Buka</span>
              <ArrowRight size={12} />
            </Link>

            <button
              type="button"
              onClick={handleFlip}
              className="px-2.5 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 active:scale-95 text-white border border-white/25 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs backdrop-blur-xs"
              title="Kembali"
            >
              <RotateCcw size={12} />
              <span className="text-[11px] font-medium">Kembali</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
