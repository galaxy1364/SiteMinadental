import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("public identity, contact and exact owner map link are wired", async () => {
  const page = await read("../app/page.tsx");
  assert.match(page, /دکتر مینا مازندرانی/);
  assert.match(page, /\+989105306142/);
  assert.match(page, /0x3f8de56cb097914d:0xfd5e3dc570462e50/);
  assert.match(page, /wa\.me\/989105306142/);
  assert.match(page, /waze\.com\/ul/);
  assert.match(page, /neshan\.org\/maps/);
  assert.match(page, /balad\.ir\/search/);
  assert.doesNotMatch(page, /۵۰۰۰|۹۸٪|رتبه اول|تضمین درمان/);
});

test("site and management app stay isolated", async () => {
  const [page, client, layout] = await Promise.all([
    read("../app/page.tsx"),
    read("../app/site-client.tsx"),
    read("../app/layout.tsx"),
  ]);
  const productSource = `${page}\n${client}\n${layout}`;
  assert.doesNotMatch(productSource, /base44/i);
  assert.doesNotMatch(productSource, /mock|fake success|placeholder api/i);
});

test("PWA manifest and automatic update lifecycle are complete", async () => {
  const [manifestText, worker, client, versionText] = await Promise.all([
    read("../public/manifest.webmanifest"),
    read("../public/sw.js"),
    read("../app/site-client.tsx"),
    read("../public/version.json"),
  ]);
  const manifest = JSON.parse(manifestText);
  const version = JSON.parse(versionText);
  assert.equal(manifest.lang, "fa");
  assert.equal(manifest.dir, "rtl");
  assert.equal(manifest.display, "standalone");
  assert.equal(manifest.icons[0].src, "/mina-logo.jpeg");
  assert.equal(version.version, "2026.08.05.1");
  assert.match(worker, /skipWaiting/);
  assert.match(worker, /clients\.claim/);
  assert.match(worker, /networkFirst/);
  assert.match(client, /beforeinstallprompt/);
  assert.match(client, /serviceWorker\.register/);
  assert.match(client, /registration\.update/);
});

test("deployed logo is byte-identical to the owner-provided official logo", async () => {
  const logo = await readFile(new URL("../public/mina-logo.jpeg", import.meta.url));
  const digest = createHash("sha256").update(logo).digest("hex");
  assert.equal(digest, "61f9763ef5ebd4c41b23732b9d794fc3a49e6adca879a5d66f47f362c20111c8");
});
