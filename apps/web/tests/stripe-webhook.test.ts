import Stripe from "stripe";
import { expect, it } from "vite-plus/test";
import { readCheckoutNotice } from "../src/billing";

const secret = "whsec_test_secret";

function signedPayload(payload: string): string {
  return Stripe.webhooks.generateTestHeaderString({ payload, secret });
}

it("署名付きの Checkout 完了イベントからメールアドレスを読む", async () => {
  const payload = JSON.stringify({
    data: {
      object: {
        customer_details: { email: "buyer@example.com" },
        id: "cs_test",
        object: "checkout.session",
      },
    },
    id: "evt_test",
    object: "event",
    type: "checkout.session.completed",
  });

  const notice = await readCheckoutNotice({
    payload,
    secret,
    signature: signedPayload(payload),
  });

  expect(notice).toEqual({
    email: "buyer@example.com",
    eventId: "evt_test",
  });
});

it("署名が違う Webhook を拒否する", async () => {
  const payload = JSON.stringify({
    id: "evt_test",
    object: "event",
    type: "checkout.session.completed",
  });

  await expect(
    readCheckoutNotice({
      payload,
      secret,
      signature: signedPayload('{"id":"evt_other"}'),
    }),
  ).rejects.toThrow();
});
