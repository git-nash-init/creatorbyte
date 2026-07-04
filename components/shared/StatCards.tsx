import type { ReactNode } from "react";
import { MdIcon } from "@/components/md";

export interface Stat {
  label: string;
  value: ReactNode;
  icon: string;
  hint?: string;
  accent?: string;
}

export function StatCards({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="cb-card group flex items-start gap-4 p-5 transition-transform duration-300 hover:-translate-y-0.5"
          style={{ transitionTimingFunction: "var(--cb-ease-emphasized)" }}
        >
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-on-primary-container"
            style={{ background: s.accent ?? "var(--md-sys-color-tertiary-container)" }}
          >
            <MdIcon>{s.icon}</MdIcon>
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              {s.label}
            </p>
            <p className="mt-1 font-display text-2xl font-semibold text-on-surface">
              {s.value}
            </p>
            {s.hint && (
              <p className="mt-0.5 text-xs text-on-surface-variant">{s.hint}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
