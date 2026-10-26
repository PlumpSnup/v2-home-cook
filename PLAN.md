# HomeCook — v1 plan

## Decisions
- **Card payments:** Stripe Connect Express. Money goes straight to the cook. An optional platform fee is set with `PLATFORM_FEE_PERCENT`.
- **Buyer login:** optional. Guests order with a name and phone number. Gmail login lets a buyer see their order history.
- **Availability:** a simple on/off switch on each dish.
- **Home page for cooks:** for now the home page pitches home cooks (how it works, features, sign-up). Kitchen listings and search are off the home page until there are enough cooks.
- **Cart per kitchen:** buyers order several dishes from one kitchen in one checkout. Adding from a second kitchen asks to start a new cart.
- **Cover photo:** the cook's best dish photo by default; cooks can upload their own in Settings.
- **Filters:** dish categories inside each storefront. (City and cuisine filters return with the home page listings.)
- **Pickup and delivery:** each cook chooses pickup, delivery or both. Delivery can carry a fee.
- **Region:** Canada, prices in CAD. The time zone defaults to America/Toronto.

## Stack
Next.js 15 + TypeScript + Tailwind 4 · Neon Postgres · Auth.js (Google) · Vercel Blob · Stripe Connect · Vercel

## Pages
- **Home:** `/` (landing page for home cooks)
- **Buyer:** `/c/[slug]` (storefront with cover photo, menu by category, Add buttons) · `/dish/[id]` (Add to cart) · `/checkout?k=[slug]` (cart checkout) · `/order/[id]` (confirmation and WhatsApp) · `/orders`
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
