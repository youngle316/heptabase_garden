"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const Icon = theme === "light" ? Sun : Moon;

  return (
    <div
      className="box-border flex h-8 w-8 shrink-0 cursor-pointer select-none items-center justify-center rounded-md p-[7px] hover:bg-[rgba(0,0,0,0.08)] dark:hover:bg-[rgba(255,255,255,0.08)]"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Icon className="fill-[rgba(0,0,0,0.65)] dark:fill-[rgba(255,255,255,0.65)]" />
    </div>
  );
}
