# HomeCook

HomeCook is a mobile-first marketplace where home cooks list their dishes and buyers order from them. Cooks are paid by cash, Interac e-Transfer or card (through Stripe).

- **Cooks:** sign in with Gmail and set up a kitchen in about a minute. Add a dish with a photo, a name and a price. Switch dishes on or off, and manage orders. A sales dashboard shows meals sold and money made today, this week and this month. Cooks share their storefront with a link, on WhatsApp, on Instagram (bio, story or QR code) or as a printable QR code.
- **Buyers:** search dishes or browse by category (Main Meals, Appetizers, Soups, Desserts). Buyers order as a guest with a name and phone number, or sign in to see past orders. After ordering, one tap sends the order to the cook on WhatsApp.

Stack: Next.js 15 (App Router) + Tailwind CSS 4, Supabase (Postgres, Google auth, photo storage), Stripe Connect Express.

To rename the app, change `src/lib/brand.ts`. The brand colours are in `src/app/globals.css`.

## Run locally

```bash
npm install
npx supabase start            # needs Docker; applies supabase/migrations
cp .env.example .env.local    # fill in the URL + anon/service keys printed by supabase start
npm run dev
```

## Go live

1. **Supabase:** create a project. Run `supabase/migrations/0001_init.sql` in the SQL editor, or run `npx supabase db push`.
2. **Google login:** in Google Cloud Console, create an OAuth client (Web). Add `https://<project>.supabase.co/auth/v1/callback` as an authorised redirect URI. In Supabase → Authentication → Providers → Google, paste the client ID and secret. In Authentication → URL Configuration, set the Site URL to your domain and add `https://<your-domain>/auth/callback` to the redirect URLs.
3. **Stripe (optional, for card payments):** enable Connect (Express) in your Stripe dashboard. Add a webhook endpoint `https://<your-domain>/api/stripe/webhook` for `checkout.session.completed` and `checkout.session.async_payment_succeeded`. Put the API key and the webhook secret in the env vars. If `STRIPE_SECRET_KEY` is empty, the app runs with cash and e-Transfer only.
4. **Vercel:** import the repo and add the variables from `.env.example`.

## How orders work

1. A buyer picks a dish, a quantity, pickup or delivery, and a payment method the cook accepts. The order is saved on the server, which takes prices from the database.
2. **Card:** the buyer pays with Stripe Checkout. The money goes to the cook's connected Stripe account, minus `PLATFORM_FEE_PERCENT` if you set one. An unpaid card order is hidden from the cook until payment succeeds.
3. **Cash or e-Transfer:** the confirmation page shows how to pay, and a WhatsApp button sends the order details to the cook.
4. The cook confirms the order, then marks it completed. Completed orders count towards the sales dashboard.

## Success metrics

Run these in the Supabase SQL editor:

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
