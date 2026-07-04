"use client";

import { useUiStore } from "@/lib/store/uiStore";
import { RoleSwitcher } from "./RoleSwitcher";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { MdIcon, MdIconButton } from "@/components/md";

export function Topbar({ title }: { title?: string }) {
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-outline-variant bg-surface/80 px-4 backdrop-blur-md lg:px-8">
      <button
        className="lg:hidden"
        aria-label="Open menu"
        onClick={toggleSidebar}
      >
        <MdIcon>menu</MdIcon>
      </button>

      {title && (
        <h1 className="truncate font-display text-lg font-semibold text-on-surface">
          {title}
        </h1>
      )}

      <div className="ml-auto flex items-center gap-2">
        <RoleSwitcher />
        <ThemeToggle />
        <MdIconButton aria-label="Notifications">
          <MdIcon>notifications</MdIcon>
        </MdIconButton>
      </div>
    </header>
  );
}
