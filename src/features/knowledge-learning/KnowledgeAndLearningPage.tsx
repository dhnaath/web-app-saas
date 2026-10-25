import React, { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useFavorites } from "@/hooks/useFavorites";
import { ShellHeader } from "@/app/shell-header";
import {
  FileText,
  BookOpen,
  Compass,
  GraduationCap,
  Globe,
  Palette,
  Code,
  Layers,
  Database,
  Bookmark,
  Navigation,
  Scissors,
  Book,
  FileCheck,
  Award,
  ShieldCheck,
  Lightbulb,
  PenTool,
  Camera,
  Type,
  Search,
  Star,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

export type KnowledgeCategory = "all" | "documents" | "learning" | "creative";

export interface KnowledgeSubMenu {
  id: string;
  label: string;
  to: string;
}

export interface KnowledgeAppItem {
  id: string;
  name: string;
  category: "documents" | "learning" | "creative";
  categoryLabel: string;
  shortDesc: string;
  to: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  badge: string;
  accentGradient: string;
  accentBorder: string;
  badgeBg: string;
  badgeText: string;
  subMenus: KnowledgeSubMenu[];
}

export const KNOWLEDGE_APPS: KnowledgeAppItem[] = [
  // ============================================================================
  // 1. Documents (3 Apps)
  // ============================================================================
  {
    id: "notes-and-documents",
    name: "Notes and Documents",
    category: "documents",
    categoryLabel: "Documents",
    shortDesc:
      "Pusat pencatatan terstruktur second brain, catatan kilat spontan, pengarsipan berkas dokumen resmi, dan pangkalan data relasional.",
    to: "/notes",
    icon: FileText,
    badge: "Notes & Docs",
    accentGradient: "from-blue-500 to-indigo-600",
    accentBorder: "border-blue-500/30 hover:border-blue-500/60",
    badgeBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
    badgeText: "Documents",
    subMenus: [
      { id: "notes", label: "Notes", to: "/notes" },
      { id: "quick-notes", label: "Quick Notes", to: "/catatan" },
      { id: "documents", label: "Documents", to: "/documents" },
      { id: "database", label: "Database", to: "/database" },
    ],
  },
  {
    id: "knowledge-library",
    name: "Knowledge Library",
    category: "documents",
    categoryLabel: "Documents",
    shortDesc:
      "Pustaka pangkalan pengetahuan (knowledge base), ensiklopedia wiki SOP, direktori bookmark referensi, dan panduan lengkap klausul Incoterms.",
    to: "/knowledge-base",
    icon: BookOpen,
    badge: "Knowledge Library",
    accentGradient: "from-emerald-500 to-teal-600",
    accentBorder: "border-emerald-500/30 hover:border-emerald-500/60",
    badgeBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    badgeText: "Documents",
    subMenus: [
      { id: "knowledge-base", label: "Knowledge Base", to: "/knowledge-base" },
      { id: "wiki", label: "Wiki Engine", to: "/wiki" },
      { id: "bookmarks", label: "Bookmark Manager", to: "/bookmarks" },
      { id: "incoterms", label: "Incoterms Guide", to: "/incoterms" },
    ],
  },
  {
    id: "research-and-reading",
    name: "Research and Reading",
    category: "documents",
    categoryLabel: "Documents",
    shortDesc:
      "Instrumen riset komparatif, pengumpulan kliping materi web clipper, dan pelacakan daftar target membaca buku teks serta publikasi ilmiah.",
    to: "/research-manager",
    icon: Compass,
    badge: "Research & Reading",
    accentGradient: "from-teal-500 to-cyan-600",
    accentBorder: "border-teal-500/30 hover:border-teal-500/60",
    badgeBg: "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30",
    badgeText: "Documents",
    subMenus: [
      { id: "research-manager", label: "Research Manager", to: "/research-manager" },
      { id: "web-clipper", label: "Web Clipper", to: "/web-clipper" },
      { id: "reading-list", label: "Reading List MVP", to: "/reading" },
    ],
  },

  // ============================================================================
  // 2. Learning (2 Apps)
  // ============================================================================
  {
    id: "courses-and-study",
    name: "Courses and Study",
    category: "learning",
    categoryLabel: "Learning",
    shortDesc:
      "Kurikulum kursus akselerasi keahlian, kartu hafalan repetisi kilat (flashcards), dan bank soal simulasi ujian sertifikasi profesional.",
    to: "/courses",
    icon: GraduationCap,
    badge: "Courses & Study",
    accentGradient: "from-purple-500 to-violet-600",
    accentBorder: "border-purple-500/30 hover:border-purple-500/60",
    badgeBg: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
    badgeText: "Learning",
    subMenus: [
      { id: "courses", label: "Courses", to: "/courses" },
      { id: "flashcards", label: "Flashcards", to: "/flashcards" },
      { id: "exams", label: "Exams", to: "/exams" },
    ],
  },
  {
    id: "skills-and-credentials",
    name: "Skills and Credentials",
    category: "learning",
    categoryLabel: "Learning",
    shortDesc:
      "Pembelajaran linguistik multibahasa, log jam pelatihan keahlian kerja, serta pangkalan verifikasi sertifikat dan dokumen legal.",
    to: "/languages",
    icon: Globe,
    badge: "Skills & Credentials",
    accentGradient: "from-indigo-500 to-sky-600",
    accentBorder: "border-indigo-500/30 hover:border-indigo-500/60",
    badgeBg: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
    badgeText: "Learning",
    subMenus: [
      { id: "languages", label: "Languages", to: "/languages" },
      { id: "training-track", label: "Training Track", to: "/lainnya?app=training-track" },
      { id: "certificate-tracker", label: "Sertifikat & Dokumen Legal", to: "/life/certificate-tracker" },
    ],
  },

  // ============================================================================
  // 3. Creative (2 Apps)
  // ============================================================================
  {
    id: "ideas-and-design",
    name: "Ideas and Design",
    category: "creative",
    categoryLabel: "Creative",
    shortDesc:
      "Papan inkubasi ide spontan, kanvas perancangan tata visual studio grafis, dan kurasi dokumentasi karya seni fotografi.",
    to: "/ideas",
    icon: Palette,
    badge: "Ideas & Design",
    accentGradient: "from-amber-500 to-rose-600",
    accentBorder: "border-amber-500/30 hover:border-amber-500/60",
    badgeBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    badgeText: "Creative",
    subMenus: [
      { id: "ideas-board", label: "Ideas Board", to: "/ideas" },
      { id: "design-studio", label: "Design Studio", to: "/design" },
      { id: "photography", label: "Photography", to: "/photography" },
    ],
  },
  {
    id: "writing-and-code",
    name: "Writing and Code",
    category: "creative",
    categoryLabel: "Creative",
    shortDesc:
      "Editor penulisan esai & naskah bebas distraksi, lingkungan pengembangan kode rekayasa software, serta lisensi hak kekayaan intelektual digital.",
    to: "/writing",
    icon: Code,
    badge: "Writing & Code",
    accentGradient: "from-rose-500 to-pink-600",
    accentBorder: "border-rose-500/30 hover:border-rose-500/60",
    badgeBg: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
    badgeText: "Creative",
    subMenus: [
      { id: "writing-editor", label: "Writing Editor", to: "/writing" },
      { id: "code-dev", label: "Code Dev", to: "/code" },
      { id: "ip-licenses", label: "Hak Cipta & Aset Digital", to: "/peh/ip-licenses" },
    ],
  },
];

export const KNOWLEDGE_CATEGORY_TABS: {
  id: KnowledgeCategory;
  label: string;
  count: number;
}[] = [
  { id: "all", label: "Semua", count: 7 },
  { id: "documents", label: "Documents", count: 3 },
  { id: "learning", label: "Learning", count: 2 },
  { id: "creative", label: "Creative", count: 2 },
];

export function KnowledgeAndLearningPage({
  isEmbedded = false,
}: {
  isEmbedded?: boolean;
} = {}) {
  const [selectedCategory, setSelectedCategory] = useState<KnowledgeCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { isFavorite, toggleFavorite } = useFavorites();

  const filteredApps = useMemo(() => {
    return KNOWLEDGE_APPS.filter((app) => {
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
              {KNOWLEDGE_CATEGORY_TABS.map((tab) => {
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
        <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card/90 via-card/60 to-indigo-500/5 p-6 sm:p-8 shadow-xs backdrop-blur-sm">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
                <GraduationCap className="size-3.5" />
                <span>Knowledge & Learning Studio</span>
                <span className="size-1 rounded-full bg-indigo-500" />
                <span>7 Aplikasi</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Knowledge and Learning
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Semua (7) · Documents (3) · Learning (2) · Creative (2).
                Pusat manajemen second brain, dokumentasi riset literatur, akselerasi kurikulum studi, serta studio ide kreatif, penulisan dan rekayasa kode.
              </p>
            </div>

            {/* Quick Stat Highlights */}
            <div className="grid grid-cols-3 gap-2.5 shrink-0">
              <div className="p-3.5 rounded-2xl bg-card/80 border border-border/70 flex flex-col">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Documents
                </span>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                  3 Modul
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-card/80 border border-border/70 flex flex-col">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Learning
                </span>
                <span className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-0.5">
                  2 Modul
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-card/80 border border-border/70 flex flex-col">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Creative
                </span>
                <span className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                  2 Modul
                </span>
              </div>
            </div>
          </div>

          {/* Search & Interactive Pill Filter Bar */}
          <div className="mt-6 pt-5 border-t border-border/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Category Segmented Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {KNOWLEDGE_CATEGORY_TABS.map((tab) => {
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
                ? "Semua Kategori Knowledge and Learning"
                : `Kategori: ${
                    KNOWLEDGE_CATEGORY_TABS.find((t) => t.id === selectedCategory)?.label
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
              <span>Lihat Semua (7)</span>
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

export default KnowledgeAndLearningPage;
