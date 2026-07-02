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
import type { HasilKunjungan, KeluargaState, KunjunganState, NilaiIndikator } from './state'
import type { IndikatorPisPk, PilihanDialog, SkenarioKunjungan, TahapTtm } from '@content/types'

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

function unik<T>(arr: readonly T[]): T[] {
  return [...new Set(arr)]
}

function clamp(nilai: number, min: number, maks: number): number {
  return Math.max(min, Math.min(maks, nilai))
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
 * Kontrak engine
 * ------------------------------------------------------------------------- */

export function buatKunjungan(keluargaId: string, skenario: SkenarioKunjungan): KunjunganState {
  return {
    keluargaId,
    skenarioId: skenario.id,
    fase: 'observasi',
    hotspotDitemukan: [],
    dialogIndex: 0,
    pilihanDiambil: [],
    trustDelta: 0,
    konfrontasiBeruntun: 0,
    diusir: false,
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

      const trustDelta = kj.trustDelta + pilihan.efekTrust
      const konfrontasiBeruntun = pilihan.gaya === 'konfrontasi' ? kj.konfrontasiBeruntun + 1 : 0
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
        kj: { ...kj, intervensiDipilih: kartu.id, fase: 'selesai' },
        events: [],
        selesai: true,
      }
    }

    default:
      return tolak(kj, `Aksi ${action.type} tidak berlaku dalam kunjungan rumah.`)
  }
}

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

  const kartu = kj.intervensiDipilih
    ? skenario.intervensi.find((i) => i.id === kj.intervensiDipilih)
    : undefined
  const intervensiCocok = kartu?.cocokUntuk.includes(skenario.hambatanSebenarnya) ?? false
  const hipotesisBenar = kj.hipotesis === skenario.hambatanSebenarnya
  const berhasil = !kj.diusir && hipotesisBenar && intervensiCocok

  const totalPilihan = kj.pilihanDiambil.length
  const kualitasMi = totalPilihan === 0 ? 0 : Math.round((100 * tepat) / totalPilihan)

  const hasil: HasilKunjunganLengkap = {
    keluargaId: kj.keluargaId,
    skenarioId: kj.skenarioId,
    berhasil,
    diusir: kj.diusir,
    hipotesisBenar,
    trustDelta: kj.trustDelta,
    kualitasMi,
    indikatorTerverifikasi,
    narasiPenutup: berhasil ? skenario.penutupBerhasil : skenario.penutupGagal,
    indikatorDibohongi,
  }
  return hasil
}

/**
 * Menerapkan hasil kunjungan ke state keluarga (immutable).
 * - Indikator terverifikasi → status = statusSebenarnya, sumber 'dokter'.
 * - Indikator dibohongi → status 'ya' PADAHAL salah, sumber 'dokter' —
 *   kontradiksinya bisa ketahuan lewat hotspot; itulah pelajarannya.
 * - Berhasil → TTM maju 1 tahap + arc maju; TTM mencapai aksi/pemeliharaan →
 *   indikator target skenario flip 'ya' (perubahan perilaku nyata) dan arc
 *   dinyatakan tamat berhasil (perubahan yang dituju sudah terjadi).
 */
export function terapkanHasil(
  kel: KeluargaState,
  hasil: HasilKunjungan,
  skenario: SkenarioKunjungan,
  hari: number,
): KeluargaState {
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
    if (ttm === 'aksi' || ttm === 'pemeliharaan') {
      // Perubahan perilaku terverifikasi: indikator target benar-benar berubah.
      for (const target of skenario.target) {
        indikator[target] = { status: 'ya', statusSebenarnya: 'ya', sumber: 'dokter', hariData: hari }
      }
      arcTamatBerhasil = true
    }
  }

  return {
    ...kel,
    trust,
    ttm,
    indikator,
    arcIndex,
    jumlahKunjungan: kel.jumlahKunjungan + 1,
    kunjunganTerakhir: hari,
    // Kegagalan yang sudah terjadi tidak bisa di-undo — krisis yang meletus
    // tetap tercatat gagal walau kunjungan berikutnya berjalan baik.
    ...(arcTamatBerhasil && kel.arcSelesai !== 'gagal' ? { arcSelesai: 'berhasil' as const } : {}),
  }
}
