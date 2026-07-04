/* Cover thumbnail — shows the uploaded image or a branded gradient fallback. */
export function CoverThumb({
  src,
  title,
  className = "h-12 w-12 rounded-xl",
}: {
  src?: string;
  title: string;
  className?: string;
}) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={title} className={`${className} shrink-0 object-cover`} />;
  }
  const hue =
    (Array.from(title).reduce((a, c) => a + c.charCodeAt(0), 0) % 60) + 190;
  return (
    <span
      aria-hidden
      className={`${className} flex shrink-0 items-center justify-center font-display text-sm font-semibold text-white`}
      style={{
        background: `linear-gradient(135deg, hsl(${hue} 80% 70%), hsl(${hue + 30} 70% 55%))`,
      }}
    >
      {(title[0] || "?").toUpperCase()}
    </span>
  );
}
