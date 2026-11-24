import { defineVoidFateRoute } from "void-fate/server";
import { fateLive, fateServer } from "../src/fate/server";
import { fateStream } from "../src/fate/live";

export const { GET, POST } = defineVoidFateRoute(fateServer, fateLive, {
  stream: fateStream,
});
