import { createNoteSchema } from "@cf-void-starter/domain";
import { defineHandler } from "void";
import { db, desc, eq } from "void/db";
import { requireAuth } from "void/auth";
import { notes } from "@schema";

/** サインイン中のユーザーのメモを新しい順に返す。 */
export const GET = defineHandler(async (c) => {
  const user = requireAuth(c);
  const rows = await db
    .select({
      createdAt: notes.createdAt,
      id: notes.id,
      text: notes.text,
    })
    .from(notes)
    .where(eq(notes.userId, user.id))
    .orderBy(desc(notes.createdAt));

  return { notes: rows };
});

/** メモを 1 件保存する。本文は Valibot で検証する。 */
export const POST = defineHandler.withValidator({
  body: createNoteSchema,
})(async (c, { body }) => {
  const user = requireAuth(c);
  const id = crypto.randomUUID();

  await db.insert(notes).values({
    id,
    text: body.text,
    userId: user.id,
  });

  return { id };
});
