import { useState, useEffect, useCallback } from "react";
import { Sun, Moon, Clock, Languages, Check } from "lucide-react";

export type ThemePreference = "light" | "dark" | "auto";

export const TIMEZONE_IANA_MAP: Record<string, string> = {
  "(UTC+07:00) WIB": "Asia/Jakarta",
  "(UTC+08:00) WITA": "Asia/Makassar",
  "(UTC+09:00) WIT": "Asia/Jayapura",
  "(UTC+00:00) UTC": "UTC",
  "(UTC-05:00) EST": "America/New_York",
  "(UTC-08:00) PST": "America/Los_Angeles",
};

export function isDayTimeInTimezone(timezoneString: string): {
  isDay: boolean;
  hours: number;
  minutes: number;
  timeFormatted: string;
} {
  const iana = TIMEZONE_IANA_MAP[timezoneString] || "Asia/Jakarta";
  const now = new Date();

  try {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: iana,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const parts = formatter.formatToParts(now);
    const hourPart = parts.find((p) => p.type === "hour")?.value ?? "0";
    const minutePart = parts.find((p) => p.type === "minute")?.value ?? "0";

    const hours = parseInt(hourPart, 10);
    const minutes = parseInt(minutePart, 10);
    const totalMinutes = hours * 60 + minutes;

    // Batas jam 05:31 pagi = Terang (5 * 60 + 31 = 331)
    // Sampai jam 17:31 petang = Kembali Gelap (17 * 60 + 31 = 1051)
    // Rentang .30 ke atas ketemu .30 ke atas: 05:31 <= totalMinutes < 1051
    const isDay = totalMinutes >= 331 && totalMinutes < 1051;
    const timeFormatted = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

    return { isDay, hours, minutes, timeFormatted };
  } catch {
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    const isDay = totalMinutes >= 331 && totalMinutes < 1051;
    return {
      isDay,
      hours,
      minutes,
      timeFormatted: `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`,
    };
  }
}

interface ThemeLangToggleProps {
  timezone?: string;
  className?: string;
}

export function ThemeLangToggle({ timezone = "(UTC+07:00) WIB", className = "" }: ThemeLangToggleProps) {
  const [themePref, setThemePref] = useState<ThemePreference>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("aio_theme_preference");
      if (stored === "light" || stored === "dark" || stored === "auto") {
        return stored;
      }
      // Fallback: jika aio_theme sudah ada, pakai itu, selainnya auto
      const legacyTheme = localStorage.getItem("aio_theme");
      if (legacyTheme === "dark") return "dark";
      if (legacyTheme === "light") return "light";
    }
    return "auto";
  });

  const [lang, setLang] = useState<"id" | "en">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("aio_lang") as "id" | "en") || "id";
    }
    return "id";
  });

  const [autoStatus, setAutoStatus] = useState<{ isDay: boolean; timeFormatted: string }>({
    isDay: true,
    timeFormatted: "12:00",
  });

  const evaluateAndApplyTheme = useCallback(() => {
    if (typeof document === "undefined") return;

    if (themePref === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("aio_theme", "dark");
    } else if (themePref === "light") {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("aio_theme", "light");
    } else {
      // "auto" mode berdasarkan zona waktu (05:31 - 17:31)
      const { isDay, timeFormatted } = isDayTimeInTimezone(timezone);
      setAutoStatus({ isDay, timeFormatted });

      if (isDay) {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("aio_theme", "light");
      } else {
        document.documentElement.classList.add("dark");
        localStorage.setItem("aio_theme", "dark");
      }
    }
  }, [themePref, timezone]);

  useEffect(() => {
    evaluateAndApplyTheme();
    localStorage.setItem("aio_theme_preference", themePref);

    // Update setiap 10 detik agar pergantian jam 05:31 atau 17:31 langsung terdeteksi
    const interval = setInterval(evaluateAndApplyTheme, 10000);
    return () => clearInterval(interval);
  }, [themePref, timezone, evaluateAndApplyTheme]);

  const toggleLang = () => {
    const next = lang === "id" ? "en" : "id";
    setLang(next);
    localStorage.setItem("aio_lang", next);
  };

  const themeOptions: { id: ThemePreference; label: string; icon: typeof Sun }[] = [
    { id: "light", label: "Terang", icon: Sun },
    { id: "dark", label: "Gelap", icon: Moon },
    { id: "auto", label: "Auto Waktu", icon: Clock },
  ];

  return (
    <div className={`flex flex-col gap-2 select-none ${className}`}>
      {/* Mode Tema: 3 Pilihan (Terang, Gelap, Auto Waktu) */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-[10px] font-semibold text-slate-600 dark:text-slate-400">
            Mode Tema
          </label>
          {themePref === "auto" && (
            <span className="text-[9px] font-medium px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {autoStatus.isDay ? "Siang (Terang)" : "Malam (Gelap)"}
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
          {themeOptions.map((opt) => {
            const isSelected = themePref === opt.id;
            const Icon = opt.icon;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setThemePref(opt.id)}
                className={`flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-white text-slate-900 shadow-xs border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                }`}
                title={
                  opt.id === "auto"
                    ? "Otomatis: 05:31-17:31 Terang, 17:31-05:31 Gelap berdasarkan zona waktu"
                    : `Aktifkan Mode ${opt.label}`
                }
              >
                <Icon
                  className={`size-3.5 shrink-0 ${
                    isSelected
                      ? opt.id === "light"
                        ? "text-amber-500"
                        : opt.id === "dark"
                        ? "text-indigo-600"
                        : "text-emerald-600"
                      : "text-slate-500"
                  }`}
                />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>

        {themePref === "auto" && (
          <p className="text-[9px] text-slate-500 mt-1 leading-tight">
            *05:31 - 17:31 Mode Terang, 17:31 - 05:31 Mode Gelap mengikuti zona waktu {timezone.split(" ")[0] || "lokal"}.
          </p>
        )}
      </div>

      {/* Bahasa Antarmuka (ID / EN) */}
      <div className="flex items-center justify-between pt-0.5">
        <div className="flex items-center gap-1.5">
          <Languages className="size-3.5 text-primary shrink-0" />
          <span className="text-[10px] font-semibold text-slate-600">Bahasa UI</span>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setLang("id");
              localStorage.setItem("aio_lang", "id");
            }}
            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold cursor-pointer transition-all ${
              lang === "id"
                ? "bg-white text-primary shadow-2xs font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            ID
          </button>
          <button
            type="button"
            onClick={() => {
              setLang("en");
              localStorage.setItem("aio_lang", "en");
            }}
            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold cursor-pointer transition-all ${
              lang === "en"
                ? "bg-white text-primary shadow-2xs font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            EN
          </button>
        </div>
      </div>
    </div>
  );
}
