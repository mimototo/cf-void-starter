import { defineQueue } from "void";
import { db, eq } from "void/db";
import { billingEvents } from "@schema";
import { sendTransactionalEmail } from "../src/email";

type BillingMessage = {
  eventId: string;
};

export const maxRetries = 5;

/**
 * Checkout 完了メールを 1 通送る。
 * 送信済みのイベントと、行が無いイベントは再送しない。
 * Resend の Idempotency-Key にイベント ID を使い、再試行でも同じ送信になる。
 */
export default defineQueue<BillingMessage>(async (batch) => {
  for (const message of batch.messages) {
    const [row] = await db
      .select({
        customerEmail: billingEvents.customerEmail,
        id: billingEvents.id,
        status: billingEvents.status,
      })
      .from(billingEvents)
      .where(eq(billingEvents.id, message.body.eventId));

    if (!row || row.status === "sent") {
      message.ack();
      continue;
    }

    // 宛先が無い、または送信設定が無いときは再試行しても届かない。送信済みにしてキューを止める。
    if (row.customerEmail) {
      await sendTransactionalEmail({
        html: "<p>サンプルプランの手続きを受け付けました。</p>",
        idempotencyKey: row.id,
        subject: "お支払いを受け付けました",
        to: row.customerEmail,
      });
    }

    await db.update(billingEvents).set({ status: "sent" }).where(eq(billingEvents.id, row.id));
    message.ack();
  }
});
