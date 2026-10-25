import React, { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useFavorites } from "@/hooks/useFavorites";
import { ShellHeader } from "@/app/shell-header";
import {
  Truck,
  Building2,
  Package,
  Boxes,
  Users,
  Briefcase,
  MessagesSquare,
  Clock,
  CalendarCheck,
  Receipt,
  CreditCard,
  LineChart,
  Search,
  Key,
  Shield,
  Layers,
  ArrowRight,
  Star,
  ChevronRight,
  Store,
  FolderKanban,
  FileCheck,
  FileBarChart,
  ThumbsUp,
  Award,
  UserCheck,
  ShoppingBag,
} from "lucide-react";

export type BizOpsCategory = "all" | "supply" | "customers" | "back-office";

export interface BizOpsSubMenu {
  id: string;
  label: string;
  to: string;
}

export interface BizOpsAppItem {
  id: string;
  name: string;
  category: "supply" | "customers" | "back-office";
  categoryLabel: string;
  shortDesc: string;
  to: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  badge: string;
  accentGradient: string;
  accentBorder: string;
  badgeBg: string;
  badgeText: string;
  subMenus: BizOpsSubMenu[];
}

export const BIZ_OPS_APPS: BizOpsAppItem[] = [
  // ============================================================================
  // 1. Supply (2 Apps)
  // ============================================================================
  {
    id: "vendors-and-procurement",
    name: "Vendors and Procurement",
    category: "supply",
    categoryLabel: "Supply",
    shortDesc:
      "Direktori penyedia jasa dan mitra kerja, persetujuan pengadaan purchase orders (PO), daftar tarif jasa standar, dan alokasi sumber daya kapasitas.",
    to: "/peh/vendors",
    icon: Truck,
    badge: "Supply & Vendors",
    accentGradient: "from-amber-500 to-orange-600",
    accentBorder: "border-amber-500/30 hover:border-amber-500/60",
    badgeBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    badgeText: "Supply",
    subMenus: [
      { id: "vendor-directory", label: "Vendor Directory", to: "/peh/vendors" },
      { id: "procurement", label: "Pengadaan & Purchase Orders", to: "/peh/procurement" },
      { id: "service-rates", label: "Service Rates", to: "/lainnya?app=services-ratecard" },
      { id: "resource-manager", label: "Resource Manager", to: "/resource-manager" },
    ],
  },
  {
    id: "products-and-stock",
    name: "Products and Stock",
    category: "supply",
    categoryLabel: "Supply",
    shortDesc:
      "Katalog penawaran produk komoditas terstruktur, inventaris stok pergudangan, pelacakan lot batch kadaluwarsa, dan pemantauan rantai dingin (cold chain).",
    to: "/katalog-produk",
    icon: Package,
    badge: "Products & Stock",
    accentGradient: "from-cyan-500 to-blue-600",
    accentBorder: "border-cyan-500/30 hover:border-cyan-500/60",
    badgeBg: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
    badgeText: "Supply",
    subMenus: [
      { id: "product-catalog", label: "Product Catalog", to: "/katalog-produk" },
      { id: "inventory", label: "Inventory", to: "/inventory" },
      { id: "batch-track", label: "Batch Track", to: "/lainnya?app=batch-track" },
      { id: "cold-chain", label: "Cold Chain", to: "/lainnya?app=cold-chain" },
    ],
  },

  // ============================================================================
  // 2. Customers (3 Apps)
  // ============================================================================
  {
    id: "client-records",
    name: "Client Records",
    category: "customers",
    categoryLabel: "Customers",
    shortDesc:
      "Direktori data profil klien korporasi, pengelolaan kontak relasi (CRM), rekam pesanan jasa klien, dan pembuatan laporan kustom performa.",
    to: "/klien",
    icon: Briefcase,
    badge: "Client Records",
    accentGradient: "from-blue-500 to-indigo-600",
    accentBorder: "border-blue-500/30 hover:border-blue-500/60",
    badgeBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
    badgeText: "Customers",
    subMenus: [
      { id: "clients-directory", label: "Clients Directory", to: "/klien" },
      { id: "contacts-crm", label: "Contacts CRM", to: "/contacts" },
      { id: "client-orders", label: "Client Orders", to: "/lainnya?app=client-orders" },
      { id: "custom-reports", label: "Custom Reports", to: "/lainnya?app=custom-reports" },
    ],
  },
  {
    id: "client-communication",
    name: "Client Communication",
    category: "customers",
    categoryLabel: "Customers",
    shortDesc:
      "Portal kolaborasi interaktif bersama klien, kanal perpesanan real-time, manajemen histori interaksi meeting, serta umpan balik evaluasi kepuasan.",
    to: "/portal",
    icon: MessagesSquare,
    badge: "Client Communication",
    accentGradient: "from-violet-500 to-purple-600",
    accentBorder: "border-violet-500/30 hover:border-violet-500/60",
    badgeBg: "bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/30",
    badgeText: "Customers",
    subMenus: [
      { id: "collab-portal", label: "Collab Portal", to: "/portal" },
      { id: "client-messages", label: "Client Messages", to: "/portal/pesan" },
      { id: "interaction-manager", label: "Interaction Manager", to: "/interaction-manager" },
      { id: "feedback-loop", label: "Feedback Loop", to: "/lainnya?app=feedback-loop" },
    ],
  },
  {
    id: "service-flow",
    name: "Service Flow",
    category: "customers",
    categoryLabel: "Customers",
    shortDesc:
      "Pengaturan antrean layanan publik, pemesanan sesi konsultasi terjadwal, buku tamu kedatangan kantor, dan akumulasi poin loyalitas pelanggan.",
    to: "/lainnya?app=queue-line",
    icon: Clock,
    badge: "Service Flow",
    accentGradient: "from-emerald-500 to-teal-600",
    accentBorder: "border-emerald-500/30 hover:border-emerald-500/60",
    badgeBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    badgeText: "Customers",
    subMenus: [
      { id: "queue-line", label: "Queue Line", to: "/lainnya?app=queue-line" },
      { id: "book-slot", label: "Book Slot", to: "/lainnya?app=book-slot" },
      { id: "visitor-log", label: "Visitor Log", to: "/lainnya?app=visitor-log" },
      { id: "loyalty-point", label: "Loyalty Point", to: "/lainnya?app=loyalty-point" },
    ],
  },

  // ============================================================================
  // 3. Back Office (2 Apps)
  // ============================================================================
  {
    id: "spending-and-assets",
    name: "Spending and Assets",
    category: "back-office",
    categoryLabel: "Back Office",
    shortDesc:
      "Pelacak pos pengeluaran operasional usaha, pemantauan langganan SaaS periodik, registrasi aset kantor, dan tabel struktur saham ekuitas.",
    to: "/expense-tracker",
    icon: Receipt,
    badge: "Spending & Assets",
    accentGradient: "from-rose-500 to-pink-600",
    accentBorder: "border-rose-500/30 hover:border-rose-500/60",
    badgeBg: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
    badgeText: "Back Office",
    subMenus: [
      { id: "expense-tracker", label: "Expense Tracker", to: "/expense-tracker" },
      { id: "subscription-manager", label: "Subscription Manager", to: "/subscription-manager" },
      { id: "asset-manager", label: "Asset Manager", to: "/asset-manager" },
      { id: "cap-table", label: "Struktur Saham & Cap Table", to: "/peh/cap-table" },
    ],
  },
  {
    id: "data-and-access",
    name: "Data and Access",
    category: "back-office",
    categoryLabel: "Back Office",
    shortDesc:
      "Pusat statistik analitik kinerja konsultan, mesin pencarian terpadu seluruh arsip, dan direktori matriks kontrol hak akses internal.",
    to: "/statistics",
    icon: LineChart,
    badge: "Data & Access",
    accentGradient: "from-indigo-500 to-sky-600",
    accentBorder: "border-indigo-500/30 hover:border-indigo-500/60",
    badgeBg: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
    badgeText: "Back Office",
    subMenus: [
      { id: "statistics", label: "Statistics", to: "/statistics" },
      { id: "search-manager", label: "Search Manager", to: "/search-manager" },
      { id: "access-directory", label: "Access Directory", to: "/lainnya?app=access-matrix" },
    ],
  },
];

export const BIZ_OPS_CATEGORY_TABS: {
  id: BizOpsCategory;
  label: string;
  count: number;
}[] = [
  { id: "all", label: "Semua", count: 7 },
  { id: "supply", label: "Supply", count: 2 },
  { id: "customers", label: "Customers", count: 3 },
  { id: "back-office", label: "Back Office", count: 2 },
];

export function BusinessOperationsCustomersPage({
  isEmbedded = false,
}: {
  isEmbedded?: boolean;
} = {}) {
  const [selectedCategory, setSelectedCategory] = useState<BizOpsCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { isFavorite, toggleFavorite } = useFavorites();

  const filteredApps = useMemo(() => {
    return BIZ_OPS_APPS.filter((app) => {
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
              {BIZ_OPS_CATEGORY_TABS.map((tab) => {
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
        <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card/90 via-card/60 to-blue-500/5 p-6 sm:p-8 shadow-xs backdrop-blur-sm">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold">
                <Store className="size-3.5" />
                <span>Business Operations & Customers</span>
                <span className="size-1 rounded-full bg-blue-500" />
                <span>7 Aplikasi</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Business Operations and Customers
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Semua (7) · Supply (2) · Customers (3) · Back Office (2).
                Pusat operasional terintegrasi: rantai pasok vendor & stok produk, manajemen relasi & alur layanan pelanggan, serta tata kelola aset dan pengeluaran back office.
              </p>
            </div>

            {/* Quick Stat Highlights */}
            <div className="grid grid-cols-3 gap-2.5 shrink-0">
              <div className="p-3.5 rounded-2xl bg-card/80 border border-border/70 flex flex-col">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Supply
                </span>
                <span className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                  2 Modul
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-card/80 border border-border/70 flex flex-col">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Customers
                </span>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                  3 Modul
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-card/80 border border-border/70 flex flex-col">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Back Office
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
              {BIZ_OPS_CATEGORY_TABS.map((tab) => {
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
                ? "Semua Kategori Business Operations and Customers"
                : `Kategori: ${
                    BIZ_OPS_CATEGORY_TABS.find((t) => t.id === selectedCategory)?.label
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

export default BusinessOperationsCustomersPage;
