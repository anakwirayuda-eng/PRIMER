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
import type { KasusKlinis, PertanyaanAnamnesis, Persona } from '@content/types'
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
 * buatEncounter — pasien baru duduk di ruang periksa
 * ------------------------------------------------------------------------- */

export function buatEncounter(pasien: PasienAktif): EncounterState {
  return {
    pasien,
    fase: 'anamnesis',
    ditanya: [],
    sabar: SABAR_AWAL,
    vitalDiukur: false,
    diperiksa: [],
    labDipesan: [],
    labTersedia: [],
    resep: [],
    edukasi: [],
    tindakan: [],
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

      // Pertanyaan berulang: pasien mengulang jawaban, tanpa menggeser state.
      if (enc.ditanya.includes(tanya.id)) {
        const teks =
          enc.sabar <= 0 ? rng.pick(JAWABAN_KETUS) : jawabanUntuk(tanya, enc.pasien.persona)
        return { enc, events: [{ type: 'PASIEN_MENJAWAB', teks }] }
      }

      const ditanya = [...enc.ditanya, tanya.id]
      let turun = 0
      if (adalahDistraktor(tanya)) turun += PENALTI_DISTRAKTOR
      if (ditanya.length >= AMBANG_PERTANYAAN_PANJANG) turun += PENALTI_PERTANYAAN_PANJANG
      const sabar = clamp(enc.sabar - turun, 0, SABAR_AWAL)

      // Sabar habis → jawaban ketus = TIDAK ada informasi klinis yang keluar.
      // Pertanyaan itu tak dicatat sebagai "ditanya": mengklik tombol bukan
      // sama dengan menggali data (temuan audit CODEX — kredit esensial/OLDCARTS
      // hanya untuk jawaban sungguhan).
      const jawabKetus = sabar <= 0
      const teks = jawabKetus ? rng.pick(JAWABAN_KETUS) : jawabanUntuk(tanya, enc.pasien.persona)
      const events: GameEvent[] = [{ type: 'PASIEN_MENJAWAB', teks }]
      if (turun > 0 && sabar < AMBANG_SABAR_MENIPIS) events.push({ type: 'SABAR_MENIPIS' })

      return { enc: { ...enc, ditanya: jawabKetus ? enc.ditanya : ditanya, sabar }, events }
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
  const petaTanya = new Map(kasus.anamnesis.map((q) => [q.id, q]))
  const ditanyaQ: PertanyaanAnamnesis[] = []
  for (const id of enc.ditanya) {
    const q = petaTanya.get(id)
    if (q) ditanyaQ.push(q)
  }

  const totalEsensial = kasus.anamnesis.filter((q) => q.esensial === true).length
  const esensialDitanya = ditanyaQ.filter((q) => q.esensial === true).length
  const rasioEsensial = totalEsensial > 0 ? esensialDitanya / totalEsensial : 1

  const dimensiOldcarts = new Set<string>()
  for (const q of ditanyaQ) for (const d of q.oldcarts ?? []) dimensiOldcarts.add(d)

  // Denominator kedalaman = dimensi yang BENAR-BENAR tersedia di kasus ini —
  // pemain teliti harus bisa mencapai 100, bukan mentok 87 karena konten.
  const dimensiTersedia = new Set<string>()
  for (const q of kasus.anamnesis) for (const d of q.oldcarts ?? []) dimensiTersedia.add(d)
  const denominatorOldcarts = Math.max(1, Math.min(dimensiTersedia.size, TOTAL_DIMENSI_OLDCARTS))

  const distraktorDitanya = ditanyaQ.filter(adalahDistraktor).length

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

  /* -- Terapi: cakupan obat benar − penalti obat di luar tatalaksana ----------- */
  // Jebakan alergi: bila pasien membawa alergi kelas yang dijebak kasus, standar
  // emasnya BERGESER — obat terlarang keluar dari daftar benar, alternatif masuk.
  // Tanpa ini, dokter yang benar secara klinis (mis. eritromisin untuk pasien
  // alergi penisilin) justru dihukum sebagai "obat di luar tatalaksana".
  const trap = kasus.alergiTrap
  const pasienKenaTrap =
    trap !== undefined &&
    enc.pasien.alergi.some((a) => a.toLowerCase() === trap.kelas.toLowerCase())
  const obatBenar = pasienKenaTrap && trap
    ? [
        ...kasus.tatalaksana.obatBenar.filter((id) => !trap.obatTerlarang.includes(id)),
        ...trap.alternatifBenar,
      ]
    : kasus.tatalaksana.obatBenar
  // Kelompok alternatif "pilih salah satu" (mis. 2 antihistamin setara). Tiap
  // grup = satu slot; terpenuhi bila ≥1 anggota diresepkan. Bila pasien kena
  // trap alergi, anggota terlarang dikeluarkan dari grup demi keamanan.
  const grupAlternatif = (kasus.tatalaksana.obatAlternatif ?? []).map((g) =>
    pasienKenaTrap && trap ? g.filter((id) => !trap.obatTerlarang.includes(id)) : g,
  )
  const idAlternatifSah = new Set(grupAlternatif.flat())
  const slotAltTerpenuhi = grupAlternatif.filter((g) => g.some((id) => enc.resep.includes(id))).length
  const benarDiresepkan = obatBenar.filter((id) => enc.resep.includes(id)).length
  // Obat di luar = bukan obatBenar DAN bukan anggota grup alternatif yang sah.
  const obatDiLuar = enc.resep.filter(
    (id) => !obatBenar.includes(id) && !idAlternatifSah.has(id),
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
  const totalSlot = obatBenar.length + grupAlternatif.length + prosedurBenar.length
  const rasioTerapi =
    totalSlot > 0 ? (benarDiresepkan + slotAltTerpenuhi + prosedurTerpenuhi) / totalSlot : 1
  // Obat BERBAHAYA untuk kasus ini (obatSalahUmum, mis. NSAID pada dengue)
  // dihukum jauh lebih berat daripada sekadar "obat di luar tatalaksana".
  const obatBerbahaya = (kasus.tatalaksana.obatSalahUmum ?? []).filter((o) =>
    enc.resep.includes(o.id),
  ).length
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
  let skorTerapi = clamp(
    Math.round(
      100 * rasioTerapi -
        15 * obatDiLuar -
        25 * obatBerbahaya -
        (antibiotikGandaDalamGrup ? 20 : 0) -
        15 * tindakanDiLuar,
    ),
    0,
    100,
  )
  // Keputusan interim yang SAH: observasi sambil menunggu hasil lab besok
  // (mis. tunda OAT sampai BTA terkonfirmasi) tidak boleh dinilai gagal terapi.
  const menungguLabBesok =
    enc.disposisi === 'observasi' && enc.labDipesan.some((id) => pack.lab[id]?.hasilBesok)
  if (menungguLabBesok && obatBerbahaya === 0) skorTerapi = Math.max(skorTerapi, 70)

  // Stewardship: antibiotik diresepkan padahal tatalaksana benar tidak memuatnya
  // (obatBenar maupun grup alternatif yang sah).
  const resepAdaAntibiotik = enc.resep.some((id) => pack.obat[id]?.antibiotik === true)
  const indikasiAntibiotik =
    obatBenar.some((id) => pack.obat[id]?.antibiotik === true) ||
    idAlternatifSah.size > 0 && [...idAlternatifSah].some((id) => pack.obat[id]?.antibiotik === true)
  const antibiotikTanpaIndikasi = resepAdaAntibiotik && !indikasiAntibiotik

  /* -- Edukasi: PRIORITISASI (M7 34b/O4 — precision with opportunity cost) ------ */
  // Konstruk lama (cakupan-set) melahirkan strategi degenerate "4 topik sakti"
  // + shotgun. Kini baki maks KAPASITAS_EDUKASI (ditegakkan di TAMBAH_EDUKASI):
  // target = min(kapasitas, |wajib|) → kasus komorbid wajib>3 tetap bisa 100;
  // tembakan meleset dihukum lebih berat (15) karena tiap slot kini berharga.
  const edukasiWajib = kasus.tatalaksana.edukasi
  const edukasiTercakup = edukasiWajib.filter((id) => enc.edukasi.includes(id)).length
  const edukasiTakRelevan = enc.edukasi.filter((id) => !edukasiWajib.includes(id)).length
  const edukasiTarget = Math.min(KAPASITAS_EDUKASI, edukasiWajib.length)
  const skorEdukasi = clamp(
    Math.round(100 * (edukasiTarget > 0 ? Math.min(1, edukasiTercakup / edukasiTarget) : 1) - 15 * edukasiTakRelevan),
    0,
    100,
  )

  /* -- Disposisi: gatekeeper SKDI ---------------------------------------------- */
  // PRB (M3.13): pasien rujuk-balik sudah distabilkan RS — kontrol & pulangkan
  // dengan obat lanjutan adalah jalur benar; merujuk ULANG = pemborosan berjenjang.
  const disposisi = enc.disposisi
  const prb = enc.pasien.prb === true
  const disposisiTepat = prb
    ? disposisi === 'pulang' || disposisi === 'observasi'
    : kasus.harusDirujuk
      ? disposisi === 'rujuk'
      : disposisi === 'pulang' || disposisi === 'observasi'
  const rujukanNonSpesialistik = prb
    ? disposisi === 'rujuk'
    : disposisi === 'rujuk' && !kasus.harusDirujuk
  const cowboy = !prb && kasus.harusDirujuk && disposisi !== 'rujuk'

  /* -- Lab tak relevan: dipesan tapi tidak terindikasi -------------------------- */
  let labTakRelevan = 0
  for (const id of enc.labDipesan) {
    const entri = kasus.lab.find((l) => l.id === id)
    if (!entri || !entri.relevan) labTakRelevan += 1
  }

  /* -- SBAR (hanya bila merujuk dan mengisi form) -------------------------------- */
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
    // S harus memuat DATA — angka vital/pemeriksaan yang benar-benar diukur,
    // bukan padding administratif. (Panjang saja tidak cukup.)
    if (enc.sbar.situation.trim().length >= 20 && !/\d/.test(enc.sbar.situation)) skor -= 20
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
  const nilaiTotal =
    BOBOT_DIAGNOSIS * skorDiagnosis +
    BOBOT_ANAMNESIS * skorAnamnesis +
    BOBOT_TERAPI * skorTerapi +
    BOBOT_PEMERIKSAAN * skorPemeriksaan +
    BOBOT_EDUKASI * skorEdukasi
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
    labTakRelevan,
    ...(sbarSkor !== undefined ? { sbarSkor } : {}),
    grade,
    clue: kasus.clue,
    // Reducer yang memutuskan & mengisi penjadwalan konsekuensi.
    konsekuensiDijadwalkan: false,
  }
}
