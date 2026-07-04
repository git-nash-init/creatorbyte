"use client";

import { useState } from "react";
import type { LockedContent } from "@/lib/types";
import { cn, formatINR } from "@/lib/utils";
import { DeviceToggle, type Device } from "@/components/shared/DeviceToggle";
import { useProfileStore } from "@/lib/store/profileStore";
import { Avatar } from "@/components/shared/Avatar";
import { MdIcon } from "@/components/md";

/** Buyer-facing locked content view — blurred content behind an unlock card. */
export function LockedBuyerView({
  item,
  mobile,
  unlocked = false,
}: {
  item: LockedContent;
  mobile: boolean;
  unlocked?: boolean;
}) {
  const profile = useProfileStore((s) => s.profile);

  return (
    <div
      className="relative min-h-full overflow-hidden"
      style={{
        background:
          "radial-gradient(1200px 500px at 80% -10%, #3d5f96 0%, transparent 55%), linear-gradient(165deg, #202020 0%, #1b2a4a 60%, #2f3f66 100%)",
      }}
    >
      {/* decorative stars */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-60">
        {[...Array(18)].map((_, i) => (
          <span
            key={i}
            className="absolute h-[2px] w-[2px] rounded-full bg-white/70"
            style={{
              left: `${(i * 53) % 100}%`,
              top: `${(i * 37) % 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Avatar name={profile.displayName} color={profile.avatarColor} size={22} />
          <span className="text-[11px] font-medium text-white/90">
            {profile.displayName}
          </span>
        </div>
        <span className="rounded-md bg-white/10 px-2 py-1 text-[9px] font-medium text-white/80">
          Built with ⚡ on CreatorByte
        </span>
      </div>

      <div
        className={cn(
          "relative px-4 pb-8 pt-2",
          mobile ? "" : "mx-auto max-w-md"
        )}
      >
        <div className="overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm">
          {/* content area (blurred when locked) */}
          <div className="relative p-4">
            <div className={cn(!unlocked && "select-none blur-md")}>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/90">
                {item.body ||
                  "Your premium content preview appears here. Only paying visitors can read it."}
              </p>
              {item.media.length > 0 && (
                <div className="mt-3 space-y-2">
                  {item.media.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs text-white/80"
                    >
                      <MdIcon style={{ fontSize: 16 }}>
                        {m.kind === "image"
                          ? "image"
                          : m.kind === "video"
                            ? "movie"
                            : "description"}
                      </MdIcon>
                      {m.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {!unlocked && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white">
                  <MdIcon style={{ fontSize: 26 }}>lock</MdIcon>
                </span>
                <p className="text-xs font-medium text-white/80">
                  This content is locked
                </p>
              </div>
            )}
          </div>
        </div>

        {/* unlock card */}
        <div className="mt-4 rounded-2xl bg-white p-4 shadow-xl">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
                {item.category || "Content"}
              </p>
              <h2 className="mt-0.5 font-display text-base font-semibold text-neutral-900">
                {item.title || "Your content title"}
              </h2>
            </div>
            <span className="shrink-0 rounded-full bg-[#eef4ff] px-3 py-1 text-sm font-bold text-[#2f6be0]">
              {formatINR(item.unlockPrice || 0)}
            </span>
          </div>

          {item.collectEmail && (
            <>
              <label className="mt-3 block text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
                Email address
              </label>
              <div className="mt-1 rounded-lg border border-neutral-200 px-3 py-2 text-xs text-neutral-500">
                you@example.com
              </div>
            </>
          )}
          {item.collectPhone && (
            <>
              <label className="mt-2 block text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
                Phone number
              </label>
              <div className="mt-1 rounded-lg border border-neutral-200 px-3 py-2 text-xs text-neutral-500">
                +91 90000 00000
              </div>
            </>
          )}

          <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#202020] px-4 py-2.5 text-xs font-semibold text-white">
            <MdIcon style={{ fontSize: 16 }}>lock_open</MdIcon>
            Unlock for {formatINR(item.unlockPrice || 0)}
          </button>
          <p className="mt-2 text-center text-[10px] text-neutral-400">
            Instant access after payment · Secure checkout
          </p>
        </div>
      </div>
    </div>
  );
}

export function LockedPreview({ item }: { item: LockedContent }) {
  const [device, setDevice] = useState<Device>("desktop");
  const [unlocked, setUnlocked] = useState(false);
  const mobile = device === "mobile";

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg font-semibold text-on-surface">
          Preview
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setUnlocked((u) => !u)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors duration-200",
              unlocked
                ? "border-primary bg-primary-container text-on-primary-container"
                : "border-outline-variant bg-surface-lowest text-on-surface-variant hover:bg-surface-high"
            )}
          >
            {unlocked ? "Unlocked view" : "Locked view"}
          </button>
          <DeviceToggle value={device} onChange={setDevice} />
        </div>
      </div>

      <div className="flex flex-1 items-start justify-center">
        <div
          className={cn(
            "overflow-hidden bg-[#111] shadow-2xl transition-all duration-500",
            mobile
              ? "w-[300px] rounded-[36px] border-[6px] border-[#111]"
              : "w-full max-w-[720px] rounded-2xl border-[8px] border-[#111]"
          )}
          style={{ transitionTimingFunction: "var(--cb-ease-emphasized)" }}
        >
          {mobile ? (
            <div className="flex items-center justify-center bg-[#111] py-1.5">
              <span className="h-1 w-16 rounded-full bg-white/25" />
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-[#111] px-3 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="mx-auto rounded-md bg-white/10 px-8 py-0.5 text-[9px] text-white/60">
                creatorbyte.in/l/{item.slug || "your-content"}
              </span>
            </div>
          )}
          <div
            className={cn(
              "overflow-y-auto",
              mobile ? "h-[520px]" : "h-[460px]"
            )}
          >
            <LockedBuyerView item={item} mobile={mobile} unlocked={unlocked} />
          </div>
        </div>
      </div>
    </div>
  );
}
