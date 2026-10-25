import React, { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useFavorites } from "@/hooks/useFavorites";
import { ShellHeader } from "@/app/shell-header";
import {
  Home,
  Car,
  Palmtree,
  CheckSquare,
  Wrench,
  Sprout,
  Archive,
  Utensils,
  BookOpen,
  AlertTriangle,
  RefreshCw,
  CalendarDays,
  ShoppingCart,
  Fuel,
  Plane,
  CloudSun,
  Film,
  Gamepad2,
  Podcast,
  Music,
  Search,
  Star,
  ChevronRight,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export type HomeLeisureCategory = "all" | "home" | "vehicle" | "leisure";

export interface HomeLeisureSubMenu {
  id: string;
  label: string;
  to: string;
}

export interface HomeLeisureAppItem {
  id: string;
  name: string;
  category: "home" | "vehicle" | "leisure";
  categoryLabel: string;
  shortDesc: string;
  to: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  badge: string;
  accentGradient: string;
  accentBorder: string;
  badgeBg: string;
  badgeText: string;
  subMenus: HomeLeisureSubMenu[];
}

export const HOME_LEISURE_APPS: HomeLeisureAppItem[] = [
  // ============================================================================
  // 1. Home (2 Apps)
  // ============================================================================
  {
    id: "household-care",
    name: "Household Care",
    category: "home",
    categoryLabel: "Home",
    shortDesc:
      "Pusat tata kelola tugas harian domestik, pemeliharaan servis peralatan rumah tangga, perawatan tanaman & kebun, serta inventaris barang elektronik.",
    to: "/lainnya?app=home-chores",
    icon: Home,
    badge: "Household Care",
    accentGradient: "from-amber-500 to-orange-600",
    accentBorder: "border-amber-500/30 hover:border-amber-500/60",
    badgeBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    badgeText: "Home",
    subMenus: [
      { id: "piket-tugas", label: "Piket & Tugas Domestik", to: "/lainnya?app=home-chores" },
      { id: "servis-perawatan", label: "Servis & Perawatan Rumah", to: "/lainnya?app=appliance-care" },
      { id: "tanaman-kebun", label: "Tanaman & Kebun", to: "/peh/plants" },
      { id: "inventaris-elektronik", label: "Inventaris Rumah & Elektronik", to: "/lainnya?app=home-inventory" },
    ],
  },
  {
    id: "kitchen-and-shopping",
    name: "Kitchen and Shopping",
    category: "home",
    categoryLabel: "Home",
    shortDesc:
      "Manajemen logistik dapur, stok inventaris pantry, histori memasak kuliner harian, pengingat kedaluwarsa bahan makanan, pemanfaatan sisa masakan, perencanaan menu nutrisi, dan daftar belanja lengkap.",
    to: "/recipes",
    icon: Utensils,
    badge: "Kitchen & Shopping",
    accentGradient: "from-emerald-500 to-teal-600",
    accentBorder: "border-emerald-500/30 hover:border-emerald-500/60",
    badgeBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    badgeText: "Home",
    subMenus: [
      { id: "pantry-inventory", label: "Pantry Inventory", to: "/recipes?tab=pantry" },
      { id: "cook-log", label: "Cook Log", to: "/recipes?tab=cook-log" },
      { id: "expiry-alert", label: "Expiry Alert", to: "/recipes?tab=expiry" },
      { id: "leftover-manager", label: "Leftover Manager", to: "/recipes?tab=leftovers" },
      { id: "meal-planner", label: "Meal Planner", to: "/recipes?tab=meal-planner" },
      { id: "shopping-list", label: "Shopping List", to: "/shopping" },
    ],
  },

  // ============================================================================
  // 2. Vehicle (2 Apps)
  // ============================================================================
  {
    id: "vehicle-records",
    name: "Vehicle Records",
    category: "vehicle",
    categoryLabel: "Vehicle",
    shortDesc:
      "Pangkalan data kepemilikan armada, buku registrasi kendaraan resmi STNK/BPKB, pengingat siklus perpanjangan pajak, serta logbook operasional perjalanan.",
    to: "/lainnya?app=vehicle-identity",
    icon: Car,
    badge: "Vehicle Records",
    accentGradient: "from-blue-500 to-cyan-600",
    accentBorder: "border-blue-500/30 hover:border-blue-500/60",
    badgeBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
    badgeText: "Vehicle",
    subMenus: [
      { id: "vehicle-registry", label: "Vehicle Registry", to: "/lainnya?app=vehicle-identity" },
      { id: "vehicle-renewals", label: "Vehicle Renewals", to: "/lainnya?app=vehicle-renewals" },
      { id: "vehicle-logbook", label: "Vehicle Logbook", to: "/lainnya?app=vehicle-logbook" },
    ],
  },
  {
    id: "vehicle-care",
    name: "Vehicle Care",
    category: "vehicle",
    categoryLabel: "Vehicle",
    shortDesc:
      "Pemantauan efisiensi konsumsi bahan bakar (BBM), buku catatan riwayat perawatan servis bengkel, dan pelacakan siklus aus masa pakai suku cadang otomotif.",
    to: "/lainnya?app=mileage-fuel",
    icon: Fuel,
    badge: "Vehicle Care",
    accentGradient: "from-sky-500 to-indigo-600",
    accentBorder: "border-sky-500/30 hover:border-sky-500/60",
    badgeBg: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30",
    badgeText: "Vehicle",
    subMenus: [
      { id: "fuel-log", label: "Fuel Log", to: "/lainnya?app=mileage-fuel" },
      { id: "service-history", label: "Service History", to: "/lainnya?app=vehicle-service" },
      { id: "parts-lifecycle", label: "Parts Lifecycle", to: "/lainnya?app=parts-lifecycle" },
    ],
  },

  // ============================================================================
  // 3. Leisure (2 Apps)
  // ============================================================================
  {
    id: "travel-and-weather",
    name: "Travel and Weather",
    category: "leisure",
    categoryLabel: "Leisure",
    shortDesc:
      "Perencanaan komprehensif agenda liburan, itinerary tujuan wisata perjalanan, serta observasi prakiraan cuaca dan kondisi iklim terkini.",
    to: "/trips",
    icon: Plane,
    badge: "Travel & Weather",
    accentGradient: "from-teal-500 to-emerald-600",
    accentBorder: "border-teal-500/30 hover:border-teal-500/60",
    badgeBg: "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30",
    badgeText: "Leisure",
    subMenus: [
      { id: "trip-planner", label: "Trip Planner", to: "/trips" },
      { id: "weather", label: "Weather", to: "/weather" },
    ],
  },
  {
    id: "entertainment",
    name: "Entertainment",
    category: "leisure",
    categoryLabel: "Leisure",
    shortDesc:
      "Kurasi media rekreasi dan hiburan pelepas penat: daftar tontonan film, video game pelepas stres, audio podcast inspiratif, dan playlist musik personal.",
    to: "/movies",
    icon: Film,
    badge: "Entertainment",
    accentGradient: "from-rose-500 to-pink-600",
    accentBorder: "border-rose-500/30 hover:border-rose-500/60",
    badgeBg: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
    badgeText: "Leisure",
    subMenus: [
      { id: "movies", label: "Movies", to: "/movies" },
      { id: "games", label: "Games", to: "/games" },
      { id: "podcasts", label: "Podcasts", to: "/podcasts" },
      { id: "music", label: "Music", to: "/music" },
    ],
  },
];

export const HOME_LEISURE_CATEGORY_TABS: {
  id: HomeLeisureCategory;
  label: string;
  count: number;
}[] = [
  { id: "all", label: "Semua", count: 6 },
  { id: "home", label: "Home", count: 2 },
  { id: "vehicle", label: "Vehicle", count: 2 },
  { id: "leisure", label: "Leisure", count: 2 },
];

export function HomeLeisurePage({
  isEmbedded = false,
}: {
  isEmbedded?: boolean;
} = {}) {
  const [selectedCategory, setSelectedCategory] = useState<HomeLeisureCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { isFavorite, toggleFavorite } = useFavorites();

  const filteredApps = useMemo(() => {
    return HOME_LEISURE_APPS.filter((app) => {
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
              {HOME_LEISURE_CATEGORY_TABS.map((tab) => {
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
        <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card/90 via-card/60 to-amber-500/5 p-6 sm:p-8 shadow-xs backdrop-blur-sm">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold">
                <Home className="size-3.5" />
                <span>Home & Leisure Hub</span>
                <span className="size-1 rounded-full bg-amber-500" />
                <span>6 Aplikasi</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Home and Leisure
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Semua (6) · Home (2) · Vehicle (2) · Leisure (2).
                Tata kelola hunian domestik, logistik dapur & belanja, perawatan armada kendaraan, agenda perjalanan, serta ruang hiburan dan rekreasi keluarga.
              </p>
            </div>

            {/* Quick Stat Highlights */}
            <div className="grid grid-cols-3 gap-2.5 shrink-0">
              <div className="p-3.5 rounded-2xl bg-card/80 border border-border/70 flex flex-col">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Home
                </span>
                <span className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                  2 Modul
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-card/80 border border-border/70 flex flex-col">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Vehicle
                </span>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                  2 Modul
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-card/80 border border-border/70 flex flex-col">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Leisure
                </span>
                <span className="text-xl font-bold text-teal-600 dark:text-teal-400 mt-0.5">
                  2 Modul
                </span>
              </div>
            </div>
          </div>

          {/* Search & Interactive Pill Filter Bar */}
          <div className="mt-6 pt-5 border-t border-border/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Category Segmented Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {HOME_LEISURE_CATEGORY_TABS.map((tab) => {
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

            {/* Instant Search Bar */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari modul atau fitur..."
                className="w-full pl-9 pr-4 py-1.5 rounded-full text-xs bg-background/80 border border-border/80 focus:outline-hidden focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-muted-foreground"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Modular Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredApps.map((app) => {
              const IconComponent = app.icon;
              const fav = isFavorite(app.id);

              return (
                <motion.div
                  key={app.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`group relative rounded-3xl border ${app.accentBorder} bg-card/90 hover:bg-card p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}
                >
                  <div className="space-y-4">
                    {/* Header: Icon, Badge & Favorite Action */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-12 rounded-2xl bg-gradient-to-br ${app.accentGradient} flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-200`}
                        >
                          <IconComponent className="size-6" />
                        </div>
                        <div>
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${app.badgeBg}`}
                          >
                            {app.badgeText}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavorite(app.id);
                        }}
                        className={`size-8 rounded-full flex items-center justify-center transition-colors ${
                          fav
                            ? "text-amber-500 bg-amber-500/10"
                            : "text-muted-foreground/60 hover:text-amber-500 hover:bg-muted"
                        }`}
                        title={fav ? "Hapus dari favorit" : "Tambah ke favorit"}
                      >
                        <Star className={`size-4 ${fav ? "fill-current" : ""}`} />
                      </button>
                    </div>

                    {/* App Title & Description */}
                    <div className="space-y-1.5">
                      <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                        <Link to={app.to} className="hover:underline">
                          {app.name}
                        </Link>
                        <ChevronRight className="size-4 text-muted-foreground/60 group-hover:translate-x-0.5 transition-transform" />
                      </h2>
                      <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                        {app.shortDesc}
                      </p>
                    </div>

                    {/* Sub-menu Direct Links */}
                    <div className="pt-2">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                        Fitur & Modul Langsung
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {app.subMenus.map((sub) => (
                          <Link
                            key={sub.id}
                            to={sub.to}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-muted/60 hover:bg-primary/10 hover:text-primary border border-border/60 hover:border-primary/30 transition-all font-medium text-foreground/80"
                          >
                            <span>{sub.label}</span>
                            <ChevronRight className="size-3 opacity-60" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Action Button */}
                  <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground font-medium">
                      {app.subMenus.length} tautan fitur
                    </span>
                    <Link
                      to={app.to}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                      <span>Buka Aplikasi</span>
                      <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty state if search has no results */}
        {filteredApps.length === 0 && (
          <div className="text-center py-16 rounded-3xl border border-dashed border-border p-8 bg-card/40">
            <Search className="size-8 text-muted-foreground mx-auto mb-3 opacity-60" />
            <h3 className="text-base font-semibold text-foreground">Tidak ada modul ditemukan</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Tidak ada modul yang cocok dengan kata kunci "{searchQuery}". Coba ubah kata kunci atau ganti filter kategori.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-4 px-4 py-1.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
export default HomeLeisurePage;
