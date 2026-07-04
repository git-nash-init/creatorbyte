"use client";

import { useMemo, useState } from "react";
import { seedCreators } from "@/lib/mock/data";
import type { Creator } from "@/lib/types";
import { useMounted } from "@/lib/hooks/useMounted";
import { cn, formatINR } from "@/lib/utils";
import { PageHeader } from "@/components/shared/PageHeader";
import { Avatar } from "@/components/shared/Avatar";
import { MdIcon, MdIconButton, MdOutlinedTextField } from "@/components/md";

const planCls: Record<Creator["plan"], string> = {
  free: "bg-surface-high text-on-surface-variant",
  pro: "bg-primary-container text-on-primary-container",
  business: "bg-secondary text-on-secondary",
};

export default function CreatorsPage() {
  const mounted = useMounted();
  const [creators, setCreators] = useState(seedCreators);
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    if (!query.trim()) return creators;
    const q = query.toLowerCase();
    return creators.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    );
  }, [creators, query]);

  function toggleStatus(id: string) {
    setCreators((cs) =>
      cs.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "active" ? "suspended" : "active" }
          : c
      )
    );
  }

  if (!mounted) return null;

  return (
    <div>
      <PageHeader
        title="Creators"
        subtitle="Manage everyone building on CreatorByte"
      />

      <div className="mb-5">
        <MdOutlinedTextField
          placeholder="Search creators by name or email"
          value={query}
          style={{ width: "100%", "--md-outlined-field-container-shape": "9999px" } as React.CSSProperties}
          onInput={(e: React.FormEvent<HTMLInputElement>) =>
            setQuery((e.target as HTMLInputElement).value)
          }
        >
          <MdIcon slot="leading-icon">search</MdIcon>
        </MdOutlinedTextField>
      </div>

      <div className="cb-card overflow-hidden">
        <div className="hidden grid-cols-[1.4fr_90px_90px_110px_110px_110px] items-center gap-3 border-b border-outline-variant px-5 py-3 text-xs font-semibold uppercase tracking-wide text-on-surface-variant lg:grid">
          <span>Creator ({visible.length})</span>
          <span>Plan</span>
          <span>Pages</span>
          <span>Sales</span>
          <span>Revenue</span>
          <span className="text-right">Status</span>
        </div>
        <ul>
          {visible.map((c) => (
            <li
              key={c.id}
              className="grid grid-cols-1 items-center gap-3 border-b border-outline-variant px-5 py-4 transition-colors last:border-0 hover:bg-surface-low lg:grid-cols-[1.4fr_90px_90px_110px_110px_110px]"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Avatar name={c.name} color={c.avatarColor} size={40} />
                <div className="min-w-0">
                  <p className="truncate font-medium text-on-surface">
                    {c.name}
                  </p>
                  <p className="truncate text-xs text-on-surface-variant">
                    {c.email}
                  </p>
                </div>
              </div>
              <span>
                <span
                  className={cn(
                    "inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
                    planCls[c.plan]
                  )}
                >
                  {c.plan}
                </span>
              </span>
              <span className="text-sm text-on-surface">{c.pages}</span>
              <span className="text-sm text-on-surface">{c.sales}</span>
              <span className="text-sm font-semibold text-on-surface">
                {formatINR(c.revenue, true)}
              </span>
              <div className="flex items-center justify-end gap-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                    c.status === "active"
                      ? "bg-[color:var(--color-success-container)] text-[color:var(--color-on-success-container)]"
                      : "bg-error-container text-on-error-container"
                  )}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                  {c.status === "active" ? "Active" : "Suspended"}
                </span>
                <MdIconButton
                  aria-label={
                    c.status === "active"
                      ? `Suspend ${c.name}`
                      : `Reactivate ${c.name}`
                  }
                  title={c.status === "active" ? "Suspend" : "Reactivate"}
                  onClick={() => toggleStatus(c.id)}
                >
                  <MdIcon>
                    {c.status === "active" ? "block" : "restart_alt"}
                  </MdIcon>
                </MdIconButton>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
