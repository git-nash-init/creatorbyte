"use client";

import { useState } from "react";
import type { PaymentPage } from "@/lib/types";
import { formatBytes, formatINR } from "@/lib/utils";
import { DeviceToggle, type Device } from "@/components/shared/DeviceToggle";
import { CoverThumb } from "@/components/shared/CoverThumb";
import { useProfileStore } from "@/lib/store/profileStore";
import { Avatar } from "@/components/shared/Avatar";
import { MdIcon } from "@/components/md";
import { cn } from "@/lib/utils";

/** Buyer-facing page content — rendered inside desktop/mobile frames. */
function BuyerPage({ page, mobile }: { page: PaymentPage; mobile: boolean }) {
  const profile = useProfileStore((s) => s.profile);
  const hasDiscount =
    page.priceType === "fixed" && page.discountEnabled && !!page.discountedPrice;
  const paid = hasDiscount ? page.discountedPrice! : page.price;
  const totalSize = page.files.reduce((a, f) => a + f.size, 0);

  const checkout = (
    <div className="rounded-2xl bg-white p-4 shadow-lg">
      <p className="text-[11px] font-medium text-neutral-500">
        Access to this purchase will be sent to this email
      </p>
      <label className="mt-2 block text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
        Email Address
      </label>
      <div className="mt-1 rounded-lg border border-neutral-200 px-3 py-2 text-xs text-neutral-600">
        you@example.com
      </div>
      <label className="mt-2 block text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
        Phone number{page.collectPhone ? " *" : ""}
      </label>
      <div className="mt-1 flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-xs text-neutral-600">
        <span className="text-neutral-400">+91</span> 90000 00000
      </div>

      {page.priceType === "flexible" ? (
        <>
          <label className="mt-3 block text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
            Pay what feels right (min {formatINR(page.price)})
          </label>
          <div className="mt-1 rounded-lg border border-neutral-200 px-3 py-2 text-xs text-neutral-600">
            {formatINR(page.price)}
          </div>
        </>
      ) : (
        <div className="mt-3 space-y-1 border-t border-neutral-100 pt-3 text-xs">
          <div className="flex justify-between text-neutral-500">
            <span>Sub Total</span>
            <span>
              {formatINR(paid)}{" "}
              {hasDiscount && (
                <span className="text-neutral-400 line-through">
                  {formatINR(page.price)}
                </span>
              )}
            </span>
          </div>
          <div className="flex justify-between font-semibold text-neutral-900">
            <span>Total</span>
            <span>{formatINR(paid)}</span>
          </div>
        </div>
      )}

      <button className="mt-3 flex w-full items-center justify-between rounded-lg bg-[#202020] px-4 py-2.5 text-xs font-semibold text-white">
        {page.buttonText || "Get it now"}
        <span aria-hidden>→</span>
      </button>
    </div>
  );

  return (
    <div
      className="min-h-full"
      style={{
        background: "linear-gradient(160deg,#2f6be0 0%,#4a7ee8 40%,#72a4f2 100%)",
      }}
    >
      {/* top bar */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Avatar name={profile.displayName} color={profile.avatarColor} size={22} />
          <span className="text-[11px] font-medium text-white/90">
            {profile.displayName}
          </span>
        </div>
        <span className="rounded-md bg-white/15 px-2 py-1 text-[9px] font-medium text-white/90">
          Built with ⚡ on CreatorByte
        </span>
      </div>

      <div className={cn("px-4 pb-6", mobile ? "" : "mx-auto max-w-3xl")}>
        <div
          className={cn(
            "rounded-2xl bg-white p-4",
            mobile ? "space-y-4" : "grid grid-cols-[1.4fr_1fr] gap-4"
          )}
        >
          <div>
            {(page.coverImage || page.title) && (
              <CoverThumb
                src={page.coverImage}
                title={page.title || "Untitled"}
                className="h-40 w-full rounded-xl"
              />
            )}
            <h2 className="mt-3 font-display text-xl font-semibold text-neutral-900">
              {page.title || "Your page title"}
            </h2>

            <p className="mt-3 text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
              About the page
            </p>
            <p className="mt-1 whitespace-pre-wrap text-xs leading-relaxed text-neutral-600">
              {page.description || "Describe what buyers will get…"}
            </p>

            <p className="mt-4 text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
              What you&apos;ll get
            </p>
            <div className="mt-1 divide-y divide-neutral-100 rounded-xl border border-neutral-200 text-xs">
              <div className="flex justify-between px-3 py-2">
                <span className="text-neutral-500">Number of resources</span>
                <span className="font-medium text-neutral-800">
                  {page.files.length + page.resourceLinks.length}
                </span>
              </div>
              <div className="flex justify-between px-3 py-2">
                <span className="text-neutral-500">Resource content</span>
                <span className="font-medium capitalize text-neutral-800">
                  {page.files[0]?.kind ?? (page.resourceLinks.length ? "Link" : "—")}
                </span>
              </div>
              <div className="flex justify-between px-3 py-2">
                <span className="text-neutral-500">Total file size</span>
                <span className="font-medium text-neutral-800">
                  {totalSize ? formatBytes(totalSize) : "—"}
                </span>
              </div>
            </div>

            {page.sections.faq && (
              <>
                <p className="mt-4 text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
                  FAQ
                </p>
                <div className="mt-1 rounded-xl border border-neutral-200 px-3 py-2 text-xs text-neutral-600">
                  How do I get access? — Instantly by email after payment.
                </div>
              </>
            )}
            {page.sections.testimonials && (
              <>
                <p className="mt-4 text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
                  Testimonials
                </p>
                <div className="mt-1 rounded-xl border border-neutral-200 px-3 py-2 text-xs italic text-neutral-600">
                  “Absolutely worth it!” — A happy customer
                </div>
              </>
            )}
            {page.sections.aboutMe && (
              <>
                <p className="mt-4 text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
                  Contact me for any issues or queries
                </p>
                <div className="mt-1 flex items-center gap-2 rounded-xl border border-neutral-200 px-3 py-2">
                  <Avatar
                    name={profile.displayName}
                    color={profile.avatarColor}
                    size={24}
                  />
                  <div>
                    <p className="text-xs font-semibold text-neutral-800">
                      {profile.displayName}
                    </p>
                    <p className="text-[10px] text-neutral-500">
                      {profile.headline}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className={mobile ? "" : "self-start"}>
            {checkout}
            <div className="mt-3 rounded-xl border border-neutral-200 bg-white p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
                Invite your network
              </p>
              <button className="mt-1.5 flex w-full items-center justify-center gap-1.5 rounded-lg border border-neutral-200 py-2 text-[11px] font-medium text-neutral-700">
                <MdIcon style={{ fontSize: 14 }}>link</MdIcon> Copy link
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LivePreview({ page }: { page: PaymentPage }) {
  const [device, setDevice] = useState<Device>("desktop");
  const mobile = device === "mobile";

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-on-surface">
          Preview
        </h2>
        <DeviceToggle value={device} onChange={setDevice} />
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
          {/* frame chrome */}
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
                creatorbyte.in/p
              </span>
            </div>
          )}
          <div
            className={cn(
              "overflow-y-auto bg-white",
              mobile ? "h-[520px]" : "h-[460px]"
            )}
          >
            <BuyerPage page={page} mobile={mobile} />
          </div>
        </div>
      </div>
    </div>
  );
}
