import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LockedContent } from "@/lib/types";
import { seedLockedContent } from "@/lib/mock/data";
import { slugify, uid } from "@/lib/utils";

export function emptyLockedContent(): LockedContent {
  return {
    id: uid("lc"),
    title: "",
    slug: "",
    category: "Education",
    unlockPrice: 0,
    body: "",
    media: [],
    status: "draft",
    sales: 0,
    revenue: 0,
    createdAt: new Date().toISOString(),
    collectEmail: true,
    collectPhone: false,
    successMessage: "",
    limitUnlocks: false,
  };
}

interface LockedState {
  items: LockedContent[];
  upsert: (item: LockedContent) => void;
  remove: (id: string) => void;
  duplicate: (id: string) => void;
  setStatus: (id: string, status: LockedContent["status"]) => void;
  get: (id: string) => LockedContent | undefined;
}

export const useLockedStore = create<LockedState>()(
  persist(
    (set, get) => ({
      items: seedLockedContent,
      upsert: (item) =>
        set((s) => {
          const slug = item.slug || slugify(item.title || "untitled");
          const next = { ...item, slug };
          const exists = s.items.some((i) => i.id === item.id);
          return {
            items: exists
              ? s.items.map((i) => (i.id === item.id ? next : i))
              : [next, ...s.items],
          };
        }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      duplicate: (id) =>
        set((s) => {
          const src = s.items.find((i) => i.id === id);
          if (!src) return s;
          const copy: LockedContent = {
            ...src,
            id: uid("lc"),
            title: `${src.title} (copy)`,
            slug: slugify(`${src.title}-copy`),
            status: "draft",
            sales: 0,
            revenue: 0,
            createdAt: new Date().toISOString(),
          };
          return { items: [copy, ...s.items] };
        }),
      setStatus: (id, status) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, status } : i)),
        })),
      get: (id) => get().items.find((i) => i.id === id),
    }),
    // version bump discards previously persisted dummy/seed data
    {
      name: "cb-locked",
      version: 1,
      migrate: () => ({ items: [] as LockedContent[] }),
    }
  )
);
