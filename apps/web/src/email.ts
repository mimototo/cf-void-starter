import { Resend } from "resend";
import { env } from "void/env";

type EmailInput = {
  html: string;
  idempotencyKey?: string;
  subject: string;
  to: string;
};

/**
 * Resend でトランザクションメールを送る。
 * API キーか送信元が無いときは送らず、呼び出し側は成功扱いにできる。
 */
export async function sendTransactionalEmail(input: EmailInput): Promise<"sent" | "skipped"> {
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) {
    console.log(JSON.stringify({ event: "email.skipped", reason: "missing_config" }));
    return "skipped";
  }

  const resend = new Resend(env.RESEND_API_KEY);
  const { error } = await resend.emails.send(
    {
      from: env.EMAIL_FROM,
      html: input.html,
      subject: input.subject,
      to: input.to,
    },
    input.idempotencyKey ? { idempotencyKey: input.idempotencyKey } : undefined,
  );

  if (error) {
    throw new Error(error.message);
  }

  return "sent";
}
