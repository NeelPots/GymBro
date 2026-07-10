import { chromium } from "playwright";

const shotDir = "C:\\Users\\neel1\\AppData\\Local\\Temp\\claude\\c--Users-neel1-Documents-adaptive-coach\\926a90b6-5b3a-4a23-8362-cfa1ab8ef1c9\\scratchpad";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 420, height: 1200 } });
await page.goto("http://localhost:3000/home", { waitUntil: "networkidle" });
await page.waitForTimeout(300);
await page.screenshot({ path: `${shotDir}\\banner-redesign-home.png`, fullPage: true });

const hasHorizontalScroll = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
console.log("Horizontal overflow present:", hasHorizontalScroll);

// Check the pictogram's computed transform-origin for the legs category
await page.goto("http://localhost:3000/exercises", { waitUntil: "networkidle" });
await page.fill('input[placeholder="Search exercises…"]', "Squats");
await page.waitForTimeout(300);
await page.click('a:has-text("Squats")');
await page.waitForURL(/\/exercises\/.+/);
await page.waitForTimeout(300);
const legOrigin = await page.evaluate(() => {
  const el = document.querySelector(".ca-leg-l");
  if (!el) return null;
  return getComputedStyle(el).transformOrigin;
});
console.log("Leg transform-origin (computed, px):", legOrigin);
await page.screenshot({ path: `${shotDir}\\banner-redesign-squat-detail.png` });

await browser.close();
