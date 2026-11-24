import { expect, test } from "@playwright/test";

test("トップページを表示する", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "個人プロジェクト" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "プラン" })).toBeVisible();
  await expect(page.getByText("公開中のプランはありません。")).toBeVisible();
});

test("未ログインのメモ作成を拒否する", async ({ request }) => {
  const response = await request.post("/api/notes", {
    data: { text: "こんにちは" },
  });
  expect(response.status()).toBe(401);
});
