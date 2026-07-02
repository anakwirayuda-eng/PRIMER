/**
 * REDUCER — jantung engine. `advance(state, action, pack) → { state, events }`.
 * Murni & deterministik: keacakan hanya dari Rng yang diturunkan seed+hari+aksi.
 * Action-log dicatat di sini — sumber kebenaran skor.
 */

import type { Action } from './actions'
import type { GameEvent } from './events'
import type { GameState, PenilaianEncounter, Surat } from './state'
import type { ContentPack } from '@content/pack'
import { Rng } from './core/rng'
import { buatEncounter, aksiKlinik, nilaiEncounter } from './clinic'
import { buatKunjungan, aksiKunjungan, selesaikanKunjungan, terapkanHasil, mundurTtm } from './kunjungan'
import { prosesHarianKader } from './kader'
import { susunAntrianHarian, buatPasienDariKasus } from './director'
import { kasusMenular, pangkasSurveilans, hitungCluster } from './surveilans'

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
export const LUNTUR_BINTANG_HARI = 5

/** Id surat deterministik: hari + urutan dalam hari (aman untuk save/load). */
function buatSuratHarian(hari: number, seq: number, s: Omit<Surat, 'id' | 'hari' | 'dibaca'>): Surat {
  return { id: `surat_${hari}_${seq}`, hari, dibaca: false, ...s }
}

function err(state: GameState, pesan: string): HasilAdvance {
  return { state, events: [{ type: 'ERROR_AKSI', pesan }] }
}

function catat(state: GameState, action: Action, detail?: string): GameState {
  const entry = { hari: state.hari, blok: state.blok, aksi: action.type, ...(detail ? { detail } : {}) }
  return { ...state, log: [...state.log, entry] }
}

/* ---------------------------------------------------------------------------
 * ADVANCE
 * ------------------------------------------------------------------------- */

export function advance(state: GameState, action: Action, pack: ContentPack): HasilAdvance {
  const s = catat(state, action)

  switch (action.type) {
    case 'MULAI_GAME':
      // Ditangani init.ts (buildInitialState) — reducer menolak agar tak double-init.
      return err(s, 'MULAI_GAME ditangani init, bukan reducer')

    case 'PINDAH_LAYAR': {
      // Guard unlock kurikuler
      if (action.layar === 'peta' && s.hari < HARI_BUKA_PETA) return err(s, 'Peta desa terbuka besok — hari ini fokus klinik dulu.')
      if (action.layar === 'kunjungan') return err(s, 'Kunjungan dimulai dari kartu keluarga di Peta Desa.')
      return { state: { ...s, layar: action.layar }, events: [] }
    }

    case 'BACA_SURAT': {
      const inbox = s.inbox.map((m) => (m.id === action.suratId ? { ...m, dibaca: true } : m))
      return { state: { ...s, inbox }, events: [] }
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
    case 'HAPUS_EDUKASI': {
      const enc = s.klinik.aktif
      if (!enc) return err(s, 'Tidak ada pasien aktif.')
      const kasus = pack.kasus[enc.pasien.kasusId]
      if (!kasus) return err(s, `Kasus ${enc.pasien.kasusId} tidak ditemukan.`)
      const rng = new Rng(s.seed, 'klinik', s.hari, s.log.length)
      const hasil = aksiKlinik(enc, action, kasus, pack, rng)
      let next: GameState = { ...s, klinik: { ...s.klinik, aktif: hasil.enc } }

      // Lab "besok": jadwalkan hasil + biaya. Guard duplikat: clinic menolak
      // pesanan ganda diam-diam — reducer tidak boleh tetap membakar biaya.
      if (action.type === 'PESAN_LAB' && !enc.labDipesan.includes(action.labId)) {
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
      if (!enc.diagnosis && action.jenis !== 'rujuk') return err(s, 'Komit diagnosis dulu sebelum memulangkan pasien.')
      const kasus = pack.kasus[enc.pasien.kasusId]
      if (!kasus) return err(s, `Kasus ${enc.pasien.kasusId} tidak ditemukan.`)

      const encFinal = { ...enc, disposisi: action.jenis, ...(action.sbar ? { sbar: action.sbar } : {}) }
      const nilai = nilaiEncounter(encFinal, kasus, pack)
      const events: GameEvent[] = [
        { type: 'STEMPEL', jenis: action.jenis === 'rujuk' ? 'rujuk' : 'pulang' },
        { type: 'ENCOUNTER_SELESAI', penilaian: nilai },
      ]

      // Tally
      const t = { ...s.tally }
      t.totalPasien += 1
      if (nilai.diagnosisBenar) t.diagnosisBenar += 1
      if (nilai.jenisDiagnosis === 'tegak') {
        if (nilai.diagnosisBenar) t.tegakBenar += 1
        else t.tegakSalah += 1
      } else {
        if (nilai.diagnosisBenar) t.suspekBenar += 1
        else t.suspekSalah += 1
      }
      if (action.jenis === 'rujuk') {
        t.rujukanTotal += 1
        if (nilai.rujukanNonSpesialistik) t.rujukanNonSpesialistik += 1
      }
      if (nilai.cowboy) t.cowboy += 1
      if (nilai.antibiotikTanpaIndikasi) t.antibiotikTanpaIndikasi += 1
      t.labTakRelevan += nilai.labTakRelevan

      // Ekonomi ringkas: BPJS bakar HPP obat, umum bayar harga jual
      let kapitasi = s.kapitasi
      for (const obatId of encFinal.resep) {
        const o = pack.obat[obatId]
        if (!o) continue
        kapitasi += encFinal.pasien.bpjs ? -o.hargaBeli : o.hargaJual
      }

      // Dex (Leitner-lite)
      const dex = { ...s.dex }
      const lama = dex[kasus.id] ?? { kasusId: kasus.id, ditangani: 0, benar: 0, bintang: 0, terakhirHari: 0 }
      const bintang = nilai.diagnosisBenar ? Math.min(3, lama.bintang + 1) : Math.max(0, lama.bintang - 1)
      dex[kasus.id] = {
        ...lama,
        ditangani: lama.ditangani + 1,
        benar: lama.benar + (nilai.diagnosisBenar ? 1 : 0),
        bintang,
        terakhirHari: s.hari,
      }
      events.push({ type: 'DEX_BERTAMBAH', kasusId: kasus.id, bintang })

      // Konsekuensi klinis: pasien kembali memburuk bila (a) diagnosis salah,
      // (b) terapi buruk, (c) obat berbahaya diresepkan (obatSalahUmum), atau
      // (d) kasus wajib-rujuk justru ditahan (cowboy). Observasi sambil menunggu
      // hasil lab besok adalah keputusan interim yang SAH — tidak dihukum.
      let jadwal = s.jadwal
      let penilaianFinal: PenilaianEncounter = nilai
      const resepBerbahaya = (kasus.tatalaksana.obatSalahUmum ?? []).some((o) => encFinal.resep.includes(o.id))
      const observasiMenungguLab =
        action.jenis === 'observasi' && encFinal.labDipesan.some((id) => pack.lab[id]?.hasilBesok)
      const pantasKonsekuensi =
        !nilai.diagnosisBenar || nilai.skorTerapi < 50 || resepBerbahaya || nilai.cowboy
      if (kasus.konsekuensi && pantasKonsekuensi && !observasiMenungguLab && action.jenis !== 'rujuk') {
        const rng = new Rng(s.seed, 'konsekuensi', s.hari, kasus.id)
        const jatuhTempo = s.hari + rng.int(kasus.konsekuensi.kembaliHariMin, kasus.konsekuensi.kembaliHariMax)
        jadwal = [
          ...jadwal,
          {
            id: `jadwal_kembali_${s.hari}_${encFinal.pasien.id}`,
            hari: jatuhTempo,
            jenis: 'pasien_kembali',
            pasienId: encFinal.pasien.id,
            kasusId: kasus.id,
            catatan: `${encFinal.pasien.nama} — ${kasus.konsekuensi.kondisiKembali}`,
            nama: encFinal.pasien.nama,
            usia: encFinal.pasien.usia,
            jenisKelamin: encFinal.pasien.jenisKelamin,
            rw: encFinal.pasien.rw,
            ...(encFinal.pasien.keluargaId ? { keluargaId: encFinal.pasien.keluargaId } : {}),
          },
        ]
        penilaianFinal = { ...nilai, konsekuensiDijadwalkan: true }
      }

      // Surveilans balik UKP→UKM (M1.2): diagnosis menular tercatat per RW —
      // pola di poli menyalakan sinyal di peta, apa pun disposisinya.
      const desa = kasusMenular(kasus.id)
        ? { ...s.desa, surveilans: [...s.desa.surveilans, { hari: s.hari, rw: encFinal.pasien.rw, kasusId: kasus.id }] }
        : s.desa

      return {
        state: {
          ...s,
          kapitasi,
          tally: t,
          dex,
          jadwal,
          desa,
          klinik: {
            ...s.klinik,
            aktif: undefined,
            selesaiHariIni: [...s.klinik.selesaiHariIni, penilaianFinal],
          },
        },
        events,
      }
    }

    /* -- UKM: roster ---------------------------------------------------------- */

    case 'PILIH_BINAAN': {
      if (s.desa.binaan.includes(action.keluargaId)) return err(s, 'Sudah jadi keluarga binaan.')
      if (s.desa.binaan.length >= 8) return err(s, 'Roster binaan penuh (maks 8).')
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
      if (s.hasilKunjunganHariIni) return err(s, 'Slot lapangan hari ini sudah terpakai.')
      const kel = s.desa.keluarga[action.keluargaId]
      const kelContent = pack.keluarga[action.keluargaId]
      if (!kel || !kelContent) return err(s, 'Keluarga tidak dikenal.')
      if (kel.arcSelesai === 'gagal')
        return err(s, 'Krisis sudah terjadi — dampingi pemulihan keluarga ini lewat klinik.')
      if (kel.arcSelesai === 'berhasil') return err(s, 'Arc keluarga ini sudah tuntas.')
      const skenario = kelContent.arc.kunjungan[kel.arcIndex]
      if (!skenario) return err(s, 'Arc keluarga ini sudah selesai.')
      const rwProfil = pack.rw.find((r) => r.nomor === kelContent.rw)
      const biaya = BIAYA_STAMINA_KUNJUNGAN[rwProfil?.jarak ?? 'sedang']
      if (s.stamina < biaya) return err(s, `Butuh ${biaya} stamina untuk perjalanan ke RW ${kelContent.rw}.`)
      const kj = buatKunjungan(action.keluargaId, skenario)
      return {
        state: { ...s, stamina: s.stamina - biaya, layar: 'kunjungan', kunjungan: kj },
        events: [],
      }
    }

    case 'KLIK_HOTSPOT':
    case 'PILIH_DIALOG':
    case 'KOMIT_HAMBATAN':
    case 'PILIH_INTERVENSI':
    case 'LANJUT_BABAK': {
      const kj = s.kunjungan
      if (!kj) return err(s, 'Tidak sedang berkunjung.')
      const kelContent = pack.keluarga[kj.keluargaId]
      const kel = s.desa.keluarga[kj.keluargaId]
      if (!kelContent || !kel) return err(s, 'Keluarga tidak dikenal.')
      const skenario = kelContent.arc.kunjungan.find((x) => x.id === kj.skenarioId)
      if (!skenario) return err(s, 'Skenario hilang.')

      const hasilAksi = aksiKunjungan(kj, action, skenario, kel)
      let next: GameState = { ...s, kunjungan: hasilAksi.kj }
      const events = [...hasilAksi.events]

      if (hasilAksi.selesai) {
        let hasil = selesaikanKunjungan(hasilAksi.kj, skenario, kel)

        // SDOH armor (M1.6, port BehaviorCaseEngine): keluarga miskin/rentan
        // menahan pendekatan yang salah sasaran — kenaikan trust dipangkas
        // setengah bila hipotesis hambatan meleset. Diagnosis tepat menembus armor.
        const kenaArmor =
          (kelContent.ekonomi === 'miskin' || kelContent.ekonomi === 'rentan') &&
          !hasil.hipotesisBenar &&
          hasil.trustDelta > 0
        if (kenaArmor) {
          hasil = { ...hasil, trustDelta: Math.floor(hasil.trustDelta / 2), armorAktif: true }
        }

        let kelBaru = terapkanHasil(kel, hasil, skenario, s.hari)

        // Tally MI & kunjungan
        const t = { ...next.tally }
        t.kunjunganTotal += 1
        if (hasil.berhasil) t.kunjunganBerhasil += 1
        if (hasil.diusir) t.kunjunganDiusir += 1
        const totalPilihan = hasilAksi.kj.pilihanDiambil.length
        // Apathy: kunjungan tanpa satu pun substansi — nol teknik MI yang tepat
        // DAN nol temuan terverifikasi. Klik-kosong dihukum, sesuai GDD anti-min-max.
        if (hasil.kualitasMi === 0 && hasil.indikatorTerverifikasi.length === 0) t.apathy += 1
        t.miTotal += totalPilihan
        t.miTepat += Math.round((hasil.kualitasMi / 100) * totalPilihan)

        // Bridge bertingkat (M1.1): nasib jadwal karma keluarga ini mengikuti
        // gradasi hasil — berhasil membatalkan, partial menunda jam pasir,
        // gagal/diusir justru mempercepatnya.
        let jadwal = next.jadwal
        const adaKarma = jadwal.some((j) => j.jenis === 'karma_igd' && j.keluargaId === kj.keluargaId)
        if (adaKarma && hasil.berhasil) {
          jadwal = jadwal.filter((j) => !(j.jenis === 'karma_igd' && j.keluargaId === kj.keluargaId))
          const { karmaAktif: _lepas, ...kelTanpaKarma } = kelBaru
          kelBaru = kelTanpaKarma
          t.karmaDicegah += 1
          events.push({ type: 'KARMA_DICEGAH', narasi: `Krisis di keluarga ${kelContent.namaKeluarga} berhasil dicegah.` })
        } else if (adaKarma && hasil.tingkat === 'partial') {
          jadwal = jadwal.map((j) =>
            j.jenis === 'karma_igd' && j.keluargaId === kj.keluargaId ? { ...j, hari: j.hari + 3 } : j,
          )
          kelBaru = kelBaru.karmaAktif
            ? { ...kelBaru, karmaAktif: { ...kelBaru.karmaAktif, jatuhTempoHari: kelBaru.karmaAktif.jatuhTempoHari + 3 } }
            : kelBaru
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

        next = {
          ...next,
          kunjungan: undefined,
          hasilKunjunganHariIni: hasil,
          layar: 'peta',
          tally: t,
          jadwal,
          desa: {
            ...next.desa,
            keluarga: { ...next.desa.keluarga, [kj.keluargaId]: kelBaru },
          },
        }
        events.push({ type: 'KUNJUNGAN_SELESAI', hasil })
      }
      return { state: next, events }
    }

    default:
      return err(s, `Aksi tidak dikenal: ${(action as Action).type}`)
  }
}

/* ---------------------------------------------------------------------------
 * ALUR WAKTU — LANJUTKAN
 * ------------------------------------------------------------------------- */

function lanjutkan(s: GameState, pack: ContentPack): HasilAdvance {
  if (s.kunjungan) return err(s, 'Selesaikan kunjungan dulu.')
  if (s.klinik.aktif) return err(s, 'Selesaikan pasien di ruang periksa dulu.')

  if (s.blok === 'pagi') {
    // Sisa antrian di-auto-resolve oleh "instingmu" — dan yang bermasalah IKUT
    // menyeret akurasi (anti cherry-picking: melewatkan pasien bukan strategi gratis).
    const sisa = s.klinik.antrian.length
    let bermasalah = 0
    if (sisa > 0) {
      const rng = new Rng(s.seed, 'auto', s.hari)
      for (let i = 0; i < sisa; i++) if (rng.chance(0.25)) bermasalah += 1
    }
    return {
      state: {
        ...s,
        blok: 'siang',
        layar: s.hari >= HARI_BUKA_PETA ? 'peta' : 'meja',
        tally: { ...s.tally, autoBermasalah: s.tally.autoBermasalah + bermasalah },
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

function hariBaru(s: GameState, pack: ContentPack): HasilAdvance {
  const hari = s.hari + 1
  const events: GameEvent[] = [{ type: 'HARI_BARU', hari }]
  const suratBaru: Surat[] = []

  // Burnout: tidur memulihkan; hari berakhir dgn stamina 0 menaikkan burnout
  const kelelahan = s.stamina === 0
  const burnout = Math.max(0, Math.min(100, s.burnout + (kelelahan ? 12 : -6)))
  const tally = { ...s.tally, hariKelelahan: s.tally.hariKelelahan + (kelelahan ? 1 : 0) }
  const stamina = burnout >= 70 ? STAMINA_MAKS - 2 : burnout >= 40 ? STAMINA_MAKS - 1 : STAMINA_MAKS

  // Dex luntur (Leitner): bintang meluntur bila lama tak dilatih
  const dex = { ...s.dex }
  for (const [id, entry] of Object.entries(dex)) {
    if (entry.bintang > 0 && hari - entry.terakhirHari >= LUNTUR_BINTANG_HARI) {
      dex[id] = { ...entry, bintang: entry.bintang - 1, terakhirHari: hari }
    }
  }

  // Proses jadwal jatuh tempo
  const jadwalSisa = []
  interface PasienJatuhTempo {
    kasusId: string
    catatan?: string
    nama?: string
    usia?: number
    jenisKelamin?: 'L' | 'P'
    keluargaId?: string
    rw?: number
  }
  const pasienKembali: PasienJatuhTempo[] = []
  let keluargaMap = s.desa.keluarga
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
          isi: hasilLab
            ? `Hasil pemeriksaan ${lab?.nama}: ${hasilLab.hasil}. Nilai rujukan: ${lab?.nilaiNormal}. Cocokkan dengan keputusan interimmu kemarin — inilah kenapa dokter FKTP harus berani menata laksana sambil menunggu hasil.`
            : `Hasil ${lab?.nama ?? j.labId} sudah keluar.`,
        }),
      )
    } else if (j.jenis === 'pasien_kembali' && j.kasusId) {
      pasienKembali.push({
        kasusId: j.kasusId,
        ...(j.catatan ? { catatan: j.catatan } : {}),
        ...(j.nama ? { nama: j.nama } : {}),
        ...(j.usia !== undefined ? { usia: j.usia } : {}),
        ...(j.jenisKelamin ? { jenisKelamin: j.jenisKelamin } : {}),
        ...(j.keluargaId ? { keluargaId: j.keluargaId } : {}),
        ...(j.rw !== undefined ? { rw: j.rw } : {}),
      })
    } else if (j.jenis === 'karma_igd' && j.keluargaId && j.kasusId) {
      const kelContent = pack.keluarga[j.keluargaId]
      const kel = keluargaMap[j.keluargaId]
      if (kelContent && kel && kel.arcSelesai !== 'berhasil') {
        // Karma terjadi: keluarga gagal, dan yang datang adalah ORANG YANG SAMA
        // dari cerita — konsekuensi bernama, bukan warga acak.
        const { karmaAktif: _lewat, ...kelGagal } = kel
        keluargaMap = { ...keluargaMap, [j.keluargaId]: { ...kelGagal, arcSelesai: 'gagal' } }
        tally.karmaTerjadi += 1
        pasienKembali.push({
          kasusId: j.kasusId,
          catatan: j.catatan ?? '',
          keluargaId: j.keluargaId,
          rw: kelContent.rw,
          ...(j.nama ? { nama: j.nama } : {}),
          ...(j.usia !== undefined ? { usia: j.usia } : {}),
          ...(j.jenisKelamin ? { jenisKelamin: j.jenisKelamin } : {}),
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
    }
  }

  // Follow-up mangkir (M1.4): janji kontrol yang lewat >1 hari = komitmen layu.
  // TTM mundur satu tahap; kader mengabarkan — tidak ada pembusukan senyap.
  for (const [id, kel] of Object.entries(keluargaMap)) {
    if (kel.followUpHari === undefined || hari <= kel.followUpHari + 1) continue
    const kelContent = pack.keluarga[id]
    const { followUpHari: _lewat, ...tanpaJanji } = kel
    keluargaMap = { ...keluargaMap, [id]: { ...tanpaJanji, ttm: mundurTtm(kel.ttm) } }
    suratBaru.push(
      buatSuratHarian(hari, suratBaru.length, {
        jenis: 'kabar_warga',
        dari: 'Kader RW ' + (kelContent?.rw ?? '?'),
        judul: `${kelContent?.namaKeluarga ?? id} — janji kontrol terlewat`,
        isi: `Dok, keluarga itu menunggu kunjungan lanjutan yang dijanjikan, tapi tidak ada yang datang. Semangat mereka yang kemarin mulai tumbuh sekarang kendur lagi. Perubahan perilaku itu seperti api kecil — kalau tidak dijaga, padam.`,
        kaitKeluargaId: id,
      }),
    )
  }

  // Drift keluarga rawan (M1.3 — versi DIBALIK dari bug lama: memburuk, bukan
  // membaik): keluarga berisiko yang ≥7 hari tak disentuh dokter bisa memburuk.
  // Maks 2 kejadian/pekan, SELALU diberitakan lewat surat kader.
  const mingguIni = Math.ceil(hari / 7)
  let drift = s.desa.drift.minggu === mingguIni ? { ...s.desa.drift } : { minggu: mingguIni, jumlah: 0 }
  const rngDrift = new Rng(s.seed, 'drift', hari)
  for (const [id, kel] of Object.entries(keluargaMap)) {
    if (drift.jumlah >= 2) break
    if (kel.arcSelesai) continue
    const kelContent = pack.keluarga[id]
    if (!kelContent) continue
    const rawan = s.desa.binaan.includes(id) || kel.karmaAktif !== undefined
    if (!rawan) continue
    const punyaData = Object.values(kel.indikator).some((n) => n.sumber !== 'belum')
    if (!punyaData) continue
    const terakhirDisentuh = kel.kunjunganTerakhir ?? 0
    if (hari - terakhirDisentuh < 7) continue
    if (!rngDrift.chance(0.35)) continue

    let kelBaru = kel
    let apaYangMemburuk: string
    if (kel.ttm !== 'prekontemplasi') {
      kelBaru = { ...kel, ttm: mundurTtm(kel.ttm) }
      apaYangMemburuk = 'niat berubah mereka mengendur'
    } else {
      const kandidat = Object.entries(kel.indikator).filter(
        ([, n]) => n.sumber !== 'belum' && n.statusSebenarnya === 'ya' && n.status !== 'na',
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

  // Surveilans (M1.2): pangkas jendela 14 hari, lalu deteksi KLUSTER BARU —
  // pola di poli menjadi kabar di peta (satu surat per kluster per RW).
  const surveilans = pangkasSurveilans(s.desa.surveilans, hari)
  const flags = { ...s.flags }
  for (const c of hitungCluster(surveilans, hari)) {
    const kunciFlag = `cluster_${c.kasusId}_rw${c.rw}`
    if (flags[kunciFlag]) continue
    flags[kunciFlag] = true
    const namaKasus = pack.kasus[c.kasusId]?.nama ?? c.kasusId
    const namaRw = pack.rw.find((r) => r.nomor === c.rw)?.nama ?? `RW ${c.rw}`
    suratBaru.push(
      buatSuratHarian(hari, suratBaru.length, {
        jenis: 'laporan_kader',
        dari: 'Petugas Surveilans',
        judul: `SINYAL KLUSTER — ${namaKasus} di ${namaRw}`,
        isi: `${c.jumlah} kasus ${namaKasus} dari ${namaRw} tercatat di poli dalam 14 hari terakhir. Ini bukan kebetulan, Dok — ada sumbernya di lapangan. Poli mengobati satu-satu; yang menghentikan penularan adalah tindakan di wilayah. Prioritaskan kunjungan/pembinaan ke RW itu.`,
      }),
    )
  }

  // KBK riil (M1.5): tiap awal bulan (hari 31, 61), kapitasi BPJS masuk dengan
  // pengali Kapitasi Berbasis Komitmen dari IKS desa — kerja UKM terasa di dompet.
  let kapitasi = s.kapitasi
  if (hari > 1 && hari % 30 === 1) {
    const rwBerdata = kaderHasil.rw.filter((r) => r.iks > 0)
    const iksDesa = rwBerdata.length > 0 ? rwBerdata.reduce((jml, r) => jml + r.iks, 0) / rwBerdata.length : 0
    const pengali = iksDesa > 0.8 ? 1.3 : iksDesa >= 0.5 ? 1.0 : 0.8
    const masukan = Math.round(6_000_000 * pengali)
    kapitasi += masukan
    suratBaru.push(
      buatSuratHarian(hari, suratBaru.length, {
        jenis: 'sistem',
        dari: 'BPJS Kesehatan',
        judul: `Kapitasi bulan ini: Rp ${masukan.toLocaleString('id-ID')} (KBK ×${pengali})`,
        isi: `Pembayaran kapitasi diterima. Pengali Kapitasi Berbasis Komitmen bulan ini ×${pengali} — ditentukan IKS desa binaanmu (${(iksDesa * 100).toFixed(0)}%). ${pengali < 1 ? 'IKS di bawah 0,5 memangkas pendapatan Puskesmas — kerja preventif di lapangan adalah kerja finansial juga.' : pengali > 1 ? 'IKS di atas 0,8 memberi bonus komitmen. Pertahankan.' : 'Naikkan IKS desa di atas 0,8 untuk pengali 1,3.'}`,
      }),
    )
  }

  // Susun antrian pagi: Director + pasien kembali/karma di depan
  const stateUntukDirector: GameState = {
    ...stateSementara,
    dex,
    desa: { ...stateSementara.desa, keluarga: keluargaMap, rw: kaderHasil.rw, kader: kaderHasil.kader, surveilans },
  }
  // Konten bisa berubah antar versi save — buang jadwal dengan kasus tak dikenal.
  const pasienKembaliValid = pasienKembali.filter((p) => pack.kasus[p.kasusId])
  const rngDirector = new Rng(s.seed, 'director', hari)
  const antrianDirector = susunAntrianHarian(
    stateUntukDirector,
    pack,
    rngDirector,
    pasienKembaliValid.map((p) => p.kasusId),
  )
  const antrianKembali = pasienKembaliValid.map((p, i) =>
    buatPasienDariKasus(p.kasusId, pack, new Rng(s.seed, 'kembali', hari, i), {
      followUpDari: p.catatan ?? 'follow-up',
      ...(p.nama ? { nama: p.nama } : {}),
      ...(p.usia !== undefined ? { usia: p.usia } : {}),
      ...(p.jenisKelamin ? { jenisKelamin: p.jenisKelamin } : {}),
      ...(p.keluargaId ? { keluargaId: p.keluargaId } : {}),
      ...(p.rw !== undefined ? { rw: p.rw } : {}),
    }),
  )
  const antrian = [...antrianKembali, ...antrianDirector]

  for (const m of suratBaru) events.push({ type: 'SURAT_MASUK', surat: m })

  if (hari === HARI_BUKA_PETA) flags['petaBaruTerbuka'] = true
  if (hari === HARI_BUKA_KUNJUNGAN) flags['kunjunganBaruTerbuka'] = true
  if (hari === HARI_REKAP_SLICE) flags['rekapSlice'] = true

  return {
    state: {
      ...s,
      hari,
      blok: 'pagi',
      layar: 'meja',
      stamina,
      burnout,
      tally,
      dex,
      kapitasi,
      jadwal: jadwalSisa,
      inbox: [...s.inbox, ...suratBaru],
      flags,
      klinik: { antrian, aktif: undefined, selesaiHariIni: [], autoHariIni: { jumlah: 0, bermasalah: 0 } },
      hasilKunjunganHariIni: undefined,
      desa: { ...s.desa, keluarga: keluargaMap, rw: kaderHasil.rw, kader: kaderHasil.kader, surveilans, drift },
    },
    events,
  }
}
