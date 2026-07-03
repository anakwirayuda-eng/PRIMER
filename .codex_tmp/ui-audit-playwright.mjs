import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';

const BASE_URL = 'http://127.0.0.1:4173';
const OUTPUT_DIR = path.resolve('D:/Dev/PRIMER/.codex_tmp/ui-audit');

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

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
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });

  const slotButton = page.getByRole('button', { name: /Mulai Permainan|Lanjutkan Permainan|INISIASI SISTEM/i }).first();
  const offlineButton = page.getByRole('button', { name: /Main Offline|offline/i }).first();
  const syncHeader = page.locator('h1:has-text("PRIMER DATABASE")');
  const cinematicButton = page.getByRole('button', { name: /\[\s*MULAI\s*\]|MULAI/i }).first();
  const deadline = Date.now() + 120000;
  while (Date.now() < deadline) {
    if (await slotButton.isVisible().catch(() => false)) return;

    if (await offlineButton.isVisible().catch(() => false)) {
      await offlineButton.click();
      await page.waitForTimeout(1000);
      continue;
    }

    if (await syncHeader.isVisible().catch(() => false)) {
      await syncHeader.waitFor({ state: 'hidden', timeout: 60000 });
      continue;
    }

    if (await cinematicButton.isVisible().catch(() => false)) {
      await cinematicButton.click({ force: true });
      await page.waitForTimeout(2000);
      continue;
    }

    await page.waitForTimeout(800);
  }

  await slotButton.waitFor({ state: 'visible', timeout: 5000 });
}

async function startFreshGame(page) {
  await skipToSlotSelector(page);

  await page.getByRole('button', { name: /Mulai Permainan|Lanjutkan Permainan|INISIASI SISTEM/i }).first().click();

  const newGameSlot = page.getByRole('button', { name: /^INISIASI$|Game Baru/i }).first();
  await newGameSlot.waitFor({ state: 'visible', timeout: 10000 });
  await newGameSlot.click({ force: true });

  const nameInput = page.locator('input[type="text"]').first();
  await nameInput.waitFor({ state: 'visible', timeout: 15000 });
  await nameInput.fill('Dr UX Audit');

  const processButton = page.getByRole('button', { name: /PROSES DATA/i }).first();
  await processButton.click();
  await page.waitForTimeout(400);
  await processButton.click();
  await page.waitForTimeout(400);

  const authorizeButton = page.getByRole('button', { name: /SAHKAN S\.K PENUGASAN/i }).first();
  await authorizeButton.waitFor({ state: 'visible', timeout: 10000 });
  await authorizeButton.click();

  await page.waitForFunction(() => {
    const buttons = Array.from(document.querySelectorAll('button[title^="Dashboard"], button[aria-label="Dashboard"]'));
    return buttons.some((button) => {
      const style = window.getComputedStyle(button);
      const rect = button.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    });
  }, { timeout: 45000 });

  const closeStoryButton = page.getByRole('button', { name: /Tutup cerita/i }).first();
  if (await closeStoryButton.isVisible().catch(() => false)) {
    await closeStoryButton.click();
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
}

async function withStore(page, callbackSource) {
  return page.evaluate(async (source) => {
    const { useGameStore } = await import('/src/store/useGameStore.js');
    const fn = new Function('useGameStore', `return (async () => { ${source} })();`);
    return fn(useGameStore);
  }, callbackSource);
}

async function seedDemoQueue(page) {
  return withStore(page, `
    const store = useGameStore;
    store.getState().navActions.setActivePage('clinical');
    store.getState().worldActions.setTime(540);
    const [{ generatePatient }, { normalizePatient }, { seedKey }, { normalizeSkillList }] = await Promise.all([
      import('/src/game/PatientGenerator.js'),
      import('/src/models/PatientRuntime.js'),
      import('/src/utils/deterministicRandom.js'),
      import('/src/store/helpers/playerHelpers.js')
    ]);
    const state = store.getState();
    const patients = Array.from({ length: 3 }, (_, index) => normalizePatient(generatePatient(
      state.world.time + (index * 5),
      state.publicHealth.villageData,
      state.world.day,
      state.finance.facilities,
      normalizeSkillList(state.player.profile.skills),
      seedKey('ui-audit-seed', state.world.day, index)
    )));
    store.getState().clinicalActions.setQueue(patients);
    store.getState().clinicalActions.setActivePatientId(null);
    return {
      queueLength: store.getState().clinical.queue.length,
      emergencyLength: store.getState().clinical.emergencyQueue.length,
      time: store.getState().world.time,
      day: store.getState().world.day,
      firstPatientName: store.getState().clinical.queue[0]?.name ?? null,
      firstPatientId: store.getState().clinical.queue[0]?.id ?? null
    };
  `);
}

async function setActivePage(page, activePage) {
  await withStore(page, `useGameStore.getState().navActions.setActivePage('${activePage}'); return useGameStore.getState().nav.activePage;`);
  await page.waitForTimeout(800);
}

async function setActivePatient(page) {
  return withStore(page, `
    const store = useGameStore;
    const patient = store.getState().clinical.queue[0];
    if (!patient) return null;
    store.getState().clinicalActions.setActivePatientId(patient.id);
    return { id: patient.id, name: patient.name };
  `);
}

async function collectLayoutMetrics(page, pageName, viewportName) {
  return page.evaluate(({ pageName, viewportName }) => {
    const visible = (el) => {
      if (!(el instanceof HTMLElement)) return false;
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return style.display !== 'none'
        && style.visibility !== 'hidden'
        && Number(style.opacity || '1') > 0
        && rect.width > 0
        && rect.height > 0;
    };

    const labelFor = (el) => {
      const text = (el.getAttribute('aria-label')
        || el.getAttribute('title')
        || el.innerText
        || el.textContent
        || '')
        .replace(/\s+/g, ' ')
        .trim();
      return text.slice(0, 100);
    };

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const elements = Array.from(document.querySelectorAll('body *'));
    const interactiveSelectors = 'button, a, input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])';

    const smallInteractive = Array.from(document.querySelectorAll(interactiveSelectors))
      .filter(visible)
      .map((el) => {
        const rect = el.getBoundingClientRect();
        return {
          tag: el.tagName.toLowerCase(),
          label: labelFor(el),
          width: Number(rect.width.toFixed(1)),
          height: Number(rect.height.toFixed(1)),
          x: Number(rect.x.toFixed(1)),
          y: Number(rect.y.toFixed(1)),
        };
      })
      .filter((item) => item.width < 44 || item.height < 44)
      .slice(0, 30);

    const tinyText = elements
      .filter(visible)
      .map((el) => {
        const rect = el.getBoundingClientRect();
        const fontSize = Number.parseFloat(window.getComputedStyle(el).fontSize || '0');
        return {
          tag: el.tagName.toLowerCase(),
          text: labelFor(el),
          fontSize: Number(fontSize.toFixed(1)),
          width: Number(rect.width.toFixed(1)),
          height: Number(rect.height.toFixed(1)),
          x: Number(rect.x.toFixed(1)),
          y: Number(rect.y.toFixed(1)),
        };
      })
      .filter((item) => item.text.length >= 2 && item.fontSize > 0 && item.fontSize < 11)
      .slice(0, 40);

    const offscreen = elements
      .filter(visible)
      .map((el) => {
        const rect = el.getBoundingClientRect();
        return {
          tag: el.tagName.toLowerCase(),
          text: labelFor(el),
          left: Number(rect.left.toFixed(1)),
          right: Number(rect.right.toFixed(1)),
          top: Number(rect.top.toFixed(1)),
          width: Number(rect.width.toFixed(1)),
          height: Number(rect.height.toFixed(1)),
        };
      })
      .filter((item) => item.width > 24 && item.height > 16 && (item.left < -8 || item.right > vw + 8))
      .slice(0, 30);

    const truncated = elements
      .filter(visible)
      .map((el) => ({
        tag: el.tagName.toLowerCase(),
        text: labelFor(el),
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth,
      }))
      .filter((item) => item.text.length >= 4 && item.scrollWidth > item.clientWidth + 8 && item.clientWidth > 0)
      .slice(0, 30);

    return {
      pageName,
      viewportName,
      viewport: { width: vw, height: vh },
      bodyScrollWidth: document.documentElement.scrollWidth,
      horizontalOverflow: document.documentElement.scrollWidth > vw + 1,
      smallInteractive,
      tinyText,
      offscreen,
      truncated,
    };
  }, { pageName, viewportName });
}

async function saveScreenshot(page, fileName) {
  const filePath = path.join(OUTPUT_DIR, fileName);
  await page.screenshot({ path: filePath, fullPage: false });
  return filePath;
}

async function runViewportAudit(browser, viewportConfig) {
  const context = await browser.newContext({
    viewport: viewportConfig.viewport,
    isMobile: Boolean(viewportConfig.isMobile),
    hasTouch: Boolean(viewportConfig.isMobile),
    deviceScaleFactor: viewportConfig.deviceScaleFactor ?? 1,
  });
  const page = await context.newPage();
  await page.emulateMedia({ reducedMotion: 'reduce' });

  try {
    await startFreshGame(page);
    const queueState = await seedDemoQueue(page);

    await setActivePage(page, 'dashboard');
    const dashboardMetrics = await collectLayoutMetrics(page, 'dashboard', viewportConfig.name);
    const dashboardShot = await saveScreenshot(page, `${viewportConfig.name}-dashboard.png`);

    await setActivePage(page, 'clinical');
    await page.waitForTimeout(1000);
    const clinicalDefaultMetrics = await collectLayoutMetrics(page, 'clinical-default', viewportConfig.name);
    const clinicalDefaultShot = await saveScreenshot(page, `${viewportConfig.name}-clinical-default.png`);

    let clinicalExpandedShot = null;
    let clinicalExpandedMetrics = null;

    if (!viewportConfig.isMobile) {
      const expandButton = page.locator('button[aria-label="Buka Panel"]').first();
      if (await expandButton.isVisible().catch(() => false)) {
        await expandButton.click();
        await page.waitForTimeout(700);
        clinicalExpandedMetrics = await collectLayoutMetrics(page, 'clinical-expanded', viewportConfig.name);
        clinicalExpandedShot = await saveScreenshot(page, `${viewportConfig.name}-clinical-expanded.png`);
      }
    } else {
      await page.mouse.click(viewportConfig.viewport.width - 36, viewportConfig.viewport.height - 140);
      await page.waitForTimeout(700);
      clinicalExpandedMetrics = await collectLayoutMetrics(page, 'clinical-mobile-drawer', viewportConfig.name);
      clinicalExpandedShot = await saveScreenshot(page, `${viewportConfig.name}-clinical-mobile-drawer.png`);
      const closeQueueButton = page.locator('button[aria-label="Tutup antrian"]').first();
      if (await closeQueueButton.isVisible().catch(() => false)) {
        await closeQueueButton.click();
        await page.waitForTimeout(300);
      }
    }

    let emrShot = null;
    let emrMetrics = null;
    const activePatient = await setActivePatient(page);
    if (activePatient) {
      await page.waitForTimeout(1200);
      emrMetrics = await collectLayoutMetrics(page, 'clinical-emr', viewportConfig.name);
      emrShot = await saveScreenshot(page, `${viewportConfig.name}-clinical-emr.png`);
    }

    return {
      viewport: viewportConfig,
      queueState,
      screenshots: {
        dashboard: dashboardShot,
        clinicalDefault: clinicalDefaultShot,
        clinicalExpanded: clinicalExpandedShot,
        emr: emrShot,
      },
      metrics: {
        dashboard: dashboardMetrics,
        clinicalDefault: clinicalDefaultMetrics,
        clinicalExpanded: clinicalExpandedMetrics,
        emr: emrMetrics,
      },
    };
  } finally {
    await context.close();
  }
}

const viewports = [
  { name: 'desktop-1366x768', viewport: { width: 1366, height: 768 } },
  { name: 'desktop-1024x768', viewport: { width: 1024, height: 768 } },
  { name: 'mobile-390x844', viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 2 },
];

const browser = await chromium.launch({ headless: true });
const summary = [];

try {
  for (const viewport of viewports) {
    summary.push(await runViewportAudit(browser, viewport));
  }
} finally {
  await browser.close();
}

const summaryPath = path.join(OUTPUT_DIR, 'summary.json');
fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
console.log(summaryPath);
