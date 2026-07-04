"use client";

import { useTheme } from "next-themes";
import { useMounted } from "@/lib/hooks/useMounted";
import { MdIconButton, MdIcon } from "@/components/md";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const isDark = resolvedTheme === "dark";

  return (
    <MdIconButton
      aria-label="Toggle theme"
      title={isDark ? "Switch to light" : "Switch to dark"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <MdIcon>{mounted && isDark ? "light_mode" : "dark_mode"}</MdIcon>
    </MdIconButton>
  );
}
