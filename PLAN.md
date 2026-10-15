# Home Cook Marketplace — v1 Plan (draft, pending answers)

## Stack
- Next.js (App Router) + TypeScript + Tailwind CSS — mobile-first, deploy on Vercel
- Supabase — Postgres, Google (Gmail) login, image storage for food photos
- Stripe Connect (Express) + Stripe Checkout — card/debit payments go to the cook
- Cash / e-transfer — shown as payment instructions; cook marks order paid

## Pages
Buyer: Home (search + categories), Search results, Dish page, Cook storefront `/c/[slug]`, Order sheet, My orders
Cook: Google login, onboarding (name, area, WhatsApp, payment methods, e-transfer email), Menu manager (add dish: photo, name, price, category, short description), Orders, Sales dashboard (meals sold + revenue: today / week / month), Share storefront (copy link, WhatsApp share, Instagram-ready link + QR)

## Data
profiles(cook/buyer) · dishes(category: Main Meals, Appetizers, Soups, Desserts) · orders(dish, qty, buyer contact, payment method, status, total)

## Order flow
Buyer picks dish → enters name + phone → picks payment method the cook accepts →
- Card: Stripe Checkout → order marked paid automatically
- Cash / e-transfer: order saved, WhatsApp opens with a prefilled message to the cook
Cook confirms / marks paid / completed → feeds sales dashboard and success metrics.

## Colors
- Background cream `#FAF7F2`, surface white `#FFFFFF`
- Primary terracotta `#C8553D` (buttons, links)
- Accent sage `#6B8F71` (available / paid / success)
- Text charcoal `#2B2B2B`, muted `#7A746D`, borders `#ECE6DD`

## Out of scope (v1)
AI listing helper, photo enhancement, tags, AI food finder.

## Build order
1. Scaffold, design tokens, auth  2. Cook onboarding + menu  3. Browse/search + storefront + share
4. Orders + WhatsApp  5. Stripe Connect  6. Sales dashboard  7. Seed data, deploy
