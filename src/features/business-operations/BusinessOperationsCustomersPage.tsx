import React, { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useFavorites } from "@/hooks/useFavorites";
import { ShellHeader } from "@/app/shell-header";
import { ALL_APP_MODULES } from "@/features/launcher/AppModuleSection";
import { MBACard } from "@/components/common/MBACard";
import {
  LayoutGrid,
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
  const { isFavorite, toggleFavorite, favorites } = useFavorites();

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
      {/* Portaled ShellHeader Filter Pills (Direct Selected / Unselected Layers) */}
      <ShellHeader>
        <div className="flex items-center gap-1 h-full m-0 p-0">
          {BIZ_OPS_CATEGORY_TABS.map((tab) => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                title={`${tab.label} (${tab.count})`}
                className={`px-3.5 h-[36px] rounded-full text-xs transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 font-medium"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] ${
                    isActive
                      ? "text-primary-foreground/90 font-bold"
                      : "text-muted-foreground/75"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </ShellHeader>

      {/* Main Page Container */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 space-y-4">
        {/* Title (Matching MBA Page Header Style) */}
        <div className="text-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground/90 tracking-tight flex items-center justify-center gap-2.5">
            <Store className="size-7 text-primary" />
            <span>Business Administration and Operations Management</span>
          </h1>
        </div>

        {/* Applications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5 sm:gap-5">
          {filteredApps.map((app) => (
            <MBACard
              key={app.id}
              title={app.name}
              to={app.to}
              icon={app.icon}
              badge={app.badgeText}
              shortDesc={app.shortDesc}
              accentGradient={app.accentGradient}
              features={app.subMenus.map((sub) => ({
                title: sub.label,
                to: sub.to || app.to,
              }))}
              isFav={isFavorite(app.to)}
              toggleFavorite={toggleFavorite}
            />
          ))}
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
