import React, { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useFavorites } from "@/hooks/useFavorites";
import { ShellHeader } from "@/app/shell-header";
import {
  Flame,
  CheckSquare,
  Sparkles,
  BookOpen,
  Smile,
  Heart,
  Dumbbell,
  Moon,
  Scale,
  Droplet,
  HeartPulse,
  Stethoscope,
  Pill,
  Key,
  Calculator,
  Briefcase,
  Gift,
  ArrowRight,
  Star,
  Search,
  ChevronRight,
  Activity,
  Layers,
} from "lucide-react";

export type PersonalLifeCategory = "all" | "habits-mind" | "body-health" | "personal-tools";

export interface PersonalLifeSubMenu {
  id: string;
  label: string;
  to: string;
}

export interface PersonalLifeAppItem {
  id: string;
  name: string;
  category: "habits-mind" | "body-health" | "personal-tools";
  categoryLabel: string;
  shortDesc: string;
  to: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  badge: string;
  accentGradient: string;
  accentBorder: string;
  badgeBg: string;
  badgeText: string;
  subMenus: PersonalLifeSubMenu[];
}

export const PERSONAL_LIFE_APPS: PersonalLifeAppItem[] = [
  // ============================================================================
  // 1. Habits and Mind (2 Apps)
  // ============================================================================
  {
    id: "habits-and-planning",
    name: "Habits and Planning",
    category: "habits-mind",
    categoryLabel: "Habits and Mind",
    shortDesc:
      "Pengembangan kebiasaan positif konsisten, perencanaan sasaran hidup terpadu, proyek mandiri, serta pencatatan impian dan tabungan masa depan.",
    to: "/habit-tracker",
    icon: Flame,
    badge: "Habits & Planning",
    accentGradient: "from-emerald-500 to-teal-600",
    accentBorder: "border-emerald-500/30 hover:border-emerald-500/60",
    badgeBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    badgeText: "Habits and Mind",
    subMenus: [
      { id: "habit-tracker", label: "Habit Tracker MVP", to: "/habit-tracker" },
      { id: "life-planner", label: "Life Planner Hub", to: "/life/life-planner" },
      { id: "personal-projects", label: "Personal Projects", to: "/proyek-personal" },
      { id: "wishlist", label: "Wishlist & Tabungan Impian", to: "/life/wishlist" },
    ],
  },
  {
    id: "journaling",
    name: "Journaling",
    category: "habits-mind",
    categoryLabel: "Habits and Mind",
    shortDesc:
      "Ruang refleksi privat harian, jurnal rasa syukur berkala untuk ketenangan batin, serta pemetaan suasana hati (mood map) terstruktur.",
    to: "/journal",
    icon: BookOpen,
    badge: "Journaling",
    accentGradient: "from-teal-500 to-cyan-600",
    accentBorder: "border-teal-500/30 hover:border-teal-500/60",
    badgeBg: "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30",
    badgeText: "Habits and Mind",
    subMenus: [
      { id: "daily-journal", label: "Daily Journal", to: "/journal" },
      { id: "gratitude-journal", label: "Gratitude Journal", to: "/journal?tab=gratitude" },
      { id: "mood-tracker", label: "Mood Tracker MVP", to: "/journal?tab=mood" },
    ],
  },

  // ============================================================================
  // 2. Body and Health (2 Apps)
  // ============================================================================
  {
    id: "fitness-and-sleep",
    name: "Fitness and Sleep",
    category: "body-health",
    categoryLabel: "Body and Health",
    shortDesc:
      "Pusat pencatatan latihan fisik harian, kualitas istirahat malam dan kalkulator tidur, komposisi berat badan tubuh, serta log hidrasi air minum.",
    to: "/health?tab=workouts",
    icon: Dumbbell,
    badge: "Fitness & Sleep",
    accentGradient: "from-blue-500 to-indigo-600",
    accentBorder: "border-blue-500/30 hover:border-blue-500/60",
    badgeBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
    badgeText: "Body and Health",
    subMenus: [
      { id: "workouts", label: "Workouts", to: "/health?tab=workouts" },
      { id: "sleep-quality", label: "Sleep Quality MVP", to: "/health?tab=sleep" },
      { id: "body-metrics", label: "Body Metrics", to: "/health?tab=body-metrics" },
      { id: "water-intake", label: "Water Intake", to: "/health?tab=water" },
    ],
  },
  {
    id: "health-records",
    name: "Health Records",
    category: "body-health",
    categoryLabel: "Body and Health",
    shortDesc:
      "Pusat rekam medis komprehensif: pelacak riwayat kesehatan dokter, tanda vital tubuh, jadwal pengingat minum obat, dan log perawatan kulit.",
    to: "/health",
    icon: HeartPulse,
    badge: "Health Records",
    accentGradient: "from-rose-500 to-pink-600",
    accentBorder: "border-rose-500/30 hover:border-rose-500/60",
    badgeBg: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
    badgeText: "Body and Health",
    subMenus: [
      { id: "health-tracker", label: "Health Tracker", to: "/health" },
      { id: "medical-records", label: "Medical Records", to: "/health?tab=medical-records" },
      { id: "vitals-tracker", label: "Vitals Tracker", to: "/health?tab=vitals" },
      { id: "med-reminder", label: "Med Reminder", to: "/lainnya?app=med-reminder" },
      { id: "skincare-log", label: "Skincare Log", to: "/health?tab=skincare" },
    ],
  },

  // ============================================================================
  // 3. Personal Tools (1 App)
  // ============================================================================
  {
    id: "personal-tools",
    name: "Personal Tools",
    category: "personal-tools",
    categoryLabel: "Personal Tools",
    shortDesc:
      "Brankas manajemen kata sandi terenkripsi dan utilitas alat hitung kalkulator ilmiah serbaguna untuk kebutuhan sehari-hari.",
    to: "/passwords",
    icon: Key,
    badge: "Personal Tools",
    accentGradient: "from-amber-500 to-orange-600",
    accentBorder: "border-amber-500/30 hover:border-amber-500/60",
    badgeBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    badgeText: "Personal Tools",
    subMenus: [
      { id: "passwords", label: "Passwords", to: "/passwords" },
      { id: "utilities", label: "Utilities", to: "/kalkulator" },
    ],
  },
];

export const PERSONAL_LIFE_CATEGORY_TABS: {
  id: PersonalLifeCategory;
  label: string;
  count: number;
}[] = [
  { id: "all", label: "Semua", count: 5 },
  { id: "habits-mind", label: "Habits and Mind", count: 2 },
  { id: "body-health", label: "Body and Health", count: 2 },
  { id: "personal-tools", label: "Personal Tools", count: 1 },
];

export function PersonalLifePage({ isEmbedded = false }: { isEmbedded?: boolean } = {}) {
  const [selectedCategory, setSelectedCategory] = useState<PersonalLifeCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { isFavorite, toggleFavorite } = useFavorites();

  const filteredApps = useMemo(() => {
    return PERSONAL_LIFE_APPS.filter((app) => {
      const matchCategory =
        selectedCategory === "all" || app.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === "" ||
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.subMenus.some((sub) =>
          sub.label.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="w-full flex-1 flex flex-col font-sans pb-16">
      {/* Portaled ShellHeader Filter Pills */}
      {!isEmbedded && (
        <ShellHeader>
          <div className="flex items-center gap-1.5 shrink-0 m-0 p-0">
            <div className="flex items-center gap-1 border border-border/70 rounded-full p-1 bg-muted/60 dark:bg-zinc-800/80 backdrop-blur-xs text-xs shrink-0 shadow-2xs h-[36px]">
              {PERSONAL_LIFE_CATEGORY_TABS.map((tab) => {
                const isActive = selectedCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedCategory(tab.id)}
                    title={`${tab.label} (${tab.count})`}
                    className={`px-3 h-[28px] rounded-full text-xs font-medium transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                      isActive
                        ? "bg-background text-foreground font-semibold shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? "bg-primary/15 text-primary font-bold"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </ShellHeader>
      )}

      {/* Main Page Container */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-6">
        {/* Hero Header Section */}
        <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card/90 via-card/60 to-emerald-500/5 p-6 sm:p-8 shadow-xs backdrop-blur-sm">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <Heart className="size-3.5 fill-emerald-500/20" />
                <span>Personal Life Workspace</span>
                <span className="size-1 rounded-full bg-emerald-500" />
                <span>5 Aplikasi</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Personal Life
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Semua (5) · Habits and Mind (2) · Body and Health (2) · Personal Tools (1).
                Pusat terpadu kebiasaan harian, perencana hidup mandiri, refleksi mental, vitalitas fisik, rekam kesehatan, dan utilitas instrumen personal.
              </p>
            </div>

            {/* Quick Stat Highlights */}
            <div className="grid grid-cols-3 gap-2.5 shrink-0">
              <div className="p-3.5 rounded-2xl bg-card/80 border border-border/70 flex flex-col">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Habits & Mind
                </span>
                <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  2 Modul
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-card/80 border border-border/70 flex flex-col">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Body & Health
                </span>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                  2 Modul
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-card/80 border border-border/70 flex flex-col">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Personal Tools
                </span>
                <span className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                  1 Modul
                </span>
              </div>
            </div>
          </div>

          {/* Search & Interactive Pill Filter Bar */}
          <div className="mt-6 pt-5 border-t border-border/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Category Segmented Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {PERSONAL_LIFE_CATEGORY_TABS.map((tab) => {
                const isActive = selectedCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedCategory(tab.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 border ${
                      isActive
                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                        : "bg-card/70 hover:bg-accent text-foreground/80 border-border/70"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Live Search Input */}
            <div className="relative min-w-[240px] sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari modul atau sub-fitur..."
                className="w-full pl-9 pr-4 py-1.5 bg-background/80 border border-border/80 rounded-full text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs p-1 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Header Title Banner */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              {selectedCategory === "all"
                ? "Semua Kategori Personal Life"
                : `Kategori: ${
                    PERSONAL_LIFE_CATEGORY_TABS.find((t) => t.id === selectedCategory)?.label
                  }`}
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              {filteredApps.length} Aplikasi
            </span>
          </div>

          {selectedCategory !== "all" && (
            <button
              onClick={() => setSelectedCategory("all")}
              className="text-xs text-primary font-medium hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Lihat Semua (5)</span>
              <ChevronRight className="size-3.5" />
            </button>
          )}
        </div>

        {/* Applications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredApps.map((app) => {
              const Icon = app.icon;
              const fav = isFavorite(app.to);

              return (
                <motion.div
                  layout
                  key={app.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`group relative flex flex-col justify-between rounded-3xl bg-card/80 dark:bg-zinc-900/80 border ${app.accentBorder} p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300 backdrop-blur-xs`}
                >
                  <div>
                    {/* Top Row: Icon + Badges + Favorite Toggle */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-12 rounded-2xl bg-gradient-to-br ${app.accentGradient} flex items-center justify-center text-white shadow-md shadow-primary/10 group-hover:scale-105 transition-transform duration-300 shrink-0`}
                        >
                          <Icon size={22} />
                        </div>
                        <div>
                          <span
                            className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border mb-1 ${app.badgeBg}`}
                          >
                            {app.badgeText}
                          </span>
                          <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {app.name}
                          </h3>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavorite(app.to);
                        }}
                        className={`size-8 rounded-full flex items-center justify-center border transition-all cursor-pointer shrink-0 ${
                          fav
                            ? "bg-amber-500/15 border-amber-500/40 text-amber-500"
                            : "border-border/60 hover:border-border text-muted-foreground/60 hover:text-foreground"
                        }`}
                        title={fav ? "Hapus dari Favorit" : "Tambah ke Favorit"}
                        aria-label="Toggle favorit"
                      >
                        <Star className={`size-4 ${fav ? "fill-amber-500 text-amber-500" : ""}`} />
                      </button>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                      {app.shortDesc}
                    </p>

                    {/* Submenu Features as Clickable Link Pills */}
                    <div className="space-y-1.5 mb-5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                        Sub-Fitur ({app.subMenus.length}):
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {app.subMenus.map((sub) => (
                          <Link
                            key={sub.id}
                            to={sub.to as any}
                            className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-muted/60 dark:bg-zinc-800/80 hover:bg-primary/15 hover:text-primary text-foreground border border-border/40 hover:border-primary/40 transition-colors cursor-pointer"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Button */}
                  <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                      {app.badge}
                    </span>

                    <Link
                      to={app.to as any}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground text-xs font-semibold transition-all duration-200 cursor-pointer group/btn"
                    >
                      <span>Buka Modul</span>
                      <ArrowRight className="size-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty Search Result Fallback */}
        {filteredApps.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-dashed border-border bg-card/40 my-6">
            <div className="size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-3">
              <Search className="size-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">Tidak ada modul ditemukan</h3>
            <p className="text-xs text-muted-foreground max-w-sm mt-1">
              Tidak ada aplikasi yang cocok dengan kata kunci &quot;{searchQuery}&quot; pada kategori {selectedCategory}.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-4 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
            >
              Reset Filter & Pencarian
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PersonalLifePage;
