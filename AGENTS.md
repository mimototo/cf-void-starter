# エージェント向けルール

このリポジトリで作業するときは pstack（@poteto のスキルセット、poteto-mode のスタイルとそのスキル）を使う。

コードコメントとドキュメントは日本語で書く。

最終設計を最初から計画したものとして全面的に書き直してください。読者はこの会話の経緯を一切知らない新規参加者とする。経緯を知らないと意味が通じない文は残さないこと。

## 実装

- リンターは Oxlint、フォーマッターは Oxfmt。コミット前に Lefthook が Oxlint、Oxfmt、型チェックを実行する。
- 秘密情報はソースに書かない。名前は `apps/web/env.ts` と `.env.example` に合わせ、ローカル値は `apps/web/.env`、本番のサーバー秘密情報は `void secret put` に置く。
- Cloudflare のリソース定義は `apps/web/void.config.ts` と、D1 スキーマ、`queues/` の消費者から決まる。公開は `pnpm deploy` がプロジェクト内の `cf` を使って行う。
- Void のファイル規約を変える前に、`apps/web/node_modules/void/docs/` の該当ガイドを読む。
- サンプルは `apps/web/pages/`、`apps/web/routes/api/`、`apps/web/routes/fate.ts`、`apps/web/routes/fate-live.ts`、`apps/web/queues/`、`apps/web/src/`、`apps/web/db/`、`packages/domain/` にある。新しいアプリで不要なら、そのファイルを削除してマイグレーションを作り直す。
