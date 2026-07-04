"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { OptionalSections, PaymentPage } from "@/lib/types";
import { usePagesStore } from "@/lib/store/pagesStore";
import { cn, discountPercent, slugify } from "@/lib/utils";
import { LivePreview } from "./LivePreview";
import { FileDropzone } from "@/components/shared/FileDropzone";
import {
  MdFilledButton,
  MdIcon,
  MdIconButton,
  MdOutlinedButton,
  MdOutlinedTextField,
  MdSwitch,
  MdCheckbox,
} from "@/components/md";

type TabKey = "page" | "payment" | "advanced";

const tabs: { key: TabKey; label: string }[] = [
  { key: "page", label: "Page Details" },
  { key: "payment", label: "Payment Page Details" },
  { key: "advanced", label: "Advanced Settings" },
];

const sectionMeta: { key: keyof OptionalSections; label: string; icon: string }[] =
  [
    { key: "gallery", label: "Gallery", icon: "photo_library" },
    { key: "testimonials", label: "Testimonials", icon: "format_quote" },
    { key: "faq", label: "FAQ", icon: "help" },
    { key: "aboutMe", label: "About Me", icon: "person" },
    { key: "showcase", label: "Showcase Products", icon: "storefront" },
  ];

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-on-surface">
        {label} {required && <span className="text-error">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-on-surface-variant">{hint}</p>}
    </div>
  );
}

export function PaymentPageEditor({ initial }: { initial: PaymentPage }) {
  const router = useRouter();
  const upsert = usePagesStore((s) => s.upsert);
  const [draft, setDraft] = useState<PaymentPage>(initial);
  const [tab, setTab] = useState<TabKey>("page");
  const [linkInput, setLinkInput] = useState("");
  const coverRef = useRef<HTMLInputElement>(null);
  const isNew = !usePagesStore((s) => s.pages.some((p) => p.id === initial.id));

  function patch(p: Partial<PaymentPage>) {
    setDraft((d) => ({ ...d, ...p }));
  }

  function publish(status: PaymentPage["status"]) {
    upsert({ ...draft, status });
    router.push("/payments");
  }

  const off = discountPercent(draft.price, draft.discountedPrice);

  return (
    <div className="grid min-h-[calc(100vh-8rem)] grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      {/* ============ FORM SIDE ============ */}
      <div>
        {/* header */}
        <div className="mb-4 flex items-center gap-3">
          <MdIconButton aria-label="Close" onClick={() => router.push("/payments")}>
            <MdIcon>close</MdIcon>
          </MdIconButton>
          <span className="h-5 w-px bg-outline-variant" />
          <h1 className="truncate font-display text-lg font-semibold text-on-surface">
            {draft.title || "New Payment Page"}
          </h1>
        </div>

        {/* tabs */}
        <div className="mb-6 flex gap-1 overflow-x-auto border-b border-outline-variant">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cn(
                "relative whitespace-nowrap px-4 py-3 text-sm font-semibold transition-colors duration-200",
                tab === t.key
                  ? "text-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              )}
            >
              {t.label}
              <span
                className={cn(
                  "absolute inset-x-3 bottom-0 h-[3px] rounded-t-full bg-primary transition-transform duration-300",
                  tab === t.key ? "scale-x-100" : "scale-x-0"
                )}
                style={{ transitionTimingFunction: "var(--cb-ease-emphasized)" }}
              />
            </button>
          ))}
        </div>

        {/* ---------- TAB: PAGE DETAILS ---------- */}
        {tab === "page" && (
          <div className="space-y-6">
            <h2 className="font-display text-base font-semibold text-on-surface">
              Tell us about your Payment Page
            </h2>

            <Field label="Payment Page Title" required>
              <MdOutlinedTextField
                value={draft.title}
                maxLength={75}
                placeholder="e.g. Learn Photoshop Editing and Canva"
                style={{ width: "100%" }}
                onInput={(e: React.FormEvent<HTMLInputElement>) => {
                  const title = (e.target as HTMLInputElement).value;
                  patch({ title, slug: slugify(title) });
                }}
                supportingText={`${draft.title.length}/75`}
              />
            </Field>

            <Field label="Cover Image" required>
              {draft.coverImage ? (
                <div className="flex items-center gap-3 rounded-2xl border border-outline-variant bg-surface-lowest p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={draft.coverImage}
                    alt="Cover"
                    className="h-14 w-14 rounded-xl object-cover"
                  />
                  <p className="flex-1 truncate text-sm text-on-surface">
                    Cover image
                  </p>
                  <MdIconButton
                    aria-label="Remove cover"
                    onClick={() => patch({ coverImage: "" })}
                  >
                    <MdIcon>delete</MdIcon>
                  </MdIconButton>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => coverRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-outline-variant bg-surface-low px-4 py-6 text-sm font-medium text-on-surface-variant transition-colors hover:border-primary/60"
                >
                  <MdIcon>add_photo_alternate</MdIcon>
                  Upload cover image
                </button>
              )}
              <input
                ref={coverRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) patch({ coverImage: URL.createObjectURL(f) });
                  e.target.value = "";
                }}
              />
            </Field>

            <Field label="Description" required>
              <textarea
                value={draft.description}
                onChange={(e) => patch({ description: e.target.value })}
                rows={6}
                placeholder="What will buyers learn or get?"
                className="w-full resize-y rounded-2xl border border-outline bg-surface-lowest px-4 py-3 text-sm text-on-surface outline-none transition-colors focus:border-primary"
              />
            </Field>

            <Field label="Button Text" required>
              <MdOutlinedTextField
                value={draft.buttonText}
                maxLength={25}
                style={{ width: "100%" }}
                onInput={(e: React.FormEvent<HTMLInputElement>) =>
                  patch({ buttonText: (e.target as HTMLInputElement).value })
                }
                supportingText={`${draft.buttonText.length}/25`}
              />
            </Field>

            <div>
              <h3 className="mb-3 font-display text-base font-semibold text-on-surface">
                Optional Sections
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {sectionMeta.map((s) => {
                  const active = draft.sections[s.key];
                  return (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() =>
                        patch({
                          sections: { ...draft.sections, [s.key]: !active },
                        })
                      }
                      className={cn(
                        "flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200",
                        active
                          ? "border-primary bg-primary-container text-on-primary-container"
                          : "border-outline-variant bg-surface-lowest text-on-surface-variant hover:bg-surface-high"
                      )}
                    >
                      <MdIcon style={{ fontSize: 20 }}>{s.icon}</MdIcon>
                      {s.label}
                      {active && (
                        <MdIcon style={{ fontSize: 18, marginLeft: "auto" }}>
                          check_circle
                        </MdIcon>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ---------- TAB: PAYMENT PAGE DETAILS ---------- */}
        {tab === "payment" && (
          <div className="space-y-6">
            <div>
              <h2 className="mb-3 font-display text-base font-semibold text-on-surface">
                Upload your digital files
              </h2>
              <FileDropzone
                files={draft.files}
                onChange={(files) => patch({ files })}
              />
              <div className="my-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                <span className="h-px flex-1 bg-outline-variant" /> or{" "}
                <span className="h-px flex-1 bg-outline-variant" />
              </div>
              <div className="flex gap-2">
                <MdOutlinedTextField
                  placeholder="Add resource link"
                  value={linkInput}
                  style={{ flex: 1 }}
                  onInput={(e: React.FormEvent<HTMLInputElement>) =>
                    setLinkInput((e.target as HTMLInputElement).value)
                  }
                />
                <MdOutlinedButton
                  onClick={() => {
                    if (!linkInput.trim()) return;
                    patch({
                      resourceLinks: [...draft.resourceLinks, linkInput.trim()],
                    });
                    setLinkInput("");
                  }}
                >
                  Add
                </MdOutlinedButton>
              </div>
              {draft.resourceLinks.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {draft.resourceLinks.map((l, i) => (
                    <li
                      key={`${l}-${i}`}
                      className="flex items-center gap-3 rounded-2xl border border-outline-variant bg-surface-lowest px-3 py-2"
                    >
                      <MdIcon style={{ fontSize: 18 }}>link</MdIcon>
                      <span className="flex-1 truncate text-sm text-on-surface">
                        {l}
                      </span>
                      <MdIconButton
                        aria-label="Remove link"
                        onClick={() =>
                          patch({
                            resourceLinks: draft.resourceLinks.filter(
                              (_, j) => j !== i
                            ),
                          })
                        }
                      >
                        <MdIcon>close</MdIcon>
                      </MdIconButton>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="h-px bg-outline-variant" />

            <div>
              <h2 className="mb-3 font-display text-base font-semibold text-on-surface">
                Pricing
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {(
                  [
                    {
                      key: "fixed",
                      title: "Fixed Price",
                      desc: "Charge a one-time fixed pay",
                    },
                    {
                      key: "flexible",
                      title: "Customers decide price",
                      desc: "Let customers pay any price",
                    },
                  ] as const
                ).map((o) => {
                  const active = draft.priceType === o.key;
                  return (
                    <button
                      key={o.key}
                      type="button"
                      onClick={() => patch({ priceType: o.key })}
                      className={cn(
                        "flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition-all duration-200",
                        active
                          ? "border-primary bg-primary-container/40"
                          : "border-outline-variant bg-surface-lowest hover:bg-surface-high"
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors",
                          active ? "border-primary bg-primary" : "border-outline"
                        )}
                      >
                        {active && (
                          <MdIcon style={{ fontSize: 14, color: "var(--md-sys-color-on-primary)" }}>
                            check
                          </MdIcon>
                        )}
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-on-surface">
                          {o.title}
                        </span>
                        <span className="block text-xs text-on-surface-variant">
                          {o.desc}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 space-y-4">
                <Field
                  label={draft.priceType === "flexible" ? "Minimum Price" : "Price"}
                  required
                >
                  <MdOutlinedTextField
                    type="number"
                    value={String(draft.price || "")}
                    prefixText="₹ "
                    style={{ width: "100%" }}
                    onInput={(e: React.FormEvent<HTMLInputElement>) =>
                      patch({
                        price: Number((e.target as HTMLInputElement).value) || 0,
                      })
                    }
                  />
                </Field>

                {draft.priceType === "fixed" && (
                  <>
                    <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-on-surface">
                      <MdCheckbox
                        checked={draft.discountEnabled || undefined}
                        onChange={(e: React.FormEvent<HTMLInputElement>) =>
                          patch({
                            discountEnabled: (e.target as HTMLInputElement)
                              .checked,
                          })
                        }
                      />
                      Offer discounted price
                    </label>

                    {draft.discountEnabled && (
                      <Field label="Discounted price" required>
                        <MdOutlinedTextField
                          type="number"
                          value={String(draft.discountedPrice ?? "")}
                          prefixText="₹ "
                          style={{ width: "100%" }}
                          onInput={(e: React.FormEvent<HTMLInputElement>) =>
                            patch({
                              discountedPrice:
                                Number((e.target as HTMLInputElement).value) ||
                                undefined,
                            })
                          }
                          supportingText={
                            off > 0
                              ? `₹ ${draft.discountedPrice} instead of ₹ ${draft.price} (${off}% off)`
                              : undefined
                          }
                        />
                      </Field>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ---------- TAB: ADVANCED ---------- */}
        {tab === "advanced" && (
          <div className="space-y-5">
            <h2 className="font-display text-base font-semibold text-on-surface">
              Advanced Settings
            </h2>

            <Field
              label="Page link"
              hint="Your page will be live at this address"
            >
              <MdOutlinedTextField
                value={draft.slug}
                prefixText="creatorbyte.in/p/"
                style={{ width: "100%" }}
                onInput={(e: React.FormEvent<HTMLInputElement>) =>
                  patch({ slug: slugify((e.target as HTMLInputElement).value) })
                }
              />
            </Field>

            <Field
              label="Redirect after purchase"
              hint="Send buyers to a custom URL after successful payment"
            >
              <MdOutlinedTextField
                value={draft.redirectUrl ?? ""}
                placeholder="https://"
                style={{ width: "100%" }}
                onInput={(e: React.FormEvent<HTMLInputElement>) =>
                  patch({ redirectUrl: (e.target as HTMLInputElement).value })
                }
              />
            </Field>

            <div className="space-y-4 rounded-2xl border border-outline-variant bg-surface-lowest p-4">
              <label className="flex cursor-pointer items-center justify-between gap-3">
                <span>
                  <span className="block text-sm font-semibold text-on-surface">
                    Accept payments
                  </span>
                  <span className="block text-xs text-on-surface-variant">
                    Turn off to pause new purchases
                  </span>
                </span>
                <MdSwitch
                  selected={draft.paymentsEnabled || undefined}
                  onChange={(e: React.FormEvent<HTMLInputElement>) =>
                    patch({
                      paymentsEnabled: (e.target as HTMLInputElement & {
                        selected: boolean;
                      }).selected,
                    })
                  }
                />
              </label>

              <div className="h-px bg-outline-variant" />

              <label className="flex cursor-pointer items-center justify-between gap-3">
                <span>
                  <span className="block text-sm font-semibold text-on-surface">
                    Collect phone number
                  </span>
                  <span className="block text-xs text-on-surface-variant">
                    Require buyer&apos;s phone at checkout
                  </span>
                </span>
                <MdSwitch
                  selected={draft.collectPhone || undefined}
                  onChange={(e: React.FormEvent<HTMLInputElement>) =>
                    patch({
                      collectPhone: (e.target as HTMLInputElement & {
                        selected: boolean;
                      }).selected,
                    })
                  }
                />
              </label>

              <div className="h-px bg-outline-variant" />

              <label className="flex cursor-pointer items-center justify-between gap-3">
                <span>
                  <span className="block text-sm font-semibold text-on-surface">
                    Limit quantity
                  </span>
                  <span className="block text-xs text-on-surface-variant">
                    Cap the total number of sales
                  </span>
                </span>
                <MdSwitch
                  selected={draft.limitQuantity || undefined}
                  onChange={(e: React.FormEvent<HTMLInputElement>) =>
                    patch({
                      limitQuantity: (e.target as HTMLInputElement & {
                        selected: boolean;
                      }).selected,
                    })
                  }
                />
              </label>

              {draft.limitQuantity && (
                <MdOutlinedTextField
                  type="number"
                  label="Maximum sales"
                  value={String(draft.quantity ?? "")}
                  style={{ width: "100%" }}
                  onInput={(e: React.FormEvent<HTMLInputElement>) =>
                    patch({
                      quantity:
                        Number((e.target as HTMLInputElement).value) ||
                        undefined,
                    })
                  }
                />
              )}
            </div>
          </div>
        )}

        {/* footer actions */}
        <div className="sticky bottom-0 mt-8 flex items-center justify-end gap-3 border-t border-outline-variant bg-background/90 py-4 backdrop-blur">
          <MdOutlinedButton onClick={() => publish("draft")}>
            Save Draft
          </MdOutlinedButton>
          <MdFilledButton
            disabled={!draft.title || !draft.price ? true : undefined}
            onClick={() => publish("published")}
          >
            {isNew ? "Publish" : "Publish Changes"}
          </MdFilledButton>
        </div>
      </div>

      {/* ============ PREVIEW SIDE ============ */}
      <div className="rounded-3xl bg-surface-high/60 p-4 lg:p-6">
        <LivePreview page={draft} />
      </div>
    </div>
  );
}
