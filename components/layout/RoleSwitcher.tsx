"use client";

import { usePathname, useRouter } from "next/navigation";
import { areaFromPath } from "./nav";
import { useUiStore } from "@/lib/store/uiStore";
import { MdIcon } from "@/components/md";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";

/** Dev-only view switcher (no real auth yet — arrives with Supabase). */
export function RoleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const setRole = useUiStore((s) => s.setRole);
  const area = areaFromPath(pathname);

  function go(role: Role) {
    setRole(role);
    router.push(role === "superadmin" ? "/admin" : "/payments");
  }

  const options: { role: Role; label: string; icon: string }[] = [
    { role: "admin", label: "Creator", icon: "person" },
    { role: "superadmin", label: "Platform", icon: "shield_person" },
  ];

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-outline-variant bg-surface-lowest p-1">
      {options.map((o) => (
        <button
          key={o.role}
          type="button"
          onClick={() => go(o.role)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors duration-200",
            area === o.role
              ? "bg-secondary text-on-secondary"
              : "text-on-surface-variant hover:bg-surface-high"
          )}
        >
          <MdIcon style={{ fontSize: 16 }}>{o.icon}</MdIcon>
          <span className="hidden sm:inline">{o.label}</span>
        </button>
      ))}
    </div>
  );
}
