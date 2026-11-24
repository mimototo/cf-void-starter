import { shouldEnqueueBilling } from "@cf-void-starter/domain";
import { defineHandler } from "void";
import { db, eq } from "void/db";
import { env } from "void/env";
import { queues } from "void/queues";
import { billingEvents } from "@schema";
import { readCheckoutNotice } from "../../../src/billing";

/**
 * Stripe からの Webhook。署名を検証し、未送信の Checkout だけをキューへ載せる。
 * 同じイベント ID の再送では行を増やさない。
 */
export const POST = defineHandler(async (c) => {
  if (!env.STRIPE_SECRET_KEY || !env.STRIPE_WEBHOOK_SECRET) {
    return c.json({ error: "stripe_not_configured" }, 503);
  }

  const signature = c.req.header("stripe-signature");
  if (!signature) {
    return c.json({ error: "missing_signature" }, 400);
  }

  const payload = await c.req.text();
  let notice: Awaited<ReturnType<typeof readCheckoutNotice>>;
  try {
    notice = await readCheckoutNotice({
      payload,
      secret: env.STRIPE_WEBHOOK_SECRET,
      signature,
    });
  } catch (error) {
    console.log(
      JSON.stringify({
        event: "stripe.webhook_rejected",
        reason: error instanceof Error ? error.name : "unknown",
      }),
    );
    return c.json({ error: "invalid_signature" }, 400);
  }

  if (!notice) {
    return { received: true };
  }

  await db
    .insert(billingEvents)
    .values({
      customerEmail: notice.email,
      id: notice.eventId,
      status: "pending",
    })
    .onConflictDoNothing();

  const [row] = await db
    .select({ id: billingEvents.id, status: billingEvents.status })
    .from(billingEvents)
    .where(eq(billingEvents.id, notice.eventId));

  if (!row || !shouldEnqueueBilling(row)) {
    return { received: true };
  }

  await queues.billing.send({ eventId: notice.eventId });
  return { received: true };
});
