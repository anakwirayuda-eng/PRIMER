import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import axe from 'axe-core'
import { _electron as electron, expect, test, type ElectronApplication, type Page } from '@playwright/test'

let app: ElectronApplication
let page: Page
let userDataDir: string

async function expectNoSeriousA11yViolations(label: string): Promise<void> {
  // DevTools-protocol evaluation is needed here: the production CSP correctly
  // rejects inline <script>, while Electron has no secondary tab for Axe's
  // usual Playwright injector.
  await page.evaluate(axe.source)
  const results = await page.evaluate(async () => {
    const axeApi = (window as typeof window & { axe: typeof axe }).axe
    return axeApi.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
    })
  })
  const blockers = results.violations.filter((item) => item.impact === 'critical' || item.impact === 'serious')
  expect(blockers, `${label}: ${blockers.map((item) => `${item.id} (${item.nodes.length})`).join(', ')}`).toEqual([])
}

test.beforeAll(async () => {
  userDataDir = await mkdtemp(join(tmpdir(), 'primera-e2e-'))
  app = await electron.launch({
    args: [resolve('out/main/index.js'), `--user-data-dir=${userDataDir}`],
    env: { ...process.env, PRIMER_DEV: '1' },
  })
  page = await app.firstWindow()
  await page.setViewportSize({ width: 1440, height: 900 })
})

test.afterAll(async () => {
  await app?.close()
  if (userDataDir) await rm(userDataDir, { recursive: true, force: true })
})

test('alur boot, mulai stase, mode gelap, dan teks 200% tetap dapat digunakan', async () => {
  await expect(page.getByRole('heading', { name: 'PRIMERA' })).toBeVisible()
  // Audit keadaan interaktif menetap, bukan frame transisi masuk 700 ms yang
  // memang sedang memudarkan seluruh panel dari transparan.
  await page.waitForTimeout(1_200)
  await expectNoSeriousA11yViolations('layar judul')
  await page.screenshot({ path: test.info().outputPath('01-title.png'), fullPage: true })

  await page.getByPlaceholder('tulis namamu di sini').fill('Dokter E2E')
  await page.getByRole('button', { name: 'Mulai Stase' }).click()
  const onboarding = page.getByRole('dialog', { name: 'Panduan hari pertama' })
  await expect(onboarding).toBeVisible()
  await onboarding.getByRole('button', { name: 'Lewati' }).click()

  await expect(page.getByRole('main', { name: 'Meja Kerja' })).toBeVisible()
  await expect(page.getByRole('navigation')).toContainText('Klinik')
  await expectNoSeriousA11yViolations('meja kerja terang')
  await page.screenshot({ path: test.info().outputPath('02-meja-terang.png'), fullPage: true })

  await page.getByRole('button', { name: 'Buka Pengaturan' }).click()
  const settings = page.getByRole('dialog', { name: 'Pengaturan' })
  await settings.getByRole('radio', { name: 'Gelap' }).click()
  const textScale = settings.getByRole('slider', { name: 'Ukuran Teks' })
  await textScale.fill('2')
  await expect(settings).toContainText('200%')
  await settings.getByRole('button', { name: 'Tutup' }).click()

  const frame = page.locator('.app-frame')
  await expect(frame).toHaveAttribute('data-mode', 'malam')
  await expect(page.locator('html')).toHaveCSS('font-size', '32px')
  await expectNoSeriousA11yViolations('meja kerja gelap 200 persen')
  await page.screenshot({ path: test.info().outputPath('03-meja-gelap-200.png'), fullPage: true })

  const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  expect(horizontalOverflow, 'halaman tidak boleh menambah scrollbar horizontal global pada teks 200%').toBeLessThanOrEqual(1)

  const hudOverlap = await page.evaluate(() => {
    const boxes = [...document.querySelectorAll<HTMLElement>('.hud > .hud__kiri, .hud > .hud__nav, .hud > .hud__kanan')]
      .map((node) => ({ className: node.className, rect: node.getBoundingClientRect() }))
    const overlaps: string[] = []
    for (let i = 0; i < boxes.length; i += 1) {
      for (let j = i + 1; j < boxes.length; j += 1) {
        const a = boxes[i]!
        const b = boxes[j]!
        const x = Math.min(a.rect.right, b.rect.right) - Math.max(a.rect.left, b.rect.left)
        const y = Math.min(a.rect.bottom, b.rect.bottom) - Math.max(a.rect.top, b.rect.top)
        if (x > 1 && y > 1) overlaps.push(`${a.className} x ${b.className}`)
      }
    }
    return overlaps
  })
  expect(hudOverlap, 'kluster HUD tidak boleh bertabrakan pada teks 200%').toEqual([])

  const badgeOverlap = await page.evaluate(() => [...document.querySelectorAll<HTMLElement>('.hud__tab:has(.hud__badge)')]
    .filter((tab) => {
      const label = tab.querySelector<HTMLElement>('.hud__tab-label')?.getBoundingClientRect()
      const badge = tab.querySelector<HTMLElement>('.hud__badge')?.getBoundingClientRect()
      return Boolean(label && badge && label.right > badge.left - 1)
    })
    .map((tab) => tab.textContent?.trim()))
  expect(badgeOverlap, 'badge jumlah tidak boleh menutup label navigasi').toEqual([])
})
