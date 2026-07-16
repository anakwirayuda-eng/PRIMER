/**
 * MEJA KERJA — hub compulsion loop (GDD §4.1): 80% waktu pemain mendarat di sini.
 * Tiga panel: Kotak Masuk (kiri) · kartu konteks blok (tengah) · Langkah
 * Berikutnya dengan tombol LANJUTKAN besar (kanan). Modal rekap slice di Hari 8.
 * UI tidak menghitung aturan — semua angka dari engine (ringkasanHarian,
 * hitungSkor, hitungIksKeluarga).
 */

import { useEffect, useMemo, useState } from 'react'
import { useGame } from '../store'
import type { JenisSurat, Surat } from '@engine/state'
import type { Persona } from '@content/types'
import { formatUsia } from '@engine/usia'
import { hitungSkor, ringkasanHarian } from '@engine/director'
import { hitungIksKeluarga } from '@engine/pispk'
import {
  HARI_BUKA_PETA,
  HARI_BUKA_KUNJUNGAN,
  HARI_BUKA_PROLANIS,
  BIAYA_STAMINA_KEGIATAN,
  TARGET_KASUS_PROGRAM,
  SIKLUS_LAPORAN_BULANAN,
} from '@engine/reducer'
import type { FokusProgram } from '@engine/state'
import { clusterAktif } from '@engine/surveilans'
import { PACK } from '@content/index'
import { karmaTerlihat } from './peta/petaUtil'
import { useFocusTrap } from '../useFocusTrap'
import { useRadioGroup } from '../useRadioGroup'
import './MejaKerja.css'

const OPSI_PROGRAM = ['psn', 'phbs', 'skrining'] as const

const LABEL_PROGRAM: Record<FokusProgram, string> = {
  psn: 'PSN 3M (vektor DBD)',
  phbs: 'PHBS & sanitasi (diare)',
  skrining: 'Skrining aktif (TB/ISPA)',
}

/* ---------------------------------------------------------------------------
 * Label & format
 * ------------------------------------------------------------------------- */

const SURAT_META: Record<JenisSurat, { label: string; chip: string }> = {
  laporan_kader: { label: 'Laporan Kader', chip: 'chip--kunyit' },
  hasil_lab: { label: 'Hasil Lab', chip: 'chip--biru' },
  kabar_warga: { label: 'Kabar Warga', chip: '' },
  teguran_kapus: { label: 'Teguran Kapus', chip: 'chip--merah' },
  pujian_kapus: { label: 'Pujian Kapus', chip: 'chip--daun' },
  karma: { label: 'Kabar Darurat', chip: 'chip--merah' },
  igd: { label: 'IGD', chip: 'chip--merah' },
  sistem: { label: 'Puskesmas', chip: 'chip--daun' },
  tutorial: { label: 'Panduan', chip: 'chip--biru' },
}

// CODEX ronde-13: `m.jenis` asing (save korup — inbox tak pernah divalidasi
// per-entri di save.ts) bikin `SURAT_META[jenis]` undefined → crash `.chip`.
// Fallback aman, bukan throw.
function metaSurat(jenis: JenisSurat): { label: string; chip: string } {
  return SURAT_META[jenis] ?? { label: 'Surat', chip: '' }
}

const LABEL_PERSONA: Record<Persona, string> = {
  polos: 'Polos',
  terpelajar: 'Terpelajar',
  skeptis: 'Skeptis',
  cemas: 'Cemas',
  lansia: 'Lansia',
  wali_anak: 'Wali anak',
}

const STEMPEL_GRADE: Record<string, string> = {
  A: 'stempel--hijau',
  B: 'stempel--biru',
  C: 'stempel--kunyit',
  D: 'stempel--merah',
}

/** Format desimal gaya Indonesia (koma). */
function fmt(nilai: number, digit = 1): string {
  return nilai.toFixed(digit).replace('.', ',')
}

interface SaranKunjungan {
  keluargaId: string
  nama: string
  rw: number
  alasan: string
  darurat: boolean
  binaan: boolean
  prioritas: number
}

interface Cta {
  label: string
  sub: string
  aksi: () => void
  sekunder?: { label: string; aksi: () => void; keterangan: string }
}

/* ---------------------------------------------------------------------------
 * Komponen
 * ------------------------------------------------------------------------- */

export function MejaKerja() {
  const state = useGame((s) => s.state)!
  const dispatch = useGame((s) => s.dispatch)
  const slots = useGame((s) => s.slots)
  const simpanKeSlot = useGame((s) => s.simpanKeSlot)

  const [suratTerbukaId, setSuratTerbukaId] = useState<string | null>(null)
  const [draftRefleksi, setDraftRefleksi] = useState('')
  // Audit CODEX UKM 2026-07-16 #3: TETAPKAN_PROGRAM kini WAJIB membawa rwFokus
  // (engine menolak tanpa RW). Pemilih RW lokal — default RW fokus tersimpan.
  const [rwPilihan, setRwPilihan] = useState<number | undefined>(state.program.rwFokus)

  // Draf refleksi mengikuti hari berjalan (draft lokal, dispatch saat blur/tidur
  // agar action-log tidak dibanjiri satu aksi per ketukan).
  useEffect(() => {
    setDraftRefleksi(state.refleksi[state.hari] ?? '')
  }, [state.hari]) // eslint-disable-line react-hooks/exhaustive-deps

  const petaTerbuka = state.hari >= HARI_BUKA_PETA
  const kunjunganTerbuka = state.hari >= HARI_BUKA_KUNJUNGAN
  const slotTerpakai = state.hasilKunjunganHariIni !== undefined || state.lapanganTerpakai
  const antrianN = state.klinik.antrian.length
  const suratBaru = state.inbox.filter((m) => !m.dibaca).length

  /* -- Kotak masuk ----------------------------------------------------------- */

  const suratUrut = useMemo(() => [...state.inbox].reverse(), [state.inbox])
  const suratTerbuka = suratTerbukaId ? (state.inbox.find((m) => m.id === suratTerbukaId) ?? null) : null

  const bukaSurat = (m: Surat) => {
    setSuratTerbukaId(m.id)
    if (!m.dibaca) dispatch({ type: 'BACA_SURAT', suratId: m.id })
  }

  /* -- Tas Kunjungan: saran keluarga prioritas + ALASAN ------------------------ */

  const saranKunjungan = useMemo<SaranKunjungan[]>(() => {
    if (!petaTerbuka) return []
    const daftar: SaranKunjungan[] = []
    for (const [id, kel] of Object.entries(state.desa.keluarga)) {
      const konten = PACK.keluarga[id]
      if (!konten || kel.arcSelesai) continue
      const iks = hitungIksKeluarga(kel)

      let alasan: string
      let prioritas: number
      let darurat = false
      // Gerbang provenance: peringatan karma hanya bila dokter sudah punya
      // data keluarga ini — dan tanpa hitung mundur presisi (dokter tidak
      // tahu kapan; ia hanya mendengar kabar dari kader).
      if (karmaTerlihat(kel, state.hari) && kel.karmaAktif) {
        alasan = 'Kader mendengar kondisinya memburuk — prioritaskan'
        prioritas = Math.max(0, kel.karmaAktif.jatuhTempoHari - state.hari)
        darurat = true
      } else if (kel.followUpHari !== undefined && kel.followUpHari <= state.hari) {
        alasan = 'Janji follow-up sudah jatuh tempo — perubahan perilaku butuh pendampingan'
        prioritas = 10
      } else if (iks === null) {
        alasan = 'Belum ada data terverifikasi — kunjungan pertama membuka profil keluarga'
        prioritas = 30
      } else if (iks < 0.5) {
        alasan = `IKS ${fmt(iks, 2)} (tidak sehat) — indikator PIS-PK banyak yang belum tuntas`
        prioritas = 20
      } else if (iks < 0.8) {
        alasan = `IKS ${fmt(iks, 2)} (pra-sehat) — tinggal satu-dua indikator lagi`
        prioritas = 40
      } else {
        continue
      }

      daftar.push({
        keluargaId: id,
        nama: konten.namaKeluarga,
        rw: konten.rw,
        alasan,
        darurat,
        binaan: state.desa.binaan.includes(id),
        prioritas,
      })
    }
    daftar.sort((a, b) => a.prioritas - b.prioritas)
    return daftar.slice(0, 3)
  }, [state.desa.keluarga, state.desa.binaan, state.hari, petaTerbuka])

  /* -- Refleksi & tidur --------------------------------------------------------- */

  const simpanRefleksi = () => {
    if (state.blok !== 'sore') return
    if (draftRefleksi === (state.refleksi[state.hari] ?? '')) return
    dispatch({ type: 'TULIS_REFLEKSI', teks: draftRefleksi })
  }

  const tidur = () => {
    simpanRefleksi()
    dispatch({ type: 'LANJUTKAN' })
  }

  // CODEX audit UI/UX 2026-07-10 (#16e): single-select dengan opsi bisa
  // TERKUNCI individual (lihat useRadioGroup.ts baris 10-14) — role+aria-checked
  // saja, tanpa groupProps/roving penuh (lock membuat roving degenerate). `''`
  // sbg fallback (pola sama DeckDisposisi rsTerpilih): belum ada fokus dipilih
  // → tak satu pun opsi boleh aria-checked="true".
  const programRadio = useRadioGroup<string>(
    OPSI_PROGRAM,
    state.program.fokus ?? '',
    (f) => {
      if (rwPilihan === undefined) return // #3: engine menolak tanpa rwFokus
      dispatch({ type: 'TETAPKAN_PROGRAM', fokus: f as FokusProgram, rwFokus: rwPilihan })
    },
  )

  // M10.5 #15: siklus laporan/program diskalakan per mode — jangan literal 30.
  const periodeProgram = Math.ceil(state.hari / SIKLUS_LAPORAN_BULANAN[state.mode])
  const programTerkunci = state.program.periodeDitetapkan === periodeProgram

  /* -- Langkah berikutnya (tombol LANJUTKAN besar, label dinamis) ---------------- */

  const cta = ((): Cta => {
    // M4.5 — stase berakhir: skor terkunci, LANJUTKAN ditolak engine.
    if (state.tamat) {
      return {
        label: `Stase Selesai — Grade ${state.tamat.grade}`,
        sub:
          state.mode === 'ujian'
            ? 'Skor ujianmu terkunci dan siap disetorkan. Buka Laporan Akhir Stase.'
            : 'Sembilan puluh hari tuntas. Buka Laporan Akhir Stase.',
        aksi: () => dispatch({ type: 'PINDAH_LAYAR', layar: 'laporan' }),
      }
    }
    if (state.blok === 'pagi') {
      if (antrianN > 0 && state.stamina > 0) {
        return {
          label: 'Buka Klinik →',
          sub: `${antrianN} pasien menunggu di poli. Tiap pasien memakai 1 stamina.`,
          aksi: () => dispatch({ type: 'PINDAH_LAYAR', layar: 'klinik' }),
          sekunder: {
            label: `Serahkan ${antrianN} pasien ke insting, lanjut ke siang`,
            aksi: () => dispatch({ type: 'LANJUTKAN' }),
            keterangan: 'Pasien yang dilewati di-auto-resolve — hasil buruknya bisa kembali lewat surat.',
          },
        }
      }
      if (antrianN > 0) {
        return {
          label: petaTerbuka ? 'Ke Lapangan →' : 'Lanjut ke Siang →',
          sub: `Stamina habis — ${antrianN} pasien tersisa akan ditangani mengikuti insting.`,
          aksi: () => dispatch({ type: 'LANJUTKAN' }),
        }
      }
      return {
        label: petaTerbuka ? 'Ke Lapangan →' : 'Lanjut ke Siang →',
        sub: petaTerbuka
          ? 'Poli tuntas. Siang: satu slot kegiatan lapangan menantimu.'
          : 'Poli tuntas. Peta Desa terbuka besok — hari ini fokus klinik dulu.',
        aksi: () => dispatch({ type: 'LANJUTKAN' }),
      }
    }

    if (state.blok === 'siang') {
      if (kunjunganTerbuka && !slotTerpakai && state.stamina > 0) {
        return {
          label: 'Buka Peta Desa →',
          sub: 'Satu slot lapangan tersedia — pilih keluarga yang paling membutuhkanmu.',
          aksi: () => dispatch({ type: 'PINDAH_LAYAR', layar: 'peta' }),
          sekunder: {
            label: 'Lewati slot lapangan, lanjut ke sore',
            aksi: () => dispatch({ type: 'LANJUTKAN' }),
            keterangan: 'Keluarga berisiko yang terus diabaikan bisa memburuk — kabarnya sampai lewat surat.',
          },
        }
      }
      return {
        label: 'Lanjut ke Sore →',
        sub: slotTerpakai
          ? 'Kunjungan hari ini selesai — saatnya kembali ke meja kerja.'
          : !kunjunganTerbuka
            ? `Kunjungan rumah terbuka di Hari ${HARI_BUKA_KUNJUNGAN}. Sore: debrief & refleksi.`
            : 'Stamina habis — istirahatkan kakimu, besok masih panjang.',
        aksi: () => dispatch({ type: 'LANJUTKAN' }),
      }
    }

    return {
      label: 'Tidur',
      sub: `Akhiri Hari ${state.hari}. Refleksimu tersimpan; progres di-autosave saat tidur.`,
      aksi: tidur,
    }
  })()

  /* -- Debrief sore & rekap slice ------------------------------------------------ */

  const debrief = state.blok === 'sore' ? ringkasanHarian(state) : null
  // Modal rekap dikendalikan flag engine — TUTUP_REKAP mem-false-kan permanen.
  const tampilkanRekap = Boolean(state.flags['rekapSlice'])
  const skorRekap = tampilkanRekap ? hitungSkor(state) : null
  // Lokakarya Mini bulanan (M2.11) — rapor formatif + ghost rival dr. Ratih.
  // M10.5 #15 (2026-07-12): hari trigger diskalakan per mode (reducer.ts) —
  // cek flag dinamis, bukan literal 'lokmin31'/'lokmin61' (tak pernah nyala
  // di mode Ujian yang kini memakai hari 11/21).
  const siklusLokmin = SIKLUS_LAPORAN_BULANAN[state.mode]
  const tampilkanLokmin =
    !tampilkanRekap &&
    Boolean(state.flags[`lokmin${siklusLokmin + 1}`] || state.flags[`lokmin${siklusLokmin * 2 + 1}`]) &&
    !state.flags['lokminDitutup']
  const skorLokmin = tampilkanLokmin ? hitungSkor(state) : null

  // CODEX M10.a ronde-4 (dossier §44): kedua modal ini WAJIB-diselesaikan by
  // design (satu tombol "Lanjutkan Stase →", tanpa backdrop-dismiss) — trap
  // fokus TANPA `onEscape` menghormati itu; Escape tak boleh jadi jalan keluar
  // yang penulis sengaja tiadakan. tampilkanRekap/tampilkanLokmin mutually
  // exclusive (lihat guard di atas), aman dipasang berdampingan.
  const refRekap = useFocusTrap<HTMLDivElement>(tampilkanRekap)
  const refLokmin = useFocusTrap<HTMLDivElement>(tampilkanLokmin)

  /* ------------------------------------------------------------------------- */

  return (
    <div className="mk">
      {/* ================= KIRI — KOTAK MASUK ================= */}
      <section className="mk__kolom mk__inbox kertas">
        <header className="mk__inbox-header">
          <h2 className="judul-seksi">
            Kotak Masuk
            {suratBaru > 0 && <span className="chip chip--kunyit">{suratBaru} baru</span>}
          </h2>
        </header>

        {suratTerbuka ? (
          <article className="mk__surat-detail" key={suratTerbuka.id}>
            <button className="tombol tombol--senyap mk__surat-kembali" onClick={() => setSuratTerbukaId(null)}>
              ← Kotak Masuk
            </button>
            <div className="mk__surat-kertas kertas">
              <div className="baris baris--antara mk__surat-meta">
                <span className={`chip ${metaSurat(suratTerbuka.jenis).chip}`}>
                  {metaSurat(suratTerbuka.jenis).label}
                </span>
                <span className="mono teks-xs teks-lembut">Hari {suratTerbuka.hari}</span>
              </div>
              <h3 className="mk__surat-judul">{suratTerbuka.judul}</h3>
              <p className="mk__surat-dari teks-kecil teks-lembut">Dari: {suratTerbuka.dari}</p>
              <div className="mk__surat-garis" />
              <p className="mk__surat-isi">{suratTerbuka.isi}</p>
              {suratTerbuka.kaitKeluargaId && (
                <button
                  className="tombol mk__surat-kait"
                  onClick={() => dispatch({ type: 'PINDAH_LAYAR', layar: 'peta' })}
                  disabled={!petaTerbuka}
                  title={
                    petaTerbuka
                      ? 'Buka Peta Desa untuk melihat keluarga ini'
                      : 'Peta Desa terbuka besok'
                  }
                >
                  Lihat keluarga di Peta Desa →
                </button>
              )}
            </div>
          </article>
        ) : (
          <div className="mk__surat-daftar">
            {suratUrut.length === 0 && (
              <p className="mk__kosong teks-lembut teks-kecil">Kotak masukmu kosong. Nikmati sepinya — tidak akan lama.</p>
            )}
            {suratUrut.map((m) => (
              <button
                key={m.id}
                className={`mk__surat-item kartu kartu--klik ${m.dibaca ? '' : 'mk__surat-item--baru'}`}
                onClick={() => bukaSurat(m)}
              >
                <div className="baris baris--antara">
                  <span className={`chip ${metaSurat(m.jenis).chip}`}>{metaSurat(m.jenis).label}</span>
                  <span className="mono teks-xs teks-lembut">Hari {m.hari}</span>
                </div>
                <span className="mk__surat-item-judul">
                  {!m.dibaca && <span className="mk__titik-baru" aria-label="belum dibaca" />}
                  {m.judul}
                </span>
                <span className="teks-xs teks-lembut">{m.dari}</span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ================= TENGAH — KARTU KONTEKS BLOK ================= */}
      <section className="mk__kolom mk__konteks">
        {state.blok === 'pagi' && (
          <div className="mk__panel kertas">
            <h2 className="judul-seksi">Briefing Pagi — Hari {state.hari}</h2>

            <h3 className="mk__sub-judul mono">ANTRIAN POLI HARI INI</h3>
            {antrianN === 0 ? (
              <p className="mk__kosong teks-lembut teks-kecil">
                {state.klinik.selesaiHariIni.length > 0
                  ? 'Semua pasien playable sudah kamu tangani. Kerja bagus.'
                  : 'Belum ada pasien playable pagi ini.'}
              </p>
            ) : (
              <div className="kolom mk__antrian">
                {state.klinik.antrian.map((p, i) => (
                  <div key={p.id} className="kartu mk__pasien">
                    <div className="baris baris--antara">
                      <span className="mk__pasien-nama">
                        <span className="mono teks-xs teks-lembut">{i + 1}.</span> {p.nama}
                        <span className="teks-kecil teks-lembut">
                          {' '}
                          · {formatUsia(p.usia, p.usiaBulan)} · {p.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                        </span>
                      </span>
                      <span className="baris mk__pasien-chip">
                        <span className="chip">{LABEL_PERSONA[p.persona]}</span>
                        <span className={`chip ${p.bpjs ? 'chip--daun' : 'chip--kunyit'}`}>
                          {p.bpjs ? 'BPJS' : 'Umum'}
                        </span>
                        {p.followUpDari !== undefined && <span className="chip chip--merah">Kembali</span>}
                      </span>
                    </div>
                    <p className="mk__pasien-keluhan">
                      {PACK.kasus[p.kasusId]?.keluhanUtamaOlehPendamping && (
                        <span className="teks-xs teks-lembut">Dituturkan pendamping: </span>
                      )}
                      “{PACK.kasus[p.kasusId]?.keluhanUtama ?? 'Keluhan akan jelas di ruang periksa.'}”
                    </p>
                  </div>
                ))}
              </div>
            )}

            <h3 className="mk__sub-judul mono">TAS KUNJUNGAN</h3>
            {!petaTerbuka ? (
              <p className="mk__kosong teks-lembut teks-kecil">
                Peta Desa terbuka di Hari {HARI_BUKA_PETA} — setelah itu, kader mulai mengirim data keluarga.
              </p>
            ) : saranKunjungan.length === 0 ? (
              <p className="mk__kosong teks-lembut teks-kecil">
                Belum ada keluarga yang mendesak. Pantau laporan kader di Kotak Masuk.
              </p>
            ) : (
              <div className="kolom mk__saran">
                {saranKunjungan.map((s) => (
                  <div key={s.keluargaId} className={`kartu mk__saran-item ${s.darurat ? 'mk__saran-item--darurat' : ''}`}>
                    <div className="baris baris--antara">
                      <span className="mk__saran-nama">{s.nama}</span>
                      <span className="baris mk__pasien-chip">
                        {s.binaan && <span className="chip chip--daun">Binaan</span>}
                        {s.darurat && <span className="chip chip--merah">PERLU PERHATIAN</span>}
                        <span className="chip">RW {s.rw}</span>
                      </span>
                    </div>
                    <p className="teks-kecil teks-lembut mk__saran-alasan">{s.alasan}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {state.blok === 'siang' && (
          <div className="mk__panel kertas">
            <h2 className="judul-seksi">Siang — Lapangan</h2>

            {slotTerpakai && state.hasilKunjunganHariIni ? (
              <div className="kartu mk__lapangan-status">
                <span
                  className={`stempel ${state.hasilKunjunganHariIni.berhasil ? 'stempel--hijau' : state.hasilKunjunganHariIni.diusir ? 'stempel--merah' : 'stempel--kunyit'}`}
                >
                  {state.hasilKunjunganHariIni.berhasil
                    ? 'Berhasil'
                    : state.hasilKunjunganHariIni.diusir
                      ? 'Diusir'
                      : 'Belum berbuah'}
                </span>
                <p className="mk__lapangan-narasi">
                  Kunjungan ke keluarga{' '}
                  {PACK.keluarga[state.hasilKunjunganHariIni.keluargaId]?.namaKeluarga ??
                    state.hasilKunjunganHariIni.keluargaId}{' '}
                  selesai. {state.hasilKunjunganHariIni.narasiPenutup}
                </p>
              </div>
            ) : !kunjunganTerbuka ? (
              <p className="mk__kosong teks-lembut teks-kecil">
                Kunjungan rumah terbuka di Hari {HARI_BUKA_KUNJUNGAN}. Untuk sekarang, siang adalah waktu
                mengenal desamu lewat laporan kader.
              </p>
            ) : (
              <>
                <p className="mk__pengingat">
                  Satu slot kegiatan lapangan tersedia. RW terpencil memakan stamina lebih banyak —
                  pertimbangkan jarak sebelum berangkat.
                </p>
                {saranKunjungan.length > 0 && (
                  <div className="kolom mk__saran">
                    {saranKunjungan.map((s) => (
                      <div key={s.keluargaId} className={`kartu mk__saran-item ${s.darurat ? 'mk__saran-item--darurat' : ''}`}>
                        <div className="baris baris--antara">
                          <span className="mk__saran-nama">{s.nama}</span>
                          <span className="baris mk__pasien-chip">
                            {s.binaan && <span className="chip chip--daun">Binaan</span>}
                            {s.darurat && <span className="chip chip--merah">PERLU PERHATIAN</span>}
                            <span className="chip">RW {s.rw}</span>
                          </span>
                        </div>
                        <p className="teks-kecil teks-lembut mk__saran-alasan">{s.alasan}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="baris mk__lapangan-aksi">
                  <button className="tombol" onClick={() => dispatch({ type: 'PINDAH_LAYAR', layar: 'peta' })}>
                    Buka Peta Desa — pilih kunjungan / Posyandu / KLB →
                  </button>
                  {state.hari >= HARI_BUKA_PROLANIS[state.mode] && state.prolanis.roster.length > 0 && (() => {
                    const berikut = state.prolanis.sesiBerikutHari
                    const belumWaktunya = berikut !== undefined && state.hari < berikut
                    return (
                      <button
                        className="tombol tombol--kunyit"
                        disabled={state.stamina < BIAYA_STAMINA_KEGIATAN || slotTerpakai || belumWaktunya}
                        title={
                          belumWaktunya
                            ? `Sesi bulan ini sudah digelar — berikutnya hari ke-${berikut}.`
                            : slotTerpakai
                              ? 'Slot lapangan hari ini sudah terpakai.'
                              : `Gelar sesi Prolanis (${state.prolanis.roster.length} peserta, ${BIAYA_STAMINA_KEGIATAN} stamina).`
                        }
                        onClick={() => dispatch({ type: 'MULAI_PROLANIS' })}
                      >
                        🩺 Gelar Sesi Prolanis ({state.prolanis.roster.length}){belumWaktunya ? ` — hari ke-${berikut}` : ''}
                      </button>
                    )
                  })()}
                </div>
              </>
            )}

            {/* Program wilayah agregat — Triase Anggaran bulanan, tak makan slot. */}
            {petaTerbuka && (
              <div className="kartu mk__program">
                <h3 className="judul-seksi">Program Wilayah (bulanan — Triase Anggaran)</h3>
                <p className="teks-xs teks-lembut">
                  Hanya SATU fokus terdanai sebulan penuh — pilih RW fokus dan programnya, lalu terima
                  area lain berisiko sampai Lokakarya Mini berikutnya. Fokus sebulan pada satu RW
                  melindungi keluarga di sana dari kemerosotan yang terjadi bila diabaikan — bukan sekadar angka.
                  {state.program.fokus
                    ? ` Fokus kini: ${LABEL_PROGRAM[state.program.fokus]}${
                        state.program.rwFokus !== undefined ? ` — RW ${state.program.rwFokus}` : ''
                      }.`
                    : ' Belum ada fokus ditetapkan.'}
                </p>
                {/* Audit CODEX UKM 2026-07-16 #3: pemilih RW fokus — dana program
                    diarahkan ke SATU RW; tanpa ini engine menolak TETAPKAN_PROGRAM. */}
                <div className="baris mk__program-opsi" role="group" aria-label="Pilih RW fokus program">
                  {PACK.rw.map((r) => (
                    <button
                      key={r.nomor}
                      className={`tombol ${rwPilihan === r.nomor ? 'tombol--utama' : ''}`}
                      aria-pressed={rwPilihan === r.nomor}
                      disabled={programTerkunci}
                      title={
                        programTerkunci
                          ? 'Fokus bulan ini sudah dikunci di Lokakarya Mini — ganti bulan depan.'
                          : `Arahkan dana program bulan ini ke RW ${r.nomor} — ${r.nama}.`
                      }
                      onClick={() => setRwPilihan(r.nomor)}
                    >
                      RW {r.nomor}
                    </button>
                  ))}
                </div>
                <div className="baris mk__program-opsi" role="radiogroup" aria-label="Program Wilayah bulanan">
                  {OPSI_PROGRAM.map((f) => {
                    // CODEX M14 #15: grup terkunci = fokus bulan ini sudah ditetapkan
                    // (opsi lain disabled). Saat BELUM terkunci, beri props radiogroup
                    // PENUH (roving tabindex + navigasi panah, pola W3C). Saat terkunci,
                    // roving ke opsi disabled degenerate → cukup role+aria-checked.
                    const terkunci = programTerkunci && state.program.fokus !== f
                    const rp = programRadio.radioProps(f)
                    const propsRadio = programTerkunci ? { role: rp.role, 'aria-checked': rp['aria-checked'] } : rp
                    return (
                      <button
                        key={f}
                        {...propsRadio}
                        className={`tombol ${state.program.fokus === f ? 'tombol--utama' : ''}`}
                        disabled={terkunci || rwPilihan === undefined}
                        title={
                          terkunci
                            ? 'Fokus bulan ini sudah dikunci di Lokakarya Mini — ganti bulan depan.'
                            : rwPilihan === undefined
                              ? 'Pilih RW fokus dulu.'
                              : undefined
                        }
                        onClick={() => {
                          if (rwPilihan !== undefined)
                            dispatch({ type: 'TETAPKAN_PROGRAM', fokus: f, rwFokus: rwPilihan })
                        }}
                      >
                        {LABEL_PROGRAM[f]}
                      </button>
                    )
                  })}
                </div>
                {programTerkunci && <p className="teks-xs teks-lembut">🔒 Terkunci untuk bulan ini.</p>}
              </div>
            )}

            {/* M4.21 — Pemulihan akhir pekan: tiap hari ke-7, memakai slot siang. */}
            {state.hari % 7 === 0 && !slotTerpakai && (
              <div className="kartu mk__program">
                <h3 className="judul-seksi">Akhir Pekan — Pemulihan Diri</h3>
                <p className="teks-xs teks-lembut">
                  Burnout {state.burnout}/100. Dokter yang tumbang tidak menolong siapa-siapa —
                  hari ini boleh untukmu sendiri (memakai slot lapangan).
                </p>
                <div className="baris mk__program-opsi">
                  <button
                    className="tombol"
                    title="Burnout −12."
                    onClick={() => dispatch({ type: 'PEMULIHAN', jenis: 'istirahat' })}
                  >
                    😴 Istirahat total
                  </button>
                  <button
                    className="tombol"
                    title="Burnout −9, besok stamina +1."
                    onClick={() => dispatch({ type: 'PEMULIHAN', jenis: 'olahraga' })}
                  >
                    🏃 Olahraga
                  </button>
                  <button
                    className="tombol"
                    title="Burnout −6, trust seluruh keluarga binaan +1."
                    onClick={() => dispatch({ type: 'PEMULIHAN', jenis: 'keluarga' })}
                  >
                    ☕ Silaturahmi desa
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {state.blok === 'sore' && debrief && (
          <div className="mk__panel kertas">
            <h2 className="judul-seksi">Debrief Malam — Hari {state.hari}</h2>

            <div className="baris mk__debrief-atas">
              <span className={`stempel ${STEMPEL_GRADE[debrief.grade] ?? 'stempel--kunyit'} mk__debrief-grade`}>
                {debrief.grade}
              </span>
              <div className="kolom mk__debrief-tally">
                <span className="teks-kecil">
                  Pasien tertangani: <strong className="mono">{state.klinik.selesaiHariIni.length}</strong>
                  {state.klinik.autoHariIni.jumlah > 0 && (
                    <span className="teks-lembut"> (+{state.klinik.autoHariIni.jumlah} auto)</span>
                  )}
                </span>
                {state.klinik.selesaiHariIni.length > 0 && (
                  <span className="baris mk__debrief-pasien">
                    {state.klinik.selesaiHariIni.map((p, i) => (
                      <span key={i} className="chip" title={p.kasusId}>
                        {p.pasienNama} · {p.grade}
                      </span>
                    ))}
                  </span>
                )}
              </div>
            </div>

            <ul className="mk__catatan">
              {debrief.catatan.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>

            {/* M4.18 — Gudang Obat: stok menipis + pengadaan (admin sore hari). */}
            {(() => {
              const menipis = Object.entries(state.gudang.stok)
                .filter(([, n]) => n <= 5)
                .sort((a, b) => a[1] - b[1])
              const dalamKirim = state.gudang.pesanan
              if (menipis.length === 0 && dalamKirim.length === 0) return null
              return (
                <div className="kartu mk__program">
                  <h3 className="judul-seksi">Gudang Obat</h3>
                  {menipis.length > 0 && (
                    <div className="kolom mk__gudang-daftar">
                      {menipis.slice(0, 6).map(([id, n]) => {
                        const o = PACK.obat[id]
                        if (!o) return null
                        const biaya = o.hargaBeli * 20
                        const sedangDipesan = dalamKirim.some((p) => p.obatId === id)
                        return (
                          <div key={id} className="baris baris--antara">
                            <span className="teks-xs">
                              {o.nama}{' '}
                              <span className={`chip ${n <= 0 ? 'chip--merah' : 'chip--kunyit'}`}>
                                {n <= 0 ? 'HABIS' : `sisa ${n}`}
                              </span>
                            </span>
                            <button
                              className="tombol"
                              disabled={sedangDipesan || state.kapitasi < biaya}
                              title={
                                sedangDipesan
                                  ? 'Sedang dalam pengiriman.'
                                  : state.kapitasi < biaya
                                    ? 'Kas tidak cukup.'
                                    : `Pesan 20 unit — Rp ${biaya.toLocaleString('id-ID')}, tiba 3 hari.`
                              }
                              onClick={() => dispatch({ type: 'PESAN_OBAT', obatId: id, jumlah: 20 })}
                            >
                              {sedangDipesan ? 'dikirim…' : `Pesan 20 (Rp ${Math.round(biaya / 1000)}k)`}
                            </button>
                          </div>
                        )
                      })}
                      {menipis.length > 6 && (
                        <span className="teks-xs teks-lembut">+{menipis.length - 6} item menipis lainnya.</span>
                      )}
                    </div>
                  )}
                  {dalamKirim.length > 0 && (
                    <p className="teks-xs teks-lembut">
                      🚚 Dalam pengiriman:{' '}
                      {dalamKirim
                        .map((p) => `${PACK.obat[p.obatId]?.nama ?? p.obatId} ×${p.jumlah} (tiba H${p.tibaHari})`)
                        .join(' · ')}
                    </p>
                  )}
                </div>
              )
            })()}

            {/* M5.25 — arsip manual: 3 slot di samping autosave. */}
            <h3 className="mk__sub-judul mono">ARSIP MANUAL</h3>
            <div className="baris mk__program-opsi">
              {(['slot1', 'slot2', 'slot3'] as const).map((slot) => {
                const info = slots.find((x) => x.slot === slot)
                return (
                  <button
                    key={slot}
                    className="tombol"
                    title={info ? `Timpa ${slot} (dr. ${info.namaDokter} · H${info.hari}).` : `Simpan ke ${slot}.`}
                    onClick={() => {
                      // CODEX audit UI/UX 2026-07-10 (#3): dulu tombol slot
                      // langsung menimpa arsip lama di slot itu tanpa jeda —
                      // title tooltip saja tak mencegah klik.
                      if (info && !window.confirm(`Timpa ${slot} (dr. ${info.namaDokter} · Hari ${info.hari})? Arsip lama di slot ini akan hilang.`)) return
                      void simpanKeSlot(slot).then((ok) => {
                        if (!ok) window.alert('Gagal menyimpan — periksa ruang disk atau izin folder save.')
                      })
                    }}
                  >
                    💾 {slot.replace('slot', 'Slot ')}
                    {info ? ` (H${info.hari})` : ''}
                  </button>
                )
              })}
            </div>

            <h3 className="mk__sub-judul mono">REFLEKSI HARI INI</h3>
            <textarea
              className="mk__refleksi tulis-tangan"
              value={draftRefleksi}
              onChange={(e) => setDraftRefleksi(e.target.value)}
              onBlur={simpanRefleksi}
              rows={4}
              placeholder="Apa yang kamu pelajari hari ini? Tulis dengan jujur — catatan ini untukmu sendiri."
            />
          </div>
        )}
      </section>

      {/* ================= KANAN — LANGKAH BERIKUTNYA ================= */}
      <section className="mk__kolom mk__langkah">
        <div className="mk__panel kertas mk__langkah-panel">
          <h2 className="judul-seksi">Langkah Berikutnya</h2>

          <dl className="mk__status mono">
            <div className="baris baris--antara">
              <dt>Stamina</dt>
              <dd>{state.stamina}/6</dd>
            </div>
            <div className="baris baris--antara">
              <dt>Antrian poli</dt>
              <dd>{antrianN}</dd>
            </div>
            <div className="baris baris--antara">
              <dt>Slot lapangan</dt>
              <dd>{!kunjunganTerbuka ? 'terkunci' : slotTerpakai ? 'terpakai' : 'tersedia'}</dd>
            </div>
            <div className="baris baris--antara">
              <dt>Surat baru</dt>
              <dd>{suratBaru}</dd>
            </div>
          </dl>

          <p className="mk__cta-sub teks-kecil teks-lembut">{cta.sub}</p>
          <button className="tombol tombol--utama tombol--besar mk__cta" onClick={cta.aksi}>
            {cta.label}
          </button>
          {cta.sekunder && (
            <button
              className="tombol tombol--senyap mk__cta-sekunder"
              onClick={cta.sekunder.aksi}
              title={cta.sekunder.keterangan}
            >
              {cta.sekunder.label}
            </button>
          )}
        </div>
      </section>

      {/* ================= MODAL REKAP SLICE (Hari 8) ================= */}
      {skorRekap && (
        <div className="overlay">
          <div ref={refRekap} className="modal mk__rekap" role="dialog" aria-modal="true" aria-label="Rapor Pekan Pertama">
            <h2 className="judul-seksi">Rapor Pekan Pertama — dr. {state.namaDokter}</h2>

            <div className="mk__rekap-atas">
              <span className={`stempel ${STEMPEL_GRADE[skorRekap.grade] ?? 'stempel--kunyit'} stempel--jatuh mk__rekap-grade`}>
                {skorRekap.grade} · {skorRekap.gradeLabel}
              </span>
              <span className="mk__rekap-total mono">
                {fmt(skorRekap.total)} <span className="teks-lembut">/ 100</span>
              </span>
            </div>

            <div className="mk__rekap-dimensi">
              {(
                [
                  { label: 'UKP — Klinik', nilai: skorRekap.ukp, maks: 35 },
                  { label: 'UKM — Desa', nilai: skorRekap.ukm, maks: 35 },
                  { label: 'Manajemen', nilai: skorRekap.manajemen, maks: 15 },
                  { label: 'Resiliensi', nilai: skorRekap.resiliensi, maks: 15 },
                ] as const
              ).map((d) => (
                <div key={d.label} className="kartu mk__rekap-kartu">
                  <div className="baris baris--antara">
                    <span className="teks-kecil">{d.label}</span>
                    <span className="mono teks-kecil">
                      {fmt(d.nilai)}/{d.maks}
                    </span>
                  </div>
                  <div className="meter">
                    <div
                      className={`meter__isi ${d.nilai / d.maks < 0.35 ? 'meter__isi--bahaya' : d.nilai / d.maks < 0.6 ? 'meter__isi--waspada' : ''}`}
                      style={{ width: `${Math.round((d.nilai / d.maks) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <dl className="mk__rekap-rincian mono teks-xs">
              <div className="baris baris--antara">
                <dt>Akurasi diagnosis</dt>
                <dd>{fmt(skorRekap.rincian.akurasiDiagnosis)}%</dd>
              </div>
              <div className="baris baris--antara">
                <dt>RRNS (rujukan non-spesialistik)</dt>
                <dd>{fmt(skorRekap.rincian.rrns)}%</dd>
              </div>
              <div className="baris baris--antara">
                <dt>Kalibrasi stempel</dt>
                <dd>{fmt(skorRekap.rincian.kalibrasi)}</dd>
              </div>
              <div className="baris baris--antara">
                <dt>IKS desa</dt>
                <dd>{fmt(skorRekap.rincian.iksDesa, 2)}</dd>
              </div>
              <div className="baris baris--antara">
                <dt>Kualitas MI</dt>
                <dd>{fmt(skorRekap.rincian.kualitasMi)}</dd>
              </div>
            </dl>

            <p className="mk__rekap-ajakan">
              Pekan pertamamu di Sukamaju selesai — dan stase masih panjang. Keluarga binaanmu
              menunggu kunjungan berikutnya, Buku Saku masih penuh siluet, dan setiap angka di
              rapor ini masih bisa kamu perbaiki. Teruskan praktikmu, Dokter.
            </p>

            <button
              className="tombol tombol--utama tombol--besar mk__rekap-tutup"
              onClick={() => dispatch({ type: 'TUTUP_REKAP' })}
            >
              Lanjutkan Stase →
            </button>
          </div>
        </div>
      )}

      {/* ================= LOKAKARYA MINI (Hari 31/61) ================= */}
      {skorLokmin && (
        <div className="overlay">
          <div ref={refLokmin} className="modal mk__rekap" role="dialog" aria-modal="true" aria-label="Lokakarya Mini — Evaluasi Bulan Ini">
            <h2 className="judul-seksi">Lokakarya Mini — Evaluasi Bulan Ini</h2>
            <div className="mk__rekap-atas">
              <span className={`stempel ${STEMPEL_GRADE[skorLokmin.grade] ?? 'stempel--kunyit'} stempel--jatuh mk__rekap-grade`}>
                {skorLokmin.grade} · {skorLokmin.gradeLabel}
              </span>
              <span className="mk__rekap-total mono">
                {fmt(skorLokmin.total)} <span className="teks-lembut">/ 100</span>
              </span>
            </div>

            {/* Ghost rival dr. Ratih — tekanan sosial tanpa multiplayer (data statis). */}
            <div className="kartu mk__lokmin-rival">
              <div className="baris baris--antara">
                <span className="teks-kecil">
                  <strong>dr. Ratih</strong> · Puskesmas tetangga
                </span>
                <span className="mono teks-kecil">{state.hari >= 61 ? '78' : '71'} / 100</span>
              </div>
              <p className="teks-xs teks-lembut">
                {skorLokmin.total >= (state.hari >= 61 ? 78 : 71)
                  ? 'Kamu unggul dari rekan seangkatanmu bulan ini. Jaga momentum — bulan depan lebih berat.'
                  : 'dr. Ratih sedikit di depanmu bulan ini. Lihat dimensi mana yang tertinggal, dan kejar.'}
              </p>
            </div>

            {/* Triase Anggaran (M2.10, DeepThink Q4): ongkos oportunitas EKSPLISIT —
                kluster aktif yang tak tersentuh fokus program bulan lalu. */}
            {(() => {
              const tercakup = state.program.fokus ? TARGET_KASUS_PROGRAM[state.program.fokus] : []
              const diabaikan = clusterAktif(state, PACK).filter((c) => !tercakup.includes(c.kasusId))
              if (diabaikan.length === 0) return null
              return (
                <div className="kartu mk__lokmin-rival mk__lokmin-ongkos">
                  <div className="teks-kecil">⚖️ Ongkos oportunitas bulan ini</div>
                  <p className="teks-xs teks-lembut">
                    Fokusmu ({state.program.fokus ? LABEL_PROGRAM[state.program.fokus] : 'belum ditetapkan'}) tak
                    menyentuh kluster berikut — kamu memilih membiarkannya demi program lain:
                  </p>
                  {diabaikan.map((c) => (
                    <p key={`${c.rw}_${c.kasusId}`} className="teks-xs">
                      <span className="chip chip--merah">RW {c.rw}</span>{' '}
                      {PACK.kasus[c.kasusId]?.nama ?? c.kasusId} — {c.jumlah} kasus dalam 14 hari terakhir.
                    </p>
                  ))}
                </div>
              )
            })()}

            <div className="mk__rekap-dimensi">
              {(
                [
                  { label: 'UKP — Klinik', nilai: skorLokmin.ukp, maks: 35 },
                  { label: 'UKM — Desa', nilai: skorLokmin.ukm, maks: 35 },
                  { label: 'Manajemen', nilai: skorLokmin.manajemen, maks: 15 },
                  { label: 'Resiliensi', nilai: skorLokmin.resiliensi, maks: 15 },
                ] as const
              ).map((d) => (
                <div key={d.label} className="kartu mk__rekap-kartu">
                  <div className="baris baris--antara">
                    <span className="teks-kecil">{d.label}</span>
                    <span className="mono teks-kecil">
                      {fmt(d.nilai)}/{d.maks}
                    </span>
                  </div>
                  <div className="meter">
                    <div
                      className={`meter__isi ${d.nilai / d.maks < 0.35 ? 'meter__isi--bahaya' : d.nilai / d.maks < 0.6 ? 'meter__isi--waspada' : ''}`}
                      style={{ width: `${Math.round((d.nilai / d.maks) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="mk__rekap-ajakan">
              Lokakarya Mini adalah rapat evaluasi bulanan Puskesmas. Angka ini formatif — belum
              nilai akhir. Pekan-pekan berikutnya masih bisa membalikkan keadaan.
            </p>

            <button
              className="tombol tombol--utama tombol--besar mk__rekap-tutup"
              onClick={() => dispatch({ type: 'TUTUP_LOKMIN' })}
            >
              Kembali Bertugas →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
