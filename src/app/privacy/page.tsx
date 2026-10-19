import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { APP_NAME } from "@/lib/brand";

export const metadata: Metadata = { title: "Privacy policy" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy" updated="October 2026">
      <p>
        {APP_NAME} connects home cooks with people who want to order their food. This page explains what information we
        collect and how we use it.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>When you sign in with Google:</strong> your name, email address and profile photo. We never see your
          Google password.
        </li>
        <li>
          <strong>Cooks:</strong> kitchen name, neighbourhood, WhatsApp number, a short bio, dish photos and prices, the
          payment methods you accept and, if you accept e-Transfers, the email you receive them on.
        </li>
        <li>
          <strong>When you place an order:</strong> your name, phone number, any note you add, what you ordered, and how
          you chose to pay and get your food.
        </li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To show cooks’ menus and storefronts to buyers.</li>
        <li>To pass your order, name and phone number to the cook you ordered from, so they can prepare it and contact you.</li>
        <li>To show cooks their orders and sales totals.</li>
        <li>To keep you signed in and keep accounts secure.</li>
      </ul>
      <p>We don’t sell your information and we don’t use it for advertising.</p>

      <h2>Who else sees it</h2>
      <ul>
        <li>
          <strong>Cooks</strong> see the details of orders placed with them. A cook’s kitchen name, area, WhatsApp number
          and e-Transfer email are shown publicly on their storefront so buyers can reach and pay them.
        </li>
        <li>
          <strong>Stripe</strong> processes card payments. Card details go straight to Stripe and never reach {APP_NAME}.
        </li>
        <li>
          <strong>WhatsApp</strong>: when you tap a WhatsApp button, the message is sent through WhatsApp under its own
          privacy policy.
        </li>
        <li>
          <strong>Service providers</strong> that run the app for us: Vercel (hosting and photo storage), Neon (database)
          and Google (sign-in).
        </li>
      </ul>

      <h2>Keeping and deleting your information</h2>
      <p>
        We keep your information while your account is active. Cooks can delete dishes at any time. To delete your account
        and its information, contact us using the details below and we’ll remove it, except for records we must keep for
        legal or accounting reasons.
      </p>
    </LegalPage>
  );
}
