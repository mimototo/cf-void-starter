import { defineLiveStream } from "void/live";

/** 未ログインでもプラン一覧のライブ更新を受け取れる。 */
export const fateStream = defineLiveStream({
  allowAnonymousControl: true,
  id: "fate",
});
