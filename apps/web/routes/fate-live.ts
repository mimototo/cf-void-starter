import { defineVoidFateLiveRoute } from "void-fate/server";
import { fateStream } from "../src/fate/live";

export const { GET, POST } = defineVoidFateLiveRoute(fateStream);
