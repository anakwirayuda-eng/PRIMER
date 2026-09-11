const { chromium, expect } = require('@playwright/test')
const fs = require('node:fs')
const path = require('node:path')
const axe = require('axe-core')

;(async () => {
  const output = path.resolve('test-results/primera-131')
  fs.mkdirSync(output, { recursive: true })
  const fallback = path.join(process.env.LOCALAPPDATA, 'ms-playwright/chromium-1208/chrome-win64/chrome.exe')
  const browser = await chromium.launch({ headless: true, ...(fs.existsSync(fallback) ? { executablePath: fallback } : {}) })
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const report = { errors: [], a11y: [], hitTargets: [] }
  page.on('pageerror', e => report.errors.push(e.message))
  async function shot(name, selector = 'body') {
    await page.evaluate(() => document.fonts.ready)
    await page.screenshot({ path: path.join(output, `${name}.png`), fullPage: true })
    await page.evaluate(axe.source)
    const violations = await page.evaluate(async selector => (await window.axe.run(selector, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } })).violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => n.target) })), selector)
    report.a11y.push({ name, violations })
    console.log(name, violations.length ? JSON.stringify(violations) : 'a11y clear')
  }
  try {
    await page.goto('http://127.0.0.1:5131/')
    await expect(page.getByRole('heading', { name: 'PRIMERA', exact: true })).toBeVisible()
    await shot('01-title')
    await page.evaluate(async root => {
      const { useGame } = await import('/src/store.ts')
      const { buildInitialState } = await import(`${root}/src/engine/init.ts`)
      const { PACK } = await import(`${root}/src/content/index.ts`)
      const base = (hari = 30, layar = 'peta') => {
        const s = buildInitialState('QA PRIMERA 1.3.1', 131, PACK)
        s.hari = hari; s.blok = 'siang'; s.layar = layar
        s.desa.binaan = Object.keys(PACK.keluarga)
        for (const k of Object.values(s.desa.keluarga)) for (const n of Object.values(k.indikator)) if (n.status !== 'na') n.sumber = 'kader'
        s.desa.rw = s.desa.rw.map((r, i) => ({ ...r, kkTersurvei: r.totalKk, proporsiBaselineRoll: .12, iks: i === 0 ? .16 : i === 1 ? .1 : .12 }))
        return s
      }
      window.qa131 = { useGame, base, PACK }
      useGame.setState({ state: base(), lastEvents: [], eventTick: 0, rekapUkm: null, petaTargetKeluargaId: null })
    }, `/@fs/${process.cwd().replaceAll('\\', '/')}`)
    await page.getByRole('button', { name: /^RW 1 —/ }).click()
    await expect(page.getByRole('region', { name: 'Sasaran Posyandu RW 1' })).toBeVisible()
    await shot('02-map-progress')
    await page.evaluate(() => { const { useGame, base } = window.qa131; useGame.setState({ state: base(30, 'meja'), lastEvents: [] }) })
    await expect(page.getByLabel('Rencana jadwal Prolanis')).toBeVisible()
    await expect(page.getByText('Menunda sampai besok mengurangi satu kesempatan sesi sebelum stase berakhir.')).toBeVisible()
    await page.getByLabel('Rencana jadwal Prolanis').scrollIntoViewIfNeeded()
    await shot('03-prolanis')
    for (const width of [1440, 1280, 1000]) {
      await page.setViewportSize({ width, height: 900 })
      await page.evaluate(() => {
        const { useGame, base } = window.qa131
        const s = base(4, 'kunjungan')
        s.kunjungan = { keluargaId: 'keluarga_slamet', skenarioId: 'slamet_k1', fase: 'observasi', hotspotDitemukan: [], dialogIndex: 0, pilihanDiambil: [], trustDelta: 0, konfrontasiBeruntun: 0, diusir: false }
        useGame.setState({ state: s, lastEvents: [] })
      })
      const lock = page.locator('[data-hotspot-id="slk1_h1"]')
      await expect(lock).toBeVisible()
      const hits = await page.locator('.kunjungan-hotspot').evaluateAll(nodes => nodes.map(n => {
        const r = n.getBoundingClientRect(), hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)
        return { wanted: n.dataset.hotspotId, actual: hit?.closest('[data-hotspot-id]')?.dataset.hotspotId }
      }))
      report.hitTargets.push({ width, hits })
      expect(hits.every(h => h.wanted === h.actual)).toBe(true)
      await lock.click()
      await expect(page.getByText('1 dari 4 titik sudah diamati.')).toBeVisible()
      await shot(`04-slamet-${width}`, '.kunjungan-root')
    }
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.evaluate(() => {
      const { useGame, base } = window.qa131
      useGame.setState({ state: base(16, 'peta'), lastEvents: [], rekapUkm: null })
      useGame.getState().dispatch({ type: 'MULAI_POSYANDU', rw: 1 })
    })
    await expect(page.getByText(/RW 1 · .* · Hari 16/)).toBeVisible()
    await shot('05-posyandu')
    await page.getByRole('button', { name: /Delegasikan sisa meja/ }).click()
    await expect(page.getByText('Delegasi kader', { exact: true })).toHaveCount(4)
    await shot('06-delegation')
    await page.evaluate(() => {
      const { useGame } = window.qa131
      useGame.setState({ rekapUkm: null })
    })
    await expect(page.getByText('Pelaksana tidak tercatat', { exact: true })).toHaveCount(4)
    await page.evaluate(() => {
      const { useGame, base, PACK } = window.qa131
      const s = base(17, 'peta')
      for (const [id, k] of Object.entries(s.desa.keluarga)) {
        if (PACK.keluarga[id]?.rw !== 1) continue
        for (const ind of ['imunisasi_dasar', 'asi_eksklusif', 'pantau_tumbuh_kembang']) {
          const n = k.indikator[ind]
          if (n.status !== 'na') { n.sumber = 'kader'; n.status = n.statusSebenarnya === 'ya' ? 'tidak' : 'ya' }
        }
      }
      useGame.setState({ state: s, rekapUkm: null, lastEvents: [] })
      useGame.getState().dispatch({ type: 'MULAI_POSYANDU', rw: 1 })
      while (useGame.getState().state.kegiatan) {
        const kg = useGame.getState().state.kegiatan, kartu = kg.kartu[kg.index]
        useGame.getState().dispatch({ type: 'JAWAB_KEGIATAN', kartuId: kartu.id, pilihanId: kartu.pilihan.find(p => p.benar).id })
      }
    })
    await expect(page.getByText('Hasil verifikasi yang meluruskan laporan kader')).toBeVisible()
    await shot('06b-cadre-correction')
    await page.evaluate(() => {
      const { useGame, base } = window.qa131
      const s = base(46, 'peta')
      s.desa.surveilans = ['Satu', 'Dua', 'Tiga'].map(nama => ({ hari: 45, rw: 1, kasusId: 'dengue_df', pasienNama: nama }))
      useGame.setState({ state: s, lastEvents: [] })
      useGame.getState().dispatch({ type: 'MULAI_KLB', rw: 1, kasusId: 'dengue_df' })
    })
    await expect(page.getByRole('region', { name: 'Papan penyelidikan' })).toBeVisible()
    await shot('07-klb')
    await page.evaluate(() => {
      const { useGame, base } = window.qa131
      useGame.setState({ state: base(30, 'peta'), lastEvents: [] })
    })
    await page.getByRole('button', { name: 'Buka Pengaturan' }).click()
    const settings = page.getByRole('dialog', { name: 'Pengaturan' })
    await settings.getByRole('radio', { name: 'Gelap' }).click()
    await settings.getByRole('slider', { name: 'Ukuran Teks' }).fill('2')
    await settings.getByRole('button', { name: 'Tutup' }).click()
    await expect(page.locator('.app-frame')).toHaveAttribute('data-mode', 'malam')
    await expect(page.locator('html')).toHaveCSS('font-size', '32px')
    await page.getByRole('button', { name: /^RW 1 —/ }).click()
    report.hudOverlap = await page.evaluate(() => {
      const nodes = [...document.querySelectorAll('.hud > .hud__kiri, .hud > .hud__nav, .hud > .hud__kanan')]
      const overlap = []
      nodes.forEach((a, i) => nodes.slice(i + 1).forEach(b => {
        const x = a.getBoundingClientRect(), y = b.getBoundingClientRect()
        if (Math.min(x.right, y.right) - Math.max(x.left, y.left) > 1 && Math.min(x.bottom, y.bottom) - Math.max(x.top, y.top) > 1) overlap.push([a.className, b.className])
      }))
      return overlap
    })
    expect(report.hudOverlap).toEqual([])
    expect(await page.locator('.peta-svg').evaluate(n => n.getBoundingClientRect().width)).toBeGreaterThan(700)
    await shot('08-map-dark-200')
    await page.getByRole('region', { name: 'Sasaran Posyandu RW 1' }).scrollIntoViewIfNeeded()
    await shot('09-map-detail-dark-200')
    report.overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(report.overflow).toBeLessThanOrEqual(1)
    expect(report.errors).toEqual([])
    expect(report.a11y.flatMap(a => a.violations).filter(v => ['serious', 'critical'].includes(v.impact))).toEqual([])
  } catch (error) {
    report.failure = { message: String(error), body: (await page.locator('body').innerText()).slice(0, 5000) }
    await page.screenshot({ path: path.join(output, 'failure.png'), fullPage: true })
    throw error
  } finally {
    fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2))
    await browser.close()
  }
})().catch(e => { console.error(e); process.exitCode = 1 })
