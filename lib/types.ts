export type PageStatus = "published" | "unpublished" | "draft";
export type PriceType = "fixed" | "flexible";

export interface UploadedFile {
  id: string;
  name: string;
  size: number; // bytes
  kind: "image" | "video" | "file";
  url?: string;
}

export interface OptionalSections {
  gallery: boolean;
  testimonials: boolean;
  faq: boolean;
  aboutMe: boolean;
  showcase: boolean;
}

export interface PaymentPage {
  id: string;
  title: string;
  slug: string;
  coverImage?: string;
  description: string;
  buttonText: string;
  priceType: PriceType;
  price: number;
  discountEnabled: boolean;
  discountedPrice?: number;
  files: UploadedFile[];
  resourceLinks: string[];
  sections: OptionalSections;
  status: PageStatus;
  paymentsEnabled: boolean;
  sales: number;
  revenue: number;
  createdAt: string;
  // advanced
  redirectUrl?: string;
  collectPhone: boolean;
  limitQuantity: boolean;
  quantity?: number;
}

export type LockedMediaKind = "image" | "video" | "file";

export interface LockedContent {
  id: string;
  title: string;
  slug: string;
  category: string;
  unlockPrice: number;
  body: string;
  media: UploadedFile[];
  status: PageStatus;
  sales: number;
  revenue: number;
  createdAt: string;
  // advanced
  collectEmail: boolean;
  collectPhone: boolean;
  successMessage?: string;
  limitUnlocks: boolean;
  maxUnlocks?: number;
}

export interface Creator {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
  plan: "free" | "pro" | "business";
  status: "active" | "suspended";
  pages: number;
  sales: number;
  revenue: number;
  joinedAt: string;
}

export interface Profile {
  firstName: string;
  lastName: string;
  displayName: string;
  headline: string;
  bio: string;
  email: string;
  avatarColor: string;
  socials: { instagram?: string; youtube?: string; x?: string; website?: string };
}

export type Role = "admin" | "superadmin";
