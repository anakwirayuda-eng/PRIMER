/**
 * CLINIC — mesin encounter poli "Lembar Periksa".
 *
 * Modul murni: menerima EncounterState + Action + KasusKlinis + ContentPack,
 * mengembalikan state baru + event. Tidak ada Math.random (keacakan via Rng),
 * tidak ada import React/DOM. Reducer (reducer.ts) yang memanggil ketiga
 * fungsi ini — PANGGIL_PASIEN & DISPOSISI ditangani reducer sendiri.
 */

import type { Action } from './actions'
import type { GameEvent } from './events'
import type {
  EncounterState,
  FaseEncounter,
  JenisDiagnosis,
  PasienAktif,
  PenilaianEncounter,
} from './state'
import type { ContentPack } from '@content/pack'
import type { KasusKlinis, PertanyaanAnamnesis, Persona, RegionFisik } from '@content/types'
import type { Rng } from './core/rng'

/* ---------------------------------------------------------------------------
 * Konstanta perilaku klinik
 * ------------------------------------------------------------------------- */

const SABAR_AWAL = 100
/** Pertanyaan distraktor menggerus sabar pasien (proxy anamnesis shotgun OSCE). */
const PENALTI_DISTRAKTOR = 10
/** Mulai pertanyaan ke-9, tiap pertanyaan tambahan tetap melelahkan pasien. */
const AMBANG_PERTANYAAN_PANJANG = 9
const PENALTI_PERTANYAAN_PANJANG = 4
/** Di bawah ambang ini UI diberi tahu bahwa pasien mulai gelisah. */
const AMBANG_SABAR_MENIPIS = 30

const URUTAN_FASE: readonly FaseEncounter[] = [
  'anamnesis',
  'pemeriksaan',
  'diagnosis',
  'terapi',
  'disposisi',
]

/** Jawaban ketus saat sabar pasien habis — tidak ada informasi klinis baru. */
const JAWABAN_KETUS: readonly string[] = [
  'Sudah saya bilang tadi, Dok...',
  'Aduh, Dok, ditanya itu terus. Saya sudah capek menjawab.',
  'Hmm... tidak tahu, Dok. Sudah, periksa saja langsung.',
]

/** Bobot grade encounter (SATU formula — lihat BUILD_SPECS). */
const BOBOT_DIAGNOSIS = 0.4
const BOBOT_ANAMNESIS = 0.2
const BOBOT_TERAPI = 0.2
const BOBOT_PEMERIKSAAN = 0.1
const BOBOT_EDUKASI = 0.1

/**
 * M7 (34b/O4, verdikt DeepThink): kapasitas baki edukasi per pasien.
 * Konstruk berubah dari cakupan-set → prioritisasi: kasus dgn topik wajib > 3
 * tetap bisa skor 100 (target = min(kapasitas, |wajib|)) — meredam protes
 * "malpraktik by design" pada kasus komorbid.
 */
export const KAPASITAS_EDUKASI = 3

/** Jumlah dimensi OLDCARTS yang mungkin dicakup anamnesis. */
const TOTAL_DIMENSI_OLDCARTS = 9

/* ---------------------------------------------------------------------------
 * Util kecil
 * ------------------------------------------------------------------------- */

function clamp(nilai: number, min: number, maks: number): number {
  return Math.max(min, Math.min(maks, nilai))
}

/**
 * Konten menandai pertanyaan tidak relevan dengan `distraktor: true`.
 * Field ini opsional pada skema konten — dibaca secara struktural agar
 * kasus tanpa flag tetap aman (dianggap relevan).
 */
function adalahDistraktor(q: PertanyaanAnamnesis): boolean {
  return (q as PertanyaanAnamnesis & { distraktor?: boolean }).distraktor === true
}

/** Jawaban pasien: variasi persona bila ada, fallback ke jawaban baku. */
function jawabanUntuk(q: PertanyaanAnamnesis, persona: Persona): string {
  return q.variasi?.[persona] ?? q.jawab
}

function tanpaPerubahan(enc: EncounterState): { enc: EncounterState; events: GameEvent[] } {
  return { enc, events: [] }
}

function gagal(enc: EncounterState, pesan: string): { enc: EncounterState; events: GameEvent[] } {
  return { enc, events: [{ type: 'ERROR_AKSI', pesan }] }
}

/**
 * Phase-guard (CODEX audit 2026-07-04, temuan #2 §9): dulu SEMUA aksi diterima
 * di fase manapun — UI-lah yang membatasi lewat rendering per-fase (DeckAksi),
 * tapi engine sendiri tak menegakkannya. Dispatch manual (headless/DevTools)
 * bisa mem-fase-lompat, mis. KOMIT_DIAGNOSIS langsung di fase anamnesis tanpa
 * pernah lewat LANJUT_FASE. Skor tetap merefleksikan kerja yang dilewati
 * (bukan exploit skor), tapi state jadi tak konsisten dgn invarian UI. Kini
 * ditegakkan di engine: tiap aksi kategori hanya sah pada fase kanoniknya.
 */
function bukanFase(
  enc: EncounterState,
  diharapkan: FaseEncounter,
): { enc: EncounterState; events: GameEvent[] } | null {
  if (enc.fase === diharapkan) return null
  return gagal(enc, `Belum waktunya — pasien ini sedang di tahap ${enc.fase}, bukan ${diharapkan}.`)
}

/**
 * Gabungkan SEMUA temuan pemeriksaan fisik pada satu region (CODEX ronde-12):
 * beberapa kasus (mis. BPPV, Bell's palsy, glaukoma akut, hordeolum, serumen)
 * sengaja punya ≥2 entri `pemeriksaanFisik` dengan `region` yang SAMA (temuan
 * berlapis di organ yang sama — mis. mata: TIO tinggi + visus turun). `.find()`
 * lama cuma mengambil entri PERTAMA; karena UI cuma satu tombol/chip per
 * region (tak ada cara memicu region yang sama dua kali dgn hasil berbeda),
 * entri kedua PERMANEN tak terlihat pemain. Skoring tak terdampak (regionRelevan
 * sudah dihitung sbg Set per-region, bukan per-entri) — ini murni soal konten
 * klinis yang hilang. Gabung semua temuan region itu jadi satu narasi.
 */
export function temuanUntukRegion(kasus: KasusKlinis, region: string): string {
  const entri = kasus.pemeriksaanFisik.filter((t) => t.region === region)
  if (entri.length === 0) return 'dalam batas normal'
  return entri.map((t) => t.temuan).join(' ')
}

/* ---------------------------------------------------------------------------
 * kasusEfektif — terapkan varian presentasi Tingkat-A (M11 #4, 2026-07-16)
 * ------------------------------------------------------------------------- */

/**
 * Satu-satunya titik yang boleh menerapkan `varianPresentasi` — SETIAP tempat
 * yang membaca konten klinis (vital/keluhanUtama/anamnesis/pemeriksaanFisik)
 * dari kasus pasien AKTIF wajib memanggil ini alih-alih membaca
 * `pack.kasus[id]` mentah, supaya ruang tunggu, ruang periksa, dan debrief
 * selalu menunjukkan presentasi yang SAMA untuk satu pasien.
 *
 * Aman dipanggil tanpa `varianId` (undefined/'_dasar') — mengembalikan
 * `kasus` apa adanya, referensi identik (tak ada alokasi baru), sehingga
 * kasus tanpa `varianPresentasi` sama sekali nol overhead.
 */
export function kasusEfektif(kasus: KasusKlinis, varianId: string | undefined): KasusKlinis {
  if (!varianId || varianId === '_dasar') return kasus
  const v = kasus.varianPresentasi?.find((item) => item.id === varianId)
  if (!v) return kasus
  return {
    ...kasus,
    ...(v.vital ? { vital: { ...kasus.vital, ...v.vital } } : {}),
    ...(v.keluhanUtama ? { keluhanUtama: v.keluhanUtama } : {}),
    ...(v.jawabanBerubah
      ? {
          anamnesis: kasus.anamnesis.map((q) =>
            v.jawabanBerubah![q.id] !== undefined ? { ...q, jawab: v.jawabanBerubah![q.id]! } : q,
          ),
        }
      : {}),
    ...(v.temuanBerubah
      ? {
          pemeriksaanFisik: kasus.pemeriksaanFisik.map((f) =>
            v.temuanBerubah![f.region] !== undefined ? { ...f, temuan: v.temuanBerubah![f.region]! } : f,
          ),
        }
      : {}),
  }
}

/* ---------------------------------------------------------------------------
 * buatEncounter — pasien baru duduk di ruang periksa
 * ------------------------------------------------------------------------- */

export function buatEncounter(pasien: PasienAktif): EncounterState {
  // Fix #14 (audit CODEX 2026-07-11, adjudikasi 2026-07-12): pasien kembali
  // dari observasi-menunggu-lab membawa hasil yg SUDAH tersedia — pra-isi
  // labDipesan+labTersedia agar LembarPeriksa.tsx (yg SUDAH bisa merender
  // labTersedia dari kasus.lab) langsung menampilkannya, dokter tak perlu
  // memesan ulang. Reuse penuh UI/skema yg ada, bukan mekanisme baru.
  const labAwal = pasien.labSudahTersedia ? [pasien.labSudahTersedia] : []
  return {
    pasien,
    fase: 'anamnesis',
    ditanya: [],
    sabar: SABAR_AWAL,
    vitalDiukur: false,
    diperiksa: [],
    labDipesan: labAwal,
    labTersedia: labAwal,
    resep: [],
    edukasi: [],
    tindakan: [],
    ditanyaKetus: [],
    firewallTerpicu: 0,
  }
}

/* ---------------------------------------------------------------------------
 * aksiKlinik — satu langkah encounter
 * ------------------------------------------------------------------------- */

export function aksiKlinik(
  enc: EncounterState,
  action: Action,
  kasus: KasusKlinis,
  pack: ContentPack,
  rng: Rng,
): { enc: EncounterState; events: GameEvent[] } {
  switch (action.type) {
    /* -- Anamnesis ----------------------------------------------------------- */

    case 'TANYA': {
      const salahFase = bukanFase(enc, 'anamnesis')
      if (salahFase) return salahFase
      const tanya = kasus.anamnesis.find((q) => q.id === action.pertanyaanId)
      if (!tanya) {
        return gagal(enc, `Pertanyaan '${action.pertanyaanId}' tidak ada pada kasus ini.`)
      }

      // Pertanyaan berulang (baik yg sudah dijawab sungguhan MAUPUN yg sudah
      // pernah diklik saat ketus): pasien mengulang, tanpa menggeser state.
      if (enc.ditanya.includes(tanya.id) || enc.ditanyaKetus.includes(tanya.id)) {
        const teks =
          enc.sabar <= 0 ? rng.pick(JAWABAN_KETUS) : jawabanUntuk(tanya, enc.pasien.persona)
        return { enc, events: [{ type: 'PASIEN_MENJAWAB', teks }] }
      }

      let turun = 0
      if (adalahDistraktor(tanya)) turun += PENALTI_DISTRAKTOR
      // Ambang "pertanyaan panjang" pakai TOTAL klik (ketus atau tidak) — pasien
      // sama lelahnya diinterogasi terlepas jawabannya informatif atau ketus.
      if (enc.ditanya.length + enc.ditanyaKetus.length + 1 >= AMBANG_PERTANYAAN_PANJANG) {
        turun += PENALTI_PERTANYAAN_PANJANG
      }
      const sabar = clamp(enc.sabar - turun, 0, SABAR_AWAL)

      // Sabar habis → jawaban ketus = TIDAK ada informasi klinis yang keluar.
      // Pertanyaan itu TAK memberi kredit esensial/OLDCARTS (temuan audit CODEX
      // — kredit hanya untuk jawaban sungguhan) — dicatat ke `ditanyaKetus`,
      // BUKAN `ditanya`. TAPI klik distraktor tetaplah instingsi klinis buruk:
      // `ditanyaKetus` tetap dihitung utk penalti distraktor di nilaiEncounter
      // (DeepThink #2 — dulu klik distraktor pasca-ketus lolos tanpa penalti
      // krn tak pernah tercatat di mana pun).
      const jawabKetus = sabar <= 0
      const teks = jawabKetus ? rng.pick(JAWABAN_KETUS) : jawabanUntuk(tanya, enc.pasien.persona)
      const events: GameEvent[] = [{ type: 'PASIEN_MENJAWAB', teks }]
      if (turun > 0 && sabar < AMBANG_SABAR_MENIPIS) events.push({ type: 'SABAR_MENIPIS' })

      return {
        enc: {
          ...enc,
          ditanya: jawabKetus ? enc.ditanya : [...enc.ditanya, tanya.id],
          ditanyaKetus: jawabKetus ? [...enc.ditanyaKetus, tanya.id] : enc.ditanyaKetus,
          sabar,
        },
        events,
      }
    }

    /* -- Pemeriksaan ---------------------------------------------------------- */

    case 'UKUR_VITAL': {
      const salahFase = bukanFase(enc, 'pemeriksaan')
      if (salahFase) return salahFase
      if (enc.vitalDiukur) return tanpaPerubahan(enc)
      return { enc: { ...enc, vitalDiukur: true }, events: [{ type: 'VITAL_TERUKUR' }] }
    }

    case 'PERIKSA': {
      const salahFase = bukanFase(enc, 'pemeriksaan')
      if (salahFase) return salahFase
      const temuan = temuanUntukRegion(kasus, action.region)
      const diperiksa = enc.diperiksa.includes(action.region)
        ? enc.diperiksa
        : [...enc.diperiksa, action.region]
      return {
        enc: { ...enc, diperiksa },
        events: [{ type: 'TEMUAN_FISIK', region: action.region, temuan }],
      }
    }

    case 'PESAN_LAB': {
      const salahFase = bukanFase(enc, 'pemeriksaan')
      if (salahFase) return salahFase
      // Duplikat → tolak diam-diam (tanpa biaya ganda, tanpa event).
      if (enc.labDipesan.includes(action.labId)) return tanpaPerubahan(enc)
      const item = pack.lab[action.labId]
      if (!item) return gagal(enc, `Pemeriksaan lab '${action.labId}' tidak ada di katalog.`)

      const besok = item.hasilBesok === true
      return {
        enc: {
          ...enc,
          labDipesan: [...enc.labDipesan, action.labId],
          // Hasil "besok" TIDAK langsung tersedia — reducer yang menjadwalkan suratnya.
          labTersedia: besok ? enc.labTersedia : [...enc.labTersedia, action.labId],
        },
        events: [{ type: 'LAB_DIPESAN', labId: action.labId, besok }],
      }
    }

    /* -- Alur fase ------------------------------------------------------------ */

    case 'LANJUT_FASE': {
      const i = URUTAN_FASE.indexOf(enc.fase)
      const berikut = i >= 0 ? URUTAN_FASE[i + 1] : undefined
      if (!berikut) return tanpaPerubahan(enc)
      return { enc: { ...enc, fase: berikut }, events: [] }
    }

    /* -- Diagnosis ------------------------------------------------------------ */

    case 'KOMIT_DIAGNOSIS': {
      const salahFase = bukanFase(enc, 'diagnosis')
      if (salahFase) return salahFase
      return {
        enc: {
          ...enc,
          diagnosis: { icd10: action.icd10, jenis: action.jenis },
          fase: 'terapi',
        },
        events: [{ type: 'STEMPEL', jenis: action.jenis }],
      }
    }

    /* -- Terapi ----------------------------------------------------------------- */

    case 'TAMBAH_OBAT': {
      const salahFase = bukanFase(enc, 'terapi')
      if (salahFase) return salahFase
      const obat = pack.obat[action.obatId]
      if (!obat) return gagal(enc, `Obat '${action.obatId}' tidak ada di formularium.`)

      // FIREWALL ALERGI class-based (poka-yoke): resep TIDAK ditambahkan.
      if (obat.golonganAlergi && enc.pasien.alergi.includes(obat.golonganAlergi)) {
        return {
          enc: { ...enc, firewallTerpicu: enc.firewallTerpicu + 1 },
          events: [
            { type: 'FIREWALL_ALERGI', obatId: obat.id, golongan: obat.golonganAlergi },
            { type: 'STEMPEL', jenis: 'kontraindikasi' },
          ],
        }
      }

      if (enc.resep.includes(obat.id)) return tanpaPerubahan(enc)
      return { enc: { ...enc, resep: [...enc.resep, obat.id] }, events: [] }
    }

    case 'HAPUS_OBAT': {
      const salahFase = bukanFase(enc, 'terapi')
      if (salahFase) return salahFase
      if (!enc.resep.includes(action.obatId)) return tanpaPerubahan(enc)
      return {
        enc: { ...enc, resep: enc.resep.filter((id) => id !== action.obatId) },
        events: [],
      }
    }

    case 'TAMBAH_EDUKASI': {
      const salahFase = bukanFase(enc, 'terapi')
      if (salahFase) return salahFase
      if (!pack.edukasi[action.edukasiId]) {
        return gagal(enc, `Topik edukasi '${action.edukasiId}' tidak ada di katalog.`)
      }
      if (enc.edukasi.includes(action.edukasiId)) return tanpaPerubahan(enc)
      // M7 (34b/O4): kuota konseling — DITEGAKKAN DI ENGINE (bukan cuma UI)
      // agar action-log/replay M6 konsisten. Memaksa prioritisasi: waktu
      // konseling FKTP terbatas, bukan ceklis semua-yang-benar.
      if (enc.edukasi.length >= KAPASITAS_EDUKASI) {
        return gagal(
          enc,
          `Waktu konseling terbatas — maksimal ${KAPASITAS_EDUKASI} topik. Coret salah satu dulu bila ingin mengganti.`,
        )
      }
      return { enc: { ...enc, edukasi: [...enc.edukasi, action.edukasiId] }, events: [] }
    }

    case 'HAPUS_EDUKASI': {
      const salahFase = bukanFase(enc, 'terapi')
      if (salahFase) return salahFase
      if (!enc.edukasi.includes(action.edukasiId)) return tanpaPerubahan(enc)
      return {
        enc: { ...enc, edukasi: enc.edukasi.filter((id) => id !== action.edukasiId) },
        events: [],
      }
    }

    case 'TAMBAH_TINDAKAN': {
      const salahFase = bukanFase(enc, 'terapi')
      if (salahFase) return salahFase
      if (!pack.tindakan[action.tindakanId]) {
        return gagal(enc, `Tindakan '${action.tindakanId}' tidak ada di katalog.`)
      }
      if (enc.tindakan.includes(action.tindakanId)) return tanpaPerubahan(enc)
      return { enc: { ...enc, tindakan: [...enc.tindakan, action.tindakanId] }, events: [] }
    }

    case 'HAPUS_TINDAKAN': {
      const salahFase = bukanFase(enc, 'terapi')
      if (salahFase) return salahFase
      if (!enc.tindakan.includes(action.tindakanId)) return tanpaPerubahan(enc)
      return {
        enc: { ...enc, tindakan: enc.tindakan.filter((id) => id !== action.tindakanId) },
        events: [],
      }
    }

    /* -- Aksi lain bukan urusan klinik ------------------------------------------ */

    default:
      return tanpaPerubahan(enc)
  }
}

/* ---------------------------------------------------------------------------
 * nilaiEncounter — penilaian dari action-log, dipanggil reducer saat DISPOSISI
 * ------------------------------------------------------------------------- */

export function nilaiEncounter(
  enc: EncounterState,
  kasus: KasusKlinis,
  pack: ContentPack,
): PenilaianEncounter {
  /* -- Diagnosis -------------------------------------------------------------- */
  const diagnosisBenar = enc.diagnosis?.icd10 === kasus.icd10
  const jenisDiagnosis: JenisDiagnosis = enc.diagnosis?.jenis ?? 'suspek'

  /* -- Anamnesis: cakupan esensial + kedalaman OLDCARTS − penalti distraktor --- */
  // M10 Batch-2 (CODEX C.6): pertanyaan ber-`hanyaUntuk` yang tak cocok gender
  // pasien TIDAK berlaku utk encounter ini — keluar dari denominator esensial
  // & dimensi-tersedia (pasien apendisitis laki-laki tak wajib — dan tak
  // bisa — ditanya haid terakhir), dan bila toh tertanya (jejak lama/headless)
  // tak diberi kredit apa pun.
  const berlaku = (q: PertanyaanAnamnesis): boolean =>
    q.hanyaUntuk === undefined || q.hanyaUntuk === enc.pasien.jenisKelamin
  const anamnesisBerlaku = kasus.anamnesis.filter(berlaku)
  const petaTanya = new Map(anamnesisBerlaku.map((q) => [q.id, q]))
  const ditanyaQ: PertanyaanAnamnesis[] = []
  for (const id of enc.ditanya) {
    const q = petaTanya.get(id)
    if (q) ditanyaQ.push(q)
  }

  const totalEsensial = anamnesisBerlaku.filter((q) => q.esensial === true).length
  const esensialDitanya = ditanyaQ.filter((q) => q.esensial === true).length
  const rasioEsensial = totalEsensial > 0 ? esensialDitanya / totalEsensial : 1

  const dimensiOldcarts = new Set<string>()
  for (const q of ditanyaQ) for (const d of q.oldcarts ?? []) dimensiOldcarts.add(d)

  // Denominator kedalaman = dimensi yang BENAR-BENAR tersedia di kasus ini —
  // pemain teliti harus bisa mencapai 100, bukan mentok 87 karena konten.
  const dimensiTersedia = new Set<string>()
  for (const q of anamnesisBerlaku) for (const d of q.oldcarts ?? []) dimensiTersedia.add(d)
  const denominatorOldcarts = Math.max(1, Math.min(dimensiTersedia.size, TOTAL_DIMENSI_OLDCARTS))

  // DeepThink #2: klik distraktor SETELAH sabar habis (dicatat ke ditanyaKetus,
  // bukan ditanya — supaya tak dapat kredit) tetaplah instingsi klinis buruk;
  // tanpa ini mahasiswa bisa spam-klik semua distraktor sisa begitu pasien
  // ngambek tanpa penalti tambahan sama sekali.
  const distraktorKetus = enc.ditanyaKetus
    .map((id) => petaTanya.get(id))
    .filter((q): q is PertanyaanAnamnesis => q !== undefined && adalahDistraktor(q)).length
  const distraktorDitanya = ditanyaQ.filter(adalahDistraktor).length + distraktorKetus

  const skorAnamnesis = clamp(
    Math.round(
      70 * rasioEsensial +
        30 * (dimensiOldcarts.size / denominatorOldcarts) -
        5 * distraktorDitanya,
    ),
    0,
    100,
  )

  /* -- Pemeriksaan: region relevan tercakup − penalti pemeriksaan berlebih ----- */
  const regionRelevan = new Set(
    kasus.pemeriksaanFisik.filter((t) => t.relevan).map((t) => t.region),
  )
  const diperiksaUnik = [...new Set(enc.diperiksa)]
  const relevanDiperiksa = diperiksaUnik.filter((r) => regionRelevan.has(r)).length
  const takRelevanDiperiksa = diperiksaUnik.length - relevanDiperiksa
  const rasioPemeriksaan = regionRelevan.size > 0 ? relevanDiperiksa / regionRelevan.size : 1

  let skorPemeriksaan = clamp(
    Math.round(100 * rasioPemeriksaan - 10 * Math.max(0, takRelevanDiperiksa - 2)),
    0,
    100,
  )
  // Tanpa tanda vital, pemeriksaan tidak pernah lengkap.
  if (!enc.vitalDiukur) skorPemeriksaan = Math.min(skorPemeriksaan, 50)
  // M10.5 Q2: kasus dgn konfirmasiWajib (TB: BTA/TCM; malaria: RDT) tak boleh
  // didiagnosis/diterapi presumtif tanpa lab konfirmasi TERSEDIA hasilnya —
  // cap sama persis vitalDiukur. CODEX audit (2026-07-12, temuan #3): cek
  // sebelumnya pakai `labDipesan` (baru DIPESAN, belum tentu ada hasilnya —
  // bta_sputum sendiri `hasilBesok:true`), jadi memesan lab lalu LANGSUNG
  // menegakkan diagnosis presumtif di kunjungan yang sama tetap lolos cap.
  // `labTersedia` memastikan hasil SUDAH ada sebelum cap terangkat.
  //
  // CODEX audit pasca-GM (2026-07-13, temuan #3): cap di atas HANYA menyentuh
  // skorPemeriksaan (bobot 10%) — capGrade huruf & Dex "kuasai" (reducer.ts)
  // sama sekali tak tahu soal ini, jadi diagnosis TB presumtif tanpa BTA/TCM
  // tetap bisa dapat grade A penuh & Dex "dikuasai" asal komponen lain (yg
  // bobotnya jauh lebih besar) sempurna. `konfirmasiTakTerpenuhi` diekspos di
  // PenilaianEncounter supaya kedua konsumen itu bisa menggerbangnya sendiri.
  const konfirmasiTakTerpenuhi =
    kasus.konfirmasiWajib !== undefined && !enc.labTersedia.includes(kasus.konfirmasiWajib)
  if (konfirmasiTakTerpenuhi) {
    skorPemeriksaan = Math.min(skorPemeriksaan, 50)
  }
  const stabilisasiTerlewat =
    enc.disposisi === 'rujuk' &&
    (kasus.stabilisasiWajib ?? []).some((id) => !enc.tindakan.includes(id))

  /* -- Terapi: cakupan obat benar − penalti obat di luar tatalaksana ----------- */
  // Jebakan alergi: bila pasien membawa alergi kelas yang dijebak kasus, standar
  // emasnya BERGESER — obat terlarang keluar dari daftar benar, alternatif masuk.
  // Tanpa ini, dokter yang benar secara klinis (mis. eritromisin untuk pasien
  // alergi penisilin) justru dihukum sebagai "obat di luar tatalaksana".
  const trap = kasus.alergiTrap
  const pasienKenaTrap =
    trap !== undefined &&
    enc.pasien.alergi.some((a) => a.toLowerCase() === trap.kelas.toLowerCase())
  // Tier-1 #7 (audit CODEX 2026-07-11): analog trap alergi di atas, tapi utk
  // interaksi obat-jalan (mis. nitrat+PDE5-inhibitor) — faktor risiko
  // tersembunyi, BUKAN alergi, jadi mekanismenya dipisah (kelas semantik
  // beda) meski bentuknya paralel: obat terlarang keluar dari obatBenar,
  // alternatif (bila ada) masuk menggantikannya.
  const interaksi = kasus.interaksiTrap
  const pasienKenaInteraksi =
    interaksi !== undefined && enc.pasien.faktorRisiko.includes(interaksi.faktor)
  const obatTerlarangGabungan = [
    ...(pasienKenaTrap && trap ? trap.obatTerlarang : []),
    ...(pasienKenaInteraksi && interaksi ? interaksi.obatTerlarang : []),
  ]
  const obatBenar = [
    ...kasus.tatalaksana.obatBenar.filter((id) => !obatTerlarangGabungan.includes(id)),
    ...(pasienKenaTrap && trap ? trap.alternatifBenar : []),
    ...(pasienKenaInteraksi && interaksi ? interaksi.alternatifBenar : []),
  ]
  // Kelompok alternatif "pilih salah satu" (mis. 2 antihistamin setara). Tiap
  // grup = satu slot; terpenuhi bila ≥1 anggota diresepkan. Bila pasien kena
  // trap alergi/interaksi, anggota terlarang dikeluarkan dari grup demi keamanan.
  const grupAlternatif = (kasus.tatalaksana.obatAlternatif ?? []).map((g) =>
    g.filter((id) => !obatTerlarangGabungan.includes(id)),
  )
  const idAlternatifSah = new Set(grupAlternatif.flat())
  const slotAltTerpenuhi = grupAlternatif.filter((g) => g.some((id) => enc.resep.includes(id))).length
  const benarDiresepkan = obatBenar.filter((id) => enc.resep.includes(id)).length
  // M10 §49: obat OPSIONAL (clue bilang boleh-tidak-boleh, mis. antibiotik
  // topikal hordeolum) — bukan slot (tak meresepkan tak menurunkan rasio),
  // dan meresepkannya BUKAN obat-di-luar. Sebelum ini, hordeolum menghukum
  // justru mahasiswa yang paling patuh clue (kompres hangat tanpa antibiotik
  // → rasioTerapi 0 karena "slot" antibiotiknya kosong).
  const idOpsional = new Set(kasus.tatalaksana.obatOpsional ?? [])
  // Obat di luar = bukan obatBenar, bukan anggota grup alternatif, bukan opsional.
  const obatDiLuar = enc.resep.filter(
    (id) => !obatBenar.includes(id) && !idAlternatifSah.has(id) && !idOpsional.has(id),
  ).length
  // Prosedur/tindakan klinis (CODEX ronde-baru #4): utk 4 kasus (BPPV→Epley,
  // serumen→irigasi, epistaksis→tampon, PPOK-eksaserbasi→nebulisasi) tatalaksana
  // BENARNYA adalah melakukan tindakan, bukan (hanya) obat. Tiap prosedur wajib =
  // satu slot terapi; tindakan di luar rencana dihukum spt obat di luar (tindakan
  // tak terindikasi = pemborosan/risiko). Kasus tanpa prosedur (68 lainnya): tak
  // ada slot tambahan → skor tak berubah.
  const prosedurBenar = kasus.tatalaksana.prosedur ?? []
  const tindakanDilakukan = enc.tindakan ?? []
  const prosedurTerpenuhi = prosedurBenar.filter((id) => tindakanDilakukan.includes(id)).length
  const tindakanDiLuar = tindakanDilakukan.filter((id) => !prosedurBenar.includes(id)).length
  const tindakanSalahDilakukan = (kasus.tatalaksana.tindakanSalahUmum ?? []).filter((item) =>
    tindakanDilakukan.includes(item.id),
  )
  const tindakanBerbahaya = tindakanSalahDilakukan.some((item) => item.bahaya === 'berbahaya')
  const totalSlot = obatBenar.length + grupAlternatif.length + prosedurBenar.length
  const rasioTerapi =
    totalSlot > 0 ? (benarDiresepkan + slotAltTerpenuhi + prosedurTerpenuhi) / totalSlot : 1
  // Terapi kritis penyelamat nyawa (audit CODEX 2026-07-16, temuan #2): dulu
  // obat wajib (mis. MgSO4 preeklampsia, dosis-1 antibiotik pneumonia berat)
  // hanya menyumbang ke 20% bobot terapi tanpa gate — melewatkannya masih bisa
  // dapat A. `terapiKritis` menjadikannya GERBANG: id boleh obat (enc.resep)
  // atau prosedur (enc.tindakan). Terlewat satu → hard-cap D + picu konsekuensi.
  const terapiKritisTerlewat = (kasus.tatalaksana.terapiKritis ?? []).some(
    (id) => !enc.resep.includes(id) && !tindakanDilakukan.includes(id),
  )
  // Obat BERBAHAYA untuk kasus ini (obatSalahUmum, mis. NSAID pada dengue)
  // dihukum jauh lebih berat daripada sekadar "obat di luar tatalaksana".
  // Tier-1 #7: obat terlarang interaksi (mis. nitrat pada pasien PDE5) yg
  // TETAP diresepkan ikut dihitung sbg berbahaya — bukan cuma "obat di luar
  // rencana", ini kontraindikasi absolut (hipotensi berat/kolaps).
  //
  // CODEX audit pasca-GM (2026-07-13, temuan #2): obatSalahUmum dulu menghukum
  // SEMUA entrinya sama rata (-25/cap-54/tally/UKP-3), padahal isinya campuran
  // — sebagian benar kontraindikasi nyawa (kotrimoksazol pada alergi sulfa,
  // NSAID pada dengue) tapi sebagian cuma salah-sasaran/tak-efektif/stewardship
  // (ambroxol pada TB, vitamin B kompleks pada anemia) tanpa bahaya langsung.
  // `bahaya` (types.ts) memisahkan keduanya; hanya entri 'kontraindikasi' yang
  // tetap kena hukuman berat di bawah. Entri 'nonPrimer' (atau tak bertanda —
  // default kompat-mundur) turun ke penalti selevel obatDiLuar (-15 di
  // skorTerapi saja, TANPA cap/tally/UKP) — lihat obatNonPrimerDiresepkan.
  const obatSalahDiresepkan = (kasus.tatalaksana.obatSalahUmum ?? []).filter((o) =>
    enc.resep.includes(o.id),
  )
  const obatNonPrimerDiresepkan = obatSalahDiresepkan.filter(
    (o) => o.bahaya !== 'kontraindikasi',
  ).length
  const obatBerbahaya =
    obatSalahDiresepkan.filter((o) => o.bahaya === 'kontraindikasi').length +
    (pasienKenaInteraksi && interaksi
      ? interaksi.obatTerlarang.filter((id) => enc.resep.includes(id)).length
      : 0)
  // Stewardship (audit CODEX 2026-07-04): grup alternatif "pilih salah satu"
  // TIDAK selalu netral bila diisi lebih dari satu anggota — untuk analgesik/
  // antihipertensi/antihistamin dua obat sekelas cuma redundan (aman, karenanya
  // tak dihukum di atas). TAPI bila grup itu berisi ≥2 ANTIBIOTIK (mis. tifoid:
  // kloramfenikol/kotrimoksazol/amoksisilin — satu infeksi cukup SATU lini),
  // memberi lebih dari satu adalah polifarmasi antibiotik nyata: menaikkan
  // biaya & tekanan resistensi tanpa manfaat tambahan. Beda kasus dari
  // obatBerbahaya (obat yg memang kontraindikasi) — ini soal jumlah, bukan
  // pilihan yang salah.
  const antibiotikGandaDalamGrup = grupAlternatif.some((g) => {
    const antibiotikDiresepkan = g.filter(
      (id) => enc.resep.includes(id) && pack.obat[id]?.antibiotik === true,
    )
    return antibiotikDiresepkan.length > 1
  })
  // Stewardship: antibiotik diresepkan padahal tatalaksana benar tidak memuatnya
  // (obatBenar maupun grup alternatif yang sah). Dihitung SEBELUM skorTerapi
  // (DeepThink #3) — sebelumnya cuma direkam ke tally, TAK PERNAH menyentuh
  // skor terapi sendiri, jadi Amoksisilin serampangan sama ringannya skornya
  // dgn Vitamin C berlebih. Antimicrobial stewardship butuh guillotine sendiri,
  // BERTUMPUK di atas obatDiLuar (pola sama obatBerbahaya di atas — satu obat
  // salah bisa kena dua kategori penalti sekaligus, itu memang disengaja).
  // M10 §49: antibiotik OPSIONAL yang diresepkan tak boleh memicu penalti
  // stewardship — clue kasusnya sendiri yang menyebutnya sah (mis. kloramfenikol
  // tetes hordeolum). Antibiotik lain di luar sanksi kasus tetap dihitung.
  // Fix #17 (audit CODEX 2026-07-11): versi lama cek "apakah KASUS INI py
  // antibiotik apa pun di jawaban benar" (kasus-level) — bukan "apakah
  // antibiotik YANG DIRESEPKAN pemain itu sendiri ada di jawaban benar"
  // (obat-level). Akibatnya kasus yg obatBenar-nya memuat SATU antibiotik
  // (mis. amoksisilin utk faringitis) meloloskan antibiotik LAIN yg salah
  // (mis. siprofloksasin) dari penalti stewardship — asal bukan kasus
  // "tanpa-antibiotik-sama-sekali". Sekarang dicek per-obat yg diresepkan.
  const antibiotikSalahDiresepkan = enc.resep.some(
    (id) =>
      !idOpsional.has(id) &&
      pack.obat[id]?.antibiotik === true &&
      !obatBenar.includes(id) &&
      !idAlternatifSah.has(id),
  )
  const antibiotikTanpaIndikasi = antibiotikSalahDiresepkan
  let skorTerapi = clamp(
    Math.round(
      100 * rasioTerapi -
        15 * obatDiLuar -
        25 * obatBerbahaya -
        15 * obatNonPrimerDiresepkan -
        (antibiotikGandaDalamGrup ? 20 : 0) -
        15 * tindakanDiLuar -
        (tindakanBerbahaya ? 25 : 0) -
        (antibiotikTanpaIndikasi ? 25 : 0),
    ),
    0,
    100,
  )
  // Keputusan interim yang SAH: observasi sambil menunggu hasil lab besok
  // (mis. tunda OAT sampai BTA terkonfirmasi) tidak boleh dinilai gagal terapi.
  // WAJIB lab itu RELEVAN dgn kasus (DeepThink #1) — tanpa ini mahasiswa bisa
  // memesan lab APA SAJA ber-hasilBesok (mis. kultur darah utk panu) demi
  // proteksi skor 70 gratis, tak peduli lab itu ada hubungannya dgn kasus atau
  // tidak.
  // Fix #16 (adjudikasi dokter 2026-07-11, ronde CODEX-31): `hasilBesok` SAJA
  // tidak cukup — "menunda SEMUA terapi sambil menunggu" cuma sah utk lab yg
  // eksplisit ditandai `bolehTundaTerapi` (mis. BTA sebelum OAT), BUKAN utk
  // tiap lab ber-hasilBesok (Widal/IgM-dengue/HbA1c/TSH: berdasar penilaian
  // dokter, mulai terapi empiris/suportif justru yg dianjurkan, bukan
  // menunggu) — tanpa ini, 5 kasus (Tifoid/TB/Dengue/DM/GAD) bisa dapat
  // floor 70 gratis meski nol resep, padahal narasi kasus (mis. Tifoid)
  // eksplisit memperingatkan bahaya menunda antibiotik.
  const menungguLabBesok =
    enc.disposisi === 'observasi' &&
    enc.labDipesan.some((id) => {
      if (!pack.lab[id]?.bolehTundaTerapi) return false
      return kasus.lab.find((l) => l.id === id)?.relevan === true
    })
  // Fix #2 (audit CODEX 2026-07-11): floor ini dulu cuma cek `obatBerbahaya
  // === 0` — TIDAK memeriksa `antibiotikTanpaIndikasi`, yg dihitung tepat di
  // atas (baris ~534-541) dan sudah dipotong -25 dari skorTerapi mentah.
  // Akibatnya resep antibiotik SALAH yg kebetulan tak terdaftar di
  // obatSalahUmum kasus (mis. siprofloksasin pada kasus TB, bukan oat_kdt)
  // tetap lolos floor 70 — MENGHAPUS efek penalti stewardship yg seharusnya
  // sudah menjatuhkan skor. Ditambahkan syarat eksplisit di sini.
  if (menungguLabBesok && obatBerbahaya === 0 && !antibiotikTanpaIndikasi) {
    skorTerapi = Math.max(skorTerapi, 70)
  }

  /* -- Edukasi: PRIORITISASI (M7 34b/O4 — precision with opportunity cost) ------ */
  // Konstruk lama (cakupan-set) melahirkan strategi degenerate "4 topik sakti"
  // + shotgun. Kini baki maks KAPASITAS_EDUKASI (ditegakkan di TAMBAH_EDUKASI):
  // target = min(kapasitas, |wajib|) → kasus komorbid wajib>3 tetap bisa 100;
  // tembakan meleset dihukum lebih berat (15) karena tiap slot kini berharga.
  const edukasiWajib = kasus.tatalaksana.edukasi
  const edukasiTercakup = edukasiWajib.filter((id) => enc.edukasi.includes(id)).length
  const edukasiTakRelevan = enc.edukasi.filter((id) => !edukasiWajib.includes(id)).length
  const edukasiTarget = Math.min(KAPASITAS_EDUKASI, edukasiWajib.length)
  let skorEdukasi = clamp(
    Math.round(100 * (edukasiTarget > 0 ? Math.min(1, edukasiTercakup / edukasiTarget) : 1) - 15 * edukasiTakRelevan),
    0,
    100,
  )
  // DeepThink triangulasi (2026-07-05, docs/DEEPTHINK_EDUKASI_KRITIS.md, O1):
  // "wajib>3 tetap bisa 100" (komentar di atas) diam-diam mengizinkan topik yg
  // KLINIS PALING KRITIS terlewat (mis. tanda bahaya dengue) selama 3 topik
  // LAIN terpenuhi. `edukasiKritis` (opsional, jarang) menandai topik yg tak
  // boleh negotiable — dilewatkan satu saja → cap ceiling, meniru pola
  // `vitalDiukur→skorPemeriksaan` di atas persis (§`vitalDiukur` bawah).
  const edukasiKritisTerlewat = (kasus.tatalaksana.edukasiKritis ?? []).filter(
    (id) => !enc.edukasi.includes(id),
  )
  if (edukasiKritisTerlewat.length > 0) skorEdukasi = Math.min(skorEdukasi, 50)

  /* -- Disposisi: gatekeeper SKDI ---------------------------------------------- */
  // PRB (M3.13): pasien rujuk-balik sudah distabilkan RS — kontrol & pulangkan
  // dengan obat lanjutan adalah jalur benar; merujuk ULANG = pemborosan berjenjang.
  const disposisi = enc.disposisi
  const prb = enc.pasien.prb === true
  // M10.5 §3a (2026-07-12): TACC rujukan terjustifikasi — dokter boleh
  // mendeklarasikan alasan (komplikasi/komorbid/keterbatasan_fasilitas) saat
  // merujuk kasus `harusDirujuk:false`. Validity-check NYATA: deklarasi hanya
  // menghitung bila ADA di `kasus.justifikasiRujukValid` — dropdown bebas yg
  // tak cocok kasus TETAP dihukum, mencegah bypass trivial Referral Guillotine.
  const justifikasiValid =
    enc.justifikasiRujuk !== undefined &&
    (kasus.justifikasiRujukValid ?? []).includes(enc.justifikasiRujuk)
  // CODEX audit (2026-07-12, temuan #4): §3a dulu SETENGAH-mekanik — hanya
  // membebaskan `rujukanNonSpesialistik` (tally RRNS), tapi `disposisiTepat`
  // (dibaca reducer utk SISRUTE/Dex/surat) tak pernah tahu soal justifikasi,
  // jadi rujukan yg justru VALID tetap dianggap "disposisi keliru" di semua
  // jalur lain. Cabang di-mirror persis rujukanNonSpesialistik di bawah.
  const disposisiTepat = prb
    ? disposisi === 'pulang' || disposisi === 'observasi'
    : kasus.harusDirujuk
      ? disposisi === 'rujuk'
      : disposisi === 'pulang' || disposisi === 'observasi' || (disposisi === 'rujuk' && justifikasiValid)
  const rujukanNonSpesialistik = prb
    ? disposisi === 'rujuk'
    : disposisi === 'rujuk' && !kasus.harusDirujuk && !justifikasiValid
  const cowboy = !prb && kasus.harusDirujuk && disposisi !== 'rujuk'

  /* -- Lab tak relevan: dipesan tapi tidak terindikasi -------------------------- */
  let labTakRelevan = 0
  for (const id of enc.labDipesan) {
    const entri = kasus.lab.find((l) => l.id === id)
    if (!entri || !entri.relevan) labTakRelevan += 1
  }

  /* -- SBAR (hanya bila merujuk dan mengisi form; MURNI KOSMETIK) ---------------- */
  // Fix #19b (adjudikasi DeepThink 2026-07-11, ronde CODEX-31, opsi O-C):
  // sbarSkor TERBUKTI tidak pernah masuk nilaiTotal/tally/konsekuensi apa pun
  // (chip tampilan saja, PanelHasil.tsx) — mempertahankan penalti anti-cheat
  // keras (wajib-data-numerik, -50 copy-paste) untuk angka yang taruhannya
  // NOL adalah UX buruk (stres artifisial tanpa dampak nyata). Dilucuti jadi
  // indikator kelengkapan+kualitas murni: panjang tiap kolom + bonus sebut
  // diagnosis — tanpa gerbang punitif.
  let sbarSkor: number | undefined
  if (disposisi === 'rujuk' && enc.sbar) {
    const isian = [
      enc.sbar.situation,
      enc.sbar.background,
      enc.sbar.assessment,
      enc.sbar.recommendation,
    ]
    let skor = 0
    for (const teks of isian) if (teks.trim().length >= 20) skor += 20
    const assessment = enc.sbar.assessment.toLowerCase()
    const menyebutDiagnosis =
      assessment.includes(kasus.nama.toLowerCase()) ||
      assessment.includes(kasus.icd10.toLowerCase()) ||
      (enc.diagnosis !== undefined && assessment.includes(enc.diagnosis.icd10.toLowerCase()))
    if (menyebutDiagnosis) skor += 20
    sbarSkor = clamp(skor, 0, 100)
  }

  /* -- Grade tertimbang ---------------------------------------------------------- */
  const skorDiagnosis = diagnosisBenar ? 100 : 0
  let nilaiTotal =
    BOBOT_DIAGNOSIS * skorDiagnosis +
    BOBOT_ANAMNESIS * skorAnamnesis +
    BOBOT_TERAPI * skorTerapi +
    BOBOT_PEMERIKSAAN * skorPemeriksaan +
    BOBOT_EDUKASI * skorEdukasi
  // Fix #12 (audit CODEX 2026-07-11, adjudikasi 2026-07-12): grade dulu ABAI
  // disposisi sepenuhnya — diagnosis+terapi sempurna tapi gagal merujuk pasien
  // yg WAJIB dirujuk (cowboy) tetap bisa dapat A, meski disposisi disebut
  // "gatekeeper SKDI" (komentar di atas). Hard-cap konsisten dgn severity.
  //
  // Fix #1 (audit CODEX-25 2026-07-12): cap dulu HANYA menyangkut disposisi —
  // keselamatan OBAT sama sekali lolos. Terapi cuma 20% bobot, jadi resep
  // BERBAHAYA (nitrat pada pemakai PDE5, NSAID pada dengue) atau antibiotik
  // tanpa indikasi masih bisa dapat A bila komponen lain sempurna — menggerus
  // seluruh gerbang alergi/interaksi/ICD yang sudah dibangun. Cap keselamatan
  // obat ditambahkan, SEJAJAR severity disposisi. Semua cap independen (satu
  // encounter bisa kena >1) → ambil yang paling ketat, bukan else-if.
  //   cowboy (pasien wajib-rujuk dipulangkan)      → maks D (54)
  //   obat berbahaya/kontraindikasi absolut         → maks D (54) — bahaya nyawa
  //   antibiotik tanpa indikasi (stewardship)       → maks C (69)
  //   percobaan resep kontraindikasi diblokir firewall → maks C (69) — nyaris,
  //     tak sampai ke pasien, tapi kelalaian cek alergi tetap kelalaian nyata
  //   rujukanNonSpesialistik (boros, tak membahayakan pasien ini) → maks B (84)
  //   konfirmasiWajib tak terpenuhi (TB/malaria presumtif tanpa lab)  → maks C (69)
  const capGrade: number[] = []
  if (cowboy) capGrade.push(54)
  if (obatBerbahaya > 0) capGrade.push(54)
  if (tindakanBerbahaya) capGrade.push(54)
  if (antibiotikTanpaIndikasi) capGrade.push(69)
  // CODEX audit pasca-GM (2026-07-13, temuan #3): lihat komentar
  // `konfirmasiTakTerpenuhi` di atas — cap skorPemeriksaan saja tak cukup
  // menggerbang grade huruf, jadi ditambahkan di sini SEJAJAR
  // antibiotikTanpaIndikasi (sama-sama stewardship/kehati-hatian diagnostik,
  // bukan cedera langsung pasien).
  if (konfirmasiTakTerpenuhi) capGrade.push(69)
  // Melewatkan stabilisasi berisiko selama transport meski arah rujukan benar;
  // cap tier C, setara kelalaian konfirmasi klinis penting, bukan cowboy/cedera.
  if (stabilisasiTerlewat) capGrade.push(69)
  // Melewatkan terapi PENYELAMAT NYAWA (MgSO4 preeklampsia, dosis-1 antibiotik
  // pneumonia berat, adrenalin, oksigen edema paru) → maks D (54), setara
  // obatBerbahaya/cowboy: ini bahaya nyawa langsung, bukan sekadar suboptimal
  // (audit CODEX 2026-07-16, temuan #2 — dulu kasus2 ini bisa dapat A).
  if (terapiKritisTerlewat) capGrade.push(54)
  // CODEX audit (2026-07-12, temuan #13B): firewall alergi yg tertrigger
  // (resep diblokir sebelum sampai pasien) dulu NOL konsekuensi grade/skor —
  // murni badge UI (LembarPeriksa.tsx). Cap lebih ringan drpd obatBerbahaya
  // (54) krn bahaya tak pernah terjadi, tapi tetap didisiplinkan spt
  // antibiotikTanpaIndikasi (stewardship/kewaspadaan, bukan cedera nyata).
  if (enc.firewallTerpicu > 0) capGrade.push(69)
  if (rujukanNonSpesialistik) capGrade.push(84)
  if (capGrade.length > 0) nilaiTotal = Math.min(nilaiTotal, ...capGrade)
  const grade: PenilaianEncounter['grade'] =
    nilaiTotal >= 85 ? 'A' : nilaiTotal >= 70 ? 'B' : nilaiTotal >= 55 ? 'C' : 'D'

  return {
    kasusId: kasus.id,
    pasienNama: enc.pasien.nama,
    diagnosisBenar,
    jenisDiagnosis,
    skorAnamnesis,
    skorPemeriksaan,
    skorTerapi,
    skorEdukasi,
    disposisiTepat,
    rujukanNonSpesialistik,
    cowboy,
    antibiotikTanpaIndikasi,
    // CODEX audit (2026-07-12, temuan #1/#13B): dulu variabel lokal
    // (obatBerbahaya) atau field EncounterState murni-UI (firewallTerpicu) —
    // tak pernah terekspos di PenilaianEncounter, jadi reducer/tally/skor
    // formal tak bisa membacanya sama sekali. Diekspos di sini persis pola
    // cowboy/antibiotikTanpaIndikasi di atas.
    obatBerbahaya: obatBerbahaya > 0,
    tindakanBerbahaya,
    firewallTerpicu: enc.firewallTerpicu > 0,
    konfirmasiTakTerpenuhi,
    stabilisasiTerlewat,
    terapiKritisTerlewat,
    labTakRelevan,
    ...(sbarSkor !== undefined ? { sbarSkor } : {}),
    grade,
    clue: kasus.clue,
    // Reducer yang memutuskan & mengisi penjadwalan konsekuensi.
    konsekuensiDijadwalkan: false,
    edukasiKritisTerlewat,
  }
}
