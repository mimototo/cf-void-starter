import { Button } from "@astryxdesign/core/Button";
import { VStack } from "@astryxdesign/core/VStack";
import { samplePlanId } from "@cf-void-starter/domain";
import { Component, type ReactNode, Suspense, useEffect, useState } from "react";
import { useRequest, useView, view, type ViewRef } from "react-fate";
import type { Plan } from "../src/fate/views";
import { captureCheckoutStarted } from "./analytics";

const PlanView = view<Plan>()({
  id: true,
  name: true,
});

class PlanBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function isPlanRef(value: {
  readonly __typename: string;
  readonly id: string | number;
}): value is ViewRef<"Plan"> {
  return value.__typename === "Plan";
}

function PlanName({ plan }: { plan: ViewRef<"Plan"> }) {
  const data = useView(PlanView, plan);
  return <span>{data.name}</span>;
}

function PlanList({ signedIn }: { signedIn: boolean }) {
  const { plans } = useRequest({ plans: { list: PlanView } });
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const items = Array.isArray(plans) ? plans : [];

  async function checkout() {
    captureCheckoutStarted();
    setPending(true);
    setError(null);
    const response = await fetch("/api/checkout", {
      body: JSON.stringify({ planId: samplePlanId }),
      headers: { "content-type": "application/json" },
      method: "POST",
    });
    setPending(false);
    if (!response.ok) {
      setError("Checkout を開始できませんでした。Stripe の環境変数を確認してください。");
      return;
    }
    const body: unknown = await response.json();
    if (body && typeof body === "object" && "url" in body && typeof body.url === "string") {
      window.location.assign(body.url);
      return;
    }
    setError("Checkout の URL を受け取れませんでした。");
  }

  return (
    <VStack className="gap-3">
      {items.length === 0 ? <p>公開中のプランはありません。</p> : null}
      {items.map((item) => (
        <div className="flex items-center justify-between gap-3" key={String(item.id)}>
          {isPlanRef(item) ? <PlanName plan={item} /> : null}
          {String(item.id) === samplePlanId && signedIn ? (
            <Button isDisabled={pending} label="申し込む" onClick={() => void checkout()} />
          ) : null}
        </div>
      ))}
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </VStack>
  );
}

function StaticPlans({ plans }: { plans: Array<{ id: string; name: string }> }) {
  if (plans.length === 0) {
    return <p>公開中のプランはありません。</p>;
  }

  return (
    <ul className="grid gap-2">
      {plans.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}

/** 最初の一覧はデータベースから描く。ブラウザでは fate が同じ一覧を読む。 */
export function PlanPanel({
  plans,
  signedIn,
}: {
  plans: Array<{ id: string; name: string }>;
  signedIn: boolean;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="grid gap-3">
      <h2 className="text-xl">プラン</h2>
      {mounted ? (
        <PlanBoundary fallback={<StaticPlans plans={plans} />}>
          <Suspense fallback={<StaticPlans plans={plans} />}>
            <PlanList signedIn={signedIn} />
          </Suspense>
        </PlanBoundary>
      ) : (
        <StaticPlans plans={plans} />
      )}
    </section>
  );
}
