const { chromium } = require("playwright");
const fs = require("node:fs");
(async () => {
  fs.mkdirSync(".impeccable/review", { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    executablePath:
      process.env.CHROMIUM_PATH ||
      (fs.existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined),
    args: [
      "--no-sandbox",
      "--use-gl=angle",
      "--use-angle=swiftshader",
      "--enable-unsafe-swiftshader",
    ],
  });
  for (const [name, width, height] of [
    ["desktop", 1440, 1000],
    ["mobile", 390, 844],
  ]) {
    const page = await browser.newPage({
      viewport: { width, height },
      deviceScaleFactor: 1,
    });
    page.setDefaultTimeout(60000);
    page.setDefaultNavigationTimeout(60000);
    page.on("pageerror", (e) => console.log(`${name} ERROR: ${e.message}`));
    page.on("console", (m) => {
      if (m.type() === "error") console.log(`${name} CONSOLE: ${m.text()}`);
    });
    await page.goto("http://127.0.0.1:5173", { waitUntil: "networkidle" });
    await page.waitForFunction(() => !!window.isola, { timeout: 30000 });
    await page.evaluate(() => {
      window.isola.paused = true;
      window.isola.renderRequested = true;
    });
    await page.waitForTimeout(2200);
    await page.screenshot({ path: `.impeccable/review/${name}.png` });
    console.log(
      name,
      await page.evaluate(() => ({
        stats: window.isola.stats(),
        canvas: !!document.querySelector("#world canvas"),
        cards: document.querySelectorAll(".catalog-card").length,
        overflow: document.documentElement.scrollWidth > innerWidth,
      })),
    );
    if (name === "mobile") {
      await page.click("#mobile-catalog");
      await page.waitForTimeout(400);
      await page.screenshot({ path: ".impeccable/review/mobile-catalog.png" });
    }
    await page.close();
  }
  await browser.close();
})();
