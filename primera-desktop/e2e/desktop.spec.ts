import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import axe from 'axe-core'
import { _electron as electron, expect, test, type ElectronApplication, type Page } from '@playwright/test'

let app: ElectronApplication
let page: Page
let userDataDir: string

async function mulaiStase(nama = 'Dokter E2E'): Promise<void> {
  await expect(page.getByRole('heading', { name: 'PRIMERA' })).toBeVisible()
  await page.getByPlaceholder('tulis namamu di sini').fill(nama)
  await page.getByRole('button', { name: 'Mulai Stase' }).click()
  const onboarding = page.getByRole('dialog', { name: 'Panduan hari pertama' })
  await expect(onboarding).toBeVisible()
  await onboarding.getByRole('button', { name: 'Lewati' }).click()
  await expect(page.getByRole('main', { name: 'Meja Kerja' })).toBeVisible()
}

async function aturGelap200Persen(): Promise<void> {
  await page.getByRole('button', { name: 'Buka Pengaturan' }).click()
  const settings = page.getByRole('dialog', { name: 'Pengaturan' })
  await settings.getByRole('radio', { name: 'Gelap' }).click()
  const textScale = settings.getByRole('slider', { name: 'Ukuran Teks' })
  await textScale.fill('2')
  await expect(settings).toContainText('200%')
  await settings.getByRole('button', { name: 'Tutup' }).click()
}

async function tungguAutosave(): Promise<void> {
  await expect.poll(async () => page.evaluate(async () => {
    const primer = (window as typeof window & {
      primer: { save: { read(slot: string): Promise<string | null> } }
    }).primer
    return (await primer.save.read('autosave')) !== null
  })).toBe(true)
}

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

test.beforeEach(async () => {
  userDataDir = await mkdtemp(join(tmpdir(), 'primera-e2e-'))
  app = await electron.launch({
    args: [resolve('out/main/index.js'), `--user-data-dir=${userDataDir}`],
    env: { ...process.env, PRIMER_DEV: '1' },
  })
  page = await app.firstWindow()
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.reload()
})

test.afterEach(async () => {
  await app?.close()
  if (userDataDir) await rm(userDataDir, { recursive: true, force: true })
})

test('alur boot, mulai stase, mode gelap, dan teks 200% tetap dapat digunakan', async () => {
  await expect(page.getByRole('heading', { name: 'PRIMERA' })).toBeVisible()
  await expect(page.locator('.title__aksi')).toHaveCSS('opacity', '1')
  await expectNoSeriousA11yViolations('layar judul')
  await page.screenshot({ path: test.info().outputPath('01-title.png'), fullPage: true })

  await mulaiStase()
  await expect(page.getByRole('navigation')).toContainText('Klinik')
  await expectNoSeriousA11yViolations('meja kerja terang')
  await page.screenshot({ path: test.info().outputPath('02-meja-terang.png'), fullPage: true })

  await aturGelap200Persen()

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

test('debrief IGD menampilkan sumber ringkas tanpa overflow pada mode gelap dan teks 200%', async () => {
  await mulaiStase()
  await aturGelap200Persen()
  await tungguAutosave()

  const tersimpan = await page.evaluate(async () => {
    const primer = (window as typeof window & {
      primer: { save: { read(slot: string): Promise<string | null>; write(slot: string, json: string): Promise<boolean> } }
    }).primer
    const json = await primer.save.read('autosave')
    if (!json) return false
    const amplop = JSON.parse(json) as { state?: { layar?: string; inbox?: unknown[] } }
    if (!amplop.state || !Array.isArray(amplop.state.inbox)) return false
    amplop.state.layar = 'meja'
    amplop.state.inbox.push({
      id: 'surat_igd_e2e_bukti',
      hari: 1,
      jenis: 'igd',
      dari: 'Perawat jaga',
      judul: 'Debrief E2E serangan asma berat',
      isi: 'Pasien stabil dan diterima jejaring rujukan.',
      dibaca: false,
      kaitKasusIgdId: 'igd_asma_berat',
    })
    return primer.save.write('autosave', JSON.stringify(amplop))
  })
  expect(tersimpan).toBe(true)

  await page.reload()
  await expect(page.getByRole('heading', { name: 'PRIMERA' })).toBeVisible()
  await page.getByRole('button', { name: /Lanjutkan.*Dokter E2E.*Hari 1/ }).click()
  await expect(page.getByRole('main', { name: 'Meja Kerja' })).toBeVisible()

  await page.getByRole('button', { name: /Debrief E2E serangan asma berat/ }).click()
  const summary = page.getByText('Panduan resmi & sumber')
  await expect(summary).toBeVisible()
  await expect(summary.locator('..')).not.toHaveAttribute('open', '')
  await summary.click()

  await expect(page.getByText('INTI KEPUTUSAN')).toBeVisible()
  const gina = page.getByRole('link', { name: /GINA Global Strategy for Asthma 2026/ })
  await gina.scrollIntoViewIfNeeded()
  await expect(gina).toBeVisible()
  await app.evaluate(({ shell }) => {
    const root = globalThis as typeof globalThis & { __primerExternalUrls?: string[] }
    root.__primerExternalUrls = []
    shell.openExternal = async (url: string) => {
      root.__primerExternalUrls?.push(url)
    }
  })
  await gina.click()
  const urlDibuka = await app.evaluate(() => {
    const root = globalThis as typeof globalThis & { __primerExternalUrls?: string[] }
    return root.__primerExternalUrls ?? []
  })
  expect(urlDibuka).toEqual([
    'https://ginasthma.org/wp-content/uploads/2026/05/GINA-2026-Strategy-Report-WMS.pdf',
  ])
  expect(app.windows()).toHaveLength(1)
  await expect(page.locator('.app-frame')).toHaveAttribute('data-mode', 'malam')
  await expect(page.locator('html')).toHaveCSS('font-size', '32px')
  await expectNoSeriousA11yViolations('debrief IGD gelap 200 persen')

  const overflow = await page.locator('.mk__surat-kertas').evaluate((node) => node.scrollWidth - node.clientWidth)
  expect(overflow, 'panel debrief dan URL panjang tidak boleh membuat surat overflow horizontal').toBeLessThanOrEqual(1)
  await page.screenshot({ path: test.info().outputPath('04-debrief-igd-gelap-200.png'), fullPage: true })
})

test('provenance UKM dapat dibuka tanpa overflow pada mode gelap dan teks 200%', async () => {
  await mulaiStase()
  await aturGelap200Persen()
  await tungguAutosave()

  const tersimpan = await page.evaluate(async () => {
    const primer = (window as typeof window & {
      primer: { save: { read(slot: string): Promise<string | null>; write(slot: string, json: string): Promise<boolean> } }
    }).primer
    const json = await primer.save.read('autosave')
    if (!json) return false
    const amplop = JSON.parse(json) as { state?: Record<string, unknown> }
    if (!amplop.state) return false
    amplop.state.layar = 'kunjungan'
    amplop.state.kunjungan = {
      keluargaId: 'keluarga_wulan',
      skenarioId: 'wulan_k1',
      fase: 'resep_sosial',
      hotspotDitemukan: [],
      dialogIndex: 0,
      pilihanDiambil: [],
      trustDelta: 0,
      konfrontasiBeruntun: 0,
      diusir: false,
    }
    return primer.save.write('autosave', JSON.stringify(amplop))
  })
  expect(tersimpan).toBe(true)

  await page.reload()
  await page.getByRole('button', { name: /Lanjutkan.*Dokter E2E.*Hari 1/ }).click()
  await expect(page.locator('.kunjungan-root')).toBeVisible()

  const kartu = page.locator('.kunjungan-intervensi').first()
  await kartu.scrollIntoViewIfNeeded()
  await kartu.click()
  const panel = page.getByLabel(/Konteks ilmiah kartu terpilih/i)
  await expect(panel).toBeVisible()
  const links = panel.getByRole('link', { name: /buka di browser bawaan/i })
  await expect(links).toHaveCount(2)

  await app.evaluate(({ shell }) => {
    const root = globalThis as typeof globalThis & { __primerExternalUrls?: string[] }
    root.__primerExternalUrls = []
    shell.openExternal = async (url: string) => {
      root.__primerExternalUrls?.push(url)
    }
  })
  await links.first().click()
  const urlDibuka = await app.evaluate(() => {
    const root = globalThis as typeof globalThis & { __primerExternalUrls?: string[] }
    return root.__primerExternalUrls ?? []
  })
  expect(urlDibuka[0]).toMatch(/^https:\/\//)
  expect(app.windows()).toHaveLength(1)
  await expectNoSeriousA11yViolations('provenance UKM gelap 200 persen')

  const overflow = await panel.evaluate((node) => node.scrollWidth - node.clientWidth)
  expect(overflow, 'panel provenance UKM tidak boleh overflow horizontal').toBeLessThanOrEqual(1)
  await page.screenshot({ path: test.info().outputPath('05-provenance-ukm-gelap-200.png'), fullPage: true })
})

test('kasus prototipe rujuk tetap formatif dan tidak membocorkan jejaring sebelum disposisi', async () => {
  await mulaiStase()
  await tungguAutosave()

  const tersimpan = await page.evaluate(async () => {
    const primer = (window as typeof window & {
      primer: { save: { read(slot: string): Promise<string | null>; write(slot: string, json: string): Promise<boolean> } }
    }).primer
    const json = await primer.save.read('autosave')
    if (!json) return false
    const amplop = JSON.parse(json) as {
      state?: {
        layar?: string
        tutorialAktif?: boolean
        klinik?: {
          aktif?: unknown
          antrian?: Array<{ kasusId?: string }>
        }
      }
    }
    const pasien = amplop.state?.klinik?.antrian?.[0]
    if (!amplop.state || !amplop.state.klinik || !pasien) return false
    amplop.state.layar = 'klinik'
    amplop.state.tutorialAktif = false
    delete amplop.state.klinik.aktif
    pasien.kasusId = 'lab_skrofuloderma_suspek'
    return primer.save.write('autosave', JSON.stringify(amplop))
  })
  expect(tersimpan).toBe(true)

  await page.reload()
  await page.getByRole('button', { name: /Lanjutkan.*Dokter E2E.*Hari 1/ }).click()
  await expect(page.getByRole('main', { name: 'Klinik' })).toBeVisible()
  await expect(page.getByText('Latihan formatif', { exact: true })).toBeVisible()
  await expectNoSeriousA11yViolations('ruang tunggu kasus formatif')

  await page.getByRole('button', { name: /Panggil Pasien Berikutnya/ }).click()
  await expect(page.getByRole('region', { name: /Deck aksi klinik.*Anamnesis/ })).toBeVisible()
  await expect(page.getByLabel('Informasi jejaring pra-rujuk')).toHaveCount(0)
  await expect(page.getByText('JEJARING PRA-RUJUK')).toHaveCount(0)
})
