"use client";

import { useState } from "react";
import { useProfileStore } from "@/lib/store/profileStore";
import { Avatar } from "@/components/shared/Avatar";
import {
  MdFilledButton,
  MdIcon,
  MdOutlinedTextField,
} from "@/components/md";

const AVATAR_COLORS = [
  "#72a4f2",
  "#f2a172",
  "#8ad19a",
  "#c79af2",
  "#f28ab5",
  "#f2d072",
];

export function ProfileForm() {
  const { profile, update, updateSocials } = useProfileStore();
  const [saved, setSaved] = useState(false);

  function onSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Basic information */}
      <section className="cb-card p-6">
        <h2 className="mb-1 flex items-center gap-2 font-display text-lg font-semibold text-on-surface">
          Basic information
          <MdIcon className="text-on-surface-variant" style={{ fontSize: 18 }}>
            info
          </MdIcon>
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <MdOutlinedTextField
            label="First name"
            value={profile.firstName}
            onInput={(e: React.FormEvent<HTMLInputElement>) =>
              update({ firstName: (e.target as HTMLInputElement).value })
            }
          />
          <MdOutlinedTextField
            label="Last name"
            value={profile.lastName}
            onInput={(e: React.FormEvent<HTMLInputElement>) =>
              update({ lastName: (e.target as HTMLInputElement).value })
            }
          />
        </div>
      </section>

      {/* About me */}
      <section className="cb-card p-6">
        <h2 className="mb-1 flex items-center gap-2 font-display text-lg font-semibold text-on-surface">
          About me info
          <MdIcon className="text-on-surface-variant" style={{ fontSize: 18 }}>
            info
          </MdIcon>
        </h2>
        <p className="text-sm text-on-surface-variant">
          This is the default &lsquo;About me&rsquo; info we show as a card on
          all your products. Talk about yourself and link your social accounts.
        </p>

        <div className="mt-5 flex items-center gap-4">
          <Avatar
            name={profile.displayName}
            color={profile.avatarColor}
            size={64}
          />
          <div>
            <p className="mb-1.5 text-sm font-semibold text-on-surface">
              Avatar color
            </p>
            <div className="flex gap-2">
              {AVATAR_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={`Avatar color ${c}`}
                  onClick={() => update({ avatarColor: c })}
                  className="h-7 w-7 rounded-full border-2 transition-transform hover:scale-110"
                  style={{
                    background: c,
                    borderColor:
                      profile.avatarColor === c
                        ? "var(--md-sys-color-on-surface)"
                        : "transparent",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <MdOutlinedTextField
            label="Name"
            value={profile.displayName}
            style={{ width: "100%" }}
            onInput={(e: React.FormEvent<HTMLInputElement>) =>
              update({ displayName: (e.target as HTMLInputElement).value })
            }
          />
          <MdOutlinedTextField
            label="Headline"
            value={profile.headline}
            placeholder="e.g. SEBI registered research • 11+ years"
            style={{ width: "100%" }}
            onInput={(e: React.FormEvent<HTMLInputElement>) =>
              update({ headline: (e.target as HTMLInputElement).value })
            }
          />
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-on-surface">
              Bio
            </label>
            <textarea
              value={profile.bio}
              rows={4}
              onChange={(e) => update({ bio: e.target.value })}
              className="w-full resize-y rounded-2xl border border-outline bg-surface-lowest px-4 py-3 text-sm text-on-surface outline-none transition-colors focus:border-primary"
            />
          </div>
        </div>
      </section>

      {/* Socials */}
      <section className="cb-card p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-on-surface">
          Social accounts
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <MdOutlinedTextField
            label="Instagram"
            prefixText="@"
            value={profile.socials.instagram ?? ""}
            onInput={(e: React.FormEvent<HTMLInputElement>) =>
              updateSocials({ instagram: (e.target as HTMLInputElement).value })
            }
          />
          <MdOutlinedTextField
            label="YouTube"
            value={profile.socials.youtube ?? ""}
            onInput={(e: React.FormEvent<HTMLInputElement>) =>
              updateSocials({ youtube: (e.target as HTMLInputElement).value })
            }
          />
          <MdOutlinedTextField
            label="X (Twitter)"
            prefixText="@"
            value={profile.socials.x ?? ""}
            onInput={(e: React.FormEvent<HTMLInputElement>) =>
              updateSocials({ x: (e.target as HTMLInputElement).value })
            }
          />
          <MdOutlinedTextField
            label="Website"
            value={profile.socials.website ?? ""}
            onInput={(e: React.FormEvent<HTMLInputElement>) =>
              updateSocials({ website: (e.target as HTMLInputElement).value })
            }
          />
        </div>
      </section>

      <div className="flex justify-end">
        <MdFilledButton onClick={onSave}>
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
  );
}
