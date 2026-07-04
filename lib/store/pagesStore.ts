import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PaymentPage } from "@/lib/types";
import { seedPaymentPages } from "@/lib/mock/data";
import { slugify, uid } from "@/lib/utils";

export function emptyPaymentPage(): PaymentPage {
  return {
    id: uid("pp"),
    title: "",
    slug: "",
    coverImage: "",
    description: "",
    buttonText: "Get it now",
    priceType: "fixed",
    price: 0,
    discountEnabled: false,
    discountedPrice: undefined,
    files: [],
    resourceLinks: [],
    sections: {
      gallery: false,
      testimonials: false,
      faq: false,
      aboutMe: true,
      showcase: false,
    },
    status: "draft",
    paymentsEnabled: true,
    sales: 0,
    revenue: 0,
    createdAt: new Date().toISOString(),
    collectPhone: false,
    limitQuantity: false,
  };
}

interface PagesState {
  pages: PaymentPage[];
  upsert: (page: PaymentPage) => void;
  remove: (id: string) => void;
  duplicate: (id: string) => void;
  setStatus: (id: string, status: PaymentPage["status"]) => void;
  get: (id: string) => PaymentPage | undefined;
}

export const usePagesStore = create<PagesState>()(
  persist(
    (set, get) => ({
      pages: seedPaymentPages,
      upsert: (page) =>
        set((s) => {
          const slug = page.slug || slugify(page.title || "untitled");
          const next = { ...page, slug };
          const exists = s.pages.some((p) => p.id === page.id);
          return {
            pages: exists
              ? s.pages.map((p) => (p.id === page.id ? next : p))
              : [next, ...s.pages],
          };
        }),
      remove: (id) => set((s) => ({ pages: s.pages.filter((p) => p.id !== id) })),
      duplicate: (id) =>
        set((s) => {
          const src = s.pages.find((p) => p.id === id);
          if (!src) return s;
          const copy: PaymentPage = {
            ...src,
            id: uid("pp"),
            title: `${src.title} (copy)`,
            slug: slugify(`${src.title}-copy`),
            status: "draft",
            sales: 0,
            revenue: 0,
            createdAt: new Date().toISOString(),
          };
          return { pages: [copy, ...s.pages] };
        }),
      setStatus: (id, status) =>
        set((s) => ({
          pages: s.pages.map((p) => (p.id === id ? { ...p, status } : p)),
        })),
      get: (id) => get().pages.find((p) => p.id === id),
    }),
    { name: "cb-pages" }
  )
);
