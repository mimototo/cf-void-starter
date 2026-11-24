import { createFateServer } from "@nkzw/fate/server";
import { createDrizzleSourceAdapter } from "@nkzw/fate/server/drizzle";
import { createVoidFateLive } from "void-fate/server";
import { db } from "void/db";
import * as schema from "../../db/schema";
import { createContext } from "./context";
import { Root, type Plan } from "./views";

export type { Plan };
export { Root };

const sources = createDrizzleSourceAdapter({
  db,
  schema,
  views: Root,
});

export const fateLive = createVoidFateLive();

export const fateServer = createFateServer({
  context: ({ request }) => createContext({ request }),
  live: fateLive.live,
  roots: Root,
  sources,
});
