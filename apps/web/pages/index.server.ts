import { defineHandler, type InferProps } from "void";
import { db, desc, eq } from "void/db";
import { getUser } from "void/auth";
import { notes, plan } from "@schema";

export type Props = InferProps<typeof loader>;

export const loader = defineHandler(async (c) => {
  const checkoutParam = new URL(c.req.url).searchParams.get("checkout");
  const checkout = checkoutParam === "success" || checkoutParam === "cancel" ? checkoutParam : null;
  const user = getUser();

  const plans = await db.select({ id: plan.id, name: plan.name }).from(plan).orderBy(plan.id);

  if (!user) {
    return { checkout, notes: [], plans };
  }

  const rows = await db
    .select({
      createdAt: notes.createdAt,
      id: notes.id,
      text: notes.text,
    })
    .from(notes)
    .where(eq(notes.userId, user.id))
    .orderBy(desc(notes.createdAt));

  return { checkout, notes: rows, plans };
});
