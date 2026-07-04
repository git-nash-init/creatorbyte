"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { LockedContent, UploadedFile } from "@/lib/types";
import { useLockedStore } from "@/lib/store/lockedStore";
import { CATEGORIES } from "@/lib/mock/data";
import { cn, slugify, uid } from "@/lib/utils";
import { LockedPreview } from "./LockedPreview";
import { formatBytes } from "@/lib/utils";
import {
  MdFilledButton,
  MdIcon,
  MdIconButton,
  MdOutlinedButton,
  MdOutlinedTextField,
  MdSwitch,
} from "@/components/md";

function kindFromType(type: string): UploadedFile["kind"] {
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  return "file";
}

export function LockedEditor({ initial }: { initial: LockedContent }) {
  const router = useRouter();
  const upsert = useLockedStore((s) => s.upsert);
  const isNew = !useLockedStore((s) => s.items.some((i) => i.id === initial.id));
  const [draft, setDraft] = useState<LockedContent>(initial);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const acceptRef = useRef<string>("*");

  function patch(p: Partial<LockedContent>) {
    setDraft((d) => ({ ...d, ...p }));
  }

  function pick(accept: string) {
    acceptRef.current = accept;
    if (fileRef.current) {
      fileRef.current.accept = accept;
      fileRef.current.click();
    }
  }

  function addFiles(list: FileList | null) {
    if (!list) return;
    const added: UploadedFile[] = Array.from(list).map((f) => ({
      id: uid("m"),
      name: f.name,
      size: f.size,
      kind: kindFromType(f.type),
      url:
        f.type.startsWith("image/") || f.type.startsWith("video/")
          ? URL.createObjectURL(f)
          : undefined,
    }));
    patch({ media: [...draft.media, ...added] });
  }

  function publish(status: LockedContent["status"]) {
    upsert({ ...draft, status });
    router.push("/locked");
  }

  const mediaButtons = [
    { icon: "image", label: "Image", accept: "image/*" },
    { icon: "smart_display", label: "Video", accept: "video/*" },
    { icon: "description", label: "File", accept: "*" },
  ];

  return (
    <div className="grid min-h-[calc(100vh-8rem)] grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      {/* ============ FORM SIDE ============ */}
      <div>
        <div className="mb-6 flex items-center gap-3">
          <MdIconButton aria-label="Exit" onClick={() => router.push("/locked")}>
            <MdIcon>arrow_back</MdIcon>
          </MdIconButton>
          <span className="h-5 w-px bg-outline-variant" />
          <h1 className="truncate font-display text-lg font-semibold text-on-surface">
            {isNew ? "Publish Content" : draft.title || "Edit Locked Content"}
          </h1>
        </div>

        <p className="mb-6 -mt-3 text-sm text-on-surface-variant">
          Give your content a title and a price to unlock. You can then publish
          and share it.
        </p>

        <div className="space-y-6">
          {/* content card */}
          <div className="cb-card p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-on-surface">
                Write or upload content you would like to sell
              </h2>
              <MdIcon
                className="text-on-surface-variant"
                style={{ fontSize: 18 }}
              >
                info
              </MdIcon>
            </div>

            <textarea
              value={draft.body}
              onChange={(e) => patch({ body: e.target.value })}
              rows={6}
              placeholder="Write your premium content here…"
              className="w-full resize-y rounded-2xl border border-outline bg-surface-lowest px-4 py-3 text-sm text-on-surface outline-none transition-colors focus:border-primary"
            />

            <div className="mt-3 grid grid-cols-3 gap-2">
              {mediaButtons.map((b) => (
                <button
                  key={b.label}
                  type="button"
                  onClick={() => pick(b.accept)}
                  className="flex items-center justify-center gap-2 rounded-full border border-outline-variant bg-surface-low px-3 py-2.5 text-sm font-medium text-primary transition-colors duration-200 hover:bg-primary-container/50"
                >
                  <MdIcon style={{ fontSize: 20 }}>{b.icon}</MdIcon>
                  {b.label}
                </button>
              ))}
              <input
                ref={fileRef}
                type="file"
                multiple
                hidden
                onChange={(e) => {
                  addFiles(e.target.files);
                  e.target.value = "";
                }}
              />
            </div>

            {draft.media.length > 0 && (
              <ul className="mt-3 space-y-2">
                {draft.media.map((m) => (
                  <li
                    key={m.id}
                    className="flex items-center gap-3 rounded-2xl border border-outline-variant bg-surface-lowest px-3 py-2"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-high text-on-surface-variant">
                      <MdIcon style={{ fontSize: 20 }}>
                        {m.kind === "image"
                          ? "image"
                          : m.kind === "video"
                            ? "movie"
                            : "description"}
                      </MdIcon>
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-on-surface">
                        {m.name}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        {formatBytes(m.size)}
                      </p>
                    </div>
                    <MdIconButton
                      aria-label={`Remove ${m.name}`}
                      onClick={() =>
                        patch({ media: draft.media.filter((x) => x.id !== m.id) })
                      }
                    >
                      <MdIcon>delete</MdIcon>
                    </MdIconButton>
                  </li>
                ))}
              </ul>
            )}

            <p className="mt-3 text-xs text-on-surface-variant">
              Whatever content you add in this box will only be accessible by
              visitors when they complete the payment.
            </p>
          </div>

          {/* title */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-on-surface">
              Give your content a Title <span className="text-error">*</span>
            </label>
            <MdOutlinedTextField
              value={draft.title}
              placeholder="e.g. Education and Algo Tool"
              style={{ width: "100%" }}
              onInput={(e: React.FormEvent<HTMLInputElement>) => {
                const title = (e.target as HTMLInputElement).value;
                patch({ title, slug: slugify(title) });
              }}
            />
          </div>

          {/* category */}
          <div className="relative">
            <label className="mb-1.5 block text-sm font-semibold text-on-surface">
              Category
            </label>
            <button
              type="button"
              onClick={() => setCatOpen((o) => !o)}
              className="flex w-full items-center justify-between rounded-2xl border border-outline bg-surface-lowest px-4 py-3.5 text-sm text-on-surface transition-colors hover:bg-surface-low"
            >
              {draft.category}
              <MdIcon
                style={{
                  fontSize: 20,
                  transition: "transform 200ms var(--cb-ease-standard)",
                  transform: catOpen ? "rotate(180deg)" : undefined,
                }}
              >
                expand_more
              </MdIcon>
            </button>
            {catOpen && (
              <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-2xl border border-outline-variant bg-surface-lowest py-1 shadow-lg">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      patch({ category: c });
                      setCatOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-surface-high",
                      draft.category === c ? "text-primary" : "text-on-surface"
                    )}
                  >
                    {c}
                    {draft.category === c && (
                      <MdIcon style={{ fontSize: 18 }}>check</MdIcon>
                    )}
                  </button>
                ))}
              </div>
            )}
            <p className="mt-1 text-xs text-on-surface-variant">
              Select a category for your content
            </p>
          </div>

          {/* price */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-on-surface">
              Set an unlock price <span className="text-error">*</span>
            </label>
            <MdOutlinedTextField
              type="number"
              value={String(draft.unlockPrice || "")}
              prefixText="₹ "
              placeholder="10000"
              style={{ width: "100%" }}
              onInput={(e: React.FormEvent<HTMLInputElement>) =>
                patch({
                  unlockPrice: Number((e.target as HTMLInputElement).value) || 0,
                })
              }
              supportingText="Set a price visitors would pay to view this content"
            />
          </div>

          {/* advanced settings */}
          <div className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-lowest">
            <button
              type="button"
              onClick={() => setAdvancedOpen((o) => !o)}
              className="flex w-full items-center justify-between px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-on-surface-variant transition-colors hover:bg-surface-low"
            >
              Advanced Settings
              <MdIcon
                style={{
                  fontSize: 20,
                  transition: "transform 200ms var(--cb-ease-standard)",
                  transform: advancedOpen ? "rotate(180deg)" : undefined,
                }}
              >
                expand_more
              </MdIcon>
            </button>

            <div
              className={cn(
                "grid transition-all duration-300",
                advancedOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
              style={{ transitionTimingFunction: "var(--cb-ease-emphasized)" }}
            >
              <div className="overflow-hidden">
                <div className="space-y-4 border-t border-outline-variant px-4 py-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-on-surface">
                      Content link
                    </label>
                    <MdOutlinedTextField
                      value={draft.slug}
                      prefixText="creatorbyte.in/l/"
                      style={{ width: "100%" }}
                      onInput={(e: React.FormEvent<HTMLInputElement>) =>
                        patch({
                          slug: slugify((e.target as HTMLInputElement).value),
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-on-surface">
                      Success message
                    </label>
                    <MdOutlinedTextField
                      value={draft.successMessage ?? ""}
                      placeholder="Thanks for unlocking! Here's your content…"
                      style={{ width: "100%" }}
                      onInput={(e: React.FormEvent<HTMLInputElement>) =>
                        patch({
                          successMessage: (e.target as HTMLInputElement).value,
                        })
                      }
                    />
                  </div>

                  <label className="flex cursor-pointer items-center justify-between gap-3">
                    <span>
                      <span className="block text-sm font-semibold text-on-surface">
                        Collect email
                      </span>
                      <span className="block text-xs text-on-surface-variant">
                        Access link is sent to this email
                      </span>
                    </span>
                    <MdSwitch
                      selected={draft.collectEmail || undefined}
                      onChange={(e: React.FormEvent<HTMLInputElement>) =>
                        patch({
                          collectEmail: (e.target as HTMLInputElement & {
                            selected: boolean;
                          }).selected,
                        })
                      }
                    />
                  </label>

                  <label className="flex cursor-pointer items-center justify-between gap-3">
                    <span>
                      <span className="block text-sm font-semibold text-on-surface">
                        Collect phone number
                      </span>
                      <span className="block text-xs text-on-surface-variant">
                        Require phone at checkout
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

                  <label className="flex cursor-pointer items-center justify-between gap-3">
                    <span>
                      <span className="block text-sm font-semibold text-on-surface">
                        Limit unlocks
                      </span>
                      <span className="block text-xs text-on-surface-variant">
                        Cap how many people can unlock
                      </span>
                    </span>
                    <MdSwitch
                      selected={draft.limitUnlocks || undefined}
                      onChange={(e: React.FormEvent<HTMLInputElement>) =>
                        patch({
                          limitUnlocks: (e.target as HTMLInputElement & {
                            selected: boolean;
                          }).selected,
                        })
                      }
                    />
                  </label>

                  {draft.limitUnlocks && (
                    <MdOutlinedTextField
                      type="number"
                      label="Maximum unlocks"
                      value={String(draft.maxUnlocks ?? "")}
                      style={{ width: "100%" }}
                      onInput={(e: React.FormEvent<HTMLInputElement>) =>
                        patch({
                          maxUnlocks:
                            Number((e.target as HTMLInputElement).value) ||
                            undefined,
                        })
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* footer actions */}
        <div className="sticky bottom-0 mt-8 flex items-center justify-end gap-3 border-t border-outline-variant bg-background/90 py-4 backdrop-blur">
          <MdOutlinedButton onClick={() => publish("draft")}>
            Save Draft
          </MdOutlinedButton>
          <MdFilledButton
            disabled={!draft.title || !draft.unlockPrice ? true : undefined}
            onClick={() => publish("published")}
          >
            <MdIcon slot="icon">lock</MdIcon>
            {isNew ? "Publish Content" : "Publish Changes"}
          </MdFilledButton>
        </div>
      </div>

      {/* ============ PREVIEW SIDE ============ */}
      <div className="rounded-3xl bg-surface-high/60 p-4 lg:p-6">
        <LockedPreview item={draft} />
      </div>
    </div>
  );
}
