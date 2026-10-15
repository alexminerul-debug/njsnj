const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const { existsSync } = require("node:fs");
const { spawn } = require("node:child_process");
const path = require("node:path");

const baseURL = process.env.TEST_BASE_URL || "http://127.0.0.1:4174";
let server;
let browser;
let checks = 0;
const pass = (message) => {
  checks++;
  console.log(`PASS ${message}`);
};

async function startServer() {
  if (process.env.TEST_BASE_URL) return;
  server = spawn(
    process.execPath,
    [
      path.resolve("node_modules/vite/bin/vite.js"),
      "--host",
      "127.0.0.1",
      "--port",
      "4174",
      "--strictPort",
    ],
    { stdio: "pipe" },
  );
  let output = "";
  server.stdout.on("data", (d) => (output += d));
  server.stderr.on("data", (d) => (output += d));
  for (let i = 0; i < 60; i++) {
    if (server.exitCode !== null)
      throw new Error(`Test server failed: ${output}`);
    try {
      const response = await fetch(baseURL);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Test server did not become ready: ${output}`);
}

async function point(page, x, y, z) {
  return page.evaluate(
    ({ x, y, z }) => {
      const world = window.isola;
      const p = world.camera.position
        .clone()
        .set(x, y, z)
        .project(world.camera);
      const r = world.renderer.domElement.getBoundingClientRect();
      return {
        x: r.left + ((p.x + 1) / 2) * r.width,
        y: r.top + ((1 - p.y) / 2) * r.height,
      };
    },
    { x, y, z },
  );
}

(async () => {
  await startServer();
  const executablePath =
    process.env.CHROMIUM_PATH ||
    (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined);
  browser = await chromium.launch({
    headless: true,
    executablePath,
    args: [
      "--no-sandbox",
      "--use-gl=angle",
      "--use-angle=swiftshader",
      "--enable-unsafe-swiftshader",
    ],
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    acceptDownloads: true,
  });
  const page = await context.newPage();
  page.setDefaultTimeout(60000);
  page.setDefaultNavigationTimeout(60000);
  const errors = [];
  page.on("pageerror", (e) => {
    errors.push(e.message);
    console.error("Browser error:", e.message);
  });
  await page.goto(baseURL, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => !!window.isola);
  await page.waitForSelector("#loading", { state: "detached" });
  const initial = await page.evaluate(() => {
    window.isola.paused = true;
    return window.isola.stats();
  });
  assert.equal(initial.animals, 15);
  assert.equal(await page.locator(".catalog-card").count(), 8);
  assert.ok(
    await page.evaluate(
      () => window.isola.renderer.info.render.triangles > 1000,
    ),
  );
  pass(
    "3D world starts with 15 animals, actual geometry, and 8 catalog species",
  );

  await page.fill("#catalog-search", "fox");
  assert.equal(await page.locator(".catalog-card").count(), 1);
  await page.fill("#catalog-search", "zzzz");
  assert.equal(await page.locator(".catalog-empty").isVisible(), true);
  await page.fill("#catalog-search", "");
  pass("Catalog search filters real items and handles empty results");

  await page.click('[data-item="fox"]');
  const placePoint = await point(page, 0, 0.6, 2);
  await page.mouse.click(placePoint.x, placePoint.y);
  assert.equal(await page.evaluate(() => window.isola.stats().animals), 16);
  const fox = await page.evaluate(() => {
    const e = window.isola.entities.at(-1);
    return {
      id: e.id,
      x: e.model.position.x,
      y: e.model.position.y,
      z: e.model.position.z,
    };
  });
  pass("A catalog choice places a real animal through canvas interaction");

  await page.keyboard.press("Escape");
  const foxPoint = await point(page, fox.x, fox.y + 0.8, fox.z);
  await page.mouse.click(foxPoint.x, foxPoint.y);
  await page.waitForFunction(
    () => !document.querySelector("#inspector").hidden,
    null,
    { timeout: 10000 },
  );
  assert.equal(await page.locator("#inspector h3").textContent(), "Red fox");
  await page.click("#feed");
  assert.equal(
    await page.evaluate(
      (id) => window.isola.entities.find((e) => e.id === id).fed,
      fox.id,
    ),
    true,
  );
  assert.match(await page.locator(".animal-mood").textContent(), /well-fed/);
  await page.click(".inspector-close");
  pass("Animals can be selected and fed with visible happiness feedback");

  await page.click('[data-tool="remove"]');
  await page.mouse.click(foxPoint.x, foxPoint.y);
  assert.equal(await page.evaluate(() => window.isola.stats().animals), 15);
  await page.click("#undo");
  assert.equal(await page.evaluate(() => window.isola.stats().animals), 16);
  await page.click("#undo");
  assert.equal(await page.evaluate(() => window.isola.stats().animals), 15);
  pass("Remove and undo restore the correct island state");

  await page.keyboard.press("Escape");
  await page.click('[data-category="nature"]');
  assert.equal(await page.locator(".catalog-card").count(), 6);
  await page.click('[data-item="oak"]');
  const naturePoint = await point(page, 2, 0.65, 3.5);
  await page.mouse.click(naturePoint.x, naturePoint.y);
  assert.equal(
    await page.evaluate(() => window.isola.stats().trees),
    initial.trees + 1,
  );
  await page.keyboard.press("Escape");
  await page.click('[data-category="build"]');
  await page.click('[data-item="bench"]');
  await page.mouse.click(placePoint.x, placePoint.y);
  assert.equal(
    await page.evaluate(() => window.isola.entities.at(-1).type),
    "bench",
  );
  pass("Nature and building catalogs place persistent world objects");

  await page.keyboard.press("Escape");
  await page.click("#weather");
  await page.click('[data-weather="rainy"]');
  assert.equal(await page.evaluate(() => window.isola.rain.visible), true);
  await page.click("#night");
  assert.equal(await page.evaluate(() => window.isola.night), true);
  await page.click('[data-speed="2"]');
  assert.equal(await page.evaluate(() => window.isola.speed), 2);
  await page.click('[data-close="weather-panel"]');
  pass("Rain, night lighting, and simulation speed change the live world");

  const beforeZoom = await page.evaluate(() =>
    window.isola.camera.position.distanceTo(window.isola.controls.target),
  );
  await page.click("#zoom-in");
  const afterZoom = await page.evaluate(() =>
    window.isola.camera.position.distanceTo(window.isola.controls.target),
  );
  assert.ok(afterZoom < beforeZoom);
  await page.click("#fit-view");
  await page.click("#pause");
  assert.equal(await page.evaluate(() => window.isola.paused), false);
  await page.click("#pause");
  pass("Camera zoom, reset, and wildlife pause controls work");

  await page.click("#save");
  const savedCount = await page.evaluate(() => window.isola.entities.length);
  await page.reload();
  await page.waitForFunction(() => !!window.isola);
  await page.waitForSelector("#loading", { state: "detached" });
  assert.equal(
    await page.evaluate(() => window.isola.entities.length),
    savedCount,
  );
  assert.equal(await page.evaluate(() => window.isola.night), true);
  assert.equal(await page.evaluate(() => window.isola.weather), "rainy");
  pass("Saved objects, weather, and time restore after reload");

  await page.click("#settings");
  const downloaded = page.waitForEvent("download");
  await page.click("#export-world");
  const download = await downloaded;
  assert.match(download.suggestedFilename(), /isola.json$/);
  const exported = JSON.parse(
    require("node:fs").readFileSync(await download.path(), "utf8"),
  );
  assert.equal(exported.entities.length, savedCount);
  await page.setInputFiles("#import-file", {
    name: "invalid.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"version":1,"entities":[{"type":"fox","x":999}]}'),
  });
  await page.waitForFunction(() =>
    document.querySelector("#toast span").textContent.includes("invalid"),
  );
  assert.equal(
    await page.evaluate(() => window.isola.entities.length),
    savedCount,
  );
  await page.setInputFiles("#import-file", {
    name: "island.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(exported)),
  });
  await page.waitForFunction(() =>
    document.querySelector("#toast span").textContent.includes("Welcome back"),
  );
  assert.equal(
    await page.evaluate(() => window.isola.entities.length),
    savedCount,
  );
  pass(
    "Export produces a real world file; import validates before replacing it",
  );

  await page.click("#help-button");
  assert.equal(await page.locator("#help-dialog").isVisible(), true);
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("#help-dialog").isVisible(), false);
  await page.click("#settings");
  await page.click("#reset-world");
  await page.click("#cancel-reset");
  assert.equal(
    await page.evaluate(() => window.isola.entities.length),
    savedCount,
  );
  await page.click("#settings");
  await page.click("#reset-world");
  await page.click("#confirm-reset");
  assert.equal(await page.evaluate(() => window.isola.stats().animals), 15);
  assert.equal(await page.evaluate(() => window.isola.night), false);
  pass("Help supports Escape, and destructive reset requires a clear choice");

  await page.close();

  const mobile = await context.newPage();
  await mobile.setViewportSize({ width: 390, height: 844 });
  mobile.on("pageerror", (e) => errors.push(e.message));
  mobile.setDefaultTimeout(60000);
  mobile.setDefaultNavigationTimeout(60000);
  await mobile.goto(baseURL, { waitUntil: "domcontentloaded" });
  await mobile.waitForFunction(() => !!window.isola);
  await mobile.waitForSelector("#loading", { state: "detached" });
  assert.equal(
    await mobile.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  );
  await mobile.click("#mobile-catalog");
  await mobile.click('[data-item="rabbit"]');
  assert.equal(await mobile.evaluate(() => window.scrollY), 0);
  assert.equal(
    await mobile.evaluate(() => document.querySelector("#app").scrollTop),
    0,
  );
  assert.equal(
    await mobile
      .locator("#world")
      .evaluate((e) => e.getBoundingClientRect().top),
    0,
  );
  assert.equal(
    await mobile.evaluate(
      () => document.documentElement.scrollHeight > innerHeight,
    ),
    false,
  );
  assert.equal(
    await mobile
      .locator(".sidebar")
      .evaluate((e) => e.classList.contains("mobile-open")),
    false,
  );
  const mobileCount = await mobile.evaluate(() => window.isola.stats().animals);
  const mobilePoint = await point(mobile, 0, 0.6, 2);
  await mobile.mouse.click(mobilePoint.x, mobilePoint.y);
  await mobile.waitForFunction(
    (expected) => window.isola.stats().animals === expected,
    mobileCount + 1,
  );
  assert.equal(
    await mobile.evaluate(() => window.isola.stats().animals),
    mobileCount + 1,
  );
  pass("Phone layout has no overflow and supports catalog-to-canvas placement");

  assert.deepEqual(errors, []);
  pass("No browser runtime errors during the complete play loop");
  console.log(`\n${checks} functional checks passed.`);
})()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await browser?.close();
    server?.kill("SIGTERM");
  });
