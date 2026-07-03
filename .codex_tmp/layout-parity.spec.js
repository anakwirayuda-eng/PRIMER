import fs from 'node:fs';
import path from 'node:path';
import { test, expect } from '@playwright/test';

const SNAPSHOT_DIR = path.resolve(process.cwd(), '.codex_tmp', 'p3-parity-2026-04-16');
fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });

async function clearBrowserState(page) {
    await page.goto('/');
    await page.evaluate(async () => {
        try {
            window.localStorage.clear();
            window.sessionStorage.clear();
        } catch {
            // Ignore storage cleanup issues in bootstrap.
        }

        try {
            if (window.indexedDB) {
                window.indexedDB.deleteDatabase('PrimerMedicalDB');
            }
        } catch {
            // Ignore IndexedDB cleanup issues in bootstrap.
        }
    });
    await page.reload({ waitUntil: 'domcontentloaded' });
}

async function continueOffline(page) {
    const offlineButton = page.getByRole('button', { name: /Main Offline|Lewati \(Offline\)|offline/i }).first();
    await offlineButton.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    if (await offlineButton.isVisible().catch(() => false)) {
        await offlineButton.click();
    }
}

async function waitForDatabaseSync(page) {
    const syncHeader = page.getByRole('heading', { name: /PRIMER DATABASE/i });
    if (!(await syncHeader.isVisible().catch(() => false))) {
        return;
    }

    const skipButton = page.getByRole('button', { name: /Main Offline|Lewati \(Offline\)|offline/i }).first();
    const deadline = Date.now() + 30000;

    while (Date.now() < deadline) {
        if (!(await syncHeader.isVisible().catch(() => false))) {
            return;
        }

        if (await skipButton.isVisible().catch(() => false)) {
            await skipButton.click();
            break;
        }

        await page.waitForTimeout(1000);
    }

    await expect(syncHeader).toBeHidden({ timeout: 60000 });
}

async function seedFreshGame(page, { time = 540, speed = 0 } = {}) {
    await clearBrowserState(page);
    await continueOffline(page);
    await waitForDatabaseSync(page);

    await page.evaluate(async ({ targetTime, targetSpeed }) => {
        const { useGameStore } = await import('/src/store/useGameStore.js');

        useGameStore.getState().actions.startNewGame({
            name: 'Audit Parity',
            gender: 'L',
            age: 34,
            initialStats: {
                maxEnergy: 100,
                baseReputation: 80
            },
            avatar: {
                id: 'audit-avatar',
                name: 'Dr. Audit Parity',
                icon: 'dokter',
                color: 'bg-blue-500',
                gender: 'L',
                outfit: 'labCoat',
                eyeStyle: 'default',
                skinTone: 'fair',
                hairStyle: 'neat',
                hairColor: 'black',
                accessories: ['stethoscope']
            }
        }, 0);

        const seededState = useGameStore.getState();
        const families = seededState.villageData?.families || [];
        const queue = seededState.clinical.queue.map((patient, index) => ({
            ...patient,
            serviceId: patient.serviceId || 'poli_umum',
            facility: patient.facility || 'poli_umum',
            joinedAt: 450 + (index * 10),
            social: {
                hasBPJS: true,
                ...(patient.social || {})
            }
        }));

        const history = [
            {
                id: 'enc-1',
                day: seededState.world.day,
                dischargedAt: 520,
                name: 'Siti Hadi',
                decision: { action: 'treat' },
                outcomeStatus: 'correct',
                medicalData: { trueDiagnosisCode: 'I10' },
                hidden: { familyId: families[0]?.id || 'fam-1' }
            },
            {
                id: 'enc-2',
                day: seededState.world.day,
                dischargedAt: 560,
                name: 'Wawan Mulyadi',
                decision: { action: 'delegate_to_maia' },
                outcomeStatus: 'delegated',
                medicalData: { trueDiagnosisCode: 'A09' },
                hidden: { familyId: families[1]?.id || families[0]?.id || 'fam-2' }
            },
            {
                id: 'enc-3',
                type: 'ikm_event',
                day: seededState.world.day,
                dischargedAt: 600,
                name: 'Fogging RW 02',
                outcomeStatus: 'ikm_success',
                description: 'Biaya Rp 300.000 • IKS +5 • Risiko diare turun'
            }
        ];

        useGameStore.setState((state) => ({
            history,
            world: {
                ...state.world,
                time: targetTime,
                speed: targetSpeed
            },
            nav: {
                ...state.nav,
                gameState: 'playing',
                activePage: 'dashboard',
                showKPIGlobal: false
            },
            clinical: {
                ...state.clinical,
                queue,
                activePatientId: null,
                activeEmergencyId: null,
                showMorningBriefing: false,
                showEndOfDayDebrief: false,
                gameOver: null
            },
            meta: {
                ...state.meta,
                isWikiOpen: false,
                wikiMetric: null
            }
        }));
    }, { targetTime: time, targetSpeed: speed });

    await expect(page.getByRole('button', { name: 'Layanan' }).first()).toBeVisible({ timeout: 30000 });
}

async function setActivePage(page, activePage) {
    await page.evaluate(async ({ nextPage }) => {
        const { useGameStore } = await import('/src/store/useGameStore.js');
        useGameStore.setState((state) => ({
            nav: {
                ...state.nav,
                activePage: nextPage
            }
        }));
    }, { nextPage: activePage });
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

    expect(metrics.maxWidth, `${label} should fit without horizontal overflow`).toBeLessThanOrEqual(metrics.viewportWidth + 2);
}

test.describe.configure({ mode: 'serial' });

test('captures 1366 parity for dashboard, archive, and census', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await seedFreshGame(page);

    await expect(page.getByTestId('dashboard-stats')).toBeVisible({ timeout: 30000 });
    await assertNoHorizontalOverflow(page, 'Dashboard 1366');
    await page.screenshot({
        path: path.join(SNAPSHOT_DIR, 'dashboard-1366x768.png'),
        fullPage: true
    });

    await setActivePage(page, 'archive');
    await expect(page.getByText('SIMPUS: Arsip & Rekam Medis')).toBeVisible({ timeout: 30000 });
    await page.getByRole('button', { name: /Log Kunjungan Harian/i }).click();
    await expect(page.getByText('Siti Hadi')).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('table')).toHaveCount(0);
    await assertNoHorizontalOverflow(page, 'Arsip 1366');
    await page.screenshot({
        path: path.join(SNAPSHOT_DIR, 'arsip-daily-1366x768.png'),
        fullPage: true
    });

    await setActivePage(page, 'sensus');
    await expect(page.getByText('DATA KEPENDUDUKAN DESA')).toBeVisible({ timeout: 30000 });
    await page.getByRole('button', { name: 'Tabel' }).click();
    await expect(page.getByText('Mode tabel diringkas menjadi kartu baris agar tetap terbaca di layar ini.')).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('table')).toHaveCount(0);
    await assertNoHorizontalOverflow(page, 'Sensus 1366');
    await page.screenshot({
        path: path.join(SNAPSHOT_DIR, 'sensus-table-1366x768.png'),
        fullPage: true
    });
});

test('captures mobile smoke for archive and census after density changes', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await seedFreshGame(page);

    await setActivePage(page, 'archive');
    await expect(page.getByText('SIMPUS: Arsip & Rekam Medis')).toBeVisible({ timeout: 30000 });
    await page.getByRole('button', { name: /Log Kunjungan Harian/i }).click();
    await expect(page.getByText('Siti Hadi')).toBeVisible({ timeout: 15000 });
    await assertNoHorizontalOverflow(page, 'Arsip mobile');
    await page.screenshot({
        path: path.join(SNAPSHOT_DIR, 'arsip-daily-390x844-postfix.png'),
        fullPage: true
    });

    await setActivePage(page, 'sensus');
    await expect(page.getByText('DATA KEPENDUDUKAN DESA')).toBeVisible({ timeout: 30000 });
    await assertNoHorizontalOverflow(page, 'Sensus mobile');
    await page.screenshot({
        path: path.join(SNAPSHOT_DIR, 'sensus-390x844-postfix.png'),
        fullPage: true
    });
});
