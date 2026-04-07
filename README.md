# SME Business App — Sri Lanka

An all-in-one business management app for Sri Lankan SMEs: shops, salons, pharmacies, boutiques, and cafés.

## Features

- **Multilingual**: English / සිංහල / தமிழ் — toggle anytime from the top bar
- **5 Business Types**: Shop, Salon, Pharmacy, Boutique, Café — each with a tailored module set and color theme
- **Dashboard**: Revenue chart (7-day), stock alerts, follow-up reminders, recent orders
- **Orders**: Create orders with item picker, payment method selection, customer linkage
- **Inventory**: Stock levels, low-stock alerts, expiry tracking (pharmacy), category filters
- **Customers**: Profiles with tags (VIP, Wholesale...), follow-up reminder system, WhatsApp quick-chat
- **Promotions**: Create offers in EN/Sinhala/Tamil, share via WhatsApp or SMS deep links
- **Payments**: Record & track by method (Cash, Card, EZ Cash, mCash, Bank Transfer, Credit)
- **Mobile-first**: Bottom nav bar, touch-optimized forms, responsive layout

## Tech Stack

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS v4**
- **Zustand** (persistent state — business type, locale, onboarding)
- **TanStack Query v5** (data fetching layer, ready for real API)
- **Recharts** (revenue chart)
- **Lucide React** (icons)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). First run shows onboarding to pick language and business type.

## Sri Lanka-Specific Details

- **Payments**: Cash, Card, Dialog EZ Cash, Mobitel mCash, Bank Transfer, Credit
- **Districts**: All 25 Sri Lanka districts in customer forms
- **Currency**: LKR, displayed as `LKR`, `රු.`, or `ரூ.` based on locale
- **Phone**: `+94` prefix in customer forms
- **WhatsApp share**: `wa.me/` deep links open WhatsApp directly on mobile
- **Pharmacy mode**: Expiry date column with red/yellow warnings
