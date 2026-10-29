import React, { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Star } from "lucide-react";

interface CardMoreMenuProps {
  title: string;
  isFav: boolean;
  onToggleFavorite: () => void;
}

export function CardMoreMenu({
  title,
  isFav,
  onToggleFavorite,
}: CardMoreMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className="relative shrink-0"
      onPointerDown={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className={`p-1.5 rounded-xl border transition-all cursor-pointer active:scale-95 shrink-0 flex items-center justify-center ${
          isOpen
            ? "border-border bg-muted text-foreground shadow-2xs"
            : "border-border/60 hover:border-border hover:bg-muted/60 text-muted-foreground hover:text-foreground"
        }`}
        title="Opsi lainnya"
        aria-label={`Opsi untuk ${title}`}
        aria-expanded={isOpen}
      >
        <MoreHorizontal className="size-4" />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-1.5 z-40 min-w-[168px] rounded-xl border border-border bg-popover text-popover-foreground p-1 shadow-lg animate-in fade-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite();
              setIsOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              isFav
                ? "bg-amber-400/10 text-amber-500 hover:bg-amber-400/20"
                : "text-foreground hover:bg-muted"
            }`}
            title={
              isFav
                ? "Hapus dari Favorit Dock"
                : "Tambah ke Favorit Dock (Maksimal 5)"
            }
          >
            <Star
              className={`size-3.5 shrink-0 transition-transform ${
                isFav
                  ? "fill-amber-400 text-amber-400 scale-110"
                  : "text-muted-foreground"
              }`}
            />
            <span className="whitespace-nowrap">
              {isFav ? "Hapus dari Favorit" : "Tambah ke Favorit"}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
