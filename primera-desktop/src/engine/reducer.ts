/**
 * REDUCER — jantung engine. `advance(state, action, pack) → { state, events }`.
 * Murni & deterministik: keacakan hanya dari Rng yang diturunkan seed+hari+aksi.
 * Action-log dicatat di sini — sumber kebenaran skor.
 */

import type { Action } from './actions'
import type { GameEvent } from './events'
import type {
  FokusProgram,
  GameState,
  KeluargaState,
  LangkahUmpanBalikRujukan,
  ModeStase,
  PenilaianEncounter,
  PesertaProlanis,
  SumberEpisode,
  Surat,
} from './state'
import type { IndikatorPisPk } from '@content/types'
import { SEMUA_INDIKATOR_PISPK } from './pispk'

/**
 * #5 (audit CODEX UKM 2026-07-16): domain indikator KIA yang diverifikasi
 * langsung oleh posyandu berkualitas (penimbangan/pencatatan = pengumpulan
 * data nyata, menggantikan tebakan kader).
 *
 * Audit CODEX beta.16 (2026-08-06): dulu daftar ini DATAR — lima indikator
 * dikoreksi sekaligus tanpa peduli meja mana yang benar-benar dibuka sesi itu.
 * Terukur atas 320 sesi: `persalinan_faskes` dan `kb` ikut terangkat di 100%
 * sesi, padahal TAK SATU PUN dari 12 kartu posyandu menghasilkan data rumah
 * tangga tentang tempat bersalin atau pemakaian KB. Itu provenance karangan:
 * label datanya berubah jadi "ditegakkan dokter" untuk hal yang tak pernah
 * diamati siapa pun di sesi itu.
 *
 * Kini tiap indikator digantung pada kartu yang benar-benar menghasilkannya.
 * Kartu yang TIDAK tertarik pada sesi itu tak mengoreksi apa pun. Pemetaannya
 * sengaja konservatif — hanya yang isi kartunya sendiri menyebutkannya:
 *   - penimbangan balita & Buku KIA  -> pemantauan tumbuh kembang
 *   - meja imunisasi                  -> imunisasi dasar
 *   - penyuluhan ibu balita           -> ASI eksklusif (jawaban benarnya
 *                                        harfiah "ASI eksklusif + MPASI")
 * `persalinan_faskes` dan `kb` sengaja TIDAK dipetakan ke kartu mana pun.
 * Kohort ibu hamil memang memuat rencana tempat bersalin di praktik nyata,
 * tetapi kartu itu di sini mengajarkan tanda bahaya preeklampsia, bukan
 * rencana persalinan — memetakannya ke sana akan mengulang kelas overclaim
 * yang justru sedang disapu. Keduanya tetap bisa ditegakkan lewat kunjungan
 * rumah (kunjungan.ts), yang memang mengamatinya langsung.
 */
const INDIKATOR_PER_KARTU_POSYANDU: Readonly<Record<string, readonly IndikatorPisPk[]>> = {
  posy_timbang: ['pantau_tumbuh_kembang'],
  posy_kms: ['pantau_tumbuh_kembang'],
  posy_imunisasi: ['imunisasi_dasar'],
  posy_penyuluhan: ['asi_eksklusif'],
}

/**
 * Seluruh indikator KIA yang MUNGKIN dikoreksi Posyandu — gabungan seluruh
 * kartu. Dipakai untuk menjawab "masih adakah yang menunggu diperiksa di RW
 * ini", terpisah dari indikator yang kebetulan tertarik pada satu sesi.
 */
const SEMUA_INDIKATOR_KIA_POSYANDU: readonly IndikatorPisPk[] = [
  ...new Set(Object.values(INDIKATOR_PER_KARTU_POSYANDU).flat()),
]

/** Indikator yang benar-benar dikoreksi sesi ini = gabungan kartu yang tertarik. */
function indikatorPosyanduSesi(kartuId: readonly string[]): IndikatorPisPk[] {
  const keluar = new Set<IndikatorPisPk>()
  for (const id of kartuId) {
    for (const ind of INDIKATOR_PER_KARTU_POSYANDU[id] ?? []) keluar.add(ind)
  }
  return [...keluar]
}
import {
  encounterArchetypeAktif,
  kasusFormatif,
  ukmScenarioAktif,
  type ContentPack,
} from '@content/pack'
import type { Persona } from '@content/types'
import { Rng } from './core/rng'
import { buatEncounter, aksiKlinik, nilaiEncounter, kasusEfektif } from './clinic'
import {
  arcKunjunganAktif,
  buatKunjungan,
  aksiKunjungan,
  selesaikanKunjungan,
  terapkanHasil,
  mundurTtm,
  skenarioEfektif,
  hariTindakLanjutKunjungan,
  penutupanAwalSah,
} from './kunjungan'
import { prosesHarianKader } from './kader'
import { susunAntrianHarian, buatPasienDariKasus, peluangIgd } from './director'
import { ambangKlusterPack, kasusMenular, pangkasSurveilans, hitungCluster } from './surveilans'
import {
  buatKegiatan,
  jawabKegiatan,
  delegasiKegiatan,
  nilaiKegiatan,
  driftProlanis,
  prolanisTerkendali,
  kartuPosyandu,
  kartuProlanis,
  kartuKlb,
} from './kegiatan'
import {
  buatIgd,
  aksiIgd,
  rjpIgd,
  stabilisasiLanjutanIgd,
  nilaiIgd,
  rumahSakitCocokUntukIgd,
  AMBANG_STABIL_RUJUK,
} from './igd'
import { hitungSkor } from './scoring'
import { HARI_STASE, paketUjianDariId } from './paketUjian'
import { examIgdCaseIdForDay } from './examBlueprint'
import { buatEpisodeId, episodeIdPasien, perbaruiEpisode } from './bridge'

export interface HasilAdvance {
  state: GameState
  events: GameEvent[]
}

/* -- Konstanta alur (slice) -------------------------------------------------- */
export const HARI_BUKA_PETA = 2
export const HARI_BUKA_KUNJUNGAN = 3
export const HARI_REKAP_SLICE = 8
export const STAMINA_MAKS = 6
export const BIAYA_STAMINA_PASIEN = 1
export const BIAYA_STAMINA_KUNJUNGAN: Record<'dekat' | 'sedang' | 'terpencil', number> = {
  dekat: 1,
  sedang: 1,
  terpencil: 2,
}
// Diskalakan utk library 60+ kasus (guardrail KONTEN_BALANCE #3); ★3 = dikuasai
// permanen dalam satu playthrough (tidak luntur).
export const LUNTUR_BINTANG_HARI = 14
/** M10.5 #15 (2026-07-12): diskalakan proporsional per mode, pola sama
 * Q1/O-C (HARI_PENGUMUMAN_AKREDITASI) — dulu literal D30/D45, tak pernah
 * nyala di mode Ujian yang tamat hari 30 (rasio 90 hari karier terjaga:
 * Prolanis 30/90=1/3 → 10; KLB 45/90=1/2 → 15). */
export const HARI_BUKA_PROLANIS: Record<ModeStase, number> = { karier: 30, ujian: 10 }
export const HARI_BUKA_KLB: Record<ModeStase, number> = { karier: 45, ujian: 15 }
/** CODEX audit pasca-GM (2026-07-13, temuan #8a): `HARI_BUKA_POSYANDU`/
 * `COOLDOWN_POSYANDU` dulu angka DATAR (bukan `Record<ModeStase,...>` spt
 * HARI_BUKA_PROLANIS/KLB di atas) — Posyandu tetap buka D15 & cooldown 30
 * hari di mode Ujian juga, jadi RW paling banter dapat SATU sesi bonus
 * IKS dalam stase 30-hari (vs ~3 di Karier 90-hari pd rasio yg sama) —
 * padahal bonus ini score-relevant (langsung masuk `iksDesa`, scoring.ts).
 * Diskalakan dgn rasio yg sama persis dgn HARI_BUKA_PROLANIS (30/90=1/3).
 */
export const HARI_BUKA_POSYANDU: Record<ModeStase, number> = { karier: 15, ujian: 5 }
export const COOLDOWN_POSYANDU: Record<ModeStase, number> = { karier: 30, ujian: 10 }
/**
 * Peluang janji perubahan perilaku DITEPATI, fungsi trust keluarga (0-10):
 * trust tinggi (hubungan kuat) → hampir pasti ditepati; trust rendah → koin.
 * Bukan hadiah cuma-cuma — hasil PIS-PK sungguhan bergantung pada relasi.
 */
export function peluangJanjiDitepati(trust: number): number {
  return Math.max(0.35, Math.min(0.92, 0.35 + 0.055 * trust))
}
export const BIAYA_STAMINA_KEGIATAN = 2
/** Kapasitas roster keluarga binaan (M3c: 8 → 16 seiring 16 keluarga bernama). */
export const MAKS_BINAAN = 16
/** M4.18 — lead time pengadaan obat (hari). */
export const LEAD_TIME_OBAT = 3
/** M4.19 — biaya operasional bulanan Puskesmas (listrik, ATK, BBM ambulans...). */
export const OPERASIONAL_BULANAN = 2_500_000
/** M4.19 — ambang kas: di bawah ini laporan bulanan berbuntut teguran Dinkes. */
export const AMBANG_TEGURAN_KAS = 8_000_000
/** Fix #5b (audit CODEX 2026-07-11) — batas berapa kali hasil kunjungan
 * 'partial' boleh menunda karma keluarga sebelum jatuh tempo asli berlaku. */
export const BATAS_PARTIAL_KARMA = 2
/**
 * S6-degenerate (a), 2026-08-01 — plafon trust dari silaturahmi akhir pekan.
 * Dulu +1 ke SEMUA binaan ber-arc hidup: 4 akhir pekan membawa trust 2→6 dan
 * menembus seluruh gerbang kejujuran (ambangTrust 4/5/6) tanpa satu kunjungan
 * pun. Silaturahmi kini hanya membangun rapport AWAL (trust < 4 → +1, mentok
 * di 4): gerbang ambang-4 masih terjangkau, gerbang dalam (≥5) menuntut kerja
 * kunjungan sungguhan. Dipakai reducer (aturan) + MejaKerja.tsx (teks tooltip)
 * + test — satu konstanta, teks UI tak bisa melenceng dari perilaku.
 */
export const TRUST_PLAFON_SILATURAHMI = 4

/** Fix Q1/O-C (CODEX-31 §65, 2026-07-12) — hari pengumuman & visitasi
 * akreditasi M4.20, diskalakan proporsional per mode (dulu literal
 * hari===50/60, tak pernah nyala di mode Ujian yang tamat hari 30). */
export const HARI_PENGUMUMAN_AKREDITASI: Record<ModeStase, number> = { karier: 50, ujian: 17 }
export const HARI_VISITASI_AKREDITASI: Record<ModeStase, number> = { karier: 60, ujian: 20 }

/** M10.5 #15 (2026-07-12): siklus laporan bulanan KBK/kapitasi + Lokakarya
 * Mini, diskalakan proporsional per mode (sama rasio HARI_BUKA_PROLANIS) —
 * dulu literal 30 hari, hanya nyala SEKALI (D1) di mode Ujian 30-hari,
 * pemain tak pernah melihat siklus kapitasi/evaluasi berulang seperti karier. */
export const SIKLUS_LAPORAN_BULANAN: Record<ModeStase, number> = { karier: 30, ujian: 10 }

/** CODEX audit pasca-GM (2026-07-13, temuan #11): batas retry pasif bed-penuh
 * SISRUTE (lihat `bedRetry` di state.ts) — mencegah pasien tertahan selamanya
 * bila RNG bed terus jatuh buruk. Setelah MAKS_RETRY_BED_PENUH kali gagal,
 * jejaring MEMAKSA terima (surat menjelaskan eskalasi), bukan menunda lagi. */
export const MAKS_RETRY_BED_PENUH = 3

/** PSN menekan vektor (DBD), PHBS menekan air-makanan (diare/tifoid), skrining
 * menekan droplet/kronis-terdeteksi. Diekspor agar UI (Lokakarya "Triase
 * Anggaran") bisa menunjukkan kluster mana yang TAK terdanai fokus berjalan. */
export const TARGET_KASUS_PROGRAM: Record<FokusProgram, string[]> = {
  psn: ['dengue_df'],
  phbs: ['diare_akut_anak', 'demam_tifoid'],
  skrining: ['tb_paru', 'ispa_common_cold'],
}

/** Id surat deterministik: hari + urutan dalam hari (aman untuk save/load). */
function buatSuratHarian(hari: number, seq: number, s: Omit<Surat, 'id' | 'hari' | 'dibaca'>): Surat {
  return { id: `surat_${hari}_${seq}`, hari, dibaca: false, ...s }
}

function err(state: GameState, pesan: string): HasilAdvance {
  return { state, events: [{ type: 'ERROR_AKSI', pesan }] }
}

/**
 * Menjaga satu-slot-lapangan-per-hari tetap adil setelah tenggat karma digeser
 * oleh kontak awal, follow-up, atau hasil partial. Tenggat awal sudah diberi
 * jarak di init; tanpa pagar yang sama saat reschedule, dua keluarga dapat
 * menumpuk pada hari identik dan membuat satu krisis mustahil dicegah.
 */
function hariKarmaTersedia(
  jadwal: GameState['jadwal'],
  keluargaId: string,
  hariDiinginkan: number,
): number {
  const terisi = new Set(
    jadwal
      .filter((item) => item.jenis === 'karma_igd' && item.keluargaId !== keluargaId)
      .map((item) => item.hari),
  )
  let hari = hariDiinginkan
  while (terisi.has(hari)) hari += 1
  return hari
}

function catat(state: GameState, action: Action, detail?: string, replay = false): GameState {
  const entry = { hari: state.hari, blok: state.blok, aksi: action.type, ...(detail ? { detail } : {}) }
  // M6: jejak = jurnal aksi PENUH (payload utuh) — aksi yang ditolak pun ikut
  // dicatat supaya replay mereproduksi penolakan yang sama (verifikasi.ts).
  if (replay) {
    // Verifier replay (CODEX M14 #9): state dimiliki EKSKLUSIF oleh loop replay
    // (tak dibagi ke React/Zustand), jadi append in-place aman & mengubah
    // spread O(n)/call → O(1) amortized — cegah O(n^2) yang bisa membekukan
    // verifier utk jejak raksasa. log.length TETAP tumbuh identik dgn playthrough
    // asli (dipakai sbg penghitung RNG/ID di aksi klinik & IGD), jadi determinisme
    // replay TIDAK berubah. HANYA aktif saat replay=true; gameplay normal tak
    // tersentuh (jalur immutable di bawah).
    state.log.push(entry)
    state.jejak.push(action)
    return state
  }
  return { ...state, log: [...state.log, entry], jejak: [...state.jejak, action] }
}

/* ---------------------------------------------------------------------------
 * ADVANCE
 * ------------------------------------------------------------------------- */

/**
 * Aksi yang tetap boleh dijalankan SETELAH stase TAMAT — murni navigasi/baca
 * (laporan/rapor/Buku Saku/surat). LANJUTKAN dibiarkan lolos ke handler-nya
 * sendiri (pesan spesifik "skor terkunci"). Selain ini, semua aksi yang bisa
 * mengubah kapitasi/tally/dex/program/roster DITOLAK pasca-tamat (CODEX M14 #1).
 */
const AKSI_PASCA_TAMAT: ReadonlySet<Action['type']> = new Set(['PINDAH_LAYAR', 'BACA_SURAT', 'LANJUTKAN'])

export function advance(state: GameState, action: Action, pack: ContentPack, replay = false): HasilAdvance {
  const s = catat(state, action, undefined, replay)

  // M10.5 (integritas skor, CODEX M14 #1): sekali stase TAMAT, skor terkunci.
  // Hanya navigasi & baca yang diizinkan; sisanya ditolak agar tak bisa
  // dimanipulasi pasca-tamat. Konsekuensi verifier: dossier yang jejaknya memuat
  // mutasi pasca-tamat akan direplay ULANG dgn guard ini → mutasi tereproduksi
  // sbg penolakan → skor hasil replay tak cocok klaim → vonis TIDAK SAH.
  if (s.tamat && !AKSI_PASCA_TAMAT.has(action.type)) {
    return err(s, 'Stase sudah berakhir — skor terkunci. Hanya laporan, rapor, Buku Saku, dan surat yang bisa dibuka.')
  }

  switch (action.type) {
    case 'MULAI_GAME':
      // Ditangani init.ts (buildInitialState) — reducer menolak agar tak double-init.
      return err(s, 'MULAI_GAME ditangani init, bukan reducer')

    case 'PINDAH_LAYAR': {
      // Guard unlock kurikuler
      if (action.layar === 'peta' && s.hari < HARI_BUKA_PETA) return err(s, 'Peta desa terbuka besok — hari ini fokus klinik dulu.')
      if (action.layar === 'kunjungan') return err(s, 'Kunjungan dimulai dari kartu keluarga di Peta Desa.')
      if (action.layar === 'laporan' && !s.tamat) return err(s, 'Laporan Akhir terbit saat stase berakhir.')
      // CODEX ronde-11 #1: sesi kegiatan lapangan (posyandu/prolanis/KLB) aktif
      // tak menahan navigasi HUD — pemain bisa pindah layar lalu LANJUTKAN,
      // membuat sesi lenyap tanpa skor (hariBaru mereset `kegiatan` tanpa
      // syarat). Tegakkan di ENGINE (bukan cuma disable tombol HUD), mengikuti
      // pola yang sama dgn kunjungan/klinik/IGD.
      if (s.kegiatan) return err(s, 'Selesaikan kegiatan lapangan dulu.')
      return { state: { ...s, layar: action.layar }, events: [] }
    }

    case 'BACA_SURAT': {
      const inbox = s.inbox.map((m) => (m.id === action.suratId ? { ...m, dibaca: true } : m))
      return { state: { ...s, inbox }, events: [] }
    }

    case 'ADOPSI_UMPAN_BALIK': {
      const surat = s.inbox.find((item) => item.id === action.suratId)
      if (!surat) return err(s, 'Surat umpan balik tidak ditemukan.')
      if (!surat.dibaca) return err(s, 'Baca ringkasan RS sebelum menyusun tindak lanjut FKTP.')
      const episode = surat.episodeId
        ? s.careEpisodes.find((item) => item.id === surat.episodeId)
        : undefined
      if (!episode || episode.referral?.stage !== 'feedback') {
        return err(s, 'Surat ini tidak memiliki umpan balik rujukan yang menunggu tindakan.')
      }

      const dipilih = new Set<LangkahUmpanBalikRujukan>(action.langkah)
      const wajib: LangkahUmpanBalikRujukan[] = ['rekonsiliasi', 'kontrol']
      if (episode.familyId) wajib.push('pemantauan_keluarga')
      if (wajib.some((item) => !dipilih.has(item))) {
        return err(s, 'Lengkapi rekonsiliasi, rencana kontrol, dan pemantauan keluarga yang berlaku.')
      }

      const labelLangkah: Record<LangkahUmpanBalikRujukan, string> = {
        rekonsiliasi: 'rekonsiliasi terapi/instruksi RS',
        kontrol: 'jadwal kontrol FKTP',
        pemantauan_keluarga: 'pemantauan keluarga/kader',
      }
      const rencana = wajib.map((item) => labelLangkah[item]).join(', ')
      const careEpisodes = perbaruiEpisode(s.careEpisodes, {
        id: episode.id,
        day: s.hari,
        subjectId: episode.subjectId,
        subjectName: episode.subjectName,
        ...(episode.familyId ? { familyId: episode.familyId } : {}),
        ...(episode.rw !== undefined ? { rw: episode.rw } : {}),
        source: episode.source,
        problemId: episode.problemId,
        problemLabel: episode.problemLabel,
        owner: episode.familyId ? 'kader' : 'dokter',
        status: 'terverifikasi',
        signal: episode.receipt.signal,
        decision: `Umpan balik diadopsi: ${rencana}.`,
        ...(episode.receipt.feedback ? { feedback: episode.receipt.feedback } : {}),
        nextAction: episode.familyId
          ? 'Pertahankan kontrol FKTP dan pemantauan keluarga melalui kader/PWS.'
          : 'Laksanakan kontrol FKTP sesuai ringkasan RS dan tanda bahaya pasien.',
        dueDay: null,
        referral: {
          ...episode.referral,
          stage: 'acted',
        },
        eventLabel: 'Umpan balik masuk ke rencana perawatan',
        eventDetail: `Dokter menetapkan ${rencana}.`,
      })
      return { state: { ...s, careEpisodes }, events: [] }
    }

    case 'TULIS_REFLEKSI': {
      if (s.blok !== 'sore') return err(s, 'Refleksi ditulis di meja kerja, sore hari.')
      return { state: { ...s, refleksi: { ...s.refleksi, [s.hari]: action.teks } }, events: [] }
    }

    case 'TUTUP_REKAP': {
      return { state: { ...s, flags: { ...s.flags, rekapSlice: false, rekapDitutup: true } }, events: [] }
    }

    case 'LANJUTKAN':
      return lanjutkan(s, pack)

    /* -- Klinik -------------------------------------------------------------- */

    case 'PANGGIL_PASIEN': {
      if (s.igd) return err(s, 'Pasien IGD dulu — dia tidak bisa menunggu.')
      if (s.blok !== 'pagi') return err(s, 'Klinik hanya buka blok pagi.')
      if (s.klinik.aktif) return err(s, 'Masih ada pasien di ruang periksa.')
      const berikut = s.klinik.antrian[0]
      if (!berikut) return err(s, 'Antrian kosong.')
      // Save lama + konten berubah: pasien dengan kasus yang tak lagi dikenal
      // dibuang dengan pesan, bukan membekukan klinik.
      if (!pack.kasus[berikut.kasusId]) {
        return {
          state: { ...s, klinik: { ...s.klinik, antrian: s.klinik.antrian.slice(1) } },
          events: [{ type: 'ERROR_AKSI', pesan: `${berikut.nama} pulang — datanya dari versi lama yang tidak dikenal.` }],
        }
      }
      if (s.stamina < BIAYA_STAMINA_PASIEN) return err(s, 'Staminamu habis — lanjutkan hari atau istirahat.')
      const enc = buatEncounter(berikut)
      return {
        state: {
          ...s,
          stamina: s.stamina - BIAYA_STAMINA_PASIEN,
          layar: 'klinik',
          klinik: { ...s.klinik, antrian: s.klinik.antrian.slice(1), aktif: enc },
        },
        events: [{ type: 'PASIEN_DIPANGGIL', nama: berikut.nama }],
      }
    }

    case 'TANYA':
    case 'UKUR_VITAL':
    case 'PERIKSA':
    case 'PESAN_LAB':
    case 'LANJUT_FASE':
    case 'KOMIT_DIAGNOSIS':
    case 'TAMBAH_OBAT':
    case 'HAPUS_OBAT':
    case 'TAMBAH_EDUKASI':
    case 'HAPUS_EDUKASI':
    case 'TAMBAH_TINDAKAN':
    case 'HAPUS_TINDAKAN':
    case 'MULAI_OBSERVASI':
    case 'NILAI_ULANG_OBSERVASI': {
      const enc = s.klinik.aktif
      if (!enc) return err(s, 'Tidak ada pasien aktif.')
      // M4.18 — gerbang stok: obat habis tak bisa diresepkan. Entri undefined =
      // tidak dilacak (save lama) → lolos, mekanik hanya aktif utk stok terlacak.
      if (action.type === 'TAMBAH_OBAT') {
        const sisa = s.gudang.stok[action.obatId]
        if (sisa !== undefined && sisa <= 0) {
          return err(
            s,
            `Stok ${pack.obat[action.obatId]?.nama ?? action.obatId} HABIS — pesan lewat Gudang Obat (tiba 3 hari) atau pilih terapi alternatif.`,
          )
        }
      }
      const kasusDasar = pack.kasus[enc.pasien.kasusId]
      if (!kasusDasar) return err(s, `Kasus ${enc.pasien.kasusId} tidak ditemukan.`)
      // M11 #4 Tingkat A: terapkan varian kosmetik pasien ini (kasusEfektif
      // adalah identitas bila pasien tak punya varianId — nol biaya).
      const kasus = kasusEfektif(kasusDasar, enc.pasien.varianId)
      const rng = new Rng(s.seed, 'klinik', s.hari, s.log.length)
      const hasil = aksiKlinik(enc, action, kasus, pack, rng)
      let next: GameState = { ...s, klinik: { ...s.klinik, aktif: hasil.enc } }

      // Lab "besok": jadwalkan hasil + biaya. Guard duplikat DAN phase-guard
      // (CODEX audit 2026-07-04): clinic menolak pesanan ganda diam-diam ATAU
      // menolak ERROR_AKSI bila fase salah — kedua kasus, reducer tidak boleh
      // tetap membakar biaya/jadwal. Cek hasil.enc (state SETELAH aksiKlinik),
      // bukan enc (state SEBELUM) — kalau ditolak, hasil.enc === enc (tak
      // berubah) sehingga labId tetap tak ada di labDipesan.
      if (
        action.type === 'PESAN_LAB' &&
        !enc.labDipesan.includes(action.labId) &&
        hasil.enc.labDipesan.includes(action.labId)
      ) {
        const item = pack.lab[action.labId]
        if (item) {
          // BPJS membakar kapitasi; pasien umum membayar retribusi ke kas.
          next = { ...next, kapitasi: next.kapitasi + (enc.pasien.bpjs ? -item.biaya : item.biaya) }
          if (item.hasilBesok) {
            next = {
              ...next,
              jadwal: [
                ...next.jadwal,
                {
                  id: `jadwal_lab_${s.hari}_${action.labId}_${enc.pasien.id}`,
                  hari: s.hari + 1,
                  jenis: 'hasil_lab',
                  labId: action.labId,
                  pasienId: enc.pasien.id,
                  kasusId: enc.pasien.kasusId,
                  // M10 §49: bawa NAMA pasien — konsumen (hariBaru) dulu selalu
                  // jatuh ke fallback "pasien kemarin" krn field ini kosong;
                  // dua lab hasilBesok di hari sama → dua surat berjudul identik.
                  nama: enc.pasien.nama,
                  catatan: enc.pasien.nama,
                },
              ],
            }
          }
        }
      }
      return { state: next, events: hasil.events }
    }

    case 'DISPOSISI': {
      const enc = s.klinik.aktif
      if (!enc) return err(s, 'Tidak ada pasien aktif.')
      // Diagnosis wajib untuk SEMUA disposisi, termasuk rujuk (CODEX P1): "kenali
      // lalu rujuk" tak boleh diganti "rujuk tanpa bernalar" — confidence-tag di
      // bawah hanya bermakna bila pemain benar-benar sudah menegakkan sesuatu.
      if (!enc.diagnosis) return err(s, 'Stempelkan diagnosismu dulu sebelum menentukan disposisi (termasuk rujuk).')
      // Phase-guard (CODEX audit 2026-07-04, temuan #2 §9): selaras dgn guard
      // di clinic.ts — DISPOSISI hanya sah di fase disposisi, walau diagnosis
      // sudah ada (mis. baru KOMIT_DIAGNOSIS, belum LANJUT_FASE dari terapi).
      if (enc.fase !== 'disposisi') {
        return err(s, `Selesaikan tahap terapi dulu — pasien ini masih di tahap ${enc.fase}.`)
      }
      const kasusDasar = pack.kasus[enc.pasien.kasusId]
      if (!kasusDasar) return err(s, `Kasus ${enc.pasien.kasusId} tidak ditemukan.`)
      // M11 #4 Tingkat A: terapkan varian kosmetik pasien ini (kasusEfektif
      // adalah identitas bila pasien tak punya varianId — nol biaya).
      const kasus = kasusEfektif(kasusDasar, enc.pasien.varianId)

      const encFinal = {
        ...enc,
        disposisi: action.jenis,
        ...(action.sbar ? { sbar: action.sbar } : {}),
        ...(action.justifikasiRujuk ? { justifikasiRujuk: action.justifikasiRujuk } : {}),
      }
      const nilai = nilaiEncounter(encFinal, kasus, pack)
      const events: GameEvent[] = [
        { type: 'STEMPEL', jenis: action.jenis === 'rujuk' ? 'rujuk' : 'pulang' },
        { type: 'ENCOUNTER_SELESAI', penilaian: nilai },
      ]

      // Tally
      const t = { ...s.tally }
      t.totalPasien += 1
      if (nilai.diagnosisBenar) t.diagnosisBenar += 1
      // Akurasi kode dan kalibrasi kepastian adalah dua sasaran berbeda.
      const kalibrasiSesuai =
        nilai.diagnosisBenar && nilai.kepastianDiagnosisSesuai !== false
      if (nilai.jenisDiagnosis === 'tegak') {
        if (kalibrasiSesuai) t.tegakBenar += 1
        else t.tegakSalah += 1
      } else {
        if (kalibrasiSesuai) t.suspekBenar += 1
        else t.suspekSalah += 1
      }
      if (action.jenis === 'rujuk') {
        t.rujukanTotal += 1
        if (nilai.rujukanNonSpesialistik) t.rujukanNonSpesialistik += 1
      }
      if (nilai.cowboy) t.cowboy += 1
      if (nilai.antibiotikTanpaIndikasi) t.antibiotikTanpaIndikasi += 1
      // CODEX audit (2026-07-12, temuan #1/#13B): dulu obatBerbahaya/
      // firewallTerpicu tak punya field di PenilaianEncounter sama sekali —
      // tally (dan lewat itu skor.total formal) tak bisa membacanya. Kini
      // ditally persis pola cowboy/antibiotikTanpaIndikasi di atas.
      if (nilai.obatBerbahaya) t.obatBerbahaya += 1
      if (nilai.tindakanBerbahaya) t.tindakanBerbahaya += 1
      if (nilai.firewallTerpicu) t.firewallTerpicu += 1
      if (nilai.stabilisasiTerlewat) t.stabilisasiTerlewat += 1
      t.labTakRelevan += nilai.labTakRelevan
      t.sumSkorProses += nilai.terapiDinilai === false
        ? (nilai.skorAnamnesis + nilai.skorPemeriksaan + nilai.skorEdukasi) / 3
        : (nilai.skorAnamnesis + nilai.skorPemeriksaan + nilai.skorTerapi + nilai.skorEdukasi) / 4

      // Ekonomi obat (M10 Batch-2, CODEX B.4): kas keluar utk obat terjadi di
      // PENGADAAN (PESAN_OBAT memotong kapitasi + belanjaPengadaan). Dulu
      // penyerahan ke pasien BPJS memotong hargaBeli LAGI → biaya dobel utk
      // satu unit obat yang sama. Kini: dispense dari STOK = nol kas (biayanya
      // sudah dibayar saat pengadaan); dispense saat stok HABIS = beli darurat
      // di luar (tetap −hargaBeli — backstop anti-eksploit krn meresepkan tak
      // digerbang stok, sekaligus realistis: obat kosong tetap harus diadakan).
      // Pasien umum tetap membayar hargaJual (retribusi masuk kas).
      let kapitasi = s.kapitasi
      const stokBaru = { ...s.gudang.stok }
      let belanjaObat = s.keuanganBulan.belanjaObat
      for (const obatId of encFinal.resep) {
        const o = pack.obat[obatId]
        if (!o) continue
        const adaStok = (stokBaru[obatId] ?? 0) > 0
        if (encFinal.pasien.bpjs) {
          if (!adaStok) {
            kapitasi -= o.hargaBeli
            belanjaObat += o.hargaBeli // buku kas: hanya pembelian darurat
          }
        } else {
          kapitasi += o.hargaJual
          // Bug hunt 2026-08-01: cabang BPJS di atas mencatat pembelian darurat
          // ke belanjaObat ("buku kas: hanya pembelian darurat"), tapi cabang
          // umum ini dulu cuma memotong kapitasi tanpa ikut mencatatnya —
          // laporan bulanan (baris 3263-an) jadi understate belanja darurat
          // riil tiap kali pasien umum (bukan BPJS) memicu stok kosong.
          if (!adaStok) {
            kapitasi -= o.hargaBeli // umum pun butuh unit fisik
            belanjaObat += o.hargaBeli
          }
        }
        if (stokBaru[obatId] !== undefined) stokBaru[obatId] = Math.max(0, stokBaru[obatId]! - 1)
      }
      // CODEX (2026-07-05): prosedur/tindakan klinis (nebulisasi, Epley, dst.)
      // punya `biaya` di katalog sejak jadi mekanik ternilai (CODEX ronde-10),
      // tapi sebelum ini tak pernah dipotong dari kapitasi — gratis/tak
      // terlihat di kas walau sudah membebani skor terapi. Katalog tindakan
      // cuma py SATU field biaya (beda dari obat yg beli/jual terpisah) —
      // BPJS membebani kapitasi Puskesmas, umum bayar retribusi (pola sama).
      for (const tindakanId of encFinal.tindakan) {
        const td = pack.tindakan[tindakanId]
        if (!td) continue
        kapitasi += encFinal.pasien.bpjs ? -td.biaya : td.biaya
      }
      // M4.20 — rekam medis lengkap (bahan akreditasi D60): semua fase SOAP ≥50.
      // M10.5 Q3 (2026-07-12): topik edukasiKritis terlewat TAK BOLEH lolos jadi
      // "RM lengkap" walau skorEdukasi≥50 (cap 50 dari clinic.ts kebetulan pas
      // di ambang) — kelalaian topik non-negotiable bukan rekam medis lengkap.
      const rmLengkap =
        nilai.skorAnamnesis >= 50 &&
        nilai.skorPemeriksaan >= 50 &&
        nilai.skorTerapi >= 50 &&
        nilai.skorEdukasi >= 50 &&
        nilai.edukasiKritisTerlewat.length === 0
      if (rmLengkap) t.rmLengkap += 1

      // Dex (Leitner-lite). "Menguasai" = diagnosis benar DAN disposisi tepat —
      // untuk kasus rujukan, kompetensinya memang "kenali & rujuk" (M3.13).
      //
      // CODEX audit pasca-GM (2026-07-13, temuan #3): kasus konfirmasiWajib
      // (TB/malaria) yang didiagnosis presumtif TANPA BTA/TCM/RDT tersedia
      // dulu tetap bisa "dikuasai" ★3 asal diagnosis&disposisi kebetulan benar
      // — Dex jadi sertifikasi diagnostik palsu utk mahasiswa yg tak pernah
      // benar-benar menunggu konfirmasi. KOMIT_DIAGNOSIS/TAMBAH_OBAT sendiri
      // TETAP tak diblokir (soal disiplin lab, bukan gerbang keras spt cowboy
      // wajib-rujuk) — hanya sinyal "kuasai" yang digerbang di sini.
      const dex = { ...s.dex }
      const lama = dex[kasus.id] ?? { kasusId: kasus.id, ditangani: 0, benar: 0, bintang: 0, terakhirHari: 0 }
      // Audit CODEX 2026-07-16 #1: "dikuasai" dulu hanya menuntut diagnosis +
      // disposisi + konfirmasi/stabilisasi/tindakan-aman — MENGABAIKAN
      // keselamatan resep & terapi penyelamat nyawa, jadi pemain bisa menebak
      // Dx+rujuk, memberi terapi berbahaya/melewatkan MgSO4, tetap dapat ★
      // koleksi. Kini sinyal "kuasai" juga menuntut: tak ada obat berbahaya/
      // kontraindikasi, tak ada antibiotik tanpa indikasi, firewall alergi tak
      // tertrigger, dan terapi kritis tak terlewat. Konsisten dgn capGrade.
      const kuasai =
        nilai.diagnosisBenar &&
        nilai.disposisiTepat &&
        !nilai.konfirmasiTakTerpenuhi &&
        !nilai.stabilisasiTerlewat &&
        !nilai.observasiTerlewat &&
        !nilai.terapiKritisTerlewat &&
        !nilai.tindakanBerbahaya &&
        !nilai.obatBerbahaya &&
        !nilai.antibiotikTanpaIndikasi &&
        !nilai.firewallTerpicu
      const bintang = kuasai ? Math.min(3, lama.bintang + 1) : Math.max(0, lama.bintang - 1)
      dex[kasus.id] = {
        ...lama,
        ditangani: lama.ditangani + 1,
        benar: lama.benar + (kuasai ? 1 : 0),
        bintang,
        terakhirHari: s.hari,
      }
      events.push({ type: 'DEX_BERTAMBAH', kasusId: kasus.id, bintang })

      // Konsekuensi klinis: pasien kembali memburuk bila (a) diagnosis salah,
      // (b) terapi buruk, (c) obat berbahaya diresepkan (obatSalahUmum), atau
      // (d) kasus wajib-rujuk justru ditahan (cowboy). Observasi sambil menunggu
      // hasil lab besok adalah keputusan interim yang SAH — tidak dihukum.
      let jadwal = s.jadwal
      let careEpisodes = s.careEpisodes
      const episodeId = episodeIdPasien(encFinal.pasien)
      const episodeExisting = careEpisodes.find((episode) => episode.id === episodeId)
      const sumberEpisode: SumberEpisode = episodeExisting?.source ?? (
        encFinal.pasien.prolanisPesertaId
          ? 'prolanis'
          : encFinal.pasien.prb
            ? 'rs'
            : encFinal.pasien.keluargaId
              ? 'keluarga'
              : 'klinik'
      )
      let penilaianFinal: PenilaianEncounter = nilai
      // Audit CODEX 2026-07-16 #4: dulu SEMUA obatSalahUmum (termasuk yang cuma
      // `nonPrimer`, mis. vitamin B kompleks/antibiotik tak perlu) memicu
      // "pasien kembali memburuk seolah terapi utama tak diberi" — kausalitas
      // palsu (~93 kasus rentan). Scoring sudah membedakan kontraindikasi vs
      // nonPrimer; konsekuensi kini ikut: HANYA `kontraindikasi` (bahaya nyawa
      // nyata, mis. NSAID pada dengue) yang memburukkan pasien. Default
      // (bahaya hilang) = nonPrimer → tidak memicu konsekuensi.
      // Bug hunt 2026-08-01: resepBerbahaya dulu HANYA membaca obatSalahUmum,
      // padahal clinic.ts (nilai.obatBerbahaya, Tier-1 #7) sudah menghitung
      // obat terlarang interaksi (mis. nitrat+PDE5-inhibitor → hipotensi berat/
      // kolaps) sbg berbahaya juga. Akibatnya nilai turun (obatBerbahaya=true)
      // tapi "pasien kembali memburuk" TIDAK terpicu — konsekuensi narasi lebih
      // ringan dari kontraindikasi obatSalahUmum biasa, padahal bahayanya SAMA
      // atau lebih nyata secara farmakologis. Disamakan dgn clinic.ts.
      const pasienKenaInteraksiObat =
        kasus.interaksiTrap !== undefined && encFinal.pasien.faktorRisiko.includes(kasus.interaksiTrap.faktor)
      const resepBerbahaya =
        (kasus.tatalaksana.obatSalahUmum ?? []).some(
          (o) => o.bahaya === 'kontraindikasi' && encFinal.resep.includes(o.id),
        ) ||
        (pasienKenaInteraksiObat && kasus.interaksiTrap
          ? kasus.interaksiTrap.obatTerlarang.some((id) => encFinal.resep.includes(id))
          : false)
      // WAJIB lab itu RELEVAN dgn kasus (DeepThink #1, sinkron dgn clinic.ts) —
      // tanpa ini "observasi" bisa dipakai sbg kedok memesan lab apa saja lalu
      // dikecualikan dari konsekuensi tanpa alasan klinis nyata.
      // Fix #3 (audit CODEX 2026-07-11): syarat ini TERTINGGAL saat clinic.ts
      // diperketat ke `bolehTundaTerapi` (fix #16) — dulu sama-sama pakai
      // `hasilBesok` generik. Akibatnya pasien Tifoid yg diobservasi tanpa
      // antibiotik (Widal: hasilBesok=true, TAPI bolehTundaTerapi TIDAK
      // di-set) sudah benar skorTerapi≈0 (fix #16 clinic.ts), tapi di sini
      // MASIH lolos dari konsekuensi perforasi — dua gerbang jadi tak
      // sinkron. Disamakan skarang: hanya lab ber-bolehTundaTerapi (BTA/TB)
      // yg mengecualikan dari konsekuensi negatif.
      // Fix #14 (audit CODEX 2026-07-11, adjudikasi 2026-07-12): dulu cuma
      // boolean — tak ada cara menyambungkan hasil lab yg SEDANG ditunggu ke
      // encounter pasien saat ia kembali besok (dua sistem terpisah total:
      // surat kotak-masuk vs encounter baru). `labMenunggu` menyimpan ID-nya
      // agar bisa dititipkan ke jadwal_evaluasi → dibawa ke encounter baru.
      const labMenunggu = encFinal.labDipesan.find((id) => {
        if (!pack.lab[id]?.bolehTundaTerapi) return false
        return kasus.lab.find((l) => l.id === id)?.relevan === true
      })
      const observasiMenungguLab = action.jenis === 'observasi' && labMenunggu !== undefined
      // Tambahan #2 (audit CODEX 2026-07-11, adjudikasi 2026-07-12): melewatkan
      // edukasiKritis DULU hanya memotong skorEdukasi (maks -5 poin, bobot
      // 10%), tak pernah memicu "pasien kembali memburuk" walau 16 kasus lintas
      // 7 file mengasumsikan itu. Menyamaratakan SEMUA 15 topik ke konsekuensi
      // penuh dinilai berlebihan (lupa 1-dari-4 topik edukasi TB vs restriksi
      // cairan gagal jantung tak sepadan severity-nya) — dibatasi HANYA
      // `minum_oat_tuntas` (risiko MDR-TB nyata bila putus obat), 13 topik lain
      // tetap cukup dihukum via skor spt sekarang.
      const pantasKonsekuensi =
        !nilai.diagnosisBenar || nilai.skorTerapi < 50 || resepBerbahaya || nilai.tindakanBerbahaya || nilai.cowboy ||
        nilai.terapiKritisTerlewat || nilai.observasiTerlewat ||
        nilai.edukasiKritisTerlewat.includes('minum_oat_tuntas')
      if (kasus.konsekuensi && pantasKonsekuensi && !observasiMenungguLab && action.jenis !== 'rujuk') {
        const rng = new Rng(s.seed, 'konsekuensi', s.hari, kasus.id)
        // Fix #14 (triase DeepThink 2026-07-11, terverifikasi ganda): satu-satunya
        // titik baca s.jadwal ada di hariBaru() (dipanggil pasca-transisi hari),
        // jadi kembaliHariMin:0 secara mekanis IDENTIK dgn kembaliHariMin:1 —
        // "hari ini juga" tak pernah bisa terealisasi. Math.max(1,...) menghapus
        // cabang mati yg menyesatkan TANPA mengubah hari kemunculan pasien mana
        // pun (murni logika, nol dampak observable — dikonfirmasi via audit+sanggahan).
        const jatuhTempo = s.hari + Math.max(1, rng.int(kasus.konsekuensi.kembaliHariMin, kasus.konsekuensi.kembaliHariMax))
        jadwal = [
          ...jadwal,
          {
            id: `jadwal_kembali_${s.hari}_${encFinal.pasien.id}`,
            hari: jatuhTempo,
            jenis: 'pasien_kembali',
            pasienId: encFinal.pasien.id,
            episodeId,
            kasusId: kasus.id,
            catatan: `${encFinal.pasien.nama} — ${kasus.konsekuensi.kondisiKembali}`,
            nama: encFinal.pasien.nama,
            usia: encFinal.pasien.usia,
            ...(encFinal.pasien.usiaBulan !== undefined ? { usiaBulan: encFinal.pasien.usiaBulan } : {}),
            jenisKelamin: encFinal.pasien.jenisKelamin,
            rw: encFinal.pasien.rw,
            // M10.b §43: bawa bpjs+persona — orang yg sama tak boleh berganti
            // status pembiayaan/suara saat kembali (dulu di-roll ulang).
            bpjs: encFinal.pasien.bpjs,
            persona: encFinal.pasien.persona,
            ...(encFinal.pasien.keluargaId ? { keluargaId: encFinal.pasien.keluargaId } : {}),
            ...(encFinal.pasien.prolanisPesertaId ? { prolanisPesertaId: encFinal.pasien.prolanisPesertaId } : {}),
          },
        ]
        penilaianFinal = { ...nilai, konsekuensiDijadwalkan: true }
      } else if (observasiMenungguLab) {
        // DeepThink #1 (celah alur fatal): observasi-menunggu-lab sengaja
        // dikecualikan dari konsekuensi (benar — itu keputusan interim yang
        // sah), TAPI sebelumnya juga tak pernah dijadwalkan kembali SAMA
        // SEKALI — hasil lab tiba di kotak masuk besok, pasiennya sendiri
        // lenyap dari semesta game selamanya. Jadwalkan kembali BESOK PAGI
        // pasti (bukan rentang kembaliHariMin/Max — itu utk memburuk, ini
        // netral) utk evaluasi hasil, reuse flag/pesan debrief yang sama.
        jadwal = [
          ...jadwal,
          {
            id: `jadwal_evaluasi_${s.hari}_${encFinal.pasien.id}`,
            hari: s.hari + 1,
            jenis: 'pasien_kembali',
            pasienId: encFinal.pasien.id,
            episodeId,
            kasusId: kasus.id,
            catatan: `${encFinal.pasien.nama} — kembali untuk evaluasi hasil lab kemarin.`,
            nama: encFinal.pasien.nama,
            usia: encFinal.pasien.usia,
            ...(encFinal.pasien.usiaBulan !== undefined ? { usiaBulan: encFinal.pasien.usiaBulan } : {}),
            jenisKelamin: encFinal.pasien.jenisKelamin,
            rw: encFinal.pasien.rw,
            bpjs: encFinal.pasien.bpjs,
            persona: encFinal.pasien.persona,
            ...(encFinal.pasien.keluargaId ? { keluargaId: encFinal.pasien.keluargaId } : {}),
            ...(encFinal.pasien.prolanisPesertaId ? { prolanisPesertaId: encFinal.pasien.prolanisPesertaId } : {}),
            // Fix #14: titipkan labId yg ditunggu — dibawa ke encounter baru
            // besok lewat pasienKembali/antrianKembali (bawah), bukan lenyap
            // ke surat kotak-masuk yg terputus dari mekanisme encounter.
            ...(labMenunggu ? { labId: labMenunggu } : {}),
          },
        ]
        penilaianFinal = { ...nilai, konsekuensiDijadwalkan: true }
      }

      const lacakEpisode =
        action.jenis === 'rujuk' ||
        penilaianFinal.konsekuensiDijadwalkan ||
        kasusMenular(kasus) ||
        encFinal.pasien.keluargaId !== undefined ||
        encFinal.pasien.prolanisPesertaId !== undefined ||
        encFinal.pasien.followUpDari !== undefined ||
        encFinal.pasien.prb === true ||
        encFinal.pasien.episodeId !== undefined
      const episodeCommon = {
        id: episodeId,
        day: s.hari,
        subjectId: encFinal.pasien.id,
        subjectName: encFinal.pasien.nama,
        ...(encFinal.pasien.keluargaId ? { familyId: encFinal.pasien.keluargaId } : {}),
        rw: encFinal.pasien.rw,
        source: sumberEpisode,
        problemId: episodeExisting?.problemId ?? kasus.id,
        problemLabel: episodeExisting?.problemLabel ?? kasus.nama,
        signal: episodeExisting?.receipt.signal ?? encFinal.pasien.followUpDari ?? kasus.keluhanUtama,
      } as const
      if (lacakEpisode) {
        const jadwalEpisode = jadwal.find((item) => item.episodeId === episodeId)
        const statusAwal = action.jenis === 'rujuk'
          ? 'dirujuk' as const
          : penilaianFinal.konsekuensiDijadwalkan
            ? 'menunggu' as const
            : encFinal.pasien.prb && penilaianFinal.grade === 'A'
              ? 'terverifikasi' as const
              : kasusMenular(kasus) && penilaianFinal.grade === 'A'
                ? 'terverifikasi' as const
                : 'ditindaklanjuti' as const
        const nextAction = action.jenis === 'rujuk'
          ? 'Tunggu penerimaan jejaring dan pastikan umpan balik kembali ke FKTP.'
          : penilaianFinal.konsekuensiDijadwalkan
            ? `Evaluasi ulang saat pasien kembali${jadwalEpisode ? ` pada hari ${jadwalEpisode.hari}` : ''}.`
            : encFinal.pasien.prb && penilaianFinal.grade === 'A'
              ? 'Lanjutkan rencana PRB dan pemantauan penyakit kronis di FKTP.'
              : kasusMenular(kasus) && penilaianFinal.grade === 'A'
                ? 'Diagnosis sudah masuk PWS; pantau pola RW dan respons bila terbentuk kluster.'
                : encFinal.pasien.keluargaId
                  ? 'Kembalikan hasil klinik ke rencana kunjungan keluarga.'
                  : 'Lanjutkan pemantauan sesuai rencana klinis.'
        careEpisodes = perbaruiEpisode(careEpisodes, {
          ...episodeCommon,
          owner: action.jenis === 'rujuk' ? 'rs' : kasusMenular(kasus) ? 'program' : 'dokter',
          status: statusAwal,
          decision: `${nilai.diagnosisBenar ? 'Diagnosis tepat' : 'Diagnosis belum tepat'}; disposisi ${action.jenis}; grade ${penilaianFinal.grade}.`,
          feedback: kasusMenular(kasus) && penilaianFinal.grade === 'A'
            ? `Sinyal ${kasus.nama} dikirim dari poli ke surveilans RW ${encFinal.pasien.rw}.`
            : encFinal.pasien.prb && penilaianFinal.grade === 'A'
              ? 'Rencana rujuk balik sudah ditindaklanjuti di FKTP.'
              : penilaianFinal.konsekuensiDijadwalkan
                ? 'Masalah belum tertutup; evaluasi ulang sudah dijadwalkan.'
                : 'Hasil encounter dicatat untuk tindak lanjut lintas layanan.',
          nextAction,
          dueDay: statusAwal === 'terverifikasi' ? null : (jadwalEpisode?.hari ?? s.hari + 1),
          ...(action.jenis === 'rujuk' ? { referral: { stage: 'sent' as const } } : {}),
          eventLabel: action.jenis === 'rujuk' ? 'Rujukan dikirim' : 'Encounter ditulis ke episode',
          eventDetail: `${kasus.nama}: grade ${penilaianFinal.grade}, disposisi ${action.jenis}.`,
        })
      }

      // ---------------------------------------------------------------------
      // SISRUTE — rujukan berjenjang (M3.13). Nasib rujukan diputus jejaring:
      //  · kasus FKTP (bukan wajib-rujuk) → RS MENOLAK, pasien kembali besok
      //    ("tuntaskan di FKTP") — over-refer berbalik jadi bebanmu sendiri;
      //  · wajib-rujuk + RS tepat + bed ada → DITERIMA → PRB terjadwal 7-12 hari;
      //  · salah spesialisasi / bed penuh → DITOLAK, rujuk ulang besok.
      // ---------------------------------------------------------------------
      let suratSisrute: Surat | undefined
      if (action.jenis === 'rujuk') {
        const kandidatRs = action.rumahSakitId
          ? pack.rumahSakit.find((r) => r.id === action.rumahSakitId)
          : [...pack.rumahSakit]
              .filter((r) => !kasus.spesialisRujukan || r.spesialisasi.includes(kasus.spesialisRujukan))
              .sort((a, b) => a.jarakMenit - b.jarakMenit)[0]
        const rs = kandidatRs ?? pack.rumahSakit[0]

        if (rs) {
          const rngRs = new Rng(s.seed, 'sisrute', s.hari, rs.id, encFinal.pasien.id)
          const spesialisCocok =
            !kasus.spesialisRujukan || rs.spesialisasi.includes(kasus.spesialisRujukan)
          const bedTersedia = rngRs.chance(Math.min(0.95, 0.5 + rs.bedDasar * 0.06))
          const kaitKeluargaSurat =
            encFinal.pasien.keluargaId && pack.keluarga[encFinal.pasien.keluargaId]
              ? { kaitKeluargaId: encFinal.pasien.keluargaId }
              : {}


          // CODEX audit (2026-07-12, temuan #4): dulu `!kasus.harusDirujuk`
          // saja — mengabaikan `nilai.rujukanNonSpesialistik` (yg sudah
          // memperhitungkan justifikasi §3a valid). Rujukan yg justru
          // TERJUSTIFIKASI (mis. komplikasi nyata) tetap ditolak SISRUTE,
          // didemaster Dex, dan dikirimi surat teguran RRNS yg keliru.
          // Reuse nilai yg sudah dihitung clinic.ts, bukan re-derive di sini.
          if ((!kasus.harusDirujuk && nilai.rujukanNonSpesialistik) || encFinal.pasien.prb) {
            // Ditolak: kompetensi FKTP. Pasien dipulangkan RS, kembali besok.
            t.rujukanDitolak += 1
            jadwal = [
              ...jadwal,
              {
                id: `jadwal_boomerang_${s.hari}_${encFinal.pasien.id}`,
                hari: s.hari + 1,
                jenis: 'pasien_kembali',
                pasienId: encFinal.pasien.id,
                episodeId,
                kasusId: kasus.id,
                catatan: `${encFinal.pasien.nama} — dikembalikan ${rs.nama}: kasus kompetensi FKTP, mohon dituntaskan di Puskesmas`,
                nama: encFinal.pasien.nama,
                usia: encFinal.pasien.usia,
                ...(encFinal.pasien.usiaBulan !== undefined ? { usiaBulan: encFinal.pasien.usiaBulan } : {}),
                jenisKelamin: encFinal.pasien.jenisKelamin,
                rw: encFinal.pasien.rw,
                // M10.b §43: identitas utuh (bpjs/persona) + keluargaId yg
                // dulu HILANG di 4 situs SISRUTE (putus tautan binaan).
                bpjs: encFinal.pasien.bpjs,
                persona: encFinal.pasien.persona,
                ...(encFinal.pasien.keluargaId ? { keluargaId: encFinal.pasien.keluargaId } : {}),
                ...(encFinal.pasien.prolanisPesertaId ? { prolanisPesertaId: encFinal.pasien.prolanisPesertaId } : {}),
              },
            ]
            suratSisrute = {
              id: `surat_sisrute_${s.hari}_${s.log.length}`,
              hari: s.hari,
              jenis: 'teguran_kapus',
              dari: rs.nama,
              judul: `Rujukan DITOLAK — ${encFinal.pasien.nama}`,
              isi: `Balasan SISRUTE: pasien dengan ${kasus.nama} adalah kompetensi FKTP (SKDI ${kasus.skdi}). Pasien kami pulangkan; mohon dituntaskan di Puskesmas. Rasio rujukan non-spesialistik Anda tercatat oleh BPJS — ia akan datang lagi besok pagi, dan kali ini tetap tanggung jawabmu.`,
              dibaca: false,
              ...kaitKeluargaSurat,
            }
            if (lacakEpisode) {
              careEpisodes = perbaruiEpisode(careEpisodes, {
                ...episodeCommon,
                owner: 'dokter',
                status: 'kembali',
                feedback: `${rs.nama} menolak rujukan non-spesialistik; pasien dikembalikan ke FKTP.`,
                nextAction: `Tuntaskan ${kasus.nama} di poli pada hari ${s.hari + 1}.`,
                dueDay: s.hari + 1,
                referral: { stage: 'feedback', hospitalName: rs.nama, note: 'Kompetensi FKTP' },
                eventLabel: 'Rujukan dikembalikan ke FKTP',
                eventDetail: `${rs.nama} menilai kasus ini dapat dituntaskan di layanan primer.`,
              })
            }
          } else if (!spesialisCocok) {
            t.rujukanDitolak += 1
            jadwal = [
              ...jadwal,
              {
                id: `jadwal_tolakspes_${s.hari}_${encFinal.pasien.id}`,
                hari: s.hari + 1,
                jenis: 'pasien_kembali',
                pasienId: encFinal.pasien.id,
                episodeId,
                kasusId: kasus.id,
                catatan: `${encFinal.pasien.nama} — ${rs.nama} tak punya layanan ${kasus.spesialisRujukan?.replace(/_/g, ' ')}; rujuk ulang ke RS yang tepat`,
                nama: encFinal.pasien.nama,
                usia: encFinal.pasien.usia,
                ...(encFinal.pasien.usiaBulan !== undefined ? { usiaBulan: encFinal.pasien.usiaBulan } : {}),
                jenisKelamin: encFinal.pasien.jenisKelamin,
                rw: encFinal.pasien.rw,
                bpjs: encFinal.pasien.bpjs,
                persona: encFinal.pasien.persona,
                ...(encFinal.pasien.keluargaId ? { keluargaId: encFinal.pasien.keluargaId } : {}),
                ...(encFinal.pasien.prolanisPesertaId ? { prolanisPesertaId: encFinal.pasien.prolanisPesertaId } : {}),
              },
            ]
            suratSisrute = {
              id: `surat_sisrute_${s.hari}_${s.log.length}`,
              hari: s.hari,
              jenis: 'kabar_warga',
              dari: rs.nama,
              judul: `Rujukan tertahan — spesialisasi tidak tersedia`,
              isi: `Balasan SISRUTE: kami tidak memiliki layanan ${kasus.spesialisRujukan?.replace(/_/g, ' ')} untuk ${kasus.nama}. Pasien kembali besok — pilih RS tujuan yang menyediakan spesialisasi itu (periksa jejaring SISRUTE sebelum mengirim).`,
              dibaca: false,
              ...kaitKeluargaSurat,
            }
            if (lacakEpisode) {
              careEpisodes = perbaruiEpisode(careEpisodes, {
                ...episodeCommon,
                owner: 'dokter',
                status: 'kembali',
                feedback: `${rs.nama} tidak memiliki layanan ${kasus.spesialisRujukan?.replace(/_/g, ' ')} yang dibutuhkan.`,
                nextAction: `Rujuk ulang ke tujuan yang tepat pada hari ${s.hari + 1}.`,
                dueDay: s.hari + 1,
                referral: { stage: 'feedback', hospitalName: rs.nama, note: 'Tujuan tidak sesuai' },
                eventLabel: 'Tujuan rujukan perlu diperbaiki',
                eventDetail: `${rs.nama} tidak mempunyai spesialisasi yang diperlukan.`,
              })
            }
          } else {
            // CODEX audit (2026-07-12, temuan #9): keputusan MERUJUK di titik
            // ini SUDAH benar secara klinis (lolos gerbang harusDirujuk +
            // spesialisCocok di atas) — bed RNG (`rngRs` di atas `s.seed`,
            // sengaja personal/anti-hafalan sesuai M45_MODE_UJIAN.md §2) TAK
            // BOLEH lagi menentukan rujukanTepat/rujukanDitolak: dua siswa dgn
            // keputusan identik bisa dpt skor formal beda (65.0 vs 64.5,
            // diverifikasi reproduksi) murni dari keberuntungan bed. Confidence-
            // tag kini murni fungsi ketepatan klinis, independen dari
            // bedTersedia — bed penuh cuma menunda narasi, tak menghukum tally.
            if (nilai.diagnosisBenar) t.rujukanTepat += 1

            if (!bedTersedia) {
              // CODEX audit pasca-GM (2026-07-13, temuan #11): dulu jadwal
              // 'pasien_kembali' generik — pasien ini muncul LAGI di antrian
              // esok hari sbg encounter PENUH (anamnesis→disposisi ulang),
              // mengkredit totalPasien/rujukanTepat/rmLengkap/Dex KEDUA
              // kalinya utk keputusan klinis yang SAMA (sudah benar, sudah
              // ditally di atas). `bedRetry` menandai jadwal ini utk jalur
              // pasif (hariBaru re-roll bed sendiri, lihat blok jadwal) —
              // tak pernah masuk antrian klinik lagi.
              jadwal = [
                ...jadwal,
                {
                  id: `jadwal_tolakbed_${s.hari}_${encFinal.pasien.id}`,
                  hari: s.hari + 1,
                  jenis: 'pasien_kembali',
                  pasienId: encFinal.pasien.id,
                  episodeId,
                  kasusId: kasus.id,
                  catatan: `${encFinal.pasien.nama} — bed ${rs.nama} penuh; menunggu bed kosong`,
                  nama: encFinal.pasien.nama,
                  usia: encFinal.pasien.usia,
                  ...(encFinal.pasien.usiaBulan !== undefined ? { usiaBulan: encFinal.pasien.usiaBulan } : {}),
                  jenisKelamin: encFinal.pasien.jenisKelamin,
                  rw: encFinal.pasien.rw,
                  bpjs: encFinal.pasien.bpjs,
                  persona: encFinal.pasien.persona,
                  ...(encFinal.pasien.keluargaId ? { keluargaId: encFinal.pasien.keluargaId } : {}),
                  ...(encFinal.pasien.prolanisPesertaId ? { prolanisPesertaId: encFinal.pasien.prolanisPesertaId } : {}),
                  bedRetry: true,
                  rumahSakitId: rs.id,
                  bedRetryKe: 0,
                },
              ]
              suratSisrute = {
                id: `surat_sisrute_${s.hari}_${s.log.length}`,
                hari: s.hari,
                jenis: 'kabar_warga',
                dari: rs.nama,
                judul: `Bed penuh — rujukan ${encFinal.pasien.nama} tertunda`,
                isi: `Balasan SISRUTE: seluruh bed ${rs.nama} terisi hari ini. Keputusan merujukmu sudah tepat — ini murni soal kapasitas jejaring, bukan penilaian atas keputusanmu. Jejaring akan mencoba lagi begitu bed kosong; kamu tak perlu menangani pasien ini ulang.`,
                dibaca: false,
                ...kaitKeluargaSurat,
              }
              if (lacakEpisode) {
                careEpisodes = perbaruiEpisode(careEpisodes, {
                  ...episodeCommon,
                  owner: 'rs',
                  status: 'menunggu',
                  feedback: `Keputusan klinis tepat, tetapi bed ${rs.nama} sedang penuh.`,
                  nextAction: 'Jejaring mencoba kapasitas kembali besok; jangan mengulang encounter yang sama.',
                  dueDay: s.hari + 1,
                  referral: { stage: 'sent', hospitalName: rs.nama, note: 'Menunggu bed' },
                  eventLabel: 'Rujukan menunggu kapasitas',
                  eventDetail: `Bed ${rs.nama} penuh; retry pasif dijadwalkan.`,
                })
              }
            } else {
              // DITERIMA oleh jejaring.
              // Fix CODEX-25 #4: PRB (rujuk balik) HANYA utk kasus KRONIS-STABIL
              // eligible (`bisaPrb`, 9 kelompok Perpres JKN) — dulu SEMUA rujukan
              // diterima dijadwalkan kembali sbg PRB, jadi apendisitis/preeklampsia/
              // pneumonia akut pun "kontrol PRB" 7-12 hari kemudian (keliru: pasien
              // akut dikelola tuntas di RS, tak jadi pasien PRB). Kasus akut kini
              // tak menjadwalkan kembali sama sekali.
              if (kasus.bisaPrb === true) {
                const rngPrb = new Rng(s.seed, 'prb', s.hari, encFinal.pasien.id)
                jadwal = [
                  ...jadwal,
                  {
                    id: `jadwal_prb_${s.hari}_${encFinal.pasien.id}`,
                    hari: s.hari + rngPrb.int(7, 12),
                    jenis: 'pasien_kembali',
                    pasienId: encFinal.pasien.id,
                    episodeId,
                    kasusId: kasus.id,
                    catatan: `${encFinal.pasien.nama} — kontrol PRB: pulang dari ${rs.nama} dengan surat rujuk balik, lanjutkan terapi di FKTP`,
                    nama: encFinal.pasien.nama,
                    usia: encFinal.pasien.usia,
                    ...(encFinal.pasien.usiaBulan !== undefined ? { usiaBulan: encFinal.pasien.usiaBulan } : {}),
                    jenisKelamin: encFinal.pasien.jenisKelamin,
                    rw: encFinal.pasien.rw,
                    bpjs: encFinal.pasien.bpjs,
                    persona: encFinal.pasien.persona,
                    ...(encFinal.pasien.keluargaId ? { keluargaId: encFinal.pasien.keluargaId } : {}),
                    ...(encFinal.pasien.prolanisPesertaId ? { prolanisPesertaId: encFinal.pasien.prolanisPesertaId } : {}),
                    prb: true,
                  },
                ]
              } else {
                const rngFeedback = new Rng(s.seed, 'rujukan-feedback', s.hari, encFinal.pasien.id)
                jadwal = [
                  ...jadwal,
                  {
                    id: `jadwal_feedback_${s.hari}_${encFinal.pasien.id}`,
                    hari: s.hari + rngFeedback.int(2, 4),
                    jenis: 'rujukan_feedback',
                    pasienId: encFinal.pasien.id,
                    episodeId,
                    kasusId: kasus.id,
                    nama: encFinal.pasien.nama,
                    rumahSakitId: rs.id,
                    ...(encFinal.pasien.keluargaId ? { keluargaId: encFinal.pasien.keluargaId } : {}),
                    feedbackRujukan: `${rs.nama} menyelesaikan pelayanan ${kasus.nama} dan mengirim ringkasan kembali ke FKTP.`,
                  },
                ]
              }
              suratSisrute = {
                id: `surat_sisrute_${s.hari}_${s.log.length}`,
                hari: s.hari,
                jenis: 'pujian_kapus',
                dari: rs.nama,
                judul: `Rujukan DITERIMA — ${encFinal.pasien.nama}`,
                isi: kasus.bisaPrb === true
                  ? `Balasan SISRUTE: pasien ${kasus.nama} kami terima di ${rs.nama}. Setelah stabil, ia akan dipulangkan dengan surat rujuk balik (PRB) — kontrol lanjutannya kembali menjadi tanggung jawab FKTP-mu. Rujukan berjenjang bekerja dua arah.`
                  : `Balasan SISRUTE: pasien ${kasus.nama} kami terima di ${rs.nama}. Setelah pelayanan selesai, ringkasan hasil akan dikirim kembali ke FKTP; rujukan belum tertutup hanya karena pasien sudah dikirim.`,
                dibaca: false,
                ...kaitKeluargaSurat,
              }
              if (lacakEpisode) {
                const jadwalLanjutan = [...jadwal].reverse().find((item) => item.episodeId === episodeId)
                careEpisodes = perbaruiEpisode(careEpisodes, {
                  ...episodeCommon,
                  owner: 'rs',
                  status: 'dirujuk',
                  feedback: `${encFinal.pasien.nama} diterima ${rs.nama}; keputusan klinis dipisahkan dari keberuntungan kapasitas.`,
                  nextAction: kasus.bisaPrb === true
                    ? `Tunggu resume dan kontrol PRB sekitar hari ${jadwalLanjutan?.hari ?? s.hari + 7}.`
                    : `Tunggu ringkasan pelayanan sekitar hari ${jadwalLanjutan?.hari ?? s.hari + 2}.`,
                  dueDay: jadwalLanjutan?.hari ?? s.hari + 2,
                  referral: { stage: 'accepted', hospitalName: rs.nama },
                  eventLabel: 'Rujukan diterima jejaring',
                  eventDetail: `${rs.nama} menerima pasien untuk ${kasus.nama}.`,
                })
              }
            }
          }
          events.push({ type: 'SURAT_MASUK', surat: suratSisrute })
        }
      }

      // Surveilans balik UKP→UKM (M1.2): diagnosis menular tercatat per RW —
      // pola di poli menyalakan sinyal di peta.
      // Fix CODEX-25 #18 (2026-07-12): dulu mencatat `kasus.id` (GROUND TRUTH)
      // "apa pun disposisinya" — termasuk saat pemain SALAH diagnosis. Peta lalu
      // menampilkan nama penyakit SEBENARNYA (⚠ KLUSTER X) → membocorkan jawaban
      // sebelum pemain menegakkannya sendiri. Kini hanya deteksi BENAR yang
      // menyalakan surveilans (realistis: PWS dibangun dari laporan diagnosis
      // yang tepat; wabah tak terdeteksi memang tak muncul di peta).
      // Bridge B1.3: karma yang SUDAH terjadi tidak dianggap tercegah,
      // tetapi penanganan klinis A atas pasien karma membuka jalur
      // pemulihan keluarga. Provenance eksplisit mencegah follow-up biasa,
      // PRB, atau boomerang SISRUTE memulihkan krisis yang bukan asalnya.
      let keluargaSetelahKlinik = s.desa.keluarga
      let suratPemulihanKeluarga: Surat | undefined
      const keluargaIdKarma = encFinal.pasien.keluargaId
      if (
        encFinal.pasien.konsekuensiKarma === true &&
        keluargaIdKarma &&
        penilaianFinal.grade === 'A'
      ) {
        const kel = s.desa.keluarga[keluargaIdKarma]
        const kelContent = pack.keluarga[keluargaIdKarma]
        const arcAktif = kelContent
          ? arcKunjunganAktif(pack, kelContent, s.mode, s.contentRelease)
          : []
        const cocokDenganKarma = arcAktif.some(
          (skenario) => skenario.karma?.kasusId === kasus.id,
        )
        if (
          kel &&
          kelContent &&
          kel.arcSelesai === 'gagal' &&
          cocokDenganKarma &&
          arcAktif.length > 0
        ) {
          const { arcSelesai: _gagal, ...kelTanpaGagal } = kel
          keluargaSetelahKlinik = {
            ...s.desa.keluarga,
            [keluargaIdKarma]: {
              ...kelTanpaGagal,
              // Klinik menangani krisis akut, bukan menyelesaikan akar UKM.
              // Pertahankan beat yang belum berhasil agar tetap harus dimainkan.
              arcIndex: Math.min(kel.arcIndex, arcAktif.length - 1),
              followUpHari: s.hari + 1,
              pemulihanEpisodeId: episodeCommon.id,
            },
          }
          suratPemulihanKeluarga = {
            id: `surat_pemulihan_${s.hari}_${keluargaIdKarma}`,
            hari: s.hari,
            jenis: 'kabar_warga',
            dari: 'Perawat poli',
            judul: `Krisis akut tertangani - ${kelContent.namaKeluarga}`,
            isi:
              `${encFinal.pasien.nama} sudah tertangani dengan baik di Puskesmas. ` +
              'Krisis akutnya mereda, tetapi akar risiko di rumah belum selesai. ' +
              'Jalur kunjungan keluarga dibuka kembali mulai besok untuk pemulihan dan pencegahan kekambuhan.',
            dibaca: false,
            kaitKeluargaId: keluargaIdKarma,
          }
          events.push({ type: 'SURAT_MASUK', surat: suratPemulihanKeluarga })
          careEpisodes = perbaruiEpisode(careEpisodes, {
            ...episodeCommon,
            owner: 'dokter',
            status: 'kembali',
            feedback: `${encFinal.pasien.nama} tertangani baik; krisis akut mereda, tetapi akar risiko rumah belum selesai.`,
            nextAction: `Kunjungi ${kelContent.namaKeluarga} mulai hari ${s.hari + 1} untuk pemulihan dan pencegahan kekambuhan.`,
            dueDay: s.hari + 1,
            eventLabel: 'Klinik membuka pemulihan keluarga',
            eventDetail: `Grade A mengatasi krisis ${kasus.nama}; beat keluarga dibuka kembali.`,
          })
        }
      }

      // Bridge B1.4: hasil klinik hanya menulis balik bila pasien benar-benar
      // berasal dari satu enrolmen Prolanis dan tata laksananya bermutu: grade A
      // memberi efek penuh, grade B memberi kredit parsial (setengah besaran
      // drift — S5-iks-prolanis 2026-08-01); di bawah B tetap nol, dan provenance
      // per-masalah mencegah HT dan DM milik orang yang sama tertukar.
      let prolanisSetelahKlinik = s.prolanis
      let suratTindakLanjutProlanis: Surat | undefined
      const pesertaIdProlanis = encFinal.pasien.prolanisPesertaId
      const kreditProlanisKlinik =
        penilaianFinal.grade === 'A' ? 1 : penilaianFinal.grade === 'B' ? 0.5 : 0
      if (pesertaIdProlanis && kreditProlanisKlinik > 0) {
        const peserta = s.prolanis.roster.find((p) => p.id === pesertaIdProlanis)
        if (peserta) {
          // Perawatan tepat memperbaiki parameter, tetapi tidak boleh memalsukan
          // status "terkontrol" bila hasilnya masih di atas ambang kanonik.
          const pesertaBaru = driftProlanis(
            peserta,
            true,
            new Rng(s.seed, 'prolanis-klinik', s.hari, peserta.id, encFinal.pasien.id),
            kreditProlanisKlinik,
          )
          prolanisSetelahKlinik = {
            ...s.prolanis,
            roster: s.prolanis.roster.map((p) => (p.id === peserta.id ? pesertaBaru : p)),
          }
          const satuan = peserta.jenis === 'ht' ? 'mmHg' : 'mg/dL'
          const label = peserta.jenis === 'ht' ? 'TD sistolik' : 'GDP'
          suratTindakLanjutProlanis = {
            id: `surat_prolanis_klinik_${s.hari}_${peserta.id}`,
            hari: s.hari,
            jenis: 'kabar_warga',
            dari: 'Koordinator Prolanis',
            judul: `Hasil klinik masuk Prolanis - ${peserta.nama}`,
            isi:
              `Penanganan klinis ${encFinal.pasien.nama} tercatat kembali ke masalah ${peserta.jenis.toUpperCase()}. ` +
              `${label} pemantauan bergerak dari ${peserta.param} menjadi ${pesertaBaru.param} ${satuan}; ` +
              (kreditProlanisKlinik < 1
                ? 'perbaikannya baru sebagian karena tata laksana belum sepenuhnya optimal — evaluasi lagi pada sesi berikutnya.'
                : 'evaluasi lagi pada sesi berikutnya.'),
            dibaca: false,
            ...(peserta.keluargaId ? { kaitKeluargaId: peserta.keluargaId } : {}),
          }
          events.push({ type: 'SURAT_MASUK', surat: suratTindakLanjutProlanis })
          const sudahTerkontrol = prolanisTerkendali(pesertaBaru.jenis, pesertaBaru.param)
          careEpisodes = perbaruiEpisode(careEpisodes, {
            ...episodeCommon,
            owner: sudahTerkontrol ? 'program' : 'dokter',
            status: sudahTerkontrol ? 'terverifikasi' : 'ditindaklanjuti',
            feedback: `${label} bergerak dari ${peserta.param} menjadi ${pesertaBaru.param} ${satuan}.`,
            nextAction: sudahTerkontrol
              ? 'Pertahankan terapi dan pantau pada sesi Prolanis berikutnya.'
              : `Evaluasi ulang ${label} pada sesi Prolanis berikutnya.`,
            dueDay: sudahTerkontrol ? null : s.hari + HARI_BUKA_PROLANIS[s.mode],
            eventLabel: 'Hasil klinik kembali ke Prolanis',
            eventDetail: `${label} ${pesertaBaru.param} ${satuan}; ${sudahTerkontrol ? 'terkendali' : 'belum terkendali'}.`,
          })
        }
      }

      const desaSetelahKlinik = keluargaSetelahKlinik === s.desa.keluarga
        ? s.desa
        : { ...s.desa, keluarga: keluargaSetelahKlinik }
      const desaBaru = kasusMenular(kasus) && nilai.diagnosisBenar
        ? {
            ...desaSetelahKlinik,
            surveilans: [
              ...desaSetelahKlinik.surveilans,
              { hari: s.hari, rw: encFinal.pasien.rw, kasusId: kasus.id },
            ],
          }
        : desaSetelahKlinik
      const suratBaruKlinik: Surat[] = [
        ...(suratSisrute ? [suratSisrute] : []),
        ...(suratPemulihanKeluarga ? [suratPemulihanKeluarga] : []),
        ...(suratTindakLanjutProlanis ? [suratTindakLanjutProlanis] : []),
      ]

      // Tutorial (DeepThink "onboarding railroaded", keputusan user): encounter
      // PERTAMA stase baru KEBAL skor sepenuhnya — semua agregat scoring
      // dikembalikan ke nilai SEBELUM encounter ini (bukan disunting parsial
      // di tengah blok di atas, supaya logika normal di atas tetap 100% utuh
      // & teruji; imun cukup satu titik di sini). Narasi tetap normal (patut
      // muncul di debrief) — hanya skor/ekonomi/jurnal konsekuensi yg dibekukan.
      // `tutorialAktif` SELALU dimatikan di sini (satu-kali, terlepas nilainya
      // sebelum ini) — titik keluar tunggal case DISPOSISI.
      const kebalTutorial = s.tutorialAktif
      const prototypeFormatif =
        kasus.activationStatus === 'lab_prototype_unadjudicated' &&
        kasus.reviewStatus !== 'physician_approved'
      const kebalDampak = kebalTutorial || prototypeFormatif
      const tallyFinal = kebalDampak ? s.tally : t
      const dexFinal = kebalDampak ? s.dex : dex
      const kapitasiFinal = kebalDampak ? s.kapitasi : kapitasi
      const stokFinal = kebalDampak ? s.gudang.stok : stokBaru
      const belanjaObatFinal = kebalDampak ? s.keuanganBulan.belanjaObat : belanjaObat
      const jadwalFinal = kebalDampak ? s.jadwal : jadwal
      const desaFinal = kebalDampak ? s.desa : desaBaru
      const prolanisFinal = kebalDampak ? s.prolanis : prolanisSetelahKlinik
      const careEpisodesFinal = kebalDampak ? s.careEpisodes : careEpisodes
      // CODEX: DEX_BERTAMBAH/SURAT_MASUK dipancarkan tanpa syarat di atas —
      // toaster (Toaster.tsx) akan bilang "Buku Saku diperbarui"/"Surat baru"
      // meski dex/inbox sungguhan dibekukan barusan. Pangkas KEDUA event itu
      // saat kebal (bukan cuma inbox-nya) — ENCOUNTER_SELESAI/STEMPEL tetap
      // lolos, itu narasi debrief yang memang harus tetap muncul.
      // CODEX (ronde lanjutan): tuntunan tutorial hanya menyorot jalur MINIMAL
      // (1 pertanyaan, 1 regio, tanpa edukasi) — skor SOAP mentah dari jalur
      // itu bisa jatuh ke grade D walau pemain 100% mengikuti sorotan. Tandai
      // `tutorialLatihan` di penilaian yg ditampilkan agar PanelHasil.tsx
      // menyembunyikan rincian skor yg menghukum, bukan mengubah skor itu
      // sendiri (tetap dihitung apa adanya, tetap dibekukan seperti biasa).
      const penilaianTampil: PenilaianEncounter = kebalTutorial
        ? { ...penilaianFinal, tutorialLatihan: true }
        : prototypeFormatif
          ? { ...penilaianFinal, formativePrototype: true }
          : penilaianFinal
      const eventsFinal = (
        kebalDampak
          ? events.filter((e) => e.type !== 'DEX_BERTAMBAH' && e.type !== 'SURAT_MASUK')
          : events
      ).map((e) => (e.type === 'ENCOUNTER_SELESAI' ? { ...e, penilaian: penilaianTampil } : e))

      return {
        state: {
          ...s,
          kapitasi: kapitasiFinal,
          gudang: { ...s.gudang, stok: stokFinal },
          keuanganBulan: { ...s.keuanganBulan, belanjaObat: belanjaObatFinal },
          tally: tallyFinal,
          dex: dexFinal,
          jadwal: jadwalFinal,
          desa: desaFinal,
          prolanis: prolanisFinal,
          careEpisodes: careEpisodesFinal,
          klinik: {
            ...s.klinik,
            aktif: undefined,
            // Latihan tutorial tidak masuk rekap karena merupakan onboarding.
            // Kasus formatif tetap tampil di rekap/debrief, tetapi field
            // `formativePrototype` membuat scoring mengeluarkannya dari grade.
            selesaiHariIni: kebalTutorial
              ? s.klinik.selesaiHariIni
              : [...s.klinik.selesaiHariIni, penilaianTampil],
          },
          ...(suratBaruKlinik.length > 0 && !kebalDampak
            ? { inbox: [...s.inbox, ...suratBaruKlinik] }
            : {}),
          tutorialAktif: false,
        },
        events: eventsFinal,
      }
    }

    /* -- UKM: roster ---------------------------------------------------------- */

    case 'PILIH_BINAAN': {
      if (s.desa.binaan.includes(action.keluargaId)) return err(s, 'Sudah jadi keluarga binaan.')
      if (s.desa.binaan.length >= MAKS_BINAAN) return err(s, `Roster binaan penuh (maks ${MAKS_BINAAN}).`)
      if (!s.desa.keluarga[action.keluargaId]) return err(s, 'Keluarga tidak dikenal.')
      return { state: { ...s, desa: { ...s.desa, binaan: [...s.desa.binaan, action.keluargaId] } }, events: [] }
    }

    case 'LEPAS_BINAAN': {
      return {
        state: { ...s, desa: { ...s.desa, binaan: s.desa.binaan.filter((id) => id !== action.keluargaId) } },
        events: [],
      }
    }

    /* -- UKM: kunjungan rumah --------------------------------------------------- */

    case 'MULAI_KUNJUNGAN': {
      if (s.hari < HARI_BUKA_KUNJUNGAN) return err(s, 'Kunjungan rumah terbuka di hari ke-3.')
      if (s.blok !== 'siang') return err(s, 'Kunjungan rumah dilakukan di blok siang.')
      if (s.kunjungan) return err(s, 'Sedang dalam kunjungan.')
      // Slot lapangan siang TUNGGAL: kunjungan ATAU kegiatan (posyandu/prolanis/
      // KLB), bukan keduanya. cekSlotKegiatan sudah benar mengecek keduanya; di
      // sini `lapanganTerpakai` (di-set kegiatan) sempat terlewat → kegiatan lalu
      // kunjungan lolos di siang yang sama (CODEX ronde-baru #1).
      if (s.lapanganTerpakai || s.hasilKunjunganHariIni)
        return err(s, 'Slot lapangan hari ini sudah terpakai.')
      // CODEX ronde-11 #2: fix di atas menutup jalur SETELAH kegiatan selesai,
      // tapi selama kegiatan MASIH BERJALAN `lapanganTerpakai` belum true (baru
      // di-set saat selesaikanKegiatan) — kunjungan bisa mulai SAMBIL kegiatan
      // aktif (kegiatan+kunjungan serentak). cekSlotKegiatan sudah cek ini utk
      // arah sebaliknya (`s.kegiatan || s.kunjungan`); simetrikan di sini.
      if (s.kegiatan) return err(s, 'Sedang ada kegiatan lapangan berjalan.')
      const kel = s.desa.keluarga[action.keluargaId]
      const kelContent = pack.keluarga[action.keluargaId]
      if (!kel || !kelContent) return err(s, 'Keluarga tidak dikenal.')
      // Fix #10 (audit CODEX 2026-07-11, adjudikasi 2026-07-12): dulu tak ada
      // gerbang roster di sini sama sekali — pemain bisa langsung kunjungi
      // keluarga MANAPUN & tuntaskan arc-nya (trust/indikator/badge penuh)
      // tanpa pernah memakai satu slot binaan pun, sementara drift (penalti
      // abai) HANYA berlaku ke keluarga ber-status binaan — insentifnya
      // terbalik (skip roster = bebas risiko). Roster kini jadi syarat
      // sungguhan utk kunjungan mana pun, bukan dekoratif.
      if (!s.desa.binaan.includes(action.keluargaId))
        return err(s, 'Keluarga ini belum jadi binaanmu — daftarkan dulu di peta desa sebelum berkunjung.')
      if (kel.arcSelesai === 'gagal')
        return err(s, 'Krisis sudah terjadi — dampingi pemulihan keluarga ini lewat klinik.')
      if (kel.arcSelesai === 'berhasil') return err(s, 'Pendampingan keluarga ini sudah tuntas.')
      if (kel.followUpHari !== undefined && s.hari < kel.followUpHari)
        return err(s, `Kunjungan berikutnya dijadwalkan hari ke-${kel.followUpHari}.`)
      // Audit CODEX UKM 2026-07-16 #1: indeks arc berjalan atas daftar
      // TERSARING mode-policy (arcKunjunganAktif) — dulu skenario Career-only
      // di tengah arc membuat arc buntu permanen di Ujian.
      const arcAktif = arcKunjunganAktif(pack, kelContent, s.mode, s.contentRelease)
      const skenario = arcAktif[kel.arcIndex]
      if (!skenario) return err(s, 'Tidak ada kunjungan lanjutan yang tersisa untuk keluarga ini.')
      const rwProfil = pack.rw.find((r) => r.nomor === kelContent.rw)
      const biaya = BIAYA_STAMINA_KUNJUNGAN[rwProfil?.jarak ?? 'sedang']
      if (s.stamina < biaya) return err(s, `Butuh ${biaya} stamina untuk perjalanan ke RW ${kelContent.rw}.`)
      // M11 #5 B1: varian dipilih dari stream personal s.seed (bukan
      // seedKurikulum) — Tingkat-A tak bisa mengubah ground-truth kunjungan,
      // jadi tak perlu adil lintas paket-mate Mode Ujian (sama alasan #4 UKP).
      const rngVarian = new Rng(s.seed, 'kunjungan-varian', s.hari, action.keluargaId)
      const aktifkanPenerimaanAwal =
        s.mode === 'karier' &&
        kel.jumlahKunjungan === 0 &&
        skenario.penerimaanAwal?.mode === 'karier'
      const kj = buatKunjungan(action.keluargaId, skenario, rngVarian, aktifkanPenerimaanAwal)
      return {
        state: { ...s, stamina: s.stamina - biaya, layar: 'kunjungan', kunjungan: kj },
        events: [],
      }
    }

    case 'KLIK_HOTSPOT':
    case 'PILIH_DIALOG':
    case 'KOMIT_HAMBATAN':
    case 'PILIH_INTERVENSI':
    case 'PILIH_INGATKAN':
    case 'RESPONS_PENERIMAAN':
    case 'LANJUT_BABAK': {
      const kj = s.kunjungan
      if (!kj) return err(s, 'Tidak sedang berkunjung.')
      const kelContent = pack.keluarga[kj.keluargaId]
      const kel = s.desa.keluarga[kj.keluargaId]
      if (!kelContent || !kel) return err(s, 'Keluarga tidak dikenal.')
      const skenarioDasar = kelContent.arc.kunjungan.find((x) => x.id === kj.skenarioId)
      if (!skenarioDasar) return err(s, 'Skenario kunjungan ini tidak ditemukan — tutup dan buka ulang Peta Desa.')
      const skenario = skenarioEfektif(skenarioDasar, kj.varianId)

      const hasilAksi = aksiKunjungan(kj, action, skenario, kel)
      let next: GameState = { ...s, kunjungan: hasilAksi.kj }
      const events = [...hasilAksi.events]

      if (hasilAksi.selesai) {
        let hasil = selesaikanKunjungan(hasilAksi.kj, skenario, kel)
        const kontakAwalSah = penutupanAwalSah(hasil.hasilAkhir)

        // SDOH armor (M1.6, port BehaviorCaseEngine): keluarga miskin/rentan
        // menahan pendekatan yang salah sasaran — kenaikan trust dipangkas
        // setengah bila hipotesis hambatan meleset. Diagnosis tepat menembus armor.
        const kenaArmor =
          (kelContent.ekonomi === 'miskin' || kelContent.ekonomi === 'rentan') &&
          !kontakAwalSah &&
          !hasil.hipotesisBenar &&
          hasil.trustDelta > 0
        if (kenaArmor) {
          hasil = { ...hasil, trustDelta: Math.floor(hasil.trustDelta / 2), armorAktif: true }
        }

        // #1: panjang arc = jumlah skenario AKTIF utk mode ini (bukan mentah)
        // — arc Gunawan di Ujian (K2 Career-only) tamat sah di K1.
        let kelBaru = terapkanHasil(
          kel, hasil, skenario, s.hari,
          arcKunjunganAktif(pack, kelContent, s.mode, s.contentRelease).length,
          s.mode,
        )

        // #4 outcome-window: bila arc baru saja tamat-berhasil, indikator target
        // kini ber-sumber 'janji' (di terapkanHasil) — jadwalkan verifikasi
        // outcome-nya. Deteksi dari state hasil (bukan flag internal): indikator
        // yang baru jadi 'janji' hari ini. Dokter yang kelak memverifikasi
        // langsung (kunjungan/hotspot) menimpanya jadi 'dokter' → verifikasi
        // terjadwal ini melewatinya.
        const indikatorJanjiBaru = SEMUA_INDIKATOR_PISPK.filter(
          (ind) => kelBaru.indikator[ind].sumber === 'janji' && kelBaru.indikator[ind].hariData === s.hari,
        )
        if (indikatorJanjiBaru.length > 0) {
          next = {
            ...next,
            jadwal: [
              ...next.jadwal,
              {
                id: `janji_${kj.keluargaId}_${s.hari}`,
                hari: hariTindakLanjutKunjungan(s.hari, s.mode, true),
                jenis: 'verifikasi_pispk',
                keluargaId: kj.keluargaId,
                indikatorJanji: indikatorJanjiBaru,
              },
            ],
          }
        }

        // Tally MI & kunjungan
        const t = { ...next.tally }
        if (!kontakAwalSah) {
          t.kunjunganTotal += 1
          if (hasil.berhasil) t.kunjunganBerhasil += 1
          if (hasil.diusir) t.kunjunganDiusir += 1
          // Apathy: kunjungan tanpa satu pun substansi — nol teknik MI yang tepat
          // DAN nol temuan terverifikasi. Klik-kosong dihukum, sesuai GDD anti-min-max.
          if (hasil.kualitasMi === 0 && hasil.indikatorTerverifikasi.length === 0) t.apathy += 1
          // M10 Batch-2 (CODEX P1.5): satuan MI = KUNJUNGAN, bukan pilihan-dialog.
          // Dulu miTotal/miTepat berakumulasi per-PILIHAN (4/kunjungan) sementara
          // floor pembagi skor (EKSPEKTASI_KUNJUNGAN, scoring.ts) berdenominasi
          // KUNJUNGAN → satu kunjungan sempurna = 4/8 = 50% target Ujian, bukan
          // 1/8 = 12.5%. Kini: miTotal += 1 per kunjungan, miTepat += kualitas
          // kunjungan (0..1, pecahan sah — validasi save hanya menuntut finite≥0).
          // Bebas konstanta ajaib & tak terikat bentuk konten (jumlah pilihan per
          // skenario boleh berubah tanpa menggeser semantik skor).
          t.miTotal += 1
          t.miTepat += hasil.kualitasSaji / 100
        }

        const janjiJatuhTempo = next.jadwal.find(
          (item) => item.jenis === 'verifikasi_pispk' && item.keluargaId === kj.keluargaId,
        )?.hari

        // Bridge bertingkat (M1.1): satu kontak yang baik belum sama dengan
        // outcome yang terverifikasi. Beat awal melindungi keluarga sampai
        // sesudah tanggal follow-up; arc akhir yang melahirkan janji perilaku
        // melindungi sampai sesudah verifikasi. Karma baru dibatalkan langsung
        // bila loop memang tuntas tanpa outcome tertunda.
        let jadwal = next.jadwal
        const adaKarma = jadwal.some((j) => j.jenis === 'karma_igd' && j.keluargaId === kj.keluargaId)
        if (adaKarma && kontakAwalSah) {
          const jeda = hasil.ulangDalamHari ?? 1
          const tenggatLama = kelBaru.karmaAktif?.jatuhTempoHari
          const tenggatBaru = hariKarmaTersedia(
            jadwal,
            kj.keluargaId,
            (tenggatLama ?? s.hari) + jeda,
          )
          jadwal = jadwal.map((j) =>
            j.jenis === 'karma_igd' && j.keluargaId === kj.keluargaId ? { ...j, hari: tenggatBaru } : j,
          )
          kelBaru = kelBaru.karmaAktif
            ? {
                ...kelBaru,
                karmaAktif: {
                  ...kelBaru.karmaAktif,
                  jatuhTempoHari: tenggatBaru,
                },
              }
            : kelBaru
        } else if (adaKarma && hasil.berhasil && (janjiJatuhTempo ?? kelBaru.followUpHari) !== undefined) {
          const terlindungiSampai = (janjiJatuhTempo ?? kelBaru.followUpHari)! + 1
          const tenggatBaru = hariKarmaTersedia(
            jadwal,
            kj.keluargaId,
            Math.max(kelBaru.karmaAktif?.jatuhTempoHari ?? terlindungiSampai, terlindungiSampai),
          )
          jadwal = jadwal.map((j) =>
            j.jenis === 'karma_igd' && j.keluargaId === kj.keluargaId
              ? { ...j, hari: tenggatBaru }
              : j,
          )
          kelBaru = kelBaru.karmaAktif
            ? {
                ...kelBaru,
                karmaAktif: {
                  ...kelBaru.karmaAktif,
                  jatuhTempoHari: tenggatBaru,
                },
              }
            : kelBaru
        } else if (adaKarma && hasil.berhasil) {
          jadwal = jadwal.filter((j) => !(j.jenis === 'karma_igd' && j.keluargaId === kj.keluargaId))
          const { karmaAktif: _lepas, ...kelTanpaKarma } = kelBaru
          kelBaru = kelTanpaKarma
          t.karmaDicegah += 1
          events.push({ type: 'KARMA_DICEGAH', narasi: `Krisis di keluarga ${kelContent.namaKeluarga} berhasil dicegah.` })
        } else if (adaKarma && hasil.tingkat === 'partial') {
          // Fix #5b (audit CODEX 2026-07-11): sebelumnya penundaan +3 hari tak
          // berbatas — deterministik bisa diulang selamanya (pilih hipotesis
          // benar + kartu salah tiap kunjungan) utk menunda karma tanpa akhir.
          // Setelah BATAS_PARTIAL_KARMA kali tertunda, jadwal karma TIDAK lagi
          // digeser — jatuh tempo asli berlaku, memaksa penyelesaian nyata.
          const sudahTertunda = kelBaru.karmaAktif?.partialDitunda ?? 0
          if (sudahTertunda < BATAS_PARTIAL_KARMA) {
            const tenggatBaru = hariKarmaTersedia(
              jadwal,
              kj.keluargaId,
              (kelBaru.karmaAktif?.jatuhTempoHari ?? s.hari) + 3,
            )
            jadwal = jadwal.map((j) =>
              j.jenis === 'karma_igd' && j.keluargaId === kj.keluargaId ? { ...j, hari: tenggatBaru } : j,
            )
            kelBaru = kelBaru.karmaAktif
              ? {
                  ...kelBaru,
                  karmaAktif: {
                    ...kelBaru.karmaAktif,
                    jatuhTempoHari: tenggatBaru,
                    partialDitunda: sudahTertunda + 1,
                  },
                }
              : kelBaru
          }
        } else if (adaKarma && hasil.tingkat === 'gagal') {
          jadwal = jadwal.map((j) =>
            j.jenis === 'karma_igd' && j.keluargaId === kj.keluargaId
              ? { ...j, hari: Math.max(s.hari + 1, j.hari - 2) }
              : j,
          )
          kelBaru = kelBaru.karmaAktif
            ? {
                ...kelBaru,
                karmaAktif: { ...kelBaru.karmaAktif, jatuhTempoHari: Math.max(s.hari + 1, kelBaru.karmaAktif.jatuhTempoHari - 2) },
              }
              : kelBaru
        }

        const intervensi = skenario.intervensi.find((item) => item.id === hasilAksi.kj.intervensiDipilih)
        const episodeKeluargaId = buatEpisodeId('keluarga', kj.keluargaId, 'pendampingan')
        const episodeTuntas = kelBaru.arcSelesai === 'berhasil' && indikatorJanjiBaru.length === 0
        const episodeStatus = episodeTuntas
          ? 'terverifikasi' as const
          : hasil.berhasil
            ? 'ditindaklanjuti' as const
            : 'menunggu' as const
        const episodeBerikutnya = episodeTuntas
          ? 'Pertahankan perubahan dan pantau lewat PWS keluarga.'
          : indikatorJanjiBaru.length > 0
            ? `Verifikasi perubahan ${indikatorJanjiBaru.map((id) => id.replace(/_/g, ' ')).join(', ')} pada hari ${janjiJatuhTempo ?? 'tindak lanjut'}.`
            : kelBaru.followUpHari !== undefined
              ? `Kunjungi kembali pada hari ${kelBaru.followUpHari}; lanjutkan beat keluarga yang belum tuntas.`
              : 'Susun kunjungan ulang dan perbaiki pendekatan bersama keluarga.'
        let careEpisodes = perbaruiEpisode(next.careEpisodes, {
          id: episodeKeluargaId,
          day: s.hari,
          subjectId: kj.keluargaId,
          subjectName: kelContent.namaKeluarga,
          familyId: kj.keluargaId,
          rw: kelContent.rw,
          source: 'keluarga',
          problemId: `keluarga:${kj.keluargaId}`,
          problemLabel: skenario.judul,
          owner: episodeTuntas ? 'kader' : 'dokter',
          status: episodeStatus,
          signal: skenario.judul,
          ...(intervensi ? { decision: intervensi.nama } : {}),
          feedback: hasil.narasiPenutup,
          nextAction: episodeBerikutnya,
          dueDay: episodeTuntas ? null : (janjiJatuhTempo ?? kelBaru.followUpHari ?? s.hari + 1),
          eventLabel: hasil.berhasil ? 'Kunjungan keluarga menghasilkan rencana' : 'Pendampingan belum menutup masalah',
          eventDetail: hasil.narasiPenutup,
        })
        // Tutup episode klinik->keluarga yang memang sedang menunggu pemulihan
        // rumah. Episode rujukan, konsekuensi klinis yang masih menunggu, dan
        // Prolanis tidak ikut tertutup hanya karena satu kunjungan keluarga.
        if (hasil.berhasil && kelBaru.pemulihanEpisodeId) {
          const episode = careEpisodes.find(
            (item) =>
              item.id === kelBaru.pemulihanEpisodeId &&
              item.familyId === kj.keluargaId &&
              !item.referral &&
              (item.status === 'ditindaklanjuti' || item.status === 'kembali'),
          )
          if (episode) {
            careEpisodes = perbaruiEpisode(careEpisodes, {
              id: episode.id,
              day: s.hari,
              subjectId: episode.subjectId,
              subjectName: episode.subjectName,
              familyId: kj.keluargaId,
              ...(episode.rw !== undefined ? { rw: episode.rw } : {}),
              source: episode.source,
              problemId: episode.problemId,
              problemLabel: episode.problemLabel,
              owner: 'kader',
              status: 'terverifikasi',
              signal: episode.receipt.signal,
              ...(episode.receipt.decision ? { decision: episode.receipt.decision } : {}),
              feedback: `${hasil.narasiPenutup} Hasil klinik dan pemulihan keluarga kini tersambung.`,
              nextAction: 'Pertahankan perubahan dan pantau melalui kader serta PWS keluarga.',
              dueDay: null,
              eventLabel: 'Pemulihan keluarga menuntaskan alur klinik',
              eventDetail: `${kelContent.namaKeluarga} menyelesaikan kunjungan pemulihan setelah tindak lanjut klinis.`,
            })
          }
          const { pemulihanEpisodeId: _selesaiPemulihan, ...kelTanpaEpisodePemulihan } = kelBaru
          kelBaru = kelTanpaEpisodePemulihan
        }

        next = {
          ...next,
          kunjungan: undefined,
          hasilKunjunganHariIni: hasil,
          lapanganTerpakai: true,
          layar: 'peta',
          tally: t,
          jadwal,
          careEpisodes,
          desa: {
            ...next.desa,
            keluarga: { ...next.desa.keluarga, [kj.keluargaId]: kelBaru },
          },
        }
        events.push({ type: 'KUNJUNGAN_SELESAI', hasil })
      }
      return { state: next, events }
    }

    /* -- UKM: kegiatan lapangan terjadwal (M2) --------------------------------- */

    case 'MULAI_POSYANDU': {
      const cek = cekSlotKegiatan(s, HARI_BUKA_POSYANDU[s.mode], 'Posyandu')
      if (cek) return err(s, cek)
      const terakhir = s.posyanduRwTerakhir[String(action.rw)]
      if (terakhir !== undefined && s.hari - terakhir < COOLDOWN_POSYANDU[s.mode]) {
        return err(s, `Posyandu RW ${action.rw} baru digelar — jadwalnya bulanan (tiap 30 hari).`)
      }
      // Fix D5 (migrasi ILP, triase DeepThink 2026-07-11): kartuPosyandu() kini
      // menarik 1 kartu per Langkah 2/3/4 dari pool 12-kartu lintas-siklus-hidup
      // (dulu: dek 4-kartu tetap balita-saja). Rng dari seedKurikulum (BUKAN
      // seed flavor) — sama spt rngDirector, agar kurikulum Posyandu identik
      // lintas mahasiswa 1 paket ujian (adil), hanya bervariasi per RW+hari.
      return {
        state: {
          ...s,
          stamina: s.stamina - BIAYA_STAMINA_KEGIATAN,
          layar: 'kegiatan',
          kegiatan: buatKegiatan('posyandu', kartuPosyandu(new Rng(s.seedKurikulum, 'posyandu', s.hari, action.rw)), { rw: action.rw }),
        },
        events: [],
      }
    }

    case 'MULAI_PROLANIS': {
      const cek = cekSlotKegiatan(s, HARI_BUKA_PROLANIS[s.mode], 'Prolanis')
      if (cek) return err(s, cek)
      if (s.prolanis.roster.length === 0) return err(s, 'Belum ada peserta Prolanis terdaftar.')
      const berikut = s.prolanis.sesiBerikutHari
      if (berikut !== undefined && s.hari < berikut) {
        return err(s, `Sesi Prolanis bulan ini sudah dilakukan — sesi berikutnya hari ke-${berikut}.`)
      }
      // M10 Batch-2 (CODEX B.1 + §48#4 Bu Marni): Prolanis = program BPJS —
      // kartu sesi HANYA utk peserta yang JKN keluarganya AKTIF saat ini
      // (runtime, bukan snapshot statis D30). Keluarga berkartu-mati (drift
      // atau bawaan cerita, kelas Bu Marni) tersaring keluar; begitu arc/
      // kunjungan memperbaiki JKN-nya (statusSebenarnya → 'ya'), ia otomatis
      // ikut sesi berikutnya — nol migrasi, param drift tetap tersimpan di
      // roster. Hanya 'tidak' eksplisit yang menyaring (konservatif).
      const jknAktif = (p: (typeof s.prolanis.roster)[number]): boolean => {
        if (!p.keluargaId) return true
        const kel = s.desa.keluarga[p.keluargaId]
        return kel?.indikator.jkn?.statusSebenarnya !== 'tidak'
      }
      const pesertaAktif = s.prolanis.roster.filter(jknAktif)
      if (pesertaAktif.length === 0)
        return err(s, 'Tidak ada peserta ber-JKN aktif bulan ini — bantu keluarga mengurus kepesertaan dulu.')
      return {
        state: {
          ...s,
          stamina: s.stamina - BIAYA_STAMINA_KEGIATAN,
          layar: 'kegiatan',
          kegiatan: buatKegiatan('prolanis', kartuProlanis(pesertaAktif, new Rng(s.seed, 'prolanis-narasi', s.hari))),
        },
        events: [],
      }
    }

    case 'MULAI_KLB': {
      const cek = cekSlotKegiatan(s, HARI_BUKA_KLB[s.mode], 'Respons KLB')
      if (cek) return err(s, cek)
      const cluster = hitungCluster(s.desa.surveilans, s.hari, ambangKlusterPack(pack)).find(
        (c) => c.rw === action.rw && c.kasusId === action.kasusId,
      )
      if (!cluster) return err(s, 'Kluster itu tidak lagi aktif.')
      const namaKasus = pack.kasus[action.kasusId]?.nama ?? action.kasusId
      const namaRw = pack.rw.find((r) => r.nomor === action.rw)?.nama ?? `RW ${action.rw}`
      return {
        state: {
          ...s,
          stamina: s.stamina - BIAYA_STAMINA_KEGIATAN,
          layar: 'kegiatan',
          kegiatan: buatKegiatan('klb', kartuKlb(action.kasusId, namaKasus, namaRw, new Rng(s.seed, 'klb-narasi', s.hari)), {
            rw: action.rw,
            kasusId: action.kasusId,
          }),
        },
        events: [],
      }
    }

    case 'JAWAB_KEGIATAN':
    case 'DELEGASI_KEGIATAN': {
      const kg = s.kegiatan
      if (!kg) return err(s, 'Tidak ada kegiatan berjalan.')
      if (kg.jenis !== 'posyandu' && action.type === 'DELEGASI_KEGIATAN')
        return err(s, 'Hanya Posyandu yang bisa didelegasikan ke kader.')

      const hasilSesi =
        action.type === 'DELEGASI_KEGIATAN'
          ? { kg: delegasiKegiatan(kg, new Rng(s.seed, 'delegasi', s.hari, kg.rw ?? 0)), selesai: true, benar: false }
          : jawabKegiatan(kg, action.kartuId, action.pilihanId)

      if (!hasilSesi.selesai) {
        return { state: { ...s, kegiatan: hasilSesi.kg }, events: [] }
      }
      return selesaikanKegiatan(s, hasilSesi.kg, pack)
    }

    case 'TETAPKAN_PROGRAM': {
      if (s.hari < HARI_BUKA_PETA) return err(s, 'Program wilayah terbuka bersama Peta Desa.')
      // Triase Anggaran (M2.10, DeepThink Q4): kunci BULANAN, bukan mingguan —
      // Lokakarya Mini adalah rapat anggaran sungguhan: sekali ditetapkan bulan
      // ini, tak bisa diganti-ganti mengikuti surveilans harian (CODEX P2 asal +
      // DeepThink Q4: tanpa kunci sebulan penuh, "program" hanya daftar centang
      // tanpa ongkos oportunitas nyata — pemain bisa "menutupi" semua ancaman
      // bergantian tiap pekan alih-alih benar-benar memilih & mengorbankan).
      //
      // CODEX audit pasca-GM (2026-07-13, temuan #8b): literal `/30` di sini
      // tak ikut diskalakan saat SIKLUS_LAPORAN_BULANAN (yg menyalakan popup
      // Lokakarya Mini ini) SUDAH diskalakan ke {ujian:10} — akibatnya di mode
      // Ujian, `periodeIni` tetap 1 SEPANJANG stase 30-hari (Math.ceil(30/30)=1)
      // walau Lokmin sendiri tampil lagi di hari 11 & 21. Kunci ini lantas
      // TAK PERNAH lepas dalam satu stase Ujian, sementara UI (MejaKerja.tsx)
      // eksplisit menjanjikan "baru bisa diganti bulan depan" / "sampai
      // Lokakarya Mini berikutnya" — janji yg mustahil ditepati. Kini periodeIni
      // mengikuti siklus Lokmin yg SAMA persis (bukan literal terpisah), jadi
      // kunci genuinely lepas di tiap Lokmin sesuai yg dijanjikan UI.
      const periodeIni = Math.ceil(s.hari / SIKLUS_LAPORAN_BULANAN[s.mode])
      // DeepThink ronde-2: guard lama cuma cek `fokus` — mempertahankan fokus
      // yang sama sambil mengganti `rwFokus` TIAP HARI lolos tanpa ditolak,
      // membiarkan pemain micromanage target bonusIks harian antar-RW. Itu
      // membunuh esensi "kunci sebulan, korbankan RW lain" — kunci juga rwFokus.
      // Audit CODEX UKM 2026-07-16 #3: rwFokus kini WAJIB — dua efek program
      // (bonus IKS + supresi surveilans) sama-sama per-RW; tanpa lokasi,
      // program cuma label. UI mengirimkan pilihan RW bersama fokus.
      if (action.rwFokus === undefined)
        return err(s, 'Pilih RW fokus untuk program ini — efeknya bekerja per wilayah.')
      if (
        s.program.periodeDitetapkan === periodeIni &&
        (s.program.fokus !== action.fokus || s.program.rwFokus !== action.rwFokus)
      ) {
        return err(s, 'Fokus program & lokasi RW bulan ini sudah ditetapkan di Lokakarya Mini — baru bisa diganti bulan depan.')
      }
      return {
        state: {
          ...s,
          program: {
            fokus: action.fokus,
            ...(action.rwFokus !== undefined ? { rwFokus: action.rwFokus } : {}),
            periodeDitetapkan: periodeIni,
          },
        },
        events: [],
      }
    }

    case 'TUTUP_LOKMIN': {
      return { state: { ...s, flags: { ...s.flags, lokminDitutup: true } }, events: [] }
    }

    /* -- IGD (M3.14): gawat darurat turn-based ---------------------------------- */

    case 'AKSI_IGD': {
      const igd = s.igd
      if (!igd) return err(s, 'Tidak ada pasien IGD.')
      const kasus = pack.kasusIgd[igd.kasusId]
      if (!kasus) return err(s, 'Kasus IGD tidak dikenal.')
      const hasil = aksiIgd(igd, kasus, action.langkahId, action.pilihanId)
      const events: GameEvent[] = []
      // CODEX audit pasca-GM (2026-07-13, temuan #9 Part A): ditally SEGERA
      // saat Kode Biru terjadi (bukan menunggu hasil akhir RJP/disposisi) —
      // lihat komentar `igdKodeBiruTerjadi` (state.ts) utk kenapa ini perlu
      // terpisah dari igdMeninggal/igdStabil.
      let tallyBaru = s.tally
      if (hasil.igd.fase === 'kode_biru') {
        events.push({ type: 'IGD_TIBA', narasi: 'KODE BIRU — pasien henti napas/jantung! Mulai RJP!' })
        tallyBaru = { ...s.tally, igdKodeBiruTerjadi: s.tally.igdKodeBiruTerjadi + 1 }
      }
      return { state: { ...s, igd: hasil.igd, tally: tallyBaru }, events }
    }

    case 'RJP_IGD': {
      const igd = s.igd
      if (!igd || igd.fase !== 'kode_biru') return err(s, 'Tidak dalam Kode Biru.')
      const kasus = pack.kasusIgd[igd.kasusId]
      if (!kasus) return err(s, 'Kasus IGD tidak dikenal.')
      const igdBaru = rjpIgd(igd, action.berkualitas)

      if (igdBaru.hasil === 'meninggal') {
        // Kode Hitam — konsekuensi bernama yang paling berat di game ini.
        const t = { ...s.tally, igdMeninggal: s.tally.igdMeninggal + 1 }
        const surat: Surat = {
          id: `surat_igd_${s.hari}_${s.log.length}`,
          hari: s.hari,
          jenis: 'igd',
          dari: 'Perawat jaga',
          judul: `KODE HITAM — ${igd.pasienNama} tidak tertolong`,
          isi: `${igd.pasienNama} (${igd.usia} th) meninggal di IGD pagi ini — ${kasus.nama}. Keluarganya menunggu di lorong; kamu yang harus menyampaikannya. ${kasus.clue}`,
          dibaca: false,
          kaitKasusIgdId: kasus.id,
        }
        return {
          state: {
            ...s,
            igd: undefined,
            tally: t,
            burnout: Math.min(100, s.burnout + 15),
            layar: 'meja',
            inbox: [...s.inbox, surat],
          },
          events: [
            { type: 'KODE_HITAM', narasi: `Kode Hitam. ${igd.pasienNama} tidak tertolong.` },
            { type: 'SURAT_MASUK', surat },
          ],
        }
      }
      return {
        state: { ...s, igd: igdBaru },
        events: [{ type: 'KARMA_DICEGAH', narasi: 'ROSC — sirkulasi kembali! Sirkulasi kembali, tapi stabilitas masih rendah.' }],
      }
    }

    // CODEX audit (2026-07-12, temuan #2): titik keputusan pasca-ROSC — dulu
    // tak ada, ROSC langsung lompat ke disposisi dgn stabilitas terkunci 25
    // (selalu di bawah AMBANG_STABIL_RUJUK), membuat rujukan BENAR selalu
    // mati dalam perjalanan. Lihat `stabilisasiLanjutanIgd` (igd.ts).
    case 'STABILISASI_LANJUTAN_IGD': {
      const igd = s.igd
      if (!igd || igd.fase !== 'pasca_rosc') return err(s, 'Tidak dalam fase stabilisasi lanjutan.')
      const igdBaru = stabilisasiLanjutanIgd(igd, action.pilihanId)
      return { state: { ...s, igd: igdBaru }, events: [] }
    }

    case 'DISPOSISI_IGD': {
      const igd = s.igd
      if (!igd || igd.fase !== 'disposisi') return err(s, 'Pasien belum siap disposisi.')
      const kasus = pack.kasusIgd[igd.kasusId]
      if (!kasus) return err(s, 'Kasus IGD tidak dikenal.')
      const rs = action.rumahSakitId
        ? pack.rumahSakit.find((item) => item.id === action.rumahSakitId)
        : undefined
      const tujuanCocok =
        action.jenis !== 'rujuk' ||
        (rs
          ? rumahSakitCocokUntukIgd(kasus, rs)
          : (kasus.kapabilitasRujukanSalahSatu ?? []).length === 0)
      const nilaiDasar = nilaiIgd({ ...igd, hasil: 'stabil' }, kasus, action.jenis)
      const nilai = {
        ...nilaiDasar,
        disposisiTepat: nilaiDasar.disposisiTepat && tujuanCocok,
      }
      const episodeId = buatEpisodeId('igd', `hari${s.hari}_${igd.pasienNama}`, kasus.id)
      const episodeCommon = {
        id: episodeId,
        day: s.hari,
        subjectId: `igd_${s.hari}_${igd.kasusId}_${igd.pasienNama}`,
        subjectName: igd.pasienNama,
        rw: igd.rw,
        source: 'igd' as const,
        problemId: kasus.id,
        problemLabel: kasus.nama,
        signal: kasus.pembuka,
      }

      // M10.5 Q4/Q-E (2026-07-12): rujuk saat stabilitas masih di bawah
      // AMBANG_STABIL_RUJUK adalah rujukan PREMATUR — pasien memburuk/
      // meninggal dalam perjalanan. Konsekuensi setara Kode Hitam (ditally
      // igdMeninggal), bukan sekadar disposisi keliru — risikonya nyata.
      if (nilai.hasil === 'memburuk') {
        const t = { ...s.tally, igdMeninggal: s.tally.igdMeninggal + 1 }
        const careEpisodes = perbaruiEpisode(s.careEpisodes, {
          ...episodeCommon,
          owner: 'dokter',
          status: 'berakhir',
          decision: `Rujuk pada stabilitas ${igd.stabilitas}/100 sebelum ambang aman transportasi.`,
          feedback: `${igd.pasienNama} memburuk dan meninggal dalam perjalanan.`,
          nextAction: 'Debrief: stabilisasi sebelum transportasi adalah bagian dari rujukan, bukan penundaan rujukan.',
          dueDay: null,
          referral: { stage: 'completed', note: 'Outcome fatal sebelum tiba' },
          eventLabel: 'Episode berakhir dengan Kode Hitam',
          eventDetail: `Transportasi dimulai di bawah ambang stabil ${AMBANG_STABIL_RUJUK}.`,
        })
        const surat: Surat = {
          id: `surat_igd_${s.hari}_${s.log.length}`,
          hari: s.hari,
          jenis: 'igd',
          dari: 'Perawat jaga',
          judul: `KODE HITAM — ${igd.pasienNama} meninggal dalam perjalanan`,
          isi: `${igd.pasienNama} dirujuk saat stabilitas masih rendah (${igd.stabilitas}/100) — kondisinya memburuk dan tak tertolong sebelum tiba di RS rujukan. Pasien gawat WAJIB distabilkan dulu (stabilitas ≥${AMBANG_STABIL_RUJUK}) sebelum transportasi jarak jauh. ${kasus.clue}`,
          dibaca: false,
          kaitKasusIgdId: kasus.id,
        }
        return {
          state: {
            ...s,
            igd: undefined,
            tally: t,
            burnout: Math.min(100, s.burnout + 15),
            layar: 'meja',
            inbox: [...s.inbox, surat],
            careEpisodes,
          },
          events: [
            { type: 'KODE_HITAM', narasi: `Kode Hitam. ${igd.pasienNama} meninggal dalam perjalanan — dirujuk sebelum stabil.` },
            { type: 'SURAT_MASUK', surat },
          ],
        }
      }

      // Disposisi keliru (pasien selamat tapi diarahkan salah) tidak boleh dihargai
      // sama seperti disposisi tepat — itu sebabnya CODEX menandai ini P1.
      const t = nilai.disposisiTepat
        ? { ...s.tally, igdStabil: s.tally.igdStabil + 1 }
        : { ...s.tally, igdSalahDisposisi: s.tally.igdSalahDisposisi + 1 }
      const rsNama = rs?.nama ?? 'RS rujukan'
      let jadwal = s.jadwal
      let careEpisodes = s.careEpisodes
      if (nilai.disposisiTepat && action.jenis === 'rujuk') {
        const hariFeedback = s.hari + 2
        jadwal = [
          ...jadwal,
          {
            id: `jadwal_feedback_igd_${s.hari}_${igd.kasusId}_${igd.pasienNama}`,
            hari: hariFeedback,
            jenis: 'rujukan_feedback',
            pasienId: episodeCommon.subjectId,
            episodeId,
            kasusId: kasus.id,
            nama: igd.pasienNama,
            ...(rs ? { rumahSakitId: rs.id } : {}),
            feedbackRujukan: `${rsNama} menyelesaikan pelayanan lanjutan ${kasus.nama} dan mengirim ringkasan ke Puskesmas.`,
          },
        ]
        careEpisodes = perbaruiEpisode(careEpisodes, {
          ...episodeCommon,
          owner: 'rs',
          status: 'dirujuk',
          decision: `${nilai.benar}/${nilai.total} langkah tepat; pasien stabil lalu dirujuk ke ${rsNama}.`,
          feedback: `${rsNama} menerima pasien gawat setelah stabilisasi FKTP.`,
          nextAction: `Tunggu ringkasan pelayanan pada hari ${hariFeedback}.`,
          dueDay: hariFeedback,
          referral: { stage: 'accepted', hospitalName: rsNama },
          eventLabel: 'Stabilisasi tersambung ke rujukan',
          eventDetail: `Stabilitas ${igd.stabilitas}/100; ${rsNama} menerima pasien.`,
        })
      } else {
        careEpisodes = perbaruiEpisode(careEpisodes, {
          ...episodeCommon,
          owner: nilai.disposisiTepat ? 'dokter' : 'keluarga',
          status: nilai.disposisiTepat ? 'terverifikasi' : 'berakhir',
          decision: `${nilai.benar}/${nilai.total} langkah tepat; disposisi ${action.jenis}.`,
          feedback: nilai.disposisiTepat
            ? `${igd.pasienNama} stabil dan aman dituntaskan sesuai disposisi.`
            : `${igd.pasienNama} selamat, tetapi tujuan atau disposisi tidak sesuai kebutuhan klinis.`,
          nextAction: nilai.disposisiTepat
            ? 'Lanjutkan observasi dan edukasi sesuai rencana.'
            : 'Debrief pemilihan tujuan dan batas kemampuan FKTP sebelum kasus berikutnya.',
          dueDay: null,
          ...(action.jenis === 'rujuk'
            ? { referral: { stage: 'completed' as const, hospitalName: rsNama, note: 'Tujuan tidak sesuai' } }
            : {}),
          eventLabel: nilai.disposisiTepat ? 'Episode IGD ditutup' : 'Episode IGD berakhir dengan near-miss',
          eventDetail: nilai.disposisiTepat ? 'Outcome dan disposisi tepat.' : 'Pasien selamat, tetapi disposisi keliru.',
        })
      }
      // Prinsip SISRUTE: kasus EMERGENSI stabil selalu diterima jejaring.
      // Bug hunt 2026-08-06: nada surat dulu ditentukan HANYA oleh
      // `disposisiTepat`. `nilai.benar` dicetak di judul tapi tak menggerbangi
      // apa pun, dan `melewatiKodeBiru` tak dibaca sama sekali. Akibatnya
      // mahasiswa yang memilih opsi terburuk di TIAP langkah sampai pasiennya
      // henti jantung, lalu benar RJP dan rujuk, menerima surat PUJIAN berjudul
      // "tertangani baik (0/3 langkah tepat)" — judul yang membantah dirinya
      // sendiri dalam satu baris — dan badan suratnya tak menyebut henti
      // jantung sama sekali. Berlaku 20/20 kasus IGD, termasuk kelima kasus
      // pool Ujian. Diperparah: `igdKodeBiruTerjadi` nol dibaca renderer, jadi
      // surat ini satu-satunya rekaman naratif yang tersisa — dan isinya memuji.
      const igdMulus = nilai.disposisiTepat && !igd.melewatiKodeBiru && nilai.benar * 2 >= nilai.total
      const surat: Surat = {
        id: `surat_igd_${s.hari}_${s.log.length}`,
        hari: s.hari,
        // Sengaja memakai ulang 'teguran_kapus': `state.ts` beku dan SURAT_META
        // di renderer memetakan per-jenis, jadi menambah nilai baru pada union
        // JenisSurat berongkos jauh lebih besar daripada manfaatnya.
        jenis: igdMulus ? 'pujian_kapus' : 'teguran_kapus',
        dari: 'dr. Harsono, Kepala Puskesmas',
        judul: nilai.disposisiTepat
          ? igd.melewatiKodeBiru
            ? `IGD: ${igd.pasienNama} selamat setelah Kode Biru (${nilai.benar}/${nilai.total} langkah tepat; algoritme berhenti di langkah ${igd.jawaban.length})`
            : `IGD: ${igd.pasienNama} tertangani baik (${nilai.benar}/${nilai.total} langkah tepat)`
          : `IGD: disposisi ${igd.pasienNama} keliru`,
        isi: nilai.disposisiTepat
          ? `${igd.pasienNama} stabil dan ${action.jenis === 'rujuk' ? `diterima ${rsNama}` : 'dipulangkan dengan observasi'}. ${kasus.clue}`
          : `${igd.pasienNama} selamat, tapi disposisimu keliru — ${action.jenis === 'rujuk' && !tujuanCocok ? `${rsNama} tidak memenuhi spesialisasi/kapabilitas waktu-kritis yang dibutuhkan ${kasus.nama}. Pilih tujuan jejaring yang sesuai.` : kasus.disposisiBenar === 'rujuk' ? `kasus ${kasus.nama} pasca-stabilisasi wajib DIRUJUK, bukan dipulangkan. Untung keluarganya membawanya ke RS sendiri.` : `kasus ini dapat dituntaskan dengan observasi di Puskesmas — merujuk semuanya membebani jejaring.`} ${kasus.clue}`,
        dibaca: false,
        kaitKasusIgdId: kasus.id,
      }
      return {
        state: { ...s, igd: undefined, tally: t, layar: 'klinik', inbox: [...s.inbox, surat], jadwal, careEpisodes },
        events: [
          { type: 'STEMPEL', jenis: action.jenis === 'rujuk' ? 'rujuk' : 'pulang' },
          { type: 'SURAT_MASUK', surat },
        ],
      }
    }

    /* -- M4: ekonomi & manajemen bergigi ---------------------------------------- */

    case 'PESAN_OBAT': {
      const obat = pack.obat[action.obatId]
      if (!obat) return err(s, 'Obat tidak dikenal.')
      if (s.gudang.stok[action.obatId] === undefined)
        return err(s, 'Obat ini tidak dilacak gudang.')
      // CODEX audit 2026-07-04 (temuan #3): NaN lolos perbandingan `< 5 || > 50`
      // (perbandingan NaN SELALU false) — Math.round(NaN) tetap NaN lalu
      // meracuni kapitasi/biaya/belanjaPengadaan. Cek finite dulu.
      if (!Number.isFinite(action.jumlah)) return err(s, 'Jumlah pengadaan tidak valid.')
      const jumlah = Math.round(action.jumlah)
      if (jumlah < 5 || jumlah > 50) return err(s, 'Jumlah pengadaan 5-50 unit per pesanan.')
      const biaya = obat.hargaBeli * jumlah
      if (s.kapitasi < biaya)
        return err(s, `Kas tidak cukup — butuh Rp ${biaya.toLocaleString('id-ID')}.`)
      if (s.gudang.pesanan.some((p) => p.obatId === action.obatId))
        return err(s, `${obat.nama} sudah dalam pengiriman — tunggu tiba dulu.`)
      const pesanan = {
        id: `pesan_${s.hari}_${action.obatId}`,
        obatId: action.obatId,
        jumlah,
        tibaHari: s.hari + LEAD_TIME_OBAT,
        biaya,
      }
      return {
        state: {
          ...s,
          kapitasi: s.kapitasi - biaya,
          gudang: { ...s.gudang, pesanan: [...s.gudang.pesanan, pesanan] },
          keuanganBulan: {
            ...s.keuanganBulan,
            belanjaPengadaan: s.keuanganBulan.belanjaPengadaan + biaya,
          },
        },
        events: [],
      }
    }

    case 'PEMULIHAN': {
      // M4.21 — aktivitas pemulihan akhir pekan: tiap hari ke-7, memakai slot siang.
      if (s.hari % 7 !== 0) return err(s, 'Pemulihan hanya di akhir pekan (tiap hari ke-7).')
      if (s.blok !== 'siang') return err(s, 'Pemulihan mengisi blok siang.')
      if (s.kegiatan || s.kunjungan || s.igd) return err(s, 'Sedang ada urusan berjalan.')
      if (s.lapanganTerpakai || s.hasilKunjunganHariIni)
        return err(s, 'Slot siang hari ini sudah terpakai.')

      let burnout = s.burnout
      let keluarga = s.desa.keluarga
      const flags = { ...s.flags }
      let narasi: string
      if (action.jenis === 'istirahat') {
        burnout = Math.max(0, burnout - 12)
        narasi = 'Tidur siang panjang, teh hangat, dan tidak satu pun formulir. Kepala terasa ringan.'
      } else if (action.jenis === 'olahraga') {
        burnout = Math.max(0, burnout - 9)
        flags['bonusStaminaBesok'] = true
        narasi = 'Lari pagi keliling sawah sampai berkeringat. Besok badanmu punya tenaga ekstra.'
      } else {
        burnout = Math.max(0, burnout - 6)
        // S6-degenerate (a): silaturahmi = rapport AWAL saja. Dulu +1 trust ke
        // SEMUA binaan ber-arc hidup — 4 akhir pekan menembus semua gerbang
        // kejujuran (ambangTrust 4/5/6) tanpa satu kunjungan pun. Kini hanya
        // keluarga ber-trust < TRUST_PLAFON_SILATURAHMI (4) yang naik; gerbang
        // dalam (≥5) tetap menuntut kunjungan sungguhan. Deterministik: tanpa rng.
        keluarga = { ...keluarga }
        let adaYangLuluh = false
        for (const id of s.desa.binaan) {
          const kel = keluarga[id]
          if (kel && !kel.arcSelesai && kel.trust < TRUST_PLAFON_SILATURAHMI) {
            keluarga[id] = { ...kel, trust: Math.min(10, kel.trust + 1) }
            adaYangLuluh = true
          }
        }
        narasi = adaYangLuluh
          ? 'Keliling desa tanpa tas obat — cuma ngobrol dan minum teh. Keluarga yang masih sungkan mulai membukakan pintu; kepercayaan yang lebih dalam menunggu kunjunganmu.'
          : 'Keliling desa tanpa tas obat — cuma ngobrol dan minum teh. Warga menyambutmu hangat seperti biasa; untuk melangkah lebih dalam, datanglah lewat kunjungan sungguhan.'
      }
      return {
        state: {
          ...s,
          burnout,
          flags,
          lapanganTerpakai: true,
          pemulihanTerakhirHari: s.hari,
          desa: { ...s.desa, keluarga },
          layar: 'meja',
        },
        events: [{ type: 'PEMULIHAN_SELESAI', jenis: action.jenis, narasi }],
      }
    }

    default:
      return err(s, `Aksi tidak dikenal: ${(action as Action).type}`)
  }
}

/* ---------------------------------------------------------------------------
 * KEGIATAN — helper penyelesaian sesi
 * ------------------------------------------------------------------------- */

function cekSlotKegiatan(s: GameState, hariBuka: number, nama: string): string | null {
  if (s.hari < hariBuka) return `${nama} terbuka di hari ke-${hariBuka}.`
  if (s.blok !== 'siang') return `${nama} dilakukan di blok siang.`
  if (s.kegiatan || s.kunjungan) return 'Sedang ada kegiatan lapangan berjalan.'
  if (s.lapanganTerpakai || s.hasilKunjunganHariIni) return 'Slot lapangan hari ini sudah terpakai.'
  if (s.stamina < BIAYA_STAMINA_KEGIATAN) return `Butuh ${BIAYA_STAMINA_KEGIATAN} stamina untuk kegiatan ini.`
  return null
}

function selesaikanKegiatan(s: GameState, kg: GameState['kegiatan'], pack: ContentPack): HasilAdvance {
  if (!kg) return err(s, 'Kegiatan tidak ada.')
  const hasil = nilaiKegiatan(kg)
  const events: GameEvent[] = [{ type: 'KEGIATAN_SELESAI', hasil }]
  const tally = { ...s.tally }
  // CODEX audit UI/UX 2026-07-10 (#5): TIDAK memindah layar ke 'peta' di sini
  // — dulu itu membuat React unmount Kegiatan.tsx pada render yang sama saat
  // event KEGIATAN_SELESAI diterbitkan, jadi KartuHasil (stempel nada baik/
  // cukup/kurang + narasi pedagogis) tak pernah sempat dirender. `layar` tetap
  // 'kegiatan' (kekal dari `...s`) — Kegiatan.tsx sendiri yang merender
  // KartuHasil begitu event ini ditangkap, lalu tombol "Kembali ke Peta Desa"
  // di kartu itu yang men-dispatch PINDAH_LAYAR (kini lolos krn s.kegiatan
  // sudah undefined di bawah).
  // CODEX M14 #11: persist hasil agar KartuHasil bertahan reload (layar tetap
  // 'kegiatan' sampai pemain menutup, tapi state.kegiatan sudah undefined).
  let next: GameState = { ...s, kegiatan: undefined, lapanganTerpakai: true, hasilKegiatanTerakhir: hasil }
  let careEpisodes = next.careEpisodes

  if (hasil.jenis === 'posyandu' && hasil.rw !== undefined) {
    tally.posyanduSesi += 1
    // #5 (audit CODEX UKM 2026-07-16): posyandu bukan lagi "kuis penambah angka
    // IKS abstrak". Efek UTAMA-nya kini NYATA — sesi berkualitas (skor ≥0.5)
    // MEMVERIFIKASI data KIA (imunisasi/ASI/tumbuh-kembang/persalinan/KB) yang
    // dulu diisi kader: penimbangan & pencatatan langsung menggantikan tebakan
    // kader jadi ground-truth dokter. Bonus IKS abstrak diperkecil drastis
    // (0.04→0.012) jadi sekadar sentuhan, bukan mata uang hadiah utama.
    const rwPosyandu = hasil.rw
    let keluargaPy = next.desa.keluarga
    let jumlahKeluargaTerkoreksi = 0
    // Audit CODEX beta.16: hanya indikator yang MEJANYA benar-benar dibuka sesi
    // ini yang boleh dikoreksi. Kartu ditarik acak per sesi, jadi daftar ini
    // berbeda tiap kali — itulah intinya. Kebenaran jawaban kartu tak jadi
    // syarat di sini: menimbang anak tetap menghasilkan data walau keputusan
    // klinis sesudahnya keliru; mutu keputusan sudah dihargai gerbang skor.
    const indikatorSesi = indikatorPosyanduSesi(hasil.jawaban.map((j) => j.kartuId))
    if (hasil.skor >= 0.5 && indikatorSesi.length > 0) {
      const terkoreksi: Record<string, KeluargaState> = { ...keluargaPy }
      for (const [id, kel] of Object.entries(keluargaPy)) {
        const kc = pack.keluarga[id]
        if (!kc || kc.rw !== rwPosyandu) continue
        const indikator = { ...kel.indikator }
        let berubah = false
        for (const ind of indikatorSesi) {
          const nilai = indikator[ind]
          if (nilai.sumber !== 'kader' || nilai.statusSebenarnya === 'na') continue
          indikator[ind] = { status: nilai.statusSebenarnya, statusSebenarnya: nilai.statusSebenarnya, sumber: 'dokter', hariData: s.hari }
          berubah = true
        }
        if (berubah) {
          terkoreksi[id] = { ...kel, indikator }
          jumlahKeluargaTerkoreksi += 1
        }
      }
      keluargaPy = terkoreksi
    }
    const bonus = 0.012 * hasil.skor
    next = {
      ...next,
      posyanduRwTerakhir: { ...next.posyanduRwTerakhir, [String(hasil.rw)]: s.hari },
      desa: { ...next.desa, keluarga: keluargaPy, rw: tambahBonusIks(next.desa.rw, hasil.rw, bonus) },
    }
    const namaRw = pack.rw.find((rw) => rw.nomor === hasil.rw)?.nama ?? `RW ${hasil.rw}`
    // Bug hunt 2026-08-06 — REGRESI dari commit 98c378a kemarin. Saat daftar
    // indikator dipersempit jadi per-kartu, SUMBER angkanya berubah tapi
    // KONSUMEN-nya tidak. Gerbang ini menyamakan dua keadaan yang berlawanan:
    // "sudah diperiksa dan ternyata konsisten" versus "tak pernah diperiksa
    // sama sekali". Terukur: 65,4% sesi sempurna pada hari yang sah tak
    // menyentuh satu keluarga pun — 100% di RW 2, 4, 5, dan 6 yang memang tak
    // punya keluarga bersasaran KIA. Episode keluar 'terverifikasi', dueDay
    // dihapus, dan Jejak Perawatan menempelkan chip hijau "Tindak lanjut
    // tuntas" sementara di RW itu masih ada data kader yang faktual salah.
    //
    // `indikatorSesi.length > 0` saja tidak cukup: sesi yang cuma menarik meja
    // penyuluhan ASI tetap lolos padahal imunisasi & tumbuh kembang masih
    // salah. Yang jujur: tuntas hanya bila tak ada lagi indikator KIA
    // bersumber kader yang menunggu diperiksa di RW itu.
    const sisaKiaKader = Object.entries(keluargaPy).some(([id, kel]) => {
      const kc = pack.keluarga[id]
      if (!kc || kc.rw !== rwPosyandu) return false
      return SEMUA_INDIKATOR_KIA_POSYANDU.some((ind) => {
        const n = kel.indikator[ind]
        return n.sumber === 'kader' && n.statusSebenarnya !== 'na'
      })
    })
    const posyanduTuntas = hasil.skor >= 0.66 && indikatorSesi.length > 0 && !sisaKiaKader
    careEpisodes = perbaruiEpisode(careEpisodes, {
      id: buatEpisodeId('posyandu', `rw${hasil.rw}`, 'kia'),
      day: s.hari,
      subjectId: `rw${hasil.rw}`,
      subjectName: `Ibu dan anak ${namaRw}`,
      rw: hasil.rw,
      source: 'posyandu',
      problemId: 'kia_posyandu',
      problemLabel: 'Pemantauan KIA dan tumbuh kembang',
      owner: posyanduTuntas ? 'kader' : 'bidan',
      status: posyanduTuntas ? 'terverifikasi' : hasil.skor >= 0.5 ? 'ditindaklanjuti' : 'menunggu',
      signal: `Sesi Posyandu RW ${hasil.rw} memeriksa provenance data KIA.`,
      decision: `${hasil.benar}/${hasil.total} keputusan layanan tepat.`,
      // Resi dipecah tiga (bug hunt 2026-08-06). Dulu "tidak ada koreksi baru
      // yang diperlukan" dipakai untuk dua keadaan berbeda, termasuk sesi yang
      // tak membuka satu pun meja KIA — pembacaan yang menenangkan padahal
      // datanya belum pernah disentuh.
      feedback: jumlahKeluargaTerkoreksi > 0
        ? `${jumlahKeluargaTerkoreksi} keluarga: data ${indikatorSesi.map((i) => i.replace(/_/g, ' ')).join(', ')} diperbarui dari meja yang dibuka sesi ini.`
        : hasil.skor < 0.66
          ? 'Mutu sesi belum cukup untuk memverifikasi seluruh data prioritas.'
          : indikatorSesi.length === 0
            ? 'Sesi ini tidak membuka meja yang menghasilkan data KIA rumah tangga, jadi tak ada yang bisa dicocokkan dengan laporan kader.'
            : sisaKiaKader
              ? 'Yang diperiksa sesi ini sudah cocok dengan laporan kader, tetapi indikator KIA lain di RW ini masih menunggu diperiksa.'
              : 'Seluruh data KIA prioritas di RW ini sudah diperiksa dan konsisten.',
      nextAction: posyanduTuntas
        ? 'Lanjutkan pemantauan rutin oleh kader dan bidan.'
        : `Ukur ulang dan cek tindak lanjut pada siklus Posyandu berikutnya, paling cepat hari ${s.hari + COOLDOWN_POSYANDU[s.mode]}.`,
      dueDay: posyanduTuntas ? null : s.hari + COOLDOWN_POSYANDU[s.mode],
      eventLabel: posyanduTuntas ? 'Siklus Posyandu terverifikasi' : 'Hasil Posyandu masuk tindak lanjut',
      eventDetail: `${hasil.benar}/${hasil.total} keputusan tepat; ${jumlahKeluargaTerkoreksi} keluarga dikoreksi.`,
    })
  } else if (hasil.jenis === 'prolanis') {
    tally.prolanisSesi += 1
    // Drift tiap peserta menurut ketepatan jawaban kartu-nya + jembatan UKP.
    const rng = new Rng(s.seed, 'prolanis', s.hari)
    const jadwalBaru = [...next.jadwal]
    const orangDijadwalkan = new Set<string>()
    const roster = s.prolanis.roster.map((p) => {
      const jwb = hasil.jawaban.find((j) => j.kartuId === `prol_${p.id}`)
      // M10 Batch-2 (CODEX B.1): peserta TANPA kartu sesi ini (tersaring JKN
      // nonaktif di MULAI_PROLANIS) tak boleh di-drift — dulu jwb undefined
      // dianggap "salah" → param memburuk padahal ia tak pernah diberi kartu.
      if (!jwb) return p
      const pBaru = driftProlanis(p, jwb.benar, rng)
      const orangId = pBaru.orangId ?? pBaru.id
      const episodeId = buatEpisodeId('prolanis', orangId, pBaru.jenis)
      const terkontrol = prolanisTerkendali(pBaru.jenis, pBaru.param)
      const satuan = pBaru.jenis === 'ht' ? 'mmHg' : 'mg/dL'
      let hariEvaluasiKlinik: number | undefined
      let pesertaHasil = pBaru

      // Dua masalah pada orang yang sama tetap dipantau terpisah, tetapi satu
      // sesi maksimal membuka satu bottleneck klinik. Masalah lain tetap
      // tertunda (counter tidak dihapus) dan dapat muncul pada sesi berikutnya.
      if (pBaru.takTerkontrolBerturut >= 2 && !orangDijadwalkan.has(orangId)) {
        const kasusId = pBaru.jenis === 'ht' ? 'hipertensi_esensial' : 'dm_tipe2'
        if (pack.kasus[kasusId]) {
          orangDijadwalkan.add(orangId)
          hariEvaluasiKlinik = s.hari + rng.int(2, 6)
          jadwalBaru.push({
            id: `jadwal_prolanis_${s.hari}_${p.id}`,
            hari: hariEvaluasiKlinik,
            jenis: 'pasien_kembali',
            pasienId: `prolanis_${orangId}`,
            episodeId,
            kasusId,
            catatan: `${p.nama} - ${pBaru.jenis === 'ht' ? `hipertensi belum terkontrol; perlu evaluasi kepatuhan, tolerabilitas, risiko kardiovaskular, dan titrasi terapi (TD sistolik terakhir ${pBaru.param} mmHg)` : `diabetes belum terkontrol; perlu evaluasi kepatuhan, hipoglikemia, komplikasi, dan penyesuaian terapi (GDP terakhir ${pBaru.param} mg/dL)`}`,
            nama: p.nama,
            usia: p.usia,
            jenisKelamin: p.jenisKelamin,
            rw: p.rw,
            bpjs: true,
            ...(p.keluargaId ? { keluargaId: p.keluargaId } : {}),
            prolanisPesertaId: p.id,
          })
          pesertaHasil = { ...pBaru, takTerkontrolBerturut: 0 }
        }
      }
      const butuhKlinik = pBaru.takTerkontrolBerturut >= 2
      careEpisodes = perbaruiEpisode(careEpisodes, {
        id: episodeId,
        day: s.hari,
        subjectId: orangId,
        subjectName: pBaru.nama,
        ...(pBaru.keluargaId ? { familyId: pBaru.keluargaId } : {}),
        rw: pBaru.rw,
        source: 'prolanis',
        problemId: pBaru.jenis,
        problemLabel: pBaru.jenis === 'ht' ? 'Hipertensi dalam Prolanis' : 'Diabetes dalam Prolanis',
        owner: terkontrol ? 'kader' : hariEvaluasiKlinik !== undefined ? 'dokter' : 'program',
        status: terkontrol ? 'terverifikasi' : butuhKlinik ? 'menunggu' : 'ditindaklanjuti',
        // Audit CODEX beta.16 (2026-08-06): label WAKTU diperbaiki. Dulu
        // catatan ini menulis angka PASCA-drift (`pBaru.param`) sebagai nilai
        // "pada sesi Prolanis" hari itu — sehingga satu klik konseling
        // tampak menurunkan gula darah puasa 21-34 mg/dL seketika, dan Jejak
        // Perawatan membantah kartunya sendiri yang mengajarkan "Prolanis itu
        // maraton, bukan sprint". Mekaniknya sebenarnya sudah benar: angka
        // pasca-drift memang angka yang dibacakan kartu sesi BERIKUTNYA. Yang
        // salah cuma labelnya. Kini yang terukur hari ini (`p.param`) ditulis
        // sebagai hasil hari ini, dan angka pasca-drift disebut sebagai
        // perkiraan saat kontrol berikutnya.
        signal: `${pBaru.jenis === 'ht' ? 'TD sistolik' : 'GDP'} ${p.param} ${satuan} terukur pada sesi Prolanis hari ini.`,
        decision: jwb.benar ? 'Keputusan kartu Prolanis tepat.' : 'Keputusan sesi perlu dikoreksi.',
        feedback: terkontrol
          ? `Tata laksana sesi ini diperkirakan membawa ${pBaru.jenis === 'ht' ? 'TD sistolik' : 'GDP'} ke ${pBaru.param} ${satuan} saat kontrol berikutnya — di bawah ambang kontrol program.`
          : `Belum terkontrol selama ${pBaru.takTerkontrolBerturut} sesi berturut-turut; perkiraan saat kontrol berikutnya ${pBaru.param} ${satuan}.`,
        nextAction: terkontrol
          ? 'Pertahankan obat, perilaku, dan pemantauan pada sesi berikutnya.'
          : hariEvaluasiKlinik !== undefined
            ? `Evaluasi klinis di poli pada hari ${hariEvaluasiKlinik}; cari komplikasi dan hambatan terapi.`
            : butuhKlinik
              ? 'Masalah turut dicatat; satu slot klinik per orang diprioritaskan pada masalah lain. Evaluasi ulang sesi berikutnya.'
            : `Ulangi pemantauan pada sesi berikutnya, hari ${s.hari + HARI_BUKA_PROLANIS[s.mode]}.`,
        dueDay: terkontrol ? null : (hariEvaluasiKlinik ?? s.hari + HARI_BUKA_PROLANIS[s.mode]),
        eventLabel: terkontrol
          ? 'Parameter Prolanis menuju terkendali'
          : 'Parameter Prolanis belum terkendali',
        eventDetail: `Terukur hari ini ${p.param} ${satuan}; perkiraan kontrol berikutnya ${pBaru.param} ${satuan}; ${pBaru.takTerkontrolBerturut} sesi tak terkendali.`,
      })
      return pesertaHasil
    })
    next = {
      ...next,
      jadwal: jadwalBaru,
      // CODEX audit pasca-GM (2026-07-13, temuan #7): literal `+30` di sini tak
      // ikut diskalakan saat HARI_BUKA_PROLANIS (ambang BUKA-nya) SUDAH
      // diskalakan ke {ujian:10} — akibatnya sesi pertama yg legal (hari 10)
      // mengunci `sesiBerikutHari` ke hari 40, yg TAK PERNAH tiba dlm stase
      // 30-hari Ujian (HARI_STASE.ujian). Reuse HARI_BUKA_PROLANIS[s.mode]
      // (rasio identik 1/3 yg sudah ditetapkan) sbg periode berulang jua.
      prolanis: { ...s.prolanis, roster, sesiBerikutHari: s.hari + HARI_BUKA_PROLANIS[s.mode] },
    }
  } else if (hasil.jenis === 'klb' && hasil.rw !== undefined && hasil.kasusId !== undefined) {
    // Respons KLB tuntas: buang entri surveilans kluster itu (penularan diputus)
    // + bonus IKS RW; buruk = kluster tetap menyala. Skor agregat saja tidak
    // cukup: dua langkah investigasi generik yang benar tak boleh menutupi
    // tindakan pengendalian penyakit-spesifik yang salah.
    const aksiPengendalianBenar = hasil.jawaban.find(
      (jawaban) => jawaban.kartuId === 'klb_aksi',
    )?.benar === true
    // Audit CODEX beta.16 (2026-08-06): syarat verifikasi ditambahkan.
    // Gerbang lama (skor >= 0,66 + aksi benar) meloloskan pemain yang memilih
    // "langsung fogging/tutup wilayah TANPA verifikasi" — dua dari tiga kartu
    // sudah cukup. Kluster dibersihkan dari PWS dan kalimat penutupnya sama
    // persis dengan pemain yang benar tiga dari tiga.
    //
    // Ini BUKAN membatalkan keputusan desain sebelumnya. Commit 8214e8c hanya
    // MENAMBAH syarat aksi dan secara eksplisit membatasi diri pada "dua bug
    // fix yang jawabannya objektif, bukan pilihan desain"; briefing yang sama
    // justru mendiagnosis rasio datar itu sebagai bug. Jadi lolosnya kartu
    // verifikasi adalah sisa pekerjaan yang tertinggal karena batas lingkup,
    // bukan pedagogi yang pernah diniatkan.
    //
    // Efek samping yang DISENGAJA dan perlu diketahui: dengan verifikasi dan
    // aksi sama-sama wajib benar, ambang 0,66 otomatis terpenuhi — aturannya
    // berubah menjadi "hanya 5W1H yang boleh keliru". Itu asimetri yang
    // dipilih sadar: memulai pengendalian tanpa memastikan wabahnya nyata
    // membakar anggaran wilayah dan bisa menyasar penyakit yang salah,
    // sedangkan penyelidikan yang kurang rapi tidak membatalkan pemutusan
    // penularan yang sudah terjadi.
    const verifikasiBenar = hasil.jawaban.find(
      (jawaban) => jawaban.kartuId === 'klb_verif',
    )?.benar === true
    if (hasil.skor >= 0.66 && aksiPengendalianBenar && verifikasiBenar) {
      tally.klbTuntas += 1
      const kunciFlag = `cluster_${hasil.kasusId}_rw${hasil.rw}`
      const { [kunciFlag]: _reset, ...flagsSisa } = next.flags
      next = {
        ...next,
        flags: flagsSisa,
        desa: {
          ...next.desa,
          surveilans: next.desa.surveilans.filter(
            (e) => !(e.rw === hasil.rw && e.kasusId === hasil.kasusId),
          ),
          // #5: bonus IKS abstrak diperkecil (0.03→0.012); nilai KLB kini di
          // pemutusan penularan (surveilans dibersihkan, di atas), bukan angka.
          rw: tambahBonusIks(next.desa.rw, hasil.rw, 0.012),
        },
      }
      events.push({ type: 'KARMA_DICEGAH', narasi: `Kluster ${pack.kasus[hasil.kasusId]?.nama ?? hasil.kasusId} di RW ${hasil.rw} berhasil ditanggulangi.` })
    }
    const klbTuntas = hasil.skor >= 0.66 && aksiPengendalianBenar && verifikasiBenar
    const namaKasus = pack.kasus[hasil.kasusId]?.nama ?? hasil.kasusId
    careEpisodes = perbaruiEpisode(careEpisodes, {
      id: buatEpisodeId('surveilans', `rw${hasil.rw}`, hasil.kasusId),
      day: s.hari,
      subjectId: `rw${hasil.rw}`,
      subjectName: `Warga RW ${hasil.rw}`,
      rw: hasil.rw,
      source: 'surveilans',
      problemId: hasil.kasusId,
      problemLabel: `Kluster ${namaKasus}`,
      owner: klbTuntas ? 'kader' : 'program',
      status: klbTuntas ? 'terverifikasi' : 'menunggu',
      signal: `Surveilans poli mendeteksi kluster ${namaKasus} di RW ${hasil.rw}.`,
      decision: `${hasil.benar}/${hasil.total} keputusan investigasi dan respons tepat.`,
      // Audit CODEX beta.16: rekaman permanen ikut dijujurkan. Dulu kalimat
      // ini berbunyi identik untuk run 3/3 dan run yang melewatkan verifikasi,
      // sehingga Jejak Perawatan amnesia terhadap kartu mana yang meleset.
      feedback: klbTuntas
        ? 'Verifikasi wabah dan aksi spesifik transmisi sama-sama benar; sinyal kluster dibersihkan dari PWS.'
        : !verifikasiBenar
          ? 'Kluster tetap aktif: pengendalian digerakkan sebelum wabahnya diverifikasi dan definisi kasus ditetapkan.'
          : !aksiPengendalianBenar
            ? 'Kluster tetap aktif: aksi pengendalian tidak sesuai jalur penularan penyakit ini.'
            : 'Kluster tetap aktif karena investigasi belum memadai.',
      nextAction: klbTuntas
        ? 'Kader melanjutkan pemantauan pasca-respons.'
        : !verifikasiBenar
          ? 'Ulangi respons KLB: verifikasi diagnosis dan tetapkan definisi kasus lebih dulu, baru gerakkan pengendalian.'
          : 'Ulangi respons KLB dan pilih aksi yang sesuai jalur transmisi.',
      dueDay: klbTuntas ? null : s.hari + 1,
      eventLabel: klbTuntas ? 'Loop KLB ditutup' : 'Respons KLB belum menutup kluster',
      eventDetail: `${hasil.benar}/${hasil.total} keputusan tepat; aksi transmisi ${aksiPengendalianBenar ? 'sesuai' : 'tidak sesuai'}.`,
    })
  }

  return { state: { ...next, tally, careEpisodes }, events }
}

function tambahBonusIks(rwList: GameState['desa']['rw'], nomor: number, bonus: number): GameState['desa']['rw'] {
  return rwList.map((r) => (r.nomor === nomor ? { ...r, bonusIks: Math.min(0.3, r.bonusIks + bonus) } : r))
}

/* ---------------------------------------------------------------------------
 * ALUR WAKTU — LANJUTKAN
 * ------------------------------------------------------------------------- */

function lanjutkan(s: GameState, pack: ContentPack): HasilAdvance {
  if (s.tamat)
    return err(s, `Stase sudah berakhir — skor terkunci (${s.tamat.grade}). Lihat Rapor & surat penutupmu.`)
  if (s.igd) return err(s, 'Pasien IGD menunggumu — nyawa dulu, jadwal belakangan.')
  if (s.kunjungan) return err(s, 'Selesaikan kunjungan dulu.')
  if (s.klinik.aktif) return err(s, 'Selesaikan pasien di ruang periksa dulu.')
  // CODEX ronde-11 #1: jaring terakhir jika kegiatan tetap aktif via dispatch
  // langsung (headless) — PINDAH_LAYAR sudah menahan lewat HUD, tapi LANJUTKAN
  // tak boleh bergantung pada urutan aksi UI.
  if (s.kegiatan) return err(s, 'Selesaikan kegiatan lapangan dulu.')

  if (s.blok === 'pagi') {
    // Sisa antrian di-auto-resolve oleh "instingmu" — dan yang bermasalah IKUT
    // menyeret akurasi (anti cherry-picking: melewatkan pasien bukan strategi gratis).
    // M4.21: burnout menumpulkan insting — makin lelah, makin banyak yang lolos
    // bermasalah (0.25 dasar → hingga 0.45 pada burnout 100).
    const sisa = s.klinik.antrian.length
    let bermasalah = 0
    let jadwal = s.jadwal
    if (sisa > 0) {
      const pBermasalah = 0.25 + (s.burnout / 100) * 0.2
      const rng = new Rng(s.seed, 'auto', s.hari)
      const rngKembali = new Rng(s.seed, 'auto-kembali', s.hari)
      for (let i = 0; i < sisa; i++) {
        const pasienSkip = s.klinik.antrian[i]
        // S4-formatif-slot (governance): pasien kasus formatif yang dilewatkan
        // TIDAK ikut undian bermasalah — formatif tidak boleh menyentuh tally
        // (autoBermasalah masuk denominator akurasi di scoring.ts) ataupun
        // menjadwalkan konsekuensi, konsisten dgn jalur DISPOSISI yang
        // membekukan tally/jadwal utk prototypeFormatif. CATATAN determinisme:
        // pasien formatif tak lagi MENGONSUMSI draw rng 'auto' — urutan roll
        // pasien resmi berikutnya pada antrian campuran bergeser (disengaja,
        // REVISI_ENGINE 62).
        if (kasusFormatif(pasienSkip ? pack.kasus[pasienSkip.kasusId] : undefined)) continue
        if (!rng.chance(pBermasalah)) continue
        bermasalah += 1
        // DeepThink #5 (moral hazard "ghosting"): dulu "bermasalah" cuma angka
        // statistik tak kasat mata (autoBermasalah menyeret akurasi lewat
        // denominator) — min-maxer bisa menghitung men-skip pasien tak pasti
        // LEBIH AMAN drpd periksa lalu risiko salah diagnosis yang PASTI
        // menghukum. Wujudkan kelalaian itu secara fisik: pasien yang di-skip
        // DAN bermasalah kembali besok dgn kondisi memburuk — reuse
        // kasus.konsekuensi (kembaliHariMin/Max + kondisiKembali), gated sama
        // spt jalur DISPOSISI (kasus tanpa konsekuensi = tak ada arc memburuk
        // utk diwujudkan; tetap kena penalti statistik autoBermasalah saja).
        const kasusSkip = pasienSkip ? pack.kasus[pasienSkip.kasusId] : undefined
        if (pasienSkip && kasusSkip?.konsekuensi) {
          const jatuhTempo =
            s.hari + rngKembali.int(kasusSkip.konsekuensi.kembaliHariMin, kasusSkip.konsekuensi.kembaliHariMax)
          jadwal = [
            ...jadwal,
            {
              id: `jadwal_terlantar_${s.hari}_${pasienSkip.id}`,
              hari: jatuhTempo,
              jenis: 'pasien_kembali',
              pasienId: pasienSkip.id,
              kasusId: pasienSkip.kasusId,
              catatan: `${pasienSkip.nama} — kemarin dilewatkan di antrian. ${kasusSkip.konsekuensi.kondisiKembali}`,
              nama: pasienSkip.nama,
              usia: pasienSkip.usia,
              jenisKelamin: pasienSkip.jenisKelamin,
              rw: pasienSkip.rw,
              bpjs: pasienSkip.bpjs,
              persona: pasienSkip.persona,
              ...(pasienSkip.keluargaId ? { keluargaId: pasienSkip.keluargaId } : {}),
              ...(pasienSkip.prolanisPesertaId ? { prolanisPesertaId: pasienSkip.prolanisPesertaId } : {}),
            },
          ]
        }
      }
    }
    return {
      state: {
        ...s,
        blok: 'siang',
        layar: s.hari >= HARI_BUKA_PETA ? 'peta' : 'meja',
        tally: { ...s.tally, autoBermasalah: s.tally.autoBermasalah + bermasalah },
        jadwal,
        klinik: {
          ...s.klinik,
          antrian: [],
          autoHariIni: { jumlah: s.klinik.autoHariIni.jumlah + sisa, bermasalah: s.klinik.autoHariIni.bermasalah + bermasalah },
        },
      },
      events: [{ type: 'BLOK_BERGANTI', blok: 'siang' }],
    }
  }

  if (s.blok === 'siang') {
    return {
      state: { ...s, blok: 'sore', layar: 'meja' },
      events: [{ type: 'BLOK_BERGANTI', blok: 'sore' }],
    }
  }

  // SORE → tidur → hari baru
  return hariBaru(s, pack)
}

/** Pool IGD kanonik: policy-filtered lalu diurutkan sebelum rng.pick(). */
export function daftarKasusIgdAktif(s: GameState, pack: ContentPack) {
  return Object.values(pack.kasusIgd)
    .filter((kasus) =>
      encounterArchetypeAktif(pack, 'igd', kasus.id, s.mode, s.contentRelease),
    )
    .sort((a, b) => a.id.localeCompare(b.id))
}

function hariBaru(s: GameState, pack: ContentPack): HasilAdvance {
  const hari = s.hari + 1

  // M4.5 — AKHIR STASE: melewati hari terakhir mode ini mengunci skor.
  // Ujian: D30 (instrumen dinilai). Karier: D90. Setelah tamat, LANJUTKAN
  // ditolak; membaca surat/rapor/dex tetap boleh. Sinematik penutup = M5.
  if (hari > HARI_STASE[s.mode]) {
    // M10.5 #12 (2026-07-12): jadwal karma_igd yang masih PENDING saat stase
    // tamat dulu diam-diam terlantar — blok "Proses jadwal jatuh tempo" di
    // bawah TAK PERNAH tercapai lewat cabang ini (early return), jadi keluarga
    // yang jendela-karmanya belum matang tapi dokter tak pernah menyelamatkan
    // lolos tanpa konsekuensi apa pun hanya karena stase keburu habis. Force-
    // evaluate SEKARANG (mutasi sama persis blok normal di bawah), sebelum
    // skor dibekukan — tanpa surat/pasienKembali (tak ada lagi waktu bermain
    // utk memprosesnya).
    let tallyFlush = s.tally
    let keluargaFlush = s.desa.keluarga
    const jadwalSisaFlush: typeof s.jadwal = []
    for (const j of s.jadwal) {
      if (
        j.jenis === 'karma_igd' &&
        j.keluargaId &&
        j.kasusId &&
        pack.kasus[j.kasusId] &&
        encounterArchetypeAktif(pack, 'clinic', j.kasusId, s.mode, s.contentRelease)
      ) {
        const kelContent = pack.keluarga[j.keluargaId]
        const kel = keluargaFlush[j.keluargaId]
        if (kelContent && kel && kel.arcSelesai !== 'berhasil') {
          const { karmaAktif: _lewat, ...kelGagal } = kel
          keluargaFlush = { ...keluargaFlush, [j.keluargaId]: { ...kelGagal, arcSelesai: 'gagal' } }
          tallyFlush = { ...tallyFlush, karmaTerjadi: tallyFlush.karmaTerjadi + 1 }
          continue
        }
      }
      // Bug hunt 2026-08-01: verifikasi_pispk yang masih PENDING saat stase
      // tamat punya bug PERSIS sama seperti karma_igd di atas (M10.5 #12) —
      // early return ini mendahului blok "Proses jadwal jatuh tempo" normal,
      // jadi janji indikator warga yang belum jatuh tempo lolos tanpa pernah
      // diverifikasi, membeku permanen dgn sumber:'janji' (IKS optimis yang
      // tak pernah dikoreksi/dikonfirmasi). Force-evaluate dgn RNG turunan
      // yang SAMA (seed+id jadwal, bukan bergantung hari) — hasilnya identik
      // dgn seandainya diproses persis di hari jatuh temponya. Tanpa surat,
      // sama seperti karma_igd (tak ada lagi waktu bermain utk memprosesnya).
      if (j.jenis === 'verifikasi_pispk' && j.keluargaId && j.indikatorJanji) {
        const kelContent = pack.keluarga[j.keluargaId]
        const kel = keluargaFlush[j.keluargaId]
        if (kelContent && kel) {
          const rngJanji = new Rng(s.seed, 'verifikasi-janji', j.id)
          const indikator = { ...kel.indikator }
          let adaIngkar = false
          for (const ind of j.indikatorJanji) {
            const nilai = indikator[ind]
            if (nilai.sumber !== 'janji') continue
            const ditepati = rngJanji.chance(peluangJanjiDitepati(kel.trust))
            if (!ditepati) adaIngkar = true
            indikator[ind] = ditepati
              ? { status: 'ya', statusSebenarnya: 'ya', sumber: 'dokter', hariData: s.hari }
              : {
                  status: nilai.statusSebenarnya,
                  statusSebenarnya: nilai.statusSebenarnya,
                  sumber: 'dokter',
                  hariData: s.hari,
                }
          }
          // Audit 2026-08-04 (rev 64→65): blok ini dulu HANYA mengoreksi
          // indikator dan membiarkan `arcSelesai: 'berhasil'` — padahal
          // komentar di atas berjanji "hasilnya identik dgn seandainya
          // diproses persis di hari jatuh temponya", dan jalur hari-jatuh-
          // tempo (lihat ~3027) MENCABUT arcSelesai saat warga ingkar.
          // Akibatnya keluarga yang baru terbukti TIDAK berubah tetap tampil
          // "PENDAMPINGAN TUNTAS" di kartu keluarga, "Berubah" di Laporan
          // Akhir, dan ikut dihitung lencana sahabat_desa. Diverifikasi
          // empiris: keluarga & seed & id-jadwal identik, hanya beda hari —
          // hari 19→20 mencabut, hari 30→31 tidak.
          //
          // Sengaja TIDAK memulihkan `arcIndex`/`followUpHari` seperti jalur
          // harian: pemulihan itu gunanya membuka kembali jalur kunjungan
          // yang bisa dimainkan, sedangkan di sini stase sudah tamat — tak
          // ada lagi waktu bermain. Yang diperbaiki murni kejujuran status.
          const kelBaru: KeluargaState = { ...kel, indikator }
          if (adaIngkar && kel.arcSelesai === 'berhasil') {
            const { arcSelesai: _selesaiLama, ...kelTanpaKlaim } = kelBaru
            keluargaFlush = { ...keluargaFlush, [j.keluargaId]: kelTanpaKlaim }
          } else {
            keluargaFlush = { ...keluargaFlush, [j.keluargaId]: kelBaru }
          }
          continue
        }
      }
      jadwalSisaFlush.push(j)
    }
    const s0 = {
      ...s,
      tally: tallyFlush,
      desa: { ...s.desa, keluarga: keluargaFlush },
      jadwal: jadwalSisaFlush,
    }
    const skor = hitungSkor(s0)
    const surat: Surat = {
      id: `surat_tamat_${s.hari}`,
      hari: s.hari,
      jenis: 'sistem',
      dari: s.mode === 'ujian' ? 'Koordinator Stase IKM' : 'dr. Harsono, Kepala Puskesmas',
      judul:
        s.mode === 'ujian'
          ? `STASE UJIAN SELESAI — skor terkunci: ${skor.total.toFixed(1)} (${skor.grade})`
          : `Sembilan puluh hari — terima kasih, Dokter`,
      isi:
        s.mode === 'ujian'
          ? `${HARI_STASE.ujian} hari stase ujianmu selesai. Skor akhir terkunci: UKP ${skor.ukp.toFixed(1)}/35 · UKM ${skor.ukm.toFixed(1)}/35 · Manajemen ${skor.manajemen.toFixed(1)}/15 · Resiliensi ${skor.resiliensi.toFixed(1)}/15 — total ${skor.total.toFixed(1)} (${skor.gradeLabel}). ${s.paketUjian ? `Paket: ${s.paketUjian}. ` : ''}Hasil ini yang disetorkan ke kampus — tidak ada yang bisa diubah lagi, sebagaimana keputusan klinis yang sudah diambil.`
          : `Stase 90 harimu di Sukamaju selesai dengan skor ${skor.total.toFixed(1)} (${skor.gradeLabel}). Desa ini akan mengingat dokternya — dan rapormu mencatatnya. Lihat Rapor untuk rincian empat dimensi.`,
      dibaca: false,
    }
    return {
      state: {
        ...s0,
        // Snapshot BEKU 4 dimensi (CODEX M14 #1) — jadi acuan tunggal
        // LaporanAkhir/Rapor pasca-tamat, tak bisa tercampur nilai live.
        tamat: { hari: s.hari, grade: skor.grade, skor },
        layar: 'laporan',
        klinik: { ...s0.klinik, antrian: [], aktif: undefined },
        kunjungan: undefined,
        kegiatan: undefined,
        igd: undefined,
        inbox: [...s0.inbox, surat],
      },
      events: [{ type: 'TAMAT', grade: skor.grade }, { type: 'SURAT_MASUK', surat }],
    }
  }

  const events: GameEvent[] = [{ type: 'HARI_BARU', hari }]
  const suratBaru: Surat[] = []

  // Burnout: tidur memulihkan; hari berakhir dgn stamina 0 menaikkan burnout
  const kelelahan = s.stamina === 0
  const burnout = Math.max(0, Math.min(100, s.burnout + (kelelahan ? 12 : -6)))
  const tally = { ...s.tally, hariKelelahan: s.tally.hariKelelahan + (kelelahan ? 1 : 0) }
  let stamina = burnout >= 70 ? STAMINA_MAKS - 2 : burnout >= 40 ? STAMINA_MAKS - 1 : STAMINA_MAKS
  // M4.21 — olahraga akhir pekan memberi tenaga ekstra keesokan hari.
  const bonusStamina = s.flags['bonusStaminaBesok'] === true
  if (bonusStamina) stamina += 1

  // Dex luntur (Leitner): bintang meluntur bila lama tak dilatih.
  // ★3 dibekukan — sekali benar-benar dikuasai, tidak dirampas waktu.
  const dex = { ...s.dex }
  for (const [id, entry] of Object.entries(dex)) {
    if (entry.bintang > 0 && entry.bintang < 3 && hari - entry.terakhirHari >= LUNTUR_BINTANG_HARI) {
      dex[id] = { ...entry, bintang: entry.bintang - 1, terakhirHari: hari }
    }
  }

  // Proses jadwal jatuh tempo
  const jadwalSisa: typeof s.jadwal = []
  const karmaDicegahSetelahVerifikasi = new Set<string>()
  interface PasienJatuhTempo {
    kasusId: string
    pasienId?: string
    episodeId?: string
    catatan?: string
    nama?: string
    usia?: number
    usiaBulan?: number
    jenisKelamin?: 'L' | 'P'
    keluargaId?: string
    rw?: number
    /** M10.b §43: identitas utuh — lihat komentar JadwalItem (state.ts). */
    bpjs?: boolean
    persona?: Persona
    prb?: boolean
    /** Enrolmen Prolanis asal pasien jatuh tempo, bila ada. */
    prolanisPesertaId?: string
    /** Provenance eksplisit agar callback keluarga tidak dipicu follow-up generik. */
    konsekuensiKarma?: boolean
    /** Fix #14: labId hasil yg sudah tersedia, dibawa ke encounter baru. */
    labId?: string
  }
  const pasienKembali: PasienJatuhTempo[] = []
  let keluargaMap = s.desa.keluarga
  let careEpisodes = s.careEpisodes
  for (const j of s.jadwal) {
    if (j.hari > hari) {
      jadwalSisa.push(j)
      continue
    }
    if (j.jenis === 'hasil_lab' && j.labId && j.kasusId) {
      const kasus = pack.kasus[j.kasusId]
      const lab = pack.lab[j.labId]
      const hasilLab = kasus?.lab.find((l) => l.id === j.labId)
      suratBaru.push(
        buatSuratHarian(hari, suratBaru.length, {
          jenis: 'hasil_lab',
          dari: 'Laboratorium Puskesmas',
          judul: `Hasil ${lab?.nama ?? j.labId} — ${j.catatan ?? 'pasien kemarin'}`,
          // Kasus mendefinisikan hasil utk lab yang RELEVAN dengannya. Bila
          // pemain memesan lab di luar itu, suratnya JANGAN kosong — tetapi
          // juga TIDAK BOLEH mengarang "dalam batas rujukan".
          //
          // Playtest 2026-08-04 (dr. Wirayuda) + pengukuran lanjutan: klaim
          // normal yang dikarang bertentangan dengan hasil yang benar-benar
          // ditulis kasus begitu dua pemeriksaan berbagi/berkorelasi analit.
          // Contoh terukur: 10 kasus menulis GDS/GDP abnormal tanpa menulis
          // HbA1c; HbA1c satu-satunya lab berkorelasi yang `hasilBesok`, jadi
          // pasien dgn GDS 320 yang dipesankan HbA1c dulu menerima surat pagi
          // "tidak menunjukkan kelainan bermakna" — mengajarkan hal yang salah
          // pada momen yang justru paling diingat pemain.
          //
          // Sisi layar sudah diperbaiki lebih dulu (LembarPeriksa +
          // content/labTumpangTindih.ts). Ini menutup permukaan terakhir yang
          // masih berbohong. Sengaja diperbaiki sbg KELAS, bukan dgn menulis
          // hasil HbA1c di 10 kasus itu: menentukan nilai HbA1c = menentukan
          // apakah hiperglikemianya kronik atau stres akut, dan itu keputusan
          // klinis penulis kasus, bukan pengembang. Surat kini berhenti
          // mengklaim, dan pesan stewardship-nya dipertahankan.
          isi: hasilLab
            ? `Hasil pemeriksaan ${lab?.nama}: ${hasilLab.hasil}. Nilai rujukan: ${lab?.nilaiNormal}. Cocokkan dengan keputusan interimmu kemarin — inilah kenapa dokter FKTP harus berani menata laksana sambil menunggu hasil.`
            : `Pemeriksaan ${lab?.nama ?? j.labId} tidak tercatat pada berkas pasien ini, sehingga tidak ada nilai yang dapat dilaporkan${lab?.nilaiNormal ? ` (nilai rujukan: ${lab.nilaiNormal})` : ''}. Jangan menganggapnya normal. Timbang indikasi sebelum memesan penunjang: pemeriksaan yang tak mengubah tata laksana adalah beban biaya bagi Puskesmas.`,
        }),
      )
    } else if (j.jenis === 'rujukan_feedback' && j.episodeId && j.kasusId) {
      const episode = careEpisodes.find((item) => item.id === j.episodeId)
      const kasus = pack.kasus[j.kasusId] ?? pack.kasusIgd[j.kasusId]
      const rs = j.rumahSakitId
        ? pack.rumahSakit.find((item) => item.id === j.rumahSakitId)
        : undefined
      if (episode && kasus) {
        careEpisodes = perbaruiEpisode(careEpisodes, {
          id: episode.id,
          day: hari,
          subjectId: episode.subjectId,
          subjectName: episode.subjectName,
          ...(episode.familyId ? { familyId: episode.familyId } : {}),
          ...(episode.rw !== undefined ? { rw: episode.rw } : {}),
          source: episode.source,
          problemId: episode.problemId,
          problemLabel: episode.problemLabel,
          owner: 'rs',
          status: 'dirujuk',
          signal: episode.receipt.signal,
          ...(episode.receipt.decision ? { decision: episode.receipt.decision } : {}),
          feedback: j.feedbackRujukan ?? `${rs?.nama ?? 'RS rujukan'} menyelesaikan pelayanan.`,
          nextAction: 'Tunggu ringkasan pelayanan masuk ke meja kerja FKTP.',
          dueDay: hari,
          referral: { ...(episode.referral ?? { stage: 'completed' }), stage: 'completed', hospitalName: rs?.nama },
          eventLabel: 'Pelayanan rujukan selesai',
          eventDetail: `${rs?.nama ?? 'RS rujukan'} menyelesaikan pelayanan ${kasus.nama}.`,
        })
        const completed = careEpisodes.find((item) => item.id === episode.id)!
        careEpisodes = perbaruiEpisode(careEpisodes, {
          id: completed.id,
          day: hari,
          subjectId: completed.subjectId,
          subjectName: completed.subjectName,
          ...(completed.familyId ? { familyId: completed.familyId } : {}),
          ...(completed.rw !== undefined ? { rw: completed.rw } : {}),
          source: completed.source,
          problemId: completed.problemId,
          problemLabel: completed.problemLabel,
          owner: 'dokter',
          status: 'kembali',
          signal: completed.receipt.signal,
          ...(completed.receipt.decision ? { decision: completed.receipt.decision } : {}),
          ...(completed.receipt.feedback ? { feedback: completed.receipt.feedback } : {}),
          nextAction: 'Baca ringkasan RS dan masukkan hasilnya ke rencana perawatan FKTP.',
          dueDay: hari,
          referral: { ...(completed.referral ?? { stage: 'feedback' }), stage: 'feedback', hospitalName: rs?.nama },
          eventLabel: 'Umpan balik kembali ke FKTP',
          eventDetail: 'Ringkasan pelayanan tersedia di Kotak Masuk dan menunggu dibaca.',
        })
        suratBaru.push(
          buatSuratHarian(hari, suratBaru.length, {
            jenis: 'kabar_warga',
            dari: rs?.nama ?? 'RS rujukan',
            judul: `Umpan balik rujukan - ${j.nama ?? episode.subjectName}`,
            isi: `${j.feedbackRujukan ?? `${rs?.nama ?? 'RS rujukan'} menyelesaikan pelayanan ${kasus.nama}.`} Baca ringkasan ini untuk memasukkannya ke rencana perawatan FKTP dan menuntaskan rujukan.`,
            ...(j.keluargaId ? { kaitKeluargaId: j.keluargaId } : {}),
            episodeId: episode.id,
          }),
        )
      }
    } else if (j.jenis === 'pasien_kembali' && j.bedRetry && j.kasusId && j.rumahSakitId) {
      // CODEX audit pasca-GM (2026-07-13, temuan #11): resolusi PASIF — tak
      // pernah masuk `pasienKembali` (yang jadi encounter klinik penuh lagi).
      // Keputusan klinis sudah tepat & sudah ditally di titik rujuk asli;
      // di sini murni re-roll kapasitas bed, sampai diterima atau
      // MAKS_RETRY_BED_PENUH tercapai (dipaksa terima).
      const rs = pack.rumahSakit.find((r) => r.id === j.rumahSakitId)
      const retryKe = (j.bedRetryKe ?? 0) + 1
      const rngRetry = new Rng(s.seed, 'sisrute-retry', j.id, retryKe)
      const rollBerhasil = !rs || rngRetry.chance(Math.min(0.95, 0.5 + rs.bedDasar * 0.06))
      const dipaksaTerima = !rollBerhasil && retryKe >= MAKS_RETRY_BED_PENUH
      if (rollBerhasil || dipaksaTerima) {
        const kasus = pack.kasus[j.kasusId]
        suratBaru.push(
          buatSuratHarian(hari, suratBaru.length, {
            jenis: 'kabar_warga',
            dari: rs?.nama ?? 'RS rujukan',
            judul: `Bed tersedia — ${j.nama ?? 'pasien'} akhirnya diterima`,
            isi: dipaksaTerima
              ? `${rs?.nama ?? 'RS rujukan'} memaksa menerima ${j.nama ?? 'pasien'} setelah ${retryKe} hari mengantre bed. Jejaring akan mengirim hasil pelayanan atau rencana PRB kembali ke FKTP.`
              : `${rs?.nama ?? 'RS rujukan'} kini punya bed kosong; ${j.nama ?? 'pasien'} sudah diterima. Jejaring akan mengirim hasil pelayanan atau rencana PRB kembali ke FKTP.`,
            ...(j.keluargaId ? { kaitKeluargaId: j.keluargaId } : {}),
          }),
        )
        if (kasus) {
          if (kasus.bisaPrb) {
            const rngPrb = new Rng(s.seed, 'prb-setelah-bed', j.id, hari)
            jadwalSisa.push({
              ...j,
              id: `jadwal_prb_bed_${j.id}`,
              hari: hari + rngPrb.int(7, 12),
              bedRetry: false,
              prb: true,
              catatan: `${j.nama ?? 'Pasien'} - kontrol PRB setelah diterima ${rs?.nama ?? 'RS rujukan'}, lanjutkan terapi di FKTP`,
            })
          } else {
            jadwalSisa.push({
              id: `jadwal_feedback_bed_${j.id}`,
              hari: hari + new Rng(s.seed, 'feedback-setelah-bed', j.id).int(2, 4),
              jenis: 'rujukan_feedback',
              ...(j.pasienId ? { pasienId: j.pasienId } : {}),
              ...(j.episodeId ? { episodeId: j.episodeId } : {}),
              kasusId: j.kasusId,
              ...(j.nama ? { nama: j.nama } : {}),
              rumahSakitId: j.rumahSakitId,
              ...(j.keluargaId ? { keluargaId: j.keluargaId } : {}),
              feedbackRujukan: `${rs?.nama ?? 'RS rujukan'} menyelesaikan pelayanan ${kasus.nama} setelah penundaan kapasitas dan mengirim ringkasan ke FKTP.`,
            })
          }
        }
        const episode = j.episodeId
          ? careEpisodes.find((item) => item.id === j.episodeId)
          : undefined
        if (episode) {
          const followUp = [...jadwalSisa].reverse().find((item) => item.episodeId === episode.id)
          careEpisodes = perbaruiEpisode(careEpisodes, {
            id: episode.id,
            day: hari,
            subjectId: episode.subjectId,
            subjectName: episode.subjectName,
            ...(episode.familyId ? { familyId: episode.familyId } : {}),
            ...(episode.rw !== undefined ? { rw: episode.rw } : {}),
            source: episode.source,
            problemId: episode.problemId,
            problemLabel: episode.problemLabel,
            owner: 'rs',
            status: 'dirujuk',
            signal: episode.receipt.signal,
            ...(episode.receipt.decision ? { decision: episode.receipt.decision } : {}),
            feedback: `${rs?.nama ?? 'RS rujukan'} menerima pasien setelah ${retryKe} kali pemeriksaan kapasitas.`,
            nextAction: kasus?.bisaPrb
              ? `Tunggu resume dan kontrol PRB sekitar hari ${followUp?.hari ?? hari + 7}.`
              : `Tunggu ringkasan pelayanan sekitar hari ${followUp?.hari ?? hari + 2}.`,
            dueDay: followUp?.hari ?? hari + 2,
            referral: { ...(episode.referral ?? { stage: 'accepted' }), stage: 'accepted', hospitalName: rs?.nama },
            eventLabel: 'Rujukan akhirnya diterima',
            eventDetail: dipaksaTerima ? 'Jejaring mengeskalasi penerimaan setelah batas retry.' : 'Bed tersedia pada retry jejaring.',
          })
        }
      } else {
        jadwalSisa.push({ ...j, hari: hari + 1, bedRetryKe: retryKe })
        const episode = j.episodeId
          ? careEpisodes.find((item) => item.id === j.episodeId)
          : undefined
        if (episode) {
          careEpisodes = perbaruiEpisode(careEpisodes, {
            id: episode.id,
            day: hari,
            subjectId: episode.subjectId,
            subjectName: episode.subjectName,
            ...(episode.familyId ? { familyId: episode.familyId } : {}),
            ...(episode.rw !== undefined ? { rw: episode.rw } : {}),
            source: episode.source,
            problemId: episode.problemId,
            problemLabel: episode.problemLabel,
            owner: 'rs',
            status: 'menunggu',
            signal: episode.receipt.signal,
            ...(episode.receipt.decision ? { decision: episode.receipt.decision } : {}),
            feedback: `Bed ${rs?.nama ?? 'RS rujukan'} masih penuh pada retry ke-${retryKe}.`,
            nextAction: `Jejaring mencoba lagi pada hari ${hari + 1}.`,
            dueDay: hari + 1,
            referral: { ...(episode.referral ?? { stage: 'sent' }), stage: 'sent', hospitalName: rs?.nama, note: 'Menunggu bed' },
            eventLabel: 'Kapasitas masih tertunda',
            eventDetail: `Retry ke-${retryKe}; keputusan klinis tetap dinilai tepat.`,
          })
        }
      }
    } else if (j.jenis === 'pasien_kembali' && j.kasusId) {
      pasienKembali.push({
        kasusId: j.kasusId,
        ...(j.pasienId ? { pasienId: j.pasienId } : {}),
        ...(j.episodeId ? { episodeId: j.episodeId } : {}),
        ...(j.catatan ? { catatan: j.catatan } : {}),
        ...(j.nama ? { nama: j.nama } : {}),
        ...(j.usia !== undefined ? { usia: j.usia } : {}),
        ...(j.usiaBulan !== undefined ? { usiaBulan: j.usiaBulan } : {}),
        ...(j.jenisKelamin ? { jenisKelamin: j.jenisKelamin } : {}),
        ...(j.keluargaId ? { keluargaId: j.keluargaId } : {}),
        ...(j.prolanisPesertaId ? { prolanisPesertaId: j.prolanisPesertaId } : {}),
        ...(j.rw !== undefined ? { rw: j.rw } : {}),
        ...(j.bpjs !== undefined ? { bpjs: j.bpjs } : {}),
        ...(j.persona ? { persona: j.persona } : {}),
        ...(j.prb ? { prb: true } : {}),
        ...(j.labId ? { labId: j.labId } : {}),
      })
      const episode = j.episodeId
        ? careEpisodes.find((item) => item.id === j.episodeId)
        : undefined
      if (episode) {
        careEpisodes = perbaruiEpisode(careEpisodes, {
          id: episode.id,
          day: hari,
          subjectId: episode.subjectId,
          subjectName: episode.subjectName,
          ...(episode.familyId ? { familyId: episode.familyId } : {}),
          ...(episode.rw !== undefined ? { rw: episode.rw } : {}),
          source: episode.source,
          problemId: episode.problemId,
          problemLabel: episode.problemLabel,
          owner: 'dokter',
          status: 'kembali',
          signal: episode.receipt.signal,
          ...(episode.receipt.decision ? { decision: episode.receipt.decision } : {}),
          feedback: j.prb
            ? `Resume dan rencana PRB kembali bersama ${j.nama ?? episode.subjectName}.`
            : j.catatan ?? 'Pasien kembali untuk evaluasi klinis.',
          nextAction: `Tangani ${j.nama ?? episode.subjectName} di poli hari ini dan perbarui rencana perawatan.`,
          dueDay: hari,
          ...(j.prb
            ? { referral: { ...(episode.referral ?? { stage: 'feedback' as const }), stage: 'feedback' as const } }
            : episode.referral
              ? { referral: episode.referral }
              : {}),
          eventLabel: j.prb ? 'Pasien kembali melalui PRB' : 'Pasien kembali untuk tindak lanjut',
          eventDetail: j.catatan ?? 'Follow-up jatuh tempo dan masuk antrian pagi.',
        })
      }
    } else if (
      j.jenis === 'karma_igd' &&
      j.keluargaId &&
      j.kasusId &&
      pack.kasus[j.kasusId] &&
      encounterArchetypeAktif(pack, 'clinic', j.kasusId, s.mode, s.contentRelease)
    ) {
      // M10 §49: guard `pack.kasus[j.kasusId]` — jadwal karma di-BAKE sekali di
      // init dari pack; bila patch me-rename/hapus kasusId karma, dulu efek
      // karma (tally.karmaTerjadi, surat "keluarga dibawa", arcSelesai:'gagal',
      // event) tetap MELEDAK padahal korbannya lantas disaring keluar di
      // pasienKembaliValid → jejak yatim (surat menjanjikan pasien yg tak
      // pernah tiba). Kini bila kasus tak ada, seluruh blok karma dilewati:
      // konsekuensi yg tak bisa dimaterialisasi tak boleh menghukum pemain.
      const kelContent = pack.keluarga[j.keluargaId]
      const kel = keluargaMap[j.keluargaId]
      if (kelContent && kel && kel.arcSelesai !== 'berhasil') {
        // Karma terjadi: keluarga gagal, dan yang datang adalah ORANG YANG SAMA
        // dari cerita — konsekuensi bernama, bukan warga acak.
        const { karmaAktif: _lewat, ...kelGagal } = kel
        keluargaMap = { ...keluargaMap, [j.keluargaId]: { ...kelGagal, arcSelesai: 'gagal' } }
        tally.karmaTerjadi += 1
        // M10.b §43: status BPJS pasien karma dari indikator JKN keluarganya
        // SAAT karma menyala (bukan roll 70%) — keluarga berkartu-mati (kelas
        // cerita Bu Marni) anggotanya datang sbg pasien umum; dan bila arc
        // sempat memperbaiki JKN sebelum karma jatuh tempo, itu pun terhormati.
        const jknKeluarga = kel.indikator.jkn?.statusSebenarnya
        pasienKembali.push({
          kasusId: j.kasusId,
          pasienId: j.pasienId ?? `karma_${j.keluargaId}_${j.kasusId}`,
          episodeId: j.episodeId ?? buatEpisodeId('keluarga', j.keluargaId, j.kasusId),
          catatan: j.catatan ?? '',
          keluargaId: j.keluargaId,
          konsekuensiKarma: true,
          rw: kelContent.rw,
          ...(j.nama ? { nama: j.nama } : {}),
          ...(j.usia !== undefined ? { usia: j.usia } : {}),
          ...(j.usiaBulan !== undefined ? { usiaBulan: j.usiaBulan } : {}),
          ...(j.jenisKelamin ? { jenisKelamin: j.jenisKelamin } : {}),
          ...(jknKeluarga === 'ya' || jknKeluarga === 'tidak' ? { bpjs: jknKeluarga === 'ya' } : {}),
        })
        const episodeKarmaId = j.episodeId ?? buatEpisodeId('keluarga', j.keluargaId, j.kasusId)
        const namaPasien = j.nama ?? kelContent.anggota[0]?.nama ?? kelContent.namaKeluarga
        careEpisodes = perbaruiEpisode(careEpisodes, {
          id: episodeKarmaId,
          day: hari,
          subjectId: j.pasienId ?? `karma_${j.keluargaId}_${j.kasusId}`,
          subjectName: namaPasien,
          familyId: j.keluargaId,
          rw: kelContent.rw,
          source: 'keluarga',
          problemId: j.kasusId,
          problemLabel: pack.kasus[j.kasusId]?.nama ?? j.kasusId,
          owner: 'dokter',
          status: 'terdeteksi',
          signal: j.catatan ?? `Risiko keluarga ${kelContent.namaKeluarga} berkembang menjadi kasus klinis.`,
          feedback: 'Kegagalan pencegahan UKM kini tampil sebagai pasien bernama di poli.',
          nextAction: `Tangani ${namaPasien} di poli hari ini; hasil klinik harus kembali ke keluarga.`,
          dueDay: hari,
          eventLabel: 'Risiko keluarga menjadi kasus klinis',
          eventDetail: `${pack.kasus[j.kasusId]?.nama ?? j.kasusId} masuk antrian dari ${kelContent.namaKeluarga}.`,
        })
        suratBaru.push(
          buatSuratHarian(hari, suratBaru.length, {
            jenis: 'karma',
            dari: 'Perawat jaga',
            judul: `${kelContent.namaKeluarga} — dibawa ke Puskesmas subuh tadi`,
            isi: j.catatan ?? `Anggota keluarga ${kelContent.namaKeluarga} memburuk. Mereka menunggumu di antrian pagi ini.`,
            kaitKeluargaId: j.keluargaId,
          }),
        )
        events.push({ type: 'KARMA_TERJADI', narasi: j.catatan ?? 'Sebuah pencegahan yang terlewat menjadi kasus klinis.' })
      }
    } else if (j.jenis === 'verifikasi_pispk' && j.keluargaId && j.indikatorJanji) {
      // #4 outcome-window (audit CODEX UKM 2026-07-16): jendela verifikasi janji
      // perubahan perilaku tiba. Untuk tiap indikator yang MASIH ber-sumber
      // 'janji' (belum diverifikasi langsung oleh dokter): ditepati (peluang
      // fungsi trust) → jadi hasil terverifikasi permanen; ingkar → status balik
      // ke sebenarnya (IKS optimis tadi terkoreksi turun) + surat.
      const kel = keluargaMap[j.keluargaId]
      const kelContent = pack.keluarga[j.keluargaId]
      if (kel && kelContent) {
        const rngJanji = new Rng(s.seed, 'verifikasi-janji', j.id)
        const indikator = { ...kel.indikator }
        const ingkar: IndikatorPisPk[] = []
        for (const ind of j.indikatorJanji) {
          const nilai = indikator[ind]
          if (nilai.sumber !== 'janji') continue // sudah diverifikasi langsung
          if (rngJanji.chance(peluangJanjiDitepati(kel.trust))) {
            indikator[ind] = { status: 'ya', statusSebenarnya: 'ya', sumber: 'dokter', hariData: hari }
          } else {
            indikator[ind] = {
              status: nilai.statusSebenarnya,
              statusSebenarnya: nilai.statusSebenarnya,
              sumber: 'dokter',
              hariData: hari,
            }
            ingkar.push(ind)
          }
        }
        let kelTerverifikasi: KeluargaState = { ...kel, indikator }
        // Bridge B1.2: janji akhir yang ingkar harus membuka jalur recovery
        // yang benar-benar dapat dimainkan. Putar ulang beat terakhir yang
        // menghasilkan janji itu; jangan biarkan surat menyuruh kunjungi lagi
        // sementara arcIndex dan arcSelesai tetap mengunci tombol.
        if (ingkar.length > 0 && kel.arcSelesai === 'berhasil') {
          const arcAktif = arcKunjunganAktif(pack, kelContent, s.mode, s.contentRelease)
          if (arcAktif.length > 0) {
            const { arcSelesai: _selesaiLama, ...kelTerbuka } = kelTerverifikasi
            kelTerverifikasi = {
              ...kelTerbuka,
              arcIndex: arcAktif.length - 1,
              followUpHari: hari,
            }
          }
        }
        const karmaMasihAktif =
          kelTerverifikasi.karmaAktif !== undefined ||
          s.jadwal.some(
            (item) => item.jenis === 'karma_igd' && item.keluargaId === j.keluargaId,
          )
        if (ingkar.length === 0 && karmaMasihAktif) {
          const { karmaAktif: _karmaTuntas, ...kelTanpaKarma } = kelTerverifikasi
          kelTerverifikasi = kelTanpaKarma
          karmaDicegahSetelahVerifikasi.add(j.keluargaId)
          tally.karmaDicegah += 1
          events.push({
            type: 'KARMA_DICEGAH',
            narasi: `Perubahan di keluarga ${kelContent.namaKeluarga} terverifikasi; risiko krisis berhasil ditekan.`,
          })
        }
        keluargaMap = { ...keluargaMap, [j.keluargaId]: kelTerverifikasi }
        const episodeKeluargaId = buatEpisodeId('keluarga', j.keluargaId, 'pendampingan')
        const janjiTepat = j.indikatorJanji.filter((indikatorId) => !ingkar.includes(indikatorId))
        careEpisodes = perbaruiEpisode(careEpisodes, {
          id: episodeKeluargaId,
          day: hari,
          subjectId: j.keluargaId,
          subjectName: kelContent.namaKeluarga,
          familyId: j.keluargaId,
          rw: kelContent.rw,
          source: 'keluarga',
          problemId: `keluarga:${j.keluargaId}`,
          problemLabel: 'Verifikasi perubahan keluarga',
          owner: ingkar.length > 0 ? 'dokter' : 'kader',
          status: ingkar.length > 0 ? 'menunggu' : 'terverifikasi',
          signal: `Janji perubahan ${j.indikatorJanji.map((id) => id.replace(/_/g, ' ')).join(', ')} jatuh tempo.`,
          feedback: ingkar.length > 0
            ? `${ingkar.length} indikator belum terwujud; ${janjiTepat.length} indikator terverifikasi.`
            : `Seluruh ${janjiTepat.length} indikator terverifikasi menjadi perubahan nyata.`,
          nextAction: ingkar.length > 0
            ? `Kunjungi kembali ${kelContent.namaKeluarga}; jalur recovery sudah dibuka.`
            : 'Pertahankan perubahan melalui pemantauan kader dan PWS.',
          dueDay: ingkar.length > 0 ? hari : null,
          eventLabel: ingkar.length > 0 ? 'Janji perlu pendampingan ulang' : 'Perubahan keluarga terverifikasi',
          eventDetail: ingkar.length > 0
            ? `${ingkar.map((id) => id.replace(/_/g, ' ')).join(', ')} belum berjalan.`
            : 'Janji keluarga menjadi outcome terverifikasi.',
        })
        if (ingkar.length > 0) {
          suratBaru.push(
            buatSuratHarian(hari, suratBaru.length, {
              jenis: 'kabar_warga',
              dari: `Kader RW ${kelContent.rw}`,
              judul: `${kelContent.namaKeluarga} — niat baik yang belum terwujud`,
              isi: `Rencana yang disepakati keluarga ${kelContent.namaKeluarga} belum benar-benar berjalan; sebagian indikator kembali seperti semula. Perubahan perilaku butuh pendampingan berulang, bukan sekali janji — kunjungi lagi untuk mengokohkannya.`,
              kaitKeluargaId: j.keluargaId,
            }),
          )
        } else {
          // S7-surat-closure: keberhasilan mendapat penutup yang sama dengan
          // kegagalan. `janjiTepat` bisa memuat indikator yang keburu
          // diverifikasi dokter langsung sebagai 'tidak' (loop di atas men-skip
          // sumber !== 'janji') — saring ke yang statusnya kini 'ya' supaya
          // surat hangat tak pernah memuji perubahan yang tidak terjadi.
          const terwujud = janjiTepat.filter((ind) => indikator[ind].status === 'ya')
          if (terwujud.length > 0) {
            suratBaru.push(
              buatSuratHarian(hari, suratBaru.length, {
                jenis: 'kabar_warga',
                dari: `Kader RW ${kelContent.rw}`,
                judul: `${kelContent.namaKeluarga} — janji yang ditepati`,
                isi: `Kabar baik, Dok: ${terwujud.map((id) => id.replace(/_/g, ' ')).join(', ')} di keluarga ${kelContent.namaKeluarga} kini benar-benar berjalan — bukan lagi sekadar janji. Pendampinganmu berbuah. Kader akan terus memantau supaya kebiasaan baik ini tidak kendur.`,
                kaitKeluargaId: j.keluargaId,
              }),
            )
          }
        }
      }
    }
  }

  // Drift keluarga rawan (M1.3 — versi DIBALIK dari bug lama: memburuk, bukan
  // membaik): keluarga berisiko yang ≥7 hari tak disentuh dokter bisa memburuk.
  // Maks 2 kejadian/pekan, SELALU diberitakan lewat surat kader.
  // Fix #13 (audit CODEX 2026-07-11, adjudikasi 2026-07-12): follow-up
  // mangkir (M1.4) DULU jadi blok terpisah — TTM mundur SEKALI TEMBAK lalu
  // `followUpHari` dihapus, tak ada eskalasi kalau keluarga terus diabaikan
  // sesudahnya. Diperluas: janji follow-up yang >1 hari lewat kini jadi SALAH
  // SATU syarat `rawan` di bawah — followUpHari TIDAK dihapus di sini (baru
  // dibersihkan/diperbarui oleh kunjungan sungguhan lewat terapkanHasil,
  // kunjungan.ts) jadi tetap "rawan" & terus di-roll drift mingguan (bukan
  // diampuni sesudah satu kejadian) sampai dokter benar-benar berkunjung lagi.
  const mingguIni = Math.ceil(hari / 7)
  let drift = s.desa.drift.minggu === mingguIni ? { ...s.desa.drift } : { minggu: mingguIni, jumlah: 0 }
  const rngDrift = new Rng(s.seed, 'drift', hari)
  for (const [id, kel] of Object.entries(keluargaMap)) {
    if (drift.jumlah >= 2) break
    if (kel.arcSelesai) continue
    const kelContent = pack.keluarga[id]
    if (!kelContent) continue
    const followUpMangkir = kel.followUpHari !== undefined && hari > kel.followUpHari + 1
    // Audit CODEX UKM 2026-07-16 #14: keluarga yang SUDAH pernah dikunjungi
    // tetap tanggung jawabmu walau dilepas dari roster — dulu pola
    // "daftarkan → kunjungi → lepas" membuat keluarga kebal drift gratis.
    const rawan =
      s.desa.binaan.includes(id) ||
      kel.karmaAktif !== undefined ||
      followUpMangkir ||
      kel.jumlahKunjungan > 0
    if (!rawan) continue
    const punyaData = Object.values(kel.indikator).some((n) => n.sumber !== 'belum')
    if (!punyaData) continue
    const terakhirDisentuh = kel.kunjunganTerakhir ?? 0
    if (hari - terakhirDisentuh < 7) continue
    // #5 (audit CODEX UKM 2026-07-16): PERISAI DRIFT — keluarga di RW fokus
    // Program Wilayah lebih terlindungi (0.35→0.18). Ini nilai KONKRET program
    // menggantikan bonus IKS abstrak: "fokuskan sebulan pada satu RW" nyata
    // menahan kemerosotan keluarga di sana, bukan sekadar menaikkan angka.
    const kelContentDrift = pack.keluarga[id]
    const terlindungiProgram =
      s.program.fokus !== undefined &&
      s.program.rwFokus !== undefined &&
      kelContentDrift?.rw === s.program.rwFokus
    if (!rngDrift.chance(terlindungiProgram ? 0.18 : 0.35)) continue

    let kelBaru = kel
    let apaYangMemburuk: string
    if (kel.ttm !== 'prekontemplasi') {
      kelBaru = { ...kel, ttm: mundurTtm(kel.ttm) }
      apaYangMemburuk = 'niat berubah mereka mengendur'
    } else {
      // Fix #11b (audit CODEX 2026-07-11): kandidat dulu termasuk sumber
      // 'dokter' — drift MENGUBAH nilai tapi TAK menyentuh field `sumber`,
      // jadi UI tetap berlabel "diverifikasi dokter" walau nilainya sudah
      // berubah diam-diam via drift acak, bukan pemeriksaan dokter yang baru.
      // Dibatasi ke sumber 'kader' (data lapangan yang memang bisa berubah/
      // usang tanpa kunjungan dokter) — data ber-label 'dokter' kini stabil
      // sampai benar-benar diperiksa ulang. Audit bridge pasca-B1 menambah
      // pagar actionability: indikator yang dijatuhkan harus termasuk target
      // beat akhir arc aktif, yakni sesuatu yang gameplay benar-benar dapat
      // pulihkan. Tanpa ini JKN/air bersih acak bisa jatuh permanen pada
      // keluarga yang arc-nya sama sekali tidak menyediakan aksi tersebut.
      const arcAktifDrift = arcKunjunganAktif(pack, kelContent, s.mode, s.contentRelease)
      const targetDapatDipulihkan = new Set<IndikatorPisPk>(arcAktifDrift.at(-1)?.target ?? [])
      const kandidat = Object.entries(kel.indikator).filter(
        ([id, n]) =>
          targetDapatDipulihkan.has(id as IndikatorPisPk) &&
          n.sumber === 'kader' && n.statusSebenarnya === 'ya' && n.status !== 'na',
      )
      if (kandidat.length === 0) continue
      const [indId] = rngDrift.pick(kandidat)
      const lama = kel.indikator[indId as keyof typeof kel.indikator]
      kelBaru = {
        ...kel,
        indikator: {
          ...kel.indikator,
          [indId]: { ...lama, status: 'tidak' as const, statusSebenarnya: 'tidak' as const, hariData: hari },
        },
      }
      apaYangMemburuk = `indikator ${indId.replace(/_/g, ' ')} kembali jatuh`
    }
    keluargaMap = { ...keluargaMap, [id]: kelBaru }
    drift = { ...drift, jumlah: drift.jumlah + 1 }
    suratBaru.push(
      buatSuratHarian(hari, suratBaru.length, {
        jenis: 'kabar_warga',
        dari: 'Kader RW ' + kelContent.rw,
        judul: `${kelContent.namaKeluarga} — kabar kurang baik`,
        isi: `Dok, sudah lama tidak ada yang menengok keluarga ini; ${apaYangMemburuk}. Jarak dan waktu bekerja melawan kita — keluarga rawan yang dibiarkan tidak diam di tempat, mereka mundur.`,
        kaitKeluargaId: id,
      }),
    )
  }

  // Kader bekerja harian (sensus + laporan + kadang salah data)
  const stateSementara: GameState = {
    ...s,
    hari,
    desa: { ...s.desa, keluarga: keluargaMap },
  }
  const kaderHasil = prosesHarianKader(stateSementara, pack, new Rng(s.seed, 'kader', hari))
  keluargaMap = kaderHasil.keluarga
  suratBaru.push(...kaderHasil.surat)

  // Program wilayah agregat (M2.10): fokus bulanan (Triase Anggaran, PSN/PHBS/
  // skrining) yang ditetapkan dokter bekerja tiap hari — menekan penularan
  // (buang 1 entri surveilans yang cocok) & menaikkan bonus IKS RW fokus
  // sedikit demi sedikit.
  let surveilans = pangkasSurveilans(s.desa.surveilans, hari)
  let rwSetelahProgram = kaderHasil.rw
  if (s.program.fokus) {
    const fokus = s.program.fokus
    const targetKasus = TARGET_KASUS_PROGRAM[fokus]
    // Audit CODEX UKM 2026-07-16 #3: tanpa rwFokus, supresi dulu berlaku
    // GLOBAL (RW mana pun) — kini Program Wilayah tanpa lokasi tidak meredam
    // apa-apa; efeknya eksplisit terikat ke RW fokus, sesuai namanya.
    const idxRedam =
      s.program.rwFokus === undefined
        ? -1
        : surveilans.findIndex(
            (e) => targetKasus.includes(e.kasusId) && e.rw === s.program.rwFokus,
          )
    if (idxRedam >= 0) surveilans = surveilans.filter((_, i) => i !== idxRedam)
    // #5 (audit CODEX UKM 2026-07-16): DULU program juga menyuntik +0.004 IKS/
    // hari ke RW fokus — "mata uang hadiah" yang menaikkan skor tanpa menyentuh
    // kesehatan keluarga. Dihapus: nilai program kini KONKRET — pemutusan
    // penularan (surveilans di atas) + PERISAI DRIFT bagi keluarga RW fokus
    // (di loop drift bawah membaca s.program.rwFokus). Tak ada angka abstrak.
  }

  // Surveilans (M1.2): deteksi KLUSTER BARU — pola di poli jadi kabar di peta
  // (satu surat per kluster per RW). Kluster ≥ambang juga membuka Respons KLB.
  const flags = { ...s.flags }
  for (const c of hitungCluster(surveilans, hari, ambangKlusterPack(pack))) {
    const kunciFlag = `cluster_${c.kasusId}_rw${c.rw}`
    if (flags[kunciFlag]) continue
    flags[kunciFlag] = true
    const namaKasus = pack.kasus[c.kasusId]?.nama ?? c.kasusId
    const namaRw = pack.rw.find((r) => r.nomor === c.rw)?.nama ?? `RW ${c.rw}`
    const episodeKlusterId = buatEpisodeId('surveilans', `rw${c.rw}`, c.kasusId)
    careEpisodes = perbaruiEpisode(careEpisodes, {
      id: episodeKlusterId,
      day: hari,
      subjectId: `rw${c.rw}`,
      subjectName: `Warga ${namaRw}`,
      rw: c.rw,
      source: 'surveilans',
      problemId: c.kasusId,
      problemLabel: `Kluster ${namaKasus}`,
      owner: 'program',
      status: 'terdeteksi',
      signal: `${c.jumlah} kasus ${namaKasus} tercatat dari ${namaRw} dalam 14 hari.`,
      feedback: 'Diagnosis individual di poli telah membentuk sinyal populasi di PWS.',
      nextAction: hari >= HARI_BUKA_KLB[s.mode]
        ? `Gelar Respons KLB di RW ${c.rw} dan pilih pengendalian sesuai transmisi.`
        : `Pantau pola dan siapkan respons wilayah; modul KLB terbuka hari ${HARI_BUKA_KLB[s.mode]}.`,
      dueDay: Math.max(hari, HARI_BUKA_KLB[s.mode]),
      eventLabel: 'Sinyal klinik menjadi alarm wilayah',
      eventDetail: `${c.jumlah} kasus melewati ambang kluster ${namaKasus}.`,
    })
    suratBaru.push(
      buatSuratHarian(hari, suratBaru.length, {
        jenis: 'laporan_kader',
        dari: 'Petugas Surveilans',
        judul: `SINYAL KLUSTER — ${namaKasus} di ${namaRw}`,
        isi: `${c.jumlah} kasus ${namaKasus} dari ${namaRw} tercatat di poli dalam 14 hari terakhir. Ini bukan kebetulan, Dok — ada sumbernya di lapangan. Poli mengobati satu-satu; yang menghentikan penularan adalah tindakan di wilayah. Prioritaskan kunjungan/pembinaan ke RW itu.`,
        episodeId: episodeKlusterId,
      }),
    )
  }

  // KBK riil (M1.5) + LAPORAN BULANAN (M4.19): tiap awal bulan (hari 31, 61)
  // kapitasi BPJS masuk ber-pengali KBK, biaya operasional dipotong, dan buku
  // kas bulan lalu dilaporkan. Kas di bawah ambang → teguran Dinkes (Manajemen).
  let kapitasi = s.kapitasi
  let keuanganBulan = s.keuanganBulan
  if (hari > 1 && hari % SIKLUS_LAPORAN_BULANAN[s.mode] === 1) {
    const rwBerdata = kaderHasil.rw.filter((r) => r.iks > 0)
    const iksDesa = rwBerdata.length > 0 ? rwBerdata.reduce((jml, r) => jml + r.iks, 0) / rwBerdata.length : 0
    // M10.5 Fase 3 (2026-07-12, soak-final kalibrasi): ambang lama (>0.8/>=0.5)
    // dulu MATEMATIS MUSTAHIL sejak formula IKS resmi (#5) — ceiling realistis
    // bahkan dgn seluruh keluarga binaan 'sehat' + bonusIks maks di SETIAP RW
    // cuma ~0.50, dan throughput nyata (kunci TETAPKAN_PROGRAM 1 RW/bulan)
    // membuat ceiling praktis karier ~0.25. Diverifikasi soak 15-seed: 0 dari
    // 3600 hari sampel pernah lolos dari tingkat 0.8x. Ambang 0.20/0.30 hasil
    // kalibrasi itu masih meleset di tingkat atas — S5-iks-prolanis (2026-08-01,
    // REVISI_ENGINE 62): dihitung ulang dari konten aktual (totalKk per RW
    // 28/27/26/25/24/26/22/22; baseline sehat 0.2/0.12/0.06; 2 binaan/RW):
    // tanpa usaha iksDesa ≈ 0.125; SEMUA 16 binaan 'sehat' tanpa bonus ≈ 0.205;
    // ceiling praktis + bonus posyandu/KLB/kalender rutin ≈ 0.24-0.26 — jadi
    // 1.3x di ambang 0.30 nyaris mustahil. Ambang baru: 0.8x di bawah 0.18
    // (malas tetap terhukum), 1.0x mulai 0.18 (permainan baik, ≥12 binaan
    // sehat), 1.3x mulai 0.24 (binaan nyaris tuntas + UKM lapangan konsisten —
    // tercapai dengan permainan kuat, tapi tidak gratis).
    const pengali = iksDesa >= 0.24 ? 1.3 : iksDesa >= 0.18 ? 1.0 : 0.8
    const masukan = Math.round(6_000_000 * pengali)
    kapitasi += masukan - OPERASIONAL_BULANAN
    suratBaru.push(
      buatSuratHarian(hari, suratBaru.length, {
        jenis: 'sistem',
        dari: 'BPJS Kesehatan',
        // Fix #10 (adjudikasi DeepThink 2026-07-11, ronde CODEX-31, opsi O-C):
        // label sebelumnya menyiratkan ini formula KBK BPJS riil (3-indikator:
        // AK/RRNS/RPPT) padahal murni proksi rata-rata IKS desa (PIS-PK) —
        // teks-saja, TAK menyentuh matematika pengali/masukan.
        // Copy-audit 2026-08-01: disclaimer kejujuran desain dipindah ke catatan
        // penutup (bukan di tengah kalimat bersuara BPJS), akronim dieja penuh.
        judul: `Kapitasi bulan ini: Rp ${masukan.toLocaleString('id-ID')} (pengali kinerja ×${pengali})`,
        isi: `Pembayaran kapitasi diterima. Pengali bulan ini ×${pengali}, ditentukan oleh rata-rata Indeks Keluarga Sehat desa binaanmu (${(iksDesa * 100).toFixed(0)}%). ${pengali < 1 ? 'IKS di bawah 0,18 memangkas pendapatan Puskesmas — kerja preventif di lapangan adalah kerja finansial juga.' : pengali > 1 ? 'IKS di atas 0,24 memberi bonus komitmen. Pertahankan.' : 'Naikkan IKS desa ke 0,24 atau lebih untuk pengali 1,3.'} — Catatan simulasi: pengali di sini disederhanakan memakai IKS PIS-PK; formula pembayaran berbasis kinerja BPJS yang sebenarnya memakai Angka Kontak, Rasio Rujukan Non-Spesialistik, dan Rasio Peserta Prolanis Terkendali.`,
      }),
    )
    suratBaru.push(
      buatSuratHarian(hari, suratBaru.length, {
        jenis: 'sistem',
        dari: 'Bendahara Puskesmas',
        judul: `Laporan keuangan bulanan — saldo Rp ${kapitasi.toLocaleString('id-ID')}`,
        isi:
          `Rekap bulan lalu — Pemasukan kapitasi: Rp ${masukan.toLocaleString('id-ID')} (proksi PIS-PK ×${pengali}). ` +
          `Belanja obat darurat (stok kosong): Rp ${keuanganBulan.belanjaObat.toLocaleString('id-ID')}. ` +
          `Pengadaan gudang: Rp ${keuanganBulan.belanjaPengadaan.toLocaleString('id-ID')}. ` +
          `Operasional (listrik, ATK, BBM): Rp ${OPERASIONAL_BULANAN.toLocaleString('id-ID')}. ` +
          `Saldo kas: Rp ${kapitasi.toLocaleString('id-ID')}. ${kapitasi < AMBANG_TEGURAN_KAS ? 'PERHATIAN: saldo di bawah ambang sehat — laporan ini diteruskan ke Dinkes.' : 'Kas sehat.'}`,
      }),
    )
    if (kapitasi < AMBANG_TEGURAN_KAS) {
      tally.teguranDinkes += 1
      suratBaru.push(
        buatSuratHarian(hari, suratBaru.length, {
          jenis: 'teguran_kapus',
          dari: 'Dinas Kesehatan Kabupaten',
          judul: 'TEGURAN — kas Puskesmas di bawah ambang sehat',
          isi: `Saldo kas Rp ${kapitasi.toLocaleString('id-ID')} berada di bawah ambang operasional aman (Rp ${AMBANG_TEGURAN_KAS.toLocaleString('id-ID')}). Periksa pola belanja obat & rujukan: stewardship yang buruk selalu tampak di pembukuan lebih dulu sebelum tampak di pasien. Teguran ini tercatat di penilaian manajemen.`,
        }),
      )
    }
    keuanganBulan = { belanjaObat: 0, belanjaPengadaan: 0 }
  }

  // M4.18 — pesanan obat tiba pagi ini: stok bertambah + surat penerimaan.
  let gudang = s.gudang
  const tiba = gudang.pesanan.filter((p) => p.tibaHari <= hari)
  if (tiba.length > 0) {
    const stokBaru = { ...gudang.stok }
    for (const p of tiba) stokBaru[p.obatId] = (stokBaru[p.obatId] ?? 0) + p.jumlah
    gudang = { stok: stokBaru, pesanan: gudang.pesanan.filter((p) => p.tibaHari > hari) }
    suratBaru.push(
      buatSuratHarian(hari, suratBaru.length, {
        jenis: 'sistem',
        dari: 'Instalasi Farmasi',
        judul: `Kiriman obat tiba — ${tiba.length} item`,
        isi: `Pengadaan diterima pagi ini: ${tiba.map((p) => `${pack.obat[p.obatId]?.nama ?? p.obatId} ×${p.jumlah}`).join(', ')}. Stok gudang diperbarui.`,
      }),
    )
  }
  // Peringatan stok menipis — sekali saja saat pertama kali terjadi (anti-spam;
  // pemantauan rutin lewat panel Gudang Obat di Meja Kerja).
  if (!flags['suratStokMenipis']) {
    const menipis = Object.entries(gudang.stok).filter(([, n]) => n <= 3)
    if (menipis.length > 0) {
      flags['suratStokMenipis'] = true
      suratBaru.push(
        buatSuratHarian(hari, suratBaru.length, {
          jenis: 'teguran_kapus',
          dari: 'Instalasi Farmasi',
          judul: 'Stok obat menipis — mulai kelola gudang',
          isi: `Beberapa obat tinggal ≤3 unit (${menipis.slice(0, 4).map(([id]) => pack.obat[id]?.nama ?? id).join(', ')}${menipis.length > 4 ? ', …' : ''}). Obat habis = terapi terbatas di poli. Pesan lewat panel Gudang Obat di Meja Kerja — kiriman supplier butuh ${LEAD_TIME_OBAT} hari. Dokter FKTP yang baik menghitung stok seperti menghitung dosis.`,
        }),
      )
    }
  }

  // M4.20 — Akreditasi: pengumuman + visitasi mengaudit REKAM MEDISMU sendiri
  // (proporsi encounter dengan SOAP lengkap dari action-log/tally). Karier
  // (90 hari): D50 pengumuman / D60 visitasi. Fix Q1/O-C (CODEX-31 §65,
  // 2026-07-12): dulu HANYA `hari===50`/`hari===60` literal — di mode Ujian
  // (30 hari) gerbang ini TAK PERNAH nyala krn game sudah tamat sebelum hari
  // 60. Hari diskalakan proporsional thd `HARI_STASE[mode]` (sama pola dgn
  // `EKSPEKTASI_KUNJUNGAN_UJIAN` di scoring.ts) — mekanismenya sendiri
  // (`rmLengkap` ratio → predikat) TAK diubah, reuse penuh sesuai keputusan.
  let akreditasi = s.akreditasi
  if (hari === HARI_PENGUMUMAN_AKREDITASI[s.mode]) {
    suratBaru.push(
      buatSuratHarian(hari, suratBaru.length, {
        jenis: 'sistem',
        dari: 'Dinas Kesehatan Kabupaten',
        judul: `PEMBERITAHUAN — visitasi akreditasi hari ke-${HARI_VISITASI_AKREDITASI[s.mode]}`,
        isi: `Tim surveior akan menilai KELENGKAPAN REKAM MEDIS poli (anamnesis, pemeriksaan, terapi, edukasi — SOAP utuh, bukan sekadar diagnosis benar). ${HARI_VISITASI_AKREDITASI[s.mode] - hari} hari lagi. Rekam medis yang kamu tulis sejak hari pertama adalah berkas ujiannya — tidak ada yang bisa dikebut semalam.`,
      }),
    )
  }
  if (hari === HARI_VISITASI_AKREDITASI[s.mode] && akreditasi === undefined) {
    const rasio = tally.totalPasien > 0 ? tally.rmLengkap / tally.totalPasien : 0
    akreditasi = rasio >= 0.75 ? 'paripurna' : rasio >= 0.55 ? 'utama' : 'madya'
    const label = akreditasi.toUpperCase()
    suratBaru.push(
      buatSuratHarian(hari, suratBaru.length, {
        jenis: akreditasi === 'madya' ? 'teguran_kapus' : 'pujian_kapus',
        dari: 'Ketua Tim Surveior Akreditasi',
        judul: `HASIL AKREDITASI: ${label} (rekam medis lengkap ${(rasio * 100).toFixed(0)}%)`,
        isi:
          `Dari ${tally.totalPasien} pasien yang kamu tangani, ${tally.rmLengkap} rekam medisnya lengkap SOAP (${(rasio * 100).toFixed(0)}%). ` +
          (akreditasi === 'paripurna'
            ? 'Predikat PARIPURNA — dokumentasi klinismu layak jadi contoh puskesmas lain. Nilai manajemenmu terangkat.'
            : akreditasi === 'utama'
              ? 'Predikat UTAMA — solid, dengan ruang perbaikan pada kelengkapan edukasi & pemeriksaan.'
              : 'Predikat MADYA — banyak rekam medis bolong. Rekam medis bukan formalitas: ia alat komunikasi antar-tenaga kesehatan dan pelindung hukummu sendiri. Nilai manajemen terpangkas.'),
      }),
    )
  }

  // Bridge B1.4: roster memuat enrolmen per masalah, tetapi `orangId` menjaga
  // hitungan manusia dan bottleneck tetap per orang. Rekonsiliasi setelah hari
  // buka memperkaya save legacy dengan komorbid yang dulu terpotong, idempotent.
  let prolanis = s.prolanis
  if (hari >= HARI_BUKA_PROLANIS[s.mode]) {
    const rosterKanonik = bentukRosterProlanis(pack, new Rng(s.seed, 'prolanis-roster'))
    if (prolanis.roster.length === 0) {
      prolanis = { roster: rosterKanonik, sesiBerikutHari: hari }
      const jumlahPeserta = new Set(rosterKanonik.map((p) => p.orangId ?? p.id)).size
      const jumlahKomorbid = rosterKanonik.length - jumlahPeserta
      suratBaru.push(
        buatSuratHarian(hari, suratBaru.length, {
          jenis: 'sistem',
          dari: 'Koordinator Prolanis',
          judul: `Program Prolanis dibuka — ${jumlahPeserta} peserta, ${rosterKanonik.length} masalah aktif`,
          isi:
            `Peserta hipertensi & diabetes terdaftar untuk pemantauan rutin bulanan. ` +
            `Sebagian peserta punya lebih dari satu penyakit kronis, jadi ${jumlahKomorbid} pendaftaran di antaranya milik orang yang sama — tiap penyakit dipantau terpisah, tetapi jumlah orangnya tidak berlipat. ` +
            'Gelar sesi Prolanis di blok siang; kontrol buruk berulang akan berujung ke poli dan hasil kliniknya kembali ke daftar pemantauan.',
        }),
      )
    } else {
      const kanonikById = new Map(rosterKanonik.map((p) => [p.id, p]))
      const rosterDiperkaya = prolanis.roster.map((p) => {
        const kanonik = kanonikById.get(p.id)
        return !p.orangId && kanonik?.orangId ? { ...p, orangId: kanonik.orangId } : p
      })
      const idAda = new Set(rosterDiperkaya.map((p) => p.id))
      const orangAda = new Set(rosterDiperkaya.map((p) => p.orangId ?? p.id))
      const tambahan = rosterKanonik.filter(
        (p) => !idAda.has(p.id) && orangAda.has(p.orangId ?? p.id),
      )
      const berubah = tambahan.length > 0 || rosterDiperkaya.some((p, index) => p !== prolanis.roster[index])
      if (berubah) prolanis = { ...prolanis, roster: [...rosterDiperkaya, ...tambahan] }
    }
  }

  // Lokakarya Mini (M2.11): rapat evaluasi bulanan D31/D61 (karier) — rapor
  // formatif + ghost rival dr. Ratih (data statis, tanpa multiplayer).
  // M10.5 #15 (2026-07-12): diskalakan ke siklus laporan per mode — dulu
  // literal 31/61, tak pernah nyala di mode Ujian 30-hari (D11/D21 kini).
  const siklus = SIKLUS_LAPORAN_BULANAN[s.mode]
  if (hari === siklus + 1 || hari === siklus * 2 + 1) {
    flags['lokminDitutup'] = false
    flags[`lokmin${hari}`] = true
  }

  // Susun antrian pagi: Director + pasien kembali/karma di depan
  const stateUntukDirector: GameState = {
    ...stateSementara,
    dex,
    desa: { ...stateSementara.desa, keluarga: keluargaMap, rw: rwSetelahProgram, kader: kaderHasil.kader, surveilans },
  }
  // Konten bisa berubah antar versi save — buang jadwal dengan kasus tak dikenal.
  const pasienKembaliValid = pasienKembali.filter(
    (p) =>
      pack.kasus[p.kasusId] &&
      encounterArchetypeAktif(pack, 'clinic', p.kasusId, s.mode, s.contentRelease),
  )
  // M4.5: kurikulum (kasus apa) dari seedKurikulum — sama per paket ujian;
  // flavor (wajah pasien) dari seed per-mahasiswa (docs/M45_MODE_UJIAN.md).
  const rngDirector = new Rng(s.seedKurikulum, 'director', hari)
  const antrianDirector = susunAntrianHarian(
    stateUntukDirector,
    pack,
    rngDirector,
    pasienKembaliValid.map((p) => p.kasusId),
    new Rng(s.seed, 'director-flavor', hari),
  )
  const antrianKembali = pasienKembaliValid.map((p, i) =>
    buatPasienDariKasus(p.kasusId, pack, new Rng(s.seed, 'kembali', hari, i), {
      ...(p.pasienId ? { id: p.pasienId } : {}),
      ...(p.episodeId ? { episodeId: p.episodeId } : {}),
      followUpDari: p.catatan ?? 'follow-up',
      ...(p.nama ? { nama: p.nama } : {}),
      ...(p.usia !== undefined ? { usia: p.usia } : {}),
      ...(p.usiaBulan !== undefined ? { usiaBulan: p.usiaBulan } : {}),
      ...(p.jenisKelamin ? { jenisKelamin: p.jenisKelamin } : {}),
      ...(p.keluargaId ? { keluargaId: p.keluargaId } : {}),
      ...(p.prolanisPesertaId ? { prolanisPesertaId: p.prolanisPesertaId } : {}),
      ...(p.rw !== undefined ? { rw: p.rw } : {}),
      ...(p.bpjs !== undefined ? { bpjs: p.bpjs } : {}),
      ...(p.persona ? { persona: p.persona } : {}),
      ...(p.prb ? { prb: true } : {}),
      ...(p.konsekuensiKarma ? { konsekuensiKarma: true } : {}),
      // Fix #14 (audit CODEX 2026-07-11): hasil lab yg sudah tersedia dibawa
      // ke encounter baru — buatEncounter (clinic.ts) pra-isi labDipesan/
      // labTersedia dari field ini, jadi hasilnya langsung terlihat tanpa
      // dokter perlu memesan ulang.
      ...(p.labId ? { labSudahTersedia: p.labId } : {}),
    }),
  )
  const antrian = [...antrianKembali, ...antrianDirector]

  // S7-surat-closure (2026-08-01): lima flag `*BaruTerbuka` DIHAPUS — ditulis
  // tiap unlock tapi tak pernah dibaca siapa pun (UI gating memakai
  // `hari >= HARI_BUKA_*` langsung; satu-satunya kemunculan lain adalah data
  // fixture round-trip di director.test.ts). `rekapSlice` TETAP: dibaca
  // MejaKerja.tsx (modal rekap) dan aksi TUTUP_REKAP. Pengganti yang bermakna:
  // Posyandu & Respons KLB kini DIUMUMKAN lewat surat pada hari bukanya —
  // pola sama dengan surat pembukaan Prolanis. Peta & Kunjungan tidak
  // butuh surat: agendaBesok (mejaKerja/agendaBesok.ts) sudah mengumumkannya
  // semalam sebelumnya, dan surat tutorial hari 1 menyebut Peta terbuka besok.
  if (hari === HARI_REKAP_SLICE) flags['rekapSlice'] = true
  if (hari === HARI_BUKA_POSYANDU[s.mode]) {
    suratBaru.push(
      buatSuratHarian(hari, suratBaru.length, {
        jenis: 'sistem',
        dari: 'Koordinator Kader Posyandu',
        judul: 'Posyandu dibuka — layanan bulanan per RW dimulai',
        isi: `Meja, timbangan, dan buku KIA sudah kami siapkan, Dok. Mulai hari ini Posyandu bisa digelar di tiap RW: buka Peta Desa, pilih RW-nya, lalu tekan "Gelar Posyandu" di blok siang. Satu RW bisa digelar lagi setiap ${COOLDOWN_POSYANDU[s.mode]} hari. Di meja Posyandu kamu memantau balita, ibu hamil, sampai lansia — menangkap masalah tumbuh kembang dan gizi sebelum sempat menjadi pasien poli. Bila harimu padat, sesi bisa didelegasikan ke kader; tetap berjalan, walau tidak seteliti tanganmu sendiri.`,
      }),
    )
  }
  if (hari === HARI_BUKA_KLB[s.mode]) {
    suratBaru.push(
      buatSuratHarian(hari, suratBaru.length, {
        jenis: 'sistem',
        dari: 'dr. Harsono, Kepala Puskesmas',
        judul: 'Respons KLB dibuka — sinyal kluster kini bisa ditindak',
        isi: 'Dokter, mulai hari ini modul Respons KLB aktif. Bila beberapa kasus penyakit yang sama datang dari satu RW dalam 14 hari, Petugas Surveilans mengirim surat sinyal dan penanda KLUSTER merah menyala di RW itu pada Peta Desa. Kini kamu bisa menindaknya: buka RW tersebut lalu tekan "Verifikasi & Respons Sinyal KLB" di blok siang — pastikan dulu sinyalnya nyata, lalu pilih pengendalian sesuai cara penularannya. Poli mengobati satu per satu; yang menghentikan penularan adalah tindakan di wilayah. Jangan biarkan sinyal menua di peta.',
      }),
    )
  }

  // IGD interrupt (M3.14): sesekali pasien gawat tiba subuh — HARUS ditangani
  // sebelum poli buka. Maks 1/hari, mulai hari 4, jeda minimal 4 hari.
  let igd = undefined as GameState['igd']
  let igdHariIni = false
  const igdTerakhir = Object.keys(flags)
    .filter((k) => k.startsWith('igdHari_'))
    .map((k) => Number(k.slice(8)))
    .reduce((maks, h) => Math.max(maks, h), 0)
  // M4.5: kedatangan + pemilihan kasus IGD = kurikulum; identitas pasien = flavor.
  // M5.22: peluang naik per fase (0.12 → 0.15 → 0.20) — tekanan penuh di akhir.
  const rngIgd = new Rng(s.seedKurikulum, 'igd', hari)
  const poolIgd = daftarKasusIgdAktif(s, pack)
  const paketUjian = s.mode === 'ujian' ? paketUjianDariId(s.paketUjian) : undefined
  const kasusIgdTerjadwal = paketUjian
    ? pack.kasusIgd[examIgdCaseIdForDay(pack, paketUjian, hari) ?? '']
    : undefined
  const kasusIgdAcak =
    s.mode !== 'ujian' &&
    hari >= 4 &&
    poolIgd.length > 0 &&
    hari - igdTerakhir >= 4 &&
    rngIgd.chance(peluangIgd(hari, s.mode))
      ? rngIgd.pick(poolIgd)
      : undefined
  const kasusIgd = kasusIgdTerjadwal ?? kasusIgdAcak
  if (kasusIgd) {
    igd = buatIgd(kasusIgd, pack, new Rng(s.seed, 'igd-flavor', hari))
    igdHariIni = true
    flags[`igdHari_${hari}`] = true
    suratBaru.push(
      buatSuratHarian(hari, suratBaru.length, {
        jenis: 'igd',
        dari: 'Perawat jaga',
        judul: `PASIEN GAWAT — ${igd.pasienNama} di IGD`,
        isi: kasusIgd.pembuka,
      }),
    )
    events.push({ type: 'IGD_TIBA', narasi: `Pasien gawat tiba di IGD: ${kasusIgd.nama}. Tangani sebelum poli!` })
  }

  // Kalender musiman (M3.17): hari-hari bermakna mengirim surat + efek kecil.
  const eventKalender = EVENT_KALENDER[hari]
  if (eventKalender) {
    suratBaru.push(
      buatSuratHarian(hari, suratBaru.length, {
        jenis: 'sistem',
        dari: eventKalender.dari,
        judul: eventKalender.judul,
        isi: eventKalender.isi,
      }),
    )
    if (eventKalender.bonusIksSemua) {
      rwSetelahProgram = rwSetelahProgram.map((r) => ({
        ...r,
        bonusIks: Math.min(0.3, r.bonusIks + eventKalender.bonusIksSemua!),
      }))
    }
  }

  // S3 burnout-rapor (b) — surat ambang burnout dari Kapus: efek mekanis
  // burnout (>=40: stamina pagi -1; >=70: -2, dan insting auto-resolve makin
  // tumpul — lihat pBermasalah di LANJUTKAN pagi) dulu terjadi TANPA sinyal
  // in-world. Latch via flags (pola `suratStokMenipis`) agar tak spam tiap
  // pagi; latch dilepas kembali begitu burnout pagi turun ke bawah ambangnya,
  // sehingga episode burnout berikutnya melahirkan surat baru. Level-latch
  // (bukan banding kemarin-vs-hari-ini) SENGAJA: lonjakan intra-hari (Kode
  // Hitam +15) bisa melewati ambang tanpa pernah "menyeberang" antar-pagi.
  // Blok ini ditempatkan SETELAH semua surat harian lain: id `surat_H_seq`
  // surat yang sudah ada tak pernah bergeser (kompat replay dossier — jejak
  // lama BACA_SURAT/ADOPSI_UMPAN_BALIK tetap resolve; lihat REVISI_ENGINE 62).
  // Deterministik penuh — tanpa rng.
  if (burnout < 70 && flags['suratBurnout70'] === true) flags['suratBurnout70'] = false
  if (burnout < 40 && flags['suratBurnout40'] === true) flags['suratBurnout40'] = false
  if (burnout >= 70 && flags['suratBurnout70'] !== true) {
    flags['suratBurnout70'] = true
    flags['suratBurnout40'] = true // peringatan keras sudah mencakup yang ringan
    suratBaru.push(
      buatSuratHarian(hari, suratBaru.length, {
        jenis: 'teguran_kapus',
        dari: 'dr. Harsono, Kepala Puskesmas',
        judul: 'PERINGATAN — kelelahanmu sudah membebani pasien',
        isi: `Dokter, ini bukan lagi pengingat. Kelelahanmu menyentuh ${burnout} dari 100 — dan di tahap ini pelayananlah yang membayar harganya: staminamu berangkat berkurang dua setiap pagi, dan pasien antrean yang tak sempat kamu periksa — yang kamu serahkan ke insting — makin sering pulang membawa masalah yang terlewat. Nilai ketahananmu di rapor ikut tergerus. Saya pernah melihat dokter memaksakan diri sampai pasiennya yang menanggung akibatnya; saya tidak mau melihatnya lagi di puskesmas ini. Kosongkan slot siang akhir pekan terdekat untuk pemulihan — anggap ini instruksi kepala puskesmas, bukan saran.`,
      }),
    )
  } else if (burnout >= 40 && flags['suratBurnout40'] !== true) {
    flags['suratBurnout40'] = true
    suratBaru.push(
      buatSuratHarian(hari, suratBaru.length, {
        jenis: 'teguran_kapus',
        dari: 'dr. Harsono, Kepala Puskesmas',
        judul: 'Jaga tenagamu, Dokter',
        isi: `Dokter, sebentar saja. Saya perhatikan lampu ruanganmu belakangan padam paling akhir. Kelelahanmu menyentuh ${burnout} dari 100, dan tubuhmu mulai menagih: mulai pagi ini staminamu berangkat berkurang satu. Ini belum gawat — tapi jangan menunggu gawat. Tiap hari ke-7, slot siang bisa dipakai pemulihan: tidur siang panjang, olahraga keliling sawah, atau silaturahmi tanpa tas obat. Pakai itu. Dokter yang menjaga dirinya sendiri sedang menjaga pasiennya juga.`,
      }),
    )
  }

  for (const m of suratBaru) events.push({ type: 'SURAT_MASUK', surat: m })

  // Bonus stamina olahraga (M4.21) hanya berlaku satu pagi.
  if (bonusStamina) flags['bonusStaminaBesok'] = false

  return {
    state: {
      ...s,
      hari,
      blok: 'pagi',
      layar: igd ? 'igd' : 'meja',
      stamina,
      burnout,
      tally,
      dex,
      kapitasi,
      gudang,
      keuanganBulan,
      ...(akreditasi !== undefined ? { akreditasi } : {}),
      jadwal: jadwalSisa.filter(
        (item) =>
          !(
            item.jenis === 'karma_igd' &&
            item.keluargaId !== undefined &&
            karmaDicegahSetelahVerifikasi.has(item.keluargaId)
          ),
      ),
      inbox: [...s.inbox, ...suratBaru],
      careEpisodes,
      flags,
      klinik: { antrian, aktif: undefined, selesaiHariIni: [], autoHariIni: { jumlah: 0, bermasalah: 0 } },
      hasilKunjunganHariIni: undefined,
      lapanganTerpakai: false,
      kegiatan: undefined,
      igd,
      igdHariIni,
      prolanis,
      desa: { ...s.desa, keluarga: keluargaMap, rw: rwSetelahProgram, kader: kaderHasil.kader, surveilans, drift },
    },
    events,
  }
}

/* ---------------------------------------------------------------------------
 * KALENDER MUSIMAN (M3.17) — hari bermakna nasional/desa
 * ------------------------------------------------------------------------- */

const EVENT_KALENDER: Record<
  number,
  { dari: string; judul: string; isi: string; bonusIksSemua?: number }
> = {
  12: {
    dari: 'Panitia GERMAS Kecamatan',
    judul: 'Hari Cuci Tangan — gerakan CTPS serentak',
    isi: 'Sekolah-sekolah menggelar cuci tangan massal. Kader melaporkan antusiasme tinggi — momentum bagus untuk pesan PHBS. (IKS seluruh RW terangkat tipis.)',
    bonusIksSemua: 0.005,
  },
  26: {
    dari: 'Kelompok Tani Sukamaju',
    judul: 'Musim panen dimulai — sawah penuh, poli sepi?',
    isi: 'Warga turun ke sawah dari subuh. Waspada: peserta Prolanis rawan bolos kontrol bulan ini, dan luka kerja (cangkul, pestisida) biasanya naik. Pertimbangkan jemput bola.',
  },
  48: {
    dari: 'Panitia HUT RI Desa',
    judul: '17 Agustus — Puskesmas diminta siaga lomba',
    isi: 'Panjat pinang, balap karung, gerak jalan. Siapkan P3K; tahun lalu ada dua kasus terkilir dan satu dehidrasi. Hari yang baik untuk dilihat warga — kehadiranmu adalah promosi kesehatan.',
    bonusIksSemua: 0.005,
  },
  70: {
    dari: 'Dinas Kesehatan Kabupaten',
    judul: 'Hari Kesehatan Nasional — apresiasi Puskesmas',
    isi: 'Dinkes meminta laporan capaian program menjelang HKN. Rapormu di Lokakarya Mini berikutnya akan dibaca lebih banyak mata. Selesaikan kuat: stase tinggal sebulan.',
  },
}

/* ---------------------------------------------------------------------------
 * PROLANIS — pembentukan roster dari warga ber-kondisi kronis
 * ------------------------------------------------------------------------- */

function bentukRosterProlanis(pack: ContentPack, rng: Rng): PesertaProlanis[] {
  const roster: PesertaProlanis[] = []
  for (const kel of Object.values(pack.keluarga)) {
    for (const a of kel.anggota) {
      const kondisi = a.kondisi ?? []
      const ht = kondisi.some((k) => k.includes('hipertensi'))
      const dm = kondisi.some((k) => k.includes('dm') || k.includes('diabetes'))
      if (!ht && !dm) continue

      const orangId = `prol_${kel.id}_${a.nama.replace(/\s+/g, '')}`
      const masalah: ('ht' | 'dm')[] = []
      if (ht) masalah.push('ht')
      if (dm) masalah.push('dm')
      for (const [index, jenis] of masalah.entries()) {
        roster.push({
          // ID legacy dipertahankan untuk masalah pertama; komorbid mendapat
          // suffix sendiri agar save lama dapat diperkaya tanpa mengganti ID.
          id: index === 0 ? orangId : `${orangId}_${jenis}`,
          orangId,
          nama: a.nama,
          usia: a.usia,
          jenisKelamin: a.jenisKelamin,
          rw: kel.rw,
          keluargaId: kel.id,
          jenis,
          // Mulai tak terkontrol (butuh intervensi) — itulah gunanya program.
          // Parameter DM = GDP, target kontrol RPPT <130 mg/dL.
          param: jenis === 'ht' ? rng.int(150, 175) : rng.int(150, 240),
          takTerkontrolBerturut: 0,
        })
      }
    }
  }
  return roster
}
