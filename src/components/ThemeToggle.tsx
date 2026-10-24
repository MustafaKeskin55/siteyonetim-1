"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 ${className}`}
        aria-hidden="true"
      />
    );
  }

  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative p-2 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-center ${
        isDark
          ? "border-slate-700/80 bg-slate-900/90 text-amber-300 hover:bg-slate-800 hover:text-amber-200 shadow-sm"
          : "border-slate-200/90 bg-white/90 text-slate-700 hover:bg-slate-100 hover:text-slate-950 shadow-xs"
      } ${className}`}
      aria-label={isDark ? "Açık temaya geç" : "Karanlık temaya geç"}
      title={isDark ? "Açık Tema" : "Karanlık Tema"}
    >
      {isDark ? (
        <Sun className="h-4 w-4 transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 transition-transform duration-300 -rotate-12 hover:rotate-0" />
      )}
    </button>
  );
}
