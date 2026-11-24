import { defineConfig } from "void/config";

/** Cloudflare へ渡す Worker 設定。リソースの作成と公開は cf を呼ぶ void deploy が行う。 */
export default defineConfig({
  cloudflare: {
    name: "cf-void-starter",
    observability: {
      enabled: true,
      logs: { enabled: true, head_sampling_rate: 1 },
      traces: { enabled: true, head_sampling_rate: 0.01 },
    },
  },
  routing: {
    typedRoutes: true,
  },
  worker: {
    // 同梱の workerd が受け付ける最新の compatibility_date。
    compatibility_date: "2026-11-23",
    compatibility_flags: ["nodejs_compat"],
  },
});
