import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = process.argv[2] || 'http://127.0.0.1:5173/';
const outputDir = process.argv[3] || 'D:/Dev/PRIMER/.codex_tmp/wilayah_overview_only';

fs.mkdirSync(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });

async function maybeClick(locator) {
    if (await locator.isVisible().catch(() => false)) {
        await locator.click({ force: true });
        return true;
    }
    return false;
}

await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1500);

await maybeClick(page.getByRole('button', { name: /Main Offline|offline/i }).first());
await page.waitForTimeout(1000);

const dbHeader = page.getByRole('heading', { name: /PRIMER DATABASE/i });
if (await dbHeader.isVisible().catch(() => false)) {
    await dbHeader.waitFor({ state: 'hidden', timeout: 180000 });
}

const opening = page.getByRole('button', { name: 'Layar Pembuka' });
if (await opening.isVisible().catch(() => false)) {
    await opening.click({ force: true });
    await page.waitForTimeout(250);
    if (await opening.isVisible().catch(() => false)) {
        await opening.click({ force: true });
        await page.waitForTimeout(500);
    }
}

const slotButton = page.getByRole('button', { name: /INISIASI SISTEM|AKSES DATABASE/i }).first();
await slotButton.waitFor({ state: 'visible', timeout: 30000 });
await slotButton.click({ force: true });
await page.waitForTimeout(800);

const newGameButton = page.getByRole('button', { name: /^INISIASI$|Game Baru/i }).first();
await newGameButton.click({ force: true });
await page.waitForTimeout(1800);

const nameInput = page.locator('input[type="text"]').first();
await nameInput.fill('Dr Overview QA');

const processButton = page.getByRole('button', { name: /PROSES DATA/i }).first();
await processButton.click({ force: true });
await page.waitForTimeout(600);

const processButton2 = page.getByRole('button', { name: /PROSES DATA/i }).first();
if (await processButton2.isVisible().catch(() => false)) {
    await processButton2.click({ force: true });
    await page.waitForTimeout(600);
}

const authorizeButton = page.getByRole('button', { name: /SAHKAN/i }).first();
await authorizeButton.click({ force: true });
await page.waitForTimeout(4000);

const closeStoryButton = page.getByRole('button', { name: /Tutup cerita/i }).first();
if (await closeStoryButton.isVisible().catch(() => false)) {
    await closeStoryButton.click({ force: true });
    await page.waitForTimeout(300);
}

const navWilayah = page.getByTestId('nav-sidebar-page-wilayah');
await navWilayah.waitFor({ state: 'visible', timeout: 60000 });
await navWilayah.click({ force: true });
await page.waitForTimeout(1800);

await page.getByTestId('wilayah-active-layer-panel').waitFor({ state: 'visible', timeout: 60000 });
await page.screenshot({ path: path.join(outputDir, 'wilayah-overview-desktop.png'), fullPage: false });

await browser.close();
