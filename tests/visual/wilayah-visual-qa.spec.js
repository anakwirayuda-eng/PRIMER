/* global process */
import fs from 'node:fs';
import path from 'node:path';
import { test, expect } from '@playwright/test';

const OUTPUT_DIR = path.resolve(process.cwd(), 'diagnostics', 'wilayah_visual_qa_2026-04-05');
const SECONDARY_VIEWPORT_DIR = path.join(OUTPUT_DIR, 'viewport_1440x900');
const MOBILE_VIEWPORT_DIR = path.join(OUTPUT_DIR, 'viewport_mobile_390x844');

function ensureOutputDir(outputDir = OUTPUT_DIR) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function clearPersistentGameState(page) {
    await page.addInitScript(() => {
        try {
            window.localStorage.clear();
            window.sessionStorage.clear();
            if (window.indexedDB) {
                window.indexedDB.deleteDatabase('PrimerMedicalDB');
            }
        } catch {
            // Ignore storage reset failures during browser boot.
        }
    });
}

async function skipToSlotSelector(page) {
    await clearPersistentGameState(page);
    await page.goto('/');
    await page.reload({ waitUntil: 'domcontentloaded' });

    const offlineButton = page.getByRole('button', { name: /Main Offline|Lewati \(Offline\)|offline/i }).first();
    await offlineButton.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
    if (await offlineButton.isVisible().catch(() => false)) {
        await offlineButton.click();
    }

    const syncHeader = page.getByRole('heading', { name: 'PRIMER DATABASE' });
    if (await syncHeader.isVisible().catch(() => false)) {
        const skipButton = page.getByRole('button', { name: /Main Offline|Lewati \(Offline\)|offline/i }).first();
        if (await skipButton.isVisible().catch(() => false)) {
            await skipButton.click();
        }
        await expect(syncHeader).toBeHidden({ timeout: 60000 });
    }

    const slotSelector = page.locator('button').filter({ hasText: /INISIASI SISTEM|AKSES DATABASE/i }).first();
    if (await slotSelector.isVisible({ timeout: 2000 }).catch(() => false)) {
        return;
    }

    const openingScreen = page.getByRole('button', { name: 'Layar Pembuka' });
    await expect(openingScreen).toBeVisible({ timeout: 30000 });
    await openingScreen.click();
    if (!(await slotSelector.isVisible({ timeout: 2000 }).catch(() => false))) {
        await openingScreen.click();
    }
    await expect(slotSelector).toBeVisible({ timeout: 15000 });
}

async function openSlotDeck(page) {
    const systemButton = page.locator('button').filter({ hasText: /INISIASI SISTEM|AKSES DATABASE/i }).first();
    await expect(systemButton).toBeVisible({ timeout: 15000 });
    await systemButton.click();
}

async function startFreshGame(page) {
    await skipToSlotSelector(page);
    await openSlotDeck(page);

    const newGameSlot = page.getByRole('button', { name: /^INISIASI$|Game Baru/i }).first();
    await expect(newGameSlot).toBeVisible({ timeout: 10000 });
    await newGameSlot.click({ force: true });

    const nameInput = page.locator('input[type="text"]').first();
    await expect(nameInput).toBeVisible({ timeout: 15000 });
    await nameInput.fill('Dr Visual QA');

    const processButton = page.getByRole('button', { name: /PROSES DATA/i }).first();
    await processButton.click();
    await page.waitForTimeout(500);
    await processButton.click();
    await page.waitForTimeout(500);

    const authorizeButton = page.getByRole('button', { name: /SAHKAN S\.K PENUGASAN/i }).first();
    await expect(authorizeButton).toBeVisible({ timeout: 10000 });
    await authorizeButton.click();

    await expect(page.getByText('Mission Control')).toBeVisible({ timeout: 45000 });

    const closeStoryButton = page.getByRole('button', { name: /Tutup cerita/i }).first();
    if (await closeStoryButton.isVisible().catch(() => false)) {
        await closeStoryButton.click();
    }
}

async function openWilayah(page) {
    const mobilePrimaryNav = page.getByTestId('nav-mobile-primary-wilayah');
    const sidebarNav = page.getByTestId('nav-sidebar-page-wilayah');
    const drawerNav = page.getByTestId('nav-drawer-page-wilayah');
    const mobileMenuButton = page.getByTestId('mainlayout-open-mobile-menu');

    if (await mobilePrimaryNav.isVisible().catch(() => false)) {
        await mobilePrimaryNav.click();
    } else if (await sidebarNav.isVisible().catch(() => false)) {
        await sidebarNav.click();
    } else if (await mobileMenuButton.isVisible().catch(() => false)) {
        await mobileMenuButton.click();
        await expect(drawerNav).toBeVisible({ timeout: 10000 });
        await drawerNav.click();
    } else {
        await page.keyboard.down('Alt');
        await page.keyboard.press('Digit3');
        await page.keyboard.up('Alt');
    }

    const activePanel = page.getByTestId('wilayah-active-layer-panel');
    await expect(activePanel).toBeVisible({ timeout: 45000 });

    const mode2DButton = page.getByRole('button', { name: /2D DENAH/i }).first();
    if (await mode2DButton.isVisible().catch(() => false)) {
        await mode2DButton.click();
    }

    await page.addStyleTag({
        content: `
            *, *::before, *::after {
                animation-duration: 0.001ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0s !important;
                scroll-behavior: auto !important;
            }
        `,
    });
    await page.waitForTimeout(400);
}

async function setLayer(page, layerId) {
    await page.getByTestId(`wilayah-layer-toggle-${layerId}`).click();
    await expect(page.getByTestId('wilayah-map-layer-legend')).toHaveAttribute('data-layer', layerId);
    await page.waitForTimeout(250);
}

async function resetMapView(page) {
    await page.keyboard.press('0');
    await page.waitForTimeout(250);
}

async function zoomMap(page, steps = 1) {
    for (let index = 0; index < steps; index += 1) {
        await page.keyboard.press('=');
        await page.waitForTimeout(150);
    }
}

async function panMap(page, from, to) {
    await page.mouse.move(from.x, from.y);
    await page.mouse.down();
    await page.mouse.move(to.x, to.y, { steps: 12 });
    await page.mouse.up();
    await page.waitForTimeout(250);
}

async function captureViewport(page, filename, outputDir = OUTPUT_DIR) {
    await page.screenshot({
        path: path.join(outputDir, filename),
        fullPage: false,
    });
}

async function closeMapDrawer(page) {
    const closeButton = page.getByRole('button', { name: /Tutup detail bangunan/i }).first();
    if (await closeButton.isVisible().catch(() => false)) {
        await closeButton.click();
        await page.waitForTimeout(250);
        return;
    }

    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
}

async function openInspectorFromVisibleMarker(page) {
    const markers = page.locator('[data-testid^="map-marker-"]');
    const markerCount = await markers.count();
    const maxAttempts = Math.min(markerCount, 16);

    for (let index = 0; index < maxAttempts; index += 1) {
        const marker = markers.nth(index);
        if (!await marker.isVisible().catch(() => false)) {
            continue;
        }

        await marker.click({ force: true });
        const snapshot = page.getByTestId('pocket-diorama-snapshot');
        if (await snapshot.isVisible().catch(() => false)) {
            return snapshot;
        }

        await page.waitForTimeout(250);
    }

    throw new Error('Tidak berhasil membuka inspector mobile dari marker yang terlihat.');
}

function writeReport({
    outputDir = OUTPUT_DIR,
    viewportLabel,
    files,
    note = null,
}) {
    const reportDate = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(new Date());
    const lines = [
        '# Wilayah Visual QA Automation',
        '',
        `Tanggal: ${reportDate}`,
        '',
        'Runner ini dibuat oleh Codex untuk mengambil screenshot Wilayah 2D canonical secara otomatis.',
        'Status: screenshot berhasil dihasilkan; audit visual manusia/AI masih bisa dilanjutkan dari folder ini.',
        '',
        '## Paket Screenshot',
        '',
        ...files.map((file) => `- ${file}`),
        '',
        '## Catatan',
        '',
        `- Viewport yang dipakai: ${viewportLabel}.`,
        '- Motion dibekukan sementara saat capture agar hasil lebih stabil.',
        '- Jika ada mismatch visual, ulangi runner ini sebelum menilai regresi.',
    ];

    if (note) {
        lines.push(`- ${note}`);
    }

    fs.writeFileSync(path.join(outputDir, 'report.md'), `${lines.join('\n')}\n`, 'utf8');
}

test.describe('Wilayah Visual QA Automation', () => {
    test.setTimeout(420000);

    test('captures the canonical Wilayah 2D screenshot pack', async ({ page }) => {
        ensureOutputDir();
        await page.setViewportSize({ width: 1366, height: 768 });

        await startFreshGame(page);
        await openWilayah(page);

        await setLayer(page, 'general');
        await closeMapDrawer(page);
        await captureViewport(page, '01-general-overview.png');

        await setLayer(page, 'pispk');
        await closeMapDrawer(page);
        await captureViewport(page, '02-pispk-overview.png');

        await setLayer(page, 'surveillance');
        await closeMapDrawer(page);
        await captureViewport(page, '03-surveillance-overview.png');

        await setLayer(page, 'psn');
        await closeMapDrawer(page);
        await captureViewport(page, '04-psn-overview.png');

        await setLayer(page, 'phbs');
        await closeMapDrawer(page);
        await captureViewport(page, '05-phbs-overview.png');

        await setLayer(page, 'perilaku');
        await closeMapDrawer(page);
        await captureViewport(page, '06-perilaku-overview.png');

        await setLayer(page, 'pispk');
        await resetMapView(page);
        await zoomMap(page, 2);
        await closeMapDrawer(page);
        await captureViewport(page, '07-pispk-medium-zoom.png');

        await setLayer(page, 'surveillance');
        await panMap(page, { x: 940, y: 360 }, { x: 780, y: 300 });
        await zoomMap(page, 1);
        await closeMapDrawer(page);
        await captureViewport(page, '08-surveillance-detail.png');

        await setLayer(page, 'general');
        await resetMapView(page);
        await zoomMap(page, 2);
        await panMap(page, { x: 760, y: 360 }, { x: 930, y: 250 });
        await closeMapDrawer(page);
        await captureViewport(page, '09-general-blank-spot.png');

        await setLayer(page, 'surveillance');
        await resetMapView(page);
        await zoomMap(page, 2);
        await closeMapDrawer(page);
        await captureViewport(page, '10-bridge-intel-champion-focus.png');

        writeReport({
            outputDir: OUTPUT_DIR,
            viewportLabel: '1366x768',
            files: [
                '01-general-overview.png',
                '02-pispk-overview.png',
                '03-surveillance-overview.png',
                '04-psn-overview.png',
                '05-phbs-overview.png',
                '06-perilaku-overview.png',
                '07-pispk-medium-zoom.png',
                '08-surveillance-detail.png',
                '09-general-blank-spot.png',
                '10-bridge-intel-champion-focus.png',
            ],
        });
    });

    test('captures a secondary desktop viewport QA pass', async ({ page }) => {
        ensureOutputDir(SECONDARY_VIEWPORT_DIR);
        await page.setViewportSize({ width: 1440, height: 900 });

        await startFreshGame(page);
        await openWilayah(page);

        await setLayer(page, 'general');
        await closeMapDrawer(page);
        await captureViewport(page, '01-general-overview.png', SECONDARY_VIEWPORT_DIR);

        await setLayer(page, 'pispk');
        await closeMapDrawer(page);
        await captureViewport(page, '02-pispk-overview.png', SECONDARY_VIEWPORT_DIR);

        await setLayer(page, 'surveillance');
        await closeMapDrawer(page);
        await captureViewport(page, '03-surveillance-overview.png', SECONDARY_VIEWPORT_DIR);

        await setLayer(page, 'general');
        await resetMapView(page);
        await zoomMap(page, 2);
        await panMap(page, { x: 800, y: 400 }, { x: 980, y: 260 });
        await closeMapDrawer(page);
        await captureViewport(page, '04-general-blank-spot.png', SECONDARY_VIEWPORT_DIR);

        writeReport({
            outputDir: SECONDARY_VIEWPORT_DIR,
            viewportLabel: '1440x900',
            files: [
                '01-general-overview.png',
                '02-pispk-overview.png',
                '03-surveillance-overview.png',
                '04-general-blank-spot.png',
            ],
            note: 'Pass kedua difokuskan ke layout/HUD readability pada viewport desktop yang lebih lega.',
        });
    });

    test('captures a mobile bottom sheet inspector QA pass', async ({ page }) => {
        ensureOutputDir(MOBILE_VIEWPORT_DIR);
        await page.setViewportSize({ width: 390, height: 844 });

        await startFreshGame(page);
        await openWilayah(page);

        await setLayer(page, 'general');
        await resetMapView(page);
        await zoomMap(page, 2);

        const snapshot = await openInspectorFromVisibleMarker(page);
        await expect(snapshot).toBeVisible({ timeout: 10000 });
        await page.waitForTimeout(400);

        await captureViewport(page, '01-mobile-inspector-bottom-sheet.png', MOBILE_VIEWPORT_DIR);
        await snapshot.screenshot({
            path: path.join(MOBILE_VIEWPORT_DIR, '02-mobile-snapshot-card.png'),
        });

        writeReport({
            outputDir: MOBILE_VIEWPORT_DIR,
            viewportLabel: '390x844',
            files: [
                '01-mobile-inspector-bottom-sheet.png',
                '02-mobile-snapshot-card.png',
            ],
            note: 'Pass mobile difokuskan ke spacing, hierarchy, dan premium feel pada bottom sheet inspector.',
        });
    });
});
