# HomeCook — v1 plan

## Decisions
- **Card payments:** Stripe Connect Express. Money goes straight to the cook. An optional platform fee is set with `PLATFORM_FEE_PERCENT`.
- **Buyer login:** optional. Guests order with a name and phone number. Gmail login lets a buyer see their order history.
- **Availability:** a simple on/off switch on each dish.
- **Pickup and delivery:** each cook chooses pickup, delivery or both. Delivery can carry a fee.
- **Region:** Canada, prices in CAD. The time zone defaults to America/Toronto.

## Stack
Next.js 15 + TypeScript + Tailwind 4 · Supabase (Postgres, Google auth, storage) · Stripe Connect · Vercel

## Pages
- **Buyer:** `/` (search and category tabs) · `/dish/[id]` (with the order form) · `/c/[slug]` (storefront) · `/order/[id]` (confirmation and WhatsApp) · `/orders`
- **Cook:** `/login` · `/cook/onboarding` · `/cook` (home) · `/cook/orders` · `/cook/menu` (+ new/edit) · `/cook/sales` · `/cook/share` · `/cook/settings`

## Colours
| Token | Hex | Use |
|---|---|---|
| cream | `#FAF7F2` | page background |
| surface | `#FFFFFF` | cards |
| brand (terracotta) | `#C8553D` | buttons, prices, links |
| sage | `#6B8F71` | available, paid, success |
| ink | `#2B2B2B` | text |
| muted | `#7A746D` | secondary text |
| line | `#ECE6DD` | borders |

## Out of scope (v1)
AI listing helper, photo enhancement, tags, AI food finder, multi-dish cart.
