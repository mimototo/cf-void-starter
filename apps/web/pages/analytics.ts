import posthog from "posthog-js";

let started = false;

/** トークンがあるときだけ PostHog を始める。セッション録画は使わない。 */
export function startAnalytics(): void {
  if (started || typeof window === "undefined") {
    return;
  }

  const token = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN;
  if (!token) {
    return;
  }

  started = true;
  posthog.init(token, {
    api_host: import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com",
    capture_pageview: true,
    defaults: "2026-08-30",
    disable_session_recording: true,
  });
}

export function captureCheckoutStarted(): void {
  startAnalytics();
  if (typeof window === "undefined" || !import.meta.env.VITE_POSTHOG_PROJECT_TOKEN) {
    return;
  }
  posthog.capture("checkout_started");
}
