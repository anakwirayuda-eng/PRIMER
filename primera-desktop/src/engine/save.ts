/**
 * SAVE — serialisasi GameState versi-berskema.
 * Amplop `{ v: 1, state }` agar migrasi skema di masa depan punya pintu masuk.
 * `deserialize` defensif: JSON rusak / versi asing / bentuk dasar cacat → null
 * (store lalu memperlakukannya sebagai "tidak ada autosave", bukan crash).
 */

import type { GameState } from './state'
import { LEGACY_CONTENT_RELEASE, type ContentPack } from '@content/pack'
import { SEMUA_INDIKATOR_PISPK } from './pispk'

const VERSI_SAVE = 1 as const

export function serialize(state: GameState): string {
  return JSON.stringify({ v: VERSI_SAVE, state })
}

function objek(nilai: unknown): nilai is Record<string, unknown> {
  return typeof nilai === 'object' && nilai !== null && !Array.isArray(nilai)
}

function daftarString(nilai: unknown): boolean {
  return Array.isArray(nilai) && nilai.every((entri) => typeof entri === 'string')
}

/**
 * `alergi` & `faktorRisiko` pasien tersimpan bersifat DETERMINISTIK dari
 * kasusnya (director.ts hanya pernah mengisinya dari `alergiTrap.kelas` /
 * `interaksiTrap.faktor`), jadi bentuk korup dipulihkan DARI PACK, bukan
 * dikosongkan: array kosong adalah bentuk yang sah-sah saja sehingga pasien
 * jebakan diam-diam berubah jadi pasien biasa — firewall alergi dan pergeseran
 * standar emas kasus jebakan (clinic.ts) lumpuh bersamaan. Tanpa pack (test
 * skema murni) jatuh ke array kosong; yang wajib dijamin adalah bentuknya,
 * sebab clinic.ts memanggil `.includes`/`.toLowerCase` atas kedua field ini
 * tanpa penjaga — field hilang = setiap TAMBAH_OBAT/DISPOSISI kasus jebakan
 * THROW selamanya (soft-lock tanpa jalan keluar in-game).
 */
function pulihkanRiwayatPasien(pasien: Record<string, unknown>, pack?: ContentPack): void {
  const kasusId = pasien['kasusId']
  const kasus = pack && typeof kasusId === 'string' ? pack.kasus[kasusId] : undefined
  if (!daftarString(pasien['alergi'])) {
    pasien['alergi'] = kasus?.alergiTrap ? [kasus.alergiTrap.kelas] : []
  }
  if (!daftarString(pasien['faktorRisiko'])) {
    pasien['faktorRisiko'] = kasus?.interaksiTrap ? [kasus.interaksiTrap.faktor] : []
  }
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
  // M13-0C: identitas rilis bukan tally dan tidak boleh memakai tandaiMigrasi.
  // Save pra-0C dipetakan eksplisit ke baseline legacy agar UI dapat
  // mengarsipkannya secara netral tanpa pernah melanjutkannya di build baru.
  if (st['contentRelease'] === undefined) st['contentRelease'] = LEGACY_CONTENT_RELEASE
  if (typeof st['contentRelease'] !== 'string' || st['contentRelease'].length === 0) return null

  // E-2: hasil kunjungan lama belum memiliki outcome enam-arah dan kualitas
  // komunikasi gabungan. Keduanya dapat diturunkan tanpa mengubah tally.
  if (objek(st['hasilKunjunganHariIni'])) {
    const hasil = st['hasilKunjunganHariIni'] as Record<string, unknown>
    if (hasil['hasilAkhir'] === undefined) {
      hasil['hasilAkhir'] = hasil['diusir'] === true
        ? 'diusir'
        : hasil['tingkat'] === 'berhasil' || hasil['tingkat'] === 'partial' || hasil['tingkat'] === 'gagal'
          ? hasil['tingkat']
          : hasil['berhasil'] === true
            ? 'berhasil'
            : 'gagal'
    }
    if (hasil['kualitasSaji'] === undefined) {
      hasil['kualitasSaji'] = typeof hasil['kualitasMi'] === 'number' && Number.isFinite(hasil['kualitasMi'])
        ? hasil['kualitasMi']
        : 0
    }
  }
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
  // Bug hunt 2026-08-01: objek-check barusan tak menjamin field NUMERIK di
  // dalamnya. `bintang: NaN` (mis. save diedit tangan) lolos, lalu
  // `Math.min(3, lama.bintang + 1)` (reducer.ts) meracuninya jadi NaN
  // PERMANEN — bintang penguasaan tak pernah bisa naik/luntur lagi (DexSkdi.tsx
  // `dex.bintang >= 3` tak pernah benar walau sudah dilatih berkali-kali).
  if (
    Object.values(st['dex'] as Record<string, unknown>).some((e) => {
      if (!objek(e)) return true
      for (const kunci of ['ditangani', 'benar', 'bintang', 'terakhirHari'] as const) {
        if (typeof e[kunci] !== 'number' || !Number.isFinite(e[kunci])) return true
      }
      return false
    })
  )
    return null
  if (!Array.isArray(st['inbox'])) return null
  // Entri inbox non-objek (CODEX M14 #7): `inbox:[null]` lolos array-check di atas
  // lalu Hud.tsx (`.filter(m => !m.dibaca)`) THROW — dan karena <Hud/> dirender
  // di LUAR ErrorBoundary per-layar, ini menjatuhkan SELURUH UI, bukan satu layar.
  // Surat = pesan (bukan skor-kritis) → saring entri korup, bukan tolak save.
  st['inbox'] = (st['inbox'] as unknown[]).filter(objek)
  if (!Array.isArray(st['jadwal'])) return null
  // M10 §49 (CODEX B.5): array-check di atas cuma menjamin WRAPPER-nya array —
  // entri `jadwal:[null]` (atau non-objek, atau `hari` non-numerik) lolos lalu
  // day-advance (`for (const j of s.jadwal)` → `j.hari > hari`) THROW keras.
  // Pola sama dex/keluarga korup: entri jadwal menyetir pasien-kembali/hasil-
  // lab/karma (scoring-adjacent) — tolak seluruh save bila ada entri cacat,
  // bukan backfill parsial (menyembunyikan tampering/korupsi).
  if (
    (st['jadwal'] as unknown[]).some(
      (j) => !objek(j) || typeof (j as Record<string, unknown>)['hari'] !== 'number' || !Number.isFinite((j as Record<string, unknown>)['hari']),
    )
  )
    return null
  // Bridge PHC Lite: ledger ini tidak ikut skor, sehingga save lama aman
  // dibackfill kosong. Entri korup dibuang agar panel continuity tidak dapat
  // menjatuhkan seluruh UI; action-log tetap menjadi sumber replay formal.
  if (!Array.isArray(st['careEpisodes'])) st['careEpisodes'] = []
  const STATUS_EPISODE = new Set([
    'terdeteksi',
    'dinilai',
    'ditindaklanjuti',
    'menunggu',
    'dirujuk',
    'kembali',
    'terverifikasi',
    'berakhir',
  ])
  const SUMBER_EPISODE = new Set(['keluarga', 'posyandu', 'prolanis', 'surveilans', 'klinik', 'igd', 'rs'])
  const PEMILIK_EPISODE = new Set(['dokter', 'perawat', 'bidan', 'kader', 'program', 'rs', 'keluarga'])
  const TAHAP_RUJUKAN = new Set(['sent', 'accepted', 'completed', 'feedback', 'acted'])
  st['careEpisodes'] = (st['careEpisodes'] as unknown[]).flatMap((episode) => {
    if (!objek(episode) || !objek(episode['receipt']) || !Array.isArray(episode['history'])) return []
    const receipt = episode['receipt']
    const valid =
      typeof episode['id'] === 'string' &&
      typeof episode['subjectId'] === 'string' &&
      typeof episode['subjectName'] === 'string' &&
      typeof episode['problemId'] === 'string' &&
      typeof episode['problemLabel'] === 'string' &&
      typeof episode['nextAction'] === 'string' &&
      Number.isInteger(episode['openedDay']) &&
      Number.isInteger(episode['updatedDay']) &&
      STATUS_EPISODE.has(String(episode['status'])) &&
      SUMBER_EPISODE.has(String(episode['source'])) &&
      PEMILIK_EPISODE.has(String(episode['owner'])) &&
      typeof receipt['signal'] === 'string' &&
      typeof receipt['next'] === 'string'
    if (!valid) return []

    const history = (episode['history'] as unknown[])
      .filter(
        (event) =>
          objek(event) &&
          Number.isInteger(event['hari']) &&
          STATUS_EPISODE.has(String(event['status'])) &&
          typeof event['label'] === 'string' &&
          typeof event['detail'] === 'string',
      )
      .slice(-12)
    const referral = objek(episode['referral']) && TAHAP_RUJUKAN.has(String(episode['referral']['stage']))
      ? {
          stage: episode['referral']['stage'],
          ...(typeof episode['referral']['hospitalName'] === 'string' ? { hospitalName: episode['referral']['hospitalName'] } : {}),
          ...(typeof episode['referral']['note'] === 'string' ? { note: episode['referral']['note'] } : {}),
        }
      : undefined
    return [{
      id: episode['id'],
      subjectId: episode['subjectId'],
      subjectName: episode['subjectName'],
      ...(typeof episode['familyId'] === 'string' ? { familyId: episode['familyId'] } : {}),
      ...(Number.isInteger(episode['rw']) ? { rw: episode['rw'] } : {}),
      source: episode['source'],
      problemId: episode['problemId'],
      problemLabel: episode['problemLabel'],
      owner: episode['owner'],
      status: episode['status'],
      openedDay: episode['openedDay'],
      updatedDay: episode['updatedDay'],
      ...(Number.isInteger(episode['dueDay']) ? { dueDay: episode['dueDay'] } : {}),
      nextAction: episode['nextAction'],
      ...(referral ? { referral } : {}),
      receipt: {
        signal: receipt['signal'],
        ...(typeof receipt['decision'] === 'string' ? { decision: receipt['decision'] } : {}),
        ...(typeof receipt['feedback'] === 'string' ? { feedback: receipt['feedback'] } : {}),
        next: receipt['next'],
      },
      history,
    }]
  }).slice(-120)
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
  // keluarga[id].indikator (audit CODEX 2026-07-11 #5): entri-is-objek di atas
  // cuma menjamin keluarga itu sendiri objek — `indikator` hilang/bukan objek,
  // atau salah satu dari 12 kunci PIS-PK kanonik hilang, lolos lalu
  // hitungIksKeluarga (pispk.ts, `kel.indikator[ind].sumber`) THROW ("Cannot
  // read properties of undefined, reading 'sumber'") tiap kali IKS dihitung —
  // dipanggil rutin (peta desa, rapor, day-advance). Sama pola entangled spt
  // tally/dex: tolak seluruh save, bukan backfill parsial (indikator saling
  // mengunci formula IKS).
  if (
    Object.values(
      (st['desa'] as Record<string, unknown>)['keluarga'] as Record<string, unknown>,
    ).some((e) => {
      const ind = (e as Record<string, unknown>)['indikator']
      if (!objek(ind)) return true
      return SEMUA_INDIKATOR_PISPK.some((kunci) => !objek(ind[kunci]))
    })
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
  // desa.kader entri korup (audit CODEX 2026-07-11 #5): container-check barusan
  // cuma menjamin `kader` sendiri objek — entri semacam `kader.x = null` (atau
  // `rw` non-numerik) lolos lalu kader.ts (`Object.values(kader).sort((a,b)=>
  // a.rw-b.rw||a.id.localeCompare(b.id))`) THROW pada entri korup itu sendiri
  // (bukan cuma saat container-nya string). Pola sama desa.keluarga di atas.
  if (
    Object.values((st['desa'] as Record<string, unknown>)['kader'] as Record<string, unknown>).some(
      (e) =>
        !objek(e) ||
        typeof (e as Record<string, unknown>)['id'] !== 'string' ||
        typeof (e as Record<string, unknown>)['rw'] !== 'number' ||
        !Number.isFinite((e as Record<string, unknown>)['rw']),
    )
  )
    return null
  // Sesi aktif berupa non-objek truthy (bug hunt 2026-08-21): setiap jalur
  // pemulihan sesi di bawah digerbang `objek()`, jadi `igd:"rusak"` (save
  // diedit tangan) lolos utuh — lalu reducer.ts memblokir LANJUTKAN/
  // PINDAH_LAYAR dgn truthy-check dan Hud mengunci semua tab, padahal tak ada
  // sesi yang bisa diselesaikan: kunci permanen yang bertahan lintas restart.
  // Nilai non-objek tak pernah membawa progres yang bisa dipulihkan (tak ada
  // kasusId/kartu/skenario di dalamnya) → kosongkan diam-diam, bukan tolak
  // seluruh save. Harus jalan SEBELUM derive layar di bawah supaya sesi hantu
  // ini tak terpilih jadi layar.
  const klinikSt = st['klinik'] as Record<string, unknown>
  for (const kunci of ['igd', 'kunjungan', 'kegiatan'] as const) {
    if (st[kunci] !== undefined && !objek(st[kunci])) {
      st[kunci] = undefined
      if (st['layar'] === kunci) st['layar'] = 'meja'
    }
  }
  if (klinikSt['aktif'] !== undefined && !objek(klinikSt['aktif'])) klinikSt['aktif'] = undefined

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
  // CODEX audit pasca-GM (2026-07-13, temuan #12): setiap backfill migrasi-lite
  // di bawah membuat `state.tally` (klaim live) menyimpang dari apa yang REPLAY
  // dari jejak lama akan hasilkan di bawah engine SAAT INI (mis. field yang
  // dulu 0 krn belum ada mekaniknya, replay skrg bisa hasilkan nonzero) — bila
  // dossier diekspor sesudahnya, verifier membandingkan klaim (0, dari sini)
  // vs hasil-replay (nonzero) lalu memvonis "tidak_sah" PALSU pada save jujur.
  // Daftar kunci yg dibackfill di sesi load INI dicatat & disertakan (HMAC-
  // covered) di dossier supaya verifier bisa jatuh ke "tidak dapat
  // diverifikasi" alih-alih menuduh curang — lihat verifikasi.ts.
  const tallyTermigrasi: string[] = Array.isArray(st['tallyTermigrasi'])
    ? (st['tallyTermigrasi'] as unknown[]).filter((k): k is string => typeof k === 'string')
    : []
  const tandaiMigrasi = (kunci: string): void => {
    if (!tallyTermigrasi.includes(kunci)) tallyTermigrasi.push(kunci)
  }
  // Migrasi-lite: field tally baru diisi 0 untuk save dari versi lebih lama.
  if (tally['autoBermasalah'] === undefined) {
    tally['autoBermasalah'] = 0
    tandaiMigrasi('autoBermasalah')
  }
  for (const kunci of ['posyanduSesi', 'prolanisSesi', 'klbTuntas', 'rujukanTepat', 'rujukanDitolak', 'igdStabil', 'igdSalahDisposisi', 'igdMeninggal', 'rmLengkap', 'teguranDinkes'] as const) {
    if (tally[kunci] === undefined) {
      tally[kunci] = 0
      tandaiMigrasi(kunci)
    }
  }
  // CODEX audit (2026-07-12, temuan #1/#13B): field tally baru — save dari
  // sebelum fix ini (SEMUA save yang ada) belum punya kedua kunci ini sama
  // sekali, jadi wajib backfill di sini persis pola migrasi-lite di atas,
  // SEBELUM pengecekan exhaustive KUNCI_TALLY di bawah (yang kalau tidak
  // akan menolak SELURUH save lama krn `undefined` bukan `number`).
  for (const kunci of ['obatBerbahaya', 'tindakanBerbahaya', 'firewallTerpicu'] as const) {
    if (tally[kunci] === undefined) {
      tally[kunci] = 0
      tandaiMigrasi(kunci)
    }
  }
  // CODEX audit pasca-GM (2026-07-13, temuan #9 Part A): field tally baru
  // (igdKodeBiruTerjadi) — sama persis pola migrasi-lite di atas.
  if (tally['igdKodeBiruTerjadi'] === undefined) {
    tally['igdKodeBiruTerjadi'] = 0
    tandaiMigrasi('igdKodeBiruTerjadi')
  }
  for (const kunci of ['sumSkorProses', 'stabilisasiTerlewat'] as const) {
    if (tally[kunci] === undefined) {
      tally[kunci] = 0
      tandaiMigrasi(kunci)
    }
  }
  if (tallyTermigrasi.length > 0) st['tallyTermigrasi'] = tallyTermigrasi
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
  // `tamat` (bug hunt 2026-08-21): satu-satunya penanda sesi besar yang tak
  // pernah divalidasi bentuknya. Nilai truthy korup (mis. `tamat:{}`) membuat
  // guard pasca-tamat reducer.ts menolak SEMUA aksi mutasi — stase hari ke-1
  // pun jadi read-only permanen — sementara pesan penutupnya menginterpolasi
  // grade yang tak ada ("skor terkunci (undefined)"). Stase yang genuinely
  // tamat SELALU ditulis lengkap dgn hari + grade, jadi bentuk lain = korup:
  // buang penandanya (stase dianggap masih berjalan; hari terakhir akan
  // menutupnya lagi secara normal), jangan bekukan save yang masih hidup.
  if (st['tamat'] !== undefined) {
    const tamat = st['tamat']
    if (
      !objek(tamat) ||
      !Number.isInteger(tamat['hari']) ||
      typeof tamat['grade'] !== 'string' ||
      tamat['grade'].length === 0
    ) {
      delete st['tamat']
    } else if (tamat['skor'] !== undefined && !objek(tamat['skor'])) {
      // Snapshot skor opsional (save pra-M10.5 tak punya): bentuk salah dibuang
      // agar Rapor/LaporanAkhir jatuh ke hitungSkor live spt save lama.
      delete tamat['skor']
    }
  }
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
    'totalPasien', 'diagnosisBenar', 'sumSkorProses', 'tegakBenar', 'tegakSalah', 'suspekBenar', 'suspekSalah',
    'rujukanTotal', 'rujukanNonSpesialistik', 'rujukanTepat', 'rujukanDitolak', 'cowboy',
    'antibiotikTanpaIndikasi', 'obatBerbahaya', 'tindakanBerbahaya', 'firewallTerpicu', 'stabilisasiTerlewat', 'labTakRelevan', 'miTepat', 'miTotal', 'kunjunganBerhasil',
    'kunjunganTotal', 'kunjunganDiusir', 'apathy', 'autoBermasalah', 'posyanduSesi',
    'prolanisSesi', 'klbTuntas', 'igdStabil', 'igdSalahDisposisi', 'igdMeninggal', 'igdKodeBiruTerjadi', 'rmLengkap',
    'teguranDinkes', 'hariKelelahan', 'karmaTerjadi', 'karmaDicegah',
  ] as const
  for (const kunci of KUNCI_TALLY) {
    const nilai = tally[kunci]
    if (typeof nilai !== 'number' || !Number.isFinite(nilai) || nilai < 0) return null
  }

  // Migrasi-lite M1: surveilans & drift untuk save pra-bridge.
  const desa = st['desa'] as Record<string, unknown>
  if (!Array.isArray(desa['surveilans'])) desa['surveilans'] = []
  // desa.surveilans entri korup (audit CODEX 2026-07-11 #5): array-check di atas
  // cuma menjamin wrapper-nya array — entri non-objek atau `hari` non-numerik
  // lolos lalu pangkasSurveilans (surveilans.ts, `hariIni - e.hari < JENDELA`)
  // THROW pada entri null/`e.hari` string. Dipanggil rutin (deteksi klaster
  // KLB tiap day-advance) — pola sama jadwal di atas: tolak seluruh save.
  if (
    (desa['surveilans'] as unknown[]).some(
      (e) => !objek(e) || typeof e['hari'] !== 'number' || !Number.isFinite(e['hari']),
    )
  )
    return null
  // desa.binaan (audit CODEX 2026-07-11 #5): TIDAK PERNAH divalidasi sebelum ini
  // — `desa.binaan = null` (atau objek non-array) lolos objek-check `desa` lalu
  // director.ts (`.filter`) / reducer.ts (`.includes`, `.length`, spread
  // `[...binaan]`) THROW. Roster binaan dipakai tiap day-advance & tiap
  // pembukaan peta desa — tolak seluruh save, konsisten dgn desa.rw/kader.
  if (!Array.isArray(desa['binaan']) || (desa['binaan'] as unknown[]).some((id) => typeof id !== 'string'))
    return null
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
  // Bug hunt 2026-08-01: `jarak` tak pernah divalidasi. kader.ts membaca
  // `PROPORSI_SEHAT_JARAK[wilayah.jarak]` ('dekat'/'sedang'/'terpencil' saja)
  // utk roll `proporsiBaselineRoll` SEKALI lalu MENYIMPANNYA PERMANEN di
  // RwState (CODEX audit 2026-07-12 #8A, anti-noise-harian) — `jarak` korup
  // lolos jadi lookup undefined, NaN meracuni proporsiBaselineRoll SELAMANYA
  // (tak pernah re-roll krn cache `=== undefined` sudah terisi), menjatuhkan
  // IKS RW itu permanen sepanjang playthrough. Tolak seluruh save, konsisten
  // dgn kebijakan rw di atas (entri korup = seluruh save ditolak).
  const JARAK_SAH = new Set(['dekat', 'sedang', 'terpencil'])
  if ((desa['rw'] as Record<string, unknown>[]).some((r) => !JARAK_SAH.has(r['jarak'] as string))) return null
  // Migrasi-lite M2: bonusIks per RW + state program/prolanis/lapangan.
  // Bug hunt 2026-08-01: `typeof NaN === 'number'` tetap true, jadi bonusIks
  // korup (mis. save diedit tangan) lolos check lama tanpa dibackfill lalu
  // meracuni aritmetika skor IKS. Tambahkan Number.isFinite, konsisten dgn
  // sanitasi numerik lain di file ini (stok/keuanganBulan/dsb).
  for (const r of desa['rw'] as Record<string, unknown>[]) {
    if (typeof r['bonusIks'] !== 'number' || !Number.isFinite(r['bonusIks'])) r['bonusIks'] = 0
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
  // takTerkontrolBerturut (bug hunt 2026-08-21): field WAJIB numerik yang luput
  // dari filter di atas. Hilang/korup → driftProlanis (kegiatan.ts,
  // `p.takTerkontrolBerturut + 1`) menghasilkan NaN, lalu gerbang jembatan
  // komplikasi UKP (`>= 2`, reducer.ts) tak pernah terpicu — konsekuensi
  // peserta tak terkendali senyap — dan narasi ke pemain berbunyi "NaN sesi
  // berturut-turut". Backfill 0 (nilai yang selalu ditulis saat enrolmen),
  // BUKAN buang pesertanya: peserta yang lenyap justru mematikan jembatan itu
  // selamanya. Pola sama `antrian[i].rw` di bawah.
  for (const p of prolanisSt['roster'] as Record<string, unknown>[]) {
    const berturut = p['takTerkontrolBerturut']
    if (typeof berturut !== 'number' || !Number.isFinite(berturut) || berturut < 0) {
      p['takTerkontrolBerturut'] = 0
    }
  }
  if (typeof st['posyanduRwTerakhir'] !== 'object' || st['posyanduRwTerakhir'] === null) {
    st['posyanduRwTerakhir'] = {}
  }
  // Bug hunt 2026-08-01: nilai korup (non-finite) lolos container-check di atas.
  // reducer.ts (MULAI_POSYANDU) membaca `s.hari - terakhir < COOLDOWN_POSYANDU` —
  // bila `terakhir` NaN, hasilnya NaN dan `NaN < COOLDOWN` SELALU false, jadi
  // gerbang cooldown bulanan gagal TERBUKA (Posyandu RW itu bisa digelar tiap
  // hari via save yang dimodifikasi). Buang entri korup — kosong berarti belum
  // pernah digelar, bukan penyimpangan berbahaya.
  const posyanduRwSt = st['posyanduRwTerakhir'] as Record<string, unknown>
  for (const [rw, nilai] of Object.entries(posyanduRwSt)) {
    if (typeof nilai !== 'number' || !Number.isFinite(nilai)) delete posyanduRwSt[rw]
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
  // Bug hunt 2026-08-01: rwFokus/periodeDitetapkan tak pernah divalidasi
  // tipenya di sini. Nilai korup (string/NaN) lolos, lalu perbandingan `===`
  // di reducer.ts (kunci program bulanan, kasus TETAPKAN_PROGRAM) SELALU tak
  // cocok — kunci gagal TERBUKA, pemain via save yang dimodifikasi bisa
  // mengganti fokus/RW program tiap hari, merusak esensi "kunci sebulan,
  // korbankan RW lain" (DeepThink ronde-2).
  if (
    programSt['rwFokus'] !== undefined &&
    (typeof programSt['rwFokus'] !== 'number' || !Number.isFinite(programSt['rwFokus']))
  ) {
    delete programSt['rwFokus']
  }
  if (
    programSt['periodeDitetapkan'] !== undefined &&
    (typeof programSt['periodeDitetapkan'] !== 'number' || !Number.isFinite(programSt['periodeDitetapkan']))
  ) {
    delete programSt['periodeDitetapkan']
  }
  // klinik nested (CODEX ronde-baru #3): `klinik = {}` / `antrian = null` lolos
  // objek check di atas tapi LANJUTKAN & debrief THROW saat mengiterasi antrian/
  // selesaiHariIni. Backfill array/objek wajib ke default aman.
  const klinik = st['klinik'] as Record<string, unknown>
  if (!Array.isArray(klinik['antrian'])) klinik['antrian'] = []
  // Entri antrian non-objek (CODEX M14 #7): `antrian:[null]` lolos array-check
  // lalu RuangTunggu.tsx (`antrian[0].nama`) THROW saat pagi & stamina cukup.
  // Saring entri korup (per-layar ErrorBoundary menangkap, tapi tetap tak boleh).
  klinik['antrian'] = (klinik['antrian'] as unknown[]).filter(objek)
  if (!Array.isArray(klinik['selesaiHariIni'])) klinik['selesaiHariIni'] = []
  // Entri selesaiHariIni korup (bug hunt 2026-08-21): pola sama antrian di atas,
  // yang selama ini luput. `selesaiHariIni:[null]` lolos array-check lalu
  // ringkasanHarian (scoring.ts) — dipanggil di badan render MejaKerja setiap
  // blok sore — THROW, dan blok sore adalah SATU-SATUNYA jalur menutup hari
  // (selesaiHariIni sendiri baru direset saat hari baru): kunci progres
  // permanen. Entri tanpa identitas/grade juga dibuang: rekap harian
  // menghitung rata-rata grade (NaN) dan catatannya menyebut nama pasien
  // "undefined" ke pemain — pola sama roster Prolanis di atas.
  klinik['selesaiHariIni'] = (klinik['selesaiHariIni'] as unknown[]).filter(
    (p) =>
      objek(p) &&
      typeof p['kasusId'] === 'string' &&
      typeof p['pasienNama'] === 'string' &&
      typeof p['grade'] === 'string',
  )
  if (!objek(klinik['autoHariIni'])) klinik['autoHariIni'] = { jumlah: 0, bermasalah: 0 }
  // Encounter aktif dari save pra-prosedur (#4) belum punya array tindakan →
  // skoring terapi meng-iterasinya. Backfill ke kosong.
  if (objek(klinik['aktif'])) {
    const aktif = klinik['aktif'] as Record<string, unknown>
    if (!Array.isArray(aktif['tindakan'])) aktif['tindakan'] = []
    // Encounter aktif dari save pra-ditanyaKetus (DeepThink #2) sama — nilaiEncounter
    // meng-iterasinya utk penalti distraktor pasca-ketus.
    if (!Array.isArray(aktif['ditanyaKetus'])) aktif['ditanyaKetus'] = []
    // firewallTerpicu (bug hunt 2026-08-21): hilang/korup → `enc.firewallTerpicu
    // + 1` (clinic.ts, percobaan resep yang diblokir) jadi NaN, lalu `> 0` selalu
    // false — cap keselamatan encounter DAN tally firewall lolos tanpa jejak,
    // padahal kelalaian cek alerginya benar-benar terjadi. Backfill 0 = "belum
    // pernah terpicu", pola sama tally di atas.
    const terpicu = aktif['firewallTerpicu']
    if (typeof terpicu !== 'number' || !Number.isFinite(terpicu) || terpicu < 0) {
      aktif['firewallTerpicu'] = 0
    }
    if (objek(aktif['pasien'])) pulihkanRiwayatPasien(aktif['pasien'] as Record<string, unknown>, pack)
  }
  // Pasien lama tanpa RW mendapat RW 1 (cukup untuk melanjutkan save lama).
  // Bug hunt 2026-08-01: `typeof NaN === 'number'` tetap true, jadi `rw` korup
  // lolos tanpa dibackfill lalu ikut terbawa ke event surveilans/KLB
  // (`cluster_${kasusId}_rwNaN`) — pasien dgn rw korup berbeda-beda malah
  // digabung jadi SATU kluster palsu krn kuncinya sama-sama "rwNaN".
  for (const p of klinik['antrian'] as unknown[]) {
    if (!objek(p)) continue
    if (typeof p['rw'] !== 'number' || !Number.isFinite(p['rw'])) p['rw'] = 1
    // Pasien antrian menjadi encounter apa adanya saat dipanggil (reducer.ts
    // PANGGIL_PASIEN → buatEncounter), jadi riwayat alergi/faktor risikonya
    // disanitasi di sini juga — bukan hanya milik pasien di ruang periksa.
    pulihkanRiwayatPasien(p, pack)
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
  // CODEX audit UI/UX 2026-07-10 (#1c): kasusId bisa MASIH valid tapi
  // langkahIndex sudah di luar batas kasus.langkah (mis. konten kasus
  // dipangkas antar-versi) — Igd.tsx hanya merender blok fase==='langkah'
  // bila langkah[langkahIndex] ada, jadi badan layar kosong (tanpa tombol)
  // sementara Hud.tsx mengunci semua tab HUD selama state.igd truthy. Cek
  // bounds-nya juga, bukan cuma keberadaan kasusId.
  if (pack && objek(st['igd'])) {
    const igd = st['igd'] as Record<string, unknown>
    const kasusId = igd['kasusId']
    const kasusIgd = typeof kasusId === 'string' ? pack.kasusIgd[kasusId] : undefined
    const langkahIndex = igd['langkahIndex']
    // CODEX M14 #7: fase IGD di luar enum (mis. 'asing') dulu LOLOS krn cek
    // bounds hanya berlaku saat fase==='langkah' — Igd.tsx tak merender blok
    // fase manapun → badan kosong + Hud mengunci semua tab (hard-lock). Validasi
    // fase sbg enum eksplisit dulu.
    // CODEX audit (2026-07-12, temuan #2): 'pasca_rosc' ditambahkan — save di
    // fase baru ini dulu akan dianggap KORUP (fase di luar enum) dan igd
    // dibuang paksa begitu game di-load ulang.
    const FASE_IGD_SAH = new Set(['langkah', 'kode_biru', 'pasca_rosc', 'disposisi'])
    const faseValid = typeof igd['fase'] === 'string' && FASE_IGD_SAH.has(igd['fase'])
    const langkahValid =
      igd['fase'] !== 'langkah' ||
      (kasusIgd && typeof langkahIndex === 'number' && Number.isInteger(langkahIndex) && langkahIndex >= 0 && langkahIndex < kasusIgd.langkah.length)
    if (!kasusIgd || !faseValid || !langkahValid) {
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

  // Pemulihan kegiatan lapangan korup (CODEX audit UI/UX 2026-07-10, #1a):
  // Kegiatan.tsx sudah punya guard defensif (kartu/pilihan bukan bentuk yang
  // diharapkan → layar "tak dikenal"), tapi tombol kembalinya dispatch
  // PINDAH_LAYAR yang DITOLAK reducer.ts selama `s.kegiatan` truthy — tak
  // peduli isinya valid atau korup. Tanpa pemulihan di sini, itu dead-end
  // permanen persis pola igd/kunjungan di atas. Bersihkan sebelum sempat
  // dipakai render, meniru pola yang sama.
  if (pack && objek(st['kegiatan'])) {
    const kg = st['kegiatan'] as Record<string, unknown>
    // CODEX M14 #7: `jawaban:null` tak pernah dicek → JAWAB_KEGIATAN THROW
    // (spread null). Backfill ke [] spt igd.jawaban/ditanyaKetus.
    if (!Array.isArray(kg['jawaban'])) kg['jawaban'] = []
    const kartu = kg['kartu']
    const index = kg['index']
    const kartuAktif = Array.isArray(kartu) && typeof index === 'number' ? (kartu[index] as unknown) : undefined
    // CODEX M14 #7: kartu dgn `pilihan:[]` (nol pilihan) = dead-end utk kegiatan
    // tanpa jalur delegasi (klb/prolanis) — perlakukan sbg korup & pulihkan.
    // Kartu sah selalu punya ≥1 pilihan (tombol delegasi = tambahan, bukan pengganti).
    const kartuValid = objek(kartuAktif) && Array.isArray(kartuAktif['pilihan']) && kartuAktif['pilihan'].length > 0
    if (!kartuValid) {
      st['kegiatan'] = undefined
      if (st['layar'] === 'kegiatan') st['layar'] = 'peta'
      const hari = st['hari'] as number
      const inbox = st['inbox'] as Record<string, unknown>[]
      inbox.push({
        id: `surat_pemulihan_kegiatan_${hari}_${inbox.length}`,
        hari,
        jenis: 'sistem',
        dari: 'Sistem',
        judul: 'Kegiatan lapangan dipulihkan otomatis',
        isi: 'Sesi kegiatan lapangan yang sedang berjalan tidak lagi tersedia di versi konten ini. Sesi dianggap sudah dituntaskan kader — kamu bisa melanjutkan hari seperti biasa.',
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

  // Fix #22 (audit CODEX 2026-07-11): pemulihan kasusId-asing di atas TAK
  // memvalidasi invariant fase↔diagnosis — save yang di-tamper/korup bisa
  // mendarat di fase 'terapi'/'disposisi' TANPA `diagnosis` tercatat. Tak ada
  // aksi utk mundur fase (LANJUT_FASE hanya maju), jadi ini hard-lock permanen.
  // Pola sama persis dgn pemulihan igd/kunjungan/kegiatan di atas.
  if (objek(st['klinik'])) {
    const klinikAktif2 = (st['klinik'] as Record<string, unknown>)['aktif']
    if (objek(klinikAktif2)) {
      const FASE_KLINIK_SAH = new Set(['anamnesis', 'pemeriksaan', 'diagnosis', 'terapi', 'disposisi', 'selesai'])
      const fase = klinikAktif2['fase']
      const faseValid = typeof fase === 'string' && FASE_KLINIK_SAH.has(fase)
      const faseButuhDiagnosis = fase === 'terapi' || fase === 'disposisi' || fase === 'selesai'
      const diagnosisAda = objek(klinikAktif2['diagnosis'])
      if (!faseValid || (faseButuhDiagnosis && !diagnosisAda)) {
        ;(st['klinik'] as Record<string, unknown>)['aktif'] = undefined
        const hari = st['hari'] as number
        const inbox = st['inbox'] as Record<string, unknown>[]
        inbox.push({
          id: `surat_pemulihan_klinik_fase_${hari}_${inbox.length}`,
          hari,
          jenis: 'sistem',
          dari: 'Sistem',
          judul: 'Pasien di ruang periksa dipulihkan otomatis',
          isi: 'Data tahap pemeriksaan pasien yang sedang kamu tangani tidak konsisten. Pasien dianggap sudah dialihkan ke rekan sejawat — kamu bisa memanggil pasien berikutnya seperti biasa.',
          dibaca: false,
        })
      }
    }
  }

  // Pemulihan kunjungan tak dikenal (M10 §49, CODEX B.6): pola SAMA igd/klinik
  // di atas — bila keluarga ATAU skenario kunjungan aktif sudah tak ada di pack
  // (rename/hapus konten antar-versi), LANJUTKAN menolak selamanya ("Selesaikan
  // kunjungan dulu", reducer.ts) sementara layar Kunjungan hanya bisa PINDAH_LAYAR
  // (tak mengosongkan st.kunjungan) → soft-lock hari tak bisa maju. Buang
  // kunjungan aktif + betulkan layar bila masih 'kunjungan' + surat kompensasi.
  if (pack && objek(st['kunjungan'])) {
    const kj = st['kunjungan'] as Record<string, unknown>
    const keluargaId = kj['keluargaId']
    const skenarioId = kj['skenarioId']
    const kel = typeof keluargaId === 'string' ? pack.keluarga[keluargaId] : undefined
    const skenarioAda = kel && typeof skenarioId === 'string' && kel.arc.kunjungan.some((s) => s.id === skenarioId)
    // Bug hunt 2026-08-21: keluarga+skenario sah TIDAK menjamin babaknya sah.
    // Fase di luar enum → Kunjungan.tsx merender badan tanpa satu pun panel
    // aksi (semua bersyarat `kj.fase === ...`), LANJUT_BABAK jatuh ke fallback
    // "Babak tidak dikenal" (kunjungan.ts) sehingga `selesai` tak pernah true,
    // dan LANJUTKAN ditolak selamanya — dead-end permanen, kelas persis sama
    // dgn FASE_IGD_SAH & FASE_KLINIK_SAH di atas. 'selesai' SENGAJA tak
    // termasuk sah: reducer.ts selalu mengosongkan `s.kunjungan` begitu babak
    // tuntas, jadi fase itu hanya bisa tersisa di save korup dan sama buntunya.
    const FASE_KUNJUNGAN_SAH = new Set([
      'penerimaan',
      'observasi',
      'wawancara',
      'diagnosis_perilaku',
      'resep_sosial',
      'ingatkan',
    ])
    const faseValid = typeof kj['fase'] === 'string' && FASE_KUNJUNGAN_SAH.has(kj['fase'])
    if (!skenarioAda || !faseValid) {
      st['kunjungan'] = undefined
      if (st['layar'] === 'kunjungan') st['layar'] = 'peta'
      const hari = st['hari'] as number
      const inbox = st['inbox'] as Record<string, unknown>[]
      inbox.push({
        id: `surat_pemulihan_kunjungan_${hari}_${inbox.length}`,
        hari,
        jenis: 'sistem',
        dari: 'Sistem',
        judul: 'Kunjungan rumah dipulihkan otomatis',
        isi: 'Keluarga atau skenario kunjungan yang sedang berjalan tidak lagi tersedia di versi konten ini. Kunjungan dianggap selesai — kamu bisa melanjutkan hari seperti biasa.',
        dibaca: false,
      })
    } else {
      // Isi kunjungan yang masih dilanjutkan disanitasi seperti klinik.aktif di
      // atas: array hilang → aksi dialog THROW (spread/`.includes`), dan
      // `dialogIndex` non-bulat/negatif membuat wawancara buntu (node dialognya
      // undefined sehingga PILIH_DIALOG menolak, tapi `dialogIndex <
      // dialog.length` masih menahan LANJUT_BABAK).
      if (!Array.isArray(kj['hotspotDitemukan'])) kj['hotspotDitemukan'] = []
      if (!Array.isArray(kj['pilihanDiambil'])) kj['pilihanDiambil'] = []
      const dialogIndex = kj['dialogIndex']
      if (typeof dialogIndex !== 'number' || !Number.isInteger(dialogIndex) || dialogIndex < 0) {
        kj['dialogIndex'] = 0
      }
      for (const kunci of ['trustDelta', 'konfrontasiBeruntun'] as const) {
        const nilai = kj[kunci]
        if (typeof nilai !== 'number' || !Number.isFinite(nilai)) kj[kunci] = 0
      }
      if (typeof kj['diusir'] !== 'boolean') kj['diusir'] = false
    }
  }

  // CODEX M14 #7: kontradiksi layar-vs-sesi. `layar:'dex'` (sah sendiri, jadi
  // lolos derive di atas) SEMENTARA igd/kunjungan/kegiatan masih aktif → Hud
  // mengunci navigasi tapi layar bukan layar sesi tsb → pemain terjebak. Setelah
  // SEMUA pemulihan di atas (yang mungkin sudah membuang sesi korup), paksa layar
  // mengikuti sesi pemblokir yang genuinely masih aktif.
  if (objek(st['igd'])) st['layar'] = 'igd'
  else if (objek(st['kunjungan'])) st['layar'] = 'kunjungan'
  else if (objek(st['kegiatan'])) st['layar'] = 'kegiatan'

  // CODEX M14 #24: buang properti top-level ASING sebelum dikembalikan. Dulu
  // `st as GameState` mempertahankan field tak dikenal (save diedit tangan / dari
  // versi lain) yang lalu ikut ter-round-trip ke autosave. Whitelist = kunci
  // GameState (state.ts) — WAJIB disinkron bila interface bertambah field.
  const KUNCI_STATE_SAH = new Set([
    'versi', 'contentRelease', 'seed', 'namaDokter', 'nim', 'hari', 'blok', 'stamina', 'burnout',
    'mode', 'seedKurikulum', 'paketUjian', 'klinik', 'desa', 'kunjungan',
    'hasilKunjunganHariIni', 'kegiatan', 'hasilKegiatanTerakhir', 'igd', 'igdHariIni', 'lapanganTerpakai',
    'prolanis', 'posyanduRwTerakhir', 'program', 'tutorialAktif', 'inbox', 'jadwal', 'careEpisodes',
    'tally', 'tallyTermigrasi', 'dex', 'log', 'jejak', 'kapitasi', 'gudang', 'keuanganBulan',
    'akreditasi', 'pemulihanTerakhirHari', 'refleksi', 'flags', 'layar', 'tamat',
  ])
  for (const kunci of Object.keys(st)) {
    if (!KUNCI_STATE_SAH.has(kunci)) delete st[kunci]
  }

  return st as unknown as GameState
}
