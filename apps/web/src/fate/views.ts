import { dataView, type Entity, list } from "@nkzw/fate/server";
import type { plan } from "../../db/schema";

type PlanRow = typeof plan.$inferSelect;

/** クライアントへ公開するプランの項目。価格 ID は含めない。 */
export const planDataView = dataView<PlanRow>("Plan")({
  id: true,
  name: true,
});

export type Plan = Entity<typeof planDataView, "Plan">;

export const Root = {
  plans: list(planDataView, { orderBy: { id: "asc" } }),
};
