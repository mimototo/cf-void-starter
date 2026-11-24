import { useShared } from "@void/react";
import type { Props } from "./index.server";
import { AuthPanel } from "./auth-panel";
import { NotePanel } from "./note-panel";
import { PlanPanel } from "./plan-panel";

/** サンプルの 1 ページ。認証、メモ、プラン、Checkout を同じ画面に置く。 */
export default function HomePage({ checkout, notes, plans }: Props) {
  const shared = useShared();
  const user = shared.auth?.user ?? null;

  return (
    <main className="mx-auto grid min-h-svh max-w-2xl gap-8 px-6 py-10 text-primary">
      <header className="grid gap-2">
        <h1 className="text-3xl">個人プロジェクト</h1>
        <p>このページは、認証、メモ、決済、計測のサンプルです。</p>
      </header>
      {checkout === "success" ? (
        <p>Checkout から戻りました。支払いの確定は Webhook が処理します。</p>
      ) : null}
      {checkout === "cancel" ? <p>Checkout をキャンセルしました。</p> : null}
      <AuthPanel signedInName={user?.name ?? null} />
      {user ? <NotePanel notes={notes} /> : <p>メモの保存にはサインインが必要です。</p>}
      <PlanPanel plans={plans} signedIn={user !== null} />
    </main>
  );
}
