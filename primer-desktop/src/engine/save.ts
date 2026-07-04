/**
 * SAVE — serialisasi GameState versi-berskema.
 * Amplop `{ v: 1, state }` agar migrasi skema di masa depan punya pintu masuk.
 * `deserialize` defensif: JSON rusak / versi asing / bentuk dasar cacat → null
 * (store lalu memperlakukannya sebagai "tidak ada autosave", bukan crash).
 */

import type { GameState } from './state'
import type { ContentPack } from '@content/pack'

const VERSI_SAVE = 1 as const

export function serialize(state: GameState): string {
  return JSON.stringify({ v: VERSI_SAVE, state })
}

function objek(nilai: unknown): nilai is Record<string, unknown> {
  return typeof nilai === 'object' && nilai !== null && !Array.isArray(nilai)
}

/**
 * `pack` opsional: bila disertakan, deserialize memulihkan IGD aktif yang
 * kasusnya sudah tak ada di konten (build lebih baru mengubah/menghapus kasus
 * IGD) alih-alih membiarkan save tersebut macet permanen — layar IGD kosong
 * ("return null") sementara LANJUTKAN tetap terkunci selama s.igd ada
 * (CODEX P2). Dipanggil tanpa pack di test murni/migrasi skema dasar.
 */
export function deserialize(json: string, pack?: ContentPack): GameState | null {
  let mentah: unknown
  try {
    mentah = JSON.parse(json)
  } catch {
    return null
  }

  if (!objek(mentah)) return null
  if (mentah['v'] !== VERSI_SAVE) return null

  const st = mentah['state']
  if (!objek(st)) return null

  // Cek versi skema state + tipe dasar. Bukan validasi penuh — cukup untuk
  // menolak save korup/asing tanpa memfosilkan seluruh bentuk state di sini.
  if (st['versi'] !== 1) return null
  if (typeof st['hari'] !== 'number' || !Number.isFinite(st['hari'])) return null
  if (st['blok'] !== 'pagi' && st['blok'] !== 'siang' && st['blok'] !== 'sore') return null
  if (typeof st['seed'] !== 'number') return null
  if (typeof st['namaDokter'] !== 'string') return null
  if (!objek(st['klinik'])) return null
  if (!objek(st['desa'])) return null
  if (!objek(st['tally'])) return null
  if (!objek(st['dex'])) return null
  if (!Array.isArray(st['inbox'])) return null
  if (!Array.isArray(st['jadwal'])) return null
  if (!Array.isArray(st['log'])) return null

  // Semua angka inti harus finite — save yang diedit tangan / korup sebagian
  // (NaN, Infinity, string) tidak boleh meracuni skor.
  for (const kunci of ['stamina', 'burnout', 'kapitasi'] as const) {
    const nilai = st[kunci]
    if (typeof nilai !== 'number' || !Number.isFinite(nilai)) return null
  }
  const tally = st['tally'] as Record<string, unknown>
  // Migrasi-lite: field tally baru diisi 0 untuk save dari versi lebih lama.
  if (tally['autoBermasalah'] === undefined) tally['autoBermasalah'] = 0
  for (const kunci of ['posyanduSesi', 'prolanisSesi', 'klbTuntas', 'rujukanTepat', 'rujukanDitolak', 'igdStabil', 'igdSalahDisposisi', 'igdMeninggal', 'rmLengkap', 'teguranDinkes'] as const) {
    if (tally[kunci] === undefined) tally[kunci] = 0
  }
  // Migrasi-lite M4: gudang & buku kas untuk save pra-ekonomi. Stok kosong =
  // tidak dilacak (gerbang stok lolos); backfill penuh dilakukan bila pack ada.
  if (!objek(st['gudang'])) st['gudang'] = { stok: {}, pesanan: [] }
  if (!objek(st['keuanganBulan'])) st['keuanganBulan'] = { belanjaObat: 0, belanjaPengadaan: 0 }

  // Sanitasi ISI gudang/keuanganBulan (CODEX audit 2026-07-04, temuan #1):
  // pengecekan di atas cuma memastikan levelnya berupa objek — `gudang = {}`
  // (objek valid, tanpa field `stok`) lolos lalu bikin `Object.keys(gudang.
  // stok)` di backfill bawah ini THROW; `gudang.stok[id]` bukan angka lolos
  // lalu meracuni Math.max/aritmetika jadi NaN saat obat diresepkan
  // (reducer.ts). Harus jalan SEBELUM backfill di bawah, bukan sesudah.
  const gudangSt = st['gudang'] as Record<string, unknown>
  if (!objek(gudangSt['stok'])) gudangSt['stok'] = {}
  const stokSt = gudangSt['stok'] as Record<string, unknown>
  for (const [id, nilai] of Object.entries(stokSt)) {
    if (typeof nilai !== 'number' || !Number.isFinite(nilai) || nilai < 0) delete stokSt[id]
  }
  if (!Array.isArray(gudangSt['pesanan'])) gudangSt['pesanan'] = []
  gudangSt['pesanan'] = (gudangSt['pesanan'] as unknown[]).filter(
    (p) =>
      objek(p) &&
      typeof p['obatId'] === 'string' &&
      typeof p['jumlah'] === 'number' &&
      Number.isFinite(p['jumlah']) &&
      typeof p['tibaHari'] === 'number' &&
      Number.isFinite(p['tibaHari']),
  )

  const keuanganSt = st['keuanganBulan'] as Record<string, unknown>
  for (const kunci of ['belanjaObat', 'belanjaPengadaan'] as const) {
    const nilai = keuanganSt[kunci]
    if (typeof nilai !== 'number' || !Number.isFinite(nilai) || nilai < 0) keuanganSt[kunci] = 0
  }
  // Migrasi-lite M4.5: save lama = mode Karier dgn seed kurikulum = seed flavor.
  if (st['mode'] !== 'karier' && st['mode'] !== 'ujian') st['mode'] = 'karier'
  if (typeof st['seedKurikulum'] !== 'number' || !Number.isFinite(st['seedKurikulum'])) {
    st['seedKurikulum'] = st['seed']
  }
  if (typeof st['igdHariIni'] !== 'boolean') st['igdHariIni'] = false
  // Migrasi-lite M6: save pra-jurnal-penuh → jejak kosong (dossier dari save
  // semacam ini berstatus "tidak dapat diverifikasi", bukan ditolak).
  if (!Array.isArray(st['jejak'])) st['jejak'] = []
  for (const nilai of Object.values(tally)) {
    if (typeof nilai !== 'number' || !Number.isFinite(nilai) || nilai < 0) return null
  }

  // Migrasi-lite M1: surveilans & drift untuk save pra-bridge.
  const desa = st['desa'] as Record<string, unknown>
  if (!Array.isArray(desa['surveilans'])) desa['surveilans'] = []
  if (typeof desa['drift'] !== 'object' || desa['drift'] === null) {
    desa['drift'] = { minggu: 1, jumlah: 0 }
  }
  // Migrasi-lite M2: bonusIks per RW + state program/prolanis/lapangan.
  if (Array.isArray(desa['rw'])) {
    for (const r of desa['rw'] as Record<string, unknown>[]) {
      if (typeof r['bonusIks'] !== 'number') r['bonusIks'] = 0
    }
  }
  // desa.rw korup/kosong (CODEX ronde-baru #3): objek check di atas cuma menjamin
  // `desa` itu objek — `desa.rw = {}` lolos lalu day-advance/scoring THROW saat
  // memetakan RW. rw tak pernah sah-kosong; jatuhkan ke "tak ada autosave" (null)
  // alih-alih membiarkan crash saat lanjut hari.
  if (!Array.isArray(desa['rw']) || (desa['rw'] as unknown[]).length === 0) return null

  if (typeof st['lapanganTerpakai'] !== 'boolean') st['lapanganTerpakai'] = false
  if (typeof st['prolanis'] !== 'object' || st['prolanis'] === null) st['prolanis'] = { roster: [] }
  // prolanis.roster (CODEX ronde-baru #3): `prolanis = {}` lolos check objek di
  // atas tapi tanpa roster → MULAI_PROLANIS THROW. Pastikan roster array.
  const prolanisSt = st['prolanis'] as Record<string, unknown>
  if (!Array.isArray(prolanisSt['roster'])) prolanisSt['roster'] = []
  if (typeof st['posyanduRwTerakhir'] !== 'object' || st['posyanduRwTerakhir'] === null) {
    st['posyanduRwTerakhir'] = {}
  }
  if (typeof st['program'] !== 'object' || st['program'] === null) st['program'] = {}
  // program.fokus (CODEX ronde-baru #3): fokus tak dikenal + surveilans aktif →
  // TARGET_KASUS_PROGRAM[fokus] undefined lalu `.includes` THROW di day-advance.
  // Buang fokus (+rwFokus) invalid → dianggap belum menetapkan program.
  const programSt = st['program'] as Record<string, unknown>
  if (programSt['fokus'] !== undefined && !['psn', 'phbs', 'skrining'].includes(programSt['fokus'] as string)) {
    delete programSt['fokus']
    delete programSt['rwFokus']
  }
  // klinik nested (CODEX ronde-baru #3): `klinik = {}` / `antrian = null` lolos
  // objek check di atas tapi LANJUTKAN & debrief THROW saat mengiterasi antrian/
  // selesaiHariIni. Backfill array/objek wajib ke default aman.
  const klinik = st['klinik'] as Record<string, unknown>
  if (!Array.isArray(klinik['antrian'])) klinik['antrian'] = []
  if (!Array.isArray(klinik['selesaiHariIni'])) klinik['selesaiHariIni'] = []
  if (!objek(klinik['autoHariIni'])) klinik['autoHariIni'] = { jumlah: 0, bermasalah: 0 }
  // Pasien lama tanpa RW mendapat RW 1 (cukup untuk melanjutkan save lama).
  for (const p of klinik['antrian'] as unknown[]) {
    if (objek(p) && typeof p['rw'] !== 'number') p['rw'] = 1
  }

  // Backfill gudang M4 utk save lama: stok kosong diisi baseline 12/obat agar
  // mekanik pengadaan hidup juga di save pra-M4 (butuh pack utk daftar obat).
  if (pack) {
    const gudang = st['gudang'] as { stok: Record<string, number> }
    if (Object.keys(gudang.stok).length === 0) {
      const stok: Record<string, number> = {}
      for (const id of Object.keys(pack.obat)) stok[id] = 12
      gudang.stok = stok
    }
  }

  // Pemulihan IGD tak dikenal (CODEX P2): bila kasus IGD yang aktif sudah tak
  // ada di pack (rename/hapus konten antar-versi), jangan biarkan save macet
  // permanen — hapus IGD aktif & beri surat kompensasi.
  if (pack && objek(st['igd'])) {
    const igd = st['igd'] as Record<string, unknown>
    const kasusId = igd['kasusId']
    if (typeof kasusId !== 'string' || !pack.kasusIgd[kasusId]) {
      st['igd'] = undefined
      const hari = st['hari'] as number
      const inbox = st['inbox'] as Record<string, unknown>[]
      inbox.push({
        id: `surat_pemulihan_igd_${hari}_${inbox.length}`,
        hari,
        jenis: 'sistem',
        dari: 'Sistem',
        judul: 'Pasien IGD dipulihkan otomatis',
        isi: 'Kasus gawat darurat yang sedang berjalan tidak lagi tersedia di versi konten ini. Pasien dianggap sudah ditangani tim jaga lain — kamu bisa melanjutkan hari seperti biasa.',
        dibaca: false,
      })
    }
  }

  // Pemulihan pasien klinik tak dikenal (CODEX audit 2026-07-04, temuan #2):
  // sama seperti IGD di atas — bila pasien aktif di ruang periksa memakai
  // kasusId yang sudah tak ada di pack, SETIAP aksi klinik (TANYA..DISPOSISI)
  // dan bahkan LANJUTKAN akan menolak selamanya ("kasus tidak ditemukan" /
  // "selesaikan pasien dulu") — soft-lock permanen tanpa jalan keluar. Buang
  // pasien aktif & beri surat kompensasi, persis pola IGD.
  if (pack && objek(st['klinik'])) {
    const klinikAktif = (st['klinik'] as Record<string, unknown>)['aktif']
    if (objek(klinikAktif)) {
      const pasien = klinikAktif['pasien']
      const kasusId = objek(pasien) ? pasien['kasusId'] : undefined
      if (typeof kasusId !== 'string' || !pack.kasus[kasusId]) {
        ;(st['klinik'] as Record<string, unknown>)['aktif'] = undefined
        const hari = st['hari'] as number
        const inbox = st['inbox'] as Record<string, unknown>[]
        inbox.push({
          id: `surat_pemulihan_klinik_${hari}_${inbox.length}`,
          hari,
          jenis: 'sistem',
          dari: 'Sistem',
          judul: 'Pasien di ruang periksa dipulihkan otomatis',
          isi: 'Kasus yang sedang kamu tangani tidak lagi tersedia di versi konten ini. Pasien dianggap sudah dialihkan ke rekan sejawat — kamu bisa memanggil pasien berikutnya seperti biasa.',
          dibaca: false,
        })
      }
    }
  }

  return st as unknown as GameState
}
