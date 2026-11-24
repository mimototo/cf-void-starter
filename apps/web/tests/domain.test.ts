import {
  checkoutSchema,
  createNoteSchema,
  samplePlanId,
  shouldEnqueueBilling,
} from "@cf-void-starter/domain";
import { expect, it } from "vite-plus/test";
import * as v from "valibot";

it("空のメモを拒否する", () => {
  const result = v.safeParse(createNoteSchema, { text: "   " });
  expect(result.success).toBe(false);
});

it("メモ本文を受け入れて空白を除く", () => {
  const result = v.safeParse(createNoteSchema, { text: "  こんにちは  " });
  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.output.text).toBe("こんにちは");
  }
});

it("サンプル以外のプラン ID を拒否する", () => {
  expect(v.safeParse(checkoutSchema, { planId: "other" }).success).toBe(false);
  expect(v.safeParse(checkoutSchema, { planId: samplePlanId }).success).toBe(true);
});

it("送信済みの請求イベントはキューに載せない", () => {
  expect(shouldEnqueueBilling(null)).toBe(true);
  expect(shouldEnqueueBilling({ status: "pending" })).toBe(true);
  expect(shouldEnqueueBilling({ status: "sent" })).toBe(false);
});
