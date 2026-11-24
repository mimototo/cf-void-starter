# cf-void-starter

一人で新しい Web アプリを始めるためのボイラープレート。TypeScript の Cloudflare Workers アプリを、クローンして依存関係を入れればローカル実行、テスト、デプロイまで進める。

アプリは Void で作る。画面は React、サーバーは Hono、認証は Better Auth、データベースは Drizzle と Cloudflare D1。スタイルは Tailwind と Astryx、フォームの入力部品は React Aria Components。入力検証は Valibot、画面から読む公開データは fate。非同期処理は Cloudflare Queues。インフラの操作は Cloudflare CLI の `cf` を使う。テストは Vitest と Playwright。パッケージ管理は pnpm、リントは Oxlint、フォーマットは Oxfmt、ツールチェーンのバージョンは mise、タスクの実行順は Turborepo、コミット前の検査は Lefthook。

決済は Stripe Checkout、認証メールと請求メールは Resend、製品計測は PostHog。いずれもキーが無い状態でアプリは起動する。実行時の費用は、Cloudflare の Workers、D1、Queues の無料枠と、Stripe のテストモード、Resend の無料枠、PostHog の無料枠に収まる設定を初期値にする。PostHog のセッション録画はオフ。

## 必要条件

[mise](https://mise.jdx.dev/) を入れる。このリポジトリが Node.js、pnpm、Oxlint、Oxfmt、Lefthook、`cf` のバージョンを固定する。

## セットアップ

```sh
mise install
pnpm install
cp .env.example apps/web/.env
pnpm db:migrate
```

`.env` の値は自分のキーに置き換える。プレースホルダのままでも、画面の表示、メモ、テストは動く。Stripe、Resend、PostHog を使う処理だけが、キーの不足を返したり送信を省略したりする。

`pnpm install` は Lefthook の pre-commit フックを入れる。`core.hooksPath` が別の場所を指しているときは上書きしない。その場合にフックを入れるときは `lefthook install --force` を実行する。

## ローカル開発

```sh
pnpm dev
```

ブラウザで `http://127.0.0.1:5173` を開く。サンプルページでアカウントを作り、メモを保存し、プランの申し込みボタンから Checkout へ進める。

メールを実際に送るには、Resend で確認済みのドメインを用意し、`RESEND_API_KEY` と `EMAIL_FROM` を `apps/web/.env` に書く。Checkout を使うには、Stripe のテストモードで価格を作り、`STRIPE_SECRET_KEY`、`STRIPE_WEBHOOK_SECRET`、`STRIPE_PRICE_ID` を書く。計測を送るには `VITE_POSTHOG_PROJECT_TOKEN` を書く。`VITE_` で始まる値は、本番ビルドでは `.env` から読まれない。ビルドするシェルに渡す。

```sh
VITE_POSTHOG_PROJECT_TOKEN=phc_replace_me pnpm build
```

ローカルの Webhook は、Stripe CLI から `http://127.0.0.1:5173/api/stripe/webhook` へ転送する。

## マイグレーション

スキーマは `apps/web/db/schema.ts`。変更したあとは SQL を生成して確認し、ローカルへ適用する。

```sh
pnpm db:generate
pnpm db:migrate
```

生成された `apps/web/db/migrations/` をコミットする。`pnpm deploy` は未適用のマイグレーションを本番の D1 に適用する。サンプルプランの行が要るときは `pnpm db:seed` を実行する。このコマンドはローカルデータベースを作り直し、マイグレーションのあとでシードを入れる。

## デプロイ

初回だけ Cloudflare にログインする。

```sh
cf auth login
pnpm deploy
```

`pnpm deploy` はアプリをビルドし、プロジェクト内の `cf` で Worker、D1、Queue を作成し、マイグレーションを適用して公開する。本番のサーバー秘密情報はデプロイ前に登録する。

```sh
pnpm --filter @cf-void-starter/web exec void secret put STRIPE_SECRET_KEY
pnpm --filter @cf-void-starter/web exec void secret put STRIPE_WEBHOOK_SECRET
pnpm --filter @cf-void-starter/web exec void secret put STRIPE_PRICE_ID
pnpm --filter @cf-void-starter/web exec void secret put RESEND_API_KEY
pnpm --filter @cf-void-starter/web exec void secret put EMAIL_FROM
```

公開後のリソース確認には `cf` を使う。例として `cf d1 list`。

## 新しいプロジェクトを始める

GitHub でこのリポジトリを Template repository にしている場合は、Use this template から新しいリポジトリを作る。そうでない場合はクローンする。

名前を置き換えて依存関係を入れ直す。

```sh
node scripts/new-project.mjs my-app
pnpm install
```

`my-app` は小文字、数字、ハイフンだけにする。コマンドはパッケージ名、Worker 名、この README の見出しにある `cf-void-starter` を置き換える。

サンプルが不要なら、次を削除してから `pnpm db:generate` でマイグレーションを作り直す。

- `apps/web/pages/`
- `apps/web/routes/`
- `apps/web/queues/`
- `apps/web/src/`
- `apps/web/db/`
- `apps/web/auth.ts`
- `packages/domain/`

認証、データベース、Queue を残す場合は、対応するファイルだけを残す。

## コマンド

リポジトリのルートで実行する。

- `pnpm dev` で開発サーバーを起動する。
- `pnpm lint` で Oxlint を実行する。
- `pnpm fmt` で Oxfmt を実行する。`pnpm fmt:check` は書き込まない。
- `pnpm typecheck` で型を検査する。
- `pnpm test` で Vitest を実行する。
- `pnpm test:e2e` で Playwright のスモークテストを実行する。開発サーバーは mise が固定した Node.js で起動する。
- `pnpm deploy` で Cloudflare へ公開する。
