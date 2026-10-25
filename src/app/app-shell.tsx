import { AppDock } from "./shell/app-dock";
import { ShellSidebarProvider } from "./shell-sidebar";
import { ShellHeaderProvider } from "./shell-header";
import { SidebarPillarsMenu } from "./shell/SidebarPillarsMenu";
import {
  ShellSectionsProvider,
  type ShellSection,
} from "./shell-sections";
import { TypewriterSearchText } from "./shell/TypewriterSearchText";
import { AnimatedSearchIcon } from "./shell/AnimatedSearchIcon";
import {
  WindowPositionLeftIcon,
  WindowPositionRightIcon,
} from "@/components/icons/WindowPositionIcons";
import { useState, useEffect, useMemo, useRef, useCallback, useLayoutEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Terminal,
  Users,
  FolderKanban,
  CheckSquare,
  CheckCircle2,
  NotebookText,
  CalendarDays,
  Compass,
  MessagesSquare,
  Activity,
  HeartHandshake,
  Navigation,
  Menu,
  Building,
  TrendingUp,
  Package,
  Grid2X2,
  MoreHorizontal,
  MoreVertical,
  Star,
  User,
  Settings,
  Wallet,
  ChevronRight,
  Timer,
  Clock,
  Flame,
  Dumbbell,
  Key,
  Briefcase,
  Target,
  BookOpen,
  Lightbulb,
  Utensils,
  Coffee,
  CloudSun,
  Plane,
  ShoppingCart,
  Heart,
  HeartPulse,
  Archive,
  GraduationCap,
  Globe,
  Ticket,
  PenTool,
  DollarSign,
  Building2,
  Store,
  Receipt,
  LineChart,
  Search,
  Bell,
  Truck,
  Home,
  Crown,
  Sofa,
  Palette,
  Car,
  Fuel,
  Film,
  GitFork,
  ShieldAlert,
  FileCode2,
  FileText,
  Code,
  LayoutGrid,
  Wrench,
  Pocket,
  ShoppingBag,
  Vault,
  Luggage,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import { CommandPalette } from "@/app/CommandPalette";
import { QuickCaptureModal } from "@/app/QuickCaptureModal";
import { ShortcutModal } from "@/app/ShortcutModal";
import { TerminalModal } from "@/app/TerminalModal";
import { RecentModal } from "@/app/RecentModal";
import { TaskbarModal } from "@/app/TaskbarModal";
import { useRecentApps } from "@/hooks/useRecentApps";
import { recordActiveApp } from "@/utils/launcherCategoryMapper";
import { SettingsModal } from "./wira-settings";
import { TopPanelControlHub } from "./shell/TopPanelControlHub";
import { useMenuSettings } from "@/hooks/useMenuSettings";
import { useFavorites } from "@/hooks/useFavorites";
import { HeaderNavControls } from "./HeaderNavControls";
import { useCustomNav } from "@/hooks/useCustomNav";
import { navKonsultan, navAllSidebar, type NavItem, type NavGroup as NavGroupType } from "@/config/nav";
import { ProgressiveBlur } from "@/components/ProgressiveBlur";
import { useProgressiveBlurSetting } from "@/hooks/useProgressiveBlurSetting";
import { useLiquidGlassSetting } from "@/hooks/useLiquidGlassSetting";
import { useThemeColor } from "@/hooks/useThemeColor";


export type AppModeId = "personal" | "household" | "relatives" | "employment" | "owner" | "public" | "student" | "creator" | "wellbeing" | "leisure" | "home-leisure" | "family-community";

export interface ModeItem {
  id: AppModeId;
  label: string;
  badge: string;
  desc: string;
  icon: LucideIcon;
  badgeClass: string;
  links: { to: string; label: string; icon: LucideIcon }[];
}

export const APP_MODES: ModeItem[] = [
  {
    id: "personal",
    label: "Personal Life",
    badge: "5 Modul",
    desc: "Semua (5) · Habits and Mind (2) · Body and Health (2) · Personal Tools (1)",
    icon: Heart,
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    links: [
      { to: "/personal-life", label: "Personal Life Hub", icon: Heart },
      { to: "/habit-tracker", label: "Habits and Planning", icon: Flame },
      { to: "/journal", label: "Journaling", icon: BookOpen },
      { to: "/health?tab=workouts", label: "Fitness and Sleep", icon: Dumbbell },
      { to: "/health", label: "Health Records", icon: HeartPulse },
      { to: "/passwords", label: "Personal Tools", icon: Key },
    ],
  },
  {
    id: "home-leisure",
    label: "Home and Leisure",
    badge: "6 Modul",
    desc: "Semua (6) · Home (2) · Vehicle (2) · Leisure (2)",
    icon: Home,
    badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    links: [
      { to: "/home-and-leisure", label: "Home and Leisure Hub", icon: Home },
      { to: "/lainnya?app=home-chores", label: "Household Care", icon: CheckSquare },
      { to: "/recipes", label: "Kitchen and Shopping", icon: Utensils },
      { to: "/lainnya?app=vehicle-identity", label: "Vehicle Records", icon: Car },
      { to: "/lainnya?app=mileage-fuel", label: "Vehicle Care", icon: Fuel },
      { to: "/trips", label: "Travel and Weather", icon: Plane },
      { to: "/movies", label: "Entertainment", icon: Film },
    ],
  },
  {
    id: "family-community",
    label: "Family and Community",
    badge: "9 Modul",
    desc: "Semua (9) · Family (3) · Relationships (2) · Neighborhood (3) · Giving (1)",
    icon: Users,
    badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    links: [
      { to: "/family-and-community", label: "Family and Community Hub", icon: Users },
      { to: "/lainnya?app=family-tree", label: "Family Records", icon: GitFork },
      { to: "/lainnya?app=emergency-hub", label: "Family Safety", icon: ShieldAlert },
      { to: "/peh/family-budget", label: "Family Life", icon: Heart },
      { to: "/lainnya?app=circle-groups", label: "Staying in Touch", icon: MessagesSquare },
      { to: "/lainnya?app=gift-tracker", label: "Celebrations", icon: Star },
      { to: "/lainnya?app=rt-rw-directory", label: "Neighbors and Board", icon: Building },
      { to: "/lainnya?app=public-services-guide", label: "Civic Services", icon: Compass },
      { to: "/lainnya?app=civic-calendar", label: "Civic Agenda", icon: CalendarDays },
      { to: "/zakat", label: "Giving and Impact", icon: Wallet },
    ],
  },
  {
    id: "student",
    label: "Knowledge and Learning",
    badge: "7 Modul",
    desc: "Semua (7) · Documents (3) · Learning (2) · Creative (2)",
    icon: GraduationCap,
    badgeClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    links: [
      { to: "/knowledge-and-learning", label: "Knowledge and Learning Hub", icon: GraduationCap },
      { to: "/notes", label: "Notes and Documents", icon: FileText },
      { to: "/knowledge-base", label: "Knowledge Library", icon: BookOpen },
      { to: "/research-manager", label: "Research and Reading", icon: Compass },
      { to: "/courses", label: "Courses and Study", icon: GraduationCap },
      { to: "/languages", label: "Skills and Credentials", icon: Globe },
      { to: "/ideas", label: "Ideas and Design", icon: Palette },
      { to: "/writing", label: "Writing and Code", icon: Code },
    ],
  },
  {
    id: "employment",
    label: "Work and Productivity",
    badge: "9 Modul",
    desc: "Semua (9) · Execution (3) · Partners (2) · Control (3) · Ownership (1)",
    icon: Briefcase,
    badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    links: [
      { to: "/work-productivity", label: "Work & Productivity Hub", icon: Briefcase },
      { to: "/peh/milestones", label: "Target & Milestone", icon: Target },
      { to: "/peh/workflows", label: "Alur Kerja & Pipeline", icon: CheckCircle2 },
      { to: "/peh/projects", label: "Pipeline Produksi Konten", icon: FolderKanban },
      { to: "/peh/vendors", label: "Vendor & Mitra Layanan", icon: Building },
      { to: "/peh/procurement", label: "Pengadaan & Purchase Orders", icon: DollarSign },
      { to: "/peh/meetings", label: "Notulensi & Keputusan Rapat", icon: CheckSquare },
      { to: "/peh/incidents", label: "Log Masalah & Insiden", icon: ShieldAlert },
      { to: "/peh/compliance", label: "Kepatuhan & Audit Regulasi", icon: ShieldAlert },
      { to: "/peh/cap-table", label: "Struktur Saham & Cap Table", icon: LayoutGrid },
    ],
  },
  {
    id: "owner",
    label: "Business Operations and Customers",
    badge: "7 Modul",
    desc: "Semua (7) · Supply (2) · Customers (3) · Back Office (2)",
    icon: Store,
    badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    links: [
      { to: "/business-operations", label: "Business Operations Hub", icon: Store },
      { to: "/peh/vendors", label: "Vendors and Procurement", icon: Truck },
      { to: "/katalog-produk", label: "Products and Stock", icon: Package },
      { to: "/klien", label: "Client Records", icon: Briefcase },
      { to: "/portal", label: "Client Communication", icon: MessagesSquare },
      { to: "/lainnya?app=queue-line", label: "Service Flow", icon: Clock },
      { to: "/expense-tracker", label: "Spending and Assets", icon: Receipt },
      { to: "/statistics", label: "Data and Access", icon: LineChart },
    ],
  },
  {
    id: "public",
    label: "Public",
    badge: "External",
    desc: "Ranah Publik & Dinamika Luar",
    icon: Globe,
    badgeClass: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    links: [
      { to: "/outward", label: "Outward Radar", icon: Compass },
      { to: "/outlook", label: "Outlook Dinamika", icon: TrendingUp },
      { to: "/weather", label: "Cuaca & Iklim Global", icon: CloudSun },
      { to: "/100-komoditas", label: "100 Komoditas Pasar", icon: Package },
      { to: "/incoterms", label: "Panduan Incoterms & Ekspor", icon: Navigation },
    ],
  },
];

const CATEGORY_META: Record<string, { icon: LucideIcon; accent: string }> = {
  // Super Categories
  "21 Kategori": { icon: LayoutGrid, accent: "text-primary" },
  "100 Framework": { icon: Grid2X2, accent: "text-purple-600 dark:text-purple-400" },
  "Keuangan & Pasar": { icon: Wallet, accent: "text-emerald-600 dark:text-emerald-400" },
  "Kesehatan & Personal": { icon: Heart, accent: "text-rose-600 dark:text-rose-400" },
  "Kreatif & Akademi": { icon: PenTool, accent: "text-pink-600 dark:text-pink-400" },
  "Knowledge & Bisnis": { icon: BookOpen, accent: "text-sky-600 dark:text-sky-400" },

  // The 21 Categories
  "Dapur dan Bahan Makanan": { icon: Utensils, accent: "text-orange-500 dark:text-orange-400" },
  "Pemeliharaan Rumah dan Utilitas": { icon: Home, accent: "text-amber-600 dark:text-amber-400" },
  "Kendaraan dan Otomotif": { icon: Car, accent: "text-blue-600 dark:text-blue-400" },
  "Perjalanan": { icon: Plane, accent: "text-teal-600 dark:text-teal-400" },
  "Keluarga dan Internal Rumah": { icon: Heart, accent: "text-pink-600 dark:text-pink-400" },
  "Relasi Jejaring dan Profesional": { icon: Users, accent: "text-indigo-600 dark:text-indigo-400" },
  "Lingkungan Komunitas Warga": { icon: Building2, accent: "text-emerald-600 dark:text-emerald-400" },
  "Sosial dan Keagamaan": { icon: HeartHandshake, accent: "text-green-600 dark:text-green-400" },
  "Keselamatan dan Darurat": { icon: ShieldAlert, accent: "text-rose-600 dark:text-rose-400" },
  "Perencanaan Alur Kerja Proyek": { icon: FolderKanban, accent: "text-purple-600 dark:text-purple-400" },
  "Pelaksanaan Tugas dan Karya": { icon: CheckSquare, accent: "text-sky-600 dark:text-sky-400" },
  "Jadwal dan Kalender": { icon: CalendarDays, accent: "text-blue-500 dark:text-blue-400" },
  "Fokus dan Kebiasaan": { icon: Timer, accent: "text-yellow-600 dark:text-yellow-400" },
  "Rapat dan Kolaborasi Tim": { icon: MessagesSquare, accent: "text-violet-600 dark:text-violet-400" },
  "Manajemen Sumber Daya Manusia": { icon: Users, accent: "text-cyan-600 dark:text-cyan-400" },
  "Dokumentasi dan Wiki": { icon: BookOpen, accent: "text-emerald-500 dark:text-emerald-400" },
  "Pengelolaan Form dan Template": { icon: FileCode2, accent: "text-indigo-500 dark:text-indigo-400" },
  "Keuangan dan Aset": { icon: Wallet, accent: "text-emerald-600 dark:text-emerald-400" },
  "Vendor dan Logistik Kantor": { icon: Truck, accent: "text-amber-500 dark:text-amber-400" },
  "Target dan Performa": { icon: Target, accent: "text-rose-500 dark:text-rose-400" },
  "Utilitas Sistem": { icon: Settings, accent: "text-slate-500 dark:text-slate-400" },

  // Legacy Domain Categories
  Finance: { icon: Wallet, accent: "text-emerald-600 dark:text-emerald-400" },
  "Phase Side": { icon: Compass, accent: "text-indigo-600 dark:text-indigo-400" },
  "100 Tools": { icon: Grid2X2, accent: "text-purple-600 dark:text-purple-400" },
  Productivity: { icon: CheckSquare, accent: "text-blue-600 dark:text-blue-400" },
  Personal: { icon: User, accent: "text-rose-600 dark:text-rose-400" },
  Society: { icon: Users, accent: "text-amber-600 dark:text-amber-400" },
  "Creative & Media": { icon: PenTool, accent: "text-pink-600 dark:text-pink-400" },
  "Academy & Tools": { icon: GraduationCap, accent: "text-sky-600 dark:text-sky-400" },
};

export const SUPER_CATEGORIES = [
  { id: "All", label: "Semua", icon: LayoutDashboard },
  { id: "Tools", label: "Tools", icon: Wrench },
  { id: "100 Framework", label: "100 Framework", icon: Grid2X2 },
  { id: "Keuangan & Pasar", label: "Keuangan & Pasar", icon: Wallet },
  { id: "Kesehatan & Personal", label: "Kesehatan & Personal", icon: Heart },
  { id: "Kreatif & Akademi", label: "Kreatif & Akademi", icon: PenTool },
  { id: "Knowledge & Bisnis", label: "Knowledge & Bisnis", icon: BookOpen },
];


export function AppShell({
  title,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const location = useRouterState({ select: (s) => s.location });
  const pathname = location.pathname;
  const fullPath = pathname + (location.searchStr || "");
  const rawNav = navKonsultan;
  const { enabledMenus } = useMenuSettings();
  const { findItemById, findItemByPath } = useCustomNav();
  const { config: blurConfig, blurLevels } = useProgressiveBlurSetting();
  useLiquidGlassSetting();
  useThemeColor();


  // ---------------------------------------------------------------------------
  // CONTEXT RESOLUTION — determine which nav group / parent-category the route
  // that is currently open belongs to. This drives BOTH the left sidebar scope
  // and the header's context pill so the shell adapts to the active app.
  // ---------------------------------------------------------------------------
  const contextMatch: { item: NavItem; group: NavGroupType } | null = (() => {
    const sidebarAll: { item: NavItem; group: NavGroupType }[] = [];
    navAllSidebar.forEach((g) => g.items.forEach((item) => sidebarAll.push({ item, group: g })));
    const sMatch = (
      sidebarAll.find((x) => x.item.to === fullPath) ||
      sidebarAll.find((x) => x.item.to === pathname) ||
      sidebarAll.find((x) => x.item.to !== "/" && x.item.to.split("?")[0] === pathname) ||
      sidebarAll.find((x) => {
        const base = x.item.to.split("?")[0];
        return base !== "/" && pathname.startsWith(base);
      }) ||
      null
    );
    if (sMatch) return sMatch;

    const all: { item: NavItem; group: NavGroupType }[] = [];
    rawNav.forEach((g) => g.items.forEach((item) => all.push({ item, group: g })));
    return (
      all.find((x) => x.item.to === fullPath) ||
      all.find((x) => x.item.to === pathname) ||
      all.find((x) => x.item.to !== "/" && x.item.to.split("?")[0] === pathname) ||
      all.find((x) => {
        const base = x.item.to.split("?")[0];
        return base !== "/" && pathname.startsWith(base);
      }) ||
      null
    );
  })();

  const contextCategory =
    pathname === "/" ? null : contextMatch?.group.title || contextMatch?.group.sectionCategory || contextMatch?.group.parentCategory || null;
  const ContextCategoryIcon = contextCategory
    ? CATEGORY_META[contextCategory]?.icon
    : null;

  // Standalone mini-app config for the current route, so the fallback sidebar
  // can surface that app's own tabs as per-app navigation.

  // Category currently browsed in the left sidebar. Default to "All".

  const isHome = pathname === "/" || pathname === "/home";
  const [hasAppSidebar, setHasAppSidebar] = useState(false);
  const [sidebarView, setSidebarView] = useState<"navigation" | "menu">("navigation");
  useEffect(() => {
    setSidebarView("navigation");
    if (pathname && pathname !== "/" && pathname !== "/home") {
      recordActiveApp(pathname);
    }
  }, [pathname]);

  // Listen to open-left-sidebar custom events
  useEffect(() => {
    const handleOpenLeft = (e: any) => {
      setOpenDrawer("left");
      if (e?.detail?.tab) {
        setSidebarView(e.detail.tab);
      }
    };
    window.addEventListener("open-left-sidebar", handleOpenLeft);
    return () => window.removeEventListener("open-left-sidebar", handleOpenLeft);
  }, []);

  const [rightSidebarTab, setRightSidebarTab] = useState<"control" | "favorites">("control");

  // Both sidebars are off-canvas overlay drawers that float on top of the content
  // without shifting the main body layout.
  const [openDrawer, setOpenDrawer] = useState<"left" | "right" | null>(null);

  const shellSidebarCtx = useMemo(() => ({ setHasAppSidebar }), []);

  // Whether the currently-open app registered its own header via <ShellHeader>.
  const [hasAppHeader, setHasAppHeader] = useState(false);
  const shellHeaderCtx = useMemo(() => ({ setHasAppHeader }), []);

  // Sections published by the open app via useShellSections(). Kept in a ref so
  // click handlers are never stale; `bump` forces a re-render when they change.
  // These drive BOTH the sidebar "Di aplikasi ini" list and the header's row of
  // up to 5 interactive buttons (the header is an elaboration of the sidebar).
  const sectionsRef = useRef<ShellSection[]>([]);
  const [, setSectionsVersion] = useState(0);
  const bumpSections = useCallback(() => setSectionsVersion((v) => v + 1), []);
  const shellSectionsCtx = useMemo(
    () => ({ sectionsRef, bump: bumpSections }),
    [bumpSections],
  );

  // The section list to surface. Priority: app-registered sections, then a
  // standalone mini-app's own tabs (deep-linked via ?tab=). Empty otherwise.

  // Measure the (variable-height) contextual header so the scrollable content
  // always starts exactly below it.
  const headerRef = useRef<HTMLElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState(60);
  const [isTopPanelOpen, setIsTopPanelOpen] = useState(false);
  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    let rafId: number | null = null;
    const update = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!headerRef.current) return;
        const h = headerRef.current.offsetHeight || 60;
        setHeaderHeight((prev) => (prev !== h ? h : prev));
      });
    };
    const initialH = el.offsetHeight || 60;
    setHeaderHeight((prev) => (prev !== initialH ? initialH : prev));

    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    ro?.observe(el);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      ro?.disconnect();
    };
  }, [hasAppHeader, pathname, isTopPanelOpen]);

  const [collapsedNavGroups, setCollapsedNavGroups] = useState<Record<string, boolean>>({});
  const [currentMode, setCurrentMode] = useState<AppModeId>(() => {
    try {
      const saved = localStorage.getItem("client_os_active_mode") || localStorage.getItem("aio_active_mode");
      if (saved && APP_MODES.some((m) => m.id === saved)) {
        return saved as AppModeId;
      }
    } catch {}
    return "personal";
  });
  const [isModeOpen, setIsModeOpen] = useState(false);

  useEffect(() => {
    const handleLauncherModeChanged = (e: any) => {
      const modeId = e.detail;
      if (modeId && APP_MODES.some((m) => m.id === modeId)) {
        setCurrentMode(modeId as AppModeId);
      }
    };
    window.addEventListener("aio_launcher_mode_changed", handleLauncherModeChanged);
    return () => window.removeEventListener("aio_launcher_mode_changed", handleLauncherModeChanged);
  }, []);
  const activeModeConfig = APP_MODES.find((m) => m.id === currentMode) || APP_MODES[0];
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLeftSidebar75, setIsLeftSidebar75] = useState<boolean>(() => {
    try {
      const v = localStorage.getItem("aio_left_sidebar_75");
      if (v !== null) return v === "true";
      return localStorage.getItem("aio_left_sidebar_100") === "true";
    } catch {
      return false;
    }
  });

  const toggleLeftSidebar75 = () => {
    setIsLeftSidebar75((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("aio_left_sidebar_75", String(next));
      } catch {}
      return next;
    });
  };

  const closeLeftSidebar = useCallback(() => {
    setOpenDrawer(null);
    if (isLeftSidebar75) {
      setIsLeftSidebar75(false);
      try {
        localStorage.setItem("aio_left_sidebar_75", "false");
        localStorage.removeItem("aio_left_sidebar_100");
      } catch {}
    }
  }, [isLeftSidebar75]);

  const [activeSettingsTab, setActiveSettingsTab] = useState("general");
  const { favorites, toggleFavorite } = useFavorites();

  // Gabungan semua item nav untuk daftar Favorit
  const allNavItems: { to: string; label: string; icon: LucideIcon }[] = [
    { to: "/", label: "Launcher", icon: LayoutDashboard },
    { to: "/terminal", label: "Terminal", icon: Terminal },
    ...navKonsultan.flatMap((g) => g.items as { to: string; label: string; icon: LucideIcon }[]),
  ];
  const favItems = favorites
    .map((route) => {
      const match = allNavItems.find((i) => i.to === route || i.to.split("?")[0] === route.split("?")[0]);
      if (match) return { ...match, to: route };
      return { to: route, label: route.replace("/", "").replace(/-/g, " "), icon: Star };
    });

  useEffect(() => {
    const timeout = setTimeout(() => {
      const sidebarContainer = document.querySelector(
        "#sidenavLeft .overflow-y-auto",
      ) as HTMLElement | null;
      const activeElement = sidebarContainer?.querySelector(
        '[data-status="active"]',
      ) as HTMLElement | null;
      if (sidebarContainer && activeElement) {
        const containerRect = sidebarContainer.getBoundingClientRect();
        const activeRect = activeElement.getBoundingClientRect();
        const scrollTop =
          sidebarContainer.scrollTop +
          (activeRect.top - containerRect.top) -
          containerRect.height / 2 +
          activeRect.height / 2;
        sidebarContainer.scrollTo({ top: scrollTop, behavior: "smooth" });
      }
    }, 150);

    return () => {
      clearTimeout(timeout);
    };
  }, [pathname]);

  const { addRecentApp } = useRecentApps();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [isShortcutOpen, setIsShortcutOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isExpandOpen, setIsExpandOpen] = useState(false);
  const [isRecentOpen, setIsRecentOpen] = useState(false);
  const [isTaskbarOpen, setIsTaskbarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-record visited navigation into Recent
  useEffect(() => {
    if (!pathname) return;
    const allNavFlat = navKonsultan.flatMap((g) => g.items);
    const match = allNavFlat.find(
      (i) => i.to === pathname || i.to.split("?")[0] === pathname
    );
    if (match) {
      addRecentApp({ to: match.to, label: match.label });
    } else if (pathname === "/") {
      addRecentApp({ to: "/", label: "Launcher Modul", category: "Navigasi" });
    } else if (pathname === "/home") {
      addRecentApp({ to: "/home", label: "Beranda Eksekutif", category: "Navigasi" });
    }
  }, [pathname, addRecentApp]);

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K, +, Esc) & custom dock events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      const isInput = tag === "input" || tag === "textarea" || (e.target as HTMLElement)?.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (!isInput && e.key === "+") {
        e.preventDefault();
        setIsQuickCaptureOpen(true);
        setIsShortcutOpen(false);
        setIsTerminalOpen(false);
        setIsExpandOpen(false);
        setIsRecentOpen(false);
        setIsTaskbarOpen(false);
      } else if (e.key === "Escape") {
        setIsQuickCaptureOpen(false);
        setIsShortcutOpen(false);
        setIsTerminalOpen(false);
        setIsExpandOpen(false);
        setIsRecentOpen(false);
        setIsTaskbarOpen(false);
      }
    };

    const handleOpenQuickCapture = () => {
      setIsQuickCaptureOpen(true);
      setIsShortcutOpen(false);
      setIsTerminalOpen(false);
      setIsExpandOpen(false);
      setIsRecentOpen(false);
      setIsTaskbarOpen(false);
    };

    const handleOpenShortcut = () => {
      setIsShortcutOpen(true);
      setIsQuickCaptureOpen(false);
      setIsTerminalOpen(false);
      setIsExpandOpen(false);
      setIsRecentOpen(false);
      setIsTaskbarOpen(false);
    };

    const handleOpenTerminal = () => {
      setIsTerminalOpen(true);
      setIsQuickCaptureOpen(false);
      setIsShortcutOpen(false);
      setIsExpandOpen(false);
      setIsRecentOpen(false);
      setIsTaskbarOpen(false);
    };

    const handleOpenExpand = () => {
      setIsExpandOpen(true);
      setIsQuickCaptureOpen(false);
      setIsShortcutOpen(false);
      setIsTerminalOpen(false);
      setIsRecentOpen(false);
      setIsTaskbarOpen(false);
    };

    const handleOpenRecent = () => {
      setIsRecentOpen((prev) => !prev);
      setIsTaskbarOpen(false);
      setIsQuickCaptureOpen(false);
      setIsShortcutOpen(false);
      setIsTerminalOpen(false);
      setIsExpandOpen(false);
    };

    const handleOpenTaskbar = () => {
      setIsTaskbarOpen((prev) => !prev);
      setIsRecentOpen(false);
      setIsQuickCaptureOpen(false);
      setIsShortcutOpen(false);
      setIsTerminalOpen(false);
      setIsExpandOpen(false);
    };

    const handleOpenSearch = () => {
      setIsCommandPaletteOpen(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("aio_open_quick_capture", handleOpenQuickCapture);
    window.addEventListener("aio_open_shortcut", handleOpenShortcut);
    window.addEventListener("aio_open_terminal", handleOpenTerminal);
    window.addEventListener("aio_open_expand", handleOpenExpand);
    window.addEventListener("aio_open_recent", handleOpenRecent);
    window.addEventListener("aio_open_taskbar", handleOpenTaskbar);
    window.addEventListener("aio_open_search", handleOpenSearch);

    const handleToast = (e: any) => {
      if (e?.detail) {
        setToastMessage(e.detail);
        setTimeout(() => setToastMessage(null), 3200);
      }
    };
    window.addEventListener("aio_toast", handleToast);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("aio_open_quick_capture", handleOpenQuickCapture);
      window.removeEventListener("aio_open_shortcut", handleOpenShortcut);
      window.removeEventListener("aio_open_terminal", handleOpenTerminal);
      window.removeEventListener("aio_open_expand", handleOpenExpand);
      window.removeEventListener("aio_open_recent", handleOpenRecent);
      window.removeEventListener("aio_open_taskbar", handleOpenTaskbar);
      window.removeEventListener("aio_open_search", handleOpenSearch);
      window.removeEventListener("aio_toast", handleToast);
    };
  }, []);

  const handleOpenSettings = (tab = "general") => {
    setActiveSettingsTab(tab);
    setIsSettingsOpen(true);
  };

  return (
    <ShellSidebarProvider value={shellSidebarCtx}>
    <ShellHeaderProvider value={shellHeaderCtx}>
    <ShellSectionsProvider value={shellSectionsCtx}>
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        initialTab={activeSettingsTab}
      />

      <aside
        id="sidenavLeft"
        className={`fixed inset-y-0 left-0 z-50 flex ${
          isLeftSidebar75
            ? "w-[75px] bg-primary border-r border-white/20 shadow-xl"
            : "w-[350px] liquid-glass-sidebar-left"
        } max-w-[85vw] shrink-0 flex-col transition-all duration-300 ease-in-out ${openDrawer === "left" ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Spacer atas: Tombol close / toggle kiri yang sejajar dengan header + 3 dots traffic controls & 3 dots action */}
        <div
          className={`w-full h-[60px] sidebar-top-glass shrink-0 flex items-center px-3 ${
            isLeftSidebar75
              ? "justify-center px-1 !border-b-0 !border-none !shadow-none"
              : "justify-between border-b border-white/20 dark:border-white/10"
          }`}
        >
          {!isLeftSidebar75 ? (
            <>
              <button
                type="button"
                className="size-9 rounded-full aspect-square text-white/90 hover:text-white hover:bg-white/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center shrink-0"
                onClick={closeLeftSidebar}
                title="Sembunyikan Navigasi"
                aria-label="Tutup sidebar kiri"
              >
                <WindowPositionLeftIcon size={24} />
              </button>

              {/* 3 Dots: Klik langsung minimize / switch ke mode ringkas 75px */}
              <button
                type="button"
                onClick={toggleLeftSidebar75}
                className="size-9 rounded-full aspect-square text-white/90 hover:text-white hover:bg-white/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center shrink-0"
                title="Mode Ringkas 75px (Minimize)"
                aria-label="Mode ringkas 75px"
              >
                <MoreVertical size={20} className="shrink-0" />
              </button>
            </>
          ) : (
            /* Mode Ringkas 75px: Hanya 3 Dots untuk mengembalikan ke 350px (tombol kedua dihapus) */
            <div className="w-full flex items-center justify-center">
              <button
                type="button"
                onClick={toggleLeftSidebar75}
                className="size-9 rounded-full aspect-square text-white/80 hover:text-white hover:bg-white/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center shrink-0"
                title="Perluas ke Lebar Penuh (350px)"
                aria-label="Perluas ke 350px"
              >
                <MoreHorizontal size={20} className="shrink-0" />
              </button>
            </div>
          )}
        </div>

        {/* View switcher: Ribbon Tab - hanya muncul di mode full view (tidak muncul saat minimize) */}
        {!isLeftSidebar75 && (
          <div className="sidebar-tab-switcher-bar flex items-end w-full h-10 bg-white/10 dark:bg-white/5 shrink-0 gap-0 relative z-20">
            {/* Bilah Tab 1: Navigation */}
            <button
              type="button"
              onClick={() => setSidebarView("navigation")}
              className={`relative flex-1 h-10 flex items-center justify-center gap-2 px-2 text-xs transition-all cursor-pointer rounded-tl-none rounded-tr-xl -mb-px ${
                sidebarView === "navigation"
                  ? "sidebar-tab-active-glass !border-b-0"
                  : "sidebar-tab-inactive-glass"
              }`}
              title="Navigation"
            >
              <Navigation className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Navigation</span>
            </button>

            {/* Bilah Tab 2: Menu */}
            <button
              type="button"
              onClick={() => setSidebarView("menu")}
              className={`relative flex-1 h-10 flex items-center justify-center gap-2 px-2 text-xs transition-all cursor-pointer rounded-tl-xl rounded-tr-none -mb-px ${
                sidebarView === "menu"
                  ? "sidebar-tab-active-glass !border-b-0"
                  : "sidebar-tab-inactive-glass"
              }`}
              title="Menu"
            >
              <Menu className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Menu</span>
              {hasAppSidebar && (
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-white text-primary font-bold shrink-0 shadow-2xs">
                  Fitur
                </span>
              )}
            </button>
          </div>
        )}

        <div
          className={`flex-1 min-h-0 overflow-y-auto no-scrollbar px-3 ${
            isLeftSidebar75 ? "pt-1 pb-4 !border-t-0 !border-none !shadow-none" : "pt-5 pb-4"
          } sidebar-menu-body-glass`}
        >
          {/* Slot untuk konten sidebar milik app (target portal ShellSidebar) */}
          <div
            id="shellSidebarSlot"
            className={hasAppSidebar ? "block mb-4" : "hidden"}
          />

          {sidebarView === "navigation" ? (
            <div className="flex flex-col gap-3">
              {/* Navigation items for current mode */}
              <div className="flex flex-col gap-1.5">
                {!isLeftSidebar75 && (
                  <p className="px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Navigasi Mode ({activeModeConfig.label})
                  </p>
                )}
                {activeModeConfig.links.map((link) => {
                  const isActive = pathname === link.to;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setOpenDrawer(null)}
                      title={link.label}
                      className={`flex items-center ${
                        isLeftSidebar75
                          ? `justify-center p-2.5 rounded-xl border transition-all hover:scale-105 active:scale-95 ${
                              isActive
                                ? "bg-white text-primary border-white font-bold shadow-md ring-2 ring-white/40"
                                : "bg-white/10 hover:bg-white/20 border-white/20 text-white/90 hover:text-white"
                            }`
                          : `gap-2.5 px-3 py-2 rounded-xl text-xs transition-all border ${
                              isActive
                                ? "bg-primary/15 border-primary/40 text-primary font-semibold shadow-2xs"
                                : "bg-white/10 dark:bg-white/5 border-white/15 dark:border-white/10 text-foreground hover:bg-white/20 dark:hover:bg-white/10"
                            }`
                      }`}
                    >
                      <Icon
                        className={`size-4 shrink-0 ${
                          isLeftSidebar75
                            ? isActive
                              ? "text-primary"
                              : "text-white"
                            : "text-primary"
                        }`}
                      />
                      {!isLeftSidebar75 && <span className="truncate">{link.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : (
            <SidebarPillarsMenu
              isCompact={isLeftSidebar75}
              onNavigate={() => {
                if (typeof window !== "undefined" && window.innerWidth < 1024) {
                  setOpenDrawer(null);
                }
              }}
            />
          )}

          {blurConfig.enabled && !isLeftSidebar75 && (
            <div className="sticky bottom-0 inset-x-0 -mx-3 -mb-4 h-8 pointer-events-none z-20">
              <ProgressiveBlur
                direction="bottom"
                height={32}
                blurLevels={[0.5, 1, 2, 4, 8]}
                tint={blurConfig.tint ? "linear-gradient(to bottom, transparent 0%, hsl(var(--card) / 0.8) 100%)" : false}
              />
            </div>
          )}
        </div>
      </aside>

      <aside id="sidenavRight" className={`fixed inset-y-0 right-0 z-50 flex w-[350px] max-w-[85vw] flex-col liquid-glass-sidebar-right transition-transform duration-300 ease-in-out ${openDrawer === "right" ? "translate-x-0" : "translate-x-full"}`}>
        {/* Right Sidebar Spacer: Tombol close / toggle kanan yang sejajar dengan header */}
        <div className="w-full h-[60px] sidebar-top-glass shrink-0 flex items-center justify-end px-3 border-b border-white/20 dark:border-white/10">
          <button
            type="button"
            className="size-9 rounded-full aspect-square text-white/90 hover:text-white hover:bg-white/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center shrink-0"
            onClick={() => setOpenDrawer(null)}
            title="Sembunyikan Control Center"
            aria-label="Tutup sidebar kanan"
          >
            <WindowPositionRightIcon size={24} />
          </button>
        </div>

        {/* Right Sidebar Tab Switcher: Ribbon Tab diturunkan sejajar serata di bawah garis header 60px */}
        <div className="sidebar-tab-switcher-bar flex items-end w-full h-10 bg-white/10 dark:bg-white/5 shrink-0 gap-0 relative z-20">
          <button
            type="button"
            onClick={() => setRightSidebarTab("control")}
            className={`relative flex-1 h-10 flex items-center justify-center gap-2 px-3 text-xs transition-all cursor-pointer rounded-tl-none rounded-tr-xl -mb-px ${
              rightSidebarTab === "control"
                ? "sidebar-tab-active-glass !border-b-0"
                : "sidebar-tab-inactive-glass"
            }`}
          >
            <Settings className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Control</span>
          </button>
          <button
            type="button"
            onClick={() => setRightSidebarTab("favorites")}
            className={`relative flex-1 h-10 flex items-center justify-center gap-2 px-3 text-xs transition-all cursor-pointer rounded-tl-xl rounded-tr-none -mb-px ${
              rightSidebarTab === "favorites"
                ? "sidebar-tab-active-glass !border-b-0"
                : "sidebar-tab-inactive-glass"
            }`}
          >
            <Star className={`h-3.5 w-3.5 shrink-0 ${rightSidebarTab === "favorites" ? "text-amber-500 fill-amber-500" : "text-white/80"}`} />
            <span className="truncate">Favorit</span>
            {favorites.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold leading-none shrink-0 ${
                rightSidebarTab === "favorites" ? "bg-amber-500/20 text-amber-600 dark:text-amber-400" : "bg-muted text-muted-foreground"
              }`}>
                {favorites.length}
              </span>
            )}
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-4 py-4 sm:px-5 sidebar-menu-body-glass">
          {rightSidebarTab === "favorites" ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h3 className="text-xs font-bold text-foreground">Favorit & Akses Cepat</h3>
                  <p className="text-[11px] text-muted-foreground">Aplikasi yang Anda sematkan</p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  {favorites.length} item
                </span>
              </div>

              {favItems.length > 0 ? (
                <div className="flex flex-col gap-1.5">
                  {favItems.map((item) => {
                    const FavIcon = item.icon || Star;
                    const isActive = pathname === item.to || fullPath === item.to;
                    const toPath = item.to.split("?")[0];
                    const toSearch = item.to.includes("?")
                      ? Object.fromEntries(new URLSearchParams(item.to.split("?")[1]))
                      : undefined;
                    return (
                      <div
                        key={item.to}
                        className={`group flex items-center justify-between rounded-xl px-2.5 py-2 text-xs transition-all border backdrop-blur-md ${
                          isActive
                            ? "bg-white/25 dark:bg-white/10 border-primary/40 text-primary shadow-2xs font-semibold"
                            : "bg-white/10 dark:bg-white/5 border-white/15 dark:border-white/10 text-foreground hover:bg-white/20 dark:hover:bg-white/10"
                        }`}
                      >
                        <Link
                          to={toPath as any}
                          search={toSearch as any}
                          onClick={() => setOpenDrawer(null)}
                          className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                        >
                          <div
                            className={`grid h-7 w-7 place-items-center rounded-lg shrink-0 ${
                              isActive
                                ? "bg-primary/20 text-primary"
                                : "bg-white/15 dark:bg-white/10 text-muted-foreground group-hover:text-foreground"
                            }`}
                          >
                            <FavIcon className="h-4 w-4" />
                          </div>
                          <span className="truncate">{item.label}</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleFavorite(item.to)}
                          className="p-1 rounded-lg text-amber-500 hover:bg-amber-500/15 transition-colors cursor-pointer shrink-0"
                          title="Hapus dari Favorit"
                        >
                          <Star className="h-3.5 w-3.5 fill-amber-500" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-white/20 dark:border-white/10 bg-white/5 dark:bg-black/10 backdrop-blur-sm p-4 text-center">
                  <Star className="h-6 w-6 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-medium text-foreground">Belum ada item favorit</p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Klik tanda bintang pada aplikasi atau daftar navigasi untuk menyematkannya di sini.
                  </p>
                </div>
              )}

              {/* Pintasan Utama */}
              <div className="mt-2 pt-3 border-t border-white/15 dark:border-white/10 flex flex-col gap-1">
                <p className="px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Pintasan Cepat
                </p>
                <Link
                  to="/"
                  onClick={() => setOpenDrawer(null)}
                  className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs text-foreground bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10 border border-white/15 dark:border-white/10 backdrop-blur-sm transition-all cursor-pointer"
                >
                  <LayoutDashboard className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>Launcher / Beranda Utama</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setIsTerminalOpen(true);
                    setOpenDrawer(null);
                  }}
                  className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs text-foreground bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10 border border-white/15 dark:border-white/10 backdrop-blur-sm transition-all cursor-pointer text-left w-full"
                >
                  <Terminal className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                  <span>Command Center & Terminal</span>
                </button>
              </div>
            </div>
          ) : (
          <nav className="flex flex-col gap-4 items-start w-full">
            <div className="flex flex-col gap-4 w-full">

              {/* Quick actions — dipindahkan dari header atas */}
              <div className="flex items-center gap-2 w-full">
                <button
                  type="button"
                  onClick={() => setIsCommandPaletteOpen(true)}
                  className="flex-1 min-w-0 flex items-center gap-2 px-3 h-9 rounded-xl border border-white/20 dark:border-white/10 bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10 backdrop-blur-md text-foreground transition-all cursor-pointer"
                  title="Pencarian Global (Cmd/Ctrl + K)"
                >
                  <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="text-[13px] flex-1 text-left truncate">Pencarian</span>
                  <kbd className="text-[10px] px-1.5 py-0.5 rounded border border-white/20 dark:border-white/10 bg-white/10 dark:bg-black/20 font-mono shrink-0">⌘K</kbd>
                </button>
                <Link
                  to="/notification-center"
                  onClick={() => setOpenDrawer(null)}
                  className="grid h-9 w-9 place-items-center rounded-xl border border-white/20 dark:border-white/10 bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10 backdrop-blur-md text-foreground transition-all shrink-0 cursor-pointer"
                  title="Notifikasi"
                  aria-label="Notifikasi"
                >
                  <Bell className="h-4 w-4" />
                </Link>
              </div>

              {/* STORAGE & UTILITY ORGANIZER: WALLET, POCKET, POUCH, VAULT, TRUNK */}
              <div className="flex flex-col gap-2 pt-2 border-t border-white/15 dark:border-white/10">
                <div className="flex items-center justify-between px-1">
                  <div>
                    <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Archive className="h-3.5 w-3.5 text-primary" />
                      <span>Storage & Organizer Hub</span>
                    </h3>
                    <p className="text-[11px] text-muted-foreground">Wallet, Pocket, Pouch, Vault & Trunk</p>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    5 Utility
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2 mt-1">
                  {[
                    {
                      to: "/wallet",
                      title: "Wallet",
                      subtitle: "Dompet kas, komparasi harga & nota belanja",
                      badge: "Dompet",
                      icon: Wallet,
                      accentColor: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
                    },
                    {
                      to: "/pocket",
                      title: "Pocket",
                      subtitle: "Kartu akses, voucher, tiket & slip saku",
                      badge: "Saku",
                      icon: Pocket,
                      accentColor: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
                    },
                    {
                      to: "/pouch",
                      title: "Pouch",
                      subtitle: "Organizer dokumen esensial & kit bepergian",
                      badge: "Travel",
                      icon: ShoppingBag,
                      accentColor: "bg-pink-500/15 text-pink-600 dark:text-pink-400 border-pink-500/30",
                    },
                    {
                      to: "/vault",
                      title: "Vault",
                      subtitle: "Brankas digital & identitas resmi terenkripsi",
                      badge: "Kredensial",
                      icon: Vault,
                      accentColor: "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30",
                    },
                    {
                      to: "/trunk",
                      title: "Trunk",
                      subtitle: "Gudang perkakas & inventaris rumah tangga",
                      badge: "Gudang",
                      icon: Luggage,
                      accentColor: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
                    },
                  ].map((item) => {
                    const ItemIcon = item.icon;
                    const isActive = pathname === item.to;
                    return (
                      <Link
                        key={item.to}
                        to={item.to as any}
                        onClick={() => setOpenDrawer(null)}
                        className={`group flex items-center justify-between rounded-xl p-2.5 transition-all border backdrop-blur-md cursor-pointer ${
                          isActive
                            ? "bg-white/25 dark:bg-white/10 border-primary/40 text-primary shadow-xs font-semibold ring-1 ring-primary/30"
                            : "bg-white/10 dark:bg-white/5 border-white/15 dark:border-white/10 text-foreground hover:bg-white/20 dark:hover:bg-white/10 hover:border-white/25"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className={`grid h-8 w-8 place-items-center rounded-lg shrink-0 border ${item.accentColor} transition-transform group-hover:scale-105`}>
                            <ItemIcon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs truncate text-foreground group-hover:text-primary transition-colors">
                                {item.title}
                              </span>
                              <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-full bg-muted/70 text-muted-foreground">
                                {item.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                              {item.subtitle}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground/60 group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Pintasan Lainnya pada Control Center */}
              <div className="flex flex-col gap-1.5 pt-2 border-t border-white/15 dark:border-white/10">
                <p className="px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Pusat Kendali
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsTerminalOpen(true);
                    setOpenDrawer(null);
                  }}
                  className="flex items-center justify-between rounded-xl px-2.5 py-2 text-xs text-foreground bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10 border border-white/15 dark:border-white/10 backdrop-blur-sm transition-all cursor-pointer text-left w-full group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Terminal className="h-4 w-4 text-indigo-500 shrink-0" />
                    <span className="truncate">Command Center / Terminal</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </button>
                <Link
                  to="/"
                  onClick={() => setOpenDrawer(null)}
                  className="flex items-center justify-between rounded-xl px-2.5 py-2 text-xs text-foreground bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10 border border-white/15 dark:border-white/10 backdrop-blur-sm transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <LayoutDashboard className="h-4 w-4 text-primary shrink-0" />
                    <span className="truncate">Launcher Beranda</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

            </div>
          </nav>
          )}

          {blurConfig.enabled && (
            <div className="sticky bottom-0 inset-x-0 -mx-4 -mb-4 sm:-mx-5 sm:-mb-4 h-8 pointer-events-none z-20">
              <ProgressiveBlur
                direction="bottom"
                height={32}
                blurLevels={[0.5, 1, 2, 4, 8]}
                tint={blurConfig.tint ? "linear-gradient(to bottom, transparent 0%, hsl(var(--card) / 0.8) 100%)" : false}
              />
            </div>
          )}
        </div>

      </aside>
      <main
        id="mainContent"
        className={`relative flex flex-1 flex-col overflow-hidden transition-[margin,width] duration-300 ease-in-out ${
          openDrawer === "left" && isLeftSidebar75
            ? "ml-[75px] w-[calc(100%-75px)]"
            : "ml-0 w-full"
        }`}
      >
        {openDrawer && !(openDrawer === "left" && isLeftSidebar75) && (
          <div
            className="fixed inset-0 z-40 bg-transparent cursor-default"
            onClick={() => setOpenDrawer(null)}
          />
        )}
        <header ref={headerRef as any} className="absolute top-0 inset-x-0 z-20 pointer-events-none transition-all duration-300">
          {/* Panel Bar Atas: Akun, Tema & Preferensi Region */}
          {isTopPanelOpen && (
            <div
              id="top-panel-container"
              className="pointer-events-auto w-full max-h-[85vh] relative overflow-hidden"
              style={{ backgroundColor: "hsl(var(--primary))" }}
            >
              <TopPanelControlHub
                onClose={() => setIsTopPanelOpen(false)}
                onOpenSettings={handleOpenSettings}
              />
            </div>
          )}

          <div className="flex items-center justify-between gap-3 px-3 py-3 sm:px-5 pointer-events-none">
            {/* Bagian Kiri Header: 2 Floating Pills Terpisah (Pill 1: Home & Nav Toggle, Pill 2: Panah Kiri, Refresh & Panah Kanan) */}
            <div className="flex items-center gap-2">
              {/* Pill 1: Nav Toggle (Sidebar Kiri) & Home */}
              <div className="pointer-events-auto flex items-center gap-1 p-1 rounded-full liquid-glass-header-pill">
                {/* Toggle Sidebar Kiri (Paling Kiri) */}
                <button
                  type="button"
                  className={`relative z-10 size-9 rounded-full aspect-square shrink-0 transition-colors flex items-center justify-center cursor-pointer ${
                    openDrawer === "left"
                      ? "bg-primary text-primary-foreground font-bold shadow-2xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                  onClick={() => setOpenDrawer(openDrawer === "left" ? null : "left")}
                  title={openDrawer === "left" ? "Sembunyikan Navigasi" : "Tampilkan Navigasi"}
                  aria-label="Toggle sidebar kiri"
                >
                  <WindowPositionLeftIcon size={24} />
                </button>

                {/* Icon Home (Di Kanan Toggle Sidebar) */}
                <Link
                  to="/"
                  className="relative z-10 size-9 rounded-full aspect-square shrink-0 transition-colors flex items-center justify-center cursor-pointer text-muted-foreground hover:text-foreground hover:bg-accent"
                  title="Beranda (Home)"
                  aria-label="Beranda"
                >
                  <Home size={20} className="shrink-0" />
                </Link>
              </div>

              {/* Pill 2: Panah Kiri, Refresh & Panah Kanan */}
              <div className="pointer-events-auto flex items-center p-1 rounded-full liquid-glass-header-pill">
                <HeaderNavControls />
              </div>
            </div>

            {/* Bagian Kanan Header: 2 Floating Pills (Pill 1: Wadah Utama ~600px untuk Elemen Aksi & Portal, Pill 2: Pengaturan & Sidebar Kanan) */}
            <div className="flex items-center gap-2">
              {/* Pill Shape Wadah Utama (600px) tempat elemen aksi, modul, & portal disiapkan */}
              <div
                className="pointer-events-auto h-[44px] w-[600px] max-w-[calc(100vw-240px)] rounded-full liquid-glass-header-pill bg-white/60 dark:bg-zinc-800/60 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-xs shrink-0 transition-all flex items-center p-1 gap-1.5 overflow-hidden"
              >
                {!actions && !hasAppHeader && !isHome && (
                  <div className="relative z-10 flex items-center gap-1.5 px-3 text-xs font-medium text-foreground truncate max-w-[200px] sm:max-w-[280px] shrink-0">
                    {ContextCategoryIcon && <ContextCategoryIcon size={14} className="shrink-0 text-primary" />}
                    <span className="truncate font-semibold">{title || contextMatch?.item.label || "Modul Aktif"}</span>
                  </div>
                )}
                {actions && (
                  <div className="relative z-10 flex items-center gap-1.5 shrink-0">
                    {actions}
                  </div>
                )}
                <div
                  id="app-header-actions-portal"
                  className="relative z-10 flex items-center gap-1.5 min-w-0 empty:hidden flex-1 overflow-x-auto no-scrollbar h-full"
                />
              </div>

              {/* Pill 2: Pengaturan (Panel Atas) & Sidebar Kanan (Control Center) */}
              <div className="pointer-events-auto flex items-center gap-1 p-1 rounded-full liquid-glass-header-pill">
                {/* Toggle Panel Atas (Akun, Tema, Region / Setting) */}
                <button
                  type="button"
                  className={`relative z-10 size-9 rounded-full aspect-square shrink-0 transition-colors flex items-center justify-center cursor-pointer ${
                    isTopPanelOpen
                      ? "bg-primary text-primary-foreground font-bold shadow-2xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                  onClick={() => setIsTopPanelOpen((prev) => !prev)}
                  title={isTopPanelOpen ? "Tutup Panel Pengaturan Atas" : "Pengaturan (Akun, Tema & Preferensi)"}
                  aria-label="Toggle panel bar atas"
                >
                  <Settings size={20} className="shrink-0" />
                </button>

                {/* Toggle Sidebar Kanan (Control Center) */}
                <button
                  type="button"
                  className={`relative z-10 size-9 rounded-full aspect-square shrink-0 transition-colors flex items-center justify-center cursor-pointer ${
                    openDrawer === "right"
                      ? "bg-primary text-primary-foreground font-bold shadow-2xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                  onClick={() => setOpenDrawer(openDrawer === "right" ? null : "right")}
                  title={openDrawer === "right" ? "Sembunyikan Control Center" : "Tampilkan Control Center (Sidebar Kanan)"}
                  aria-label="Toggle sidebar kanan"
                >
                  <WindowPositionRightIcon size={24} />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Progressive Blur (Top & Bottom Viewport Transitions - Planes & Apple VisionOS Inspired) */}
        {blurConfig.enabled && (
          <>
            {/* Top progressive blur: seamless melt for scrolling content under header pills */}
            <ProgressiveBlur
              direction="top"
              height={96}
              blurLevels={blurLevels}
              tint={blurConfig.tint ? `linear-gradient(to top, transparent 0%, hsl(var(--background) / 0.82) 100%)` : false}
              className="fixed top-0 right-0 z-15 pointer-events-none transition-[left] duration-300 ease-in-out"
              style={{
                left: openDrawer === "left" && isLeftSidebar75 ? "75px" : "0px",
              }}
            />

            {/* Bottom progressive blur: soft dissolve above floating dock and edge */}
            <ProgressiveBlur
              direction="bottom"
              height={116}
              blurLevels={blurLevels}
              tint={blurConfig.tint ? `linear-gradient(to bottom, transparent 0%, hsl(var(--background) / 0.88) 100%)` : false}
              className="fixed bottom-0 right-0 z-15 pointer-events-none transition-[left] duration-300 ease-in-out"
              style={{
                left: openDrawer === "left" && isLeftSidebar75 ? "75px" : "0px",
              }}
            />
          </>
        )}

        <div
          className={`flex-1 flex flex-col min-h-0 overflow-y-auto overflow-x-hidden no-scrollbar relative z-10 ${
            pathname === "/" ? "px-4 pb-[68px] sm:px-6 sm:pb-[68px]" : "px-3 sm:px-6 pb-[80px]"
          }`}
          style={{ paddingTop: headerHeight }}
        >
          {children}
        </div>
        {/* iOS-Style Floating Search Pill above Dock (Active when not in Launcher) */}
        {pathname !== "/" && (
          <div
            className="fixed bottom-[calc(5rem+10pt)] right-0 flex justify-center pb-1 pointer-events-none z-30 animate-in fade-in duration-200 transition-[left] duration-300 ease-in-out"
            style={{
              left: openDrawer === "left" && isLeftSidebar75 ? "75px" : "0px",
            }}
          >
            <button
              type="button"
              onClick={() => setIsCommandPaletteOpen(true)}
              className="pointer-events-auto flex items-center justify-center h-[28.5px] min-w-[88px] gap-1.5 px-4 rounded-full liquid-glass-pill text-xs font-medium text-foreground/85 hover:text-foreground active:scale-95 transition-all duration-150 cursor-pointer group"
              aria-label="Pencarian Global (Search)"
            >
              <AnimatedSearchIcon active={true} className="size-[13px] text-muted-foreground group-hover:text-foreground transition-colors shrink-0 relative z-10" strokeWidth={2.4} />
              <div className="relative z-10">
                <TypewriterSearchText active={true} speed={50} startDelay={100} />
              </div>
            </button>
          </div>
        )}
        <AppDock
          sidebarShift={openDrawer === "left" && isLeftSidebar75}
          onQuickCapture={() => {
            setIsQuickCaptureOpen((prev) => !prev);
            setIsShortcutOpen(false);
            setIsTerminalOpen(false);
            setIsExpandOpen(false);
            setIsRecentOpen(false);
            setIsTaskbarOpen(false);
          }}
          onShortcut={() => {
            setIsShortcutOpen((prev) => !prev);
            setIsQuickCaptureOpen(false);
            setIsTerminalOpen(false);
            setIsExpandOpen(false);
            setIsRecentOpen(false);
            setIsTaskbarOpen(false);
          }}
          onTerminal={() => {
            setIsTerminalOpen((prev) => !prev);
            setIsQuickCaptureOpen(false);
            setIsShortcutOpen(false);
            setIsExpandOpen(false);
            setIsRecentOpen(false);
            setIsTaskbarOpen(false);
          }}
          onExpand={() => {
            setIsExpandOpen((prev) => !prev);
            setIsQuickCaptureOpen(false);
            setIsShortcutOpen(false);
            setIsTerminalOpen(false);
            setIsRecentOpen(false);
            setIsTaskbarOpen(false);
          }}
          onRecent={() => {
            setIsRecentOpen((prev) => !prev);
            setIsTaskbarOpen(false);
            setIsQuickCaptureOpen(false);
            setIsShortcutOpen(false);
            setIsTerminalOpen(false);
            setIsExpandOpen(false);
          }}
          onTaskbar={() => {
            setIsTaskbarOpen((prev) => !prev);
            setIsRecentOpen(false);
            setIsQuickCaptureOpen(false);
            setIsShortcutOpen(false);
            setIsTerminalOpen(false);
            setIsExpandOpen(false);
          }}
          isQuickCaptureOpen={isQuickCaptureOpen}
          isShortcutOpen={isShortcutOpen}
          isTerminalOpen={isTerminalOpen}
          isExpandOpen={isExpandOpen}
          isRecentOpen={isRecentOpen}
          isTaskbarOpen={isTaskbarOpen}
        />

        {/* Global Modals: Command Palette, Quick Capture, Shortcut, Terminal, Recent & Taskbar */}
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
        />
        <QuickCaptureModal
          isOpen={isQuickCaptureOpen}
          onClose={() => setIsQuickCaptureOpen(false)}
          onSuccess={(msg) => {
            setToastMessage(msg);
            setTimeout(() => setToastMessage(null), 3000);
          }}
        />
        <ShortcutModal
          isOpen={isShortcutOpen}
          onClose={() => setIsShortcutOpen(false)}
          onOpenQuickCapture={() => setIsQuickCaptureOpen(true)}
        />
        <TerminalModal
          isOpen={isTerminalOpen}
          onClose={() => setIsTerminalOpen(false)}
        />
        <RecentModal
          isOpen={isRecentOpen}
          onClose={() => setIsRecentOpen(false)}
        />
        <TaskbarModal
          isOpen={isTaskbarOpen}
          onClose={() => setIsTaskbarOpen(false)}
        />

        {/* Notification Toast */}
        {toastMessage && (
          <div className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-50 bg-foreground text-background text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <CheckCircle2 size={15} className="text-emerald-500" />
            <span>{toastMessage}</span>
          </div>
        )}
      </main>
    </div>
    </ShellSectionsProvider>
    </ShellHeaderProvider>
    </ShellSidebarProvider>
  );
}
