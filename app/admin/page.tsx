"use client";

import Link from "next/link";
import { seedCreators } from "@/lib/mock/data";
import { useMounted } from "@/lib/hooks/useMounted";
import { formatINR } from "@/lib/utils";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCards } from "@/components/shared/StatCards";
import { Avatar } from "@/components/shared/Avatar";
import { MdIcon, MdOutlinedButton } from "@/components/md";

export default function AdminOverviewPage() {
  const mounted = useMounted();
  if (!mounted) return null;

  const totalRevenue = seedCreators.reduce((a, c) => a + c.revenue, 0);
  const totalSales = seedCreators.reduce((a, c) => a + c.sales, 0);
  const active = seedCreators.filter((c) => c.status === "active").length;
  const top = [...seedCreators].sort((a, b) => b.revenue - a.revenue).slice(0, 4);

  return (
    <div>
      <PageHeader
        title="Platform Overview"
        subtitle="Everything happening across CreatorByte"
      />

      <StatCards
        stats={[
          {
            label: "Platform Revenue",
            value: formatINR(totalRevenue),
            icon: "account_balance",
            hint: "across all creators",
            accent: "var(--md-sys-color-primary-container)",
          },
          {
            label: "Total Sales",
            value: totalSales.toLocaleString("en-IN"),
            icon: "shopping_bag",
            hint: "all time",
          },
          {
            label: "Active Creators",
            value: `${active} / ${seedCreators.length}`,
            icon: "groups",
            hint: "currently live",
            accent: "var(--color-success-container)",
          },
        ]}
      />

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top creators */}
        <section className="cb-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-on-surface">
              Top creators
            </h2>
            <Link href="/admin/creators">
              <MdOutlinedButton>
                View all
                <MdIcon slot="icon">arrow_forward</MdIcon>
              </MdOutlinedButton>
            </Link>
          </div>
          <ul className="space-y-1">
            {top.map((c, idx) => (
              <li
                key={c.id}
                className="flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:bg-surface-low"
              >
                <span className="w-5 text-center font-display text-sm font-semibold text-on-surface-variant">
                  {idx + 1}
                </span>
                <Avatar name={c.name} color={c.avatarColor} size={36} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-on-surface">
                    {c.name}
                  </p>
                  <p className="truncate text-xs text-on-surface-variant">
                    {c.sales} sales
                  </p>
                </div>
                <span className="text-sm font-semibold text-on-surface">
                  {formatINR(c.revenue, true)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Recent activity */}
        <section className="cb-card p-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-on-surface">
            Recent activity
          </h2>
          <ul className="space-y-4">
            {[
              {
                icon: "shopping_bag",
                text: "Mehul Palan made a sale — TRADE OPTION EXPERTS",
                time: "2 min ago",
              },
              {
                icon: "lock_open",
                text: "Education and Algo Tool was unlocked",
                time: "18 min ago",
              },
              {
                icon: "person_add",
                text: "Aisha Khan joined CreatorByte",
                time: "1 hr ago",
              },
              {
                icon: "storefront",
                text: "Rohan Verma published a new payment page",
                time: "3 hr ago",
              },
              {
                icon: "payments",
                text: "Payout of ₹42,300 processed",
                time: "yesterday",
              },
            ].map((a, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-high text-on-surface-variant">
                  <MdIcon style={{ fontSize: 18 }}>{a.icon}</MdIcon>
                </span>
                <div>
                  <p className="text-sm text-on-surface">{a.text}</p>
                  <p className="text-xs text-on-surface-variant">{a.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
