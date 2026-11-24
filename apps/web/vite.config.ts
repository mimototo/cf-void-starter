import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { voidReact } from "@void/react/plugin";
import { fate } from "react-fate/vite";
import { defineConfig } from "vite";
import { voidPlugin } from "void";

const standardWebhooksShim = fileURLToPath(
  new URL("./tests/shims/standardwebhooks.ts", import.meta.url),
);

export default defineConfig(({ mode }) => ({
  plugins: [
    voidPlugin(),
    voidReact({ react: { compiler: true } }),
    tailwindcss(),
    fate({
      module: "./src/fate/server.ts",
      transport: "void",
    }),
  ],
  ...(mode === "test" ? { resolve: { alias: { standardwebhooks: standardWebhooksShim } } } : {}),
}));
