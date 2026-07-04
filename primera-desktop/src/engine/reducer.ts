/**
 * REDUCER — jantung engine. `advance(state, action, pack) → { state, events }`.
 * Murni & deterministik: keacakan hanya dari Rng yang diturunkan seed+hari+aksi.
 * Action-log dicatat di sini — sumber kebenaran skor.
 */

import type { Action } from './actions'
import type { GameEvent } from './events'
import type { FokusProgram, GameState, PenilaianEncounter, PesertaProlanis, Surat } from './state'
import type { ContentPack } from '@content/pack'
import { Rng } from './core/rng'
import { buatEncounter, aksiKlinik, nilaiEncounter } from './clinic'
import { buatKunjungan, aksiKunjungan, selesaikanKunjungan, terapkanHasil, mundurTtm } from './kunjungan'
import { prosesHarianKader } from './kader'
import { susunAntrianHarian, buatPasienDariKasus, peluangIgd } from './director'
import { kasusMenular, pangkasSurveilans, hitungCluster } from './surveilans'
import {
  buatKegiatan,
  jawabKegiatan,
  delegasiKegiatan,
  nilaiKegiatan,
  driftProlanis,
  kartuPosyandu,
  kartuProlanis,
  kartuKlb,
} from './kegiatan'
import { buatIgd, aksiIgd, rjpIgd, nilaiIgd } from './igd'
import { hitungSkor } from './scoring'
import { HARI_STASE } from './paketUjian'

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
export const HARI_BUKA_POSYANDU = 15
export const HARI_BUKA_PROLANIS = 30
export const HARI_BUKA_KLB = 45
export const COOLDOWN_POSYANDU = 30
export const BIAYA_STAMINA_KEGIATAN = 2
/** Kapasitas roster keluarga binaan (M3c: 8 → 16 seiring 16 keluarga bernama). */
export const MAKS_BINAAN = 16
/** M4.18 — lead time pengadaan obat (hari). */
export const LEAD_TIME_OBAT = 3
/** M4.19 — biaya operasional bulanan Puskesmas (listrik, ATK, BBM ambulans...). */
export const OPERASIONAL_BULANAN = 2_500_000
/** M4.19 — ambang kas: di bawah ini laporan bulanan berbuntut teguran Dinkes. */
export const AMBANG_TEGURAN_KAS = 8_000_000

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

function catat(state: GameState, action: Action, detail?: string): GameState {
  const entry = { hari: state.hari, blok: state.blok, aksi: action.type, ...(detail ? { detail } : {}) }
  // M6: jejak = jurnal aksi PENUH (payload utuh) — aksi yang ditolak pun ikut
  // dicatat supaya replay mereproduksi penolakan yang sama (verifikasi.ts).
  return { ...state, log: [...state.log, entry], jejak: [...state.jejak, action] }
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
    case 'HAPUS_TINDAKAN': {
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
      const kasus = pack.kasus[enc.pasien.kasusId]
      if (!kasus) return err(s, `Kasus ${enc.pasien.kasusId} tidak ditemukan.`)
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
      if (!enc.diagnosis) return err(s, 'Komit diagnosis dulu sebelum menentukan disposisi (termasuk rujuk).')
      // Phase-guard (CODEX audit 2026-07-04, temuan #2 §9): selaras dgn guard
      // di clinic.ts — DISPOSISI hanya sah di fase disposisi, walau diagnosis
      // sudah ada (mis. baru KOMIT_DIAGNOSIS, belum LANJUT_FASE dari terapi).
      if (enc.fase !== 'disposisi') {
        return err(s, `Selesaikan tahap terapi dulu — pasien ini masih di tahap ${enc.fase}.`)
      }
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

      // Ekonomi ringkas: BPJS bakar HPP obat, umum bayar harga jual.
      // M4.18/19: resep mengonsumsi stok gudang + tercatat di buku kas bulanan.
      let kapitasi = s.kapitasi
      const stokBaru = { ...s.gudang.stok }
      let belanjaObat = s.keuanganBulan.belanjaObat
      for (const obatId of encFinal.resep) {
        const o = pack.obat[obatId]
        if (!o) continue
        kapitasi += encFinal.pasien.bpjs ? -o.hargaBeli : o.hargaJual
        if (encFinal.pasien.bpjs) belanjaObat += o.hargaBeli
        if (stokBaru[obatId] !== undefined) stokBaru[obatId] = Math.max(0, stokBaru[obatId]! - 1)
      }
      // M4.20 — rekam medis lengkap (bahan akreditasi D60): semua fase SOAP ≥50.
      const rmLengkap =
        nilai.skorAnamnesis >= 50 &&
        nilai.skorPemeriksaan >= 50 &&
        nilai.skorTerapi >= 50 &&
        nilai.skorEdukasi >= 50
      if (rmLengkap) t.rmLengkap += 1

      // Dex (Leitner-lite). "Menguasai" = diagnosis benar DAN disposisi tepat —
      // untuk kasus rujukan, kompetensinya memang "kenali & rujuk" (M3.13).
      const dex = { ...s.dex }
      const lama = dex[kasus.id] ?? { kasusId: kasus.id, ditangani: 0, benar: 0, bintang: 0, terakhirHari: 0 }
      const kuasai = nilai.diagnosisBenar && nilai.disposisiTepat
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
      let penilaianFinal: PenilaianEncounter = nilai
      const resepBerbahaya = (kasus.tatalaksana.obatSalahUmum ?? []).some((o) => encFinal.resep.includes(o.id))
      // WAJIB lab itu RELEVAN dgn kasus (DeepThink #1, sinkron dgn clinic.ts) —
      // tanpa ini "observasi" bisa dipakai sbg kedok memesan lab apa saja lalu
      // dikecualikan dari konsekuensi tanpa alasan klinis nyata.
      const observasiMenungguLab =
        action.jenis === 'observasi' &&
        encFinal.labDipesan.some((id) => {
          if (!pack.lab[id]?.hasilBesok) return false
          return kasus.lab.find((l) => l.id === id)?.relevan === true
        })
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
            kasusId: kasus.id,
            catatan: `${encFinal.pasien.nama} — kembali untuk evaluasi hasil lab kemarin.`,
            nama: encFinal.pasien.nama,
            usia: encFinal.pasien.usia,
            jenisKelamin: encFinal.pasien.jenisKelamin,
            rw: encFinal.pasien.rw,
            ...(encFinal.pasien.keluargaId ? { keluargaId: encFinal.pasien.keluargaId } : {}),
          },
        ]
        penilaianFinal = { ...nilai, konsekuensiDijadwalkan: true }
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

          if (!kasus.harusDirujuk || encFinal.pasien.prb) {
            // Ditolak: kompetensi FKTP. Pasien dipulangkan RS, kembali besok.
            t.rujukanDitolak += 1
            jadwal = [
              ...jadwal,
              {
                id: `jadwal_boomerang_${s.hari}_${encFinal.pasien.id}`,
                hari: s.hari + 1,
                jenis: 'pasien_kembali',
                kasusId: kasus.id,
                catatan: `${encFinal.pasien.nama} — dikembalikan ${rs.nama}: kasus kompetensi FKTP, mohon dituntaskan di Puskesmas`,
                nama: encFinal.pasien.nama,
                usia: encFinal.pasien.usia,
                jenisKelamin: encFinal.pasien.jenisKelamin,
                rw: encFinal.pasien.rw,
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
            }
          } else if (!spesialisCocok) {
            t.rujukanDitolak += 1
            jadwal = [
              ...jadwal,
              {
                id: `jadwal_tolakspes_${s.hari}_${encFinal.pasien.id}`,
                hari: s.hari + 1,
                jenis: 'pasien_kembali',
                kasusId: kasus.id,
                catatan: `${encFinal.pasien.nama} — ${rs.nama} tak punya layanan ${kasus.spesialisRujukan?.replace(/_/g, ' ')}; rujuk ulang ke RS yang tepat`,
                nama: encFinal.pasien.nama,
                usia: encFinal.pasien.usia,
                jenisKelamin: encFinal.pasien.jenisKelamin,
                rw: encFinal.pasien.rw,
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
            }
          } else if (!bedTersedia) {
            t.rujukanDitolak += 1
            jadwal = [
              ...jadwal,
              {
                id: `jadwal_tolakbed_${s.hari}_${encFinal.pasien.id}`,
                hari: s.hari + 1,
                jenis: 'pasien_kembali',
                kasusId: kasus.id,
                catatan: `${encFinal.pasien.nama} — bed ${rs.nama} penuh; rujuk ulang (coba RS lain)`,
                nama: encFinal.pasien.nama,
                usia: encFinal.pasien.usia,
                jenisKelamin: encFinal.pasien.jenisKelamin,
                rw: encFinal.pasien.rw,
              },
            ]
            suratSisrute = {
              id: `surat_sisrute_${s.hari}_${s.log.length}`,
              hari: s.hari,
              jenis: 'kabar_warga',
              dari: rs.nama,
              judul: `Bed penuh — rujukan ${encFinal.pasien.nama} tertunda`,
              isi: `Balasan SISRUTE: seluruh bed ${rs.nama} terisi hari ini. Pasien kembali besok — pertimbangkan RS lain di jejaring (kapasitas lebih besar biasanya lebih jauh; itulah trade-off rujukan).`,
              dibaca: false,
            }
          } else {
            // DITERIMA oleh jejaring — tapi confidence-tag (bonus skor) hanya untuk
            // rujukan yang juga BENAR secara diagnosis (CODEX P1): RS menerima
            // pasien gawat apa pun, itu bukan bukti penalaran klinis pemain tepat.
            if (nilai.diagnosisBenar) t.rujukanTepat += 1
            // PRB tetap terjadwal terlepas dari ketepatan diagnosis — pasien tetap
            // harus kembali kontrol; hanya skor pengakuan yang dibedakan.
            const rngPrb = new Rng(s.seed, 'prb', s.hari, encFinal.pasien.id)
            jadwal = [
              ...jadwal,
              {
                id: `jadwal_prb_${s.hari}_${encFinal.pasien.id}`,
                hari: s.hari + rngPrb.int(7, 12),
                jenis: 'pasien_kembali',
                kasusId: kasus.id,
                catatan: `${encFinal.pasien.nama} — kontrol PRB: pulang dari ${rs.nama} dengan surat rujuk balik, lanjutkan terapi di FKTP`,
                nama: encFinal.pasien.nama,
                usia: encFinal.pasien.usia,
                jenisKelamin: encFinal.pasien.jenisKelamin,
                rw: encFinal.pasien.rw,
                prb: true,
              },
            ]
            suratSisrute = {
              id: `surat_sisrute_${s.hari}_${s.log.length}`,
              hari: s.hari,
              jenis: 'pujian_kapus',
              dari: rs.nama,
              judul: `Rujukan DITERIMA — ${encFinal.pasien.nama}`,
              isi: `Balasan SISRUTE: pasien ${kasus.nama} kami terima di ${rs.nama}. Setelah stabil, ia akan dipulangkan dengan surat rujuk balik (PRB) — kontrol lanjutannya kembali menjadi tanggung jawab FKTP-mu. Rujukan berjenjang bekerja dua arah.`,
              dibaca: false,
            }
          }
          events.push({ type: 'SURAT_MASUK', surat: suratSisrute })
        }
      }

      // Surveilans balik UKP→UKM (M1.2): diagnosis menular tercatat per RW —
      // pola di poli menyalakan sinyal di peta, apa pun disposisinya.
      const desaBaru = kasusMenular(kasus.id)
        ? { ...s.desa, surveilans: [...s.desa.surveilans, { hari: s.hari, rw: encFinal.pasien.rw, kasusId: kasus.id }] }
        : s.desa

      // Tutorial (DeepThink "onboarding railroaded", keputusan user): encounter
      // PERTAMA stase baru KEBAL skor sepenuhnya — semua agregat scoring
      // dikembalikan ke nilai SEBELUM encounter ini (bukan disunting parsial
      // di tengah blok di atas, supaya logika normal di atas tetap 100% utuh
      // & teruji; imun cukup satu titik di sini). Narasi tetap normal (patut
      // muncul di debrief) — hanya skor/ekonomi/jurnal konsekuensi yg dibekukan.
      // `tutorialAktif` SELALU dimatikan di sini (satu-kali, terlepas nilainya
      // sebelum ini) — titik keluar tunggal case DISPOSISI.
      const kebalTutorial = s.tutorialAktif
      const tallyFinal = kebalTutorial ? s.tally : t
      const dexFinal = kebalTutorial ? s.dex : dex
      const kapitasiFinal = kebalTutorial ? s.kapitasi : kapitasi
      const stokFinal = kebalTutorial ? s.gudang.stok : stokBaru
      const belanjaObatFinal = kebalTutorial ? s.keuanganBulan.belanjaObat : belanjaObat
      const jadwalFinal = kebalTutorial ? s.jadwal : jadwal
      const desaFinal = kebalTutorial ? s.desa : desaBaru
      // CODEX: DEX_BERTAMBAH/SURAT_MASUK dipancarkan tanpa syarat di atas —
      // toaster (Toaster.tsx) akan bilang "Buku Saku diperbarui"/"Surat baru"
      // meski dex/inbox sungguhan dibekukan barusan. Pangkas KEDUA event itu
      // saat kebal (bukan cuma inbox-nya) — ENCOUNTER_SELESAI/STEMPEL tetap
      // lolos, itu narasi debrief yang memang harus tetap muncul.
      const eventsFinal = kebalTutorial
        ? events.filter((e) => e.type !== 'DEX_BERTAMBAH' && e.type !== 'SURAT_MASUK')
        : events

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
          klinik: {
            ...s.klinik,
            aktif: undefined,
            selesaiHariIni: [...s.klinik.selesaiHariIni, penilaianFinal],
          },
          ...(suratSisrute && !kebalTutorial ? { inbox: [...s.inbox, suratSisrute] } : {}),
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

        let kelBaru = terapkanHasil(kel, hasil, skenario, s.hari, kelContent.arc.kunjungan.length)

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
          lapanganTerpakai: true,
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

    /* -- UKM: kegiatan lapangan terjadwal (M2) --------------------------------- */

    case 'MULAI_POSYANDU': {
      const cek = cekSlotKegiatan(s, HARI_BUKA_POSYANDU, 'Posyandu')
      if (cek) return err(s, cek)
      const terakhir = s.posyanduRwTerakhir[String(action.rw)]
      if (terakhir !== undefined && s.hari - terakhir < COOLDOWN_POSYANDU) {
        return err(s, `Posyandu RW ${action.rw} baru digelar — jadwalnya bulanan (tiap 30 hari).`)
      }
      return {
        state: {
          ...s,
          stamina: s.stamina - BIAYA_STAMINA_KEGIATAN,
          layar: 'kegiatan',
          kegiatan: buatKegiatan('posyandu', kartuPosyandu(), { rw: action.rw }),
        },
        events: [],
      }
    }

    case 'MULAI_PROLANIS': {
      const cek = cekSlotKegiatan(s, HARI_BUKA_PROLANIS, 'Prolanis')
      if (cek) return err(s, cek)
      if (s.prolanis.roster.length === 0) return err(s, 'Belum ada peserta Prolanis terdaftar.')
      const berikut = s.prolanis.sesiBerikutHari
      if (berikut !== undefined && s.hari < berikut) {
        return err(s, `Sesi Prolanis bulan ini sudah dilakukan — sesi berikutnya hari ke-${berikut}.`)
      }
      return {
        state: {
          ...s,
          stamina: s.stamina - BIAYA_STAMINA_KEGIATAN,
          layar: 'kegiatan',
          kegiatan: buatKegiatan('prolanis', kartuProlanis(s.prolanis.roster)),
        },
        events: [],
      }
    }

    case 'MULAI_KLB': {
      const cek = cekSlotKegiatan(s, HARI_BUKA_KLB, 'Respons KLB')
      if (cek) return err(s, cek)
      const cluster = hitungCluster(s.desa.surveilans, s.hari).find(
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
          kegiatan: buatKegiatan('klb', kartuKlb(action.kasusId, namaKasus, namaRw), {
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
      const periodeIni = Math.ceil(s.hari / 30)
      // DeepThink ronde-2: guard lama cuma cek `fokus` — mempertahankan fokus
      // yang sama sambil mengganti `rwFokus` TIAP HARI lolos tanpa ditolak,
      // membiarkan pemain micromanage target bonusIks harian antar-RW. Itu
      // membunuh esensi "kunci sebulan, korbankan RW lain" — kunci juga rwFokus.
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
      if (hasil.igd.fase === 'kode_biru') {
        events.push({ type: 'IGD_TIBA', narasi: 'KODE BIRU — pasien henti napas/jantung! Mulai RJP!' })
      }
      return { state: { ...s, igd: hasil.igd }, events }
    }

    case 'RJP_IGD': {
      const igd = s.igd
      if (!igd || igd.fase !== 'kode_biru') return err(s, 'Tidak dalam Kode Biru.')
      const kasus = pack.kasusIgd[igd.kasusId]
      if (!kasus) return err(s, 'Kasus IGD tidak dikenal.')
      const rng = new Rng(s.seed, 'rjp', s.hari, igd.kasusId)
      const igdBaru = rjpIgd(igd, action.berkualitas, rng)

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
        events: [{ type: 'KARMA_DICEGAH', narasi: 'ROSC — sirkulasi kembali! Pasien selamat, segera disposisi.' }],
      }
    }

    case 'DISPOSISI_IGD': {
      const igd = s.igd
      if (!igd || igd.fase !== 'disposisi') return err(s, 'Pasien belum siap disposisi.')
      const kasus = pack.kasusIgd[igd.kasusId]
      if (!kasus) return err(s, 'Kasus IGD tidak dikenal.')
      const nilai = nilaiIgd({ ...igd, hasil: 'stabil' }, kasus, action.jenis)
      // Disposisi keliru (pasien selamat tapi diarahkan salah) tidak boleh dihargai
      // sama seperti disposisi tepat — itu sebabnya CODEX menandai ini P1.
      const t = nilai.disposisiTepat
        ? { ...s.tally, igdStabil: s.tally.igdStabil + 1 }
        : { ...s.tally, igdSalahDisposisi: s.tally.igdSalahDisposisi + 1 }
      const rsNama = action.rumahSakitId
        ? pack.rumahSakit.find((r) => r.id === action.rumahSakitId)?.nama ?? 'RS rujukan'
        : 'RS rujukan'
      // Prinsip SISRUTE: kasus EMERGENSI stabil selalu diterima jejaring.
      const surat: Surat = {
        id: `surat_igd_${s.hari}_${s.log.length}`,
        hari: s.hari,
        jenis: nilai.disposisiTepat ? 'pujian_kapus' : 'teguran_kapus',
        dari: 'dr. Harsono, Kepala Puskesmas',
        judul: nilai.disposisiTepat
          ? `IGD: ${igd.pasienNama} tertangani baik (${nilai.benar}/${nilai.total} langkah tepat)`
          : `IGD: disposisi ${igd.pasienNama} keliru`,
        isi: nilai.disposisiTepat
          ? `${igd.pasienNama} stabil dan ${action.jenis === 'rujuk' ? `diterima ${rsNama}` : 'dipulangkan dengan observasi'}. ${kasus.clue}`
          : `${igd.pasienNama} selamat, tapi disposisimu keliru — ${kasus.disposisiBenar === 'rujuk' ? `kasus ${kasus.nama} pasca-stabilisasi wajib DIRUJUK, bukan dipulangkan. Untung keluarganya membawanya ke RS sendiri.` : `kasus ini dapat dituntaskan dengan observasi di Puskesmas — merujuk semuanya membebani jejaring.`} ${kasus.clue}`,
        dibaca: false,
      }
      return {
        state: { ...s, igd: undefined, tally: t, layar: 'klinik', inbox: [...s.inbox, surat] },
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
        // Silaturahmi: mampir tanpa agenda ke keluarga binaan — trust naik tipis.
        keluarga = { ...keluarga }
        for (const id of s.desa.binaan) {
          const kel = keluarga[id]
          if (kel && !kel.arcSelesai) keluarga[id] = { ...kel, trust: Math.min(10, kel.trust + 1) }
        }
        narasi = 'Keliling desa tanpa tas obat — cuma ngobrol dan minum teh. Warga melihatmu sebagai manusia, bukan seragam.'
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
  let next: GameState = { ...s, kegiatan: undefined, lapanganTerpakai: true, layar: 'peta' }

  if (hasil.jenis === 'posyandu' && hasil.rw !== undefined) {
    tally.posyanduSesi += 1
    // Kualitas posyandu → bonus IKS RW (gizi & imunisasi terangkat).
    const bonus = 0.02 + 0.04 * hasil.skor
    next = {
      ...next,
      posyanduRwTerakhir: { ...next.posyanduRwTerakhir, [String(hasil.rw)]: s.hari },
      desa: { ...next.desa, rw: tambahBonusIks(next.desa.rw, hasil.rw, bonus) },
    }
  } else if (hasil.jenis === 'prolanis') {
    tally.prolanisSesi += 1
    // Drift tiap peserta menurut ketepatan jawaban kartu-nya + jembatan UKP.
    const rng = new Rng(s.seed, 'prolanis', s.hari)
    const jadwalBaru = [...next.jadwal]
    const roster = s.prolanis.roster.map((p) => {
      const jwb = hasil.jawaban.find((j) => j.kartuId === `prol_${p.id}`)
      const pBaru = driftProlanis(p, jwb?.benar ?? false, rng)
      // 2x tak terkontrol berturut → komplikasi bernama muncul di poli (bridge).
      if (pBaru.takTerkontrolBerturut >= 2) {
        const kasusId = pBaru.jenis === 'ht' ? 'stroke_iskemik' : 'dm_tipe2'
        if (pack.kasus[kasusId]) {
          jadwalBaru.push({
            id: `jadwal_prolanis_${s.hari}_${p.id}`,
            hari: s.hari + rng.int(2, 6),
            jenis: 'pasien_kembali',
            kasusId,
            catatan: `${p.nama} — ${pBaru.jenis === 'ht' ? 'hipertensi tak terkontrol berbulan-bulan' : 'gula darah liar tak terkendali'}`,
            nama: p.nama,
            usia: p.usia,
            jenisKelamin: p.jenisKelamin,
            rw: p.rw,
          })
        }
        return { ...pBaru, takTerkontrolBerturut: 0 }
      }
      return pBaru
    })
    next = {
      ...next,
      jadwal: jadwalBaru,
      prolanis: { ...s.prolanis, roster, sesiBerikutHari: s.hari + 30 },
    }
  } else if (hasil.jenis === 'klb' && hasil.rw !== undefined && hasil.kasusId !== undefined) {
    // Respons KLB tuntas: buang entri surveilans kluster itu (penularan diputus)
    // + bonus IKS RW; buruk = kluster tetap menyala.
    if (hasil.skor >= 0.66) {
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
          rw: tambahBonusIks(next.desa.rw, hasil.rw, 0.03),
        },
      }
      events.push({ type: 'KARMA_DICEGAH', narasi: `Kluster ${pack.kasus[hasil.kasusId]?.nama ?? hasil.kasusId} di RW ${hasil.rw} berhasil ditanggulangi.` })
    }
  }

  return { state: { ...next, tally }, events }
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
        const pasienSkip = s.klinik.antrian[i]
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
              ...(pasienSkip.keluargaId ? { keluargaId: pasienSkip.keluargaId } : {}),
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

function hariBaru(s: GameState, pack: ContentPack): HasilAdvance {
  const hari = s.hari + 1

  // M4.5 — AKHIR STASE: melewati hari terakhir mode ini mengunci skor.
  // Ujian: D30 (instrumen dinilai). Karier: D90. Setelah tamat, LANJUTKAN
  // ditolak; membaca surat/rapor/dex tetap boleh. Sinematik penutup = M5.
  if (hari > HARI_STASE[s.mode]) {
    const skor = hitungSkor(s)
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
        ...s,
        tamat: { hari: s.hari, grade: skor.grade },
        layar: 'laporan',
        klinik: { ...s.klinik, antrian: [], aktif: undefined },
        kunjungan: undefined,
        kegiatan: undefined,
        igd: undefined,
        inbox: [...s.inbox, surat],
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
  const jadwalSisa = []
  interface PasienJatuhTempo {
    kasusId: string
    catatan?: string
    nama?: string
    usia?: number
    jenisKelamin?: 'L' | 'P'
    keluargaId?: string
    rw?: number
    prb?: boolean
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
          // Kasus mendefinisikan hasil utk lab yang RELEVAN dengannya. Bila
          // pemain memesan lab di luar itu (tak didefinisikan kasus), suratnya
          // JANGAN kosong: tampilkan nilai rujukan sbg "dalam batas normal" +
          // pesan stewardship (lab non-indikasi = pemborosan FKTP). Lab yang
          // memang penting utk kasus HARUS punya entri di kasus.lab.
          isi: hasilLab
            ? `Hasil pemeriksaan ${lab?.nama}: ${hasilLab.hasil}. Nilai rujukan: ${lab?.nilaiNormal}. Cocokkan dengan keputusan interimmu kemarin — inilah kenapa dokter FKTP harus berani menata laksana sambil menunggu hasil.`
            : `Hasil pemeriksaan ${lab?.nama ?? j.labId}: dalam batas rujukan${lab?.nilaiNormal ? ` (${lab.nilaiNormal})` : ''} — tidak menunjukkan kelainan bermakna untuk kasus ini. Timbang indikasi sebelum memesan penunjang: pemeriksaan yang tak mengubah tata laksana adalah beban biaya bagi Puskesmas.`,
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
        ...(j.prb ? { prb: true } : {}),
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

  // Program wilayah agregat (M2.10): fokus bulanan (Triase Anggaran, PSN/PHBS/
  // skrining) yang ditetapkan dokter bekerja tiap hari — menekan penularan
  // (buang 1 entri surveilans yang cocok) & menaikkan bonus IKS RW fokus
  // sedikit demi sedikit.
  let surveilans = pangkasSurveilans(s.desa.surveilans, hari)
  let rwSetelahProgram = kaderHasil.rw
  if (s.program.fokus) {
    const fokus = s.program.fokus
    const targetKasus = TARGET_KASUS_PROGRAM[fokus]
    const idxRedam = surveilans.findIndex(
      (e) => targetKasus.includes(e.kasusId) && (s.program.rwFokus === undefined || e.rw === s.program.rwFokus),
    )
    if (idxRedam >= 0) surveilans = surveilans.filter((_, i) => i !== idxRedam)
    if (s.program.rwFokus !== undefined) {
      rwSetelahProgram = rwSetelahProgram.map((r) =>
        r.nomor === s.program.rwFokus ? { ...r, bonusIks: Math.min(0.3, r.bonusIks + 0.004) } : r,
      )
    }
  }

  // Surveilans (M1.2): deteksi KLUSTER BARU — pola di poli jadi kabar di peta
  // (satu surat per kluster per RW). Kluster ≥ambang juga membuka Respons KLB.
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

  // KBK riil (M1.5) + LAPORAN BULANAN (M4.19): tiap awal bulan (hari 31, 61)
  // kapitasi BPJS masuk ber-pengali KBK, biaya operasional dipotong, dan buku
  // kas bulan lalu dilaporkan. Kas di bawah ambang → teguran Dinkes (Manajemen).
  let kapitasi = s.kapitasi
  let keuanganBulan = s.keuanganBulan
  if (hari > 1 && hari % 30 === 1) {
    const rwBerdata = kaderHasil.rw.filter((r) => r.iks > 0)
    const iksDesa = rwBerdata.length > 0 ? rwBerdata.reduce((jml, r) => jml + r.iks, 0) / rwBerdata.length : 0
    const pengali = iksDesa > 0.8 ? 1.3 : iksDesa >= 0.5 ? 1.0 : 0.8
    const masukan = Math.round(6_000_000 * pengali)
    kapitasi += masukan - OPERASIONAL_BULANAN
    suratBaru.push(
      buatSuratHarian(hari, suratBaru.length, {
        jenis: 'sistem',
        dari: 'BPJS Kesehatan',
        judul: `Kapitasi bulan ini: Rp ${masukan.toLocaleString('id-ID')} (KBK ×${pengali})`,
        isi: `Pembayaran kapitasi diterima. Pengali Kapitasi Berbasis Komitmen bulan ini ×${pengali} — ditentukan IKS desa binaanmu (${(iksDesa * 100).toFixed(0)}%). ${pengali < 1 ? 'IKS di bawah 0,5 memangkas pendapatan Puskesmas — kerja preventif di lapangan adalah kerja finansial juga.' : pengali > 1 ? 'IKS di atas 0,8 memberi bonus komitmen. Pertahankan.' : 'Naikkan IKS desa di atas 0,8 untuk pengali 1,3.'}`,
      }),
    )
    suratBaru.push(
      buatSuratHarian(hari, suratBaru.length, {
        jenis: 'sistem',
        dari: 'Bendahara Puskesmas',
        judul: `Laporan keuangan bulanan — saldo Rp ${kapitasi.toLocaleString('id-ID')}`,
        isi:
          `Rekap bulan lalu — Pemasukan kapitasi: Rp ${masukan.toLocaleString('id-ID')} (KBK ×${pengali}). ` +
          `Belanja obat pasien JKN: Rp ${keuanganBulan.belanjaObat.toLocaleString('id-ID')}. ` +
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

  // M4.20 — Akreditasi: pengumuman D50, visitasi D60 mengaudit REKAM MEDISMU
  // sendiri (proporsi encounter dengan SOAP lengkap dari action-log/tally).
  let akreditasi = s.akreditasi
  if (hari === 50) {
    suratBaru.push(
      buatSuratHarian(hari, suratBaru.length, {
        jenis: 'sistem',
        dari: 'Dinas Kesehatan Kabupaten',
        judul: 'PEMBERITAHUAN — visitasi akreditasi hari ke-60',
        isi: `Tim surveior akan menilai KELENGKAPAN REKAM MEDIS poli (anamnesis, pemeriksaan, terapi, edukasi — SOAP utuh, bukan sekadar diagnosis benar). Sepuluh hari lagi. Rekam medis yang kamu tulis sejak hari pertama adalah berkas ujiannya — tidak ada yang bisa dikebut semalam.`,
      }),
    )
  }
  if (hari === 60 && akreditasi === undefined) {
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

  // Prolanis roster (M2.8): dibentuk sekali saat program terbuka (D30) dari
  // warga binaan/desa ber-kondisi kronis (HT/DM). Deterministik dari konten.
  let prolanis = s.prolanis
  if (hari === HARI_BUKA_PROLANIS && prolanis.roster.length === 0) {
    prolanis = { roster: bentukRosterProlanis(pack, new Rng(s.seed, 'prolanis-roster')), sesiBerikutHari: hari }
    suratBaru.push(
      buatSuratHarian(hari, suratBaru.length, {
        jenis: 'sistem',
        dari: 'Koordinator Prolanis',
        judul: `Program Prolanis dibuka — ${prolanis.roster.length} peserta kronis terdaftar`,
        isi: `Peserta hipertensi & diabetes terdaftar untuk pemantauan rutin bulanan. Gelar sesi Prolanis di blok siang. Peserta yang dua bulan berturut tak terkontrol akan berujung di poli dengan komplikasi — pantau ketat.`,
      }),
    )
  }

  // Lokakarya Mini (M2.11): rapat evaluasi bulanan D31/D61 — rapor formatif +
  // ghost rival dr. Ratih (data statis, tanpa multiplayer).
  if (hari === 31 || hari === 61) {
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
  const pasienKembaliValid = pasienKembali.filter((p) => pack.kasus[p.kasusId])
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
      followUpDari: p.catatan ?? 'follow-up',
      ...(p.nama ? { nama: p.nama } : {}),
      ...(p.usia !== undefined ? { usia: p.usia } : {}),
      ...(p.jenisKelamin ? { jenisKelamin: p.jenisKelamin } : {}),
      ...(p.keluargaId ? { keluargaId: p.keluargaId } : {}),
      ...(p.rw !== undefined ? { rw: p.rw } : {}),
      ...(p.prb ? { prb: true } : {}),
    }),
  )
  const antrian = [...antrianKembali, ...antrianDirector]

  if (hari === HARI_BUKA_PETA) flags['petaBaruTerbuka'] = true
  if (hari === HARI_BUKA_KUNJUNGAN) flags['kunjunganBaruTerbuka'] = true
  if (hari === HARI_REKAP_SLICE) flags['rekapSlice'] = true
  if (hari === HARI_BUKA_POSYANDU) flags['posyanduBaruTerbuka'] = true
  if (hari === HARI_BUKA_PROLANIS) flags['prolanisBaruTerbuka'] = true
  if (hari === HARI_BUKA_KLB) flags['klbBaruTerbuka'] = true

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
  const poolIgd = Object.values(pack.kasusIgd)
  if (hari >= 4 && poolIgd.length > 0 && hari - igdTerakhir >= 4 && rngIgd.chance(peluangIgd(hari, s.mode))) {
    const kasusIgd = rngIgd.pick(poolIgd)
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
      jadwal: jadwalSisa,
      inbox: [...s.inbox, ...suratBaru],
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
      const jenis: 'ht' | 'dm' = ht ? 'ht' : 'dm'
      roster.push({
        id: `prol_${kel.id}_${a.nama.replace(/\s+/g, '')}`,
        nama: a.nama,
        usia: a.usia,
        jenisKelamin: a.jenisKelamin,
        rw: kel.rw,
        jenis,
        // Mulai tak terkontrol (butuh intervensi) — itulah gunanya program.
        param: jenis === 'ht' ? rng.int(150, 175) : rng.int(210, 280),
        takTerkontrolBerturut: 0,
      })
    }
  }
  return roster
}
