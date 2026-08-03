/**
 * GERBANG STRUKTURAL BENTUK URL SUMBER — offline, deterministik, tanpa jaringan.
 *
 * Latar (audit CODEX 2026-08-03, temuan P1-3): tiga tautan `pedoman_indonesia`
 * yang berlabel "PPK Dokter FKTP KMK 1186/2022" ternyata menunjuk halaman
 * BERITA ("read/1035/workshop-clinical-pathway-…"), bukan regulasinya — dan
 * halaman itu kini 404. Dua kesalahan bertumpuk: salah dokumen sejak awal,
 * lalu mati.
 *
 * Pemeriksa keterjangkauan yang sesungguhnya sudah ada
 * (`npm run audit:provenance:urls`) tetapi butuh jaringan, sehingga tak layak
 * jadi gerbang tiap commit — 49 URL sehat memang membalas 403 kepada bot.
 * Test ini menangkap KELAS kesalahan yang menghasilkan tautan-tautan tadi,
 * tanpa menyentuh jaringan sama sekali:
 *
 *   sebuah sumber yang mengklaim REGULASI tidak boleh menunjuk URL
 *   berbentuk artikel berita.
 *
 * Yang sudah terlanjur ada didaftar eksplisit di bawah sebagai utang yang
 * menunggu keputusan dr. Wirayuda (memilih dokumen pengganti adalah penilaian
 * otoritas sumber, bukan keputusan pengembang). Daftar itu hanya boleh
 * MENGECIL. Tautan buruk BARU gagal seketika.
 */
import { describe, expect, it } from 'vitest'
import { PACK } from './index'

/** Bentuk path yang menandakan halaman berita/artikel, bukan dokumen resmi. */
const POLA_BERITA = [/\/read\/\d+\//i, /\/view_artikel\//i, /\/berita\//i, /\/artikel\//i]

/**
 * Utang tautan yang sudah ada saat gerbang ini dipasang (2026-08-03).
 * Semuanya SUDAH TERVERIFIKASI MATI (404 di Chrome sungguhan, bukan sekadar
 * ditolak bot) dan menunggu keputusan pengganti dari dr. Wirayuda.
 * JANGAN menambah entri ke daftar ini — perbaiki URL-nya.
 */
const UTANG_MENUNGGU_KEPUTUSAN_DOKTER: readonly string[] = [
  'https://keslan.kemkes.go.id/read/1035/workshop-clinical-pathway-upaya-penguatan-pelayanan-kesehatan-di-fktp',
  'https://keslan.kemkes.go.id/view_artikel/3492/mengenal-demam-tifoid',
  'https://keslan.kemkes.go.id/view_artikel/737/diare-tanda-gejala-dan-cara-mengatasinya',
]

interface SumberDipakai {
  kasusId: string
  label: string
  url: string
  jenis: string
}

function semuaSumber(): SumberDipakai[] {
  const keluar: SumberDipakai[] = []
  for (const k of Object.values(PACK.kasus)) {
    for (const s of k.sumber ?? []) {
      keluar.push({ kasusId: k.id, label: s.label, url: s.url, jenis: s.jenis })
    }
  }
  return keluar
}

describe('bentuk URL sumber klinis', () => {
  it('sumber pedoman tidak menunjuk halaman berita (kecuali utang yang sudah terdaftar)', () => {
    const baru = semuaSumber().filter(
      (s) =>
        s.jenis === 'pedoman_indonesia' &&
        POLA_BERITA.some((pola) => pola.test(s.url)) &&
        !UTANG_MENUNGGU_KEPUTUSAN_DOKTER.includes(s.url),
    )

    expect(
      baru.map((s) => `${s.kasusId}: "${s.label}" -> ${s.url}`),
      'Sumber pedoman baru menunjuk halaman berita, bukan dokumen resminya. ' +
        'Cari URL dokumen/regulasinya sendiri (JDIH Kemenkes, situs penerbit).',
    ).toEqual([])
  })

  it('daftar utang hanya boleh mengecil — entri yang sudah tak dipakai wajib dihapus', () => {
    const dipakai = new Set(semuaSumber().map((s) => s.url))
    const basi = UTANG_MENUNGGU_KEPUTUSAN_DOKTER.filter((u) => !dipakai.has(u))

    expect(
      basi,
      'URL ini sudah tidak dipakai konten mana pun — hapus dari ' +
        'UTANG_MENUNGGU_KEPUTUSAN_DOKTER supaya daftarnya tetap jujur.',
    ).toEqual([])
  })

  it('setiap URL sumber memakai https dan tanpa kredensial tertanam', () => {
    const buruk = semuaSumber().filter((s) => {
      if (!s.url.startsWith('https://')) return true
      try {
        const u = new URL(s.url)
        return Boolean(u.username || u.password)
      } catch {
        return true
      }
    })

    expect(buruk.map((s) => `${s.kasusId}: ${s.url}`)).toEqual([])
  })
})
