import { expect, test } from "@playwright/test";

test("no resource", async ({ page }) => {
  const response = await page.goto("/.well-known/webfinger");
  if (response === null) {
    throw new Error("No response");
  }
  expect(response.status()).toBe(400);
});

test("wrong format", async ({ page }) => {
  const response = await page.goto(
    "/.well-known/webfinger?resource=acct:user@name@somedomain.com"
  );
  if (response === null) {
    throw new Error("No response");
  }
  expect(response.status()).toBe(400);
});

test("wrong domain", async ({ page }) => {
  const response = await page.goto(
    "/.well-known/webfinger?resource=acct:username@wrongdomain.com"
  );
  if (response === null) {
    throw new Error("No response");
  }
  expect(response.status()).toBe(400);
});

test("empty user return", async ({ page }) => {
  const response = await page.goto(
    "/.well-known/webfinger?resource=acct:username@localhost"
  );
  if (response === null) {
    throw new Error("No response");
  }
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.subject).toBe("acct:username@localhost");
  expect(body.links).toHaveLength(0);
});
