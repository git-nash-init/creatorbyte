"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePagesStore } from "@/lib/store/pagesStore";
import { useMounted } from "@/lib/hooks/useMounted";
import type { PageStatus, PaymentPage } from "@/lib/types";
import { cn, discountPercent, formatINR } from "@/lib/utils";
import { StatCards } from "@/components/shared/StatCards";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatusBadge, EnabledBadge } from "@/components/shared/StatusBadge";
import { CoverThumb } from "@/components/shared/CoverThumb";
import { CopyLinkButton, OpenLinkButton } from "@/components/shared/ShareButton";
import { PageRowMenu } from "@/components/payments/PageRowMenu";
import {
  MdFilledButton,
  MdIcon,
  MdOutlinedTextField,
  MdOutlinedButton,
} from "@/components/md";

type SortKey = "newest" | "revenue" | "sales" | "title";
type View = "list" | "grid";

const statusTabs: { key: PageStatus; label: string }[] = [
  { key: "published", label: "Published" },
  { key: "unpublished", label: "Unpublished" },
  { key: "draft", label: "Draft" },
];

function pageUrl(p: PaymentPage) {
  return `https://creatorbyte.in/p/${p.slug}`;
}

function priceLabel(p: PaymentPage) {
  if (p.priceType === "flexible") return `From ${formatINR(p.price)}`;
  if (p.discountEnabled && p.discountedPrice)
    return formatINR(p.discountedPrice);
  return formatINR(p.price);
}

export default function PaymentPagesPage() {
  const mounted = useMounted();
  const pages = usePagesStore((s) => s.pages);

  const [tab, setTab] = useState<PageStatus>("published");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");
  const [view, setView] = useState<View>("list");
  const [sortOpen, setSortOpen] = useState(false);

  const counts = useMemo(() => {
    const c: Record<PageStatus, number> = {
      published: 0,
      unpublished: 0,
      draft: 0,
    };
    for (const p of pages) c[p.status]++;
    return c;
  }, [pages]);

  const totals = useMemo(() => {
    const published = pages.filter((p) => p.status === "published");
    const sales = published.reduce((a, p) => a + p.sales, 0);
    const revenue = published.reduce((a, p) => a + p.revenue, 0);
    return { sales, revenue, conversion: sales > 0 ? 34 : 0 };
  }, [pages]);

  const visible = useMemo(() => {
    let list = pages.filter((p) => p.status === tab);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q));
    }
    switch (sort) {
      case "revenue":
        list = [...list].sort((a, b) => b.revenue - a.revenue);
        break;
      case "sales":
        list = [...list].sort((a, b) => b.sales - a.sales);
        break;
      case "title":
        list = [...list].sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        list = [...list].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
    return list;
  }, [pages, tab, query, sort]);

  function exportCsv() {
    const rows = [
      ["Title", "Status", "Price", "Sales", "Revenue", "Created"],
      ...pages.map((p) => [
        `"${p.title.replaceAll('"', '""')}"`,
        p.status,
        String(p.price),
        String(p.sales),
        String(p.revenue),
        p.createdAt,
      ]),
    ];
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], {
      type: "text/csv",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "payment-pages.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  if (!mounted) return null;

  return (
    <div>
      {/* Hero header band */}
      <div
        className="relative mb-6 overflow-hidden rounded-3xl px-6 py-10 text-center sm:py-12"
        style={{
          background:
            "linear-gradient(120deg, #1b2a4a 0%, #2f6be0 45%, #72a4f2 80%, #aac9f7 100%)",
        }}
      >
        <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">
          Payment Pages
        </h1>
        <p className="mt-2 text-sm text-white/80">
          Sell your digital products with beautiful checkout pages
        </p>
        <div className="mt-4 flex items-center justify-center gap-4 text-sm font-medium text-white/90">
          <button className="inline-flex items-center gap-1.5 transition-opacity hover:opacity-80">
            <MdIcon style={{ fontSize: 18 }}>play_circle</MdIcon> View Demo
          </button>
          <span className="h-4 w-px bg-white/30" />
          <button className="inline-flex items-center gap-1.5 transition-opacity hover:opacity-80">
            <MdIcon style={{ fontSize: 18 }}>menu_book</MdIcon> Resources
          </button>
        </div>
        <div className="absolute right-4 top-4 hidden sm:block">
          <Link href="/payments/new">
            <MdFilledButton>
              <MdIcon slot="icon">add</MdIcon>
              Create Payment Page
            </MdFilledButton>
          </Link>
        </div>
      </div>

      <div className="mb-4 sm:hidden">
        <Link href="/payments/new">
          <MdFilledButton style={{ width: "100%" }}>
            <MdIcon slot="icon">add</MdIcon>
            Create Payment Page
          </MdFilledButton>
        </Link>
      </div>

      <StatCards
        stats={[
          {
            label: "Total Sale",
            value: totals.sales,
            icon: "shopping_bag",
            hint: "same as last week",
          },
          {
            label: "Total Revenue",
            value: formatINR(totals.revenue),
            icon: "currency_rupee",
            hint: "same as last week",
            accent: "var(--md-sys-color-primary-container)",
          },
          {
            label: "Conversion",
            value: `${totals.conversion}%`,
            icon: "trending_up",
            hint: "same as last week",
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
            {t.label} ({counts[t.key]})
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex-1">
          <MdOutlinedTextField
            placeholder="Search"
            value={query}
            style={{ width: "100%", "--md-outlined-field-container-shape": "9999px" } as React.CSSProperties}
            onInput={(e: React.FormEvent<HTMLInputElement>) =>
              setQuery((e.target as HTMLInputElement).value)
            }
          >
            <MdIcon slot="leading-icon">search</MdIcon>
          </MdOutlinedTextField>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <MdOutlinedButton onClick={() => setSortOpen((o) => !o)}>
              <MdIcon slot="icon">swap_vert</MdIcon>
              Sort
            </MdOutlinedButton>
            {sortOpen && (
              <div className="absolute right-0 top-12 z-20 w-44 overflow-hidden rounded-2xl border border-outline-variant bg-surface-lowest py-1 shadow-lg">
                {(
                  [
                    ["newest", "Newest first"],
                    ["revenue", "Highest revenue"],
                    ["sales", "Most sales"],
                    ["title", "Title A–Z"],
                  ] as [SortKey, string][]
                ).map(([k, label]) => (
                  <button
                    key={k}
                    className={cn(
                      "flex w-full items-center justify-between px-4 py-2.5 text-left text-sm font-medium hover:bg-surface-high",
                      sort === k ? "text-primary" : "text-on-surface"
                    )}
                    onClick={() => {
                      setSort(k);
                      setSortOpen(false);
                    }}
                  >
                    {label}
                    {sort === k && <MdIcon style={{ fontSize: 18 }}>check</MdIcon>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <MdOutlinedButton onClick={exportCsv}>
            <MdIcon slot="icon">download</MdIcon>
            Export
          </MdOutlinedButton>

          <div className="inline-flex items-center gap-1 rounded-full border border-outline-variant bg-surface-lowest p-1">
            {(["list", "grid"] as View[]).map((v) => (
              <button
                key={v}
                type="button"
                aria-label={`${v} view`}
                onClick={() => setView(v)}
                className={cn(
                  "inline-flex h-8 w-9 items-center justify-center rounded-full transition-colors duration-200",
                  view === v
                    ? "bg-secondary text-on-secondary"
                    : "text-on-surface-variant hover:bg-surface-high"
                )}
              >
                <MdIcon style={{ fontSize: 20 }}>
                  {v === "list" ? "view_list" : "grid_view"}
                </MdIcon>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-5">
        {visible.length === 0 ? (
          <EmptyState
            icon="storefront"
            title={`No ${tab} pages`}
            description="Create a payment page to start selling your digital products."
            action={
              <Link href="/payments/new">
                <MdFilledButton>
                  <MdIcon slot="icon">add</MdIcon>
                  Create Payment Page
                </MdFilledButton>
              </Link>
            }
          />
        ) : view === "list" ? (
          <div className="cb-card overflow-hidden">
            <div className="hidden grid-cols-[1fr_110px_90px_110px_110px_150px] items-center gap-3 border-b border-outline-variant px-5 py-3 text-xs font-semibold uppercase tracking-wide text-on-surface-variant lg:grid">
              <span>Payment Page ({visible.length})</span>
              <span>Price</span>
              <span>Sale</span>
              <span>Revenue</span>
              <span>Payments</span>
              <span className="text-right">Actions</span>
            </div>
            <ul>
              {visible.map((p) => (
                <li
                  key={p.id}
                  className="grid grid-cols-1 items-center gap-3 border-b border-outline-variant px-5 py-4 transition-colors last:border-0 hover:bg-surface-low lg:grid-cols-[1fr_110px_90px_110px_110px_150px]"
                >
                  <Link
                    href={`/payments/${p.id}/edit`}
                    className="flex min-w-0 items-center gap-3"
                  >
                    <CoverThumb src={p.coverImage} title={p.title} />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-on-surface">
                        {p.title}
                      </p>
                      <div className="mt-0.5 lg:hidden">
                        <StatusBadge status={p.status} />
                      </div>
                    </div>
                  </Link>
                  <span className="text-sm font-semibold text-on-surface">
                    {priceLabel(p)}
                    {p.priceType === "fixed" &&
                      p.discountEnabled &&
                      p.discountedPrice && (
                        <span className="ml-1.5 text-xs font-normal text-on-surface-variant line-through">
                          {formatINR(p.price)}
                        </span>
                      )}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm text-on-surface">
                    <MdIcon style={{ fontSize: 16 }}>group</MdIcon>
                    {p.sales}
                  </span>
                  <span className="text-sm font-semibold text-on-surface">
                    {formatINR(p.revenue, true)}
                  </span>
                  <span>
                    <EnabledBadge enabled={p.paymentsEnabled} />
                  </span>
                  <div className="flex items-center justify-end gap-1">
                    <OpenLinkButton href={pageUrl(p)} />
                    <CopyLinkButton url={pageUrl(p)} />
                    <PageRowMenu page={p} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((p) => (
              <div
                key={p.id}
                className="cb-card group overflow-hidden transition-transform duration-300 hover:-translate-y-1"
                style={{ transitionTimingFunction: "var(--cb-ease-emphasized)" }}
              >
                <Link href={`/payments/${p.id}/edit`}>
                  <CoverThumb
                    src={p.coverImage}
                    title={p.title}
                    className="h-36 w-full rounded-none"
                  />
                </Link>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/payments/${p.id}/edit`} className="min-w-0">
                      <p className="truncate font-medium text-on-surface">
                        {p.title}
                      </p>
                    </Link>
                    <PageRowMenu page={p} />
                  </div>
                  <p className="mt-1 text-sm font-semibold text-on-surface">
                    {priceLabel(p)}
                    {p.priceType === "fixed" &&
                      p.discountEnabled &&
                      p.discountedPrice && (
                        <span className="ml-1.5 text-xs font-normal text-on-surface-variant">
                          ({discountPercent(p.price, p.discountedPrice)}% off)
                        </span>
                      )}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <StatusBadge status={p.status} />
                    <span className="text-xs text-on-surface-variant">
                      {p.sales} sales · {formatINR(p.revenue, true)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
