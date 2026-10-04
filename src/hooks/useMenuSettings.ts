import { useState, useCallback } from "react";

export function useMenuSettings() {
  const [enabledMenus, setEnabledMenus] = useState<Record<string, boolean>>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("aio_menu_settings");
        if (stored) return JSON.parse(stored);
      } catch (e) {}
    }
    return {};
  });

  const toggleMenu = useCallback((path: string) => {
    setEnabledMenus((prev) => {
      const next = { ...prev, [path]: prev[path] === false ? true : false };
      try {
        localStorage.setItem("aio_menu_settings", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  }, []);

  return { enabledMenus, setEnabledMenus, toggleMenu };
}
