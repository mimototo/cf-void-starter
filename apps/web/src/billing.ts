import Stripe from "stripe";

const cryptoProvider = Stripe.createSubtleCryptoProvider();

/** Workers の fetch 実装で Stripe API を呼ぶクライアントを作る。 */
export function createStripe(secretKey: string): Stripe {
  return new Stripe(secretKey, {
    httpClient: Stripe.createFetchHttpClient(),
  });
}

export type CheckoutNotice = {
  email: string | null;
  eventId: string;
};

/**
 * Webhook の生ボディと署名を検証し、履行対象の Checkout なら通知内容を返す。
 * 対象外のイベントは null。署名が無効なら例外になる。
 */
export async function readCheckoutNotice(input: {
  payload: string;
  secret: string;
  signature: string;
}): Promise<CheckoutNotice | null> {
  const stripe = createStripe("sk_test_unused");
  const event = await stripe.webhooks.constructEventAsync(
    input.payload,
    input.signature,
    input.secret,
    undefined,
    cryptoProvider,
  );

  if (
    event.type !== "checkout.session.completed" &&
    event.type !== "checkout.session.async_payment_succeeded"
  ) {
    return null;
  }

  return {
    email: event.data.object.customer_details?.email ?? null,
    eventId: event.id,
  };
}
