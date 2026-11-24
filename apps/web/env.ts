import { defineEnv, string, url } from "void/env";

/**
 * サーバー秘密情報とブラウザへ渡す公開値。
 * 秘密情報の本番値は `void secret put` で登録する。ここには値を書かない。
 */
export default defineEnv({
  EMAIL_FROM: string().optional(),
  RESEND_API_KEY: string().optional(),
  STRIPE_PRICE_ID: string().optional(),
  STRIPE_SECRET_KEY: string().optional(),
  STRIPE_WEBHOOK_SECRET: string().optional(),
  VITE_POSTHOG_HOST: url().default("https://us.i.posthog.com"),
  VITE_POSTHOG_PROJECT_TOKEN: string().optional(),
});
