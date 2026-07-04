# CreatorByte

**Make money doing what you love.** The creator monetization platform behind [creatorbyte.in](https://creatorbyte.in).

Frontend built with **Next.js (App Router) + React + TypeScript**, styled with **Material 3** via Google's official [Material Web](https://github.com/material-components/material-web) components, themed to the CreatorByte brand (warm cream surfaces, near-black, friendly blue, Fredoka + DM Sans).

## Features

### 💳 Payment Pages
- Dashboard with Total Sale / Total Revenue / Conversion stats
- Published / Unpublished / Draft tabs, search, sort, CSV export, list ⇄ grid views
- 3-tab editor: **Page Details** (title, cover, description, button text, optional sections), **Payment Page Details** (file uploads, resource links, fixed/flexible pricing, discounts), **Advanced Settings** (slug, redirect, phone collection, quantity limits)
- **Real-time live preview** with desktop ⇄ mobile device toggle

### 🔒 Locked Content
- Put text, images, videos or files behind an unlock price
- Category, success message, email/phone collection, unlock limits
- Buyer-facing locked view with blurred content + unlock card, previewable in locked/unlocked states

### 👤 Roles
- **Creator (Admin):** payment pages, locked content, profile, account settings
- **Super Admin:** platform overview, creator management, aggregate revenue
- Dev role-switcher in the topbar (real auth arrives with Supabase)

### ✨ UI/UX
- Material 3 design system — M3 color tokens generated from the brand palette
- Full **light & dark mode** (next-themes)
- Fully responsive, Google-style motion & transitions, pill buttons, ripple effects

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Status

Frontend-only: all data is mock + local state (Zustand, persisted to localStorage). Supabase backend and external media storage are the next phase — stores are structured to swap to real data cleanly.

## Stack

| Layer | Tech |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| UI | @material/web (Material 3 web components), Tailwind CSS v4 |
| State | Zustand (persisted) |
| Theming | next-themes, M3 CSS tokens |
| Fonts | Fredoka (display), DM Sans (body), Material Symbols Rounded |
