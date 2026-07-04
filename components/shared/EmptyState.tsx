import type { ReactNode } from "react";
import { MdIcon } from "@/components/md";

export function EmptyState({
  icon = "inbox",
  title,
  description,
  action,
}: {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-outline-variant bg-surface-low px-6 py-16 text-center">
      <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-tertiary-container text-on-primary-container">
        <MdIcon style={{ fontSize: 32 }}>{icon}</MdIcon>
      </span>
      <h3 className="font-display text-xl font-semibold text-on-surface">
        {title}
      </h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-on-surface-variant">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
