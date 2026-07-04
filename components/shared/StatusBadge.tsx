import type { PageStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const map: Record<PageStatus, { label: string; cls: string }> = {
  published: {
    label: "Published",
    cls: "bg-[color:var(--color-success-container)] text-[color:var(--color-on-success-container)]",
  },
  unpublished: {
    label: "Unpublished",
    cls: "bg-surface-high text-on-surface-variant",
  },
  draft: {
    label: "Draft",
    cls: "bg-tertiary-container text-on-primary-container",
  },
};

export function StatusBadge({ status }: { status: PageStatus }) {
  const s = map[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        s.cls
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {s.label}
    </span>
  );
}

export function EnabledBadge({ enabled }: { enabled: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        enabled
          ? "bg-[color:var(--color-success-container)] text-[color:var(--color-on-success-container)]"
          : "bg-surface-high text-on-surface-variant"
      )}
    >
      {enabled ? "Enabled" : "Disabled"}
    </span>
  );
}
