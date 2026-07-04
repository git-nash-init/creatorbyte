import type {
  Creator,
  LockedContent,
  PaymentPage,
  Profile,
} from "@/lib/types";

export const CATEGORIES = [
  "Education",
  "Finance & Trading",
  "Design",
  "Fitness",
  "Music",
  "Coaching",
  "Templates",
  "Other",
];

/* Users start with a clean slate — the empty state motivates the first create. */
export const seedPaymentPages: PaymentPage[] = [];

export const seedLockedContent: LockedContent[] = [];

export const seedProfile: Profile = {
  firstName: "Mehul",
  lastName: "Palan",
  displayName: "Trade Option Experts",
  headline: "SEBI registered research • 11+ years",
  bio: "We help traders master options with disciplined, research-backed guidance.",
  email: "financewithmehul@gmail.com",
  avatarColor: "#72a4f2",
  socials: {
    instagram: "tradeoptionexperts",
    youtube: "@tradeoptionexperts",
    website: "creatorbyte.in",
  },
};

export const seedCreators: Creator[] = [
  {
    id: "cr_1",
    name: "Mehul Palan",
    email: "financewithmehul@gmail.com",
    avatarColor: "#72a4f2",
    plan: "pro",
    status: "active",
    pages: 3,
    sales: 137,
    revenue: 2_008_000,
    joinedAt: "2025-11-02T00:00:00.000Z",
  },
  {
    id: "cr_2",
    name: "Aisha Khan",
    email: "aisha.designs@gmail.com",
    avatarColor: "#f2a172",
    plan: "free",
    status: "active",
    pages: 2,
    sales: 58,
    revenue: 42_300,
    joinedAt: "2026-01-19T00:00:00.000Z",
  },
  {
    id: "cr_3",
    name: "Rohan Verma",
    email: "rohan.fit@gmail.com",
    avatarColor: "#8ad19a",
    plan: "business",
    status: "active",
    pages: 6,
    sales: 402,
    revenue: 918_500,
    joinedAt: "2025-08-11T00:00:00.000Z",
  },
  {
    id: "cr_4",
    name: "Neha Gupta",
    email: "neha.music@gmail.com",
    avatarColor: "#c79af2",
    plan: "free",
    status: "suspended",
    pages: 1,
    sales: 4,
    revenue: 1_200,
    joinedAt: "2026-04-27T00:00:00.000Z",
  },
];
