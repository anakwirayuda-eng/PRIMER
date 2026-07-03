import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = process.argv[2] || 'http://127.0.0.1:5173/';
const outputDir = process.argv[3] || 'D:/Dev/PRIMER/.codex_tmp/wilayah_showcase_mobile';

fs.mkdirSync(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
});
const page = await context.newPage();

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
await nameInput.fill('Dr Mobile QA');

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

const dashboardSidebar = page.getByTestId('nav-sidebar-page-dashboard');
const dashboardMobile = page.getByTestId('nav-mobile-primary-dashboard');
await (async () => {
    const start = Date.now();
    while ((Date.now() - start) < 60000) {
        if (await dashboardSidebar.isVisible().catch(() => false)) return;
        if (await dashboardMobile.isVisible().catch(() => false)) return;
        await page.waitForTimeout(400);
    }
    throw new Error('Dashboard nav did not appear after authorization.');
})();

const closeStoryButton = page.getByRole('button', { name: /Tutup cerita/i }).first();
if (await closeStoryButton.isVisible().catch(() => false)) {
    await closeStoryButton.click({ force: true });
    await page.waitForTimeout(300);
}

const navWilayahDesktop = page.getByTestId('nav-sidebar-page-wilayah');
const navWilayahMobile = page.getByTestId('nav-mobile-primary-wilayah');
if (await navWilayahDesktop.isVisible().catch(() => false)) {
    await navWilayahDesktop.click({ force: true });
} else {
    await navWilayahMobile.waitFor({ state: 'visible', timeout: 60000 });
    await navWilayahMobile.click({ force: true });
}
await page.waitForTimeout(1500);

const activePanel = page.getByTestId('wilayah-active-layer-panel');
await activePanel.waitFor({ state: 'visible', timeout: 60000 });

const mode2DButton = page.getByRole('button', { name: /2D DENAH/i }).first();
if (await mode2DButton.isVisible().catch(() => false)) {
    await mode2DButton.click({ force: true });
    await page.waitForTimeout(400);
}

await page.getByTestId('wilayah-layer-toggle-general').click({ force: true });
await page.waitForTimeout(900);
await page.screenshot({ path: path.join(outputDir, 'wilayah-general-mobile.png'), fullPage: false });

const targetMarkerId = await page.evaluate(async () => {
    const { useGameStore } = await import('/src/store/useGameStore.js');
    const { generateVillageMap } = await import('/src/components/wilayah/map-utils.js');
    const { BUILDING_TYPES } = await import('/src/components/wilayah/constants.js');

    const state = useGameStore.getState();
    const mapData = generateVillageMap(160, 120, 12345, state.publicHealth.villageData);
    const preferredBuilding = mapData.buildings.find((building) => (
        [
            BUILDING_TYPES.RTK,
            BUILDING_TYPES.POSYANDU,
            BUILDING_TYPES.PUSTU,
            BUILDING_TYPES.PUSKESMAS,
        ].includes(building.type)
    ));
    const fallback = preferredBuilding || mapData.buildings.find((building) => !building.familyId) || mapData.buildings[0];
    return fallback?.id || null;
});

if (!targetMarkerId) {
    throw new Error('No marker target available for mobile inspector capture.');
}

await page.getByTestId(`map-marker-${targetMarkerId}`).click({ force: true });
await page.waitForTimeout(1200);
const snapshotCard = page.getByTestId('pocket-diorama-snapshot');
await snapshotCard.waitFor({ state: 'visible', timeout: 20000 });
await page.screenshot({ path: path.join(outputDir, 'wilayah-mobile-bottom-sheet.png'), fullPage: false });
await snapshotCard.screenshot({ path: path.join(outputDir, 'wilayah-mobile-snapshot-card.png') });

await browser.close();
