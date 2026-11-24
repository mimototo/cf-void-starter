import { defineSeed } from "void/seed";
import { samplePlanId } from "@cf-void-starter/domain";

/** サンプルプランを 1 件入れる。既存の行は置き換えない。 */
export default defineSeed<typeof import("./schema")>(async ({ db, schema }) => {
  await db
    .insert(schema.plan)
    .values({ id: samplePlanId, name: "サンプルプラン" })
    .onConflictDoNothing();
});
