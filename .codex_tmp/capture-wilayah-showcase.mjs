import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = process.argv[2] || 'http://127.0.0.1:4273/';
const outputDir = process.argv[3] || 'D:/Dev/PRIMER/.codex_tmp/wilayah_showcase_shots';

fs.mkdirSync(outputDir, { recursive: true });

async function maybeClick(locator) {
    if (await locator.isVisible().catch(() => false)) {
        await locator.click({ force: true });
        return true;
    }
    return false;
}

async function waitForAny(page, locators, timeout = 120000) {
    const start = Date.now();
    while ((Date.now() - start) < timeout) {
        for (const locator of locators) {
            if (await locator.isVisible().catch(() => false)) {
                return locator;
            }
        }
        await page.waitForTimeout(400);
    }
    throw new Error('Timed out waiting for expected UI state.');
}

async function bootIntoWilayah(page) {
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    await maybeClick(page.getByRole('button', { name: /Main Offline|offline/i }).first());
    await page.waitForTimeout(1000);

    const dbHeader = page.getByRole('heading', { name: /PRIMER DATABASE/i });
    if (await dbHeader.isVisible().catch(() => false)) {
        await dbHeader.waitFor({ state: 'hidden', timeout: 180000 });
    }
    await page.waitForTimeout(1500);

    const openingScreen = page.getByRole('button', { name: 'Layar Pembuka' });
    const openingStart = page.getByRole('button', { name: /\[\s*MULAI\s*\]|MULAI/i }).first();
    if (await openingScreen.isVisible().catch(() => false)) {
        await openingScreen.click({ force: true });
        await page.waitForTimeout(800);
    }

    if (await openingStart.isVisible().catch(() => false)) {
        await openingStart.click({ force: true });
        await page.waitForTimeout(1000);
    }

    const newGameButton = page.getByRole('button', { name: /^INISIASI$|Game Baru/i }).first();
    await newGameButton.waitFor({ state: 'visible', timeout: 15000 });
    await newGameButton.click({ force: true });
    await page.waitForTimeout(2200);

    const nameInput = page.locator('input[type="text"]').first();
    await nameInput.waitFor({ state: 'visible', timeout: 30000 });
    await nameInput.fill('Dr Visual QA');

    const processButton = page.getByRole('button', { name: /PROSES DATA/i }).first();
    await processButton.click({ force: true });
    await page.waitForTimeout(300);
    await processButton.click({ force: true });
    await page.waitForTimeout(300);

    const authorizeButton = page.getByRole('button', { name: /SAHKAN/i }).first();
    await authorizeButton.waitFor({ state: 'visible', timeout: 15000 });
    await authorizeButton.click({ force: true });

    const dashboardSidebar = page.getByTestId('nav-sidebar-page-dashboard');
    const dashboardMobile = page.getByTestId('nav-mobile-primary-dashboard');
    await waitForAny(page, [dashboardSidebar, dashboardMobile], 60000);

    const closeStoryButton = page.getByRole('button', { name: /Tutup cerita/i }).first();
    if (await closeStoryButton.isVisible().catch(() => false)) {
        await closeStoryButton.click({ force: true });
        await page.waitForTimeout(300);
    }

    const navWilayahDesktop = page.getByTestId('nav-sidebar-page-wilayah');
    const navWilayahMobile = page.getByTestId('nav-mobile-primary-wilayah');
    const menuButton = page.getByTestId('mainlayout-open-mobile-menu');
    const drawerWilayah = page.getByTestId('nav-drawer-page-wilayah');

    if (await navWilayahMobile.isVisible().catch(() => false)) {
        await navWilayahMobile.click({ force: true });
    } else if (await navWilayahDesktop.isVisible().catch(() => false)) {
        await navWilayahDesktop.click({ force: true });
    } else if (await menuButton.isVisible().catch(() => false)) {
        await menuButton.click({ force: true });
        await drawerWilayah.waitFor({ state: 'visible', timeout: 10000 });
        await drawerWilayah.click({ force: true });
    } else {
        await page.keyboard.down('Alt');
        await page.keyboard.press('Digit3');
        await page.keyboard.up('Alt');
    }

    const wilayahPanel = page.getByTestId('wilayah-active-layer-panel');
    await wilayahPanel.waitFor({ state: 'visible', timeout: 60000 });

    const mode2DButton = page.getByRole('button', { name: /2D DENAH/i }).first();
    if (await mode2DButton.isVisible().catch(() => false)) {
        await mode2DButton.click({ force: true });
        await page.waitForTimeout(300);
    }

    await page.addStyleTag({
        content: `
            *, *::before, *::after {
                transition-duration: 0s !important;
                scroll-behavior: auto !important;
            }
        `,
    });
    await page.waitForTimeout(600);
}

async function setLayer(page, layerId) {
    const toggle = page.getByTestId(`wilayah-layer-toggle-${layerId}`);
    await toggle.click({ force: true });
    await page.getByTestId('wilayah-map-layer-legend').waitFor({ state: 'visible', timeout: 10000 });
    await expectDataLayer(page, layerId);
    await page.waitForTimeout(500);
}

async function expectDataLayer(page, layerId) {
    const legend = page.getByTestId('wilayah-map-layer-legend');
    const currentLayer = await legend.getAttribute('data-layer');
    if (currentLayer !== layerId) {
        throw new Error(`Expected active layer ${layerId}, got ${currentLayer}`);
    }
}

async function openInspectorFromVisibleMarker(page) {
    const markers = page.locator('[data-testid^="map-marker-"]');
    const count = await markers.count();
    for (let index = 0; index < Math.min(count, 18); index += 1) {
        const marker = markers.nth(index);
        if (!await marker.isVisible().catch(() => false)) continue;
        await marker.click({ force: true });
        await page.waitForTimeout(350);
        const snapshot = page.getByTestId('pocket-diorama-snapshot');
        if (await snapshot.isVisible().catch(() => false)) {
            return snapshot;
        }
    }
    throw new Error('Unable to open inspector from visible marker.');
}

async function runDesktopShots() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });

    await bootIntoWilayah(page);
    await setLayer(page, 'general');
    await page.screenshot({ path: path.join(outputDir, 'wilayah-general-desktop.png'), fullPage: false });

    await setLayer(page, 'surveillance');
    await page.screenshot({ path: path.join(outputDir, 'wilayah-surveillance-desktop.png'), fullPage: false });

    await browser.close();
}

async function runMobileShot() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
    });
    const page = await context.newPage();

    await bootIntoWilayah(page);
    await setLayer(page, 'general');
    await openInspectorFromVisibleMarker(page);
    await page.screenshot({ path: path.join(outputDir, 'wilayah-mobile-inspector.png'), fullPage: false });

    await browser.close();
}

await runDesktopShots();
await runMobileShot();

console.log(JSON.stringify({
    outputDir,
    files: [
        path.join(outputDir, 'wilayah-general-desktop.png'),
        path.join(outputDir, 'wilayah-surveillance-desktop.png'),
        path.join(outputDir, 'wilayah-mobile-inspector.png'),
    ]
}, null, 2));
