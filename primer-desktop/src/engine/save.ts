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
  // hari harus bilangan BULAT (CODEX ronde-13) — sebelumnya cuma dicek finite,
  // jadi `hari=1.5` lolos lalu unlock/event berbasis hari genap (mis. `hari %
  // 30`, `hari >= HARI_BUKA_POSYANDU`) berjalan di pecahan yang tak pernah
  // terjadi lewat gameplay normal.
  if (typeof st['hari'] !== 'number' || !Number.isInteger(st['hari'])) return null
  if (st['blok'] !== 'pagi' && st['blok'] !== 'siang' && st['blok'] !== 'sore') return null
  // seed non-finite (CODEX ronde-13): `seedKurikulum` di bawah sudah dicek
  // finite saat migrasi-lite — `seed` sendiri di sini terlewat, jadi
  // `1e999`→`Infinity` lolos lalu meracuni Rng (mulberry32) dgn seed tak
  // terhingga, dan JSON.stringify(Infinity) jadi `null` saat re-serialize.
  if (typeof st['seed'] !== 'number' || !Number.isFinite(st['seed'])) return null
  if (typeof st['namaDokter'] !== 'string') return null
  if (!objek(st['klinik'])) return null
  if (!objek(st['desa'])) return null
  if (!objek(st['tally'])) return null
  if (!objek(st['dex'])) return null
  // dex entri korup (CODEX ronde-13): container-check di atas cuma menjamin
  // `dex` sendiri objek — entri semacam `dex.x = null` lolos lalu pelunturan
  // bintang (reducer.ts, hari baru) THROW ("Cannot read properties of null,
  // reading 'bintang'") krn `Object.entries(dex)` mengiterasi nilai apa
  // adanya. Sama pola desa.rw di bawah — tolak seluruh save bila ada entri
  // korup, bukan backfill parsial.
  if (Object.values(st['dex'] as Record<string, unknown>).some((e) => !objek(e))) return null
  if (!Array.isArray(st['inbox'])) return null
  if (!Array.isArray(st['jadwal'])) return null
  if (!Array.isArray(st['log'])) return null
  // desa.keluarga (CODEX ronde-11 #3): objek-check di atas cuma menjamin `desa`
  // sendiri objek — `desa.keluarga = null` lolos lalu THROW ("Cannot convert
  // undefined or null to object") di reducer.ts saat `Object.entries(keluarga)`
  // pada day-advance. Bukan field yang aman di-backfill parsial (arc/indikator/
  // roster binaan saling terkait) — tolak seluruh save spt tally korup.
  if (!objek((st['desa'] as Record<string, unknown>)['keluarga'])) return null
  // desa.keluarga entri korup (CODEX ronde-13): sama pola dex di atas —
  // container-check barusan cuma menjamin `keluarga` sendiri objek, entri
  // semacam `keluarga.x = null` lolos lalu follow-up mangkir (reducer.ts,
  // hari baru) THROW saat baca `kel.followUpHari`. Tolak seluruh save,
  // konsisten dgn desa.rw/kader di bawah.
  if (
    Object.values((st['desa'] as Record<string, unknown>)['keluarga'] as Record<string, unknown>).some(
      (e) => !objek(e),
    )
  )
    return null
  // desa.kader (CODEX ronde-12): sama seperti desa.keluarga/rw — `kader='rusak'`
  // (string) lolos objek-check `desa`, lalu spread `{...kader}` memecah string
  // jadi objek ber-key-karakter; `Object.values(kader).sort((a,b)=>a.rw-b.rw||
  // a.id.localeCompare(...))` — komparator NaN jatuh ke fallback OR lalu THROW
  // ("Cannot read properties of undefined, reading 'localeCompare'") krn tiap
  // "entry" cuma sebuah karakter string. Struktur sama entangled dgn rw/keluarga
  // (feed skor PIS-PK/IKS) — tolak, bukan backfill parsial.
  if (!objek((st['desa'] as Record<string, unknown>)['kader'])) return null
  // layar (CODEX ronde-11 #3): tak pernah divalidasi — nilai asing lolos lalu
  // App.tsx (rangkaian `layar === X &&`, tanpa fallback) merender area utama
  // kosong TANPA throw (ErrorBoundary tak menangkap non-error). Bukan field
  // skor-kritis → recovery, bukan tolak seluruh save. PENTING: jangan asal
  // default ke 'meja' — bila sesi (igd/kunjungan/kegiatan/klinik.aktif) tetap
  // aktif, HUD menahan navigasi (CODEX ronde-11 #1/#2 fix) sehingga 'meja'
  // dgn sesi aktif TAK TERLIHAT jadi kunci permanen baru. Derive layar dari
  // sesi yang genuinely aktif dulu, 'meja' hanya bila tak ada sesi apa pun.
  const LAYAR_SAH = new Set(['meja', 'klinik', 'peta', 'kunjungan', 'kegiatan', 'igd', 'dex', 'rapor', 'laporan'])
  if (typeof st['layar'] !== 'string' || !LAYAR_SAH.has(st['layar'])) {
    const klinikSt = st['klinik'] as Record<string, unknown>
    st['layar'] = objek(st['igd'])
      ? 'igd'
      : objek(st['kunjungan'])
        ? 'kunjungan'
        : objek(st['kegiatan'])
          ? 'kegiatan'
          : objek(klinikSt['aktif'])
            ? 'klinik'
            : 'meja'
  }

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
  // Tutorial (DeepThink "onboarding railroaded", keputusan user): save LAMA
  // (field belum ada) TIDAK BOLEH retroaktif dapat tutorial — mahasiswa yang
  // sudah main duluan bukan pemain baru. Hanya stase yg genuinely baru
  // (init.ts) yang mengisi true.
  if (typeof st['tutorialAktif'] !== 'boolean') st['tutorialAktif'] = false
  // Migrasi-lite M4.5: save lama = mode Karier dgn seed kurikulum = seed flavor.
  if (st['mode'] !== 'karier' && st['mode'] !== 'ujian') st['mode'] = 'karier'
  if (typeof st['seedKurikulum'] !== 'number' || !Number.isFinite(st['seedKurikulum'])) {
    st['seedKurikulum'] = st['seed']
  }
  if (typeof st['igdHariIni'] !== 'boolean') st['igdHariIni'] = false
  // NIM opsional (ikatan identitas ujian): buang bila bukan string.
  if (st['nim'] !== undefined && typeof st['nim'] !== 'string') delete st['nim']
  // flags/refleksi (CODEX ronde-12): tak pernah divalidasi. `flags=null` → THROW
  // ("Cannot read properties of null, reading 'bonusStaminaBesok'") di hariBaru;
  // `refleksi=null` → crash render MejaKerja (`state.refleksi[hari]`). Keduanya
  // TIDAK entangled dgn field lain (flags = boolean lepas, refleksi = jurnal
  // teks bebas per-hari) — aman di-backfill ke kosong, bukan tolak seluruh save.
  if (!objek(st['flags'])) st['flags'] = {}
  if (!objek(st['refleksi'])) st['refleksi'] = {}
  // Migrasi-lite M6: save pra-jurnal-penuh → jejak kosong (dossier dari save
  // semacam ini berstatus "tidak dapat diverifikasi", bukan ditolak).
  if (!Array.isArray(st['jejak'])) st['jejak'] = []
  // Kunci tally HILANG SELURUHNYA (CODEX ronde-13): loop lama
  // `Object.values(tally)` cuma memvalidasi nilai kunci yang ADA — kunci
  // yang hilang total (mis. `tegakBenar` tak pernah di-set) lolos sbg
  // `undefined`, lalu reducer.ts (`t.tegakBenar += 1`) mengubahnya jadi NaN
  // permanen begitu disentuh, dan hitungSkor mewarisi NaN ke skor total.
  // Backfill migrasi-lite di atas sudah mengisi field BARU (autoBermasalah dkk)
  // — pengecekan di bawah ini menjamin SEMUA kunci SkorTally ada sbg angka
  // finite ≥0, bukan cuma yang kebetulan hadir di objek.
  const KUNCI_TALLY = [
    'totalPasien', 'diagnosisBenar', 'tegakBenar', 'tegakSalah', 'suspekBenar', 'suspekSalah',
    'rujukanTotal', 'rujukanNonSpesialistik', 'rujukanTepat', 'rujukanDitolak', 'cowboy',
    'antibiotikTanpaIndikasi', 'labTakRelevan', 'miTepat', 'miTotal', 'kunjunganBerhasil',
    'kunjunganTotal', 'kunjunganDiusir', 'apathy', 'autoBermasalah', 'posyanduSesi',
    'prolanisSesi', 'klbTuntas', 'igdStabil', 'igdSalahDisposisi', 'igdMeninggal', 'rmLengkap',
    'teguranDinkes', 'hariKelelahan', 'karmaTerjadi', 'karmaDicegah',
  ] as const
  for (const kunci of KUNCI_TALLY) {
    const nilai = tally[kunci]
    if (typeof nilai !== 'number' || !Number.isFinite(nilai) || nilai < 0) return null
  }

  // Migrasi-lite M1: surveilans & drift untuk save pra-bridge.
  const desa = st['desa'] as Record<string, unknown>
  if (!Array.isArray(desa['surveilans'])) desa['surveilans'] = []
  if (typeof desa['drift'] !== 'object' || desa['drift'] === null) {
    desa['drift'] = { minggu: 1, jumlah: 0 }
  }
  // desa.rw korup/kosong (CODEX ronde-baru #3): `desa.rw = {}` lolos objek-check
  // `desa` lalu day-advance/scoring THROW saat memetakan RW. rw tak pernah
  // sah-kosong; jatuhkan ke "tak ada autosave" (null). Dicek SEBELUM loop di
  // bawah — urutan penting (pola sama gudang/klinik ronde sebelumnya).
  if (!Array.isArray(desa['rw']) || (desa['rw'] as unknown[]).length === 0) return null
  // Entri desa.rw non-objek (CODEX ronde-11 #3): mis. string di antara entri sah
  // — `r['bonusIks'] = 0` di bawah men-THROW ("Cannot create property ... on
  // string") krn modul ESM berjalan strict-mode, assignment properti baru ke
  // primitif dilarang. rw array tak boleh sebagian valid (kode lain berasumsi
  // korespondensi RW 1..N lengkap) — entri korup apa pun = seluruh save ditolak.
  if ((desa['rw'] as unknown[]).some((r) => !objek(r))) return null
  // Migrasi-lite M2: bonusIks per RW + state program/prolanis/lapangan.
  for (const r of desa['rw'] as Record<string, unknown>[]) {
    if (typeof r['bonusIks'] !== 'number') r['bonusIks'] = 0
  }

  if (typeof st['lapanganTerpakai'] !== 'boolean') st['lapanganTerpakai'] = false
  if (typeof st['prolanis'] !== 'object' || st['prolanis'] === null) st['prolanis'] = { roster: [] }
  // prolanis.roster (CODEX ronde-baru #3): `prolanis = {}` lolos check objek di
  // atas tapi tanpa roster → MULAI_PROLANIS THROW. Pastikan roster array.
  const prolanisSt = st['prolanis'] as Record<string, unknown>
  if (!Array.isArray(prolanisSt['roster'])) prolanisSt['roster'] = []
  // Entri roster non-PesertaProlanis (CODEX ronde-12): array-check di atas cuma
  // menjamin WRAPPER-nya array — entri semacam string lolos lalu kartuProlanis()
  // (kegiatan.ts) merender narasi "undefined" ke pemain (p.param/p.jenis tak
  // ada di primitif). Saring entri yang bukan objek berbentuk lengkap.
  prolanisSt['roster'] = (prolanisSt['roster'] as unknown[]).filter(
    (p) =>
      objek(p) &&
      typeof p['id'] === 'string' &&
      typeof p['nama'] === 'string' &&
      typeof p['usia'] === 'number' &&
      Number.isFinite(p['usia']) &&
      (p['jenisKelamin'] === 'L' || p['jenisKelamin'] === 'P') &&
      typeof p['rw'] === 'number' &&
      Number.isFinite(p['rw']) &&
      (p['jenis'] === 'ht' || p['jenis'] === 'dm') &&
      typeof p['param'] === 'number' &&
      Number.isFinite(p['param']),
  )
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
  // Encounter aktif dari save pra-prosedur (#4) belum punya array tindakan →
  // skoring terapi meng-iterasinya. Backfill ke kosong.
  if (objek(klinik['aktif'])) {
    const aktif = klinik['aktif'] as Record<string, unknown>
    if (!Array.isArray(aktif['tindakan'])) aktif['tindakan'] = []
    // Encounter aktif dari save pra-ditanyaKetus (DeepThink #2) sama — nilaiEncounter
    // meng-iterasinya utk penalti distraktor pasca-ketus.
    if (!Array.isArray(aktif['ditanyaKetus'])) aktif['ditanyaKetus'] = []
  }
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
