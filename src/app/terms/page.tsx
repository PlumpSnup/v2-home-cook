import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { APP_NAME } from "@/lib/brand";

export const metadata: Metadata = { title: "Terms of service" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of service" updated="October 2026">
      <p>By using {APP_NAME} you agree to these terms.</p>

      <h2>What {APP_NAME} is</h2>
      <p>
        {APP_NAME} is a listing site. Cooks list food they make, and buyers order directly from them. {APP_NAME} is not a
        party to the sale: each order is an agreement between the buyer and the cook.
      </p>

      <h2>For cooks</h2>
      <ul>
        <li>You’re responsible for the food you sell, including its safety, ingredients and allergen information.</li>
        <li>You’re responsible for following the food-safety, licensing and tax rules that apply where you cook.</li>
        <li>Keep your menu, prices and availability accurate, and only list food you can actually provide.</li>
        <li>Only upload photos you have the right to use.</li>
      </ul>

      <h2>For buyers</h2>
      <ul>
        <li>Give accurate contact details and mention any allergies in your order note.</li>
        <li>Pay the cook using the method you chose: cash, e-Transfer or card.</li>
        <li>Pickup, delivery, cancellations and refunds are arranged with the cook.</li>
      </ul>

      <h2>Payments</h2>
      <p>
        Card payments are processed by Stripe and paid to the cook’s Stripe account. Cash and e-Transfer payments go
        directly between buyer and cook; {APP_NAME} never holds that money.
      </p>

      <h2>Our part</h2>
      <p>
        We work to keep {APP_NAME} running and accurate, but we provide it “as is” and can’t guarantee it will always be
        available. We aren’t responsible for the food, the cook’s or buyer’s conduct, or disputes between them. We may
        remove listings or accounts that break these terms.
      </p>

      <h2>Changes</h2>
      <p>We may update these terms. If you keep using {APP_NAME} after a change, you accept the updated terms.</p>
    </LegalPage>
  );
}
