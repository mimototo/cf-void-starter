import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const webhooks = require("standardwebhooks") as {
  Webhook: new (secret: string) => {
    verify: (payload: string, headers: Record<string, string>) => unknown;
  };
};

/** テストランナーが CJS の standardwebhooks を ESM として評価しないようにする。 */
export const Webhook = webhooks.Webhook;
export default webhooks;
