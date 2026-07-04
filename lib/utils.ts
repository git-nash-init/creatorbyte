export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatINR(value: number, compact = false): string {
  if (compact && value >= 100000) {
    const lakhs = value / 100000;
    return `₹${lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(2)}L`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatBytes(bytes: number): string {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 2)} ${units[i]}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

export function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export function discountPercent(price: number, discounted?: number): number {
  if (!discounted || discounted >= price || price <= 0) return 0;
  return Math.round(((price - discounted) / price) * 100);
}
