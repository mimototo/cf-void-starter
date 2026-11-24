import { readFile, writeFile } from "node:fs/promises";

const name = process.argv[2];
const token = "cf-void-starter";
const files = [
  "package.json",
  "apps/web/package.json",
  "packages/domain/package.json",
  "apps/web/void.config.ts",
  "README.md",
];

if (!name || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
  console.error("使い方: node scripts/new-project.mjs <name>");
  console.error("name は小文字、数字、ハイフンだけにする。例: node scripts/new-project.mjs my-app");
  process.exit(1);
}

for (const file of files) {
  const source = await readFile(file, "utf8");
  await writeFile(file, source.replaceAll(token, name));
}

console.log(`${token} を ${name} に置き換えた。続けて pnpm install を実行する。`);
