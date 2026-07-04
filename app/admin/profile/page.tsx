"use client";

import { useState } from "react";
import { useMounted } from "@/lib/hooks/useMounted";
import { PageHeader } from "@/components/shared/PageHeader";
import { Avatar } from "@/components/shared/Avatar";
import {
  MdFilledButton,
  MdIcon,
  MdOutlinedTextField,
  MdSwitch,
} from "@/components/md";

export default function SuperAdminProfilePage() {
  const mounted = useMounted();
  const [admin, setAdmin] = useState({
    name: "Meehul Thakkar",
    email: "financewithmehul@gmail.com",
    twoFactor: true,
    alerts: true,
  });
  const [saved, setSaved] = useState(false);

  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Super Admin Profile"
        subtitle="Platform owner account and security"
      />

      <div className="space-y-6">
        <section className="cb-card p-6">
          <div className="flex items-center gap-4">
            <Avatar name={admin.name} color="#c79af2" size={64} />
            <div>
              <h2 className="font-display text-lg font-semibold text-on-surface">
                {admin.name}
              </h2>
              <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-on-secondary">
                <MdIcon style={{ fontSize: 14 }}>shield_person</MdIcon>
                Super Admin
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <MdOutlinedTextField
              label="Full name"
              value={admin.name}
              onInput={(e: React.FormEvent<HTMLInputElement>) =>
                setAdmin((a) => ({
                  ...a,
                  name: (e.target as HTMLInputElement).value,
                }))
              }
            />
            <MdOutlinedTextField
              label="Email"
              type="email"
              value={admin.email}
              onInput={(e: React.FormEvent<HTMLInputElement>) =>
                setAdmin((a) => ({
                  ...a,
                  email: (e.target as HTMLInputElement).value,
                }))
              }
            />
          </div>
        </section>

        <section className="cb-card divide-y divide-outline-variant p-2">
          <label className="flex cursor-pointer items-center justify-between gap-3 px-4 py-4">
            <span>
              <span className="block text-sm font-semibold text-on-surface">
                Two-factor authentication
              </span>
              <span className="block text-xs text-on-surface-variant">
                Require a code in addition to your password
              </span>
            </span>
            <MdSwitch
              selected={admin.twoFactor || undefined}
              onChange={(e: React.FormEvent<HTMLInputElement>) =>
                setAdmin((a) => ({
                  ...a,
                  twoFactor: (e.target as HTMLInputElement & {
                    selected: boolean;
                  }).selected,
                }))
              }
            />
          </label>
          <label className="flex cursor-pointer items-center justify-between gap-3 px-4 py-4">
            <span>
              <span className="block text-sm font-semibold text-on-surface">
                Platform alerts
              </span>
              <span className="block text-xs text-on-surface-variant">
                High-value sales, suspensions and payout issues
              </span>
            </span>
            <MdSwitch
              selected={admin.alerts || undefined}
              onChange={(e: React.FormEvent<HTMLInputElement>) =>
                setAdmin((a) => ({
                  ...a,
                  alerts: (e.target as HTMLInputElement & {
                    selected: boolean;
                  }).selected,
                }))
              }
            />
          </label>
        </section>

        <div className="flex justify-end">
          <MdFilledButton
            onClick={() => {
              setSaved(true);
              setTimeout(() => setSaved(false), 2000);
            }}
          >
            {saved ? (
              <>
                <MdIcon slot="icon">check</MdIcon>
                Saved
              </>
            ) : (
              "Save changes"
            )}
          </MdFilledButton>
        </div>
      </div>
    </div>
  );
}
