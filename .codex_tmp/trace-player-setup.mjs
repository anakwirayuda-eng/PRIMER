import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = process.argv[2] || 'http://127.0.0.1:4273/';
const outputDir = process.argv[3] || 'D:/Dev/PRIMER/.codex_tmp/wilayah_showcase_trace';

fs.mkdirSync(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });

async function dump(label) {
    const body = (await page.locator('body').innerText()).replace(/\s+/g, ' ').slice(0, 2500);
    const buttons = await page.locator('button').evaluateAll((nodes) =>
        nodes.map((node) => ({
            text: node.innerText?.trim(),
            aria: node.getAttribute('aria-label'),
            testid: node.getAttribute('data-testid'),
        }))
    );
    await page.screenshot({ path: path.join(outputDir, `${label}.png`), fullPage: false });
    console.log(`STEP ${label}`);
    console.log(JSON.stringify({ url: page.url(), body, buttons }, null, 2));
}

async function maybeClick(locator) {
    if (await locator.isVisible().catch(() => false)) {
        await locator.click({ force: true });
        return true;
    }
    return false;
}

await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1500);
await dump('root');

await maybeClick(page.getByRole('button', { name: /Main Offline|offline/i }).first());
await page.waitForTimeout(1000);
await dump('after-offline');

const dbHeader = page.getByRole('heading', { name: /PRIMER DATABASE/i });
if (await dbHeader.isVisible().catch(() => false)) {
    await dbHeader.waitFor({ state: 'hidden', timeout: 180000 });
}
await dump('after-db');

const opening = page.getByRole('button', { name: 'Layar Pembuka' });
if (await opening.isVisible().catch(() => false)) {
    await opening.click({ force: true });
    await page.waitForTimeout(250);
    await dump('after-opening-click-1');
    if (await opening.isVisible().catch(() => false)) {
        await opening.click({ force: true });
        await page.waitForTimeout(500);
    }
}
await dump('after-opening');

const slotButton = page.getByRole('button', { name: /INISIASI SISTEM|AKSES DATABASE/i }).first();
await slotButton.waitFor({ state: 'visible', timeout: 30000 });
await slotButton.click({ force: true });
await page.waitForTimeout(800);
await dump('after-slot-open');

const newGameButton = page.getByRole('button', { name: /^INISIASI$|Game Baru/i }).first();
await newGameButton.click({ force: true });
await page.waitForTimeout(1800);
await dump('after-new-game');

const nameInput = page.locator('input[type="text"]').first();
await nameInput.fill('Dr Visual QA');
await dump('after-name');

const processButton = page.getByRole('button', { name: /PROSES DATA/i }).first();
await processButton.click({ force: true });
await page.waitForTimeout(600);
await dump('after-process-1');

const processButton2 = page.getByRole('button', { name: /PROSES DATA/i }).first();
if (await processButton2.isVisible().catch(() => false)) {
    await processButton2.click({ force: true });
    await page.waitForTimeout(600);
    await dump('after-process-2');
}

const authorizeButton = page.getByRole('button', { name: /SAHKAN/i }).first();
await authorizeButton.click({ force: true });
await page.waitForTimeout(4000);
await dump('after-authorize');

const dashboardSidebar = page.getByTestId('nav-sidebar-page-dashboard');
const dashboardMobile = page.getByTestId('nav-mobile-primary-dashboard');
const dashboardReady = await (async () => {
    const start = Date.now();
    while ((Date.now() - start) < 60000) {
        if (await dashboardSidebar.isVisible().catch(() => false)) return dashboardSidebar;
        if (await dashboardMobile.isVisible().catch(() => false)) return dashboardMobile;
        await page.waitForTimeout(400);
    }
    throw new Error('Dashboard nav did not appear after authorization.');
})();

if (dashboardReady) {
    const closeStoryButton = page.getByRole('button', { name: /Tutup cerita/i }).first();
    if (await closeStoryButton.isVisible().catch(() => false)) {
        await closeStoryButton.click({ force: true });
        await page.waitForTimeout(300);
    }
}

const navWilayah = page.getByTestId('nav-sidebar-page-wilayah');
await navWilayah.waitFor({ state: 'visible', timeout: 60000 });
await navWilayah.click({ force: true });
await page.waitForTimeout(1500);
await dump('after-open-wilayah');

const activePanel = page.getByTestId('wilayah-active-layer-panel');
await activePanel.waitFor({ state: 'visible', timeout: 60000 });

const mode2DButton = page.getByRole('button', { name: /2D DENAH/i }).first();
if (await mode2DButton.isVisible().catch(() => false)) {
    await mode2DButton.click({ force: true });
    await page.waitForTimeout(400);
}

await page.getByTestId('wilayah-layer-toggle-general').click({ force: true });
await page.waitForTimeout(700);
await page.screenshot({ path: path.join(outputDir, 'wilayah-general-desktop.png'), fullPage: false });

await page.evaluate(async () => {
    const { useGameStore } = await import('/src/store/useGameStore.js');
    const { generateVillageMap } = await import('/src/components/wilayah/map-utils.js');

    const state = useGameStore.getState();
    const mapData = generateVillageMap(160, 120, 12345, state.publicHealth.villageData);
    const affectedHouseIds = mapData.buildings
        .filter((building) => building.familyId)
        .slice(0, 4)
        .map((building) => building.id);

    useGameStore.setState((currentState) => ({
        ...currentState,
        publicHealth: {
            ...currentState.publicHealth,
            activeOutbreaks: [
                {
                    id: 'demo-outbreak-1',
                    type: 'diare',
                    typeData: { label: 'Diare' },
                    affectedHouseIds,
                    resolved: false,
                }
            ]
        }
    }));
});
await page.waitForTimeout(700);

await page.getByTestId('wilayah-layer-toggle-surveillance').click({ force: true });
await page.waitForTimeout(1400);
await page.screenshot({ path: path.join(outputDir, 'wilayah-surveillance-desktop.png'), fullPage: false });
await page.screenshot({ path: path.join(outputDir, 'wilayah-surveillance-outbreak-demo.png'), fullPage: false });

await browser.close();
