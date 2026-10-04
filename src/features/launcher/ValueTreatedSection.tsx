import React, { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Gem,
  GraduationCap,
  Search,
  X,
  Star,
  RotateCcw,
  ArrowRight,
  Layers,
} from "lucide-react";
import {
  JENJANG_LEVELS,
  CURRICULUM_DISCIPLINES,
} from "@/features/curated/curriculumData";

interface ValueTreatedSectionProps {
  favorites: string[];
  toggleFavorite: (to: string) => void;
  getGradient?: (title: string) => string;
}

export function ValueTreatedSection({
  favorites,
  toggleFavorite,
}: ValueTreatedSectionProps) {
  // 5 Jenjang Level SKS (Default: 2 = Matrikulasi)
  const [activeJenjangId, setActiveJenjangId] = useState<number>(2);
  const [searchQuery, setSearchQuery] = useState("");
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const currentJenjang = useMemo(() => {
    return JENJANG_LEVELS.find((j) => j.id === activeJenjangId) || JENJANG_LEVELS[0];
  }, [activeJenjangId]);

  const q = searchQuery.toLowerCase().trim();

  // 10 Bidang Value tetap ada, fitur menyesuaikan dengan activeJenjangId
  const filteredDisciplines = useMemo(() => {
    return CURRICULUM_DISCIPLINES.filter((disc) => {
      if (!q) return true;
      const features = disc.featuresByLevel[activeJenjangId] || [];
      const matchesTitle = disc.title.toLowerCase().includes(q);
      const matchesSubtitle = disc.subtitle.toLowerCase().includes(q);
      const matchesFeature = features.some((f) => f.toLowerCase().includes(q));
      return matchesTitle || matchesSubtitle || matchesFeature;
    });
  }, [activeJenjangId, q]);

  const toggleFlip = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFlippedCards((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  return (
    <div className="w-full flex flex-col items-center font-sans space-y-4">
      {/* Title & Description */}
      <div className="text-center max-w-3xl mx-auto space-y-1">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex items-center justify-center gap-2.5">
          <Gem className="size-7 text-amber-500 shrink-0" />
          <span>Struktur Silabus Nilai & Kurikulum Terapan</span>
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Pilih salah satu dari <strong>5 Jenjang Pembelajaran</strong> di bawah ini. Ke-10 bidang nilai di bawahnya akan secara otomatis menyesuaikan daftar fitur materinya.
        </p>
      </div>

      {/* Kategori Atas: 5 JENJANG (Matrikulasi, 1 SKS, 2 SKS, 3 SKS, + Praktikum) */}
      <div className="w-full flex items-center justify-start sm:justify-center gap-2.5 overflow-x-auto pb-1 no-scrollbar flex-nowrap sm:flex-wrap px-2">
        {JENJANG_LEVELS.map((jenjang) => {
          const isActive = activeJenjangId === jenjang.id;
          return (
            <button
              key={jenjang.id}
              type="button"
              onClick={() => {
                setActiveJenjangId(jenjang.id);
                setFlippedCards({});
              }}
              className={`px-4 sm:px-5 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center gap-2.5 shrink-0 border ${
                isActive
                  ? "bg-amber-500 text-white border-amber-500 shadow-md ring-2 ring-amber-500/30 scale-105"
                  : "bg-card border-border/80 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <GraduationCap size={16} className={isActive ? "text-white" : "text-amber-500"} />
              <span>{jenjang.name}</span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-semibold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-muted text-muted-foreground border border-border/50"
                }`}
              >
                {jenjang.count} Fitur
              </span>
            </button>
          );
        })}
      </div>

      {/* Info Context Bar & Search */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">
            Jenjang Aktif: {currentJenjang.name}
          </span>
          <span>•</span>
          <span>{currentJenjang.desc}</span>
        </div>

        {/* Quick Search in Features */}
        <div className="relative w-full sm:w-72 shrink-0">
          <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder={`Cari fitur di ${currentJenjang.name}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 shadow-2xs transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2 size-5 text-muted-foreground hover:text-foreground flex items-center justify-center cursor-pointer rounded-full hover:bg-muted"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Konten Grid: 10 BIDANG TETAP, ISI FITUR MENYESUAIKAN DENGAN JENJANG AKTIF */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {filteredDisciplines.map((disc) => {
          const features = disc.featuresByLevel[activeJenjangId] || [];
          const Icon = disc.icon;
          const isFlipped = !!flippedCards[disc.slug];
          const isFav = favorites.includes(`/kurasi/${disc.slug}`);

          return (
            <div
              key={disc.id}
              className="w-full [perspective:1000px] min-h-[260px]"
            >
              <motion.div
                className="relative w-full h-full min-h-[260px] [transform-style:preserve-3d]"
                animate={{
                  rotateY: isFlipped ? 180 : 0,
                }}
                transition={{ duration: 0.5, type: "spring", stiffness: 85, damping: 15 }}
              >
                {/* SISI DEPAN (FRONT FACE) */}
                <div className="w-full h-full rounded-2xl border border-border bg-card p-3.5 sm:p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-3 [backface-visibility:hidden]">
                  <div className="space-y-3.5">
                    {/* Header Bidang */}
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        to={`/kurasi/${disc.slug}` as any}
                        className="flex items-center gap-3 group/header min-w-0 flex-1 outline-none"
                      >
                        <div
                          className={`size-11 rounded-2xl flex items-center justify-center text-white shadow-xs shrink-0 ${disc.gradient} group-hover/header:scale-105 transition-transform`}
                        >
                          <Icon className="size-5.5 opacity-90 drop-shadow-xs" strokeWidth={1.8} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-base text-foreground group-hover/header:text-amber-600 dark:group-hover/header:text-amber-400 transition-colors truncate">
                            {disc.title}
                          </h4>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block truncate">
                            {disc.categoryLabel}
                          </span>
                        </div>
                      </Link>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Badge Jenjang & Jumlah Fitur */}
                        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          {currentJenjang.name} • {features.length}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleFavorite(`/kurasi/${disc.slug}`);
                          }}
                          className={`p-1.5 rounded-xl border transition-all cursor-pointer active:scale-95 ${
                            isFav
                              ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
                              : "bg-muted/50 border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                          }`}
                          title="Simpan Favorit"
                        >
                          <Star className={`size-3.5 ${isFav ? "fill-amber-500" : ""}`} />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {disc.subtitle}
                    </p>

                    {/* ISI FITUR MENYESUAIKAN DENGAN JENJANG (4, 9, 16, 25, 36) */}
                    <div className="pt-2 border-t border-border/60">
                      <div className="flex items-center justify-between text-[11px] font-bold text-foreground mb-2">
                        <span className="flex items-center gap-1.5">
                          <Layers size={12} className="text-amber-500" />
                          <span>Materi Fitur ({features.length} Pokok):</span>
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {currentJenjang.name}
                        </span>
                      </div>

                      {/* Display Features */}
                      {features.length <= 4 ? (
                        /* Matrikulasi (4 Fitur): List 4 baris elegan */
                        <div className="space-y-1.5">
                          {features.map((featName, idx) => (
                            <div
                              key={idx}
                              className="px-2.5 py-1.5 rounded-xl bg-muted/40 hover:bg-muted/70 border border-border/50 text-xs font-semibold text-foreground flex items-center justify-between transition-colors"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span className="size-4.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                                  {idx + 1}
                                </span>
                                <span className="truncate">{featName}</span>
                              </div>
                              <span className="text-[10px] text-muted-foreground font-normal shrink-0">
                                Pokok
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : features.length <= 9 ? (
                        /* 1 SKS (9 Fitur): 2 Kolom Ringkas */
                        <div className="grid grid-cols-2 gap-1.5 max-h-[175px] overflow-y-auto no-scrollbar">
                          {features.map((featName, idx) => (
                            <div
                              key={idx}
                              className="px-2 py-1 rounded-lg bg-muted/40 border border-border/50 text-[11px] font-medium text-foreground flex items-center gap-1.5 truncate hover:bg-muted/70 transition-colors"
                              title={featName}
                            >
                              <span className="text-[9px] font-mono text-muted-foreground font-bold shrink-0">
                                {idx + 1}.
                              </span>
                              <span className="truncate">{featName}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        /* 2 SKS, 3 SKS, + Praktikum (16, 25, 36 Fitur): Cloud Badges Ringkas & Scrollable */
                        <div className="max-h-[175px] overflow-y-auto pr-1 space-y-1.5 no-scrollbar">
                          <div className="flex flex-wrap gap-1.5">
                            {features.map((featName, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md bg-muted/50 border border-border/50 text-[10px] font-medium text-foreground hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-default"
                                title={`Materi ${idx + 1}: ${featName}`}
                              >
                                {idx + 1}. {featName}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={(e) => toggleFlip(disc.slug, e)}
                      className="text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <RotateCcw size={12} />
                      <span>Rincian Kurikulum</span>
                    </button>

                    <Link
                      to={`/kurasi/${disc.slug}` as any}
                      className="font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <span>Buka Modul</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>

                {/* SISI BELAKANG (BACK FACE) */}
                <div className="absolute inset-0 w-full h-full rounded-2xl border border-amber-500/40 bg-card p-5 shadow-md flex flex-col justify-between gap-4 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2.5 border-b border-border/70">
                      <div className="flex items-center gap-2">
                        <div className={`size-7 rounded-lg flex items-center justify-center text-white ${disc.gradient}`}>
                          <Icon size={14} />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-foreground block">
                            Kurikulum {disc.title}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {currentJenjang.name} • {features.length} Materi Pokok
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/30">
                        {currentJenjang.badge}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <p className="text-muted-foreground leading-relaxed">
                        {disc.subtitle}
                      </p>
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                        <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 block">
                          Tingkat {currentJenjang.name}:
                        </span>
                        <p className="text-[11px] text-foreground/80 leading-snug">
                          {currentJenjang.desc} Disusun untuk penguasaan praktis dari dasar teori hingga simulasi nyata.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={(e) => toggleFlip(disc.slug, e)}
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw size={12} />
                      <span>Kembali</span>
                    </button>

                    <Link
                      to={`/kurasi/${disc.slug}` as any}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-colors flex items-center gap-1 shadow-2xs"
                    >
                      <span>Pelajari Lengkap</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
