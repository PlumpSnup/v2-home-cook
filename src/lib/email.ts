import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { APP_NAME } from "./brand";
import { money, siteUrl } from "./format";

/*
 * Order emails. They're sent through a Gmail account: set GMAIL_USER (the address) and
 * GMAIL_APP_PASSWORD (a Google "app password", not the normal password). EMAIL_SMTP_URL, if set,
 * points at any other SMTP server instead (used for local testing). With neither, emails are skipped.
 */

let transporter: Transporter | null | undefined;

function transport() {
  if (transporter !== undefined) return transporter;
  if (process.env.EMAIL_SMTP_URL) transporter = nodemailer.createTransport(process.env.EMAIL_SMTP_URL);
  else if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD)
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD.replace(/\s/g, "") },
    });
  else transporter = null;
  return transporter;
}

export const emailEnabled = () => transport() !== null;

function sender() {
  const address = process.env.GMAIL_USER || process.env.EMAIL_FROM || "orders@localhost";
  return `"${APP_NAME}" <${address}>`;
}

/** Sends one email. Never throws: an email that fails must not break an order. */
async function send(to: string | null | undefined, subject: string, html: string, text: string) {
  const mailer = transport();
  if (!mailer || !to || !to.includes("@")) return;
  try {
    await mailer.sendMail({ from: sender(), to, subject, html, text });
  } catch (error) {
    console.error("Order email failed:", (error as Error).message);
  }
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** A simple, mobile-friendly email in SimpleCook's colours. */
function layout(heading: string, lines: string[], button?: { label: string; url: string }, footer?: string) {
  const body = lines
    .map((l) => `<p style="margin:0 0 10px;font-size:15px;line-height:1.5;color:#2b2b2b">${l}</p>`)
    .join("");
  const cta = button
    ? `<a href="${esc(button.url)}" style="display:inline-block;margin-top:8px;background:#2faca1;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 22px;border-radius:999px">${esc(button.label)}</a>`
    : "";
  return `<!doctype html><html><body style="margin:0;background:#f2e8cf;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px">
<tr><td style="padding:0 4px 14px;font-family:Georgia,serif;font-size:20px;font-weight:700;color:#2b2b2b">🍲 ${APP_NAME}</td></tr>
<tr><td style="background:#ffffff;border-radius:20px;padding:24px">
<h1 style="margin:0 0 14px;font-family:Georgia,serif;font-size:22px;color:#2b2b2b">${heading}</h1>${body}${cta}
</td></tr>
<tr><td style="padding:14px 4px;font-size:12px;color:#7a746d">${footer ?? `Sent by ${APP_NAME}.`}</td></tr>
</table></td></tr></table></body></html>`;
}

type OrderInfo = {
  id: string;
  buyer_name: string;
  buyer_phone: string;
  buyer_email?: string | null;
  dish_name: string;
  total_cents: number;
  fulfillment: string;
  payment_method: string;
  note?: string | null;
};

const ref = (id: string) => id.slice(0, 6).toUpperCase();
const how = (o: OrderInfo) => (o.fulfillment === "delivery" ? "Delivery" : "Pickup");
const PAY: Record<string, string> = { cash: "Cash", etransfer: "e-Transfer", card: "Card" };

/** To the cook: a new order came in. */
export async function emailCookNewOrder(cookEmail: string | null | undefined, kitchen: string, o: OrderInfo) {
  const lines = [
    `<strong>${esc(o.buyer_name)}</strong> ordered from ${esc(kitchen)}:`,
    `${esc(o.dish_name)}`,
    `<strong>${money(o.total_cents)}</strong> · ${how(o)} · ${PAY[o.payment_method] ?? o.payment_method}`,
    `Phone: ${esc(o.buyer_phone)}`,
    ...(o.note ? [`Note: “${esc(o.note)}”`] : []),
  ];
  await send(
    cookEmail,
    `New order from ${o.buyer_name.split(" ")[0]} · ${money(o.total_cents)}`,
    layout(
      "New order 🎉",
      lines,
      { label: "View order", url: `${siteUrl()}/cook/orders` },
      `You get these because order emails are on in your ${APP_NAME} settings.`,
    ),
    `New order from ${o.buyer_name}: ${o.dish_name}. ${money(o.total_cents)}, ${how(o)}. Phone ${o.buyer_phone}. ${siteUrl()}/cook/orders`,
  );
}

const BUYER_MESSAGES: Record<
  string,
  (kitchen: string, o: OrderInfo) => { subject: string; heading: string; line: string }
> = {
  placed: (k) => ({
    subject: `Your order from ${k}`,
    heading: "Order received 🙌",
    line: `${esc(k)} has your order. You’ll get an email when they confirm it.`,
  }),
  confirmed: (k, o) => ({
    subject: `${k} confirmed your order`,
    heading: "Order confirmed 👍",
    line: `${esc(k)} confirmed your order and will have it ready for ${how(o).toLowerCase()}.`,
  }),
  paid: (k) => ({
    subject: `Payment received by ${k}`,
    heading: "Payment received ✓",
    line: `${esc(k)} marked your order as paid. Thank you!`,
  }),
  completed: (k) => ({
    subject: `Your order from ${k} is complete`,
    heading: "Enjoy your food 🍽️",
    line: `Your order from ${esc(k)} is complete. Thanks for ordering!`,
  }),
  cancelled: (k) => ({
    subject: `${k} cancelled your order`,
    heading: "Order cancelled",
    line: `${esc(k)} cancelled this order. Reply on WhatsApp if you have questions.`,
  }),
};

/** To the buyer, if they left an email: their order was placed, confirmed, paid, completed or cancelled. */
export async function emailBuyer(event: keyof typeof BUYER_MESSAGES, kitchen: string, o: OrderInfo) {
  const message = BUYER_MESSAGES[event]?.(kitchen, o);
  if (!message || !o.buyer_email) return;
  const url = `${siteUrl()}/order/${o.id}`;
  await send(
    o.buyer_email,
    message.subject,
    layout(
      message.heading,
      [
        message.line,
        `Order #${ref(o.id)}: ${esc(o.dish_name)}`,
        `<strong>${money(o.total_cents)}</strong> · ${how(o)} · ${PAY[o.payment_method] ?? o.payment_method}`,
      ],
      { label: "View your order", url },
      `You get these because you added your email when ordering on ${APP_NAME}.`,
    ),
    `${message.heading}. ${message.line.replace(/<[^>]+>/g, "")} Order #${ref(o.id)}: ${o.dish_name}. ${url}`,
  );
}
