"use client";

import { useState } from "react";
import { useMounted } from "@/lib/hooks/useMounted";
import { useProfileStore } from "@/lib/store/profileStore";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { PageHeader } from "@/components/shared/PageHeader";
import { cn, formatINR } from "@/lib/utils";
import {
  MdFilledButton,
  MdIcon,
  MdOutlinedButton,
  MdOutlinedTextField,
  MdSwitch,
} from "@/components/md";

const tabs = [
  "Profile",
  "Billing",
  "Payments",
  "Integrations",
  "Notification",
] as const;
type Tab = (typeof tabs)[number];

export default function SettingsPage() {
  const mounted = useMounted();
  const profile = useProfileStore((s) => s.profile);
  const [tab, setTab] = useState<Tab>("Profile");
  const [notif, setNotif] = useState({
    sales: true,
    payouts: true,
    marketing: false,
    weekly: true,
  });

  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Account Settings" />

      {/* tabs */}
      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-outline-variant">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "relative whitespace-nowrap px-4 py-3 text-sm font-semibold transition-colors duration-200",
              tab === t
                ? "text-primary"
                : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            {t}
            <span
              className={cn(
                "absolute inset-x-3 bottom-0 h-[3px] rounded-t-full bg-primary transition-transform duration-300",
                tab === t ? "scale-x-100" : "scale-x-0"
              )}
              style={{ transitionTimingFunction: "var(--cb-ease-emphasized)" }}
            />
          </button>
        ))}
      </div>

      {tab === "Profile" && <ProfileForm />}

      {tab === "Billing" && (
        <div className="space-y-6">
          <section className="cb-card p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-display text-lg font-semibold text-on-surface">
                  You&apos;re on the Free Plan
                </h2>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Unlock unlimited access to all features and get paid.
                </p>
              </div>
              <MdFilledButton>
                <MdIcon slot="icon">rocket_launch</MdIcon>
                Explore Plans
              </MdFilledButton>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { name: "Free", price: 0, desc: "5% platform fee" },
                { name: "Pro", price: 499, desc: "2% platform fee" },
                { name: "Business", price: 1999, desc: "0% platform fee" },
              ].map((p) => (
                <div
                  key={p.name}
                  className={cn(
                    "rounded-2xl border-2 p-4",
                    p.name === "Free"
                      ? "border-primary bg-primary-container/30"
                      : "border-outline-variant"
                  )}
                >
                  <p className="font-display text-base font-semibold text-on-surface">
                    {p.name}
                  </p>
                  <p className="mt-1 font-display text-2xl font-semibold text-on-surface">
                    {p.price === 0 ? "₹0" : formatINR(p.price)}
                    <span className="text-xs font-normal text-on-surface-variant">
                      /mo
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-on-surface-variant">{p.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {tab === "Payments" && (
        <div className="space-y-6">
          <section className="cb-card p-6">
            <h2 className="mb-1 font-display text-lg font-semibold text-on-surface">
              Payout details
            </h2>
            <p className="mb-4 text-sm text-on-surface-variant">
              Where we send your earnings (UPI or bank account).
            </p>
            <div className="space-y-4">
              <MdOutlinedTextField
                label="UPI ID"
                placeholder="yourname@upi"
                style={{ width: "100%" }}
              />
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                <span className="h-px flex-1 bg-outline-variant" /> or bank
                account <span className="h-px flex-1 bg-outline-variant" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <MdOutlinedTextField label="Account number" />
                <MdOutlinedTextField label="IFSC code" />
              </div>
              <div className="flex justify-end">
                <MdOutlinedButton>Save payout details</MdOutlinedButton>
              </div>
            </div>
          </section>
          <section className="cb-card p-6">
            <h2 className="mb-4 font-display text-lg font-semibold text-on-surface">
              Balance
            </h2>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                  Available for payout
                </p>
                <p className="mt-1 font-display text-3xl font-semibold text-on-surface">
                  {formatINR(184_250)}
                </p>
              </div>
              <MdFilledButton>Withdraw</MdFilledButton>
            </div>
          </section>
        </div>
      )}

      {tab === "Integrations" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            {
              icon: "captive_portal",
              name: "Supabase",
              desc: "Auth & database (coming soon)",
            },
            {
              icon: "cloud_upload",
              name: "Media Storage",
              desc: "Host images & videos (coming soon)",
            },
            {
              icon: "mail",
              name: "Email",
              desc: "Deliver purchases by email",
            },
            {
              icon: "webhook",
              name: "Webhooks",
              desc: "Notify your systems on sales",
            },
          ].map((i) => (
            <div key={i.name} className="cb-card flex items-start gap-4 p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-tertiary-container text-on-primary-container">
                <MdIcon>{i.icon}</MdIcon>
              </span>
              <div className="flex-1">
                <p className="font-semibold text-on-surface">{i.name}</p>
                <p className="text-xs text-on-surface-variant">{i.desc}</p>
              </div>
              <MdOutlinedButton>Connect</MdOutlinedButton>
            </div>
          ))}
        </div>
      )}

      {tab === "Notification" && (
        <section className="cb-card divide-y divide-outline-variant p-2">
          {(
            [
              ["sales", "New sale", "Get notified on every successful payment"],
              ["payouts", "Payouts", "When money is sent to your account"],
              [
                "weekly",
                "Weekly summary",
                `A digest of your earnings sent to ${profile.email}`,
              ],
              [
                "marketing",
                "Product updates",
                "New CreatorByte features and tips",
              ],
            ] as [keyof typeof notif, string, string][]
          ).map(([key, label, desc]) => (
            <label
              key={key}
              className="flex cursor-pointer items-center justify-between gap-3 px-4 py-4"
            >
              <span>
                <span className="block text-sm font-semibold text-on-surface">
                  {label}
                </span>
                <span className="block text-xs text-on-surface-variant">
                  {desc}
                </span>
              </span>
              <MdSwitch
                selected={notif[key] || undefined}
                onChange={(e: React.FormEvent<HTMLInputElement>) =>
                  setNotif((n) => ({
                    ...n,
                    [key]: (e.target as HTMLInputElement & {
                      selected: boolean;
                    }).selected,
                  }))
                }
              />
            </label>
          ))}
        </section>
      )}
    </div>
  );
}
