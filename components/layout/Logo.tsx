import { cn } from "@/lib/utils";

export function Logo({
  collapsed = false,
  className,
}: {
  collapsed?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span
        className="flex h-9 w-9 items-center justify-center rounded-xl"
        style={{ background: "linear-gradient(135deg,#72a4f2,#2f6be0)" }}
        aria-hidden
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"
            fill="#fff"
            stroke="#fff"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {!collapsed && (
        <span className="font-display text-lg font-semibold tracking-tight text-on-surface">
          Creator<span className="text-primary">Byte</span>
        </span>
      )}
    </div>
  );
}
