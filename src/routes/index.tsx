import { useState, useEffect, useRef, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoHeight from "embla-carousel-auto-height";
import { AppShell } from "../app/app-shell";
import { useFavorites } from "@/hooks/useFavorites";
import { getLastLauncherPage, setLastLauncherPage } from "@/utils/launcherCategoryMapper";
import { Tools100Section } from "@/features/launcher/Tools100Section";
import { ValueTreatedSection } from "@/features/launcher/ValueTreatedSection";
import { FinancialWealthSection } from "@/features/launcher/FinancialWealthSection";
import { AppModuleSection } from "@/features/launcher/AppModuleSection";
import { CommodityDashboardSection } from "./commodity-dashboard";
import { EmptyModePage } from "@/features/launcher/EmptyModePage";
import { AnimatedSearchIcon } from "@/app/shell/AnimatedSearchIcon";
import { TypewriterSearchText } from "@/app/shell/TypewriterSearchText";
import {
  Layers,
  Gem,
  Coins,
  LayoutGrid,
  TrendingUp,
  User,
  Users,
  GraduationCap,
  Palette,
  HeartPulse,
  Coffee,
  Sofa,
  Briefcase,
  Crown,
  Globe,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const GRADIENT_PALETTES = [
  "bg-linear-to-br from-indigo-500 to-indigo-700",
  "bg-linear-to-br from-blue-500 to-cyan-600",
  "bg-linear-to-br from-emerald-500 to-teal-700",
  "bg-linear-to-br from-amber-500 to-orange-600",
  "bg-linear-to-br from-rose-500 to-pink-600",
  "bg-linear-to-br from-purple-500 to-violet-700",
  "bg-linear-to-br from-sky-500 to-blue-700",
  "bg-linear-to-br from-teal-500 to-emerald-700",
];

export function getGradient(title: string): string {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % GRADIENT_PALETTES.length;
  return GRADIENT_PALETTES[idx];
}

export const LAUNCHER_TABS = [
  // Halaman Inti Launcher
  { id: "tools100", label: "100 MBA Tools", icon: Layers, badge: "8 Pilar" },
  { id: "valuetreated", label: "Value Treated", icon: Gem, badge: "10 Disiplin" },
  { id: "financial", label: "Finansial & Wealth", icon: Coins, badge: "5 Tahapan" },
  { id: "app_module", label: "App Module", icon: LayoutGrid, badge: "47 Modul" },
  { id: "commodity", label: "100 Komoditas", icon: TrendingUp, badge: "Nasional" },

  // 10 Halaman Mode Tambahan (Sementara Kosong Siap Dikonfigurasi)
  { id: "mode_personal", modeId: "personal", label: "Mode Personal", icon: User, badge: "Self", desc: "Keseharian, Catatan & Habit" },
  { id: "mode_student", modeId: "student", label: "Mode Student", icon: GraduationCap, badge: "Study", desc: "Akademik, Riset & Pembelajaran" },
  { id: "mode_creator", modeId: "creator", label: "Mode Creator", icon: Palette, badge: "Media", desc: "Konten, Desain & Media Kreatif" },
  { id: "mode_wellbeing", modeId: "wellbeing", label: "Mode Wellbeing", icon: HeartPulse, badge: "Health", desc: "Kebugaran Fisik, Mental & Keseimbangan Hidup" },
  { id: "mode_leisure", modeId: "leisure", label: "Mode Leisure", icon: Coffee, badge: "Relax", desc: "Rekreasi, Hiburan, Hobi & Liburan" },
  { id: "mode_household", modeId: "household", label: "Mode Household", icon: Sofa, badge: "Living", desc: "Domestik & Manajemen Rumah" },
  { id: "mode_relatives", modeId: "relatives", label: "Mode Relatives", icon: Users, badge: "Family", desc: "Keluarga Besar & Silaturahmi" },
  { id: "mode_employment", modeId: "employment", label: "Mode Employment", icon: Briefcase, badge: "Career", desc: "Pekerjaan, Tugas & Proyek" },
  { id: "mode_owner", modeId: "owner", label: "Mode Owner", icon: Crown, badge: "Equity", desc: "Kepemilikan Bisnis & Portofolio" },
  { id: "mode_public", modeId: "public", label: "Mode Public", icon: Globe, badge: "External", desc: "Ranah Publik & Dinamika Luar" },
];

export function Launcher() {
  const getInitialModeIndex = () => {
    if (typeof window !== "undefined") {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const modeFromUrl = urlParams.get("mode");
        if (modeFromUrl) {
          const mappedMode =
            modeFromUrl === "productivity" ||
            modeFromUrl === "personal" ||
            modeFromUrl === "people"
              ? "app_module"
              : modeFromUrl;
          const idx = LAUNCHER_TABS.findIndex(
            (t) => t.id === mappedMode || (t as any).modeId === mappedMode
          );
          if (idx !== -1) return idx;
        }
        const tabFromUrl = urlParams.get("tab");
        if (tabFromUrl) {
          const mappedTab =
            tabFromUrl === "productivity" ||
            tabFromUrl === "personal" ||
            tabFromUrl === "people"
              ? "app_module"
              : tabFromUrl;
          const idx = LAUNCHER_TABS.findIndex((t) => t.id === mappedTab);
          if (idx !== -1) return idx;
        }
      } catch {}
    }
    return getLastLauncherPage(LAUNCHER_TABS.length);
  };

  const initialPage = getInitialModeIndex();
  const [activeTabIdx, setActiveTabIdx] = useState<number>(initialPage);
  const { favorites, toggleFavorite } = useFavorites();

  // Mode transisi iOS: 'search' saat diam/idle, 'dots' saat swipe/geser halaman
  const [barMode, setBarMode] = useState<"search" | "dots">("search");
  const idleTimerRef = useRef<any>(null);

  // Setup Carousel swipe dengan Embla + AutoHeight dinamis agar tidak scroll berlebih ke bawah
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      startIndex: initialPage,
      loop: false,
      duration: 25,
      skipSnaps: false,
    },
    [AutoHeight()]
  );

  // Tampilkan dots secara temporer lalu kembali ke search
  const showDotsTemporarily = useCallback((duration = 2000) => {
    setBarMode("dots");
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      setBarMode("search");
    }, duration);
  }, []);

  // Tampilkan dots langsung (selama interaksi swipe berlangsung)
  const showDotsImmediately = useCallback(() => {
    setBarMode("dots");
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
  }, []);

  // Sinkronisasi event Embla Carousel dengan dots indicator
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      const snap = emblaApi.selectedScrollSnap();
      setActiveTabIdx(snap);
      setLastLauncherPage(snap, LAUNCHER_TABS.length);
      showDotsTemporarily(2200);

      const currentTab = LAUNCHER_TABS[snap];
      if (currentTab && (currentTab as any).modeId) {
        try {
          const modeId = (currentTab as any).modeId;
          localStorage.setItem("aio_active_mode", modeId);
          localStorage.setItem("client_os_active_mode", modeId);
          window.dispatchEvent(
            new CustomEvent("aio_launcher_mode_changed", { detail: modeId })
          );
        } catch {}
      }
    };

    const onPointerDown = () => {
      showDotsImmediately();
    };

    const onPointerUp = () => {
      showDotsTemporarily(2200);
    };

    const onScroll = () => {
      showDotsImmediately();
    };

    const onSettle = () => {
      showDotsTemporarily(2000);
    };

    emblaApi.on("select", onSelect);
    emblaApi.on("pointerDown", onPointerDown);
    emblaApi.on("pointerUp", onPointerUp);
    emblaApi.on("scroll", onScroll);
    emblaApi.on("settle", onSettle);

    // Dukungan sinkronisasi pergantian mode dari Sidebar Kanan
    const handleModeChanged = () => {
      try {
        const savedMode = localStorage.getItem("aio_active_mode");
        if (savedMode && emblaApi) {
          const idx = LAUNCHER_TABS.findIndex(
            (t) => t.id === savedMode || (t as any).modeId === savedMode
          );
          if (idx !== -1 && idx !== emblaApi.selectedScrollSnap()) {
            emblaApi.scrollTo(idx);
          }
        }
      } catch {}
    };

    window.addEventListener("aio_mode_changed", handleModeChanged);

    // Dukungan geser / swipe 2 jari horizontal pada trackpad
    const emblaNode = emblaApi.rootNode();
    let accumulatedDeltaX = 0;
    let wheelDebounceTimer: any = null;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 12) {
        showDotsImmediately();
        accumulatedDeltaX += e.deltaX;

        if (wheelDebounceTimer) clearTimeout(wheelDebounceTimer);
        wheelDebounceTimer = setTimeout(() => {
          accumulatedDeltaX = 0;
          showDotsTemporarily(2000);
        }, 220);

        if (accumulatedDeltaX > 50) {
          emblaApi.scrollNext();
          accumulatedDeltaX = 0;
        } else if (accumulatedDeltaX < -50) {
          emblaApi.scrollPrev();
          accumulatedDeltaX = 0;
        }
      }
    };

    if (emblaNode) {
      emblaNode.addEventListener("wheel", onWheel, { passive: true });
    }

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("pointerDown", onPointerDown);
      emblaApi.off("pointerUp", onPointerUp);
      emblaApi.off("scroll", onScroll);
      emblaApi.off("settle", onSettle);
      window.removeEventListener("aio_mode_changed", handleModeChanged);
      if (emblaNode) {
        emblaNode.removeEventListener("wheel", onWheel);
      }
      if (wheelDebounceTimer) clearTimeout(wheelDebounceTimer);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [emblaApi, showDotsTemporarily, showDotsImmediately]);

  // Handle pergantian tab manual (klik tab atau klik titik)
  const handleSelectTab = (idx: number) => {
    setActiveTabIdx(idx);
    setLastLauncherPage(idx, LAUNCHER_TABS.length);
    emblaApi?.scrollTo(idx);
    showDotsTemporarily(2200);

    const currentTab = LAUNCHER_TABS[idx];
    if (currentTab && (currentTab as any).modeId) {
      try {
        const modeId = (currentTab as any).modeId;
        localStorage.setItem("aio_active_mode", modeId);
        localStorage.setItem("client_os_active_mode", modeId);
        window.dispatchEvent(new Event("aio_mode_changed"));
      } catch {}
    }
  };

  // Keyboard navigation untuk swipe kiri-kanan
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }
      if (e.key === "ArrowLeft") {
        if (activeTabIdx > 0) {
          handleSelectTab(activeTabIdx - 1);
        }
      } else if (e.key === "ArrowRight") {
        if (activeTabIdx < LAUNCHER_TABS.length - 1) {
          handleSelectTab(activeTabIdx + 1);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTabIdx, emblaApi]);

  const openGlobalSearch = () => {
    window.dispatchEvent(new CustomEvent("aio_open_search"));
  };

  return (
    <AppShell
      title="All in One Workspace"
      subtitle="Workspace Eksekutif Terintegrasi: Bisnis, Finansial, Manajemen, Komoditas & 10 Mode Kehidupan"
    >
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 py-2 space-y-2 pb-2">
        {/* Swipe Carousel Area */}
        <div className="overflow-hidden cursor-grab active:cursor-grabbing transition-[height] duration-300" ref={emblaRef}>
          <div className="flex touch-pan-y items-start">
            {/* Slide 0: 100 MBA Tools */}
            <div className={`flex-[0_0_100%] min-w-0 pr-1 ${activeTabIdx === 0 ? "h-auto opacity-100" : "h-0 max-h-0 min-h-0 overflow-hidden invisible pointer-events-none"}`}>
              {activeTabIdx === 0 && (
                <Tools100Section
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                  getGradient={getGradient}
                />
              )}
            </div>

            {/* Slide 1: Value Treated (10 Disiplin Fundamental) */}
            <div className={`flex-[0_0_100%] min-w-0 pr-1 ${activeTabIdx === 1 ? "h-auto opacity-100" : "h-0 max-h-0 min-h-0 overflow-hidden invisible pointer-events-none"}`}>
              {activeTabIdx === 1 && (
                <ValueTreatedSection
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                  getGradient={getGradient}
                />
              )}
            </div>

            {/* Slide 2: Finansial & Wealth */}
            <div className={`flex-[0_0_100%] min-w-0 pr-1 ${activeTabIdx === 2 ? "h-auto opacity-100" : "h-0 max-h-0 min-h-0 overflow-hidden invisible pointer-events-none"}`}>
              {activeTabIdx === 2 && (
                <FinancialWealthSection
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                  getGradient={getGradient}
                />
              )}
            </div>

            {/* Slide 3: App Module (Gabungan Productivity, Personal, People) */}
            <div className={`flex-[0_0_100%] min-w-0 pr-1 ${activeTabIdx === 3 ? "h-auto opacity-100" : "h-0 max-h-0 min-h-0 overflow-hidden invisible pointer-events-none"}`}>
              {activeTabIdx === 3 && (
                <AppModuleSection
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                  getGradient={getGradient}
                />
              )}
            </div>

            {/* Slide 4: 100 Komoditas */}
            <div className={`flex-[0_0_100%] min-w-0 pr-1 ${activeTabIdx === 4 ? "h-auto opacity-100" : "h-0 max-h-0 min-h-0 overflow-hidden invisible pointer-events-none"}`}>
              {activeTabIdx === 4 && (
                <CommodityDashboardSection isEmbedded={true} />
              )}
            </div>

            {/* 10 Mode Halaman Tambahan (Sementara Kosong) */}
            {LAUNCHER_TABS.filter((t) => (t as any).modeId).map((tab, mIdx) => {
              const slideIdx = 5 + mIdx;
              const isActive = activeTabIdx === slideIdx;
              return (
                <div
                  key={tab.id}
                  className={`flex-[0_0_100%] min-w-0 pr-1 ${
                    isActive ? "h-auto opacity-100" : "h-0 max-h-0 min-h-0 overflow-hidden invisible pointer-events-none"
                  }`}
                >
                  {isActive && (
                    <EmptyModePage
                      id={tab.id}
                      label={tab.label}
                      badge={tab.badge}
                      desc={(tab as any).desc || ""}
                      icon={tab.icon}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* iOS-Style Morphing Page Indicator / Search Pill di atas Dock */}
        <div className="fixed bottom-[calc(5rem+10pt)] left-0 right-0 flex justify-center pb-1 pointer-events-none z-30 animate-in fade-in duration-200">
          {barMode === "search" ? (
            <button
              type="button"
              onClick={openGlobalSearch}
              onMouseEnter={() => showDotsTemporarily(3000)}
              className="pointer-events-auto flex items-center justify-center h-[28.5px] min-w-[88px] gap-1.5 px-4 rounded-full liquid-glass-pill text-xs font-medium text-foreground/85 hover:text-foreground active:scale-95 transition-all duration-200 cursor-pointer group"
              aria-label="Pencarian Global (Search)"
            >
              <AnimatedSearchIcon
                active={true}
                className="size-[13px] text-muted-foreground group-hover:text-foreground transition-colors shrink-0 relative z-10"
                strokeWidth={2.4}
              />
              <div className="relative z-10">
                <TypewriterSearchText active={true} speed={50} startDelay={80} />
              </div>
            </button>
          ) : (
            <div
              onMouseEnter={showDotsImmediately}
              onMouseLeave={() => showDotsTemporarily(1800)}
              className="pointer-events-auto flex items-center justify-center h-[28.5px] px-3 gap-2 rounded-full liquid-glass-pill text-xs transition-all duration-200 animate-in fade-in zoom-in-95 max-w-[90vw]"
            >
              {/* Tombol prev slide */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (activeTabIdx > 0) handleSelectTab(activeTabIdx - 1);
                }}
                disabled={activeTabIdx === 0}
                className="relative z-10 text-muted-foreground hover:text-foreground disabled:opacity-20 cursor-pointer p-0.5 rounded transition-colors shrink-0"
                aria-label="Halaman Sebelumnya"
                title="Halaman Sebelumnya"
              >
                <ChevronLeft className="size-3.5" />
              </button>

              {/* Titik-titik indikator halaman (Scrollable jika banyak) */}
              <div className="relative z-10 flex items-center gap-1.5 px-1 max-w-[240px] sm:max-w-[360px] overflow-x-auto no-scrollbar py-0.5">
                {LAUNCHER_TABS.map((tab, idx) => {
                  const isActive = idx === activeTabIdx;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectTab(idx);
                      }}
                      className={`transition-all duration-300 rounded-full cursor-pointer shrink-0 ${
                        isActive
                          ? "w-4 sm:w-5 h-2 bg-primary shadow-xs"
                          : "size-2 bg-foreground/30 hover:bg-foreground/60 hover:scale-125"
                      }`}
                      title={`${tab.label} (Hal ${idx + 1} dari ${LAUNCHER_TABS.length})`}
                      aria-label={`Pindah ke ${tab.label}`}
                    />
                  );
                })}
              </div>

              {/* Tombol next slide */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (activeTabIdx < LAUNCHER_TABS.length - 1) handleSelectTab(activeTabIdx + 1);
                }}
                disabled={activeTabIdx === LAUNCHER_TABS.length - 1}
                className="relative z-10 text-muted-foreground hover:text-foreground disabled:opacity-20 cursor-pointer p-0.5 rounded transition-colors shrink-0"
                aria-label="Halaman Berikutnya"
                title="Halaman Berikutnya"
              >
                <ChevronRight className="size-3.5" />
              </button>

              {/* Akses cepat ke Search */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openGlobalSearch();
                }}
                className="relative z-10 ml-1 pl-1.5 border-l border-border/60 text-muted-foreground hover:text-primary transition-colors cursor-pointer shrink-0"
                title="Buka Pencarian"
                aria-label="Buka Pencarian"
              >
                <Search className="size-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

export default Launcher;
