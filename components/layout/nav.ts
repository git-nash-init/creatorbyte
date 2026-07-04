import type { Role } from "@/lib/types";

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

export const adminNav: NavItem[] = [
  { label: "Payment Pages", href: "/payments", icon: "payments" },
  { label: "Locked Content", href: "/locked", icon: "lock" },
  { label: "Profile", href: "/profile", icon: "person" },
  { label: "Settings", href: "/settings", icon: "settings" },
];

export const superAdminNav: NavItem[] = [
  { label: "Overview", href: "/admin", icon: "space_dashboard" },
  { label: "Creators", href: "/admin/creators", icon: "groups" },
  { label: "Profile", href: "/admin/profile", icon: "shield_person" },
];

export function areaFromPath(pathname: string): Role {
  return pathname.startsWith("/admin") ? "superadmin" : "admin";
}

export function navForPath(pathname: string): NavItem[] {
  return areaFromPath(pathname) === "superadmin" ? superAdminNav : adminNav;
}
