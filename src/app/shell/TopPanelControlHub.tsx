import { useState, useEffect } from "react";
import {
  User,
  Settings,
  Clock,
  Laptop,
} from "lucide-react";
import { ThemeLangToggle, TIMEZONE_IANA_MAP } from "../theme-lang-toggle";
import { ProfileMenu } from "../wira-settings";
import { ProgressiveBlurSettingControl } from "./ProgressiveBlurSettingControl";
import { LiquidGlassSettingControl } from "./LiquidGlassSettingControl";
import { ThemeColorPicker } from "./ThemeColorPicker";

interface TopPanelControlHubProps {
  onClose: () => void;
  onOpenSettings: (tab: string) => void;
}

export function TopPanelControlHub({
  onClose,
  onOpenSettings,
}: TopPanelControlHubProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Region State
  const [country, setCountry] = useState<string>(() => {
    try {
      return localStorage.getItem("aio_region_country") || "Indonesia";
    } catch {
      return "Indonesia";
    }
  });

  const [city, setCity] = useState<string>(() => {
    try {
      return localStorage.getItem("aio_region_city") || "Jakarta";
    } catch {
      return "Jakarta";
    }
  });

  const [timezone, setTimezone] = useState<string>(() => {
    try {
      return localStorage.getItem("aio_region_timezone") || "(UTC+07:00) WIB";
    } catch {
      return "(UTC+07:00) WIB";
    }
  });

  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const iana = TIMEZONE_IANA_MAP[timezone] || "Asia/Jakarta";
      try {
        const now = new Date();
        setCurrentTime(
          now.toLocaleTimeString("id-ID", {
            timeZone: iana,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
        );
      } catch {
        const now = new Date();
        setCurrentTime(
          now.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
        );
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  const handleCountryChange = (val: string) => {
    setCountry(val);
    try {
      localStorage.setItem("aio_region_country", val);
    } catch {}
  };

  const handleCityChange = (val: string) => {
    setCity(val);
    try {
      localStorage.setItem("aio_region_city", val);
    } catch {}
  };

  const handleTimezoneChange = (val: string) => {
    setTimezone(val);
    try {
      localStorage.setItem("aio_region_timezone", val);
    } catch {}
  };

  return (
    <div
      className="w-full flex flex-col relative z-10"
      style={{ backgroundColor: "hsl(var(--primary))" }}
    >
      {/* Grid Konten 4 Kolom: Akun, Tema & Bahasa, Region, Client OS Info */}
      <div
        className="overflow-y-auto overflow-x-hidden p-4 sm:p-5 no-scrollbar scrollbar-none"
        style={{ backgroundColor: "hsl(var(--primary))", scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="max-w-[1500px] w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch min-w-0">
          {/* Kolom 1: Akun & Profil Pengguna */}
          <div
            className="liquid-glass-card min-w-0 bg-white rounded-2xl shadow-xl border border-white/50 overflow-hidden text-slate-900 transition-transform duration-200 hover:-translate-y-0.5"
            style={{ backgroundColor: "#ffffff" }}
          >
            <div className="card-content text-slate-900" style={{ color: "#0f172a" }}>
              <div className="card-header">
                <div className="user-info">
                  <div className="avatar bg-primary/10 border-2 border-primary">
                    <svg className="avatar-icon text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div className="user-details">
                    <p className="user-name text-slate-900 font-bold">Executive User</p>
                    <p className="user-role text-slate-500 text-xs">DNA Advisory Workspace</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenSettings("notifications")}
                  className="notification-icon text-slate-400 hover:text-slate-700 cursor-pointer"
                  title="Notifikasi Akun"
                  aria-label="Notifikasi"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </button>
              </div>

              <div className="card-body text-left">
                <h3 className="card-title text-slate-900 font-bold text-base mb-1">Profil & Kredensial</h3>
                <p className="card-description text-slate-600 text-xs mb-3">
                  Kelola sesi login, hak akses tim, dan sinkronisasi profil workspace.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="glass-button flex-1 whitespace-nowrap text-xs font-semibold py-2 px-3 min-w-0 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 shadow-2xs cursor-pointer"
                  >
                    <User className="size-4 shrink-0 text-slate-700" />
                    <span>Menu Profil</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      onOpenSettings("general");
                    }}
                    className="glass-button size-9 p-0 shrink-0 aspect-square rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 shadow-2xs cursor-pointer"
                    title="Buka Pengaturan"
                    aria-label="Pengaturan"
                  >
                    <Settings className="size-4 shrink-0 text-slate-700" />
                  </button>
                </div>
              </div>

              <div className="relative">
                {/* Profile Menu Popup */}
                <ProfileMenu
                  isOpen={isProfileOpen}
                  onClose={() => setIsProfileOpen(false)}
                  onOpenSettings={(tab) => {
                    setIsProfileOpen(false);
                    onOpenSettings(tab);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Kolom 2: Pengaturan Visual & Efek */}
          <div
            className="liquid-glass-card min-w-0 bg-white rounded-2xl shadow-xl border border-white/50 overflow-hidden text-slate-900 transition-transform duration-200 hover:-translate-y-0.5 flex flex-col"
            style={{ backgroundColor: "#ffffff" }}
          >
            <div className="card-content text-slate-900 flex flex-col justify-center flex-1 h-full" style={{ color: "#0f172a" }}>
              <div className="flex flex-col gap-2 text-left w-full">
                <ThemeColorPicker />
                <ProgressiveBlurSettingControl />
                <LiquidGlassSettingControl />
              </div>
            </div>
          </div>

          {/* Kolom 3: Wilayah & Preferensi Waktu */}
          <div
            className="liquid-glass-card min-w-0 bg-white rounded-2xl shadow-xl border border-white/50 overflow-hidden text-slate-900 transition-transform duration-200 hover:-translate-y-0.5 flex flex-col justify-between"
            style={{ backgroundColor: "#ffffff" }}
          >
            <div className="card-content text-slate-900 flex flex-col gap-2.5 text-left w-full h-full" style={{ color: "#0f172a" }}>
              {/* Hanya Jam Digital & Info Ringkas */}
              <div className="flex items-center justify-between w-full">
                <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 shadow-2xs">
                  <Clock className="size-3.5 text-emerald-600 animate-pulse" />
                  <span className="tracking-wide">{currentTime || "--:--:--"}</span>
                </div>
                <span className="text-[10px] font-mono font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                  {timezone.split(" ")[0]} · {city}
                </span>
              </div>

              {/* Form Lokasi: Negara & Kota */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">
                    Negara
                  </label>
                  <select
                    value={country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none text-xs font-medium text-slate-800 cursor-pointer focus:bg-white focus:border-primary"
                  >
                    <option value="Indonesia">Indonesia</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="Japan">Japan</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">
                    Kota
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => handleCityChange(e.target.value)}
                    placeholder="Jakarta"
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none text-xs font-medium text-slate-800 focus:bg-white focus:border-primary"
                  />
                </div>
              </div>

              {/* Zona Waktu */}
              <div>
                <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">
                  Zona Waktu
                </label>
                <select
                  value={timezone}
                  onChange={(e) => handleTimezoneChange(e.target.value)}
                  className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none text-xs font-medium text-slate-800 cursor-pointer focus:bg-white focus:border-primary"
                >
                  <option value="(UTC+07:00) WIB">(UTC+07:00) WIB - Jakarta</option>
                  <option value="(UTC+08:00) WITA">(UTC+08:00) WITA - Bali</option>
                  <option value="(UTC+09:00) WIT">(UTC+09:00) WIT - Jayapura</option>
                  <option value="(UTC+00:00) UTC">(UTC+00:00) UTC - London</option>
                  <option value="(UTC-05:00) EST">(UTC-05:00) EST - New York</option>
                  <option value="(UTC-08:00) PST">(UTC-08:00) PST - San Francisco</option>
                </select>
              </div>

              {/* Mode Tema & Bahasa (Tanpa Garis Pembatas Mendatar) */}
              <ThemeLangToggle
                timezone={timezone}
                className="mt-0.5"
              />
            </div>
          </div>

          {/* Kolom 4: Informasi Versi & Status Sistem */}
          <div
            className="liquid-glass-card min-w-0 bg-white rounded-2xl shadow-xl border border-white/50 overflow-hidden text-slate-900 transition-transform duration-200 hover:-translate-y-0.5"
            style={{ backgroundColor: "#ffffff" }}
          >
            <div className="card-content text-slate-900" style={{ color: "#0f172a" }}>
              <div className="card-header">
                <div className="user-info">
                  <div className="avatar bg-cyan-50 border-2 border-cyan-500">
                    <Laptop className="avatar-icon text-cyan-500" />
                  </div>
                  <div className="user-details">
                    <p className="user-name text-slate-900 font-bold">Client OS</p>
                    <p className="user-role text-slate-500 text-xs">v2.4.2 · Production</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_2px_rgba(16,185,129,0.15)] animate-pulse" />
                  Aktif
                </span>
              </div>

              <div className="card-body text-left">
                <div className="space-y-1.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-left shadow-2xs">
                  <div className="flex justify-between items-center text-slate-700">
                    <span>Versi Rilis</span>
                    <span className="font-mono font-semibold text-slate-900">2026.09-stable</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-700">
                    <span>Platform</span>
                    <span className="font-medium text-slate-900">React 19 + Vite</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-700">
                    <span>Sinkronisasi</span>
                    <span className="text-emerald-600 font-semibold">✓ Terverifikasi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopPanelControlHub;
