import { chromium } from "playwright";

const shotDir = "C:\\Users\\neel1\\AppData\\Local\\Temp\\claude\\c--Users-neel1-Documents-adaptive-coach\\926a90b6-5b3a-4a23-8362-cfa1ab8ef1c9\\scratchpad";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 420, height: 900 } });
await page.goto("http://localhost:3000/home", { waitUntil: "networkidle" });
await page.waitForTimeout(300);

const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
console.log("Page height:", pageHeight);

await page.evaluate((h) => window.scrollTo(0, h * 0.44), pageHeight);
await page.waitForTimeout(200);
await page.screenshot({ path: `${shotDir}\\banner-middle.png` });

await page.evaluate((h) => window.scrollTo(0, h * 0.83), pageHeight);
await page.waitForTimeout(200);
await page.screenshot({ path: `${shotDir}\\banner-bottom.png` });

const ribbonCount = await page.evaluate(() => document.querySelectorAll('[aria-hidden="true"] > div').length);
console.log("Ribbon divs found:", ribbonCount);

await browser.close();
