"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { navForPath, areaFromPath } from "./nav";
import { useUiStore } from "@/lib/store/uiStore";
import { useProfileStore } from "@/lib/store/profileStore";
import { Avatar } from "@/components/shared/Avatar";
import { MdIcon, MdRipple } from "@/components/md";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const items = navForPath(pathname);
  const area = areaFromPath(pathname);
  const open = useUiStore((s) => s.sidebarOpen);
  const setSidebar = useUiStore((s) => s.setSidebar);
  const profile = useProfileStore((s) => s.profile);

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <>
      {/* Mobile scrim */}
      <div
        onClick={() => setSidebar(false)}
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col border-r border-outline-variant bg-surface-lowest transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ transitionTimingFunction: "var(--cb-ease-emphasized)" }}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Link href={area === "superadmin" ? "/admin" : "/payments"}>
            <Logo />
          </Link>
          <button
            className="lg:hidden"
            aria-label="Close menu"
            onClick={() => setSidebar(false)}
          >
            <MdIcon>close</MdIcon>
          </button>
        </div>

        {area === "superadmin" && (
          <div className="mx-4 mb-2 rounded-full bg-primary-container px-3 py-1 text-center text-[11px] font-semibold uppercase tracking-wide text-on-primary-container">
            Platform Admin
          </div>
        )}

        <nav className="flex-1 space-y-1 px-3 py-2">
          {items.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebar(false)}
                className={cn(
                  "group relative flex items-center gap-3 overflow-hidden rounded-full px-4 py-2.5 text-sm font-medium transition-colors duration-200",
                  active
                    ? "bg-secondary text-on-secondary"
                    : "text-on-surface-variant hover:bg-surface-high hover:text-on-surface"
                )}
              >
                {!active && <MdRipple />}
                <MdIcon
                  filled={active}
                  style={{ fontSize: 22 }}
                >
                  {item.icon}
                </MdIcon>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-outline-variant p-3">
          <div className="flex items-center gap-3 rounded-2xl bg-surface-low px-3 py-2.5">
            <Avatar name={profile.displayName} color={profile.avatarColor} size={36} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-on-surface">
                {profile.displayName}
              </p>
              <p className="truncate text-xs text-on-surface-variant">
                {profile.email}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
