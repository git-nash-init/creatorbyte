import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Avatar({
  name,
  color = "#72a4f2",
  size = 40,
  className,
}: {
  name: string;
  color?: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-display font-semibold text-[#202020]",
        className
      )}
      style={{
        width: size,
        height: size,
        background: color,
        fontSize: size * 0.4,
      }}
    >
      {initials(name || "?")}
    </span>
  );
}
