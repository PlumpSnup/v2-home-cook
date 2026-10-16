# HomeCook

HomeCook is a mobile-first marketplace where home cooks list their dishes and buyers order from them. Cooks are paid by cash, Interac e-Transfer or card (through Stripe).

- **Cooks:** sign in with Gmail and set up a kitchen in about a minute. Add a dish with a photo, a name and a price. Switch dishes on or off, and manage orders. A sales dashboard shows meals sold and money made today, this week and this month. Cooks share their storefront with a link, on WhatsApp, on Instagram (bio, story or QR code) or as a printable QR code.
- **Buyers:** search dishes or browse by category (Main Meals, Appetizers, Soups, Desserts). Buyers order as a guest with a name and phone number, or sign in to see past orders. After ordering, one tap sends the order to the cook on WhatsApp.

Stack: Next.js 15 (App Router) + Tailwind CSS 4, Postgres on Neon, Auth.js (Google login), Vercel Blob (photos), Stripe Connect Express.

To rename the app, change `src/lib/brand.ts`. The brand colours are in `src/app/globals.css`.

## Run locally

```bash
npm install
cp .env.example .env.local    # set DATABASE_URL to any Postgres and AUTH_SECRET to random text
npm run dev
```

The app creates its tables the first time it connects, so there's no SQL to run. Without a Blob token, photos are saved in `.uploads/` locally.

## Go live on Vercel

1. **Database:** go to Storage → Create → **Neon**, then connect it to the project. Leave Auth and Realtime off and leave the prefix blank. This adds `DATABASE_URL`.
2. **Photos:** go to Storage → Create → **Blob**, then connect it to the project. This adds `BLOB_READ_WRITE_TOKEN`.
3. **Settings:** add these environment variables:
   - `AUTH_SECRET`: any long random text, for example from https://generate-secret.vercel.app/32
   - `NEXT_PUBLIC_SITE_URL`: e.g. `https://your-app.vercel.app`
4. **Google login:** in Google Cloud Console, create an OAuth client (type: Web application).
   - Authorised redirect URI: `https://<your-domain>/api/auth/callback/google`
   - Put the client ID and secret in `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`.
5. **Stripe (optional, for card payments):** enable Connect (Express) in your Stripe dashboard.
   - Add a webhook endpoint `https://<your-domain>/api/stripe/webhook` for `checkout.session.completed` and `checkout.session.async_payment_succeeded`.
   - Set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`.
   - If `STRIPE_SECRET_KEY` is empty, the app runs with cash and e-Transfer only.
6. Redeploy.

## How orders work

1. A buyer picks a dish, a quantity, pickup or delivery, and a payment method the cook accepts. The order is saved on the server, which takes prices from the database.
2. **Card:** the buyer pays with Stripe Checkout. The money goes to the cook's connected Stripe account, minus `PLATFORM_FEE_PERCENT` if you set one. An unpaid card order is hidden from the cook until payment succeeds.
3. **Cash or e-Transfer:** the confirmation page shows how to pay, and a WhatsApp button sends the order details to the cook.
4. The cook confirms the order, then marks it completed. Completed orders count towards the sales dashboard.

## Success metrics

Run these in the Neon SQL editor (Vercel → Storage → your database → Open in Neon):

```sql
select count(*) from profiles where is_cook;                                     -- cooks (goal 50)
select count(*) from profiles where is_cook and exists
  (select 1 from dishes d where d.cook_id = profiles.id);                         -- cooks with a listing
select count(*) from orders where status <> 'cancelled'
  and (payment_method <> 'card' or paid);                                         -- orders placed (goal 5)
```

Counting the 20 people who go through the app needs page analytics. One option is Vercel Web Analytics: turn it on in the Vercel dashboard and add `@vercel/analytics`.

## Not in v1

- A cart that holds several dishes (one order is one dish, any quantity).
- AI listing helper, photo enhancement, tags and AI food finder.
