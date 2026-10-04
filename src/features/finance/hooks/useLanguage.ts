import { useState, useEffect } from "react";

export type Language = "id" | "en" | "ms" | "zh";

export function useLanguage(): Language {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("aio_lang") || localStorage.getItem("appLanguage");
      if (stored === "en" || stored === "id" || stored === "ms" || stored === "zh") {
        return stored as Language;
      }
    }
    return "id";
  });

  useEffect(() => {
    const handleStorage = () => {
      const stored = localStorage.getItem("aio_lang") || localStorage.getItem("appLanguage");
      if (stored === "en" || stored === "id" || stored === "ms" || stored === "zh") {
        setLang(stored as Language);
      }
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("languageChange", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("languageChange", handleStorage);
    };
  }, []);

  return lang;
}
