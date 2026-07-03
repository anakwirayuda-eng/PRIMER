import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const url = process.argv[2] || 'http://127.0.0.1:4273/';
const outDir = process.argv[3] || 'D:/Dev/PRIMER/.codex_tmp/flow_trace';

fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });

async function dump(label) {
    const safe = label.replace(/[^a-z0-9-_]+/gi, '_').toLowerCase();
    const body = (await page.locator('body').innerText()).replace(/\s+/g, ' ').slice(0, 2500);
    const buttons = await page.locator('button').evaluateAll((nodes) =>
        nodes.map((node) => ({
            text: node.innerText?.trim(),
            aria: node.getAttribute('aria-label'),
            testid: node.getAttribute('data-testid'),
        }))
    );
    await page.screenshot({ path: path.join(outDir, `${safe}.png`), fullPage: false });
    fs.writeFileSync(
        path.join(outDir, `${safe}.json`),
        JSON.stringify({ label, url: page.url(), body, buttons }, null, 2),
        'utf8'
    );
    console.log(`STEP ${label}`);
    console.log(JSON.stringify({ url: page.url(), body, buttons }, null, 2));
}

await page.goto(url, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2000);
await dump('01-root');

const offlineButton = page.getByRole('button', { name: /Main Offline|offline/i }).first();
if (await offlineButton.isVisible().catch(() => false)) {
    await offlineButton.click();
    await page.waitForTimeout(3000);
    await dump('02-after-offline');
}

await browser.close();
