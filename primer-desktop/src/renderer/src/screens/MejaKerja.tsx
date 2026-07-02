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
import { hitungSkor, ringkasanHarian } from '@engine/director'
import { hitungIksKeluarga } from '@engine/pispk'
import {
  HARI_BUKA_PETA,
  HARI_BUKA_KUNJUNGAN,
  HARI_BUKA_PROLANIS,
  BIAYA_STAMINA_KEGIATAN,
} from '@engine/reducer'
import type { FokusProgram } from '@engine/state'
import { PACK } from '@content/index'
import { karmaTerlihat } from './peta/petaUtil'
import './MejaKerja.css'

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
  sistem: { label: 'Puskesmas', chip: 'chip--daun' },
  tutorial: { label: 'Panduan', chip: 'chip--biru' },
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

  const [suratTerbukaId, setSuratTerbukaId] = useState<string | null>(null)
  const [draftRefleksi, setDraftRefleksi] = useState('')

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
      if (karmaTerlihat(kel) && kel.karmaAktif) {
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

  /* -- Langkah berikutnya (tombol LANJUTKAN besar, label dinamis) ---------------- */

  const cta = ((): Cta => {
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
  const tampilkanLokmin =
    !tampilkanRekap && Boolean(state.flags['lokmin31'] || state.flags['lokmin61']) && !state.flags['lokminDitutup']
  const skorLokmin = tampilkanLokmin ? hitungSkor(state) : null

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
                <span className={`chip ${SURAT_META[suratTerbuka.jenis].chip}`}>
                  {SURAT_META[suratTerbuka.jenis].label}
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
                  <span className={`chip ${SURAT_META[m.jenis].chip}`}>{SURAT_META[m.jenis].label}</span>
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
                          · {p.usia} th · {p.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
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
                      <span className="mk__saran-nama">Keluarga {s.nama}</span>
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
                          <span className="mk__saran-nama">Keluarga {s.nama}</span>
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
                  <button className="tombol tombol--utama" onClick={() => dispatch({ type: 'PINDAH_LAYAR', layar: 'peta' })}>
                    Buka Peta Desa — pilih kunjungan / Posyandu / KLB →
                  </button>
                  {state.hari >= HARI_BUKA_PROLANIS && state.prolanis.roster.length > 0 && (
                    <button
                      className="tombol tombol--kunyit"
                      disabled={state.stamina < BIAYA_STAMINA_KEGIATAN || slotTerpakai}
                      title={slotTerpakai ? 'Slot lapangan hari ini sudah terpakai.' : `Gelar sesi Prolanis (${state.prolanis.roster.length} peserta, ${BIAYA_STAMINA_KEGIATAN} stamina).`}
                      onClick={() => dispatch({ type: 'MULAI_PROLANIS' })}
                    >
                      🩺 Gelar Sesi Prolanis ({state.prolanis.roster.length})
                    </button>
                  )}
                </div>
              </>
            )}

            {/* Program wilayah agregat — instruksi mingguan, tak makan slot. */}
            {petaTerbuka && (
              <div className="kartu mk__program">
                <div className="judul-seksi">Program Wilayah (mingguan)</div>
                <p className="teks-xs teks-lembut">
                  Fokus program menekan penularan & menaikkan IKS sepanjang pekan — tanpa memakai slot siang.
                  {state.program.fokus ? ` Fokus kini: ${LABEL_PROGRAM[state.program.fokus]}.` : ' Belum ada fokus ditetapkan.'}
                </p>
                <div className="baris mk__program-opsi">
                  {(['psn', 'phbs', 'skrining'] as const).map((f) => (
                    <button
                      key={f}
                      className={`tombol ${state.program.fokus === f ? 'tombol--utama' : ''}`}
                      onClick={() => dispatch({ type: 'TETAPKAN_PROGRAM', fokus: f })}
                    >
                      {LABEL_PROGRAM[f]}
                    </button>
                  ))}
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

            <h3 className="mk__sub-judul mono">REFLEKSI HARI INI</h3>
            <textarea
              className="mk__refleksi tulis-tangan"
              value={draftRefleksi}
              onChange={(e) => setDraftRefleksi(e.target.value)}
              onBlur={simpanRefleksi}
              rows={4}
              placeholder="Apa yang kamu pelajari hari ini? Tulis dengan jujur — catatan ini untukmu sendiri."
            />

            <button className="tombol tombol--utama tombol--besar mk__tidur" onClick={tidur}>
              Tidur — Akhiri Hari {state.hari}
            </button>
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
          <div className="modal mk__rekap">
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
          <div className="modal mk__rekap">
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
