import fs from 'node:fs';
import path from 'node:path';
import { test, expect } from '@playwright/test';

const SNAPSHOT_DIR = path.resolve(process.cwd(), '.codex_tmp', 'e2e-snapshots');
fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });

async function clearBrowserState(page) {
    await page.goto('/');
    await page.evaluate(async () => {
        try {
            window.localStorage.clear();
            window.sessionStorage.clear();
        } catch {
            // Ignore storage cleanup issues in test bootstrap.
        }

        try {
            if (window.indexedDB) {
                window.indexedDB.deleteDatabase('PrimerMedicalDB');
            }
        } catch {
            // Ignore IndexedDB cleanup issues in test bootstrap.
        }
    });
    await page.reload({ waitUntil: 'domcontentloaded' });
}

async function waitForDatabaseSync(page) {
    const syncHeader = page.getByRole('heading', { name: 'PRIMER DATABASE' });
    if (await syncHeader.isVisible().catch(() => false)) {
        const skipButton = page.getByRole('button', { name: /Main Offline|Lewati \(Offline\)|offline/i }).first();
        if (await skipButton.isVisible().catch(() => false)) {
            await skipButton.click();
        }
        await expect(syncHeader).toBeHidden({ timeout: 60000 });
    }
}

async function continueOffline(page) {
    const offlineButton = page.getByRole('button', { name: /Main Offline|Lewati \(Offline\)|offline/i }).first();
    await offlineButton.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
    if (await offlineButton.isVisible().catch(() => false)) {
        await offlineButton.click();
    }
}

async function skipToSlotSelector(page) {
    await clearBrowserState(page);
    await continueOffline(page);
    await waitForDatabaseSync(page);

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

async function seedFreshGame(page) {
    await skipToSlotSelector(page);
    await openSlotDeck(page);

    const newGameSlot = page.getByRole('button', { name: /^INISIASI$|Game Baru/i }).first();
    await expect(newGameSlot).toBeVisible({ timeout: 10000 });
    await newGameSlot.click({ force: true });

    const nameInput = page.locator('input[type="text"]').first();
    await expect(nameInput).toBeVisible({ timeout: 15000 });
    await nameInput.fill('Dr Clinical QA');

    const processButton = page.getByRole('button', { name: /PROSES DATA|PROCESS DATA/i }).first();
    await expect(processButton).toBeVisible({ timeout: 10000 });
    await processButton.click();
    await page.waitForTimeout(500);
    await processButton.click();
    await page.waitForTimeout(500);

    const authorizeButton = page.getByRole('button', { name: /SAHKAN S\.K PENUGASAN|AUTHORIZE ASSIGNMENT/i }).first();
    await expect(authorizeButton).toBeVisible({ timeout: 10000 });
    await authorizeButton.click();

    await expect(page.getByText('Mission Control')).toBeVisible({ timeout: 45000 });
    await page.waitForTimeout(300);
}

async function goToClinicalPage(page) {
    const mobilePrimaryNav = page.getByTestId('nav-mobile-primary-clinical');
    const sidebarNav = page.getByTestId('nav-sidebar-page-clinical');
    const drawerNav = page.getByTestId('nav-drawer-page-clinical');
    const mobileMenuButton = page.getByTestId('mainlayout-open-mobile-menu');

    if (await mobilePrimaryNav.isVisible().catch(() => false)) {
        await mobilePrimaryNav.click();
    } else if (await sidebarNav.isVisible().catch(() => false)) {
        await sidebarNav.click();
    } else {
        await mobileMenuButton.click();
        await expect(drawerNav).toBeVisible({ timeout: 10000 });
        await drawerNav.click();
    }

    await expect(page.getByRole('heading', { name: /Poli Belum Buka|Pelayanan siap|Antrian Pasien|Antrian poli/i }).first()).toBeVisible({ timeout: 30000 });
}

async function waitForScreenToSettle(page) {
    await expect(page.getByText('Memuat...')).toHaveCount(0, { timeout: 30000 });
}

async function assertNoHorizontalOverflow(page, label) {
    const metrics = await page.evaluate(() => {
        const root = document.documentElement;
        const body = document.body;
        return {
            viewportWidth: window.innerWidth,
            maxWidth: Math.max(root.scrollWidth, body.scrollWidth)
        };
    });

    expect(metrics.maxWidth, `${label} should fit within the viewport width`).toBeLessThanOrEqual(metrics.viewportWidth + 2);
}

test.describe('Responsive Clinical Flow', () => {
    test.describe.configure({ mode: 'serial' });
    test.setTimeout(120000);

    test('dashboard desktop overview stays readable without horizontal overflow', async ({ page }) => {
        await seedFreshGame(page);

        await expect(page.getByText('Mission Control')).toBeVisible({ timeout: 30000 });
        await expect(page.getByTestId('dashboard-stats')).toBeVisible();
        await assertNoHorizontalOverflow(page, 'Dashboard desktop');

        await page.screenshot({
            path: path.join(SNAPSHOT_DIR, 'dashboard-desktop-overview.png'),
            fullPage: true
        });
    });

    test.describe('mobile queue guard', () => {
        test.use({
            viewport: { width: 390, height: 844 },
            isMobile: true,
            hasTouch: true,
            deviceScaleFactor: 2
        });

        test('keeps queue locked before opening hours and preserves mobile fit', async ({ page }) => {
            await seedFreshGame(page);

            await goToClinicalPage(page);
            await waitForScreenToSettle(page);
            await expect(page.getByText(/Poli Belum Buka/i)).toBeVisible({ timeout: 20000 });

            const queueFab = page.locator('button').filter({ hasText: /Buka antrian|pasien menunggu jam buka/i }).last();
            await expect(queueFab).toBeVisible();
            await queueFab.click();

            await expect(page.getByText(/\d+ pasien menunggu jam buka/i).last()).toBeVisible();
            await expect(page.getByText('08:00-16:00').first()).toBeVisible();
            await assertNoHorizontalOverflow(page, 'Clinical mobile queue drawer');

            await expect(page.getByText(/RM-\d{2}-\d{4}/)).toHaveCount(0);
            await expect(page.getByText(/Poli Belum Buka/i)).toBeVisible();

            await page.screenshot({
                path: path.join(SNAPSHOT_DIR, 'clinical-mobile-queue-locked.png'),
                fullPage: true
            });
        });
    });

    test('desktop clinical flow opens EMR after time advances past opening hours', async ({ page }) => {
        await seedFreshGame(page);

        await goToClinicalPage(page);
        await waitForScreenToSettle(page);
        await expect(page.getByText(/Poli Belum Buka/i)).toBeVisible({ timeout: 20000 });

        await page.locator('button[title="Kecepatan Maksimal"]').click();

        await waitForScreenToSettle(page);
        await expect(page.getByText(/Poli Belum Buka/i)).toHaveCount(0, { timeout: 70000 });
        await assertNoHorizontalOverflow(page, 'Clinical desktop queue view');

        await page.screenshot({
            path: path.join(SNAPSHOT_DIR, 'clinical-desktop-queue-open.png'),
            fullPage: true
        });

        const callNextButton = page.getByRole('button', { name: /Panggil pasien berikutnya|Tangani sekarang/i }).first();
        await expect(callNextButton).toBeVisible({ timeout: 20000 });
        await callNextButton.click();

        await expect(page.getByRole('button', { name: 'MAIA Codex', exact: true })).toBeVisible({ timeout: 20000 });
        await expect(page.getByText(/RM-\d{2}-\d{4}/)).toBeVisible();
        await assertNoHorizontalOverflow(page, 'Clinical desktop EMR');

        await page.screenshot({
            path: path.join(SNAPSHOT_DIR, 'clinical-desktop-emr-open.png'),
            fullPage: true
        });
    });
});
