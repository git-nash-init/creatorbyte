"use client";

import { useEffect, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";

// lottie-react touches browser APIs — load client-side only
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

/** Empty state with the flying-rocket animation and a motivating message. */
export function RocketEmpty({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/animations/rocket.json")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setAnimationData(data);
      })
      .catch(() => {
        /* animation is decorative — fail silently */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-outline-variant bg-surface-low px-6 py-10 text-center">
      <div className="h-52 w-52 sm:h-64 sm:w-64" aria-hidden>
        {animationData && (
          <Lottie animationData={animationData} loop autoplay />
        )}
      </div>
      <h3 className="font-display text-2xl font-semibold text-on-surface">
        {title}
      </h3>
      {description && (
        <p className="mt-2 max-w-md text-sm leading-relaxed text-on-surface-variant">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
