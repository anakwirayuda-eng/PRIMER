/**
 * TEST — invarian lapisan UI (M10.a, 2026-07-06). jsdom tak memproses CSS
 * sungguhan (tak ada painting/hit-testing), jadi bug tumpang-tindih kelas ini
 * historisnya baru ketahuan saat playtest manusia (toast menimpa tombol modal
 * §38; kartu temuan menelan klik hotspot; tombol melayang menelan klik kartu
 * Dex). Pagar di sini bekerja di LEVEL SUMBER CSS — pola sama sapuan teks
 * tatalaksanaClue.test.ts: bukan pengganti verifikasi browser, tapi mencegah
 * regresi diam-diam saat seseorang "merapikan" deklarasi yang kelihatannya
 * tak berguna padahal load-bearing.
 */
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const baca = (p: string) => readFileSync(resolve(__dirname, p), 'utf8')

/** Ambil isi blok deklarasi pertama selector persis `sel` (tanpa nested). */
function blok(css: string, sel: string): string {
  const re = new RegExp(sel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*\\{([^}]*)\\}')
  const m = css.match(re)
  if (!m) throw new Error(`Selector ${sel} tidak ditemukan`)
  return m[1]!
}

describe('invarian lapisan UI (M10.a)', () => {
  const tokens = baca('./tokens.css')

  it('urutan token z-index: hud < drawer < toast < modal', () => {
    const nilai = (nama: string): number => {
      const m = tokens.match(new RegExp(`--z-${nama}:\\s*(\\d+)`))
      if (!m) throw new Error(`--z-${nama} tidak ditemukan di tokens.css`)
      return Number(m[1])
    }
    // §38: toast WAJIB di bawah modal — toast informatif tak boleh menimpa
    // tombol modal aktif (PanelHasil "Pasien Berikutnya" dkk).
    expect(nilai('toast')).toBeLessThan(nilai('modal'))
    expect(nilai('hud')).toBeLessThan(nilai('drawer'))
    expect(nilai('drawer')).toBeLessThan(nilai('toast'))
  })

  it('.toaster pointer-events none — toast tak pernah mencegat klik (§38)', () => {
    expect(blok(baca('../components/Toaster.css'), '.toaster')).toMatch(/pointer-events:\s*none/)
  })

  it('.toaster di ATAS (bukan bawah) — jauh dari zona tombol aksi (laporan live user 3×)', () => {
    // Toast di bawah-kanan berulang kali menutupi tombol "Lanjut/Pasien
    // Berikutnya/Tulis Resep". Kini di atas: `top` ada, `bottom` TIDAK.
    const isi = blok(baca('../components/Toaster.css'), '.toaster')
    expect(isi).toMatch(/top:/)
    expect(isi).not.toMatch(/bottom:/)
  })

  it('toast punya fase keluar (mengabur) — bukan pop hilang mendadak', () => {
    const css = baca('../components/Toaster.css')
    expect(css).toMatch(/\.toast--keluar\s*\{/)
    expect(css).toMatch(/@keyframes toast-keluar/)
    // Toaster.tsx menandai `keluar` sebelum menghapus (dua fase timer).
    expect(baca('../components/Toaster.tsx')).toMatch(/toast--keluar/)
  })

  it('kartu temuan kunjungan adalah SIBLING panggung, bukan overlay absolute', () => {
    // Sapuan UI/UX 2026-07-16 (P0): dulu .kunjungan-temuan position:absolute
    // menutupi 34% scene dan hotspot butuh z-index workaround supaya tembus
    // (empiris wulan_k1 wk1_h3). Kini temuan = kolom sibling .kunjungan-panggung
    // — TIDAK boleh ada yang kembali memosisikannya absolute, dan workaround
    // z-index di hotspot tak boleh dihidupkan lagi diam-diam.
    const css = baca('../screens/Kunjungan.css')
    expect(blok(css, '.kunjungan-panggung')).toMatch(/position:\s*relative/)
    expect(blok(css, '.kunjungan-temuan')).toMatch(/position:\s*static/)
    expect(blok(css, '.kunjungan-temuan')).not.toMatch(/position:\s*absolute/)
  })

  it('mute+gigi in-game didok di HUD, bukan melayang (kelas menelan-klik konten)', () => {
    // Varian --dok wajib position:static; dan Hud.tsx wajib me-render keduanya
    // (kalau dicabut dari HUD tanpa sadar, versi melayang TIDAK kembali otomatis
    // — pemain kehilangan akses audio/pengaturan in-game sama sekali).
    expect(blok(baca('../audio/MuteButton.css'), '.mute-tombol--dok')).toMatch(/position:\s*static/)
    expect(blok(baca('../components/Pengaturan.css'), '.set-gigi--dok')).toMatch(/position:\s*static/)
    const hud = baca('../components/Hud.tsx')
    expect(hud).toMatch(/<MuteButton dok \/>/)
    expect(hud).toMatch(/<Pengaturan dok \/>/)
  })

  // CODEX M10.a ronde-3 (2026-07-06): html/body dikunci overflow:hidden global
  // ("game desktop: satu viewport, tanpa scroll dokumen" — base.css) — TIDAK
  // ADA scroll fallback di level dokumen. Setiap kartu dialog fixed-overlay
  // (modal/set-modal/tentang-modal) karenanya WAJIB batasi tinggi sendiri +
  // overflow-y:auto, kalau tidak konten yg melebihi viewport (teks panjang,
  // skala teks besar M7.31, layar pendek) mengunci tombol lanjut/tutup di
  // luar jangkauan TANPA jalan scroll manapun. `.onb-kartu` (Onboarding, satu2
  // gerbang wajib Hari 1) SEMPAT jadi satu-satunya yg luput dari pola ini.
  it('setiap kartu dialog fixed-overlay membatasi tinggi + overflow (tak ada scroll dokumen fallback)', () => {
    const kartu = [
      { file: '../styles/base.css', sel: '.modal' },
      { file: '../components/Pengaturan.css', sel: '.set-modal' },
      { file: '../components/TentangModal.css', sel: '.tentang-modal' },
      { file: '../components/Onboarding.css', sel: '.onb-kartu' },
    ]
    for (const { file, sel } of kartu) {
      const isi = blok(baca(file), sel)
      expect(isi, `${sel} butuh max-height`).toMatch(/max-height:/)
      expect(isi, `${sel} butuh overflow(-y):(auto|scroll)`).toMatch(/overflow(-y)?:\s*(auto|scroll)/)
    }
  })

  // CODEX M10.a ronde-4 (2026-07-06, dossier §44): 7 titik modal/overlay
  // semula tak konsisten — 3 (MejaKerja x2, PetaDesa) TANPA role="dialog"
  // sama sekali, 4 lainnya py role="dialog" tapi TANPA aria-modal. Keduanya
  // WAJIB hadir berdampingan (pola dialog modal WAI-ARIA) di SEMUA 7 titik —
  // pagar generik spy titik ke-8 di masa depan tak lolos dgn pola lama.
  it('semua 7 titik modal/overlay: role="dialog" + aria-modal="true" berdampingan', () => {
    // Penanda = literal `ref={...}` yang dipasang sendiri saat fix (unik per
    // titik, tak bentrok dgn teks/komentar lain — beda dari string judul yg
    // ternyata muncul lagi duluan di komentar/prosa sebelum JSX modalnya).
    const titik = [
      { file: '../components/Onboarding.tsx', tanda: 'ref={ref}' },
      { file: '../components/Pengaturan.tsx', tanda: 'ref={ref}' },
      { file: '../components/TentangModal.tsx', tanda: 'ref={ref}' },
      { file: '../screens/klinik/PanelHasil.tsx', tanda: 'ref={ref}' },
      { file: '../screens/MejaKerja.tsx', tanda: 'ref={refRekap}' },
      { file: '../screens/MejaKerja.tsx', tanda: 'ref={refLokmin}' },
      { file: '../screens/PetaDesa.tsx', tanda: 'ref={refHasilKunjungan}' },
    ]
    for (const { file, tanda } of titik) {
      const src = baca(file)
      const idx = src.indexOf(tanda)
      expect(idx, `${file}: penanda '${tanda}' tak ditemukan`).toBeGreaterThan(-1)
      // Jendela ±400 char SETELAH penanda ref — atribut dialog menyusul di JSX.
      const jendela = src.slice(idx, idx + 400)
      expect(jendela, `${file} (${tanda}): butuh role="dialog"`).toMatch(/role="dialog"/)
      expect(jendela, `${file} (${tanda}): butuh aria-modal="true"`).toMatch(/aria-modal="true"/)
    }
  })
})
