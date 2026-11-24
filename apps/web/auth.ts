import { defineAuth } from "void/auth";
import { sendTransactionalEmail } from "./src/email";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** Better Auth の確認メールとパスワード再設定メールを Resend で送る。 */
export default defineAuth(({ defaults }) => ({
  ...defaults,
  emailAndPassword: {
    ...defaults.emailAndPassword,
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      const href = escapeHtml(url);
      await sendTransactionalEmail({
        html: `<p><a href="${href}">パスワードを再設定する</a></p>`,
        subject: "パスワードを再設定してください",
        to: user.email,
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const href = escapeHtml(url);
      await sendTransactionalEmail({
        html: `<p><a href="${href}">メールアドレスを確認する</a></p>`,
        subject: "メールアドレスを確認してください",
        to: user.email,
      });
    },
  },
}));
