// QA fixtures live only in this isolated browser context, never in a player's save.
const { chromium, expect } = require('@playwright/test')
const { mkdirSync, writeFileSync, existsSync } = require('node:fs')
const path = require('node:path')
const axe = require('axe-core')

;(async () => {
  const output = path.resolve('test-results/lab2-preview')
  mkdirSync(output, { recursive: true })
  const fallback = path.join(process.env.LOCALAPPDATA, 'ms-playwright/chromium-1208/chrome-win64/chrome.exe')
  const browser = await chromium.launch({ headless: true, ...(existsSync(fallback) ? { executablePath: fallback } : {}) })
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
  const errors = []
  const a11y = []
  page.on('pageerror', (e) => errors.push(e.message))
  const shot = async (name) => { await page.evaluate(() => document.fonts.ready); await page.screenshot({ path: path.join(output, `${name}.png`) }); console.log(`Screenshot: ${name}`) }
  const audit = async (name, selector) => {
    await page.evaluate(axe.source)
    const result = await page.evaluate(async (selector) => (await window.axe.run(selector)).violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.map((n) => n.target) })), selector)
    a11y.push({ name, violations: result })
  }
  try {
    await page.goto('http://127.0.0.1:5202/')
    await expect(page.getByRole('heading', { name: 'PRIMERA', exact: true })).toBeVisible()
    await expect(page.getByText('CODEX LAB 2 · SUKAMAJU BERKISAH')).toBeVisible()
    await shot('01-title')
    await page.evaluate(async (root) => {
      const { useGame } = await import('/src/store.ts')
      const { buildInitialState } = await import(`${root}/src/engine/init.ts`)
      const { PACK } = await import(`${root}/src/content/index.ts`)
      const base = () => {
        const s = buildInitialState('Playtest Lab 2', 71, PACK)
        s.hari = 46; s.blok = 'siang'; s.layar = 'meja'
        s.desa.binaan = ['keluarga_wulan', 'keluarga_santoso']
        return s
      }
      const s = base()
      s.careEpisodes = [
        { id: 'qa_wulan', subjectId: 'wulan', subjectName: 'Ibu Wulan', familyId: 'keluarga_wulan', rw: PACK.keluarga.keluarga_wulan.rw, source: 'keluarga', problemId: 'ht', problemLabel: 'Pemantauan tekanan darah', owner: 'dokter', status: 'menunggu', openedDay: 39, updatedDay: 43, dueDay: 45, nextAction: 'Temui keluarga untuk melanjutkan pemantauan.', receipt: { signal: 'Laporan kader diterima.', decision: 'Jadwal tindak lanjut disepakati.', next: 'Tinjau keadaan keluarga.' }, history: [{ hari: 39, status: 'terdeteksi', label: 'Kabar pertama', detail: 'Kader membawa catatan keluarga.' }, { hari: 43, status: 'menunggu', label: 'Janji berikutnya', detail: 'Keluarga menyepakati pertemuan lanjutan.' }] },
        { id: 'qa_santoso', subjectId: 'santoso', subjectName: 'Pak Santoso', familyId: 'keluarga_santoso', rw: PACK.keluarga.keluarga_santoso.rw, source: 'keluarga', problemId: 'rumah', problemLabel: 'Pendampingan lingkungan rumah', owner: 'kader', status: 'menunggu', openedDay: 41, updatedDay: 44, dueDay: 48, nextAction: 'Tinjau perubahan yang dijanjikan keluarga.', receipt: { signal: 'Temuan kunjungan rumah.', next: 'Kunjungi sesuai jadwal.' }, history: [{ hari: 44, status: 'menunggu', label: 'Rencana bersama', detail: 'Tindak lanjut sudah dijadwalkan.' }] },
      ]
      window.labQA = { useGame, PACK, base }
      useGame.setState({ state: s, lastEvents: [], eventTick: 0, sedangMemuat: false })
    }, `/@fs/${process.cwd().replaceAll('\\', '/')}`)
    await expect(page.getByRole('region', { name: 'Kabar Sukamaju' })).toBeVisible()
    await shot('02-kabar-sukamaju')
    await audit('Kabar', '.lab-kabar')
    // Episode tanpa keluarga mengakhiri modal dengan summary native. Semua
    // navigasi di bawah memakai keyboard Chromium, bukan simulasi Tab jsdom.
    await page.evaluate(() => {
      const { useGame } = window.labQA
      const state = useGame.getState().state
      window.labQA.episodes = state.careEpisodes
      const episode = { ...state.careEpisodes[1], id: 'qa_keyboard', familyId: undefined, dueDay: 60, subjectName: 'Pasien jejaring' }
      useGame.setState({ state: { ...state, careEpisodes: [...state.careEpisodes, episode] } })
    })
    const pemicuJejak = page.getByRole('button', { name: /^Buka Jejak Perawatan/ })
    await pemicuJejak.click()
    const jejak = page.getByRole('dialog', { name: 'Jejak Perawatan lintas UKM dan UKP' })
    const tutupJejak = jejak.getByRole('button', { name: 'Tutup Jejak Perawatan' })
    const ringkasanTerakhir = jejak.locator('summary').last()
    await expect(tutupJejak).toBeFocused()
    await page.keyboard.press('Shift+Tab')
    await expect(ringkasanTerakhir).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(jejak.locator('details').last()).toHaveAttribute('open', '')
    await page.keyboard.press('Tab')
    await expect(tutupJejak).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(jejak).not.toBeVisible()
    await expect(pemicuJejak).toBeFocused()
    await page.evaluate(() => {
      const { useGame, episodes } = window.labQA
      useGame.setState({ state: { ...useGame.getState().state, careEpisodes: episodes } })
    })
    await page.getByRole('button', { name: /^Temukan .*Wulan/ }).click()
    await expect(page.locator('#peta-keluarga-keluarga_wulan')).toBeFocused()
    await page.getByRole('button', { name: 'Tindak lanjut', exact: true }).click()
    await shot('03-peta-tindak-lanjut')
    await audit('Fokus peta', '.lab-map-focus')
    await page.getByRole('button', { name: /ALBUM KELUARGA.*Wajah di balik angka/ }).click()
    await expect(page.getByRole('dialog', { name: 'Album Keluarga Sukamaju' })).toBeVisible()
    await page.locator('.lab-album summary').filter({ hasText: 'Pemantauan tekanan darah' }).click()
    await shot('04-album-keluarga')
    await audit('Album', '.lab-album')
    await page.getByRole('button', { name: 'Tutup album keluarga' }).click()
    await page.evaluate(() => {
      const { useGame, PACK, base } = window.labQA
      const s = base(); s.layar = 'peta'
      const kasus = Object.values(PACK.kasus).find((k) => k.ambangKluster !== undefined && k.ambangKluster <= 3)
      s.desa.surveilans = [
        { hari: 40, rw: 1, kasusId: kasus.id, pasienNama: 'Pasien A' },
        { hari: 42, rw: 1, kasusId: kasus.id, pasienNama: 'Pasien A' },
        { hari: 43, rw: 1, kasusId: kasus.id, pasienNama: 'Pasien B' },
        { hari: 45, rw: 1, kasusId: kasus.id, pasienNama: 'Pasien C' },
        { hari: 44, rw: 2, kasusId: kasus.id, pasienNama: 'Pasien D' },
      ]
      useGame.setState({ state: s, lastEvents: [], eventTick: 0 })
      useGame.getState().dispatch({ type: 'MULAI_KLB', rw: 1, kasusId: kasus.id })
    })
    await expect(page.getByRole('region', { name: 'Papan penyelidikan' })).toBeVisible()
    await shot('05-klb-penyelidikan')
    await page.getByRole('button', { name: 'Bandingkan seluruh RW' }).click()
    await expect(page.getByRole('rowheader', { name: 'Pasien D' })).toBeVisible()
    const judul = await page.locator('.kegiatan__kartu > .judul-seksi').textContent()
    await page.locator('.kegiatan__opsi').first().click()
    await expect(page.locator('.kegiatan__kartu > .judul-seksi')).toHaveText(judul)
    await expect(page.getByText('Kartu 1/3')).toBeVisible()
    await page.getByRole('button', { name: /Kartu Berikutnya/ }).click()
    await expect(page.getByText('Kartu 2/3')).toBeVisible()
    await audit('Penyelidikan', '.lab-investigation')
    await page.evaluate(() => {
      const { useGame, base } = window.labQA
      const s = base(); s.layar = 'peta'
      useGame.setState({ state: s, lastEvents: [], eventTick: 0 })
      useGame.getState().dispatch({ type: 'MULAI_KUNJUNGAN', keluargaId: 'keluarga_wulan' })
    })
    await expect(page.locator('.kunjungan-root')).toBeVisible()
    await page.getByRole('button', { name: /Amati lebih dekat.*titik 1 / }).click()
    await page.getByRole('button', { name: /Amati lebih dekat.*titik 2 / }).click()
    await page.getByText('Rangkai bukti sebelum memutuskan').click()
    await page.locator('.lab-notebook input[type=checkbox]').nth(0).check()
    await page.locator('.lab-notebook input[type=checkbox]').nth(1).check()
    await shot('06-buku-lapangan')
    await audit('Buku lapangan', '.lab-notebook')
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.getByRole('button', { name: 'Buka Pengaturan' }).click()
    const settings = page.getByRole('dialog', { name: 'Pengaturan' })
    await settings.getByRole('radio', { name: 'Gelap' }).click()
    await settings.getByRole('slider', { name: 'Ukuran Teks' }).fill('1.4')
    await settings.getByRole('button', { name: 'Tutup', exact: true }).click()
    await shot('07-notebook-dark-140')
    await audit('Buku gelap', '.lab-notebook')
    const tabrakan = await page.evaluate(() => {
      const a = document.querySelector('.hud__kiri').getBoundingClientRect()
      const b = document.querySelector('.hud__nav').getBoundingClientRect()
      const c = document.querySelector('.hud__kanan').getBoundingClientRect()
      return b.top < Math.max(a.bottom, c.bottom) - 1
    })
    if (tabrakan) throw new Error('HUD overlaps at 140%')

    // Jalur UI nyata: baca surat → checklist → adopsi → reload browser → lanjut.
    await page.evaluate(async () => {
      const { useGame, base, episodes } = window.labQA
      const state = base()
      state.careEpisodes = [{ ...episodes[0], id: 'qa_feedback', source: 'klinik', owner: 'rs', status: 'kembali', referral: { stage: 'feedback', hospitalName: 'RSUD' } }]
      state.inbox = [{ id: 'qa_surat_feedback', hari: state.hari, jenis: 'hasil_lab', dari: 'RSUD', judul: 'Feedback keluarga QA', isi: 'Lanjutkan kontrol di FKTP.', dibaca: false, episodeId: 'qa_feedback', kaitKeluargaId: 'keluarga_wulan' }]
      useGame.setState({ state, lastEvents: [] })
      await useGame.getState().simpan()
    })
    await page.getByRole('button', { name: /Feedback keluarga QA/ }).click()
    await page.getByRole('checkbox', { name: /Rekonsiliasi terapi/ }).check()
    await page.getByRole('checkbox', { name: /Tetapkan jadwal kontrol/ }).check()
    await page.getByRole('checkbox', { name: /Hubungkan pemantauan/ }).check()
    await page.getByRole('button', { name: /Terapkan ke rencana FKTP/ }).click()
    await expect(page.getByText(/sudah masuk ke rencana perawatan FKTP/i)).toBeVisible()
    await expect.poll(() => page.evaluate(async () => JSON.parse(await window.primer.save.read('autosave')).state.careEpisodes[0].referral.stage)).toBe('acted')
    await page.reload()
    await page.getByRole('button', { name: /^Lanjutkan — dr\./ }).click()
    await page.getByRole('button', { name: /Feedback keluarga QA/ }).click()
    await expect(page.getByText(/sudah masuk ke rencana perawatan FKTP/i)).toBeVisible()
    const pulih = await page.evaluate(async () => JSON.parse(await window.primer.save.read('autosave')).state)
    expect(pulih.inbox[0].dibaca).toBe(true)
    expect(pulih.careEpisodes[0].referral.stage).toBe('acted')
    await shot('08-feedback-restored')
    if (errors.length) throw new Error(errors.join('\n'))
    if (a11y.some((a) => a.violations.some((v) => v.impact === 'critical' || v.impact === 'serious'))) throw new Error('Serious accessibility violation; see report')
    console.log('PASS: navigation, keyboard modal, real KLB decisions, evidence comparison, dark/140%, feedback restored after reload')
  } finally {
    writeFileSync(path.join(output, 'report.json'), JSON.stringify({ errors, a11y }, null, 2))
    await browser.close()
  }
})().catch((e) => { console.error(e); process.exitCode = 1 })
