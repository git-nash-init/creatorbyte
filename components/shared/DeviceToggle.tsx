"use client";

import { cn } from "@/lib/utils";
import { MdIcon } from "@/components/md";

export type Device = "desktop" | "mobile";

export function DeviceToggle({
  value,
  onChange,
}: {
  value: Device;
  onChange: (d: Device) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-outline-variant bg-surface-lowest p-1">
      {(["desktop", "mobile"] as Device[]).map((d) => (
        <button
          key={d}
          type="button"
          onClick={() => onChange(d)}
          aria-pressed={value === d}
          aria-label={`${d} preview`}
          className={cn(
            "inline-flex h-8 w-9 items-center justify-center rounded-full transition-colors duration-200",
            value === d
              ? "bg-secondary text-on-secondary"
              : "text-on-surface-variant hover:bg-surface-high"
          )}
        >
          <MdIcon style={{ fontSize: 20 }}>
            {d === "desktop" ? "computer" : "smartphone"}
          </MdIcon>
        </button>
      ))}
    </div>
  );
}
