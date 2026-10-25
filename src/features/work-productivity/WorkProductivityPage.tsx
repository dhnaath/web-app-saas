import React, { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useFavorites } from "@/hooks/useFavorites";
import { ShellHeader } from "@/app/shell-header";
import {
  Briefcase,
  Target,
  Workflow,
  Layers,
  Building2,
  ShoppingBag,
  FileCheck,
  AlertOctagon,
  ShieldCheck,
  PieChart,
  ArrowRight,
  Star,
  Search,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  SlidersHorizontal,
  Flame,
  LayoutGrid,
} from "lucide-react";

export type WorkCategory = "all" | "execution" | "partners" | "control" | "ownership";

export interface WorkAppItem {
  id: string;
  name: string;
  category: "execution" | "partners" | "control" | "ownership";
  categoryLabel: string;
  shortDesc: string;
  to: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  badge: string;
  accentGradient: string;
  accentBorder: string;
  badgeBg: string;
  badgeText: string;
  subMenus: { id: string; label: string; to?: string }[];
}

export const WORK_APPS: WorkAppItem[] = [
  // 1. Execution (3)
  {
    id: "milestones",
    name: "Target & Milestone",
    category: "execution",
    categoryLabel: "Execution",
    shortDesc: "Peta jalan sasaran jangka pendek & panjang dengan tahapan checkpoint terukur, bobot progres, dan evaluasi hasil.",
    to: "/peh/milestones",
    icon: Target,
    badge: "Milestone",
    accentGradient: "from-blue-500 to-indigo-600",
    accentBorder: "border-blue-500/30 hover:border-blue-500/60",
    badgeBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
    badgeText: "Execution",
    subMenus: [
      { id: "active", label: "Sasaran Aktif" },
      { id: "milestones", label: "Tahapan Checkpoint" },
      { id: "archive", label: "Arsip Sasaran" },
    ],
  },
  {
    id: "workflows",
    name: "Alur Kerja & Pipeline",
    category: "execution",
    categoryLabel: "Execution",
    shortDesc: "Proses bertahap (onboarding, approval, delivery) dengan pemantauan siklus, SLA waktu, dan pipeline multi-stage.",
    to: "/peh/workflows",
    icon: Workflow,
    badge: "Pipeline",
    accentGradient: "from-indigo-500 to-violet-600",
    accentBorder: "border-indigo-500/30 hover:border-indigo-500/60",
    badgeBg: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
    badgeText: "Execution",
    subMenus: [
      { id: "pipelines", label: "Pipeline Aktif" },
      { id: "active-runs", label: "Tahapan Proses" },
      { id: "templates", label: "Alur Standar" },
    ],
  },
  {
    id: "content-pipeline",
    name: "Pipeline Produksi Konten",
    category: "execution",
    categoryLabel: "Execution",
    shortDesc: "Papan kanban tahapan naskah, perancangan ide kreatif, syuting, editing, dan jadwal rilis publikasi lintas platform.",
    to: "/peh/projects",
    icon: Layers,
    badge: "Kreatif",
    accentGradient: "from-cyan-500 to-blue-600",
    accentBorder: "border-cyan-500/30 hover:border-cyan-500/60",
    badgeBg: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
    badgeText: "Execution",
    subMenus: [
      { id: "active", label: "Konten Berjalan" },
      { id: "done", label: "Rilis Publikasi" },
      { id: "kanban", label: "Papan Produksi" },
    ],
  },

  // 2. Partners (2)
  {
    id: "vendors",
    name: "Vendor & Mitra Layanan",
    category: "partners",
    categoryLabel: "Partners",
    shortDesc: "Kontrak penyedia layanan, komitmen SLA, nilai kontrak berkala, direktori rekanan, dan jatuh tempo perpanjangan.",
    to: "/peh/vendors",
    icon: Building2,
    badge: "Vendor",
    accentGradient: "from-amber-500 to-orange-600",
    accentBorder: "border-amber-500/30 hover:border-amber-500/60",
    badgeBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    badgeText: "Partners",
    subMenus: [
      { id: "directory", label: "Direktori Vendor" },
      { id: "contracts", label: "Jatuh Tempo Kontrak" },
      { id: "slas", label: "Evaluasi Rating SLA" },
    ],
  },
  {
    id: "procurement",
    name: "Pengadaan & Purchase Orders",
    category: "partners",
    categoryLabel: "Partners",
    shortDesc: "Alur permintaan barang operasional kantor, ambang persetujuan anggaran belanja, nomor PO, dan status logistik penerimaan.",
    to: "/peh/procurement",
    icon: ShoppingBag,
    badge: "Purchase Orders",
    accentGradient: "from-orange-500 to-red-600",
    accentBorder: "border-orange-500/30 hover:border-orange-500/60",
    badgeBg: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30",
    badgeText: "Partners",
    subMenus: [
      { id: "po-requests", label: "Daftar Permintaan (PO)" },
      { id: "threshold-matrix", label: "Matriks Otorisasi Belanja" },
      { id: "deliveries", label: "Penerimaan & Lunas" },
    ],
  },

  // 3. Control (3)
  {
    id: "meetings",
    name: "Notulensi & Keputusan Rapat",
    category: "control",
    categoryLabel: "Control",
    shortDesc: "Dokumentasi objektif pertemuan, poin kesepakatan final eksekutif, daftar tindakan (action items), dan penanggung jawab PIC.",
    to: "/peh/meetings",
    icon: FileCheck,
    badge: "Notulensi",
    accentGradient: "from-emerald-500 to-teal-600",
    accentBorder: "border-emerald-500/30 hover:border-emerald-500/60",
    badgeBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    badgeText: "Control",
    subMenus: [
      { id: "meeting-list", label: "Daftar Notulensi" },
      { id: "decisions", label: "Log Keputusan Final" },
      { id: "action-items", label: "Action Items & PIC" },
    ],
  },
  {
    id: "incidents",
    name: "Log Masalah & Insiden",
    category: "control",
    categoryLabel: "Control",
    shortDesc: "Pencatatan gangguan operasional, level urgensi & keparahan (SEV), investigasi akar masalah (RCA), dan evaluasi mitigasi.",
    to: "/peh/incidents",
    icon: AlertOctagon,
    badge: "Insiden",
    accentGradient: "from-rose-500 to-pink-600",
    accentBorder: "border-rose-500/30 hover:border-rose-500/60",
    badgeBg: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
    badgeText: "Control",
    subMenus: [
      { id: "active-issues", label: "Insiden Terbuka" },
      { id: "resolved", label: "Terselesaikan" },
      { id: "post-mortem", label: "Akar Masalah (RCA)" },
    ],
  },
  {
    id: "compliance",
    name: "Kepatuhan & Audit Regulasi",
    category: "control",
    categoryLabel: "Control",
    shortDesc: "Matriks kepatuhan hukum, audit standar ISO/K3/pajak, radar jatuh tempo izin operasional, dan skor kesiapan inspeksi eksternal.",
    to: "/peh/compliance",
    icon: ShieldCheck,
    badge: "Regulasi",
    accentGradient: "from-teal-500 to-emerald-600",
    accentBorder: "border-teal-500/30 hover:border-teal-500/60",
    badgeBg: "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30",
    badgeText: "Control",
    subMenus: [
      { id: "compliance-matrix", label: "Matriks Kepatuhan" },
      { id: "readiness-score", label: "Skor Kesiapan Audit" },
      { id: "expiry-radar", label: "Radar Jatuh Tempo Izin" },
    ],
  },

  // 4. Ownership (1)
  {
    id: "cap-table",
    name: "Struktur Saham & Cap Table",
    category: "ownership",
    categoryLabel: "Ownership",
    shortDesc: "Tabel permodalan kepemilikan saham, alokasi persentase ekuitas pendiri/investor, opsi ESOP, dan jadwal vesting saham.",
    to: "/peh/cap-table",
    icon: PieChart,
    badge: "Cap Table",
    accentGradient: "from-purple-500 to-violet-600",
    accentBorder: "border-purple-500/30 hover:border-purple-500/60",
    badgeBg: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
    badgeText: "Ownership",
    subMenus: [
      { id: "stakeholders", label: "Pemegang Saham" },
      { id: "classes", label: "Alokasi Porsi (%)" },
      { id: "vesting", label: "Perjanjian & Vesting" },
    ],
  },
];

export const CATEGORY_TABS: { id: WorkCategory; label: string; count: number }[] = [
  { id: "all", label: "Semua", count: 9 },
  { id: "execution", label: "Execution", count: 3 },
  { id: "partners", label: "Partners", count: 2 },
  { id: "control", label: "Control", count: 3 },
  { id: "ownership", label: "Ownership", count: 1 },
];

export function WorkProductivityPage({ isEmbedded = false }: { isEmbedded?: boolean } = {}) {
  const [selectedCategory, setSelectedCategory] = useState<WorkCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { isFavorite, toggleFavorite } = useFavorites();

  const filteredApps = useMemo(() => {
    return WORK_APPS.filter((app) => {
      const matchCategory = selectedCategory === "all" || app.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === "" ||
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.badge.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="w-full flex-1 flex flex-col font-sans pb-16">
      {/* Portaled ShellHeader Filter Pills (Seamlessly nested in the 44px top header pill) */}
      <ShellHeader>
        <div className="flex items-center gap-1.5 shrink-0 m-0 p-0">
          <div className="flex items-center gap-1 border border-border/70 rounded-full p-1 bg-muted/60 dark:bg-zinc-800/80 backdrop-blur-xs text-xs shrink-0 shadow-2xs h-[36px]">
            {CATEGORY_TABS.map((tab) => {
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

      {/* Main Page Container */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-6">
        {/* Hero Header Section */}
        <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card/90 via-card/60 to-primary/5 p-6 sm:p-8 shadow-xs backdrop-blur-sm">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
                <Briefcase className="size-3.5" />
                <span>Modul Kerja & Produktivitas Bisnis</span>
                <span className="size-1 rounded-full bg-primary" />
                <span>9 Aplikasi</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Work and Productivity
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Pusat orkestrasi operasional terpadu: pantau eksekusi proyek & target, kelola jaringan vendor & pengadaan, tegakkan kontrol & audit regulasi, serta pantau struktur ekuitas perusahaan.
              </p>
            </div>

            {/* Quick Stat Pill Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0">
              <div className="p-3 rounded-2xl bg-card/80 border border-border/70 flex flex-col">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Execution</span>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-0.5">3 Modul</span>
              </div>
              <div className="p-3 rounded-2xl bg-card/80 border border-border/70 flex flex-col">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Partners</span>
                <span className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">2 Modul</span>
              </div>
              <div className="p-3 rounded-2xl bg-card/80 border border-border/70 flex flex-col">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Control</span>
                <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">3 Modul</span>
              </div>
              <div className="p-3 rounded-2xl bg-card/80 border border-border/70 flex flex-col">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Ownership</span>
                <span className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-0.5">1 Modul</span>
              </div>
            </div>
          </div>

          {/* Search & Interactive Pill Filter Bar */}
          <div className="mt-6 pt-5 border-t border-border/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Category Segmented Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {CATEGORY_TABS.map((tab) => {
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
                placeholder="Cari modul atau kata kunci..."
                className="w-full pl-9 pr-4 py-1.5 bg-background/80 border border-border/80 rounded-full text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs p-1"
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
            <h2 className="text-base sm:text-lg font-bold text-foreground capitalize">
              {selectedCategory === "all" ? "Semua Aplikasi Work & Productivity" : `Kategori: ${selectedCategory}`}
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
              <span>Lihat Semua (9)</span>
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

                    {/* Quick Submenu Pill Chips */}
                    <div className="flex items-center gap-1.5 flex-wrap mb-5">
                      {app.subMenus.map((sub) => (
                        <span
                          key={sub.id}
                          className="text-[10.5px] font-medium px-2 py-0.5 rounded-full bg-muted/60 dark:bg-zinc-800/80 text-muted-foreground border border-border/40"
                        >
                          {sub.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Action Button */}
                  <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                      Modul {app.badge}
                    </span>

                    <Link
                      to={app.to}
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
export default WorkProductivityPage;
