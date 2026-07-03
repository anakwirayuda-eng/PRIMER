import { chromium } from 'playwright';

const url = process.argv[2] || 'http://127.0.0.1:4273/';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });

await page.goto(url, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2000);

const title = await page.title();
const body = (await page.locator('body').innerText()).replace(/\s+/g, ' ').slice(0, 3000);
const buttons = await page.locator('button').evaluateAll((nodes) =>
    nodes.map((node) => ({
        text: node.innerText?.trim(),
        aria: node.getAttribute('aria-label'),
        testid: node.getAttribute('data-testid'),
    }))
);

console.log(JSON.stringify({ title, body, buttons }, null, 2));

await browser.close();
