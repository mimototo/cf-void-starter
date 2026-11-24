import * as v from "valibot";

/** サンプルの公開プラン ID。決済リクエストはこの値だけを受け付ける。 */
export const samplePlanId = "sample";

/** メモ本文。前後の空白は除き、1 文字以上 1000 文字以下。 */
export const noteTextSchema = v.pipe(
  v.string(),
  v.trim(),
  v.minLength(1, "メモを入力してください。"),
  v.maxLength(1000, "メモは 1000 文字までです。"),
);

export const createNoteSchema = v.object({
  text: noteTextSchema,
});

export const checkoutSchema = v.object({
  planId: v.literal(samplePlanId),
});

export type CreateNoteInput = v.InferOutput<typeof createNoteSchema>;
export type CheckoutInput = v.InferOutput<typeof checkoutSchema>;

export type BillingStatus = "pending" | "sent";

/**
 * 同じ Checkout イベントを再度受けたとき、メール送信をキューに載せるか。
 * 未記録と送信待ちは載せる。送信済みは載せない。
 */
export function shouldEnqueueBilling(record: { status: string } | null): boolean {
  return record === null || record.status === "pending";
}
