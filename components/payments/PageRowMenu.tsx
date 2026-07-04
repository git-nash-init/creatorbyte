"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { PaymentPage } from "@/lib/types";
import { usePagesStore } from "@/lib/store/pagesStore";
import { MdIcon, MdIconButton } from "@/components/md";
import { cn } from "@/lib/utils";

export function PageRowMenu({ page }: { page: PaymentPage }) {
  const router = useRouter();
  const { remove, duplicate, setStatus } = usePagesStore();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const items = [
    {
      icon: "edit",
      label: "Edit",
      action: () => router.push(`/payments/${page.id}/edit`),
    },
    {
      icon: "content_copy",
      label: "Duplicate",
      action: () => duplicate(page.id),
    },
    page.status === "published"
      ? {
          icon: "visibility_off",
          label: "Unpublish",
          action: () => setStatus(page.id, "unpublished"),
        }
      : {
          icon: "visibility",
          label: "Publish",
          action: () => setStatus(page.id, "published"),
        },
    {
      icon: "delete",
      label: "Delete",
      action: () => remove(page.id),
      danger: true,
    },
  ];

  return (
    <div
      ref={wrapRef}
      className="relative"
      onBlur={(e) => {
        if (!wrapRef.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <MdIconButton aria-label="More options" onClick={() => setOpen((o) => !o)}>
        <MdIcon>more_vert</MdIcon>
      </MdIconButton>

      {open && (
        <div className="absolute right-0 top-11 z-20 w-44 overflow-hidden rounded-2xl border border-outline-variant bg-surface-lowest py-1 shadow-lg">
          {items.map((it) => (
            <button
              key={it.label}
              type="button"
              onClick={() => {
                setOpen(false);
                it.action();
              }}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-surface-high",
                "danger" in it && it.danger
                  ? "text-error"
                  : "text-on-surface"
              )}
            >
              <MdIcon style={{ fontSize: 20 }}>{it.icon}</MdIcon>
              {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
