import { checkoutSchema } from "@cf-void-starter/domain";
import { defineHandler } from "void";
import { requireAuth } from "void/auth";
import { env } from "void/env";
import { createStripe } from "../../src/billing";

/** Stripe Checkout のサブスクリプションセッションを作り、遷移先 URL を返す。 */
export const POST = defineHandler.withValidator({
  body: checkoutSchema,
})(async (c, { body }) => {
  const user = requireAuth(c);

  if (!env.STRIPE_SECRET_KEY || !env.STRIPE_PRICE_ID) {
    return c.json({ error: "stripe_not_configured" }, 503);
  }

  const stripe = createStripe(env.STRIPE_SECRET_KEY);
  const origin = new URL(c.req.url).origin;
  const session = await stripe.checkout.sessions.create({
    cancel_url: `${origin}/?checkout=cancel`,
    client_reference_id: user.id,
    customer_email: user.email,
    line_items: [{ price: env.STRIPE_PRICE_ID, quantity: 1 }],
    metadata: { planId: body.planId, userId: user.id },
    mode: "subscription",
    success_url: `${origin}/?checkout=success`,
  });

  return { url: session.url };
});
