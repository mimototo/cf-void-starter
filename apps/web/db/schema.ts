import { sql } from "void/db";
import { sqliteTable, text } from "void/schema-d1";

/** サンプルの公開プラン。決済価格そのものは環境変数に置く。 */
export const plan = sqliteTable("plans", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});

/** サインインしたユーザーのメモ。userId は Better Auth のユーザー ID。 */
export const notes = sqliteTable("notes", {
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  id: text("id").primaryKey(),
  text: text("text").notNull(),
  userId: text("user_id").notNull(),
});

/** Stripe イベントの履行状態。主キーはイベント ID で、再送しても行は増えない。 */
export const billingEvents = sqliteTable("billing_events", {
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  customerEmail: text("customer_email"),
  id: text("id").primaryKey(),
  status: text("status", { enum: ["pending", "sent"] }).notNull(),
});
