"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLockedStore } from "@/lib/store/lockedStore";
import { useMounted } from "@/lib/hooks/useMounted";
import type { PageStatus } from "@/lib/types";
import { cn, formatINR } from "@/lib/utils";
import { StatCards } from "@/components/shared/StatCards";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CopyLinkButton, OpenLinkButton } from "@/components/shared/ShareButton";
import { LockedRowMenu } from "@/components/locked/LockedRowMenu";
import {
  MdFilledButton,
  MdIcon,
  MdOutlinedTextField,
} from "@/components/md";

const statusTabs: { key: PageStatus; label: string }[] = [
  { key: "published", label: "Published" },
  { key: "unpublished", label: "Unpublished" },
  { key: "draft", label: "Draft" },
];

export default function LockedContentPage() {
  const mounted = useMounted();
  const items = useLockedStore((s) => s.items);
  const [tab, setTab] = useState<PageStatus>("published");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const c: Record<PageStatus, number> = {
      published: 0,
      unpublished: 0,
      draft: 0,
    };
    for (const i of items) c[i.status]++;
    return c;
  }, [items]);

  const totals = useMemo(() => {
    const published = items.filter((i) => i.status === "published");
    return {
      unlocks: published.reduce((a, i) => a + i.sales, 0),
      revenue: published.reduce((a, i) => a + i.revenue, 0),
      items: published.length,
    };
  }, [items]);

  const visible = useMemo(() => {
    let list = items.filter((i) => i.status === tab);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q)
      );
    }
    return [...list].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [items, tab, query]);

  if (!mounted) return null;

  return (
    <div>
      {/* Hero header band — night sky, matches locked buyer view */}
      <div
        className="relative mb-6 overflow-hidden rounded-3xl px-6 py-10 text-center sm:py-12"
        style={{
          background:
            "radial-gradient(900px 400px at 85% -20%, #3d5f96 0%, transparent 55%), linear-gradient(160deg, #202020 0%, #1b2a4a 70%, #2f3f66 100%)",
        }}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-50">
          {[...Array(14)].map((_, i) => (
            <span
              key={i}
              className="absolute h-[2px] w-[2px] rounded-full bg-white/70"
              style={{ left: `${(i * 61) % 100}%`, top: `${(i * 43) % 100}%` }}
            />
          ))}
        </div>
        <h1 className="relative font-display text-3xl font-semibold text-white sm:text-4xl">
          Locked Content
        </h1>
        <p className="relative mt-2 text-sm text-white/80">
          Put your premium content behind a paywall — visitors pay to unlock
        </p>
        <div className="absolute right-4 top-4 hidden sm:block">
          <Link href="/locked/new">
            <MdFilledButton>
              <MdIcon slot="icon">add</MdIcon>
              Create Locked Content
            </MdFilledButton>
          </Link>
        </div>
      </div>

      <div className="mb-4 sm:hidden">
        <Link href="/locked/new">
          <MdFilledButton style={{ width: "100%" }}>
            <MdIcon slot="icon">add</MdIcon>
            Create Locked Content
          </MdFilledButton>
        </Link>
      </div>

      <StatCards
        stats={[
          {
            label: "Total Unlocks",
            value: totals.unlocks,
            icon: "lock_open",
          },
          {
            label: "Total Revenue",
            value: formatINR(totals.revenue),
            icon: "currency_rupee",
            accent: "var(--md-sys-color-primary-container)",
          },
          {
            label: "Live Content",
            value: totals.items,
            icon: "lock",
            accent: "var(--color-success-container)",
          },
        ]}
      />

      {/* Status tabs */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {statusTabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200",
              tab === t.key
                ? "bg-secondary text-on-secondary shadow-sm"
                : "border border-outline-variant bg-surface-lowest text-on-surface-variant hover:bg-surface-high"
            )}
          >
            {t.label} ({t.key in counts ? counts[t.key] : 0})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mt-4">
        <MdOutlinedTextField
          placeholder="Search by title or category"
          value={query}
          style={{ width: "100%", "--md-outlined-field-container-shape": "9999px" } as React.CSSProperties}
          onInput={(e: React.FormEvent<HTMLInputElement>) =>
            setQuery((e.target as HTMLInputElement).value)
          }
        >
          <MdIcon slot="leading-icon">search</MdIcon>
        </MdOutlinedTextField>
      </div>

      {/* List */}
      <div className="mt-5">
        {visible.length === 0 ? (
          <EmptyState
            icon="lock"
            title={`No ${tab} content`}
            description="Lock text, images, videos or files behind a price and share the link."
            action={
              <Link href="/locked/new">
                <MdFilledButton>
                  <MdIcon slot="icon">add</MdIcon>
                  Create Locked Content
                </MdFilledButton>
              </Link>
            }
          />
        ) : (
          <div className="cb-card overflow-hidden">
            <div className="hidden grid-cols-[1fr_140px_110px_90px_110px_150px] items-center gap-3 border-b border-outline-variant px-5 py-3 text-xs font-semibold uppercase tracking-wide text-on-surface-variant lg:grid">
              <span>Content ({visible.length})</span>
              <span>Category</span>
              <span>Price</span>
              <span>Unlocks</span>
              <span>Revenue</span>
              <span className="text-right">Actions</span>
            </div>
            <ul>
              {visible.map((i) => (
                <li
                  key={i.id}
                  className="grid grid-cols-1 items-center gap-3 border-b border-outline-variant px-5 py-4 transition-colors last:border-0 hover:bg-surface-low lg:grid-cols-[1fr_140px_110px_90px_110px_150px]"
                >
                  <Link
                    href={`/locked/${i.id}/edit`}
                    className="flex min-w-0 items-center gap-3"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-on-secondary">
                      <MdIcon>lock</MdIcon>
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-on-surface">
                        {i.title}
                      </p>
                      <div className="mt-0.5 lg:hidden">
                        <StatusBadge status={i.status} />
                      </div>
                    </div>
                  </Link>
                  <span className="truncate text-sm text-on-surface-variant">
                    {i.category}
                  </span>
                  <span className="text-sm font-semibold text-on-surface">
                    {formatINR(i.unlockPrice)}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm text-on-surface">
                    <MdIcon style={{ fontSize: 16 }}>lock_open</MdIcon>
                    {i.sales}
                  </span>
                  <span className="text-sm font-semibold text-on-surface">
                    {formatINR(i.revenue, true)}
                  </span>
                  <div className="flex items-center justify-end gap-1">
                    <OpenLinkButton href={`https://creatorbyte.in/l/${i.slug}`} />
                    <CopyLinkButton url={`https://creatorbyte.in/l/${i.slug}`} />
                    <LockedRowMenu item={i} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
