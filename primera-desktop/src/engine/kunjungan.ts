/**
 * KUNJUNGAN RUMAH — match engine 4 babak dalam satu state machine.
 * Babak: observasi (hotspot) → wawancara (MI/OARS + gerbang kejujuran) →
 * diagnosis_perilaku (COM-B) → resep_sosial (kartu intervensi) → selesai.
 *
 * Mekanik kunci — GERBANG KEJUJURAN dua sisi:
 * - trustEfektif = kel.trust + trustDelta kunjungan (SETELAH efekTrust pilihan
 *   ini diterapkan — kehangatan kalimatmu barusan ikut menentukan).
 * - trustEfektif ≥ ambangTrust → warga jujur; indikator tercatat BENAR.
 * - trustEfektif <  ambangTrust → warga berbohong ("Tidak ada yang merokok,
 *   Dok") dan data yang tercatat SALAH ('ya' padahal sebenarnya 'tidak').
 *   Kontradiksinya bisa ketahuan lewat hotspot babak 1 — pedagogi, bukan bug.
 *
 * State kunjungan hanya menyimpan id (pilihanDiambil, hotspotDitemukan);
 * `selesaikanKunjungan` merekonstruksi seluruh penilaian dari skenario —
 * action-log sebagai sumber kebenaran.
 */

import type { Action } from './actions'
import type { GameEvent } from './events'
import type { HasilKunjungan, KeluargaState, KunjunganState, ModeStase, NilaiIndikator } from './state'
import type { IndikatorPisPk, KeluargaBinaan, NodeDialog, PilihanDialog, SkenarioKunjungan, TahapTtm } from '@content/types'
import { isGayaTerlarang } from '@content/types'
import { ukmScenarioAktif, type ContentPack } from '@content/pack'
import type { Rng } from './core/rng'
import { sitasiIntervensiUkm } from '@content/ukmCitations'

/**
 * Hasil kunjungan diperkaya daftar indikator yang DIBOHONGKAN warga.
 * Struktural terhadap HasilKunjungan (kontrak state.ts tidak berubah);
 * `terapkanHasil` membacanya untuk merekam data yang salah — sengaja.
 */
export interface HasilKunjunganLengkap extends HasilKunjungan {
  indikatorDibohongi: IndikatorPisPk[]
}

/* ---------------------------------------------------------------------------
 * Helper murni
 * ------------------------------------------------------------------------- */

interface HasilAksiKunjungan {
  kj: KunjunganState
  events: GameEvent[]
  selesai: boolean
}

function tolak(kj: KunjunganState, pesan: string): HasilAksiKunjungan {
  return { kj, events: [{ type: 'ERROR_AKSI', pesan }], selesai: false }
}

/**
 * Arc kunjungan yang AKTIF untuk mode+rilis ini (audit CODEX UKM 2026-07-16
 * #1): skenario ber-modePolicy Career-only (mis. gunawan_k2 pilot M13-1a)
 * disaring supaya arc tak buntu permanen di Ujian — dulu arcIndex maju
 * berdasar panjang arc MENTAH lalu skenario berikutnya ditolak mode-policy,
 * jadi indikator merokok & arc Gunawan mustahil tamat di Ujian. Panjang arc
 * dan indeks skenario kini dihitung atas daftar TERSARING ini, di engine
 * (MULAI_KUNJUNGAN + totalSkenario terapkanHasil) maupun UI (KartuKeluarga/
 * PetaDesa/Kunjungan).
 */
export function arcKunjunganAktif(
  pack: ContentPack,
  keluarga: KeluargaBinaan,
  mode: ModeStase,
  contentRelease: string,
): SkenarioKunjungan[] {
  return keluarga.arc.kunjungan.filter((sk: SkenarioKunjungan) =>
    ukmScenarioAktif(pack, keluarga.id, sk.id, mode, contentRelease),
  )
}

function unik<T>(arr: readonly T[]): T[] {
  return [...new Set(arr)]
}

function clamp(nilai: number, min: number, maks: number): number {
  return Math.max(min, Math.min(maks, nilai))
}

export const JEDA_FOLLOW_UP_KUNJUNGAN = 4
export const JENDELA_VERIFIKASI_JANJI: Record<ModeStase, number> = { karier: 14, ujian: 5 }

/** Satu sumber tanggal untuk state, jadwal verifikasi, dan placeholder UI. */
export function hariTindakLanjutKunjungan(
  hari: number,
  mode: ModeStase,
  arcTamat: boolean,
): number {
  return hari + (arcTamat ? JENDELA_VERIFIKASI_JANJI[mode] : JEDA_FOLLOW_UP_KUNJUNGAN)
}

export function penutupanAwalSah(hasil: HasilKunjungan['hasilAkhir']): boolean {
  return hasil === 'ditolak_total' || hasil === 'diterima_terpaksa'
}

/** Tahap kesiapan berubah MUNDUR satu langkah (M1: drift & mangkir follow-up). */
export function mundurTtm(ttm: TahapTtm): TahapTtm {
  switch (ttm) {
    case 'pemeliharaan':
      return 'aksi'
    case 'aksi':
      return 'kontemplasi'
    case 'kontemplasi':
      return 'prekontemplasi'
    default:
      return 'prekontemplasi'
  }
}

/** Tahap kesiapan berubah maju satu langkah (mentok di pemeliharaan). */
function majuTtm(ttm: TahapTtm): TahapTtm {
  switch (ttm) {
    case 'prekontemplasi':
      return 'kontemplasi'
    case 'kontemplasi':
      return 'aksi'
    case 'aksi':
      return 'pemeliharaan'
    case 'pemeliharaan':
      return 'pemeliharaan'
  }
}

/** Peta id pilihan → pilihan, untuk rekonstruksi dari pilihanDiambil. */
function petaPilihan(skenario: SkenarioKunjungan): Map<string, PilihanDialog> {
  const peta = new Map<string, PilihanDialog>()
  for (const node of skenario.dialog) {
    for (const p of node.pilihan) peta.set(p.id, p)
  }
  return peta
}

/* ---------------------------------------------------------------------------
 * skenarioEfektif — terapkan varian presentasi Tingkat-A (M11 #5 B1, 2026-07-17)
 * ------------------------------------------------------------------------- */

/**
 * Satu-satunya titik yang boleh menerapkan `varianKunjungan` — SETIAP tempat
 * yang membaca konten narasi (pembuka/hotspot/dialog/penutup) dari sebuah
 * kunjungan AKTIF wajib memanggil ini alih-alih membaca skenario mentah dari
 * PACK, supaya kartu keluarga, ruang kunjungan, dan debrief selalu menunjukkan
 * presentasi yang SAMA untuk satu kunjungan. Padanan persis `kasusEfektif`
 * (clinic.ts) di sisi UKP.
 *
 * Aman dipanggil tanpa `varianId` (undefined/'_dasar') — mengembalikan
 * `skenario` apa adanya, referensi identik, sehingga skenario tanpa
 * `varianKunjungan` sama sekali nol overhead.
 */
export function skenarioEfektif(skenario: SkenarioKunjungan, varianId: string | undefined): SkenarioKunjungan {
  if (!varianId || varianId === '_dasar') return skenario
  const v = skenario.varianKunjungan?.find((item) => item.id === varianId)
  if (!v) return skenario

  const dialogBerubah = v.dialogNarasiBerubah || v.pilihanBerubah
  const dialog: NodeDialog[] = dialogBerubah
    ? skenario.dialog.map((node) => ({
        ...node,
        ...(v.dialogNarasiBerubah?.[node.id] !== undefined ? { narasi: v.dialogNarasiBerubah[node.id]! } : {}),
        ...(v.pilihanBerubah
          ? {
              pilihan: node.pilihan.map((p) => {
                const ubah = v.pilihanBerubah![p.id]
                if (!ubah) return p
                return {
                  ...p,
                  ...(ubah.respons !== undefined ? { respons: ubah.respons } : {}),
                  ...(ubah.responsBohong !== undefined && p.ungkap
                    ? { ungkap: { ...p.ungkap, responsBohong: ubah.responsBohong } }
                    : {}),
                }
              }),
            }
          : {}),
      }))
    : skenario.dialog

  return {
    ...skenario,
    ...(v.pembuka ? { pembuka: v.pembuka } : {}),
    ...(v.hotspotBerubah
      ? {
          hotspot: skenario.hotspot.map((h) =>
            v.hotspotBerubah![h.id] ? { ...h, ...v.hotspotBerubah![h.id] } : h,
          ),
        }
      : {}),
    ...(dialogBerubah ? { dialog } : {}),
    ...(v.penutupBerhasil ? { penutupBerhasil: v.penutupBerhasil } : {}),
    ...(v.penutupGagal ? { penutupGagal: v.penutupGagal } : {}),
  }
}

/* ---------------------------------------------------------------------------
 * Kontrak engine
 * ------------------------------------------------------------------------- */

export function buatKunjungan(
  keluargaId: string,
  skenario: SkenarioKunjungan,
  rng: Rng,
  aktifkanPenerimaanAwal = false,
): KunjunganState {
  const varianId = skenario.varianKunjungan?.length
    ? rng.pick(['_dasar', ...skenario.varianKunjungan.map((v) => v.id)])
    : undefined
  return {
    keluargaId,
    skenarioId: skenario.id,
    ...(varianId !== undefined ? { varianId } : {}),
    fase: aktifkanPenerimaanAwal ? 'penerimaan' : 'observasi',
    hotspotDitemukan: [],
    dialogIndex: 0,
    pilihanDiambil: [],
    trustDelta: 0,
    konfrontasiBeruntun: 0,
    diusir: false,
    ...(aktifkanPenerimaanAwal && skenario.penerimaanAwal
      ? { penerimaanAwal: skenario.penerimaanAwal.jenis }
      : {}),
  }
}

export function aksiKunjungan(
  kj: KunjunganState,
  action: Action,
  skenario: SkenarioKunjungan,
  kel: KeluargaState,
): HasilAksiKunjungan {
  switch (action.type) {
    case 'KLIK_HOTSPOT': {
      if (kj.fase !== 'observasi') return tolak(kj, 'Waktu mengamati rumah sudah lewat — kamu sedang duduk bersama mereka.')
      const hotspot = skenario.hotspot.find((h) => h.id === action.hotspotId)
      if (!hotspot) return tolak(kj, 'Tidak ada apa-apa yang menarik di situ.')
      if (kj.hotspotDitemukan.includes(hotspot.id)) {
        // Sudah ditemukan — diam-diam abaikan (tanpa spam event).
        return { kj, events: [], selesai: false }
      }
      return {
        kj: { ...kj, hotspotDitemukan: [...kj.hotspotDitemukan, hotspot.id] },
        events: [
          {
            type: 'HOTSPOT_DITEMUKAN',
            hotspotId: hotspot.id,
            narasi: hotspot.narasi,
            ...(hotspot.indikator ? { indikator: hotspot.indikator } : {}),
          },
        ],
        selesai: false,
      }
    }

    case 'LANJUT_BABAK': {
      switch (kj.fase) {
        case 'penerimaan':
          return tolak(kj, 'Tanggapi dulu penerimaan keluarga sebelum melanjutkan kunjungan.')
        case 'observasi':
          // Bebas — pemain boleh langsung berbincang tanpa mengamati (rugi sendiri).
          return { kj: { ...kj, fase: 'wawancara' }, events: [], selesai: false }
        case 'wawancara':
          if (kj.dialogIndex < skenario.dialog.length) {
            return tolak(kj, 'Tuan rumah masih ingin berbincang — selesaikan dulu perbincangannya.')
          }
          return { kj: { ...kj, fase: 'diagnosis_perilaku' }, events: [], selesai: false }
        case 'diagnosis_perilaku':
          if (!kj.hipotesis) return tolak(kj, 'Komit dulu hipotesis hambatanmu: kapabilitas, kesempatan, atau motivasi.')
          return { kj: { ...kj, fase: 'resep_sosial' }, events: [], selesai: false }
        case 'resep_sosial':
          return tolak(kj, 'Pilih satu kartu intervensi untuk menutup kunjungan.')
        case 'ingatkan':
          return tolak(kj, 'Pilih satu cara mengingatkan sebelum pamit.')
        case 'selesai':
          return tolak(kj, 'Kunjungan sudah selesai.')
      }
      // Tidak tercapai — semua fase tertangani di atas.
      return tolak(kj, 'Babak tidak dikenal.')
    }

    case 'PILIH_DIALOG': {
      if (kj.fase !== 'wawancara') return tolak(kj, 'Belum waktunya berbincang.')
      const node = skenario.dialog[kj.dialogIndex]
      if (!node) return tolak(kj, 'Perbincangan sudah selesai — lanjutkan ke kesimpulanmu.')
      const pilihan = node.pilihan.find((p) => p.id === action.pilihanId)
      if (!pilihan) return tolak(kj, 'Pilihan itu tidak tersedia sekarang.')
      if (pilihan.butuhHotspot?.some((id) => !kj.hotspotDitemukan.includes(id))) {
        return tolak(kj, 'Amati dulu petunjuk yang mendasari tanggapan itu.')
      }

      const trustDelta = kj.trustDelta + pilihan.efekTrust
      const konfrontasiBeruntun = isGayaTerlarang(pilihan.gaya) ? kj.konfrontasiBeruntun + 1 : 0
      const kjBaru: KunjunganState = {
        ...kj,
        pilihanDiambil: [...kj.pilihanDiambil, pilihan.id],
        dialogIndex: kj.dialogIndex + 1,
        trustDelta,
        konfrontasiBeruntun,
      }

      // Righting reflex: dua konfrontasi beruntun → dipersilakan pulang.
      if (konfrontasiBeruntun >= 2) {
        return {
          kj: { ...kjBaru, diusir: true, fase: 'selesai' },
          events: [{ type: 'DIUSIR' }],
          selesai: true,
        }
      }

      // GERBANG KEJUJURAN: indikator sensitif hanya diungkap bila trust cukup.
      const events: GameEvent[] = []
      if (pilihan.ungkap) {
        const trustEfektif = kel.trust + trustDelta
        if (trustEfektif >= pilihan.ungkap.ambangTrust) {
          events.push({ type: 'WARGA_BICARA', teks: pilihan.respons })
        } else {
          // Warga berbohong dengan halus — UI TIDAK menandainya eksplisit.
          events.push({ type: 'WARGA_BICARA', teks: pilihan.ungkap.responsBohong, bohong: true })
        }
      } else {
        events.push({ type: 'WARGA_BICARA', teks: pilihan.respons })
      }
      return { kj: kjBaru, events, selesai: false }
    }

    case 'KOMIT_HAMBATAN': {
      if (kj.fase !== 'diagnosis_perilaku') return tolak(kj, 'Dengarkan dulu cerita mereka sebelum menyimpulkan.')
      // Komit otomatis memindah ke babak resep sosial.
      return {
        kj: { ...kj, hipotesis: action.hipotesis, fase: 'resep_sosial' },
        events: [],
        selesai: false,
      }
    }

    case 'PILIH_INTERVENSI': {
      if (kj.fase !== 'resep_sosial') return tolak(kj, 'Belum saatnya menulis resep sosial.')
      const kartu = skenario.intervensi.find((i) => i.id === action.intervensiId)
      if (!kartu) return tolak(kj, 'Kartu intervensi itu tidak dikenal.')
      return {
        kj: {
          ...kj,
          intervensiDipilih: kartu.id,
          fase: skenario.pilihanIngatkan ? 'ingatkan' : 'selesai',
        },
        events: [],
        selesai: !skenario.pilihanIngatkan,
      }
    }

    case 'PILIH_INGATKAN': {
      if (kj.fase !== 'ingatkan') return tolak(kj, 'Belum saatnya menutup dengan pengingat.')
      const pilihan = skenario.pilihanIngatkan?.pilihan.find((p) => p.id === action.pilihanId)
      if (!pilihan) return tolak(kj, 'Pilihan pengingat itu tidak tersedia.')
      return {
        kj: { ...kj, ingatkanDipilih: pilihan.id, fase: 'selesai' },
        events: [],
        selesai: true,
      }
    }

    case 'RESPONS_PENERIMAAN': {
      if (kj.fase !== 'penerimaan') return tolak(kj, 'Keluarga sudah menerima kunjungan ini.')
      const pilihan = skenario.penerimaanAwal?.pilihan.find((p) => p.id === action.pilihanId)
      if (!pilihan || !kj.penerimaanAwal) return tolak(kj, 'Respons penerimaan itu tidak tersedia.')
      const memaksa = pilihan.tindakan === 'memaksa'
      return {
        kj: {
          ...kj,
          responsPenerimaan: pilihan.tindakan,
          diusir: memaksa,
          fase: 'selesai',
        },
        events: memaksa ? [{ type: 'DIUSIR' }] : [],
        selesai: true,
      }
    }

    default:
      return tolak(kj, `Aksi ${action.type} tidak berlaku dalam kunjungan rumah.`)
  }
}

// Fix Addendum Q6/Asih (adjudikasi dokter+DeepThink 2026-07-11, ronde CODEX-31,
// "Jalur Generik"): `berhasil` dulu murni tebakan struktural (hipotesis+kartu
// cocok) — kualitas dialog MI (`kualitasMi`, sudah dihitung, TAK pernah dipakai
// di formula ini) sama sekali tak berpengaruh. Berlaku ke seluruh 16 keluarga
// (bukan allowlist per-keluarga) krn semuanya berbagi tipe Hambatan/Intervensi
// yang identik — lihat DEEPTHINK_CODEX31_KEPUTUSAN.md Addendum. Ambang 50 =
// separuh pilihan dialog minimal "tepat" (OARS/MI benar), bukan sekadar
// menebak kategori lalu asal klik lewat dialog.
const AMBANG_KUALITAS_MI_BERHASIL = 50

/**
 * Penutup untuk kunjungan yang DIHENTIKAN tuan rumah — righting reflex (dua
 * gaya terlarang beruntun) maupun memaksa masuk di babak penerimaan awal.
 *
 * Audit UKM 2026-08-22: jalur ini dulu ikut memakai `skenario.penutupGagal`,
 * padahal teks itu ditulis untuk kunjungan yang TUNTAS tapi tak menggerakkan —
 * perpisahan hangat bergaya "Terima kasih ilmunya, Dok". Akibatnya debrief sore
 * merangkai pujian tuan rumah tepat setelah kalimat "kamu diminta pulang", dan
 * pemain membaca perpisahan yang tak pernah terjadi. Penutup ini sengaja
 * netral-skenario: yang diketahui engine hanyalah kunjungan berhenti di tengah,
 * dan mengarang detail rumah tertentu justru sumber kontradiksi baru.
 */
export const PENUTUP_DIUSIR =
  'Pintu ditutup pelan di belakangmu, dan tak ada yang mengantar sampai pagar. ' +
  'Tidak ada rencana yang sempat disepakati, tidak ada janji kunjungan berikutnya — ' +
  'hanya rumah yang kini lebih rapat daripada sebelum kamu datang.'

/**
 * Merekonstruksi seluruh penilaian kunjungan dari id yang tersimpan + skenario.
 * `kel` adalah state keluarga SEBELUM hasil diterapkan (trust awal kunjungan) —
 * replay gerbang kejujuran deterministik terhadap urutan pilihan.
 */
export function selesaikanKunjungan(
  kj: KunjunganState,
  skenario: SkenarioKunjungan,
  kel: KeluargaState,
): HasilKunjungan {
  if (kj.responsPenerimaan && skenario.penerimaanAwal) {
    const pilihan = skenario.penerimaanAwal.pilihan.find((p) => p.tindakan === kj.responsPenerimaan)
    const diusir = kj.responsPenerimaan === 'memaksa'
    return {
      keluargaId: kj.keluargaId,
      skenarioId: kj.skenarioId,
      hasilAkhir: diusir ? 'diusir' : skenario.penerimaanAwal.jenis,
      berhasil: false,
      diusir,
      hipotesisBenar: false,
      trustDelta: 0,
      kualitasMi: 0,
      kualitasSaji: 0,
      indikatorTerverifikasi: [],
      // Audit UKM 2026-08-22: cadangan pun harus tahu diri — pemain yang
      // memaksa masuk tak boleh jatuh ke penutup kunjungan tuntas-tapi-gagal.
      narasiPenutup: pilihan?.respons ?? (diusir ? PENUTUP_DIUSIR : skenario.penutupGagal),
      ...(diusir ? { tingkat: 'gagal' as const } : { ulangDalamHari: skenario.penerimaanAwal.ulangDalamHari }),
      ...(pilihan?.catatanPedagogis ? { catatanPedagogis: [pilihan.catatanPedagogis] } : {}),
    }
  }

  const peta = petaPilihan(skenario)

  // Replay wawancara: akumulasi trust, hitung MI, pisahkan ungkap jujur/bohong.
  let deltaBerjalan = 0
  let tepat = 0
  const ungkapJujur: IndikatorPisPk[] = []
  const ungkapBohong: IndikatorPisPk[] = []
  for (const id of kj.pilihanDiambil) {
    const p = peta.get(id)
    if (!p) continue
    deltaBerjalan += p.efekTrust
    if (p.tepat) tepat += 1
    if (p.ungkap) {
      if (kel.trust + deltaBerjalan >= p.ungkap.ambangTrust) ungkapJujur.push(p.ungkap.indikator)
      else ungkapBohong.push(p.ungkap.indikator)
    }
  }

  // Observasi: hotspot ber-indikator = verifikasi mata kepala sendiri.
  const dariHotspot: IndikatorPisPk[] = []
  for (const id of kj.hotspotDitemukan) {
    const h = skenario.hotspot.find((x) => x.id === id)
    if (h?.indikator) dariHotspot.push(h.indikator)
  }

  const indikatorTerverifikasi = unik([...dariHotspot, ...ungkapJujur])
  // Hotspot mengalahkan kebohongan: yang sudah kamu LIHAT tidak bisa dibohongi.
  const indikatorDibohongi = unik(ungkapBohong).filter((i) => !indikatorTerverifikasi.includes(i))

  const totalPilihan = kj.pilihanDiambil.length
  const kualitasMi = totalPilihan === 0 ? 0 : Math.round((100 * tepat) / totalPilihan)
  const pilihanIngatkan = skenario.pilihanIngatkan?.pilihan.find((p) => p.id === kj.ingatkanDipilih)
  // Babak Ingatkan hanya dinilai bila benar-benar dijalani: pemain yang diusir
  // di tengah wawancara tak pernah ditawari babak ini, jadi bobot 20%-nya
  // dinormalisasi kembali ke MI — sejalan `kualitasMi` yang juga hanya
  // menghitung pilihan dialog yang benar-benar diambil. Pilihan yang diambil
  // tapi tak dikenal skenario (varian/konten bergeser) tetap dinilai 0.
  const faseIngatkanDijalani =
    skenario.pilihanIngatkan !== undefined && kj.ingatkanDipilih !== undefined
  const kualitasIngatkan = faseIngatkanDijalani ? (pilihanIngatkan?.tepat ? 100 : 0) : undefined
  const kualitasSaji = kualitasIngatkan === undefined
    ? kualitasMi
    : Math.round(0.8 * kualitasMi + 0.2 * kualitasIngatkan)

  const kartu = kj.intervensiDipilih
    ? skenario.intervensi.find((i) => i.id === kj.intervensiDipilih)
    : undefined
  const intervensiCocok = kartu?.cocokUntuk.includes(skenario.hambatanSebenarnya) ?? false
  const hipotesisBenar = kj.hipotesis === skenario.hambatanSebenarnya
  // Tambahan #1 (audit CODEX 2026-07-11, adjudikasi 2026-07-12): arc ber-karma
  // keselamatan tinggi (mis. preeklampsia berat, Asih) bisa punya kartu ber-
  // flag aksiEskalasi — bila skenario punya ≥1 kartu semacam itu, `berhasil`
  // (pembatalan karma PENUH) mensyaratkan kartu yg DIPILIH itu sendiri yg
  // ber-flag, bukan sekadar kartu lain yg kebetulan cocok kategori hambatan
  // yg sama. Skenario TANPA kartu aksiEskalasi (mayoritas arc) tak terpengaruh
  // sama sekali (butuhEskalasi=false → gerbang ini selalu lolos, spt semula).
  const butuhEskalasi = skenario.intervensi.some((i) => i.aksiEskalasi === true)
  const eskalasiDipilih = kartu?.aksiEskalasi === true
  const berhasil =
    !kj.diusir &&
    hipotesisBenar &&
    intervensiCocok &&
    kualitasMi >= AMBANG_KUALITAS_MI_BERHASIL &&
    (!butuhEskalasi || eskalasiDipilih)

  // Bridge bertingkat (M1.1): partial = tidak diusir & TEPAT SALAH SATU dari
  // {hipotesis, intervensi} — kamu menyentuh keluarga ini tapi belum menggerakkan.
  // Fix Addendum Q6: hipotesis+kartu benar TAPI kualitasMi di bawah ambang juga
  // jatuh ke 'partial' (bukan 'gagal') — struktur sudah ditebak benar, yang
  // kurang adalah kualitas dialognya, bukan penalti penuh spt salah total.
  const tingkat: 'berhasil' | 'partial' | 'gagal' = berhasil
    ? 'berhasil'
    : !kj.diusir && (hipotesisBenar || intervensiCocok)
      ? 'partial'
      : 'gagal'

  // Audit CODEX UKM 2026-07-16 #10: debrief sore dulu menjanjikan "rincian
  // penilaian" tapi catatanPedagogis penulis skenario tak pernah sampai ke
  // pemain. Kumpulkan catatan dari pilihan dialog yang TIDAK tepat (maks 3,
  // urutan kejadian) + kartu intervensi yang meleset — bahan debrief nyata.
  const catatanPedagogis: string[] = []
  if (kartu) {
    const evidence = sitasiIntervensiUkm(skenario, kartu, 'pasca_penilaian')
    catatanPedagogis.push(`${evidence.labelDukungan}: ${evidence.sumber} Batas transfer: ${evidence.batasan}`)
  }
  for (const id of kj.pilihanDiambil) {
    const p = peta.get(id)
    if (p && !p.tepat && p.catatanPedagogis) catatanPedagogis.push(p.catatanPedagogis)
  }
  if (kartu && !intervensiCocok && kartu.catatanPedagogis) catatanPedagogis.push(kartu.catatanPedagogis)
  if (pilihanIngatkan && !pilihanIngatkan.tepat && pilihanIngatkan.catatanPedagogis) {
    catatanPedagogis.push(pilihanIngatkan.catatanPedagogis)
  }

  const hasil: HasilKunjunganLengkap = {
    keluargaId: kj.keluargaId,
    skenarioId: kj.skenarioId,
    hasilAkhir: kj.diusir ? 'diusir' : tingkat,
    berhasil,
    diusir: kj.diusir,
    hipotesisBenar,
    trustDelta: kj.trustDelta,
    kualitasMi,
    kualitasSaji,
    ...(kualitasIngatkan !== undefined ? { kualitasIngatkan } : {}),
    indikatorTerverifikasi,
    // Diusir = kunjungan berhenti di tengah wawancara: babak Ingatkan & kartu
    // intervensi tak pernah ditawarkan, dan penutup skenario mengandaikan
    // perpisahan yang tak pernah terjadi (audit UKM 2026-08-22).
    narasiPenutup: kj.diusir
      ? PENUTUP_DIUSIR
      : [
          pilihanIngatkan?.respons,
          berhasil || !intervensiCocok ? kartu?.hasilNarasi : undefined,
          berhasil ? skenario.penutupBerhasil : skenario.penutupGagal,
        ]
          .filter(Boolean)
          .join(' '),
    tingkat,
    indikatorDibohongi,
    ...(catatanPedagogis.length > 0 ? { catatanPedagogis: catatanPedagogis.slice(0, 3) } : {}),
  }
  return hasil
}

/**
 * Menerapkan hasil kunjungan ke state keluarga (immutable).
 * - Indikator terverifikasi → status = statusSebenarnya, sumber 'dokter'.
 * - Indikator dibohongi → status 'ya' PADAHAL salah, sumber 'dokter' —
 *   kontradiksinya bisa ketahuan lewat hotspot; itulah pelajarannya.
 * - Berhasil → TTM maju 1 tahap + arc maju; SKENARIO TERAKHIR arc sukses →
 *   indikator target skenario flip 'ya' (perubahan perilaku nyata) dan arc
 *   dinyatakan tamat berhasil. (M3c: tamat diikat ke panjang arc, bukan TTM —
 *   untuk arc 2-babak dari prekontemplasi keduanya bertepatan persis, tapi
 *   ikatan TTM membuat skenario ke-3 arc panjang tak pernah termainkan dan
 *   arc 1-babak tak pernah tamat.)
 */
export function terapkanHasil(
  kel: KeluargaState,
  hasil: HasilKunjungan,
  skenario: SkenarioKunjungan,
  hari: number,
  totalSkenario: number,
  mode: ModeStase = 'karier',
): KeluargaState {
  if (penutupanAwalSah(hasil.hasilAkhir)) {
    const { followUpHari: _janjiLama, ...kelBersih } = kel
    return {
      ...kelBersih,
      jumlahKunjungan: kel.jumlahKunjungan + 1,
      kunjunganTerakhir: hari,
      followUpHari: hari + (hasil.ulangDalamHari ?? 1),
    }
  }

  const dibohongi: readonly IndikatorPisPk[] =
    (hasil as Partial<HasilKunjunganLengkap>).indikatorDibohongi ?? []

  const indikator: Record<IndikatorPisPk, NilaiIndikator> = { ...kel.indikator }

  for (const ind of hasil.indikatorTerverifikasi) {
    const lama = indikator[ind]
    indikator[ind] = { ...lama, status: lama.statusSebenarnya, sumber: 'dokter', hariData: hari }
  }
  for (const ind of dibohongi) {
    if (hasil.indikatorTerverifikasi.includes(ind)) continue
    const lama = indikator[ind]
    // Tercatat 'ya' padahal sebenarnya tidak — statusSebenarnya tak tersentuh.
    indikator[ind] = { ...lama, status: 'ya', sumber: 'dokter', hariData: hari }
  }

  const trust = clamp(kel.trust + hasil.trustDelta, 0, 10)

  let ttm = kel.ttm
  let arcIndex = kel.arcIndex
  let arcTamatBerhasil = false
  if (hasil.berhasil) {
    ttm = majuTtm(kel.ttm)
    arcIndex = kel.arcIndex + 1
    if (arcIndex >= totalSkenario) {
      // #4 outcome-window (audit CODEX UKM 2026-07-16): arc tamat = warga
      // BERJANJI berubah (rencana persalinan/imunisasi/ASI/sumur/berobat), BUKAN
      // outcome final seketika. Indikator target → `status:'ya'` (IKS naik
      // optimis) tapi `statusSebenarnya` TAK dipaksa — sumber 'janji'. Reducer
      // menjadwalkan verifikasi_pispk: ditepati → permanen, ingkar → balik.
      for (const target of skenario.target) {
        const lama = indikator[target]
        indikator[target] = {
          status: 'ya',
          statusSebenarnya: lama.statusSebenarnya,
          sumber: 'janji',
          hariData: hari,
        }
      }
      arcTamatBerhasil = true
    }
  }

  // Follow-up berkalender (M1.4): kunjungan APA PUN menghapus janji lama;
  // kunjungan berhasil yang arc-nya belum tamat membuat janji kontrol baru.
  // Mangkir dari janji dihukum reducer (TTM mundur) saat jatuh tempo lewat.
  const { followUpHari: _janjiLama, ...kelBersih } = kel
  const followUpBaru = hasil.berhasil && !arcTamatBerhasil
    ? hariTindakLanjutKunjungan(hari, mode, false)
    : undefined

  return {
    ...kelBersih,
    trust,
    ttm,
    indikator,
    arcIndex,
    jumlahKunjungan: kel.jumlahKunjungan + 1,
    kunjunganTerakhir: hari,
    ...(followUpBaru !== undefined ? { followUpHari: followUpBaru } : {}),
    // Kegagalan yang sudah terjadi tidak bisa di-undo — krisis yang meletus
    // tetap tercatat gagal walau kunjungan berikutnya berjalan baik.
    ...(arcTamatBerhasil && kel.arcSelesai !== 'gagal' ? { arcSelesai: 'berhasil' as const } : {}),
  }
}
